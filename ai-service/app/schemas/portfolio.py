from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from schemas.analyze import CustomerProfileRequest

class PortfolioAnalyzeRequest(BaseModel):
  profiles: List[CustomerProfileRequest]

class PortfolioSummary(BaseModel):
  totalCustomers: int
  retailCustomers: int
  msmeCustomers: int
  prospectsCount: int
  dormantCount: int
  activeCount: int
  averageTrustScore: float
  averageFinDNAScore: float
  averagePriorityScore: float
  averageWealthPotential: float
  averageDigitalAdoption: float
  averagePortfolioHealth: float

class PortfolioHealthDetail(BaseModel):
  overallHealthScore: float
  healthCategory: str # Healthy, Stable, Needs Attention, Critical
  topPositiveDrivers: List[str]
  topNegativeDrivers: List[str]
  historicalTrend: str # Improving, Stable, Declining

class PriorityMetricDetail(BaseModel):
  count: int
  percentage: float
  trend: str # Improving, Stable, Declining

class PriorityDistributionProfile(BaseModel):
  immediateAction: PriorityMetricDetail
  highPotential: PriorityMetricDetail
  nurture: PriorityMetricDetail
  monitor: PriorityMetricDetail
  lowPriority: PriorityMetricDetail

class OpportunityRecord(BaseModel):
  customerId: str
  customerName: str
  assignedRM: str
  persona: str
  priorityScore: float
  opportunityScore: float
  recommendedAction: str

class RiskAlertDetail(BaseModel):
  severity: str # CRITICAL, HIGH, MEDIUM, LOW
  reason: str
  affectedCustomer: str
  affectedCustomerId: str
  recommendedRMWorkflow: str

class RMPerformanceRecord(BaseModel):
  rmName: str
  customersManaged: int
  averageTrust: float
  averagePriority: float
  averagePortfolioHealth: float
  interactionCoverage: float
  highPotentialCustomers: int
  immediateActionCustomers: int
  rmEffectivenessScore: float

class TrendPoint(BaseModel):
  month: str
  customerGrowth: int
  priorityIndex: float
  riskIndex: float
  digitalAdoptionIndex: float
  qualityIndex: float

class DistributionDataset(BaseModel):
  segments: Dict[str, int]
  risks: Dict[str, int]
  personas: Dict[str, int]
  priorities: Dict[str, int]
  rms: Dict[str, int]

# New structures (Sprint 8 Extensions)
class ActionCenterItem(BaseModel):
  customerName: str
  customerId: str
  reason: str
  assignedRM: str
  priority: str # Immediate Action, High Potential, Nurture
  recommendedAction: str
  dueTimeline: str

class EarlyWarningAlert(BaseModel):
  warningLevel: str # Red, Orange, Yellow
  confidence: str # HIGH, MEDIUM, LOW
  reason: str
  recommendedRMWorkflow: str
  expectedBusinessImpact: str
  affectedCustomer: str
  affectedCustomerId: str

class RMWorkloadRecord(BaseModel):
  rmName: str
  customersAssigned: int
  immediateActionCount: int
  highPotentialCount: int
  averagePortfolioHealth: float
  averagePriority: float
  pendingFollowUps: int
  overdueFollowUps: int
  interactionCoverage: float
  utilizationPercentage: float

class PortfolioIQResponse(BaseModel):
  analysisVersion: str = Field(default="1.0.0")
  generatedAt: str
  executionTimeMs: float
  engine: str = Field(default="PortfolioIQ")
  summary: PortfolioSummary
  health: PortfolioHealthDetail
  executiveSummary: str
  morningBrief: str
  priorityDistribution: PriorityDistributionProfile
  topOpportunities: List[OpportunityRecord]
  riskIntelligence: List[RiskAlertDetail]
  rmLeaderboard: List[RMPerformanceRecord]
  trends: List[TrendPoint]
  distributions: DistributionDataset
  actionCenter: List[ActionCenterItem]
  earlyWarnings: List[EarlyWarningAlert]
  workloadBalancer: List[RMWorkloadRecord]
