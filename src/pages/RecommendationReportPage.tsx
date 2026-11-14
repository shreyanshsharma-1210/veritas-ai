import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Printer, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  Sparkles, 
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import type { 
  Recommendation, 
  DebateSession, 
  DiagnosisResponse,
  ActionPlanItem 
} from '../types';

export const RecommendationReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<Recommendation | null>(null);
  const [debate, setDebate] = useState<DebateSession | null>(null);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadReportData(id);
    }
  }, [id]);

  const loadReportData = async (debateId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Load debate
      const debateData = await api.getDebate(debateId);
      setDebate(debateData);

      if (debateData.diagnosis_id) {
        const diagData = await api.getDiagnosis(debateData.diagnosis_id);
        setDiagnosis(diagData);
      }

      // Fetch recommendation by debate
      const rec = await api.getRecommendationByDebate(debateId);
      setReport(rec);
    } catch (err: any) {
      console.error('Failed to load recommendation:', err);
      setError(err?.message || 'Failed to load recommendation report');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="py-24 text-center font-sans text-text-secondary">
        <div className="w-8 h-8 border-3 border-olive-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[16px]">Compiling Verified Recommendation Blueprint...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="py-24 text-center font-sans">
        <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto mb-3" />
        <h2 className="font-serif-heading text-[24px] text-text-primary mb-2">Report Generation In Progress</h2>
        <p className="text-text-secondary mb-4">{error || 'Recommendation report unavailable'}</p>
        <Link to="/app" className="text-olive-primary font-semibold hover:underline">
          Return to Workspace
        </Link>
      </div>
    );
  }

  const impact = report.deterministic_impact;

  return (
    <div className="max-w-[1080px] mx-auto space-y-8 animate-fadeIn pb-20 print:p-0 print:space-y-6">
      {/* Top Header / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border-warm print:hidden">
        <div className="flex items-center gap-2 text-[13px] font-sans text-text-muted">
          <Link to="/app" className="hover:text-text-primary transition-colors">Workspace</Link>
          <span>/</span>
          {debate && (
            <>
              <Link to={`/app/session/${debate.id}`} className="hover:text-text-primary transition-colors">
                Debate Arena
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-text-primary font-medium">Verified Blueprint</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-surface-warm hover:bg-[#FAF8F3] border border-border-warm text-text-primary font-sans text-[13px] font-semibold px-4 py-2 rounded-[8px] transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4 text-text-muted" />
            Print / Export Blueprint
          </button>
        </div>
      </div>

      {/* Title & Document Badge */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-sans text-[11px] font-bold text-olive-primary tracking-widest uppercase bg-[#F0ECE1] px-2.5 py-0.5 rounded-full border border-border-warm">
            Phase 3: Verified Decision Blueprint
          </span>
          <span className="font-sans text-[12px] text-text-muted">
            Audited across 3 adversarial rounds
          </span>
        </div>

        <h1 className="font-serif-heading text-[38px] md:text-[46px] font-light text-text-primary leading-tight">
          Strategic Recommendation Blueprint
        </h1>

        {diagnosis && (
          <p className="font-sans text-[16px] text-text-secondary">
            Prepared for <strong className="text-text-primary">{diagnosis.business_context.company_name}</strong> &bull; {diagnosis.business_context.industry}
          </p>
        )}
      </div>

      {/* Executive Summary Card */}
      <div className="bg-surface-warm border border-border-warm rounded-[16px] p-6 md:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-olive-primary">
          <Sparkles className="w-5 h-5" />
          <h2 className="font-serif-heading text-[24px] font-medium text-text-primary">
            Executive Decision Summary
          </h2>
        </div>
        <p className="font-sans text-[15px] md:text-[16px] text-text-secondary leading-relaxed">
          {report.executive_summary}
        </p>

        <div className="pt-4 border-t border-border-warm flex flex-wrap items-center gap-6 text-[13px] font-sans text-text-muted">
          <span>Confidence Score: <strong className="text-text-primary font-bold">{(report.confidence_score * 100).toFixed(0)}%</strong></span>
          <span>Adversarial Scrutiny: <strong className="text-olive-primary font-bold">3 Rounds Completed</strong></span>
          <span>Open Risks Disclosed: <strong className="text-amber-700 font-bold">{report.open_risks.length} Unresolved</strong></span>
        </div>
      </div>

      {/* Strategic Recommendation */}
      <div className="bg-surface-warm border border-border-warm rounded-[16px] p-6 md:p-8 shadow-sm space-y-4">
        <h3 className="font-serif-heading text-[24px] font-medium text-text-primary">
          Strategic Architecture & Core Thesis
        </h3>
        <p className="font-sans text-[16px] text-text-secondary leading-relaxed font-serif-heading">
          "{report.recommended_strategy}"
        </p>
      </div>

      {/* Deterministic Financial & Metric Impact Card */}
      {impact && (
        <div className="bg-gradient-to-br from-surface-warm to-[#FAF7F0] border border-border-warm rounded-[16px] p-6 md:p-8 shadow-sm space-y-6">
          <div>
            <span className="font-sans text-[11px] font-bold text-olive-primary uppercase tracking-wider block mb-1">
              Empirical ROI Engine
            </span>
            <h3 className="font-serif-heading text-[26px] font-medium text-text-primary">
              Deterministic Metric & ARR Impact
            </h3>
            <p className="font-sans text-[14px] text-text-muted">
              Calculated strictly from diagnostic cohort parameters ({impact.calculation_method}) &mdash; zero ungrounded extrapolation.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-surface-warm border border-border-warm rounded-[12px]">
              <span className="font-sans text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                Retention Delta
              </span>
              <div className="font-serif-heading text-[26px] font-bold text-olive-primary">
                +{impact.lift_percentage_points.toFixed(1)}%
              </div>
              <span className="font-sans text-[12px] text-text-muted block mt-1">
                {impact.baseline_m3_retention_pct}% &rarr; {impact.target_m3_retention_pct}%
              </span>
            </div>

            <div className="p-4 bg-surface-warm border border-border-warm rounded-[12px]">
              <span className="font-sans text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                Retained Accounts
              </span>
              <div className="font-serif-heading text-[26px] font-bold text-text-primary">
                {impact.estimated_retained_accounts_monthly * 12}
              </div>
              <span className="font-sans text-[12px] text-text-muted block mt-1">
                Annualized accounts saved
              </span>
            </div>

            <div className="p-4 bg-surface-warm border border-border-warm rounded-[12px]">
              <span className="font-sans text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                Annualized ARR Gain
              </span>
              <div className="font-serif-heading text-[26px] font-bold text-emerald-700">
                ${(impact.annualized_arr_gain_usd / 1000).toFixed(0)}k
              </div>
              <span className="font-sans text-[12px] text-text-muted block mt-1">
                Net: ${(impact.net_financial_gain_usd / 1000).toFixed(0)}k
              </span>
            </div>

            <div className="p-4 bg-surface-warm border border-border-warm rounded-[12px]">
              <span className="font-sans text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                Projected ROI
              </span>
              <div className="font-serif-heading text-[26px] font-bold text-text-primary">
                {impact.roi_percentage.toFixed(0)}%
              </div>
              <span className="font-sans text-[12px] text-text-muted block mt-1">
                Payback: {impact.payback_period_months} mo
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Prioritized 4-Week Action Plan */}
      <div className="bg-surface-warm border border-border-warm rounded-[16px] p-6 md:p-8 shadow-sm space-y-6">
        <div>
          <h3 className="font-serif-heading text-[26px] font-medium text-text-primary mb-1">
            Prioritized 4-Week Action Plan
          </h3>
          <p className="font-sans text-[14px] text-text-secondary">
            Milestone schedule sequenced to respect the constrained design and engineering bandwidth.
          </p>
        </div>

        <div className="space-y-4">
          {report.action_plan.map((step: ActionPlanItem, idx: number) => (
            <div
              key={idx}
              className="p-5 rounded-[12px] bg-[#FAF8F3] border border-border-warm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-olive-primary text-surface-warm flex items-center justify-center font-bold font-sans text-[13px] shrink-0 mt-0.5">
                  0{step.step_number}
                </span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-sans text-[11px] font-bold text-olive-primary uppercase bg-[#EBE5D8] px-2 py-0.5 rounded">
                      {step.timeline_week}
                    </span>
                    <h4 className="font-sans text-[15px] font-bold text-text-primary">
                      {step.title}
                    </h4>
                  </div>
                  <p className="font-sans text-[13px] text-text-secondary">
                    {step.description}
                  </p>
                  <p className="font-sans text-[12px] text-text-muted mt-1">
                    <strong>Deliverable:</strong> {step.deliverable}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[12px] font-sans text-text-muted shrink-0 md:text-right">
                <div>
                  <span className="block text-text-muted">Owner:</span>
                  <span className="font-semibold text-text-primary">{step.owner_role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Disclosures: Resolved vs Open Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Resolved Risks */}
        <div className="bg-surface-warm border border-emerald-200 rounded-[16px] p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border-warm text-emerald-800">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-serif-heading text-[20px] font-medium text-text-primary">
              Resolved Objections ({report.resolved_risks.length})
            </h3>
          </div>

          <div className="space-y-3 font-sans">
            {report.resolved_risks.length === 0 ? (
              <p className="text-[13px] text-text-muted">No resolved risks recorded.</p>
            ) : (
              report.resolved_risks.map((r, i: number) => (
                <div key={i} className="p-3.5 rounded-[10px] bg-emerald-50/50 border border-emerald-100 text-[13px] space-y-1">
                  <div className="font-bold text-text-primary">
                    [{r.code}] {r.description}
                  </div>
                  <div className="text-emerald-900">
                    <strong className="text-emerald-800">Verified Mitigation:</strong> {r.mitigation}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Unresolved / Open Residual Risks */}
        <div className="bg-[#FFFFFF] border border-[#9B747A]/40 rounded-[16px] p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E2D9D4] text-[#451F2D]">
            <ShieldAlert className="w-5 h-5 text-[#9B747A]" />
            <h3 className="font-serif-heading text-[20px] font-medium text-[#451F2D]">
              Open Residual Risks ({report.open_risks.length})
            </h3>
          </div>

          <div className="space-y-3 font-sans">
            {report.open_risks.length === 0 ? (
              <p className="text-[13px] text-[#94858A]">No open risks flagged.</p>
            ) : (
              report.open_risks.map((r, i: number) => (
                <div key={i} className="p-3.5 rounded-[10px] bg-[#F7EFF1] border border-[#9B747A]/30 text-[13px] space-y-1">
                  <div className="font-bold text-[#451F2D]">
                    [{r.code}] {r.description}
                  </div>
                  <div className="text-[#6B5B60]">
                    <strong>Audit Status:</strong> {r.unresolved_reason}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Assumptions to Verify */}
      <div className="bg-surface-warm border border-border-warm rounded-[16px] p-6 md:p-8 shadow-sm space-y-4">
        <h3 className="font-serif-heading text-[22px] font-medium text-text-primary">
          Core Assumptions to Empirically Verify
        </h3>
        <p className="font-sans text-[14px] text-text-secondary">
          Checklist of prerequisites to monitor during Week 1 before releasing full engineering commitment:
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans text-[13px]">
          {report.assumptions_to_verify.map((assump, idx: number) => (
            <li
              key={idx}
              className="p-3 rounded-[10px] bg-[#FAF8F3] border border-border-warm flex items-start gap-2.5 text-text-primary"
            >
              <CheckCircle2 className="w-4 h-4 text-olive-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">{assump.assumption}</span>
                <span className="text-[11px] text-text-muted">{assump.verification_method}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Return Action */}
      <div className="pt-6 border-t border-border-warm flex items-center justify-between font-sans text-[14px] print:hidden">
        <Link
          to="/app"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Workspace
        </Link>
        <Link
          to="/app/new"
          className="inline-flex items-center gap-2 bg-olive-primary text-surface-warm font-semibold px-5 py-2.5 rounded-[8px] hover:bg-olive-dark transition-colors shadow-xs"
        >
          Start Another Diagnostic Session <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
