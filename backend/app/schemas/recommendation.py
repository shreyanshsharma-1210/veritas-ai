from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class ActionPlanItem(BaseModel):
    step_number: int
    title: str
    description: str
    owner_role: str
    timeline_week: str
    effort_level: str
    deliverable: str


class RecommendationResponse(BaseModel):
    id: str
    debate_id: str
    diagnosis_id: str
    executive_summary: str
    recommended_strategy: str
    action_plan: List[Dict[str, Any]]
    deterministic_impact: Dict[str, Any]
    resolved_risks: List[Dict[str, Any]]
    partially_mitigated_risks: List[Dict[str, Any]]
    open_risks: List[Dict[str, Any]]
    assumptions_to_verify: List[Dict[str, Any]]
    confidence_score: float
    success_metrics: List[Dict[str, Any]]
    created_at: str

