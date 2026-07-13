from typing import Optional
from schemas.analyze import (
  CustomerProfileRequest, TrustLayerData, BehaviorIQData,
  FinancialDNAProfile, PriorityIQProfile, NBAIQProfile
)
from schemas.relationship import RelationshipIQProfile
from schemas.predict import PredictIQProfile, RelationshipForecast

# Import forecasting submodules
from engines.predictiq.health import forecast_health
from engines.predictiq.priority import forecast_priority
from engines.predictiq.opportunities import forecast_opportunity, evaluate_opportunity_forecast
from engines.predictiq.engagement import (
  forecast_engagement, forecast_digital_adoption, forecast_savings_health,
  forecast_income_stability, forecast_momentum, forecast_portfolio_contribution,
  forecast_retention_risk, forecast_churn_probability, forecast_clv_index,
  forecast_growth_probability
)
from engines.predictiq.churn import evaluate_churn
from engines.predictiq.growth import evaluate_growth
from engines.predictiq.confidence import evaluate_confidence
from engines.predictiq.timeline import build_timeline
from engines.predictiq.summary import generate_summary

class PredictIQEngine:
  def name(self) -> str:
    return "PredictIQ"

  def analyze(
    self,
    profile: CustomerProfileRequest,
    trust: TrustLayerData,
    behavior: Optional[BehaviorIQData],
    dna: Optional[FinancialDNAProfile],
    priority: Optional[PriorityIQProfile],
    copilot: Optional[dict] = None,
    nbaiq: Optional[NBAIQProfile] = None,
    relationship: Optional[RelationshipIQProfile] = None
  ) -> PredictIQProfile:
    
    # 1. Churn and Growth Evaluators
    churn_data = evaluate_churn(profile, behavior, priority, relationship)
    growth_data = evaluate_growth(profile, behavior, priority)

    # 2. Opportunity Forecast Module
    opp_forecast = evaluate_opportunity_forecast(profile, behavior, priority)

    # 3. Predict metrics and build forecast metric maps
    health_forecast = forecast_health(profile, behavior, priority, relationship)
    priority_forecast = forecast_priority(profile, behavior, priority, relationship)
    opp_score_forecast = forecast_opportunity(profile, behavior, priority)
    
    digital_forecast = forecast_digital_adoption(profile, behavior)
    savings_forecast = forecast_savings_health(profile, behavior)
    income_forecast = forecast_income_stability(profile, behavior)
    engagement_forecast = forecast_engagement(profile, relationship)
    momentum_forecast = forecast_momentum(profile, relationship)
    portfolio_forecast = forecast_portfolio_contribution(profile, behavior)
    retention_risk_forecast = forecast_retention_risk(profile, priority)
    churn_prob_forecast = forecast_churn_probability(profile, churn_data.probability)
    clv_forecast = forecast_clv_index(profile, behavior)
    growth_prob_forecast = forecast_growth_probability(profile, growth_data.growthScore)

    # Dictionary of metrics mapped as expected
    forecasts = {
      "relationshipHealth": health_forecast,
      "priorityScore": priority_forecast,
      "opportunityScore": opp_score_forecast,
      "digitalAdoption": digital_forecast,
      "savingsHealth": savings_forecast,
      "incomeStability": income_forecast,
      "customerEngagement": engagement_forecast,
      "relationshipMomentum": momentum_forecast,
      "portfolioContribution": portfolio_forecast,
      "retentionRisk": retention_risk_forecast,
      "churnProbability": churn_prob_forecast,
      "customerLifetimeValueIndex": clv_forecast,
      "growthProbability": growth_prob_forecast
    }

    # 4. Predict Relationship Future Stage & Momentum details
    predicted_health_90 = health_forecast.d90.predictedValue
    expected_direction = "Stable"
    health_change = health_forecast.d90.expectedChange
    if health_change > 3.0:
      expected_direction = "Upward"
    elif health_change < -3.0:
      expected_direction = "Downward"

    # Stage classification based on predicted health
    if predicted_health_90 >= 80:
      stage = "Trusted Advisor"
    elif predicted_health_90 >= 60:
      stage = "Key Partner"
    elif predicted_health_90 >= 40:
      stage = "Transactional Client"
    else:
      stage = "At-Risk Client"

    rel_forecast = RelationshipForecast(
      predictedHealth=round(predicted_health_90, 2),
      predictedStage=stage,
      momentum=round(momentum_forecast.d90.predictedValue, 2),
      predictedEngagement=round(engagement_forecast.d90.predictedValue, 2),
      sentiment="Positive" if predicted_health_90 >= 65 else "Neutral" if predicted_health_90 >= 45 else "Negative",
      rmCoverage=round(relationship.engagement.rmCoverage if (relationship and relationship.engagement) else 75.0, 2),
      expectedDirection=expected_direction
    )

    # 5. Prediction Timeline
    timeline_nodes = build_timeline(profile, churn_data.probability, growth_data.growthScore)

    # 6. Overall Confidence Model
    conf_details = evaluate_confidence(profile, trust, behavior, relationship)
    overall_confidence = conf_details["overallConfidence"]

    # 7. Executive Forecast Summary (deterministic)
    summary_data = generate_summary(
      profile, churn_data, growth_data, rel_forecast, opp_forecast, overall_confidence
    )

    return PredictIQProfile(
      forecasts=forecasts,
      churn=churn_data,
      growth=growth_data,
      relationship=rel_forecast,
      opportunity=opp_forecast,
      earlyWarnings=generate_early_warnings(profile, churn_data, behavior, relationship),
      timeline=timeline_nodes,
      summary=summary_data,
      confidence=overall_confidence
    )

