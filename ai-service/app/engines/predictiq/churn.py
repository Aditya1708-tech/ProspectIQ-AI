from typing import Optional, List
from schemas.analyze import CustomerProfileRequest, BehaviorIQData, PriorityIQProfile
from schemas.relationship import RelationshipIQProfile
from schemas.predict import ChurnPrediction

def evaluate_churn(
  profile: CustomerProfileRequest,
  behavior: Optional[BehaviorIQData],
  priority: Optional[PriorityIQProfile],
  relationship: Optional[RelationshipIQProfile]
) -> ChurnPrediction:
  # Base probability of churn
  probability = 12.5
  drivers = []

  # 1. Retention risk check from PriorityIQ
  if priority and priority.retentionRisk:
    ret_risk = priority.retentionRisk.score
    if ret_risk > 60:
      probability += (ret_risk - 60) * 0.7
      drivers.append(f"PriorityIQ flags elevated retention risk score of {ret_risk:.1f}")
    elif ret_risk < 30:
      probability -= 5.0
  
  # 2. Relationship Health check from RelationshipIQ
  if relationship and relationship.health:
    health_score = relationship.health.score
    if health_score < 50:
      probability += 25.0
      drivers.append(f"Relationship Health is critically low at {health_score:.1f}")
    elif health_score < 75:
      probability += 10.0
      drivers.append(f"Relationship Health is moderate at {health_score:.1f}")
    else:
      probability -= 5.0

  # 3. Savings trend check from BehaviorIQ
  if behavior and behavior.savings:
    savings_ratio = behavior.savings.savingsRatio
    if savings_ratio < 0:
      probability += 15.0
      drivers.append(f"Negative savings ratio ({savings_ratio:.1f}%) indicates capital outflow")
    elif savings_ratio < 10.0:
      probability += 5.0

  # 4. Interaction Gap check
  if relationship and relationship.interactions:
    days_since_contact = relationship.interactions.daysSinceLastContact
    if days_since_contact > 45:
      probability += 12.0
      drivers.append(f"Extended communication gap of {days_since_contact} days detected")
    elif days_since_contact <= 7:
      probability -= 3.0

  # Clamp probability
  probability = max(2.0, min(98.0, probability))

  # Determine Risk Category
  if probability < 20.0:
    category = "Low"
  elif probability < 50.0:
    category = "Medium"
  elif probability < 80.0:
    category = "High"
  else:
    category = "Critical"

  if not drivers:
    drivers.append("Standard interaction consistency is maintained.")
    drivers.append("Account turnover profiles remain stable.")

  # RM Workflow recommendation (Compliance: No banking products recommended)
  if category == "Critical":
    workflow = "Initiate immediate high-frequency contact cycle within 24 hours. Schedule an executive-level relationship review meeting."
  elif category == "High":
    workflow = "Coordinate standard relationship touchpoint within 48 hours. Address flagged transaction gaps and resolve client administrative issues."
  elif category == "Medium":
    workflow = "Maintain monthly communication schedule. Review digital adoption barriers during next routine check-in."
  else:
    workflow = "Proceed with baseline client contact matrix. Monitor transaction volume stability quarterly."

  return ChurnPrediction(
    probability=round(probability, 2),
    riskCategory=category,
    primaryDrivers=drivers,
    recommendedRMWorkflow=workflow
  )
