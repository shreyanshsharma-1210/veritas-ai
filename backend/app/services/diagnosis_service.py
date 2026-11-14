from typing import List, Dict, Any, Tuple
from app.schemas.diagnosis import DiagnosisCreate, ValidationIssue, ValidationResult


class DiagnosisService:
    @staticmethod
    def validate_diagnosis(data: DiagnosisCreate) -> ValidationResult:
        issues: List[ValidationIssue] = []
        metrics = data.metrics
        constraints = data.constraints
        desired = data.desired_outcome

        # Rule 1: Cohort decay law: M3 retention cannot exceed M1 retention
        if metrics.m3_retention_pct > metrics.m1_retention_pct:
            issues.append(ValidationIssue(
                field="metrics.m3_retention_pct",
                severity="error",
                message=f"Cohort Inconsistency: Month-3 retention ({metrics.m3_retention_pct}%) cannot exceed Month-1 retention ({metrics.m1_retention_pct}%). Cohort customer counts decay or stay flat over time; they do not increase without reactivation/expansion accounting.",
                suggested_fix="Ensure M3 retention is equal to or lower than M1 retention (e.g., M1: 71%, M3: 44%)."
            ))

        # Rule 2: Target must exceed baseline
        if desired.target_metric_value <= metrics.m3_retention_pct:
            issues.append(ValidationIssue(
                field="desired_outcome.target_metric_value",
                severity="error",
                message=f"Target Objective Inconsistency: Desired target ({desired.target_metric_value}%) is less than or equal to current baseline ({metrics.m3_retention_pct}%).",
                suggested_fix=f"Set a target higher than your current baseline {metrics.m3_retention_pct}% (e.g., 50% - 55%)."
            ))

        # Rule 3: Extreme target lift sanity check
        if desired.target_metric_value - metrics.m3_retention_pct > 30.0:
            issues.append(ValidationIssue(
                field="desired_outcome.target_metric_value",
                severity="warning",
                message=f"Aggressive Target: A +{round(desired.target_metric_value - metrics.m3_retention_pct, 1)}pt retention jump in {constraints.timeline_weeks} weeks is statistically aggressive without prior experimental benchmark.",
                suggested_fix="Consider targeting a 6-12pt incremental pilot improvement before scaling."
            ))

        # Rule 4: Unit economics deficit check (CAC vs LTV)
        if metrics.ltv is not None and metrics.cac > metrics.ltv:
            issues.append(ValidationIssue(
                field="metrics.cac",
                severity="warning",
                message=f"Negative Unit Economics: CAC (${metrics.cac:,.0f}) exceeds reported LTV (${metrics.ltv:,.0f}). Retention initiatives must be capital-efficient to avoid accelerating cash burn.",
                suggested_fix="Verify whether payback window can support additional retention instrumentation."
            ))

        # Rule 5: Resource bottleneck check
        if constraints.engineering_headcount == 0 and constraints.budget_usd < 1000:
            issues.append(ValidationIssue(
                field="constraints.engineering_headcount",
                severity="error",
                message="Zero Engineering Bandwidth: Interventions requiring product telemetry or in-app triggers require at least 0.5 dedicated engineer or SaaS integration budget.",
                suggested_fix="Allocate minimum 1 part-time engineer or dedicated tooling budget."
            ))

        # Rule 6: Design constraint check
        if constraints.design_bandwidth == "limited" and constraints.timeline_weeks < 4:
            issues.append(ValidationIssue(
                field="constraints.design_bandwidth",
                severity="warning",
                message="Design Bottleneck: Limited design bandwidth with a timeline under 4 weeks suggests reusing existing notification and modal UI primitives rather than custom redesigns.",
                suggested_fix="Ensure intervention plans explicitly restrict UI scope to existing design system tokens."
            ))

        # Determine overall consistency: True if no 'error' severity issues exist
        has_errors = any(issue.severity == "error" for issue in issues)
        is_consistent = not has_errors

        summary = (
            "Diagnosis data passed all consistency checks and is verified for agent debate."
            if is_consistent
            else f"Diagnosis contains {len([i for i in issues if i.severity == 'error'])} critical inconsistency that must be resolved before Closer AI proposal generation."
        )

        return ValidationResult(
            is_consistent=is_consistent,
            issues=issues,
            summary=summary
        )

    @staticmethod
    def get_canonical_demo_scenario() -> Dict[str, Any]:
        """
        Returns the canonical SaaS Month-3 Customer Retention scenario
        specified in TRD.md and project-overview.md.
        """
        return {
            "title": "SaaS Post-Activation Month 3 Retention Diagnosis",
            "business_context": {
                "company_name": "CloudPulse Metrics",
                "industry": "B2B SaaS DevTools & Observability",
                "business_model": "Product-Led Tiered Subscription",
                "stage": "Series A ($4M ARR)",
                "target_customer": "Mid-Market Engineering Teams"
            },
            "primary_objective": "reduce_post_activation_churn",
            "metrics": {
                "monthly_active_customers": 1450,
                "m1_retention_pct": 71.0,
                "m3_retention_pct": 44.0,
                "monthly_churn_rate_pct": 5.8,
                "cac": 1250.0,
                "arpu": 180.0,
                "ltv": 3720.0
            },
            "problem_signals": {
                "leakage_point": "Silent downgrade and inactivity after Month 2 (Day 60)",
                "drop_off_timing": "Sharp decline in weekly active feature utilization after week 6",
                "suspected_causes": [
                    "Initial onboarding succeeds, but secondary team members fail to adopt team dashboards",
                    "No proactive re-engagement trigger when query volume starts tapering",
                    "Users reach activation milestone then stagnate without expansion guidance"
                ],
                "supporting_evidence": "Product analytics shows 62% of churned accounts had zero login events from team leads between day 45 and day 60 despite high usage in month 1."
            },
            "constraints": {
                "engineering_headcount": 3,
                "pm_headcount": 1,
                "design_bandwidth": "limited",
                "budget_usd": 12000.0,
                "timeline_weeks": 8
            },
            "desired_outcome": {
                "target_metric_name": "Month-3 Retention",
                "target_metric_value": 52.0,
                "target_timeline_weeks": 8
            }
        }

