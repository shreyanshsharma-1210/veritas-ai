import asyncio
import logging
from typing import Dict, Any, List, Optional, Callable, Awaitable
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.entities import (
    DebateSession,
    DebateRound,
    Objection,
    Recommendation,
    SessionEvent,
    DiagnosisSession,
    utc_now
)
from app.providers.factory import (
    get_llm_provider,
    get_closer_provider,
    get_skeptic_provider,
    get_evaluator_provider,
)
from app.agents.closer import CloserAgent
from app.agents.skeptic import SkepticAgent
from app.agents.evaluator import DebateEvaluator
from app.services.recommendation_service import RecommendationService

logger = logging.getLogger(__name__)


class DebateController:
    def __init__(self, db: AsyncSession, debate_id: str, event_callback: Optional[Callable[[str, Dict[str, Any]], Any]] = None):
        self.db = db
        self.debate_id = debate_id
        self.event_callback = event_callback

    async def _emit_event(self, event_type: str, round_number: int, payload: Dict[str, Any]) -> None:
        """Stores event in DB for persistence and dispatches to live SSE listener."""
        event = SessionEvent(
            debate_id=self.debate_id,
            event_type=event_type,
            round_number=round_number,
            payload=payload
        )
        self.db.add(event)
        await self.db.commit()

        if self.event_callback:
            try:
                res = self.event_callback(event_type, {"event_type": event_type, "round_number": round_number, **payload})
                if asyncio.iscoroutine(res):
                    await res
            except Exception as e:
                logger.warning(f"Error in event callback: {e}")

    async def run_debate(self) -> DebateSession:
        # 1. Fetch DebateSession & Diagnosis
        result = await self.db.execute(
            select(DebateSession).where(DebateSession.id == self.debate_id)
        )
        debate = result.scalar_one_or_none()
        if not debate:
            raise ValueError(f"Debate session {self.debate_id} not found.")

        diag_result = await self.db.execute(
            select(DiagnosisSession).where(DiagnosisSession.id == debate.diagnosis_id)
        )
        diagnosis = diag_result.scalar_one_or_none()
        if not diagnosis:
            raise ValueError(f"Diagnosis {debate.diagnosis_id} not found for debate {self.debate_id}.")

        diagnosis_dict = {
            "title": diagnosis.title,
            "business_context": diagnosis.business_context,
            "primary_objective": diagnosis.primary_objective,
            "metrics": diagnosis.metrics,
            "problem_signals": diagnosis.problem_signals,
            "constraints": diagnosis.constraints,
            "desired_outcome": diagnosis.desired_outcome
        }

        # 2. Initialize Agents with Provider: Closer on Key 1, Skeptic on Key 2
        closer = CloserAgent(get_closer_provider())
        skeptic = SkepticAgent(get_skeptic_provider())
        evaluator = DebateEvaluator(get_evaluator_provider())
        recommendation_svc = RecommendationService(get_evaluator_provider())

        debate.status = "running"
        await self.db.commit()

        await self._emit_event(
            event_type="session_started",
            round_number=1,
            payload={"message": "Debate session initialized. Closer AI preparing Round 1 proposal."}
        )

        current_proposal_dict: Dict[str, Any] = {}
        all_objections: List[Objection] = []
        is_debate_complete = False

        try:
            while debate.current_round <= debate.max_rounds and not is_debate_complete:
                r_num = debate.current_round

                # --- STEP 1: Closer AI Proposes / Refines ---
                debate.status = f"round_{r_num}_proposal_generating"
                await self.db.commit()

                await self._emit_event(
                    event_type="agent_started",
                    round_number=r_num,
                    payload={"agent": "Closer AI", "action": "Formulating strategic intervention proposal"}
                )

                if r_num == 1:
                    proposal_obj = await closer.generate_proposal(diagnosis_dict)
                    current_proposal_dict = proposal_obj.model_dump()
                
                await self._emit_event(
                    event_type="proposal_created",
                    round_number=r_num,
                    payload={"proposal": current_proposal_dict}
                )

                # --- STEP 2: Skeptic AI Challenges ---
                debate.status = f"round_{r_num}_skeptic_reviewing"
                await self.db.commit()

                await self._emit_event(
                    event_type="agent_started",
                    round_number=r_num,
                    payload={"agent": "Skeptic AI", "action": "Analyzing proposal against constraints and telemetry"}
                )

                skeptic_obj = await skeptic.challenge_proposal(
                    diagnosis=diagnosis_dict,
                    proposal=current_proposal_dict,
                    round_number=r_num
                )
                skeptic_dict = skeptic_obj.model_dump()

                # Persist objections in database
                round_objections: List[Objection] = []
                for raw_obj in skeptic_obj.objections:
                    # Check if objection code already exists
                    existing = next((o for o in all_objections if o.objection_code == raw_obj.objection_code), None)
                    if not existing:
                        db_obj = Objection(
                            debate_id=debate.id,
                            round_number=r_num,
                            objection_code=raw_obj.objection_code,
                            category=raw_obj.category,
                            severity=raw_obj.severity,
                            targeted_field=raw_obj.targeted_field,
                            claim_challenged=raw_obj.claim_challenged,
                            description=raw_obj.description,
                            suggested_mitigation=raw_obj.suggested_mitigation,
                            status="open"
                        )
                        self.db.add(db_obj)
                        all_objections.append(db_obj)
                        round_objections.append(db_obj)
                    else:
                        round_objections.append(existing)

                await self.db.commit()

                await self._emit_event(
                    event_type="objections_created",
                    round_number=r_num,
                    payload={
                        "summary": skeptic_dict.get("summary"),
                        "overall_risk": skeptic_dict.get("overall_risk_level"),
                        "objections": [
                            {
                                "code": o.objection_code,
                                "category": o.category,
                                "severity": o.severity,
                                "targeted_field": o.targeted_field,
                                "description": o.description,
                                "status": o.status
                            } for o in round_objections
                        ]
                    }
                )

                # --- STEP 3: Closer AI Mitigates ---
                debate.status = f"round_{r_num}_mitigation_generating"
                await self.db.commit()

                await self._emit_event(
                    event_type="agent_started",
                    round_number=r_num,
                    payload={"agent": "Closer AI", "action": "Formulating scope compromises and evidence mitigations"}
                )

                mitigation_obj = await closer.generate_mitigations(
                    diagnosis=diagnosis_dict,
                    proposal=current_proposal_dict,
                    objections=[
                        {
                            "objection_code": o.objection_code,
                            "category": o.category,
                            "severity": o.severity,
                            "targeted_field": o.targeted_field,
                            "description": o.description
                        } for o in round_objections
                    ],
                    round_number=r_num
                )
                mitigation_dict = mitigation_obj.model_dump()

                # Update objections with closer's mitigations
                for raw_mit in mitigation_obj.mitigations:
                    matched = next((o for o in all_objections if o.objection_code == raw_mit.objection_code), None)
                    if matched:
                        matched.mitigation_text = f"{raw_mit.concession_or_defense}: {raw_mit.concrete_mitigation}"
                        matched.mitigation_evidence = raw_mit.evidence_or_precedent
                        if raw_mit.revised_claim:
                            current_proposal_dict["revised_claim"] = raw_mit.revised_claim

                await self.db.commit()

                await self._emit_event(
                    event_type="mitigations_created",
                    round_number=r_num,
                    payload={
                        "round_summary": mitigation_dict.get("round_summary"),
                        "mitigations": mitigation_dict.get("mitigations", [])
                    }
                )

                # --- STEP 4: Debate Controller Evaluates Mitigations ---
                debate.status = f"round_{r_num}_evaluating"
                await self.db.commit()

                await self._emit_event(
                    event_type="agent_started",
                    round_number=r_num,
                    payload={"agent": "Debate Evaluator", "action": "Auditing objection resolution validity"}
                )

                evaluation_obj = await evaluator.evaluate_round(
                    diagnosis=diagnosis_dict,
                    proposal=current_proposal_dict,
                    objections=[
                        {"code": o.objection_code, "desc": o.description, "severity": o.severity}
                        for o in round_objections
                    ],
                    mitigations=mitigation_dict.get("mitigations", []),
                    round_number=r_num,
                    max_rounds=debate.max_rounds
                )

                # Apply evaluated statuses to database records
                for eval_item in evaluation_obj.round_evaluations:
                    matched = next((o for o in all_objections if o.objection_code == eval_item.objection_code), None)
                    if matched:
                        matched.status = eval_item.status
                        matched.evaluation_reasoning = f"{eval_item.reasoning} (Residual: {eval_item.residual_risk_note or 'None'})"

                # Persist DebateRound record
                round_record = DebateRound(
                    debate_id=debate.id,
                    round_number=r_num,
                    closer_proposal=current_proposal_dict,
                    skeptic_challenge=skeptic_dict,
                    closer_mitigations=mitigation_dict.get("mitigations", []),
                    evaluation_notes=evaluation_obj.round_summary
                )
                self.db.add(round_record)
                await self.db.commit()

                await self._emit_event(
                    event_type="round_completed",
                    round_number=r_num,
                    payload={
                        "evaluation_summary": evaluation_obj.round_summary,
                        "statuses": [
                            {"code": o.objection_code, "status": o.status} for o in round_objections
                        ]
                    }
                )

                # --- STEP 5: Stopping Condition Evaluation ---
                all_mitigated = all(o.status == "mitigated" for o in all_objections)
                unresolved_high = any(o.severity in ("high", "critical") and o.status == "unresolved" for o in all_objections)
                
                # Fast convergence: if all resolved, evaluator signals termination, no unresolved critical risks by round 2, or max rounds reached
                if all_mitigated or evaluation_obj.should_terminate or (r_num >= 2 and not unresolved_high) or r_num >= debate.max_rounds:
                    is_debate_complete = True
                else:
                    debate.current_round += 1
                    await self.db.commit()

            # --- STEP 6: Final Recommendation Generation ---
            debate.status = "generating_recommendation"
            await self.db.commit()

            await self._emit_event(
                event_type="agent_started",
                round_number=debate.current_round,
                payload={"agent": "Synthesizer", "action": "Compiling verified recommendation blueprint and action plan"}
            )

            rec_dict = await recommendation_svc.generate_recommendation_data(
                diagnosis_data=diagnosis_dict,
                final_proposal=current_proposal_dict,
                objections=all_objections,
                total_rounds=debate.current_round
            )

            recommendation = Recommendation(
                debate_id=debate.id,
                diagnosis_id=diagnosis.id,
                executive_summary=rec_dict["executive_summary"],
                recommended_strategy=rec_dict["recommended_strategy"],
                action_plan=rec_dict["action_plan"],
                deterministic_impact=rec_dict["deterministic_impact"],
                resolved_risks=rec_dict["resolved_risks"],
                partially_mitigated_risks=rec_dict["partially_mitigated_risks"],
                open_risks=rec_dict["open_risks"],
                assumptions_to_verify=rec_dict["assumptions_to_verify"],
                confidence_score=rec_dict["confidence_score"],
                success_metrics=rec_dict["success_metrics"]
            )
            self.db.add(recommendation)

            debate.status = "completed"
            debate.completed_at = utc_now()
            await self.db.commit()

            await self._emit_event(
                event_type="debate_completed",
                round_number=debate.current_round,
                payload={
                    "recommendation_id": recommendation.id,
                    "confidence": recommendation.confidence_score,
                    "strategy": recommendation.recommended_strategy
                }
            )

            return debate

        except Exception as e:
            logger.error(f"Error in debate execution: {e}", exc_info=True)
            debate.status = "failed"
            debate.error_message = str(e)
            await self.db.commit()

            await self._emit_event(
                event_type="session_failed",
                round_number=debate.current_round,
                payload={"error": str(e)}
            )
            raise e
