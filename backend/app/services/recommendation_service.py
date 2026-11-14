import json
from typing import Dict, Any, List
from app.providers.base import LLMProvider
from app.agents.prompts import RECOMMENDATION_SYNTHESIS_SYSTEM_PROMPT
from app.calculations.metrics import compute_deterministic_impact_assessment
from app.models.entities import Recommendation, Objection


class RecommendationService:
    def __init__(self, provider: LLMProvider):
        self.provider = provider

    async def generate_recommendation_data(
        self,
        diagnosis_data: Dict[str, Any],
        final_proposal: Dict[str, Any],
        objections: List[Objection],
        total_rounds: int
    ) -> Dict[str, Any]:
        # Categorize objections deterministically
        resolved_risks = [
            {
                "code": obj.objection_code,
                "category": obj.category,
                "severity": obj.severity,
                "description": obj.description,
                "mitigation": obj.mitigation_text or obj.suggested_mitigation,
                "evidence": obj.mitigation_evidence,
                "status": "mitigated"
            }
            for obj in objections if obj.status == "mitigated"
        ]

        partially_mitigated_risks = [
            {
                "code": obj.objection_code,
                "category": obj.category,
                "severity": obj.severity,
                "description": obj.description,
                "mitigation": obj.mitigation_text,
                "reasoning": obj.evaluation_reasoning,
                "status": "partially_mitigated"
            }
            for obj in objections if obj.status == "partially_mitigated"
        ]

        open_risks = [
            {
                "code": obj.objection_code,
                "category": obj.category,
                "severity": obj.severity,
                "description": obj.description,
                "unresolved_reason": obj.evaluation_reasoning or "Mitigation not verified or insufficient scope adjustment.",
                "status": "unresolved"
            }
            for obj in objections if obj.status in ("open", "unresolved")
        ]

        # Deterministic calculations
        metrics = diagnosis_data.get("metrics", {})
        constraints = diagnosis_data.get("constraints", {})
        desired = diagnosis_data.get("desired_outcome", {})

        active_customers = metrics.get("monthly_active_customers", 1000)
        baseline_m3 = metrics.get("m3_retention_pct", 44.0)
        target_m3 = final_proposal.get("target_metric_projected", desired.get("target_metric_value", 50.0))
        arpu = metrics.get("arpu", 150.0)
        budget = constraints.get("budget_usd", 10000.0)
        timeline = constraints.get("timeline_weeks", 8)

        impact_data = compute_deterministic_impact_assessment(
            active_customers=active_customers,
            baseline_m3=baseline_m3,
            target_m3=target_m3,
            arpu=arpu,
            budget_usd=budget,
            timeline_weeks=timeline
        )

        # Standard structured action plan
        action_plan = [
            {
                "step_number": 1,
                "title": "Instrument Telemetry & Usage Rollup",
                "description": "Deploy telemetry pipeline tracking weekly query volume and feature adoption triggers. Hook alerts to Day 21 sensor.",
                "owner_role": "Backend / Data Engineer",
                "timeline_week": "Week 1 - 2",
                "effort_level": "Medium (1.5 Eng)",
                "deliverable": "Automated usage degradation alert trigger live in staging"
            },
            {
                "step_number": 2,
                "title": "Configure In-App Milestone Checkpoint",
                "description": "Configure existing ModalCard component at Day 28 milestone to prompt team leads with contextual dashboard presets.",
                "owner_role": "Product Manager & Frontend Eng",
                "timeline_week": "Week 3 - 4",
                "effort_level": "Low (Reusing production UI tokens)",
                "deliverable": "Day 28 contextual prompt live behind feature flag"
            },
            {
                "step_number": 3,
                "title": "Launch 20% Cohort Pilot with Gating Gate",
                "description": "Launch intervention to 20% of new cohort. Track Day 35 leading engagement signals against control cohort.",
                "owner_role": "Growth PM & Analytics Lead",
                "timeline_week": "Week 4 - 6",
                "effort_level": "Low (Monitoring & cohort tracking)",
                "deliverable": "Statistical significance report on Day 35 engagement"
            },
            {
                "step_number": 4,
                "title": "Full Rollout or Parameter Re-evaluation",
                "description": "If pilot demonstrates >=3.0pt engagement lift, scale to 100% of accounts. Otherwise, adjust trigger sensitivity.",
                "owner_role": "VP Product / Engineering Lead",
                "timeline_week": "Week 7 - 8",
                "effort_level": "Medium (Scale deployment)",
                "deliverable": "100% cohort activation and leadership retention dashboard"
            }
        ]

        assumptions_to_verify = [
            {"assumption": "Accounts with multi-user adoption churn at half the rate of single-user accounts", "verification_method": "Historical cohort regression analysis", "priority": "High"},
            {"assumption": "Existing ModalCard v2 component supports dynamic copy props without layout shift", "verification_method": "Frontend component audit in staging", "priority": "Medium"},
            {"assumption": "Day 21 query velocity drop accurately predicts 60-day churn with >75% recall", "verification_method": "Backtesting on Q3 customer query logs", "priority": "High"}
        ]

        success_metrics = [
            {"metric": "Month-3 Retention Rate", "baseline": f"{baseline_m3}%", "target": f"{target_m3}%", "cadence": "Monthly cohort review"},
            {"metric": "Day 21 Re-engagement Response Rate", "baseline": "N/A (New)", "target": "35%", "cadence": "Weekly"},
            {"metric": "Annualized Recurring Revenue Gain", "baseline": "$0", "target": f"${impact_data['annualized_arr_gain_usd']:,.0f}", "cadence": "Quarterly"}
        ]

        executive_summary = (
            f"Veritas AI evaluated {diagnosis_data.get('business_context', {}).get('company_name', 'the business')}'s "
            f"retention challenge across {total_rounds} adversarial debate rounds. "
            f"The agreed strategy centers on a pilot-first Week-3/4 re-engagement checkpoint that projects a "
            f"+{impact_data['lift_percentage_points']}pt retention lift (from {baseline_m3}% to {target_m3}%), "
            f"generating an estimated ${impact_data['annualized_arr_gain_usd']:,.0f} in annualized retained ARR "
            f"with an estimated ROI of {impact_data['roi_percentage']}% on a ${budget:,.0f} budget. "
            f"{len(resolved_risks)} objections were resolved through structural scope concessions, "
            f"while {len(open_risks)} open risks are disclosed for ongoing operational vigilance."
        )

        return {
            "executive_summary": executive_summary,
            "recommended_strategy": final_proposal.get("title", "Strategic Retention Intervention"),
            "action_plan": action_plan,
            "deterministic_impact": impact_data,
            "resolved_risks": resolved_risks,
            "partially_mitigated_risks": partially_mitigated_risks,
            "open_risks": open_risks,
            "assumptions_to_verify": assumptions_to_verify,
            "confidence_score": 0.85 if not open_risks else 0.72,
            "success_metrics": success_metrics
        }

