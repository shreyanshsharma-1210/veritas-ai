import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Save, 
  ShieldAlert, 
  Play
} from 'lucide-react';
import { api } from '../services/api';
import type { 
  DiagnosisCreate, 
  DiagnosisResponse, 
  ValidationResult 
} from '../types';

const defaultDiagnosis: DiagnosisCreate = {
  title: 'SaaS Month-3 Customer Retention Optimization',
  business_context: {
    company_name: 'Acme SaaS Analytics',
    industry: 'B2B Analytics',
    business_model: 'Subscription B2B SaaS',
    stage: 'Series B Growth',
    target_customer: 'Mid-Market Marketing Operations Teams',
  },
  primary_objective: 'Arrest Month-3 customer retention collapse and build repeatable activation habit loops.',
  metrics: {
    monthly_active_customers: 250,
    m1_retention_pct: 71.0,
    m3_retention_pct: 44.0,
    monthly_churn_rate_pct: 5.2,
    cac: 1200,
    arpu: 400, // $4,800 ACV
  },
  problem_signals: {
    leakage_point: 'Between Day 21 and Day 30 during transition from setup to daily workflow',
    drop_off_timing: 'Day 21 to Day 30',
    suspected_causes: [
      'Lack of recurring daily habit formation',
      'Generic non-contextual email drip campaigns at day 14 and 28',
      'Missing milestone telemetry triggers',
    ],
    supporting_evidence: 'Telemetry logs show only 18% of accounts execute more than 2 report queries after week 2.',
  },
  constraints: {
    engineering_headcount: 1,
    pm_headcount: 1,
    design_bandwidth: 'limited',
    budget_usd: 35000,
    timeline_weeks: 4,
  },
  desired_outcome: {
    target_metric_name: 'Month-3 Cohort Retention Rate',
    target_metric_value: 52.0,
    target_timeline_weeks: 4,
  },
};