def generate_early_warnings(
  profile: CustomerProfileRequest,
  churn: ChurnPrediction,
  behavior: Optional[BehaviorIQData],
  relationship: Optional[RelationshipIQProfile]
) -> list:
  from schemas.predict import EarlyWarning
  warnings = []
  
  # 1. Declining Engagement
  if relationship and relationship.interactions:
    days_since_contact = relationship.interactions.daysSinceLastContact
    if days_since_contact > 30:
      warnings.append(EarlyWarning(
        id="EW-ENG-GAP",
        type="Declining Engagement",
        severity="HIGH" if days_since_contact > 45 else "MEDIUM",
        probability=round(min(100.0, days_since_contact * 1.5), 2),
        daysToTrigger=max(1, 45 - days_since_contact),
        description=f"Days since last contact ({days_since_contact}) exceeds standard coverage SLA thresholds."
      ))

  # 2. Declining Savings
  if behavior and behavior.savings:
    savings_ratio = behavior.savings.savingsRatio
    if savings_ratio < 0:
      warnings.append(EarlyWarning(
        id="EW-SAV-DEC",
        type="Declining Savings",
        severity="HIGH" if savings_ratio < -10 else "MEDIUM",
        probability=round(min(100.0, abs(savings_ratio) * 4.0), 2),
        daysToTrigger=30,
        description=f"Capital outflows detected with negative monthly savings ratio of {savings_ratio:.1f}%."
      ))

  # 3. High Churn Risk
  if churn.probability > 60:
    warnings.append(EarlyWarning(
      id="EW-CHR-RISK",
      type="High Churn Risk",
      severity="HIGH" if churn.probability > 75 else "MEDIUM",
      probability=churn.probability,
      daysToTrigger=60,
      description=f"Aggregate telemetry indices flag elevated churn probability of {churn.probability:.1f}%."
    ))

  # Baseline warning if list empty
  if not warnings:
    warnings.append(EarlyWarning(
      id="EW-NONE",
      type="Relationship Stability Confirmed",
      severity="LOW",
      probability=5.0,
      daysToTrigger=180,
      description="Telemetry monitoring is operational. No future early warning flags active."
    ))

  return warnings
