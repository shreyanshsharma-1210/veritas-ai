import uuid
from datetime import datetime, timezone
from typing import Optional, List, Any, Dict
from sqlalchemy import String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class DiagnosisSession(Base):
    __tablename__ = "diagnosis_sessions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    title: Mapped[str] = mapped_column(String(255), default="SaaS Churn & Retention Diagnosis")
    status: Mapped[str] = mapped_column(String(32), default="draft")  # draft, validated, confirmed
    
    # Core JSON structures
    business_context: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)
    primary_objective: Mapped[str] = mapped_column(String(64), default="reduce_churn")
    metrics: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)
    problem_signals: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)
    constraints: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)
    desired_outcome: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)
    
    # Validation state
    is_consistent: Mapped[bool] = mapped_column(Boolean, default=False)
    validation_issues: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)
    raw_answers: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    # Relationships
    debates: Mapped[List["DebateSession"]] = relationship("DebateSession", back_populates="diagnosis", cascade="all, delete-orphan")


class DebateSession(Base):
    __tablename__ = "debate_sessions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    diagnosis_id: Mapped[str] = mapped_column(String(36), ForeignKey("diagnosis_sessions.id", ondelete="CASCADE"))
    status: Mapped[str] = mapped_column(String(32), default="created") 
    # created, proposal_generating, skeptic_reviewing, mitigation_generating, evaluating, completed, failed
    
    current_round: Mapped[int] = mapped_column(Integer, default=1)
    max_rounds: Mapped[int] = mapped_column(Integer, default=3)
    active_provider: Mapped[str] = mapped_column(String(32), default="groq")
    
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    diagnosis: Mapped["DiagnosisSession"] = relationship("DiagnosisSession", back_populates="debates")
    rounds: Mapped[List["DebateRound"]] = relationship("DebateRound", back_populates="debate", cascade="all, delete-orphan", order_by="DebateRound.round_number")
    objections: Mapped[List["Objection"]] = relationship("Objection", back_populates="debate", cascade="all, delete-orphan")
    recommendation: Mapped[Optional["Recommendation"]] = relationship("Recommendation", back_populates="debate", uselist=False, cascade="all, delete-orphan")
    events: Mapped[List["SessionEvent"]] = relationship("SessionEvent", back_populates="debate", cascade="all, delete-orphan", order_by="SessionEvent.created_at")


class DebateRound(Base):
    __tablename__ = "debate_rounds"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    debate_id: Mapped[str] = mapped_column(String(36), ForeignKey("debate_sessions.id", ondelete="CASCADE"))
    round_number: Mapped[int] = mapped_column(Integer)
    
    closer_proposal: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)
    skeptic_challenge: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)
    closer_mitigations: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)
    evaluation_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    debate: Mapped["DebateSession"] = relationship("DebateSession", back_populates="rounds")


class Objection(Base):
    __tablename__ = "objections"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    debate_id: Mapped[str] = mapped_column(String(36), ForeignKey("debate_sessions.id", ondelete="CASCADE"))
    round_number: Mapped[int] = mapped_column(Integer, default=1)
    
    objection_code: Mapped[str] = mapped_column(String(32))  # OBJ-1, OBJ-2
    category: Mapped[str] = mapped_column(String(64))  # data_integrity, financial_feasibility, resource_capacity, timeline, operational_feasibility
    severity: Mapped[str] = mapped_column(String(16))  # low, medium, high, critical
    targeted_field: Mapped[str] = mapped_column(String(128))  # constraints.engineering_headcount
    claim_challenged: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    suggested_mitigation: Mapped[str] = mapped_column(Text)
    
    # State tracking
    status: Mapped[str] = mapped_column(String(32), default="open")  # open, mitigated, partially_mitigated, unresolved
    mitigation_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    mitigation_evidence: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    evaluation_reasoning: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    debate: Mapped["DebateSession"] = relationship("DebateSession", back_populates="objections")


class Recommendation(Base):
    __tablename__ = "recommendations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    debate_id: Mapped[str] = mapped_column(String(36), ForeignKey("debate_sessions.id", ondelete="CASCADE"), unique=True)
    diagnosis_id: Mapped[str] = mapped_column(String(36), ForeignKey("diagnosis_sessions.id", ondelete="CASCADE"))
    
    executive_summary: Mapped[str] = mapped_column(Text)
    recommended_strategy: Mapped[str] = mapped_column(Text)
    
    action_plan: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)
    deterministic_impact: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)
    
    resolved_risks: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)
    partially_mitigated_risks: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)
    open_risks: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)
    assumptions_to_verify: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)
    
    confidence_score: Mapped[float] = mapped_column(Float, default=0.75)
    success_metrics: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    debate: Mapped["DebateSession"] = relationship("DebateSession", back_populates="recommendation")


class SessionEvent(Base):
    __tablename__ = "session_events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    debate_id: Mapped[str] = mapped_column(String(36), ForeignKey("debate_sessions.id", ondelete="CASCADE"))
    event_type: Mapped[str] = mapped_column(String(64))  # agent_started, proposal_created, objection_raised, etc.
    round_number: Mapped[int] = mapped_column(Integer, default=1)
    payload: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    debate: Mapped["DebateSession"] = relationship("DebateSession", back_populates="events")

