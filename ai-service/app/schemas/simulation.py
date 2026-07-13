from pydantic import BaseModel
from typing import List, Dict, Optional

class ScenarioAdjustment(BaseModel):
  rmInteractionsChange: float = 0.0      # percentage change e.g. -50 to 100
  kycEvent: Optional[bool] = None        # True = Complete KYC, False = Delay KYC
  savingsRatioChange: float = 0.0        # percentage change
  digitalPaymentsChange: float = 0.0     # percentage change
  salaryStabilityChange: float = 0.0     # percentage change
  meetingCompletionChange: float = 0.0   # percentage change
  followUpQualityChange: float = 0.0     # percentage change
  engagementChange: float = 0.0          # percentage change
  closePendingTasks: Optional[bool] = None # True = Close tasks, False = Leave overdue

class SimulationScenario(BaseModel):
  scenarioName: str
  description: str
  adjustments: ScenarioAdjustment

class SimulationRequest(BaseModel):
  scenario: SimulationScenario

class ProjectedMetric(BaseModel):
  currentValue: float
  projectedValue: float
  difference: float
  percentageDifference: float
  isPositive: bool
  confidence: str # HIGH, MEDIUM, LOW

class BusinessImpact(BaseModel):
  customerImpact: str
  rmImpact: str
  portfolioImpact: str
  branchImpact: str
  operationalImpact: str
  relationshipImpact: str

class DecisionMatrix(BaseModel):
  category: str # Highly Beneficial, Beneficial, Neutral, Negative, High Risk
  reason: str
  expectedOutcome: str
  confidence: str # HIGH, MEDIUM, LOW

class SimulationTimelineNode(BaseModel):
  timeframe: str # Today, 30 Days, 90 Days, 180 Days
  expectedEvent: str
  expectedMetricChange: str
  confidence: str # HIGH, MEDIUM, LOW
  recommendedRMAction: str

class SimulationSummary(BaseModel):
  briefing: str # 150-200 words
  objective: str
  expectedOutcome: str
  operationalImprovements: str
  potentialRisks: str
  overallConfidence: str # HIGH, MEDIUM, LOW

class SimulationIQProfile(BaseModel):
  scenarioName: str
  projectedMetrics: Dict[str, ProjectedMetric]
  impact: BusinessImpact
  decision: DecisionMatrix
  timeline: List[SimulationTimelineNode]
  summary: SimulationSummary
  confidence: str # HIGH, MEDIUM, LOW
