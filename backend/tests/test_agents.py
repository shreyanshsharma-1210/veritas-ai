import pytest
from app.providers.mock_provider import MockLLMProvider
from app.agents.closer import CloserAgent
from app.agents.skeptic import SkepticAgent
from app.agents.evaluator import DebateEvaluator
from app.services.diagnosis_service import DiagnosisService


@pytest.mark.asyncio
async def test_closer_proposal_generation():
    provider = MockLLMProvider()
    closer = CloserAgent(provider)
    diagnosis = DiagnosisService.get_canonical_demo_scenario()
    
    proposal = await closer.generate_proposal(diagnosis)
    assert proposal.title is not None
    assert proposal.expected_lift_pct > 0
    assert proposal.timeline_weeks > 0
    assert len(proposal.key_assumptions) > 0


@pytest.mark.asyncio
async def test_skeptic_adversarial_challenge():
    provider = MockLLMProvider()
    skeptic = SkepticAgent(provider)
    diagnosis = DiagnosisService.get_canonical_demo_scenario()
    
    proposal = {
        "title": "Week 4 Checkpoint",
        "expected_lift_pct": 7.5,
        "timeline_weeks": 6
    }
    
    challenge = await skeptic.challenge_proposal(diagnosis=diagnosis, proposal=proposal, round_number=1)
    assert len(challenge.objections) >= 2
    for obj in challenge.objections:
        assert obj.objection_code.startswith("OBJ-")
        assert obj.targeted_field is not None
        assert obj.suggested_mitigation is not None


@pytest.mark.asyncio
async def test_closer_mitigations():
    provider = MockLLMProvider()
    closer = CloserAgent(provider)
    diagnosis = DiagnosisService.get_canonical_demo_scenario()
    proposal = {"title": "Week 4 Checkpoint"}
    objections = [
        {"objection_code": "OBJ-1", "category": "evidence_quality", "severity": "high", "targeted_field": "metrics.m3_retention_pct", "description": "Unbacked lift"}
    ]
    
    mitigation_resp = await closer.generate_mitigations(diagnosis, proposal, objections, round_number=1)
    assert len(mitigation_resp.mitigations) >= 1
    assert mitigation_resp.mitigations[0].objection_code == "OBJ-1"
    assert mitigation_resp.mitigations[0].concrete_mitigation is not None


@pytest.mark.asyncio
async def test_evaluator_decision():
    provider = MockLLMProvider()
    evaluator = DebateEvaluator(provider)
    diagnosis = DiagnosisService.get_canonical_demo_scenario()
    proposal = {"title": "Week 4 Checkpoint"}
    objections = [{"code": "OBJ-1", "desc": "Unbacked lift", "severity": "high"}]
    mitigations = [{"objection_code": "OBJ-1", "concession_or_defense": "Concession", "concrete_mitigation": "Pilot 20% first"}]
    
    evaluation = await evaluator.evaluate_round(diagnosis, proposal, objections, mitigations, round_number=1)
    assert len(evaluation.round_evaluations) >= 1
    assert evaluation.round_evaluations[0].status in ("mitigated", "partially_mitigated", "unresolved")

