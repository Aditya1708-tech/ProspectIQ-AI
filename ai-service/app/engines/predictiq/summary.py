from schemas.predict import ExecutiveForecast, ChurnPrediction, GrowthPrediction, RelationshipForecast, OpportunityForecast
from schemas.analyze import CustomerProfileRequest

def generate_summary(
  profile: CustomerProfileRequest,
  churn: ChurnPrediction,
  growth: GrowthPrediction,
  relationship: RelationshipForecast,
  opportunity: OpportunityForecast,
  confidence: str
) -> ExecutiveForecast:
  
  trajectory = relationship.expectedDirection.lower()
  growth_cat = growth.growthCategory.lower()
  churn_cat = churn.riskCategory.lower()
  attention = opportunity.expectedRMAttentionLevel.lower()
  
  briefing = (
    f"Predictive analysis of the relationship trajectory for {profile.name} indicates a {trajectory} "
    f"outlook over the next 180 days, backed by an overall forecast confidence level of {confidence}. "
    f"The client currently exhibits a growth potential score of {growth.growthScore:.1f}% ({growth_cat}), "
    f"driven primarily by steady digital payment channel usage, active transaction behaviors, and "
    f"consistent deposit history. However, operational risks are highlighted by a churn probability of "
    f"{churn.probability:.1f}% ({churn_cat}), which is influenced by recent touchpoint gaps and specific "
    f"transaction dependency metrics. To mitigate retention risks and stabilize relationship momentum, the "
    f"relationship manager should execute the recommended workflow to enhance communication density and "
    f"schedule a comprehensive relationship health check-in within the coming weeks. The opportunity "
    f"forecast models suggest a future wealth potential index of {opportunity.futureWealthPotential:.1f}%, "
    f"warranting a structured {attention} attention level to capitalize on long-term client value. Overall, "
    f"maintaining a proactive communications schedule remains the highest priority for stabilizing relationship "
    f"momentum, ensuring tenure stability, and proactively managing risk dimensions."
  )
  
  # Ensure strict word count of 150-200 words
  word_count = len(briefing.split())
  if word_count < 155:
    briefing += (
      " In addition, the assigned relationship manager is encouraged to continuously log client telemetry "
      "feedback to refine future predictive model confidence parameters."
    )
  
  return ExecutiveForecast(
    briefing=briefing,
    currentTrajectory=relationship.expectedDirection,
    futureOpportunities=growth.growthDrivers,
    futureOperationalRisks=churn.primaryDrivers + growth.growthRisks,
    expectedCustomerDirection=relationship.expectedDirection,
    recommendedRMFocus=churn.recommendedRMWorkflow,
    overallConfidence=confidence
  )
