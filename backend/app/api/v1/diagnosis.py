from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Dict, Any

from app.database.session import get_db
from app.models.entities import DiagnosisSession
from app.schemas.diagnosis import DiagnosisCreate, DiagnosisResponse, ValidationResult
from app.services.diagnosis_service import DiagnosisService

router = APIRouter(prefix="/diagnosis", tags=["Diagnosis"])


@router.get("/demo/canonical", response_model=Dict[str, Any])
async def get_canonical_demo():
    """Returns canonical SaaS Month-3 Retention scenario data for 1-click loading."""
    return DiagnosisService.get_canonical_demo_scenario()


@router.post("/sessions", response_model=DiagnosisResponse, status_code=status.HTTP_201_CREATED)
async def create_diagnosis(payload: DiagnosisCreate, db: AsyncSession = Depends(get_db)):
    """Validates inputs and creates a diagnosis session."""
    validation = DiagnosisService.validate_diagnosis(payload)

    db_session = DiagnosisSession(
        title=payload.title or "SaaS Retention Diagnosis",
        status="validated" if validation.is_consistent else "draft",
        business_context=payload.business_context.model_dump(),
        primary_objective=payload.primary_objective,
        metrics=payload.metrics.model_dump(),
        problem_signals=payload.problem_signals.model_dump(),
        constraints=payload.constraints.model_dump(),
        desired_outcome=payload.desired_outcome.model_dump(),
        is_consistent=validation.is_consistent,
        validation_issues=[i.model_dump() for i in validation.issues],
        raw_answers=payload.model_dump()
    )

    db.add(db_session)
    await db.commit()
    await db.refresh(db_session)

    return DiagnosisResponse(
        id=db_session.id,
        title=db_session.title,
        status=db_session.status,
        business_context=db_session.business_context,
        primary_objective=db_session.primary_objective,
        metrics=db_session.metrics,
        problem_signals=db_session.problem_signals,
        constraints=db_session.constraints,
        desired_outcome=db_session.desired_outcome,
        is_consistent=db_session.is_consistent,
        validation_issues=db_session.validation_issues,
        created_at=db_session.created_at.isoformat(),
        updated_at=db_session.updated_at.isoformat()
    )


@router.get("/{session_id}", response_model=DiagnosisResponse)
async def get_diagnosis(session_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(DiagnosisSession).where(DiagnosisSession.id == session_id))
    db_session = result.scalar_one_or_none()
    if not db_session:
        raise HTTPException(status_code=404, detail="Diagnosis session not found")

    return DiagnosisResponse(
        id=db_session.id,
        title=db_session.title,
        status=db_session.status,
        business_context=db_session.business_context,
        primary_objective=db_session.primary_objective,
        metrics=db_session.metrics,
        problem_signals=db_session.problem_signals,
        constraints=db_session.constraints,
        desired_outcome=db_session.desired_outcome,
        is_consistent=db_session.is_consistent,
        validation_issues=db_session.validation_issues,
        created_at=db_session.created_at.isoformat(),
        updated_at=db_session.updated_at.isoformat()
    )


@router.post("/validate", response_model=ValidationResult)
async def validate_diagnosis_payload(payload: DiagnosisCreate):
    """Validates diagnosis data without persisting."""
    return DiagnosisService.validate_diagnosis(payload)


@router.post("/{session_id}/confirm", response_model=DiagnosisResponse)
async def confirm_diagnosis(session_id: str, db: AsyncSession = Depends(get_db)):
    """Confirms a validated diagnosis and marks it ready for agent debate."""
    result = await db.execute(select(DiagnosisSession).where(DiagnosisSession.id == session_id))
    db_session = result.scalar_one_or_none()
    if not db_session:
        raise HTTPException(status_code=404, detail="Diagnosis session not found")

    if not db_session.is_consistent:
        raise HTTPException(
            status_code=400,
            detail="Cannot confirm inconsistent diagnosis. Please resolve all validation errors first."
        )

    db_session.status = "confirmed"
    await db.commit()
    await db.refresh(db_session)

    return DiagnosisResponse(
        id=db_session.id,
        title=db_session.title,
        status=db_session.status,
        business_context=db_session.business_context,
        primary_objective=db_session.primary_objective,
        metrics=db_session.metrics,
        problem_signals=db_session.problem_signals,
        constraints=db_session.constraints,
        desired_outcome=db_session.desired_outcome,
        is_consistent=db_session.is_consistent,
        validation_issues=db_session.validation_issues,
        created_at=db_session.created_at.isoformat(),
        updated_at=db_session.updated_at.isoformat()
    )

