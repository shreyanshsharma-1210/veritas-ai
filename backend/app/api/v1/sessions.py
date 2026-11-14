from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List, Dict, Any

from app.database.session import get_db
from app.models.entities import DiagnosisSession, DebateSession, Recommendation

router = APIRouter(prefix="/sessions", tags=["Session History"])


@router.get("", response_model=List[Dict[str, Any]])
async def list_sessions(db: AsyncSession = Depends(get_db)):
    """Lists past diagnosis and debate sessions for workspace history."""
    result = await db.execute(
        select(DiagnosisSession)
        .order_by(desc(DiagnosisSession.created_at))
        .limit(50)
    )
    diagnoses = result.scalars().all()

    items = []
    for diag in diagnoses:
        # Check associated debates
        deb_result = await db.execute(
            select(DebateSession)
            .where(DebateSession.diagnosis_id == diag.id)
            .order_by(desc(DebateSession.created_at))
        )
        debates = deb_result.scalars().all()
        latest_debate = debates[0] if debates else None

        recommendation_id = None
        if latest_debate and latest_debate.status == "completed":
            rec_result = await db.execute(
                select(Recommendation).where(Recommendation.debate_id == latest_debate.id)
            )
            rec = rec_result.scalar_one_or_none()
            if rec:
                recommendation_id = rec.id

        items.append({
            "diagnosis_id": diag.id,
            "title": diag.title,
            "company_name": diag.business_context.get("company_name", "Unknown"),
            "status": diag.status,
            "primary_objective": diag.primary_objective,
            "m1_retention": diag.metrics.get("m1_retention_pct"),
            "m3_retention": diag.metrics.get("m3_retention_pct"),
            "created_at": diag.created_at.isoformat(),
            "latest_debate_id": latest_debate.id if latest_debate else None,
            "debate_status": latest_debate.status if latest_debate else None,
            "recommendation_id": recommendation_id
        })

    return items


@router.delete("/{session_id}", response_model=Dict[str, Any])
async def delete_session(session_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(DiagnosisSession).where(DiagnosisSession.id == session_id))
    diag = result.scalar_one_or_none()
    if not diag:
        raise HTTPException(status_code=404, detail="Session not found")

    await db.delete(diag)
    await db.commit()
    return {"deleted": True, "session_id": session_id}

