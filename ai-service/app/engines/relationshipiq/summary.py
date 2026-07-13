from typing import Optional, List, Any
from schemas.analyze import CustomerProfileRequest, TrustLayerData, BehaviorIQData
from schemas.relationship import ExecutiveRelationshipSummaryData, InteractionIntelligenceData, RelationshipHealthData

def generate_summary(
  profile: CustomerProfileRequest,
  trust: TrustLayerData,
  behavior: Optional[BehaviorIQData],
  priority: Optional[Any],
  health: RelationshipHealthData,
  interactions_data: InteractionIntelligenceData
) -> ExecutiveRelationshipSummaryData:
  
  # Category status
  status = health.category
  
  # Trajectory
  trajectory = "improving"
  if health.score < 50:
    trajectory = "declining"
  elif health.score < 70:
    trajectory = "stable with downward risks"
  else:
    trajectory = "stable with growth potential"
      
  # Strengths
  strength_desc = "strong financial activity"
  if behavior and behavior.savings.savingsRatio > 30:
    strength_desc = f"exceptional savings ratio of {behavior.savings.savingsRatio}%"
      
  # Risks
  risk_desc = "minor data integrity warnings"
  if health.score < 70:
    risk_desc = "elevated retention risk indicators and overdue RM workspace tasks"
      
  # Effectiveness
  rm_effectiveness = "highly proactive"
  if interactions_data.daysSinceLastContact > 30:
    rm_effectiveness = "lags target frequencies"
      
  # Focus
  recommended_focus = "strengthening data compliance and scheduling a courtesy review meeting"
  if profile.segment.upper() == "MSME":
    recommended_focus = "evaluating business cash flow consistency and re-engaging current account lines"
      
  briefing = (
    f"The customer relationship for {profile.name} is currently classified as {status} with a health score of {health.score}/100. "
    f"The engagement quality is evaluated as {health.confidence} driven by {interactions_data.meetings} meetings, {interactions_data.calls} calls, and {interactions_data.completedTasks} completed workspace tasks. "
    f"Key relationship strengths include {strength_desc} alongside robust digital channel adoption, illustrating a highly active and integrated client profile. "
    f"Conversely, primary relationship risks are highlighted by {risk_desc}, which are amplified by a contact latency of {interactions_data.daysSinceLastContact} days since the last interaction. "
    f"Relationship manager effectiveness is determined to be {rm_effectiveness}, resulting in a relationship trajectory that is {trajectory}. "
    f"To restore and sustain relationship health, the recommended operational focus should center on {recommended_focus} within the designated SLA window. "
    f"Overall telemetry confidence for this customer profile check is rated as {health.confidence}, ensuring reliable compliance, data verification, and behavioral intelligence metrics. "
    f"This detailed relationship evaluation suggests that immediate, proactive re-engagement and touchpoint execution are essential to stabilize the client portfolio and nurture future growth."
  )
  
  # Return structured summary
  return ExecutiveRelationshipSummaryData(
    briefing=briefing,
    relationshipStatus=status,
    engagementQuality=health.confidence,
    strengths=[strength_desc],
    risks=[risk_desc],
    rmEffectiveness=rm_effectiveness,
    trajectory=trajectory,
    recommendedFocus=recommended_focus,
    confidence=health.confidence
  )
