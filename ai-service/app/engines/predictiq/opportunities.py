from typing import Optional
from schemas.analyze import CustomerProfileRequest, BehaviorIQData, PriorityIQProfile
from schemas.relationship import RelationshipIQProfile
from schemas.predict import ForecastMetric, OpportunityForecast
from engines.predictiq.forecast import compute_forecast_metric, project_value

def forecast_opportunity(
  profile: CustomerProfileRequest,
  behavior: Optional[BehaviorIQData],
  priority: Optional[PriorityIQProfile]
) -> ForecastMetric:
  current_opp = 50.0
  confidence = "MEDIUM"

  if priority and priority.opportunity:
    current_opp = priority.opportunity.score
    confidence = priority.opportunity.confidence

  rate = 0.03 # baseline growth in opportunity

  # Adjust opportunity rate based on total balances
  total_savings = sum(acc.balance for acc in profile.accounts)
  if total_savings > 150000:
    rate += 0.05
  elif total_savings < 15000:
    rate -= 0.04

  reason_30 = "Stability with current deposit base."
  reason_90 = "Expansion opportunities based on incremental asset generation."
  reason_180 = "Long-term investment readiness potential remains high."

  return compute_forecast_metric(
    current_value=current_opp,
    rate_per_day=rate,
    confidence=confidence,
    reason_30=reason_30,
    reason_90=reason_90,
    reason_180=reason_180
  )

def evaluate_opportunity_forecast(
  profile: CustomerProfileRequest,
  behavior: Optional[BehaviorIQData],
  priority: Optional[PriorityIQProfile]
) -> OpportunityForecast:
  current_opp = 50.0
  if priority and priority.opportunity:
    current_opp = priority.opportunity.score

  current_priority = 50.0
  if priority and priority.finalPriority:
    current_priority = priority.finalPriority.score

  total_savings = sum(acc.balance for acc in profile.accounts)
  wealth_potential = 60.0
  
  # Determine expected Relationship Value (composite of savings + turnover estimate)
  monthly_turnover = 0.0
  if behavior and behavior.income:
    monthly_turnover = behavior.income.monthlyEstimate
  
  current_value = total_savings + (monthly_turnover * 12.0)
  
  # Forecasted states at 90 days (medium term)
  future_opp = project_value(current_opp, 0.05, 90)
  future_priority = project_value(current_priority, 0.02, 90)
  future_wealth = project_value(wealth_potential, 0.03, 90)
  future_val = current_value * (1.0 + (0.0002 * 90)) # 2% growth annualized

  if future_priority >= 75:
    attention = "High"
  elif future_priority >= 45:
    attention = "Medium"
  else:
    attention = "Low"

  return OpportunityForecast(
    futureOpportunityScore=round(future_opp, 2),
    futureWealthPotential=round(future_wealth, 2),
    futurePriority=round(future_priority, 2),
    expectedRMAttentionLevel=attention,
    expectedRelationshipValue=round(future_val, 2)
  )
