import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  Terminal,
  FileText
} from 'lucide-react';
import { api } from '../services/api';
import type { 
  DebateSession, 
  DebateRound, 
  Objection, 
  DiagnosisResponse 
} from '../types';

export const LiveDebatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [debate, setDebate] = useState<DebateSession | null>(null);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResponse | null>(null);
  const [activeRoundTab, setActiveRoundTab] = useState<number>(1);
  const [events, setEvents] = useState<Array<{ event_type: string; payload: any; timestamp: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoStarted, setAutoStarted] = useState(false);

  const eventSourceRef = useRef<EventSource | null>(null);
  const pollTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (id) {
      loadInitialState(id);
    }
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadInitialState = async (debateId: string) => {
    try {
      setLoading(true);
      const debateData = await api.getDebate(debateId);
      setDebate(debateData);
      setActiveRoundTab(debateData.current_round || 1);

      // Load linked diagnosis for fact reference
      if (debateData.diagnosis_id) {
        const diagData = await api.getDiagnosis(debateData.diagnosis_id);
        setDiagnosis(diagData);
      }

      // If created or pending, auto-start
      if ((debateData.status === 'created' || debateData.status === 'pending') && !autoStarted) {
        setAutoStarted(true);
        startDebateStream(debateId);
      } else if (debateData.status === 'running' || debateData.status === 'starting' || debateData.status.startsWith('round_')) {
        setRunning(true);
        connectSSE(debateId);
        startPolling(debateId);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load debate session');
    } finally {
      setLoading(false);
    }
  };

  const startDebateStream = async (debateId: string) => {
    try {
      setRunning(true);
      setError(null);
      connectSSE(debateId);
      startPolling(debateId);
      await api.startDebate(debateId);
    } catch (err: any) {
      console.error('Error starting debate:', err);
      setError(err?.message || 'Failed to start multi-agent debate');
      setRunning(false);
    }
  };

  const startPolling = (debateId: string) => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
    }
    pollTimerRef.current = setInterval(async () => {
      try {
        const d = await api.getDebate(debateId);
        setDebate(d);
        if (d.current_round) {
          setActiveRoundTab(d.current_round);
        }
        if (d.status === 'completed' || d.status === 'failed') {
          setRunning(false);
          if (pollTimerRef.current) {
            clearInterval(pollTimerRef.current);
          }
        }
      } catch {
        // ignore poll errors
      }
    }, 2500);
  };

  const connectSSE = (debateId: string) => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const sseUrl = api.getDebateEventsUrl(debateId);
    const es = new EventSource(sseUrl);
    eventSourceRef.current = es;

    es.onmessage = (messageEvent) => {
      try {
        const parsed = JSON.parse(messageEvent.data);
        const eventType = parsed.event_type || parsed.event || 'update';

        setEvents((prev) => [
          ...prev,
          {
            event_type: eventType,
            payload: parsed,
            timestamp: new Date().toISOString(),
          },
        ]);

        if (parsed.round_number) {
          setActiveRoundTab(parsed.round_number);
        }

        // Fetch latest state on agent events
        api.getDebate(debateId).then((d) => {
          setDebate(d);
          if (d.status === 'completed') {
            setRunning(false);
            es.close();
            if (pollTimerRef.current) {
              clearInterval(pollTimerRef.current);
            }
          }
        });
      } catch (e) {
        console.error('Failed to parse SSE payload', e);
      }
    };

    es.onerror = () => {
      // Re-fetch state
      api.getDebate(debateId).then((d) => {
        setDebate(d);
        if (d.status === 'completed') {
          setRunning(false);
          es.close();
        }
      });
    };
  };

  if (loading) {
    return (
      <div className="py-24 text-center font-sans text-text-secondary">
        <div className="w-8 h-8 border-3 border-olive-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[16px]">Initializing Multi-Agent Debate Arena...</p>
      </div>
    );
  }

  if (!debate) {
    return (
      <div className="py-24 text-center font-sans">
        <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto mb-3" />
        <h2 className="font-serif-heading text-[24px] text-text-primary mb-2">Debate Session Not Found</h2>
        <Link to="/app" className="text-olive-primary font-semibold hover:underline">
          Return to Workspace
        </Link>
      </div>
    );
  }

  const currentRoundData: DebateRound | undefined = debate.rounds.find((r) => r.round_number === activeRoundTab);
  const isCompleted = debate.status === 'completed';

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-border-warm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Link to="/app" className="font-sans text-[12px] text-text-muted hover:text-text-primary transition-colors">
              Workspace
            </Link>
            <span className="text-text-muted text-[12px]">/</span>
            <span className="font-sans text-[12px] text-text-secondary">Debate Arena</span>
            <span className="text-text-muted text-[12px]">&bull;</span>
            <span className="font-mono text-[11px] text-text-muted">{debate.id.slice(0, 8)}</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="font-serif-heading text-[32px] md:text-[38px] font-light text-text-primary leading-tight">
              Adversarial Reasoning Session
            </h1>
            {isCompleted ? (
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-sans text-[12px] font-semibold px-3 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Debate Converged (3 Rounds)
              </span>
            ) : running || debate.status === 'running' || debate.status.startsWith('round_') ? (
              <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 font-sans text-[12px] font-semibold px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
                Active Adversarial Debate (Round {debate.current_round} of {debate.max_rounds || 3})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-stone-100 text-stone-700 border border-stone-200 font-sans text-[12px] font-semibold px-3 py-1 rounded-full">
                Ready to Debate
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isCompleted ? (
            <Link
              to={`/app/reports/${debate.id}`}
              className="inline-flex items-center gap-2 bg-olive-primary text-surface-warm font-sans text-[14px] font-bold px-6 py-3 rounded-[10px] hover:bg-olive-dark transition-all shadow-sm"
            >
              <FileText className="w-4 h-4" />
              View Recommendation Report
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : !running && (debate.status === 'created' || debate.status === 'pending') ? (
            <button
              onClick={() => startDebateStream(debate.id)}
              className="inline-flex items-center gap-2 bg-olive-primary text-surface-warm font-sans text-[14px] font-bold px-6 py-3 rounded-[10px] hover:bg-olive-dark transition-all shadow-sm"
            >
              <Play className="w-4 h-4 fill-current" />
              Start Adversarial Debate
            </button>
          ) : (
            <div className="flex items-center gap-2 text-[13px] font-sans text-text-muted bg-[#FAF8F3] px-4 py-2 rounded-[8px] border border-border-warm">
              <div className="w-3.5 h-3.5 border-2 border-olive-primary border-t-transparent rounded-full animate-spin"></div>
              <span>Debating in progress &bull; Closer (Key 1) vs Skeptic (Key 2)...</span>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-[12px] bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 font-sans text-[14px]">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Fact Grounding Bar */}
      {diagnosis && (
        <div className="bg-[#FAF8F3] border border-border-warm rounded-[12px] p-4 flex flex-wrap items-center justify-between gap-4 font-sans text-[13px]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-text-primary">{diagnosis.business_context.company_name}</span>
            <span className="text-text-muted">&bull;</span>
            <span className="text-text-secondary">{diagnosis.business_context.industry}</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-text-muted">
            <span>
              Baseline: <strong className="text-text-primary">{diagnosis.metrics.m1_retention_pct}% M1 &rarr; {diagnosis.metrics.m3_retention_pct}% M3</strong>
            </span>
            <span>
              Target: <strong className="text-olive-primary font-semibold">{diagnosis.desired_outcome.target_metric_value}% M3</strong>
            </span>
            <span>
              ACV: <strong className="text-text-primary">${(diagnosis.metrics.arpu * 12).toLocaleString()}</strong>
            </span>
            <span>
              Bandwidth: <strong className="text-amber-800">{diagnosis.constraints.engineering_headcount} Eng, {diagnosis.constraints.design_bandwidth} Design</strong>
            </span>
          </div>
        </div>
      )}

      {/* Round Tabs */}
      <div className="flex items-center gap-3 border-b border-border-warm pb-3">
        {[1, 2, 3].map((rNum) => {
          const rData = debate.rounds.find((r) => r.round_number === rNum);
          const isSelected = activeRoundTab === rNum;
          const isAvailable = Boolean(rData) || debate.current_round >= rNum;
          return (
            <button
              key={rNum}
              disabled={!isAvailable}
              onClick={() => setActiveRoundTab(rNum)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-[10px] font-sans text-[14px] font-semibold transition-all ${
                isSelected
                  ? 'bg-olive-primary text-surface-warm shadow-xs'
                  : isAvailable
                  ? 'bg-surface-warm text-text-secondary hover:text-text-primary border border-border-warm'
                  : 'opacity-40 cursor-not-allowed bg-transparent text-text-muted border border-dashed border-border-warm'
              }`}
            >
              <span>Round 0{rNum}</span>
              {rData?.evaluation_notes ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : debate.current_round === rNum && running ? (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Agent Reasoning Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Closer AI (Powered by Groq Key 1) */}
        <div className="bg-[#FFFFFF] border-2 border-[#451F2D]/20 rounded-[16px] p-6 shadow-sm flex flex-col justify-between min-h-[520px]">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#E2D9D4] mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#451F2D]/30 flex items-center justify-center text-[18px]">
                  🧠
                </div>
                <div>
                  <h3 className="font-serif-heading text-[20px] font-bold text-[#451F2D] leading-tight">
                    Closer AI
                  </h3>
                  <span className="font-sans text-[11px] font-bold text-[#C7A05A] uppercase tracking-wider">
                    Powered by Groq Key 1 (LPU 20B)
                  </span>
                </div>
              </div>

              <span className="font-sans text-[11px] text-[#6B5B60] bg-[#FAF8F5] px-2.5 py-1 rounded-full border border-[#E2D9D4]">
                Round {activeRoundTab} Intervention
              </span>
            </div>

            {/* Proposal Content */}
            {currentRoundData ? (
              <div className="space-y-4 font-sans">
                <div className="p-4 rounded-[12px] bg-[#FAF8F3] border border-border-warm">
                  <h4 className="font-sans text-[12px] font-bold text-text-muted uppercase tracking-wider mb-2">
                    {currentRoundData.closer_proposal.title || 'Strategic Intervention'}
                  </h4>
                  <p className="text-[15px] text-text-primary leading-relaxed font-serif-heading">
                    "{currentRoundData.closer_proposal.executive_summary || currentRoundData.closer_proposal.intervention_details}"
                  </p>
                  {currentRoundData.closer_proposal.expected_lift_pct && (
                    <div className="mt-3 pt-3 border-t border-border-warm text-[12px] text-olive-primary font-bold">
                      Projected Lift: +{currentRoundData.closer_proposal.expected_lift_pct}%
                    </div>
                  )}
                </div>

                {/* Mitigations if any in this round */}
                {currentRoundData.closer_mitigations && currentRoundData.closer_mitigations.length > 0 && (
                  <div className="space-y-3 mt-4">
                    <h4 className="font-sans text-[12px] font-bold text-olive-primary uppercase tracking-wider">
                      Proposed Mitigations & Scope Concessions
                    </h4>
                    {currentRoundData.closer_mitigations.map((m, i: number) => (
                      <div key={i} className="p-3 rounded-[10px] bg-[#F2EFE8] border border-border-warm text-[13px] text-text-secondary">
                        <span className="font-bold text-text-primary block mb-1">
                          Addressing Objection [{m.objection_code}]:
                        </span>
                        <span className="text-olive-dark font-medium">&rarr; {m.concrete_mitigation}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-20 text-center font-sans text-text-muted">
                {running ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-olive-primary border-t-transparent rounded-full animate-spin"></div>
                    <span>Closer AI is formulating strategic intervention on Groq...</span>
                  </div>
                ) : (
                  <span>Awaiting round launch</span>
                )}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-border-warm mt-6 flex items-center justify-between text-[12px] font-sans text-text-muted">
            <span>Role: Solution Architect</span>
            <span className="font-semibold text-olive-primary">Groq API Key #1 Active</span>
          </div>
        </div>

        {/* Right Column: Skeptic AI (Powered by Groq Key 2) */}
        <div className="bg-[#FFFFFF] border-2 border-[#9B747A]/30 rounded-[16px] p-6 shadow-sm flex flex-col justify-between min-h-[520px]">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#E2D9D4] mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#9B747A]/40 flex items-center justify-center text-[18px]">
                  ⚖️
                </div>
                <div>
                  <h3 className="font-serif-heading text-[20px] font-bold text-[#451F2D] leading-tight">
                    Skeptic AI
                  </h3>
                  <span className="font-sans text-[11px] font-bold text-[#9B747A] uppercase tracking-wider">
                    Powered by Groq Key 2 (LPU 20B)
                  </span>
                </div>
              </div>

              <span className="font-sans text-[11px] text-[#6B5B60] bg-[#FAF8F5] px-2.5 py-1 rounded-full border border-[#E2D9D4]">
                Round {activeRoundTab} Challenges
              </span>
            </div>

            {/* Objections List */}
            {currentRoundData?.skeptic_challenge?.objections && currentRoundData.skeptic_challenge.objections.length > 0 ? (
              <div className="space-y-3 font-sans">
                <h4 className="font-sans text-[12px] font-bold text-text-muted uppercase tracking-wider mb-2">
                  Identified Objections & Diagnostic Tags
                </h4>
                {currentRoundData.skeptic_challenge.objections.map((obj: Objection, idx: number) => {
                  const severityBadge = getSeverityBadge(obj.severity);
                  const statusBadge = getResolutionBadge(obj.status);
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-[12px] bg-[#FAF8F3] border border-border-warm space-y-2 hover:border-[#D9D3C1] transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${severityBadge.className}`}>
                          {severityBadge.label}
                        </span>

                        <div className="flex items-center gap-2">
                          {obj.targeted_field && (
                            <span className="font-mono text-[10px] bg-stone-200 text-stone-700 px-2 py-0.5 rounded">
                              [{obj.targeted_field}]
                            </span>
                          )}
                          <span className={`text-[11px] font-semibold ${statusBadge.className}`}>
                            {statusBadge.label}
                          </span>
                        </div>
                      </div>

                      <p className="text-[14px] text-text-primary leading-snug">
                        {obj.description || obj.claim_challenged}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-20 text-center font-sans text-text-muted">
                {running ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
                    <span>Skeptic AI is auditing assumptions against diagnostic facts on Groq...</span>
                  </div>
                ) : (
                  <span>Awaiting closer proposal</span>
                )}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#E2D9D4] mt-6 flex items-center justify-between text-[12px] font-sans text-[#6B5B60]">
            <span>Role: Empirical Auditor</span>
            <span className="font-semibold text-[#9B747A]">Groq API Key #2 Active</span>
          </div>
        </div>
      </div>

      {/* Evaluator Verdict Card */}
      {currentRoundData?.evaluation_notes && (
        <div className="bg-[#FAF8F3] border border-border-warm rounded-[16px] p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-3">
            <ShieldCheck className="w-5 h-5 text-olive-primary" />
            <h4 className="font-serif-heading text-[22px] font-medium text-text-primary">
              Debate Evaluator Verdict (Round {activeRoundTab})
            </h4>
          </div>
          <p className="font-sans text-[15px] text-text-secondary leading-relaxed mb-4">
            {currentRoundData.evaluation_notes}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border-warm font-sans text-[13px]">
            <div>
              <span className="text-text-muted">Total Objections Audited: </span>
              <strong className="text-text-primary">
                {currentRoundData.skeptic_challenge?.objections?.length || 0}
              </strong>
            </div>
            <div>
              <span className="text-text-muted">Mitigated: </span>
              <strong className="text-emerald-700 font-semibold">
                {currentRoundData.skeptic_challenge?.objections?.filter((o: Objection) => o.status === 'mitigated').length || 0}
              </strong>
            </div>
            <div>
              <span className="text-text-muted">Partially Mitigated / Open: </span>
              <strong className="text-amber-700 font-semibold">
                {currentRoundData.skeptic_challenge?.objections?.filter((o: Objection) => o.status !== 'mitigated').length || 0}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Completion CTA */}
      {isCompleted && (
        <div className="p-8 rounded-[16px] bg-gradient-to-r from-[#F2EFE8] to-[#FAF8F3] border border-border-warm text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 font-sans text-[12px] font-bold text-olive-primary bg-surface-warm px-3 py-1 rounded-full border border-border-warm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            3-ROUND ADVERSARIAL CONVERGENCE ACHIEVED
          </span>
          <h3 className="font-serif-heading text-[32px] text-text-primary">
            Debate Completed. Recommendation Blueprint Ready.
          </h3>
          <p className="font-sans text-[15px] text-text-secondary max-w-[620px] mx-auto">
            All three adversarial rounds have concluded. Closer AI (Key 1) and Skeptic AI (Key 2) finished deliberation.
          </p>
          <div className="pt-2">
            <Link
              to={`/app/reports/${debate.id}`}
              className="inline-flex items-center gap-2 bg-olive-primary text-surface-warm font-sans text-[16px] font-bold px-8 py-4 rounded-[12px] hover:bg-olive-dark transition-all shadow-md"
            >
              Open Verified Decision Report <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Live Event Log */}
      <div className="bg-surface-warm border border-border-warm rounded-[16px] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border-warm bg-[#FAF8F3] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-text-muted" />
            <h4 className="font-sans text-[13px] font-bold text-text-primary uppercase tracking-wider">
              Reasoning Event Stream
            </h4>
          </div>
          <span className="font-sans text-[12px] text-text-muted">
            {events.length} events recorded
          </span>
        </div>

        <div className="p-4 max-h-[220px] overflow-y-auto space-y-2 font-mono text-[12px]">
          {events.length === 0 ? (
            <div className="text-text-muted italic py-4 text-center">
              Awaiting stream events...
            </div>
          ) : (
            events.map((evt, idx) => (
              <div key={idx} className="flex items-start gap-3 text-text-secondary">
                <span className="text-text-muted shrink-0">
                  {new Date(evt.timestamp).toLocaleTimeString()}
                </span>
                <span className="font-semibold text-olive-primary shrink-0">
                  [{evt.event_type}]
                </span>
                <span className="text-text-primary truncate">
                  {typeof evt.payload === 'string' ? evt.payload : JSON.stringify(evt.payload).slice(0, 100)}...
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

function getSeverityBadge(severity: string) {
  switch (severity) {
    case 'critical':
    case 'high':
      return {
        label: 'HIGH RISK',
        className: 'bg-[#F7EFF1] text-[#451F2D] border border-[#9B747A]/40',
      };
    case 'medium':
      return {
        label: 'MEDIUM RISK',
        className: 'bg-[#FBF4E8] text-[#A88340] border border-[#C7A05A]/40',
      };
    default:
      return {
        label: 'LOW RISK',
        className: 'bg-[#F5F1ED] text-[#6B5B60] border border-[#E2D9D4]',
      };
  }
}

function getResolutionBadge(status: string) {
  switch (status) {
    case 'mitigated':
      return {
        label: '✓ Resolved',
        className: 'text-[#2E5A44] font-bold',
      };
    case 'partially_mitigated':
      return {
        label: '⚠️ Partial',
        className: 'text-[#C7A05A] font-bold',
      };
    default:
      return {
        label: '✕ Open Risk',
        className: 'text-[#9B747A] font-bold',
      };
  }
}