export const DiagnosisWizardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [sessionId, setSessionId] = useState<string | null>(id || null);
  const [formData, setFormData] = useState<DiagnosisCreate>(defaultDiagnosis);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing session if editing
  useEffect(() => {
    if (id) {
      loadSession(id);
    }
  }, [id]);

  const loadSession = async (sid: string) => {
    try {
      const session: DiagnosisResponse = await api.getDiagnosis(sid);
      setSessionId(session.id);
      setFormData({
        title: session.title,
        business_context: session.business_context,
        primary_objective: session.primary_objective,
        metrics: session.metrics,
        problem_signals: session.problem_signals,
        constraints: session.constraints,
        desired_outcome: session.desired_outcome,
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to load diagnosis session');
    }
  };

  const handlePreFillCanonicalDemo = async () => {
    try {
      const canonical = await api.getCanonicalDemo();
      setFormData(canonical);
      validateData(canonical);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch canonical demo parameters');
    }
  };

  const validateData = async (payload: DiagnosisCreate = formData) => {
    try {
      const res = await api.validateDiagnosis(payload);
      setValidation(res);
      return res;
    } catch (err: any) {
      console.error('Validation error:', err);
      return null;
    }
  };

  // Run validation whenever numbers change
  useEffect(() => {
    validateData(formData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formData.metrics.m1_retention_pct, 
    formData.metrics.m3_retention_pct, 
    formData.desired_outcome.target_metric_value, 
    formData.metrics.monthly_active_customers, 
    formData.metrics.arpu
  ]);

  const handleSaveDraft = async () => {
    try {
      setSaving(true);
      setError(null);
      const created = await api.createDiagnosis(formData);
      setSessionId(created.id);
    } catch (err: any) {
      setError(err?.message || 'Failed to save diagnosis draft');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmAndDebate = async () => {
    try {
      setSaving(true);
      setError(null);

      // Validate first
      const v = await validateData(formData);
      if (v && !v.is_consistent) {
        const errorMsgs = v.issues.filter(i => i.severity === 'error').map(i => i.message);
        if (errorMsgs.length > 0) {
          setError(`Please fix validation errors: ${errorMsgs.join('; ')}`);
          setSaving(false);
          return;
        }
      }

      // Save or reuse
      let activeId = sessionId;
      if (!activeId) {
        const created = await api.createDiagnosis(formData);
        activeId = created.id;
        setSessionId(created.id);
      }

      // Confirm session
      await api.confirmDiagnosis(activeId);

      // Create debate
      const debate = await api.createDebate(activeId);

      // Navigate to live debate room
      navigate(`/app/session/${debate.debate_id}`);
    } catch (err: any) {
      setError(err?.message || 'Failed to initialize debate orchestration');
      setSaving(false);
    }
  };

  const cohortDecayViolation = formData.metrics.m3_retention_pct > formData.metrics.m1_retention_pct;

  return (
    <div className="max-w-[1080px] mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Top Breadcrumb & Benchmark Pre-fill Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border-warm">
        <div className="flex items-center gap-2 text-[13px] font-sans text-text-muted">
          <Link to="/app" className="hover:text-text-primary transition-colors">Workspace</Link>
          <span>/</span>
          <span className="text-text-primary font-medium">Diagnostic Discovery</span>
        </div>

        <button
          onClick={handlePreFillCanonicalDemo}
          className="inline-flex items-center gap-2 bg-[#F3EFE6] hover:bg-[#EBE5D8] border border-border-warm text-olive-primary font-sans text-[13px] font-semibold px-4 py-2 rounded-[8px] transition-all shadow-xs"
        >
          <Sparkles className="w-4 h-4 text-olive-primary" />
          Pre-fill Canonical SaaS Retention Benchmark
        </button>
      </div>

      {/* Main Header */}
      <div>
        <span className="font-sans text-[11px] font-bold text-olive-primary tracking-widest uppercase bg-[#F0ECE1] px-2.5 py-0.5 rounded-full border border-border-warm">
          Phase 1: Structured Discovery
        </span>
        <h1 className="font-serif-heading text-[36px] md:text-[42px] font-light text-text-primary mt-1 mb-2">
          Diagnostic Intake & Fact Architecture
        </h1>
        <p className="font-sans text-[15px] text-text-secondary leading-relaxed max-w-[760px]">
          Before Closer and Skeptic agents can debate, we ground the session with empirical business metrics, drop-off signals, and physical constraints. No hallucinations permitted.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-[12px] bg-red-50 border border-red-200 text-red-700 flex items-start gap-3 font-sans text-[14px]">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Execution Blocked</div>
            <div>{error}</div>
          </div>
        </div>
      )}

      {/* Cohort Decay Law Alert */}
      {cohortDecayViolation && (
        <div className="p-4 rounded-[12px] bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3 font-sans text-[14px]">
          <ShieldAlert className="w-5 h-5 shrink-0 text-amber-700 mt-0.5" />
          <div>
            <div className="font-bold">Cohort Monotonicity Rule Violation</div>
            <div>
              Month-3 retention ({formData.metrics.m3_retention_pct}%) cannot exceed Month-1 retention ({formData.metrics.m1_retention_pct}%). Cumulative cohort decay requires $M3 \le M1$.
            </div>
          </div>
        </div>
      )}

      {/* Stepper Progress Bar */}
      <div className="grid grid-cols-5 gap-2 border-b border-border-warm pb-6">
        {[
          { num: 1, title: 'Context & ICP' },
          { num: 2, title: 'Cohort Economics' },
          { num: 3, title: 'Drop-off Signals' },
          { num: 4, title: 'Constraints' },
          { num: 5, title: 'Verify & Launch' },
        ].map((s) => {
          const isActive = currentStep === s.num;
          const isDone = currentStep > s.num;
          return (
            <button
              key={s.num}
              onClick={() => setCurrentStep(s.num)}
              className={`text-left p-3 rounded-[10px] transition-all border ${
                isActive
                  ? 'bg-surface-warm border-olive-primary shadow-xs'
                  : isDone
                  ? 'bg-[#FAF8F3] border-border-warm'
                  : 'bg-transparent border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-1.5 font-sans text-[11px] font-bold text-olive-primary uppercase mb-1">
                {isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <span>Step 0{s.num}</span>}
              </div>
              <div className="font-sans text-[13px] font-semibold text-text-primary truncate">
                {s.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Step Panels */}
      <div className="bg-surface-warm border border-border-warm rounded-[16px] p-6 md:p-8 shadow-sm">
        {/* Step 1: Business Context & ICP */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="font-serif-heading text-[26px] font-normal text-text-primary mb-1">
                Step 1: Business Context & Problem Statement
              </h2>
              <p className="font-sans text-[14px] text-text-secondary">
                Identify the target enterprise profile, commercial model, and acute operational breakdown.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-sans text-[13px] font-semibold text-text-primary mb-2">
                  Company / Product Name
                </label>
                <input
                  type="text"
                  value={formData.business_context.company_name}
                  onChange={(e) => setFormData({
                    ...formData,
                    business_context: { ...formData.business_context, company_name: e.target.value }
                  })}
                  className="w-full bg-[#FAF8F3] border border-border-warm rounded-[10px] px-4 py-3 font-sans text-[14px] focus:outline-none focus:border-olive-primary"
                />
              </div>

              <div>
                <label className="block font-sans text-[13px] font-semibold text-text-primary mb-2">
                  Industry & Domain
                </label>
                <input
                  type="text"
                  value={formData.business_context.industry}
                  onChange={(e) => setFormData({
                    ...formData,
                    business_context: { ...formData.business_context, industry: e.target.value }
                  })}
                  className="w-full bg-[#FAF8F3] border border-border-warm rounded-[10px] px-4 py-3 font-sans text-[14px] focus:outline-none focus:border-olive-primary"
                />
              </div>

              <div>
                <label className="block font-sans text-[13px] font-semibold text-text-primary mb-2">
                  Target Customer / ICP
                </label>
                <input
                  type="text"
                  value={formData.business_context.target_customer}
                  onChange={(e) => setFormData({
                    ...formData,
                    business_context: { ...formData.business_context, target_customer: e.target.value }
                  })}
                  className="w-full bg-[#FAF8F3] border border-border-warm rounded-[10px] px-4 py-3 font-sans text-[14px] focus:outline-none focus:border-olive-primary"
                />
              </div>

              <div>
                <label className="block font-sans text-[13px] font-semibold text-text-primary mb-2">
                  Business Model & Stage
                </label>
                <input
                  type="text"
                  value={formData.business_context.business_model}
                  onChange={(e) => setFormData({
                    ...formData,
                    business_context: { ...formData.business_context, business_model: e.target.value }
                  })}
                  className="w-full bg-[#FAF8F3] border border-border-warm rounded-[10px] px-4 py-3 font-sans text-[14px] focus:outline-none focus:border-olive-primary"
                />
              </div>
            </div>

            <div>
              <label className="block font-sans text-[13px] font-semibold text-text-primary mb-2">
                Primary Objective Statement
              </label>
              <textarea
                rows={3}
                value={formData.primary_objective}
                onChange={(e) => setFormData({ ...formData, primary_objective: e.target.value })}
                className="w-full bg-[#FAF8F3] border border-border-warm rounded-[10px] px-4 py-3 font-sans text-[14px] focus:outline-none focus:border-olive-primary leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Step 2: Cohort Economics */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="font-serif-heading text-[26px] font-normal text-text-primary mb-1">
                Step 2: Quantitative Cohort Economics
              </h2>
              <p className="font-sans text-[14px] text-text-secondary">
                Exact baseline measurements used by the deterministic calculation engine for ARR, retained accounts, and payback.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-sans text-[13px] font-semibold text-text-primary mb-1">
                  Monthly Active Customers / New Cohort Size
                </label>
                <input
                  type="number"
                  value={formData.metrics.monthly_active_customers}
                  onChange={(e) => setFormData({
                    ...formData,
                    metrics: { ...formData.metrics, monthly_active_customers: Number(e.target.value) }
                  })}
                  className="w-full bg-[#FAF8F3] border border-border-warm rounded-[10px] px-4 py-3 font-sans text-[14px] focus:outline-none focus:border-olive-primary"
                />
              </div>

              <div>
                <label className="block font-sans text-[13px] font-semibold text-text-primary mb-1">
                  Monthly ARPU ($)
                </label>
                <input
                  type="number"
                  value={formData.metrics.arpu}
                  onChange={(e) => setFormData({
                    ...formData,
                    metrics: { ...formData.metrics, arpu: Number(e.target.value) }
                  })}
                  className="w-full bg-[#FAF8F3] border border-border-warm rounded-[10px] px-4 py-3 font-sans text-[14px] focus:outline-none focus:border-olive-primary"
                />
              </div>

              <div>
                <label className="block font-sans text-[13px] font-semibold text-text-primary mb-1">
                  Current Month-1 Retention (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.metrics.m1_retention_pct}
                  onChange={(e) => setFormData({
                    ...formData,
                    metrics: { ...formData.metrics, m1_retention_pct: Number(e.target.value) }
                  })}
                  className="w-full bg-[#FAF8F3] border border-border-warm rounded-[10px] px-4 py-3 font-sans text-[14px] focus:outline-none focus:border-olive-primary"
                />
              </div>

              <div>
                <label className="block font-sans text-[13px] font-semibold text-text-primary mb-1">
                  Current Month-3 Retention (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.metrics.m3_retention_pct}
                  onChange={(e) => setFormData({
                    ...formData,
                    metrics: { ...formData.metrics, m3_retention_pct: Number(e.target.value) }
                  })}
                  className="w-full bg-[#FAF8F3] border border-border-warm rounded-[10px] px-4 py-3 font-sans text-[14px] focus:outline-none focus:border-olive-primary"
                />
              </div>

              <div>
                <label className="block font-sans text-[13px] font-semibold text-text-primary mb-1">
                  Target Month-3 Retention (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.desired_outcome.target_metric_value}
                  onChange={(e) => setFormData({
                    ...formData,
                    desired_outcome: { ...formData.desired_outcome, target_metric_value: Number(e.target.value) }
                  })}
                  className="w-full bg-[#FAF8F3] border border-border-warm rounded-[10px] px-4 py-3 font-sans text-[14px] focus:outline-none focus:border-olive-primary"
                />
              </div>

              <div>
                <label className="block font-sans text-[13px] font-semibold text-text-primary mb-1">
                  Monthly Churn Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.metrics.monthly_churn_rate_pct}
                  onChange={(e) => setFormData({
                    ...formData,
                    metrics: { ...formData.metrics, monthly_churn_rate_pct: Number(e.target.value) }
                  })}
                  className="w-full bg-[#FAF8F3] border border-border-warm rounded-[10px] px-4 py-3 font-sans text-[14px] focus:outline-none focus:border-olive-primary"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Drop-off Signals */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="font-serif-heading text-[26px] font-normal text-text-primary mb-1">
                Step 3: Drop-Off Signals & Behavioral Friction
              </h2>
              <p className="font-sans text-[14px] text-text-secondary">
                Qualitative diagnostic facts Skeptic and Closer agents inspect to form objections and mitigations.
              </p>
            </div>

            <div>
              <label className="block font-sans text-[13px] font-semibold text-text-primary mb-2">
                Primary Leakage Point
              </label>
              <textarea
                rows={2}
                value={formData.problem_signals.leakage_point}
                onChange={(e) => setFormData({
                  ...formData,
                  problem_signals: { ...formData.problem_signals, leakage_point: e.target.value }
                })}
                className="w-full bg-[#FAF8F3] border border-border-warm rounded-[10px] px-4 py-3 font-sans text-[14px] focus:outline-none focus:border-olive-primary"
              />
            </div>

            <div>
              <label className="block font-sans text-[13px] font-semibold text-text-primary mb-2">
                Drop-Off Milestone / Timing Window
              </label>
              <input
                type="text"
                value={formData.problem_signals.drop_off_timing}
                onChange={(e) => setFormData({
                  ...formData,
                  problem_signals: { ...formData.problem_signals, drop_off_timing: e.target.value }
                })}
                className="w-full bg-[#FAF8F3] border border-border-warm rounded-[10px] px-4 py-3 font-sans text-[14px] focus:outline-none focus:border-olive-primary"
              />
            </div>

            <div>
              <label className="block font-sans text-[13px] font-semibold text-text-primary mb-2">
                Supporting Evidence & Telemetry Findings
              </label>
              <textarea
                rows={3}
                value={formData.problem_signals.supporting_evidence}
                onChange={(e) => setFormData({
                  ...formData,
                  problem_signals: { ...formData.problem_signals, supporting_evidence: e.target.value }
                })}
                className="w-full bg-[#FAF8F3] border border-border-warm rounded-[10px] px-4 py-3 font-sans text-[14px] focus:outline-none focus:border-olive-primary"
              />
            </div>
          </div>
        )}

        {/* Step 4: Constraints & Resources */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="font-serif-heading text-[26px] font-normal text-text-primary mb-1">
                Step 4: Operational & Resource Constraints
              </h2>
              <p className="font-sans text-[14px] text-text-secondary">
                Physical limits that Skeptic AI uses to prevent unrealistic, over-engineered proposals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-sans text-[13px] font-semibold text-text-primary mb-2">
                  Engineering Headcount
                </label>
                <input
                  type="number"
                  value={formData.constraints.engineering_headcount}
                  onChange={(e) => setFormData({
                    ...formData,
                    constraints: { ...formData.constraints, engineering_headcount: Number(e.target.value) }
                  })}
                  className="w-full bg-[#FAF8F3] border border-border-warm rounded-[10px] px-4 py-3 font-sans text-[14px] focus:outline-none focus:border-olive-primary"
                />
              </div>

              <div>
                <label className="block font-sans text-[13px] font-semibold text-text-primary mb-2">
                  Design Bandwidth Available
                </label>
                <select
                  value={formData.constraints.design_bandwidth}
                  onChange={(e) => setFormData({
                    ...formData,
                    constraints: { ...formData.constraints, design_bandwidth: e.target.value as any }
                  })}
                  className="w-full bg-[#FAF8F3] border border-border-warm rounded-[10px] px-4 py-3 font-sans text-[14px] focus:outline-none focus:border-olive-primary"
                >
                  <option value="limited">Limited (0.5 FTE)</option>
                  <option value="moderate">Moderate (1.0 FTE)</option>
                  <option value="high">High (&gt;1.5 FTE)</option>
                </select>
              </div>

              <div>
                <label className="block font-sans text-[13px] font-semibold text-text-primary mb-2">
                  Implementation Budget Available ($)
                </label>
                <input
                  type="number"
                  value={formData.constraints.budget_usd}
                  onChange={(e) => setFormData({
                    ...formData,
                    constraints: { ...formData.constraints, budget_usd: Number(e.target.value) }
                  })}
                  className="w-full bg-[#FAF8F3] border border-border-warm rounded-[10px] px-4 py-3 font-sans text-[14px] focus:outline-none focus:border-olive-primary"
                />
              </div>

              <div>
                <label className="block font-sans text-[13px] font-semibold text-text-primary mb-2">
                  Execution Window (Weeks)
                </label>
                <input
                  type="number"
                  value={formData.constraints.timeline_weeks}
                  onChange={(e) => setFormData({
                    ...formData,
                    constraints: { ...formData.constraints, timeline_weeks: Number(e.target.value) }
                  })}
                  className="w-full bg-[#FAF8F3] border border-border-warm rounded-[10px] px-4 py-3 font-sans text-[14px] focus:outline-none focus:border-olive-primary"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review & Consistency Validation */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="font-serif-heading text-[26px] font-normal text-text-primary mb-1">
                Step 5: Architectural Review & Consistency Verification
              </h2>
              <p className="font-sans text-[14px] text-text-secondary">
                Confirm your diagnostic baseline before initiating the multi-agent debate session.
              </p>
            </div>

            {/* Validation Status Box */}
            <div className={`p-4 rounded-[12px] border font-sans text-[14px] ${
              validation?.is_consistent 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}>
              <div className="flex items-center gap-2 font-bold mb-1">
                {validation?.is_consistent ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Mathematical Consistency Verified</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <span>Inconsistencies Detected</span>
                  </>
                )}
              </div>
              {validation?.summary && (
                <p className="text-[13px] text-stone-700 mt-1">{validation.summary}</p>
              )}
              {validation?.issues && validation.issues.length > 0 && (
                <ul className="list-disc list-inside text-[13px] space-y-1 mt-2">
                  {validation.issues.map((issue, idx: number) => (
                    <li key={idx}>
                      <strong>[{issue.severity.toUpperCase()}]</strong> {issue.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Structured Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#FAF8F3] border border-border-warm rounded-[12px]">
                <h4 className="font-sans text-[12px] font-bold text-text-muted uppercase tracking-wider mb-2">
                  Company & Domain
                </h4>
                <div className="font-medium text-text-primary text-[15px]">{formData.business_context.company_name}</div>
                <div className="text-[13px] text-text-secondary">{formData.business_context.industry} &bull; {formData.business_context.stage}</div>
                <div className="text-[13px] text-text-secondary mt-2 line-clamp-2">{formData.primary_objective}</div>
              </div>

              <div className="p-4 bg-[#FAF8F3] border border-border-warm rounded-[12px]">
                <h4 className="font-sans text-[12px] font-bold text-text-muted uppercase tracking-wider mb-2">
                  Cohort & Economic Math
                </h4>
                <div className="text-[13px] text-text-secondary">
                  Monthly Cohort: <strong className="text-text-primary">{formData.metrics.monthly_active_customers} accounts</strong>
                </div>
                <div className="text-[13px] text-text-secondary">
                  Retention Decay: <strong className="text-text-primary">{formData.metrics.m1_retention_pct}% M1 → {formData.metrics.m3_retention_pct}% M3</strong>
                </div>
                <div className="text-[13px] text-text-secondary">
                  Target Goal: <strong className="text-olive-primary">{formData.desired_outcome.target_metric_value}% M3</strong> (+{(formData.desired_outcome.target_metric_value - formData.metrics.m3_retention_pct).toFixed(1)}% lift)
                </div>
                <div className="text-[13px] text-text-secondary">
                  Monthly ARPU: <strong className="text-text-primary">${formData.metrics.arpu}</strong> (ACV: ${(formData.metrics.arpu * 12).toLocaleString()})
                </div>
              </div>

              <div className="p-4 bg-[#FAF8F3] border border-border-warm rounded-[12px]">
                <h4 className="font-sans text-[12px] font-bold text-text-muted uppercase tracking-wider mb-2">
                  Behavioral Friction
                </h4>
                <div className="text-[13px] text-text-secondary line-clamp-2">
                  <strong>Leakage:</strong> {formData.problem_signals.leakage_point}
                </div>
                <div className="text-[13px] text-text-secondary mt-1">
                  <strong>Drop-off Window:</strong> {formData.problem_signals.drop_off_timing}
                </div>
              </div>

              <div className="p-4 bg-[#FAF8F3] border border-border-warm rounded-[12px]">
                <h4 className="font-sans text-[12px] font-bold text-text-muted uppercase tracking-wider mb-2">
                  Active Constraints
                </h4>
                <div className="text-[13px] text-text-secondary">
                  Budget: <strong className="text-text-primary">${formData.constraints.budget_usd.toLocaleString()}</strong>
                </div>
                <div className="text-[13px] text-text-secondary">
                  Bandwidth: <strong className="text-text-primary">{formData.constraints.engineering_headcount} Eng, {formData.constraints.design_bandwidth} Design</strong>
                </div>
                <div className="text-[13px] text-text-secondary">
                  Timeline: <strong className="text-text-primary">{formData.constraints.timeline_weeks} weeks</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stepper Navigation Buttons */}
        <div className="flex items-center justify-between pt-8 border-t border-border-warm mt-8">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="inline-flex items-center gap-1.5 font-sans text-[14px] font-semibold text-text-secondary hover:text-text-primary px-4 py-2.5 rounded-[8px] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={saving}
              className="inline-flex items-center gap-1.5 border border-border-warm bg-surface-warm hover:bg-[#FAF8F3] font-sans text-[14px] font-semibold text-text-primary px-4 py-2.5 rounded-[8px] transition-colors"
            >
              <Save className="w-4 h-4 text-text-muted" />
              {saving ? 'Saving...' : 'Save Draft'}
            </button>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="inline-flex items-center gap-1.5 bg-olive-primary text-surface-warm font-sans text-[14px] font-semibold px-6 py-2.5 rounded-[8px] hover:bg-olive-dark transition-colors shadow-xs"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirmAndDebate}
                disabled={saving || (validation ? !validation.is_consistent : false)}
                className="inline-flex items-center gap-2 bg-olive-primary text-surface-warm font-sans text-[15px] font-bold px-7 py-3 rounded-[10px] hover:bg-olive-dark transition-all disabled:opacity-50 shadow-sm"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-surface-warm border-t-transparent rounded-full animate-spin"></div>
                    Deploying Agents...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    Confirm & Launch Debate
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
