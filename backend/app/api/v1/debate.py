import json
import asyncio
from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.database.session import get_db, AsyncSessionLocal
from app.models.entities import DebateSession, DiagnosisSession, SessionEvent
from app.schemas.debate import DebateSessionResponse, DebateRoundResponse, ObjectionResponse
from app.orchestration.debate_controller import DebateController

router = APIRouter(prefix="/debates", tags=["Debate Orchestrator"])

# In-memory pub/sub queues for live SSE subscribers: debate_id -> set of asyncio.Queue
active_subscribers: Dict[str, List[asyncio.Queue]] = {}


def broadcast_event(debate_id: str, event_data: Dict[str, Any]):
    if debate_id in active_subscribers:
        for q in list(active_subscribers[debate_id]):
            try:
                q.put_nowait(event_data)
            except Exception:
                pass


async def run_debate_background(debate_id: str):
    async with AsyncSessionLocal() as session:
        def callback(event_type: str, data: Dict[str, Any]):
            broadcast_event(debate_id, data)

        controller = DebateController(session, debate_id, event_callback=callback)
        try:
            await controller.run_debate()
        except Exception as e:
            broadcast_event(debate_id, {"event_type": "session_failed", "error": str(e)})


@router.post("", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def create_debate_session(payload: Dict[str, Any], db: AsyncSession = Depends(get_db)):
    diagnosis_id = payload.get("diagnosis_id")
    if not diagnosis_id:
        raise HTTPException(status_code=400, detail="diagnosis_id is required")

    provider = payload.get("provider", "groq")

    # Check diagnosis exists and is confirmed
    result = await db.execute(select(DiagnosisSession).where(DiagnosisSession.id == diagnosis_id))
    diagnosis = result.scalar_one_or_none()
    if not diagnosis:
        raise HTTPException(status_code=404, detail="Diagnosis session not found")

    debate = DebateSession(
        diagnosis_id=diagnosis.id,
        status="created",
        current_round=1,
        max_rounds=3,
        active_provider=provider
    )
    db.add(debate)
    await db.commit()
    await db.refresh(debate)

    return {
        "debate_id": debate.id,
        "diagnosis_id": debate.diagnosis_id,
        "status": debate.status,
        "current_round": debate.current_round,
        "active_provider": debate.active_provider
    }


@router.post("/{debate_id}/start", response_model=Dict[str, Any])
async def start_debate(debate_id: str, background_tasks: BackgroundTasks, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(DebateSession).where(DebateSession.id == debate_id))
    debate = result.scalar_one_or_none()
    if not debate:
        raise HTTPException(status_code=404, detail="Debate session not found")

    if debate.status not in ("created", "failed"):
        return {"status": debate.status, "message": "Debate is already running or completed"}

    # Launch debate orchestration in background task
    background_tasks.add_task(run_debate_background, debate_id)

    debate.status = "starting"
    await db.commit()

    return {"debate_id": debate_id, "status": "starting", "message": "Debate orchestration started"}


@router.get("/{debate_id}", response_model=DebateSessionResponse)
async def get_debate_details(debate_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(DebateSession)
        .options(
            selectinload(DebateSession.rounds),
            selectinload(DebateSession.objections)
        )
        .where(DebateSession.id == debate_id)
    )
    debate = result.scalar_one_or_none()
    if not debate:
        raise HTTPException(status_code=404, detail="Debate session not found")

    rounds_resp = [
        DebateRoundResponse(
            round_number=r.round_number,
            closer_proposal=r.closer_proposal,
            skeptic_challenge=r.skeptic_challenge,
            closer_mitigations=r.closer_mitigations,
            evaluation_notes=r.evaluation_notes,
            created_at=r.created_at.isoformat()
        )
        for r in debate.rounds
    ]

    objections_resp = [
        ObjectionResponse(
            id=o.id,
            round_number=o.round_number,
            objection_code=o.objection_code,
            category=o.category,
            severity=o.severity,
            targeted_field=o.targeted_field,
            claim_challenged=o.claim_challenged,
            description=o.description,
            suggested_mitigation=o.suggested_mitigation,
            status=o.status,
            mitigation_text=o.mitigation_text,
            mitigation_evidence=o.mitigation_evidence,
            evaluation_reasoning=o.evaluation_reasoning
        )
        for o in debate.objections
    ]

    return DebateSessionResponse(
        id=debate.id,
        diagnosis_id=debate.diagnosis_id,
        status=debate.status,
        current_round=debate.current_round,
        max_rounds=debate.max_rounds,
        active_provider=debate.active_provider,
        error_message=debate.error_message,
        created_at=debate.created_at.isoformat(),
        completed_at=debate.completed_at.isoformat() if debate.completed_at else None,
        rounds=rounds_resp,
        objections=objections_resp
    )


@router.get("/{debate_id}/events")
async def stream_debate_events(debate_id: str, db: AsyncSession = Depends(get_db)):
    """Server-Sent Events (SSE) streaming endpoint."""
    # 1. Fetch debate to confirm existence
    result = await db.execute(select(DebateSession).where(DebateSession.id == debate_id))
    debate = result.scalar_one_or_none()
    if not debate:
        raise HTTPException(status_code=404, detail="Debate not found")

    # 2. Replay all past stored events from DB
    past_events_result = await db.execute(
        select(SessionEvent)
        .where(SessionEvent.debate_id == debate_id)
        .order_by(SessionEvent.created_at)
    )
    past_events = past_events_result.scalars().all()

    queue: asyncio.Queue = asyncio.Queue()
    if debate_id not in active_subscribers:
        active_subscribers[debate_id] = []
    active_subscribers[debate_id].append(queue)

    async def event_generator():
        try:
            # Replay past events
            for ev in past_events:
                data = {"event_type": ev.event_type, "round_number": ev.round_number, **ev.payload}
                yield f"data: {json.dumps(data)}\n\n"

            # If debate is already completed or failed, close stream
            if debate.status in ("completed", "failed"):
                yield f"data: {json.dumps({'event_type': 'stream_closed', 'message': 'Debate finished'})}\n\n"
                return

            # Listen for new events
            while True:
                try:
                    event_data = await asyncio.wait_for(queue.get(), timeout=25.0)
                    yield f"data: {json.dumps(event_data)}\n\n"

                    if event_data.get("event_type") in ("debate_completed", "session_failed"):
                        yield f"data: {json.dumps({'event_type': 'stream_closed', 'message': 'Debate stream closed'})}\n\n"
                        break
                except asyncio.TimeoutError:
                    # Keep-alive heartbeat comment
                    yield ": ping\n\n"

        finally:
            if debate_id in active_subscribers and queue in active_subscribers[debate_id]:
                active_subscribers[debate_id].remove(queue)
                if not active_subscribers[debate_id]:
                    del active_subscribers[debate_id]

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

