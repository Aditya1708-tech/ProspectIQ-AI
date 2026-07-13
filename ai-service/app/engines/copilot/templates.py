# Templates, lookup banks, and timeline event templates for the RM Co-Pilot Engine

STARTERS_RETAIL = [
  "How has your financial planning been tracking over the last quarter?",
  "Are there any major personal milestones or investment plans on the horizon for this financial year?",
  "How are digital banking tools supporting your day-to-day transactional requirements?",
  "Are you planning any major capital outlays or asset acquisitions in the coming months?",
  "We would love to hear your feedback on how we can further streamline your banking experience."
]

STARTERS_MSME = [
  "How has business cash flow been tracking over the last quarter?",
  "Are there any trade expansion or working capital requirements planned for this financial year?",
  "How are digital cash management services supporting your business operations?",
  "Are you planning any major capital expansions or business machinery investments in the near term?",
  "We are reviewing credit limits this quarter; how has your overall supplier payment cycle been?",
  "What working capital challenges are you currently anticipating over the next six months?"
]

STRENGTH_MAPS = [
  {"id": "stable_income", "label": "Stable Income Source", "rule": "incomeStability >= 70"},
  {"id": "healthy_liquidity", "label": "Healthy Liquidity Reserves", "rule": "liquidityStrength >= 70"},
  {"id": "strong_wealth", "label": "Strong Wealth Potential", "rule": "wealthPotential >= 70"},
  {"id": "excellent_digital", "label": "Excellent Digital Adoption", "rule": "digitalAdoption >= 75"},
  {"id": "low_op_risk", "label": "Low Operational Risk Category", "rule": "creditHealth >= 80"},
  {"id": "consistent_surplus", "label": "Disciplined Expense Restraint", "rule": "expenseDiscipline >= 70"},
  {"id": "high_investment", "label": "High Investment Capacity", "rule": "investmentReadiness >= 70"}
]

WATCH_MAPS = [
  {"id": "savings_declining", "label": "Savings Trend Declining", "rule": "savingsHealth < 50"},
  {"id": "high_cash_dependence", "label": "High Cash Dependency Ratio", "rule": "expenseDiscipline < 55"},
  {"id": "moderate_retention", "label": "Moderate Retention Risk", "rule": "retentionRisk >= 40"},
  {"id": "limited_investment", "label": "Limited Investment Readiness", "rule": "investmentReadiness < 50"},
  {"id": "data_gaps", "label": "Operational Verification Gaps", "rule": "trustScore < 85"}
]

OPPORTUNITY_MAPS = [
  {"id": "premium_growth", "label": "Premium Relationship Growth Potential", "rule": "wealthPotential >= 80"},
  {"id": "digital_first", "label": "Digital-First Engagement Profile", "rule": "digitalAdoption >= 80"},
  {"id": "long_term_value", "label": "High Customer Lifetime Value Headroom", "rule": "incomeStability >= 75"},
  {"id": "business_expansion", "label": "Business Working Capital Expansion Potential", "rule": "is_msme"}
]

TIMELINE_EVENTS = [
  {"days_ago": 0, "event": "Priority status recalculated and synchronized."},
  {"days_ago": 1, "event": "Relationship manager interaction logged."},
  {"days_ago": 3, "event": "Monthly credit salary deposit detected."},
  {"days_ago": 7, "event": "Surplus savings ratio change recorded."},
  {"days_ago": 15, "event": "Digital transaction activity velocity checked."}
]
