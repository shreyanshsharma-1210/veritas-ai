export interface BusinessContext {
  company_name: string;
  industry: string;
  business_model: string;
  stage: string;
  target_customer: string;
}

export interface SaaSMetrics {
  monthly_active_customers: number;
  m1_retention_pct: number;
  m3_retention_pct: number;
  monthly_churn_rate_pct: number;
  cac: number;
  arpu: number;
  ltv?: number | null;
}

export interface ProblemSignals {
  leakage_point: string;
  drop_off_timing: string;
  suspected_causes: string[];
  supporting_evidence: string;
}

export interface Constraints {
  engineering_headcount: number;
  pm_headcount: number;
  design_bandwidth: 'limited' | 'moderate' | 'high';
  budget_usd: number;
  timeline_weeks: number;
}

export interface DesiredOutcome {
  target_metric_name: string;
  target_metric_value: number;
  target_timeline_weeks: number;
}

export interface ValidationIssue {
  field: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  suggested_fix?: string;
}

export interface ValidationResult {
  is_consistent: boolean;
  issues: ValidationIssue[];
  summary: string;
}

export interface DiagnosisCreate {
  title?: string;
  business_context: BusinessContext;
  primary_objective: string;
  metrics: SaaSMetrics;
  problem_signals: ProblemSignals;
  constraints: Constraints;
  desired_outcome: DesiredOutcome;
}

export interface DiagnosisResponse {
  id: string;
  title: string;
  status: 'draft' | 'validated' | 'confirmed';
  business_context: BusinessContext;
  primary_objective: string;
  metrics: SaaSMetrics;
  problem_signals: ProblemSignals;
  constraints: Constraints;
  desired_outcome: DesiredOutcome;
  is_consistent: boolean;
  validation_issues: ValidationIssue[];
  created_at: string;
  updated_at: string;
}

export interface Proposal {
  title: string;
  executive_summary: string;
  intervention_details: string;
  expected_lift_pct: number;
  target_metric_projected: number;
  effort_summary: string;
  timeline_weeks: number;
  key_assumptions: string[];
  confidence_score: number;
  revised_claim?: string;
}

export interface Objection {
  id: string;
  round_number: number;
  objection_code: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  targeted_field: string;
  claim_challenged: string;
  description: string;
  suggested_mitigation: string;
  status: 'open' | 'mitigated' | 'partially_mitigated' | 'unresolved';
  mitigation_text?: string;
  mitigation_evidence?: string;
  evaluation_reasoning?: string;
}

export interface DebateRound {
  round_number: number;
  closer_proposal: Partial<Proposal>;
  skeptic_challenge: {
    summary?: string;
    overall_risk_level?: string;
    objections?: Objection[];
  };
  closer_mitigations: Array<{
    objection_code: string;
    concession_or_defense: string;
    concrete_mitigation: string;
    evidence_or_precedent?: string;
  }>;
  evaluation_notes?: string;
  created_at: string;
}

export interface DebateSession {
  id: string;
  diagnosis_id: string;
  status: string;
  current_round: number;
  max_rounds: number;
  active_provider: string;
  error_message?: string;
  created_at: string;
  completed_at?: string;
  rounds: DebateRound[];
  objections: Objection[];
}

export interface ActionPlanItem {
  step_number: number;
  title: string;
  description: string;
  owner_role: string;
  timeline_week: string;
  effort_level: string;
  deliverable: string;
}

export interface DeterministicImpact {
  baseline_m3_retention_pct: number;
  target_m3_retention_pct: number;
  lift_percentage_points: number;
  estimated_retained_accounts_monthly: number;
  arpu: number;
  annualized_arr_gain_usd: number;
  budget_usd: number;
  net_financial_gain_usd: number;
  roi_percentage: number;
  payback_period_months: number;
  timeline_weeks: number;
  calculation_method: string;
}

export interface Recommendation {
  id: string;
  debate_id: string;
  diagnosis_id: string;
  executive_summary: string;
  recommended_strategy: string;
  action_plan: ActionPlanItem[];
  deterministic_impact: DeterministicImpact;
  resolved_risks: Array<{
    code: string;
    category: string;
    severity: string;
    description: string;
    mitigation: string;
    evidence?: string;
    status: string;
  }>;
  partially_mitigated_risks: Array<{
    code: string;
    category: string;
    severity: string;
    description: string;
    mitigation?: string;
    reasoning?: string;
    status: string;
  }>;
  open_risks: Array<{
    code: string;
    category: string;
    severity: string;
    description: string;
    unresolved_reason: string;
    status: string;
  }>;
  assumptions_to_verify: Array<{
    assumption: string;
    verification_method: string;
    priority: string;
  }>;
  confidence_score: number;
  success_metrics: Array<{
    metric: string;
    baseline: string;
    target: string;
    cadence: string;
  }>;
  created_at: string;
}

export interface SessionHistoryItem {
  diagnosis_id: string;
  title: string;
  company_name: string;
  status: string;
  primary_objective: string;
  m1_retention?: number;
  m3_retention?: number;
  created_at: string;
  latest_debate_id?: string;
  debate_status?: string;
  recommendation_id?: string;
}

export interface SSEEventPayload {
  event_type: string;
  round_number?: number;
  agent?: string;
  action?: string;
  proposal?: Partial<Proposal>;
  objections?: Objection[];
  summary?: string;
  overall_risk?: string;
  mitigations?: Array<{
    objection_code: string;
    concrete_mitigation: string;
  }>;
  evaluation_summary?: string;
  statuses?: Array<{ code: string; status: string }>;
  recommendation_id?: string;
  strategy?: string;
  confidence?: number;
  error?: string;
  message?: string;
}

