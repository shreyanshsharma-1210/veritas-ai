from typing import Optional, List, Dict, Any, Literal
from pydantic import BaseModel, Field


class ProposalSchema(BaseModel):
    title: str = Field(..., description="Short title of the proposed strategic intervention")
    executive_summary: str = Field(..., description="Concise summary of the proposal")
    intervention_details: str = Field(..., description="Step-by-step mechanism of the intervention")
    expected_lift_pct: float = Field(..., description="Projected percentage point increase in target metric")
    target_metric_projected: float = Field(..., description="Projected final metric value")
    effort_summary: str = Field(..., description="Estimated engineering, design, and PM bandwidth required")
    timeline_weeks: int = Field(..., description="Execution timeline in weeks")
    key_assumptions: List[str] = Field(default_factory=list, description="Critical assumptions supporting the proposal")
    confidence_score: float = Field(default=0.75, ge=0.0, le=1.0, description="Closer's initial confidence score")


class RawObjectionItem(BaseModel):
    objection_code: str = Field(..., description="OBJ-1, OBJ-2, etc.")
    category: str = Field(..., description="data_integrity, financial_feasibility, resource_capacity, timeline, operational_feasibility")
    severity: Literal["low", "medium", "high", "critical"] = "medium"
    targeted_field: str = Field(..., description="Specific diagnosis field challenged, e.g. constraints.design_bandwidth")
    claim_challenged: str = Field(..., description="The specific claim made by Closer that is questionable")
    description: str = Field(..., description="Detailed adversarial critique")
    suggested_mitigation: str = Field(..., description="What concrete adjustment or evidence is required")


class SkepticChallengeSchema(BaseModel):
    summary: str = Field(..., description="Skeptic's opening executive assessment of proposal weaknesses")
    overall_risk_level: Literal["low", "medium", "high", "critical"] = "medium"
    objections: List[RawObjectionItem] = Field(..., min_length=1)


class RawMitigationItem(BaseModel):
    objection_code: str = Field(..., description="Code matching the objection being addressed")
    concession_or_defense: str = Field(..., description="Whether Closer scales back claim or defends it")
    concrete_mitigation: str = Field(..., description="Exact change made to proposal scope, timing, or telemetry")
    evidence_or_precedent: str = Field(..., description="Supporting logic or fallback safety net")
    revised_claim: Optional[str] = None


class CloserMitigationSchema(BaseModel):
    round_summary: str = Field(..., description="Closer's summary of adjustments made in response to Skeptic")
    mitigations: List[RawMitigationItem] = Field(..., min_length=1)


class EvaluationItem(BaseModel):
    objection_code: str
    status: Literal["mitigated", "partially_mitigated", "unresolved"]
    reasoning: str
    residual_risk_note: Optional[str] = None


class EvaluatorSchema(BaseModel):
    round_evaluations: List[EvaluationItem]
    round_summary: str
    should_terminate: bool
    termination_reason: Optional[str] = None


class DebateRoundResponse(BaseModel):
    round_number: int
    closer_proposal: Dict[str, Any]
    skeptic_challenge: Dict[str, Any]
    closer_mitigations: List[Dict[str, Any]]
    evaluation_notes: Optional[str] = None
    created_at: str


class ObjectionResponse(BaseModel):
    id: str
    round_number: int
    objection_code: str
    category: str
    severity: str
    targeted_field: str
    claim_challenged: str
    description: str
    suggested_mitigation: str
    status: str
    mitigation_text: Optional[str] = None
    mitigation_evidence: Optional[str] = None
    evaluation_reasoning: Optional[str] = None


class DebateSessionResponse(BaseModel):
    id: str
    diagnosis_id: str
    status: str
    current_round: int
    max_rounds: int
    active_provider: str
    error_message: Optional[str] = None
    created_at: str
    completed_at: Optional[str] = None
    rounds: List[DebateRoundResponse] = []
    objections: List[ObjectionResponse] = []

