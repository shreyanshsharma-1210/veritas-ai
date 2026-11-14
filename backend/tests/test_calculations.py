import pytest
from app.calculations.metrics import (
    calculate_retention_lift,
    calculate_retained_accounts_monthly,
    calculate_annualized_revenue_gain,
    calculate_financial_roi,
    compute_deterministic_impact_assessment
)


def test_retention_lift():
    lift = calculate_retention_lift(baseline_m3=44.0, target_m3=51.5)
    assert lift == 7.5


def test_retained_accounts():
    accounts = calculate_retained_accounts_monthly(active_customers=1450, baseline_m3=44.0, target_m3=52.0)
    assert accounts >= 1


def test_annualized_revenue_gain():
    gain = calculate_annualized_revenue_gain(retained_accounts_per_month=15, arpu=180.0, months_retained_avg=12)
    assert gain == 32400.0


def test_financial_roi():
    roi = calculate_financial_roi(annual_revenue_gain=50000.0, implementation_cost=10000.0)
    assert roi["net_benefit"] == 40000.0
    assert roi["roi_pct"] == 400.0
    assert roi["payback_months"] == 2.4


def test_compute_deterministic_impact():
    impact = compute_deterministic_impact_assessment(
        active_customers=1000,
        baseline_m3=45.0,
        target_m3=52.0,
        arpu=200.0,
        budget_usd=10000.0,
        timeline_weeks=8
    )
    assert impact["lift_percentage_points"] == 7.0
    assert impact["annualized_arr_gain_usd"] > 0
    assert impact["roi_percentage"] > 0

