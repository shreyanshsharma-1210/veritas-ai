from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database.session import get_db
from app.models.entities import Recommendation
from app.schemas.recommendation import RecommendationResponse

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@router.get("/{recommendation_id}", response_model=RecommendationResponse)
async def get_recommendation_by_id(recommendation_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Recommendation).where(Recommendation.id == recommendation_id))
    rec = result.scalar_one_or_none()
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")

    return RecommendationResponse(
        id=rec.id,
        debate_id=rec.debate_id,
        diagnosis_id=rec.diagnosis_id,
        executive_summary=rec.executive_summary,
        recommended_strategy=rec.recommended_strategy,
        action_plan=rec.action_plan,
        deterministic_impact=rec.deterministic_impact,
        resolved_risks=rec.resolved_risks,
        partially_mitigated_risks=rec.partially_mitigated_risks,
        open_risks=rec.open_risks,
        assumptions_to_verify=rec.assumptions_to_verify,
        confidence_score=rec.confidence_score,
        success_metrics=rec.success_metrics,
        created_at=rec.created_at.isoformat()
    )


@router.get("/by-debate/{debate_id}", response_model=RecommendationResponse)
async def get_recommendation_by_debate(debate_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Recommendation).where(Recommendation.debate_id == debate_id))
    rec = result.scalar_one_or_none()
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found for this debate")

    return RecommendationResponse(
        id=rec.id,
        debate_id=rec.debate_id,
        diagnosis_id=rec.diagnosis_id,
        executive_summary=rec.executive_summary,
        recommended_strategy=rec.recommended_strategy,
        action_plan=rec.action_plan,
        deterministic_impact=rec.deterministic_impact,
        resolved_risks=rec.resolved_risks,
        partially_mitigated_risks=rec.partially_mitigated_risks,
        open_risks=rec.open_risks,
        assumptions_to_verify=rec.assumptions_to_verify,
        confidence_score=rec.confidence_score,
        success_metrics=rec.success_metrics,
        created_at=rec.created_at.isoformat()
    )

