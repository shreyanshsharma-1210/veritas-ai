import pytest
from app.schemas.diagnosis import DiagnosisCreate, BusinessContext, SaaSMetrics, ProblemSignals, Constraints, DesiredOutcome
from app.services.diagnosis_service import DiagnosisService


def create_sample_diagnosis(m1: float = 71.0, m3: float = 44.0, target: float = 52.0, eng: int = 3, budget: float = 10000.0) -> DiagnosisCreate:
    return DiagnosisCreate(
        title="Test Diagnosis",
        business_context=BusinessContext(
            company_name="Acme Analytics",
            industry="B2B SaaS"
        ),
        primary_objective="reduce_churn",
        metrics=SaaSMetrics(
            monthly_active_customers=1000,
            m1_retention_pct=m1,
            m3_retention_pct=m3,
            monthly_churn_rate_pct=5.0,
            cac=1000.0,
            arpu=150.0,
            ltv=3000.0
        ),
        problem_signals=ProblemSignals(
            leakage_point="Month 2 silent downgrade",
            drop_off_timing="Week 6 drop",
            suspected_causes=["Lack of adoption"],
            supporting_evidence="Analytics show zero logins"
        ),
        constraints=Constraints(
            engineering_headcount=eng,
            pm_headcount=1,
            design_bandwidth="limited",
            budget_usd=budget,
            timeline_weeks=8
        ),
        desired_outcome=DesiredOutcome(
            target_metric_name="Month-3 Retention",
            target_metric_value=target,
            target_timeline_weeks=8
        )
    )


def test_consistent_diagnosis_passes():
    diag = create_sample_diagnosis(m1=71.0, m3=44.0, target=52.0)
    result = DiagnosisService.validate_diagnosis(diag)
    assert result.is_consistent is True
    assert len([i for i in result.issues if i.severity == "error"]) == 0


def test_m3_higher_than_m1_fails_validation():
    # Impossible cohort decay: M3 (80%) > M1 (70%)
    diag = create_sample_diagnosis(m1=70.0, m3=80.0, target=85.0)
    result = DiagnosisService.validate_diagnosis(diag)
    assert result.is_consistent is False
    errors = [i for i in result.issues if i.severity == "error" and i.field == "metrics.m3_retention_pct"]
    assert len(errors) == 1
    assert "Cohort Inconsistency" in errors[0].message


def test_target_lower_than_baseline_fails():
    # Target (40%) <= Baseline M3 (44%)
    diag = create_sample_diagnosis(m1=71.0, m3=44.0, target=40.0)
    result = DiagnosisService.validate_diagnosis(diag)
    assert result.is_consistent is False
    errors = [i for i in result.issues if i.severity == "error" and i.field == "desired_outcome.target_metric_value"]
    assert len(errors) == 1


def test_zero_engineering_and_budget_fails():
    diag = create_sample_diagnosis(m1=71.0, m3=44.0, target=50.0, eng=0, budget=0.0)
    result = DiagnosisService.validate_diagnosis(diag)
    assert result.is_consistent is False
    errors = [i for i in result.issues if i.severity == "error" and i.field == "constraints.engineering_headcount"]
    assert len(errors) == 1

