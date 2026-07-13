from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any, Generic, TypeVar
from schemas.relationship import RelationshipIQProfile
from schemas.predict import PredictIQProfile
from schemas.simulation import SimulationIQProfile

# Generic type for data payloads
T = TypeVar('T')

class EngineResponseContract(BaseModel, Generic[T]):
  analysisVersion: str = Field(default="1.0.0")
  generatedAt: str
  executionTimeMs: float
  engine: str
  reasoning: List[str] = Field(default_factory=list)
  data: T

# Request Schema
class AddressSchema(BaseModel):
  type: str
  street: str
  city: str
  state: str
  postalCode: str
  country: str

class TransactionSchema(BaseModel):
  amount: float
  type: str # DEBIT, CREDIT
  category: str
  description: str
  valueDate: str

class BankAccountSchema(BaseModel):
  accountNumber: str
  accountType: str
  balance: float
  transactions: List[TransactionSchema] = []

class InteractionSchema(BaseModel):
  id: str
  type: str # CALL, EMAIL, MEETING
  summary: str
  notes: Optional[str] = None
  interactionDate: str
  createdAt: str

class TaskHistorySchema(BaseModel):
  id: str
  fieldName: str
  oldValue: Optional[str] = None
  newValue: Optional[str] = None
  createdAt: str

class TaskSchema(BaseModel):
  id: str
  title: str
  description: Optional[str] = None
  priority: str # HIGH, MEDIUM, LOW
  status: str # Pending, In Progress, Waiting Customer, Completed, Cancelled, Overdue
  category: str
  createdAt: str
  updatedAt: str
  dueDate: str
  completedAt: Optional[str] = None
  estimatedDuration: Optional[int] = None
  actualDuration: Optional[int] = None
  history: List[TaskHistorySchema] = []

class CustomerProfileRequest(BaseModel):
  id: str
  name: str
  email: Optional[str] = None
  phone: Optional[str] = None
  occupation: str
  incomeRange: str
  riskCategory: str
  segment: str
  status: str
  branchCode: str
  lastInteractionAt: Optional[str] = None
  addresses: List[AddressSchema] = []
  accounts: List[BankAccountSchema] = []
  interactions: List[InteractionSchema] = []
  tasks: List[TaskSchema] = []

# Engine Data Output Schemas
class TrustLayerData(BaseModel):
  qualityScore: float
  confidence: str # HIGH, MEDIUM, LOW
  warnings: List[str]
  errors: List[str]

class IncomeMetrics(BaseModel):
  totalCredits: float
  monthlyEstimate: float
  salaryDetected: bool
  salaryDetails: str

class ExpenseMetrics(BaseModel):
  totalDebits: float
  spendingCategories: Dict[str, float]
  cashDependencyRatio: float
  digitalPaymentRatio: float

class SavingsMetrics(BaseModel):
  totalSavings: float
  savingsRatio: float

class TransactionMetrics(BaseModel):
  totalCount: int
  frequencyPerMonth: float

class BehaviorIQData(BaseModel):
  income: IncomeMetrics
  expenses: ExpenseMetrics
  savings: SavingsMetrics
  transactions: TransactionMetrics

# Sprint 5 Financial DNA Schemas
class DimensionDetail(BaseModel):
  score: float
  confidence: str # HIGH, MEDIUM, LOW
  factors: List[str]

class FinancialPersona(BaseModel):
  name: str
  description: str
  strengths: List[str]
  watchAreas: List[str]
  bankingFocusAreas: List[str]

class FinancialDNAProfile(BaseModel):
  modelVersion: str = Field(default="v1.0.0")
  profileVersion: str = Field(default="v1.0.0")
  persona: FinancialPersona
  incomeStability: DimensionDetail
  expenseDiscipline: DimensionDetail
  savingsHealth: DimensionDetail
  liquidityStrength: DimensionDetail
  digitalAdoption: DimensionDetail
  creditHealth: DimensionDetail
  investmentReadiness: DimensionDetail
  wealthPotential: DimensionDetail

