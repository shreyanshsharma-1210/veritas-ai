import json
from typing import Dict, Any, List
from app.providers.base import LLMProvider
from app.agents.prompts import EVALUATOR_SYSTEM_PROMPT
from app.schemas.debate import EvaluatorSchema


def _summarize_diagnosis(d: Dict[str, Any]) -> str:
    biz = d.get("business_context", {})
    metrics = d.get("metrics", {})
    constraints = d.get("constraints", {})
    desired = d.get("desired_outcome", {})
    signals = d.get("problem_signals", {})
    return (
        f"Company: {biz.get('company_name')} ({biz.get('industry')})\n"
        f"Objective: {d.get('primary_objective')}\n"
        f"Cohort Baseline: M1={metrics.get('m1_retention_pct')}%, M3={metrics.get('m3_retention_pct')}%, Target M3={desired.get('target_metric_value')}%\n"
        f"Drop-off Timing: {signals.get('drop_off_timing')} | Point: {signals.get('leakage_point')}\n"
        f"Constraints: Budget=${constraints.get('budget_usd')}, Eng={constraints.get('engineering_headcount')}, Design={constraints.get('design_bandwidth')}, Timeline={constraints.get('timeline_weeks')}w"
    )


class DebateEvaluator:
    def __init__(self, provider: LLMProvider):
        self.provider = provider

    async def evaluate_round(
        self,
        diagnosis: Dict[str, Any],
        proposal: Dict[str, Any],
        objections: List[Dict[str, Any]],
        mitigations: List[Dict[str, Any]],
        round_number: int,
        max_rounds: int = 3
    ) -> EvaluatorSchema:
        prompt = (
            f"EVALUATION ROUND {round_number}/{max_rounds}:\n"
            f"CONSTRAINTS:\n{_summarize_diagnosis(diagnosis)}\n\n"
            f"OBJECTIONS: {json.dumps(objections, indent=1)}\n\n"
            f"MITIGATIONS: {json.dumps(mitigations, indent=1)}\n\n"
            "Judge each objection: 'mitigated', 'partially_mitigated', or 'unresolved'. "
            "Keep reasoning to 1 sentence per item."
        )

        result = await self.provider.generate_structured(
            prompt=prompt,
            system_prompt=EVALUATOR_SYSTEM_PROMPT,
            response_model=EvaluatorSchema
        )

        # Enforce maximum round rule deterministically in code:
        if round_number >= max_rounds:
            result.should_terminate = True
            result.termination_reason = f"Maximum debate rounds ({max_rounds}) reached."

        return result
