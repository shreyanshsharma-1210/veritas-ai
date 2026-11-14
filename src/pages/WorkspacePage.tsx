import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Sparkles, 
  Play, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  Activity,
  ChevronRight,
  Cpu
} from 'lucide-react';
import { api } from '../services/api';
import type { SessionHistoryItem } from '../types';

export const WorkspacePage: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [launchingDemo, setLaunchingDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await api.listSessions();
      setSessions(data);
    } catch (err) {
      console.error('Failed to load sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchCanonicalDemo = async () => {
    try {
      setLaunchingDemo(true);
      setError(null);
      // 1. Fetch canonical demo payload
      const canonical = await api.getCanonicalDemo();
      
      // 2. Create diagnosis session
      const diag = await api.createDiagnosis(canonical);

      // 3. Confirm diagnosis
      await api.confirmDiagnosis(diag.id);

      // 4. Create debate
      const debate = await api.createDebate(diag.id);

      // 5. Navigate directly to live debate
      navigate(`/app/session/${debate.debate_id}`);
    } catch (err: any) {
      console.error('Demo launch error:', err);
      setError(err?.message || 'Failed to initialize canonical demo. Ensure backend is running.');
    } finally {
      setLaunchingDemo(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-border-warm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-sans text-[11px] font-bold text-[#C7A05A] tracking-widest uppercase bg-[#F5F1ED] px-2.5 py-0.5 rounded-full border border-[#C7A05A]/40">
              Executive Command
            </span>
          </div>
          <h1 className="font-serif-heading text-[36px] md:text-[44px] font-light text-[#451F2D] leading-tight">
            Decision Intelligence Workspace
          </h1>
          <p className="font-sans text-[15px] text-[#6B5B60]">
            Continuous adversarial reasoning for B2B SaaS retention, pricing, and expansion strategy.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/app/new"
            className="inline-flex items-center gap-2 bg-olive-primary text-surface-warm font-sans text-[14px] font-semibold px-5 py-3 rounded-[10px] hover:bg-olive-dark transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            New Diagnosis
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-[10px] bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 font-sans text-[14px]">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Hero Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Canonical Demo Launcher */}
        <div className="lg:col-span-2 bg-gradient-to-br from-surface-warm to-[#FAF7F0] border border-border-warm rounded-[16px] p-6 md:p-8 relative overflow-hidden shadow-sm flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 font-sans text-[12px] font-bold text-olive-primary bg-[#ECE7DC] px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                CANONICAL HACKATHON BENCHMARK
              </span>
              <span className="font-sans text-[12px] text-text-muted">
                3-Round Adversarial Simulation
              </span>
            </div>

            <h3 className="font-serif-heading text-[28px] md:text-[32px] font-normal text-text-primary mb-2">
              SaaS Month-3 Customer Retention
            </h3>
            <p className="font-sans text-[14px] md:text-[15px] text-text-secondary leading-relaxed mb-6 max-w-[620px]">
              Evaluate how Closer AI formulates a customer telemetry and in-app milestone playbook, while Skeptic AI interrogates engineering bandwidth and false churn alarms, driving to a financially grounded decision.
            </p>

            <div className="grid grid-cols-3 gap-4 py-4 mb-6 border-y border-border-warm/70 text-left">
              <div>
                <span className="block font-sans text-[11px] text-text-muted uppercase tracking-wider">Cohort Baseline</span>
                <span className="font-sans text-[18px] font-bold text-text-primary">M1 71% → M3 44%</span>
              </div>
              <div>
                <span className="block font-sans text-[11px] text-text-muted uppercase tracking-wider">Target Objective</span>
                <span className="font-sans text-[18px] font-bold text-olive-primary">M3 ≥ 52.0%</span>
              </div>
              <div>
                <span className="block font-sans text-[11px] text-text-muted uppercase tracking-wider">Key Constraint</span>
                <span className="font-sans text-[18px] font-bold text-amber-700">0.5 FTE Design</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-4">
            <button
              onClick={handleLaunchCanonicalDemo}
              disabled={launchingDemo}
              className="inline-flex items-center gap-2.5 bg-olive-primary text-surface-warm font-sans text-[15px] font-semibold px-6 py-3.5 rounded-[10px] hover:bg-olive-dark transition-all disabled:opacity-50 shadow-sm"
            >
              {launchingDemo ? (
                <>
                  <div className="w-4 h-4 border-2 border-surface-warm border-t-transparent rounded-full animate-spin"></div>
                  Initializing AI Agents...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  Launch Canonical Demo
                </>
              )}
            </button>
            <Link
              to="/app/new"
              className="font-sans text-[14px] font-medium text-text-secondary hover:text-text-primary inline-flex items-center gap-1.5 transition-colors"
            >
              Or configure custom parameters <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 2: Engine Status & Protocol */}
        <div className="bg-surface-warm border border-border-warm rounded-[16px] p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-4 h-4 text-olive-primary" />
              <span className="font-sans text-[12px] font-bold tracking-wider uppercase text-text-muted">
                Methodology Protocol
              </span>
            </div>
            <h4 className="font-serif-heading text-[22px] font-medium text-text-primary mb-3">
              Three-Tier Logic
            </h4>
            
            <div className="space-y-3 font-sans text-[13px] text-text-secondary">
              <div className="p-2.5 rounded-[8px] bg-[#FAF8F3] border border-border-warm flex items-start gap-2.5">
                <span className="font-bold text-olive-primary">1.</span>
                <span><strong>Mathematical Intake:</strong> Logical checks ensure cohort monotonicity ($M3 \le M1$) and budget feasibility.</span>
              </div>
              <div className="p-2.5 rounded-[8px] bg-[#FAF8F3] border border-border-warm flex items-start gap-2.5">
                <span className="font-bold text-olive-primary">2.</span>
                <span><strong>Adversarial Debate:</strong> Closer proposes, Skeptic challenges with tagged risks, Evaluator audits resolution across max 3 rounds.</span>
              </div>
              <div className="p-2.5 rounded-[8px] bg-[#FAF8F3] border border-border-warm flex items-start gap-2.5">
                <span className="font-bold text-olive-primary">3.</span>
                <span><strong>Deterministic Decision:</strong> Formulaic ARR ROI and open risks highlighted without hallucination.</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border-warm mt-4 flex items-center justify-between text-[12px] font-sans text-text-muted">
            <span>Enforced Stopping: Round 3</span>
            <span className="text-olive-primary font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Zero Fake Output
            </span>
          </div>
        </div>
      </div>

      {/* Benchmark Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-surface-warm border border-border-warm rounded-[12px]">
          <span className="font-sans text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1">
            Total Sessions
          </span>
          <span className="font-serif-heading text-[28px] font-semibold text-text-primary">
            {sessions.length}
          </span>
          <span className="font-sans text-[12px] text-text-muted block mt-1">
            Persisted in SQLite
          </span>
        </div>

        <div className="p-4 bg-surface-warm border border-border-warm rounded-[12px]">
          <span className="font-sans text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1">
            Debate Convergence
          </span>
          <span className="font-serif-heading text-[28px] font-semibold text-olive-primary">
            100%
          </span>
          <span className="font-sans text-[12px] text-text-muted block mt-1">
            Deterministic max 3 rounds
          </span>
        </div>

        <div className="p-4 bg-surface-warm border border-border-warm rounded-[12px]">
          <span className="font-sans text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1">
            Adversarial Audit
          </span>
          <span className="font-serif-heading text-[28px] font-semibold text-text-primary">
            Skeptic Tagging
          </span>
          <span className="font-sans text-[12px] text-text-muted block mt-1">
            Linked to diagnostic fields
          </span>
        </div>

        <div className="p-4 bg-surface-warm border border-border-warm rounded-[12px]">
          <span className="font-sans text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1">
            Execution Mode
          </span>
          <span className="font-serif-heading text-[28px] font-semibold text-text-primary">
            Dual AI / Offline
          </span>
          <span className="font-sans text-[12px] text-text-muted block mt-1">
            Groq Llama 3.3 / Gemini / Mock
          </span>
        </div>
      </div>

      {/* Session History Ledger */}
      <div className="bg-surface-warm border border-border-warm rounded-[16px] overflow-hidden shadow-sm">
        <div className="p-5 border-b border-border-warm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-olive-primary" />
            <h3 className="font-serif-heading text-[20px] font-medium text-text-primary">
              Recent Decision Sessions
            </h3>
          </div>
          <Link
            to="/app/history"
            className="font-sans text-[13px] font-medium text-olive-primary hover:underline inline-flex items-center gap-1"
          >
            View all ledger records <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-text-muted font-sans text-[14px]">
            <div className="w-6 h-6 border-2 border-olive-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            Loading persisted sessions...
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-12 text-center text-text-secondary font-sans">
            <FileText className="w-10 h-10 text-text-muted mx-auto mb-3" />
            <h4 className="font-serif-heading text-[20px] text-text-primary mb-1">No sessions recorded yet</h4>
            <p className="text-[14px] text-text-muted mb-6 max-w-[400px] mx-auto">
              Run your first structured diagnostic questionnaire or trigger the canonical SaaS demo.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleLaunchCanonicalDemo}
                className="inline-flex items-center gap-2 bg-olive-primary text-surface-warm text-[14px] font-semibold px-4 py-2.5 rounded-[8px]"
              >
                <Sparkles className="w-4 h-4" /> Run Canonical Demo
              </button>
              <Link
                to="/app/new"
                className="inline-flex items-center gap-2 border border-border-warm text-[14px] font-medium px-4 py-2.5 rounded-[8px] hover:bg-[#FAF8F3]"
              >
                Create Custom Diagnosis
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-warm bg-[#FAF8F3] text-[12px] font-sans font-semibold text-text-muted uppercase tracking-wider">
                  <th className="py-3 px-6">Company / Session</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Created</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-warm text-[14px] font-sans">
                {sessions.slice(0, 5).map((s) => {
                  const stageBadge = getStageBadge(s.debate_status || s.status);
                  return (
                    <tr key={s.diagnosis_id} className="hover:bg-[#FAF8F3]/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-medium text-text-primary">{s.company_name}</div>
                        <div className="text-[12px] text-text-muted">{s.title} &bull; {s.diagnosis_id.slice(0, 8)}...</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold ${stageBadge.className}`}>
                          {stageBadge.icon}
                          {stageBadge.label}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-text-muted text-[13px]">
                        {new Date(s.created_at).toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {s.debate_status === 'completed' && s.latest_debate_id ? (
                          <Link
                            to={`/app/reports/${s.latest_debate_id}`}
                            className="inline-flex items-center gap-1.5 font-semibold text-olive-primary hover:text-olive-dark transition-colors"
                          >
                            <FileText className="w-4 h-4" /> Recommendation
                          </Link>
                        ) : s.latest_debate_id ? (
                          <Link
                            to={`/app/session/${s.latest_debate_id}`}
                            className="inline-flex items-center gap-1.5 font-semibold text-olive-primary hover:text-olive-dark transition-colors"
                          >
                            <Activity className="w-4 h-4" /> View Debate
                          </Link>
                        ) : (
                          <Link
                            to={`/app/diagnosis/${s.diagnosis_id}`}
                            className="inline-flex items-center gap-1.5 font-semibold text-text-secondary hover:text-text-primary transition-colors"
                          >
                            Open Intake <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

function getStageBadge(stage?: string) {
  switch (stage) {
    case 'completed':
      return {
        label: 'Decided & Verified',
        className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      };
    case 'in_progress':
    case 'debating':
      return {
        label: 'Adversarial Debate Active',
        className: 'bg-amber-50 text-amber-700 border border-amber-200',
        icon: <Activity className="w-3.5 h-3.5 animate-spin" />,
      };
    case 'confirmed':
      return {
        label: 'Intake Confirmed',
        className: 'bg-blue-50 text-blue-700 border border-blue-200',
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      };
    default:
      return {
        label: 'Intake Draft',
        className: 'bg-stone-100 text-stone-700 border border-stone-200',
        icon: <Clock className="w-3.5 h-3.5" />,
      };
  }
}
