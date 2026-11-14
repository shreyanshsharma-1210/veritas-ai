import pytest
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.database.base import Base
from app.models.entities import DiagnosisSession, DebateSession, Recommendation
from app.services.diagnosis_service import DiagnosisService
from app.orchestration.debate_controller import DebateController


@pytest.mark.asyncio
async def test_full_debate_orchestration_lifecycle():
    # Setup in-memory SQLite database
    test_engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    async_session = async_sessionmaker(test_engine, expire_on_commit=False, class_=AsyncSession)

    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as db:
        # 1. Create Confirmed Diagnosis
        canonical_data = DiagnosisService.get_canonical_demo_scenario()
        diagnosis = DiagnosisSession(
            title=canonical_data["title"],
            status="confirmed",
            business_context=canonical_data["business_context"],
            primary_objective=canonical_data["primary_objective"],
            metrics=canonical_data["metrics"],
            problem_signals=canonical_data["problem_signals"],
            constraints=canonical_data["constraints"],
            desired_outcome=canonical_data["desired_outcome"],
            is_consistent=True
        )
        db.add(diagnosis)
        await db.commit()
        await db.refresh(diagnosis)

        # 2. Create DebateSession
        debate = DebateSession(
            diagnosis_id=diagnosis.id,
            status="created",
            current_round=1,
            max_rounds=3,
            active_provider="mock"
        )
        db.add(debate)
        await db.commit()
        await db.refresh(debate)

        # 3. Run Controller
        events_captured = []
        def event_listener(ev_type: str, payload: dict):
            events_captured.append((ev_type, payload))

        controller = DebateController(db, debate.id, event_callback=event_listener)
        completed_debate = await controller.run_debate()

        # 4. Verify Debate State
        assert completed_debate.status == "completed"
        assert completed_debate.completed_at is not None

        # 5. Verify Rounds and Objections
        result = await db.execute(
            select(DebateSession)
            .options(
                selectinload(DebateSession.rounds),
                selectinload(DebateSession.objections),
                selectinload(DebateSession.recommendation)
            )
            .where(DebateSession.id == debate.id)
        )
        refreshed = result.scalar_one()

        assert len(refreshed.rounds) >= 1
        assert len(refreshed.objections) >= 2
        for obj in refreshed.objections:
            assert obj.status in ("mitigated", "partially_mitigated", "unresolved")

        # 6. Verify Recommendation
        assert refreshed.recommendation is not None
        rec = refreshed.recommendation
        assert len(rec.action_plan) >= 3
        assert rec.deterministic_impact["lift_percentage_points"] > 0
        assert rec.deterministic_impact["annualized_arr_gain_usd"] > 0
        assert len(rec.resolved_risks) >= 1

        # 7. Verify Events Stream
        event_types = [e[0] for e in events_captured]
        assert "session_started" in event_types
        assert "proposal_created" in event_types
        assert "objections_created" in event_types
        assert "mitigations_created" in event_types
        assert "round_completed" in event_types
        assert "debate_completed" in event_types

