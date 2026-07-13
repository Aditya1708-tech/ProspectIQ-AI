from typing import Optional, List
from schemas.analyze import CustomerProfileRequest, BehaviorIQData, PriorityIQProfile
from schemas.predict import GrowthPrediction

def evaluate_growth(
  profile: CustomerProfileRequest,
  behavior: Optional[BehaviorIQData],
  priority: Optional[PriorityIQProfile]
) -> GrowthPrediction:
  # Base growth score
  growth_score = 55.0
  drivers = []
  risks = []

  # PriorityIQ Growth Potential
  if priority and priority.growthPotential:
    priority_growth = priority.growthPotential.score
    growth_score = (growth_score * 0.4) + (priority_growth * 0.6)
    if priority_growth > 70:
      drivers.append(f"PriorityIQ indicates strong relationship growth potential of {priority_growth:.1f}")
    elif priority_growth < 40:
      risks.append(f"PriorityIQ flags lower client growth potential ({priority_growth:.1f})")

  # BehaviorIQ digital payment ratio
  if behavior and behavior.expenses:
    digital_ratio = behavior.expenses.digitalPaymentRatio
    if digital_ratio > 80:
      growth_score += 8.0
      drivers.append(f"Strong digital channel adoption ({digital_ratio:.1f}%) signals scalable service adoption")
    elif digital_ratio < 40:
      growth_score -= 5.0
      risks.append(f"Low digital payments usage ({digital_ratio:.1f}%) limits remote servicing leverage")

    cash_ratio = behavior.expenses.cashDependencyRatio
    if cash_ratio > 40:
      growth_score -= 6.0
      risks.append(f"High cash dependency ratio ({cash_ratio:.1f}%) restricts digital relationship indicators")

  # Balance indicators
  total_savings = sum(acc.balance for acc in profile.accounts)
  if total_savings > 200000:
    growth_score += 10.0
    drivers.append("Substantial balance reserves support client investment capabilities")
  elif total_savings < 20000:
    growth_score -= 8.0
    risks.append("Limited reserve balances constrain expansion activities")

  # Clamp growth score
  growth_score = max(0.0, min(100.0, growth_score))

  # Determine Category
  if growth_score < 40.0:
    category = "Declining"
  elif growth_score < 60.0:
    category = "Stable"
  elif growth_score < 80.0:
    category = "Growing"
  else:
    category = "Accelerating"

  if not drivers:
    drivers.append("Standard deposit consistency remains baseline.")
  if not risks:
    risks.append("No active portfolio leakage alerts detected.")

  return GrowthPrediction(
    growthScore=round(growth_score, 2),
    growthCategory=category,
    growthDrivers=drivers,
    growthRisks=risks
  )
