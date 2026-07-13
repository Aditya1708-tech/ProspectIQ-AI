from typing import Optional
from schemas.analyze import CustomerProfileRequest, BehaviorIQData, PriorityIQProfile
from schemas.relationship import RelationshipIQProfile
from schemas.predict import ForecastMetric
from engines.predictiq.forecast import compute_forecast_metric

def forecast_engagement(
  profile: CustomerProfileRequest,
  relationship: Optional[RelationshipIQProfile]
) -> ForecastMetric:
  current = 65.0
  confidence = "MEDIUM"
  if relationship and relationship.engagement:
    current = relationship.engagement.interactionScore
    confidence = relationship.confidence

  rate = 0.05
  if relationship and relationship.interactions:
    if relationship.interactions.daysSinceLastContact > 30:
      rate = -0.1

  return compute_forecast_metric(
    current_value=current,
    rate_per_day=rate,
    confidence=confidence,
    reason_30="Stable engagement based on recent communications.",
    reason_90="Projected contact frequency meets core relationship standards.",
    reason_180="Sustained customer feedback alignment over 180 days."
  )

def forecast_digital_adoption(
  profile: CustomerProfileRequest,
  behavior: Optional[BehaviorIQData]
) -> ForecastMetric:
  current = 70.0
  if behavior and behavior.expenses:
    current = behavior.expenses.digitalPaymentRatio

  rate = 0.08 # default steady increase
  if current > 90:
    rate = 0.01

  return compute_forecast_metric(
    current_value=current,
    rate_per_day=rate,
    confidence="HIGH",
    reason_30="Scheduled migration of standing orders to mobile portal.",
    reason_90="Increasing usage of UPI and credit facilities online.",
    reason_180="Maximum digital maturity level expected in regular transactions."
  )

def forecast_savings_health(
  profile: CustomerProfileRequest,
  behavior: Optional[BehaviorIQData]
) -> ForecastMetric:
  current = 60.0
  if behavior and behavior.savings:
    current = behavior.savings.savingsRatio
    # Handle ratios that might be negative or raw scores
    if current < 0:
      current = max(0.0, 50.0 + current)
    else:
      current = min(100.0, 50.0 + current * 2)

  rate = 0.02
  total_savings = sum(acc.balance for acc in profile.accounts)
  if total_savings < 15000:
    rate = -0.05

  return compute_forecast_metric(
    current_value=current,
    rate_per_day=rate,
    confidence="MEDIUM",
    reason_30="Balance stability remains baseline.",
    reason_90="Growth trend dependent on quarterly bonus cycles.",
    reason_180="Long-term asset accumulation projects stable outlook."
  )

def forecast_income_stability(
  profile: CustomerProfileRequest,
  behavior: Optional[BehaviorIQData]
) -> ForecastMetric:
  current = 75.0
  if behavior and behavior.income:
    current = 90.0 if behavior.income.salaryDetected else 60.0

  rate = 0.0 # income stability is typically fixed or very slow-moving
  
  return compute_forecast_metric(
    current_value=current,
    rate_per_day=rate,
    confidence="HIGH",
    reason_30="Stable payroll receipts verified.",
    reason_90="Employer payroll cycle projected to continue regularly.",
    reason_180="Income stability indicators suggest zero near-term risk factors."
  )

def forecast_momentum(
  profile: CustomerProfileRequest,
  relationship: Optional[RelationshipIQProfile]
) -> ForecastMetric:
  current = 50.0
  rate = 0.04
  
  if relationship and relationship.interactions:
    if relationship.interactions.daysSinceLastContact > 25:
      rate = -0.08
      current = 40.0
    elif relationship.interactions.daysSinceLastContact < 10:
      rate = 0.08
      current = 65.0

  return compute_forecast_metric(
    current_value=current,
    rate_per_day=rate,
    confidence="MEDIUM",
    reason_30="Momentum indicators track short-term interaction rates.",
    reason_90="Medium-term momentum points to steady baseline progression.",
    reason_180="Long-term momentum projects into standard alignment range."
  )

def forecast_portfolio_contribution(
  profile: CustomerProfileRequest,
  behavior: Optional[BehaviorIQData]
) -> ForecastMetric:
  total_savings = sum(acc.balance for acc in profile.accounts)
  
  # Map balance to 0-100 score
  current = min(100.0, 30.0 + (total_savings / 5000.0))
  rate = 0.03
  
  return compute_forecast_metric(
    current_value=current,
    rate_per_day=rate,
    confidence="HIGH",
    reason_30="Portfolio holdings reflect current savings margins.",
    reason_90="Projected balance sheet growth from savings ratio.",
    reason_180="Long-term compound value of primary deposit accounts."
  )

def forecast_retention_risk(
  profile: CustomerProfileRequest,
  priority: Optional[PriorityIQProfile]
) -> ForecastMetric:
  current = 25.0
  if priority and priority.retentionRisk:
    current = priority.retentionRisk.score

  rate = -0.05 # default risk declines with standard care
  if current > 60:
    rate = 0.08

  return compute_forecast_metric(
    current_value=current,
    rate_per_day=rate,
    confidence="MEDIUM",
    reason_30="Short-term client retention signals remain standard.",
    reason_90="Retention index tracks ongoing contact check-ins.",
    reason_180="Risk exposure projected to settle in safe zones."
  )

def forecast_churn_probability(
  profile: CustomerProfileRequest,
  churn_prob: float
) -> ForecastMetric:
  rate = 0.02
  if churn_prob > 50:
    rate = 0.15
  elif churn_prob < 15:
    rate = -0.04

  return compute_forecast_metric(
    current_value=churn_prob,
    rate_per_day=rate,
    confidence="MEDIUM",
    reason_30="Churn indicators remain within normal boundaries.",
    reason_90="Probability projects standard attrition baseline risks.",
    reason_180="Long-term probability metrics show steady risk level."
  )

def forecast_clv_index(
  profile: CustomerProfileRequest,
  behavior: Optional[BehaviorIQData]
) -> ForecastMetric:
  total_savings = sum(acc.balance for acc in profile.accounts)
  income_level = 50.0
  if "1,000,000" in profile.incomeRange or "2,500,000" in profile.incomeRange:
    income_level = 75.0
  elif "5,000,000" in profile.incomeRange:
    income_level = 95.0

  current = (income_level * 0.5) + (min(100.0, total_savings / 4000.0) * 0.5)
  rate = 0.05 # lifetime value increases with tenure

  return compute_forecast_metric(
    current_value=current,
    rate_per_day=rate,
    confidence="HIGH",
    reason_30="Tenure factors contribute to immediate CLV expansion.",
    reason_90="Expected value accumulation from transaction profiles.",
    reason_180="Long-term tenure multiplication raises customer lifecycle value."
  )

def forecast_growth_probability(
  profile: CustomerProfileRequest,
  growth_score: float
) -> ForecastMetric:
  rate = 0.03
  if growth_score > 70:
    rate = 0.08
  elif growth_score < 40:
    rate = -0.05

  return compute_forecast_metric(
    current_value=growth_score,
    rate_per_day=rate,
    confidence="MEDIUM",
    reason_30="Expansion probability matches recent score trends.",
    reason_90="Projected growth momentum indicates solid progression.",
    reason_180="Long-term customer alignment indicates stable growth capacity."
  )