# Sprint 6 PriorityIQ Schemas
class ScoreDetail(BaseModel):
  score: float
  confidence: str
  drivers: List[str]

class OpportunityMatrix(BaseModel):
  category: str
  priorityRank: int
  sla: str
  color: str
  actionType: str

class PriorityIQProfile(BaseModel):
  opportunity: ScoreDetail
  engagement: ScoreDetail
  growthPotential: ScoreDetail
  retentionRisk: ScoreDetail
  urgency: ScoreDetail
  finalPriority: ScoreDetail
  opportunityMatrix: OpportunityMatrix
  opportunityDrivers: List[str]

# Sprint 7 RM Co-Pilot Schemas
class MeetingPreparation(BaseModel):
  customerProfileSummary: str
  likelyDiscussionTopics: List[str]
  potentialConcerns: List[str]

class NextBestAction(BaseModel):
  title: str
  timeline: str
  reason: str

class CoPilotSnapshot(BaseModel):
  persona: str
  priorityCategory: str
  priorityScore: float
  urgency: str
  relationshipManager: str
  branch: str
  confidence: str

class TimelineEvent(BaseModel):
  time: str
  event: str

class CoPilotProfile(BaseModel):
  executiveSummary: str
  snapshot: CoPilotSnapshot
  strengths: List[str]
  watchAreas: List[str]
  growthOpportunities: List[str]
  meetingPreparation: MeetingPreparation
  conversationStarters: List[str]
  timeline: List[TimelineEvent]
  nextBestAction: NextBestAction

# Unified Endpoint Response Schema
from schemas.explain import ExplainIQProfile

class NBAAction(BaseModel):
  title: str
  description: str
  reason: str
  expectedDuration: str
  priority: str
  owner: str
  recommendedDueDate: str
  sla: str

class ConfidenceDetails(BaseModel):
  overallScore: float
  trustLayerQuality: float
  dataCompleteness: float
  priorityConfidence: float
  portfolioConfidence: float
  interactionCoverage: float

class BusinessJustification(BaseModel):
  whyThisActionExists: str
  triggeringEngine: str
  contributingMetrics: List[str]
  expectedBenefit: str

class CustomerTaskCard(BaseModel):
  headline: str
  summary: str
  checklist: List[str]
  talkingPoints: List[str]
  preparationNotes: List[str]
  successCriteria: str

class NBAIQProfile(BaseModel):
  overallRecommendation: str
  recommendationCategory: str
  urgency: str
  businessJustification: BusinessJustification
  expectedOutcome: str
  estimatedRMTime: str
  recommendedCompletionWindow: str
  confidence: ConfidenceDetails
  primaryAction: NBAAction
  secondaryAction: Optional[NBAAction] = None
  optionalFollowUp: Optional[NBAAction] = None
  taskCard: CustomerTaskCard
  schedule: List[str]
  checklist: List[str]

class AnalyzeResponse(BaseModel):
  trustLayer: EngineResponseContract[TrustLayerData]
  behaviorIQ: Optional[EngineResponseContract[BehaviorIQData]] = None
  financialDNA: Optional[EngineResponseContract[FinancialDNAProfile]] = None
  priorityIQ: Optional[EngineResponseContract[PriorityIQProfile]] = None
  copilot: Optional[EngineResponseContract[CoPilotProfile]] = None
  explainIQ: Optional[EngineResponseContract[ExplainIQProfile]] = None
  nextBestActionIQ: Optional[EngineResponseContract[NBAIQProfile]] = None
  relationshipIQ: Optional[EngineResponseContract[RelationshipIQProfile]] = None
  predictIQ: Optional[EngineResponseContract[PredictIQProfile]] = None
  simulationIQ: Optional[EngineResponseContract[SimulationIQProfile]] = None

