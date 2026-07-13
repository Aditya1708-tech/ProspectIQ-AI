from pydantic import BaseModel, Field
from typing import List, Dict, Optional

class PredictionWindow(BaseModel):
  predictedValue: float
  expectedChange: float
  percentageChange: float
  confidence: str # HIGH, MEDIUM, LOW
  reason: str

class ForecastMetric(BaseModel):
  currentValue: float
  d30: PredictionWindow
  d90: PredictionWindow
  d180: PredictionWindow

class ChurnPrediction(BaseModel):
  probability: float # 0 to 100
  riskCategory: str # Low, Medium, High, Critical
  primaryDrivers: List[str]
  recommendedRMWorkflow: str

class GrowthPrediction(BaseModel):
  growthScore: float # 0 to 100
  growthCategory: str # Declining, Stable, Growing, Accelerating
  growthDrivers: List[str]
  growthRisks: List[str]

class RelationshipForecast(BaseModel):
  predictedHealth: float
  predictedStage: str
  momentum: float
  predictedEngagement: float
  sentiment: str
  rmCoverage: float
  expectedDirection: str # Upward, Stable, Downward

class OpportunityForecast(BaseModel):
  futureOpportunityScore: float
  futureWealthPotential: float
  futurePriority: float
  expectedRMAttentionLevel: str # High, Medium, Low
  expectedRelationshipValue: float

class EarlyWarning(BaseModel):
  id: str
  type: str
  severity: str # HIGH, MEDIUM, LOW
  probability: float # 0 to 100
  daysToTrigger: int
  description: str

class PredictionTimelineNode(BaseModel):
  timeframe: str # Today, 30 Days, 90 Days, 180 Days
  predictedEvent: str
  confidence: str # HIGH, MEDIUM, LOW
  reason: str
  expectedRMAction: str

class ExecutiveForecast(BaseModel):
  briefing: str # 150-200 words
  currentTrajectory: str
  futureOpportunities: List[str]
  futureOperationalRisks: List[str]
  expectedCustomerDirection: str
  recommendedRMFocus: str
  overallConfidence: str # HIGH, MEDIUM, LOW

class PredictIQProfile(BaseModel):
  forecasts: Dict[str, ForecastMetric]
  churn: ChurnPrediction
  growth: GrowthPrediction
  relationship: RelationshipForecast
  opportunity: OpportunityForecast
  earlyWarnings: List[EarlyWarning]
  timeline: List[PredictionTimelineNode]
  summary: ExecutiveForecast
  confidence: str # HIGH, MEDIUM, LOW
