from typing import Type, TypeVar, Dict, Any
from pydantic import BaseModel
from app.providers.base import LLMProvider
from app.schemas.debate import (
    ProposalSchema,
    SkepticChallengeSchema,
    RawObjectionItem,
    CloserMitigationSchema,
    RawMitigationItem,
    EvaluatorSchema,
    EvaluationItem
)

T = TypeVar("T", bound=BaseModel)


class MockLLMProvider(LLMProvider):
    """
    Deterministic, context-aware mock provider for local development,
    demonstration workflows, and CI/CD testing without external API keys.
    """

    async def generate_structured(
        self,
        prompt: str,
        system_prompt: str,
        response_model: Type[T]
    ) -> T:
        prompt_lower = prompt.lower()
        system_lower = system_prompt.lower()

        # Closer Initial Proposal
        if response_model == ProposalSchema or "strategic proposer" in system_lower:
            data = {
                "title": "Targeted Week-4 Re-Engagement Checkpoint & Automated Query-Trend Alerts",
                "executive_summary": "Deploy an in-app contextual re-engagement checkpoint triggered at Day 28, paired with proactive telemetry alerts sent to team leads when query volume drops by >25% week-over-week.",
                "intervention_details": "1. Telemetry Hook: Instrument weekly query volume and dashboard logins. 2. Milestone Prompt: At Day 28, present team leads with tailored dashboard presets matching their original activation goal. 3. Re-activation Safety Net: Send an automated digest highlighting unused high-value features if zero activity occurs between Day 35 and 45.",
                "expected_lift_pct": 7.5,
                "target_metric_projected": 51.5,
                "effort_summary": "1 PM (specifications), 1.5 Engineers (telemetry pipeline & notification hook), 0.2 Designer (reusing existing notification components)",
                "timeline_weeks": 6,
                "key_assumptions": [
                    "Week 4 is early enough to catch accounts before the severe drop-off observed after week 6.",
                    "Existing notification modal infrastructure can be repurposed without custom design cycles.",
                    "Accounts with multi-user dashboard adoption churn at half the rate of single-user accounts."
                ],
                "confidence_score": 0.82
            }
            return response_model.model_validate(data)

        # Skeptic Challenge
        if response_model == SkepticChallengeSchema or "adversarial enterprise risk auditor" in system_lower:
            data = {
                "summary": "The proposal makes an optimistic assumption regarding the 7.5pt lift without precedent, and introduces a critical timing and bandwidth vulnerability.",
                "overall_risk_level": "medium",
                "objections": [
                    {
                        "objection_code": "OBJ-1",
                        "category": "evidence_quality",
                        "severity": "high",
                        "targeted_field": "desired_outcome.target_metric_value",
                        "claim_challenged": "Expected 7.5pt retention lift within 6 weeks",
                        "description": "Projecting a jump from 44% to 51.5% retention within 6 weeks is an aggressive assumption without historical baseline experiments. If the intervention fails to move the needle immediately, leadership will have committed 6 weeks of engineering bandwidth with no fallback verification.",
                        "suggested_mitigation": "Scale back the upfront commitment: pilot the intervention on a 20% cohort first with clear gating thresholds before claiming an organization-wide 7.5pt lift."
                    },
                    {
                        "objection_code": "OBJ-2",
                        "category": "resource_capacity",
                        "severity": "medium",
                        "targeted_field": "constraints.design_bandwidth",
                        "claim_challenged": "Minimal design effort (reusing existing notification components)",
                        "description": "Diagnosis notes design bandwidth is strictly 'limited'. Even minor modifications to notification layouts frequently balloon into UX inconsistencies across responsive viewports. If custom copy formatting is needed, the design queue will become an unacknowledged blocker.",
                        "suggested_mitigation": "Explicitly mandate that zero new Figma assets or layout tokens be created; reuse exact existing system toast/modal primitives."
                    },
                    {
                        "objection_code": "OBJ-3",
                        "category": "timeline",
                        "severity": "medium",
                        "targeted_field": "problem_signals.drop_off_timing",
                        "claim_challenged": "Intervention timing at Week 4 is early enough to prevent Week 6 churn",
                        "description": "Usage drops sharply after week 6, but leading degradation indicators (such as reduced query frequency) likely begin as early as week 2 or 3. Intervening at week 4 may already be treating accounts that have mentally abandoned the product.",
                        "suggested_mitigation": "Introduce an earlier leading-indicator threshold at Day 21 (Week 3) based on query frequency drop, rather than waiting for Day 28."
                    }
                ]
            }
            return response_model.model_validate(data)

        # Closer Mitigations
        if response_model == CloserMitigationSchema or "responding to skeptic ai" in system_lower:
            data = {
                "round_summary": "Accepted Skeptic's pilot-first recommendation, shifted detection earlier to Week 3, and locked the UI footprint to zero new design tokens.",
                "mitigations": [
                    {
                        "objection_code": "OBJ-1",
                        "concession_or_defense": "Concession: Scaling back upfront claims to an experimental pilot structure.",
                        "concrete_mitigation": "We will run a 2-week pilot with a 20% cohort split. We will measure leading engagement metrics (Day 35 query retention) before projecting full 7.5pt Month-3 lift. If the pilot generates <3pt lift, we pause and re-evaluate.",
                        "evidence_or_precedent": "Standard growth engineering methodology: pilot verification protects cash and engineering capacity.",
                        "revised_claim": "Target 4.0pt pilot lift with gating checkpoint at Week 4 before full rollout."
                    },
                    {
                        "objection_code": "OBJ-2",
                        "concession_or_defense": "Concession: Absolute lock on design assets.",
                        "concrete_mitigation": "Locked to 100% existing design tokens. The checkpoint prompt will strictly use the standard in-app NotificationBanner and ModalCard components already in production, requiring 0 hours of design cycles.",
                        "evidence_or_precedent": "Engineering audit confirms ModalCard v2 component is completely configurable via JSON copy props.",
                        "revised_claim": "Design bandwidth required: 0 hours."
                    },
                    {
                        "objection_code": "OBJ-3",
                        "concession_or_defense": "Defense with adjustment: Dual-trigger strategy.",
                        "concrete_mitigation": "We are shifting the leading telemetry sensor from Day 28 to Day 21. If an account logs a >25% drop in weekly queries between Day 14 and Day 21, the alert triggers immediately rather than waiting for Day 28.",
                        "evidence_or_precedent": "Telemetry data confirms 80% of churned accounts show initial velocity drops between days 18 and 24.",
                        "revised_claim": "Proactive detection begins at Day 21 with early warning telemetry."
                    }
                ]
            }
            return response_model.model_validate(data)

        # Debate Evaluator
        if response_model == EvaluatorSchema or "debate evaluator" in system_lower:
            # Round 1 evaluation: OBJ-1 mitigated, OBJ-2 mitigated, OBJ-3 mitigated
            data = {
                "round_summary": "All three core objections have been substantively addressed by Closer AI with structural concessions: pilot-first gating eliminates unfounded lift assumptions, locking to existing UI components resolves design bottlenecks, and shifting detection to Day 21 resolves the timing vulnerability.",
                "should_terminate": True,
                "termination_reason": "All critical objections resolved with concrete architectural mitigations.",
                "round_evaluations": [
                    {
                        "objection_code": "OBJ-1",
                        "status": "mitigated",
                        "reasoning": "Closer converted the ungrounded 7.5pt claim into a 20% pilot-gated experiment with a clear rollback threshold.",
                        "residual_risk_note": "Pilot sample size must reach statistical significance within 2 weeks."
                    },
                    {
                        "objection_code": "OBJ-2",
                        "status": "mitigated",
                        "reasoning": "Closer restricted the UI footprint entirely to production ModalCard JSON props, eliminating design queue dependency.",
                        "residual_risk_note": None
                    },
                    {
                        "objection_code": "OBJ-3",
                        "status": "mitigated",
                        "reasoning": "Closer adjusted leading sensor trigger from Day 28 to Day 21, capturing accounts before irreversible usage abandonment.",
                        "residual_risk_note": "Requires query telemetry to update on a daily rollup schedule."
                    }
                ]
            }
            return response_model.model_validate(data)

        # Fallback or general dict parsing
        raise ValueError(f"MockLLMProvider received unrecognized response model: {response_model}")

