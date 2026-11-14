from typing import Dict, Any


def calculate_retention_lift(baseline_m3: float, target_m3: float) -> float:
    """Calculates absolute percentage point lift in retention."""
    return round(target_m3 - baseline_m3, 2)


def calculate_retained_accounts_monthly(active_customers: int, baseline_m3: float, target_m3: float) -> int:
    """
    Estimates the additional number of cohorts/accounts preserved per month
    from the retention lift on an active cohort base.
    """
    lift_fraction = max(0.0, (target_m3 - baseline_m3) / 100.0)
    # Estimated monthly incoming/maturing cohort size (assuming standard distribution)
    monthly_maturing_cohort = max(10, int(active_customers * 0.15))
    saved_per_cohort = int(monthly_maturing_cohort * lift_fraction)
    return max(1, saved_per_cohort)


def calculate_annualized_revenue_gain(
    retained_accounts_per_month: int,
    arpu: float,
    months_retained_avg: int = 12
) -> float:
    """
    Calculates annualized incremental recurring revenue gained by compounding
    retained customers across a 12-month window.
    """
    monthly_run_rate_addition = retained_accounts_per_month * arpu
    # Compounding cumulative run-rate across 12 months
    annualized_benefit = monthly_run_rate_addition * months_retained_avg
    return round(annualized_benefit, 2)


def calculate_financial_roi(annual_revenue_gain: float, implementation_cost: float) -> Dict[str, Any]:
    """
    Deterministically computes Net Benefit, ROI percentage, and Payback period in months.
    """
    net_benefit = annual_revenue_gain - implementation_cost
    roi_pct = round((net_benefit / implementation_cost) * 100.0, 1) if implementation_cost > 0 else 0.0
    
    # Payback period in months
    monthly_gain = annual_revenue_gain / 12.0 if annual_revenue_gain > 0 else 0.0
    payback_months = round(implementation_cost / monthly_gain, 1) if monthly_gain > 0 else 99.0
    
    return {
        "annual_revenue_gain": round(annual_revenue_gain, 2),
        "implementation_cost": round(implementation_cost, 2),
        "net_benefit": round(net_benefit, 2),
        "roi_pct": roi_pct,
        "payback_months": min(24.0, payback_months),
        "formula": "ROI = ((Annualized Revenue Gain - Implementation Cost) / Implementation Cost) * 100"
    }


def compute_deterministic_impact_assessment(
    active_customers: int,
    baseline_m3: float,
    target_m3: float,
    arpu: float,
    budget_usd: float,
    timeline_weeks: int
) -> Dict[str, Any]:
    """
    Produces complete deterministic financial and impact assessment for final recommendation.
    """
    lift_pts = calculate_retention_lift(baseline_m3, target_m3)
    accounts_saved = calculate_retained_accounts_monthly(active_customers, baseline_m3, target_m3)
    annual_revenue = calculate_annualized_revenue_gain(accounts_saved, arpu)
    roi_data = calculate_financial_roi(annual_revenue, budget_usd)
    
    return {
        "baseline_m3_retention_pct": baseline_m3,
        "target_m3_retention_pct": target_m3,
        "lift_percentage_points": lift_pts,
        "estimated_retained_accounts_monthly": accounts_saved,
        "arpu": arpu,
        "annualized_arr_gain_usd": annual_revenue,
        "budget_usd": budget_usd,
        "net_financial_gain_usd": roi_data["net_benefit"],
        "roi_percentage": roi_data["roi_pct"],
        "payback_period_months": roi_data["payback_months"],
        "timeline_weeks": timeline_weeks,
        "calculation_method": "Deterministic SaaS Cohort Economics Engine"
    }

