import json
from typing import Dict, Any, List
from app.providers.base import LLMProvider
from app.agents.prompts import CLOSER_PROPOSAL_SYSTEM_PROMPT, CLOSER_MITIGATION_SYSTEM_PROMPT
from app.schemas.debate import ProposalSchema, CloserMitigationSchema


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


class CloserAgent:
    def __init__(self, provider: LLMProvider):
        self.provider = provider

    async def generate_proposal(self, diagnosis: Dict[str, Any]) -> ProposalSchema:
        prompt = (
            "DIAGNOSIS CONTEXT:\n"
            f"{_summarize_diagnosis(diagnosis)}\n\n"
            "Formulate a concise strategic intervention (max 2 sentences per field) targeting the M3 objective within constraints."
        )

        return await self.provider.generate_structured(
            prompt=prompt,
            system_prompt=CLOSER_PROPOSAL_SYSTEM_PROMPT,
            response_model=ProposalSchema
        )

    async def generate_mitigations(
        self,
        diagnosis: Dict[str, Any],
        proposal: Dict[str, Any],
        objections: List[Dict[str, Any]],
        round_number: int
    ) -> CloserMitigationSchema:
        prompt = (
            f"ROUND {round_number} CLOSER MITIGATION:\n"
            f"CONSTRAINTS:\n{_summarize_diagnosis(diagnosis)}\n\n"
            f"CURRENT PROPOSAL: {proposal.get('title')} - {proposal.get('executive_summary')}\n\n"
            "SKEPTIC OBJECTIONS:\n"
            f"{json.dumps(objections, indent=1)}\n\n"
            "Address each objection with a concise 1-2 sentence concrete compromise."
        )

        formatted_system = CLOSER_MITIGATION_SYSTEM_PROMPT.format(round_number=round_number)

        return await self.provider.generate_structured(
            prompt=prompt,
            system_prompt=formatted_system,
            response_model=CloserMitigationSchema
        )
