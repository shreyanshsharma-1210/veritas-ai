from typing import Optional, List, Dict, Any, Literal
from pydantic import BaseModel, Field, field_validator, model_validator


class BusinessContext(BaseModel):
    company_name: str = Field(..., min_length=2, max_length=100)
    industry: str = Field(..., min_length=2, max_length=100)
    business_model: str = Field(default="B2B SaaS Subscription")
    stage: str = Field(default="Growth (Series A/B)")
    target_customer: str = Field(default="Mid-Market & Enterprise")


class SaaSMetrics(BaseModel):
    monthly_active_customers: int = Field(..., gt=0, description="Active account count")
    m1_retention_pct: float = Field(..., ge=0.0, le=100.0, description="Month 1 cohort retention rate")
    m3_retention_pct: float = Field(..., ge=0.0, le=100.0, description="Month 3 cohort retention rate")
    monthly_churn_rate_pct: float = Field(..., ge=0.0, le=100.0, description="Average monthly customer churn")
    cac: float = Field(..., ge=0.0, description="Customer Acquisition Cost ($)")
    arpu: float = Field(..., ge=0.0, description="Average Monthly Revenue Per User ($)")
    ltv: Optional[float] = Field(default=None, description="Customer Lifetime Value ($)")

    @field_validator("m1_retention_pct", "m3_retention_pct", "monthly_churn_rate_pct")
    @classmethod
    def validate_percentages(cls, v: float) -> float:
        if not (0.0 <= v <= 100.0):
            raise ValueError("Percentage metrics must be between 0 and 100.")
        return round(v, 2)


class ProblemSignals(BaseModel):
    leakage_point: str = Field(..., min_length=5, description="Specific cohort period or touchpoint where drop occurs")
    drop_off_timing: str = Field(..., min_length=3, description="Observed week or behavior change timing")
    suspected_causes: List[str] = Field(default_factory=list, description="Hypothesized reasons for degradation")
    supporting_evidence: str = Field(..., min_length=5, description="Telemetry, survey, or account telemetry observed")


class Constraints(BaseModel):
    engineering_headcount: int = Field(default=2, ge=0)
    pm_headcount: int = Field(default=1, ge=0)
    design_bandwidth: Literal["limited", "moderate", "high"] = "limited"
    budget_usd: float = Field(default=10000.0, ge=0.0)
    timeline_weeks: int = Field(default=8, gt=0, le=52)


class DesiredOutcome(BaseModel):
    target_metric_name: str = Field(default="Month-3 Retention")
    target_metric_value: float = Field(..., ge=0.0, le=100.0)
    target_timeline_weeks: int = Field(default=8, gt=0)


class ValidationIssue(BaseModel):
    field: str
    severity: Literal["error", "warning", "info"]
    message: str
    suggested_fix: Optional[str] = None


class ValidationResult(BaseModel):
    is_consistent: bool
    issues: List[ValidationIssue]
    summary: str


class DiagnosisCreate(BaseModel):
    title: Optional[str] = "SaaS Retention & Churn Diagnosis"
    business_context: BusinessContext
    primary_objective: str = "reduce_post_activation_churn"
    metrics: SaaSMetrics
    problem_signals: ProblemSignals
    constraints: Constraints
    desired_outcome: DesiredOutcome


class DiagnosisResponse(BaseModel):
    id: str
    title: str
    status: str
    business_context: Dict[str, Any]
    primary_objective: str
    metrics: Dict[str, Any]
    problem_signals: Dict[str, Any]
    constraints: Dict[str, Any]
    desired_outcome: Dict[str, Any]
    is_consistent: bool
    validation_issues: List[Dict[str, Any]]
    created_at: str
    updated_at: str

