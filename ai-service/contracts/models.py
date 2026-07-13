from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field

class ConfidenceLevel(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"

class PriorityTier(str, Enum):
    PRIORITY_ENGAGE = "PRIORITY_ENGAGE"
    ENGAGE_WITH_CONTEXT = "ENGAGE_WITH_CONTEXT"
    LOWER_PRIORITY = "LOWER_PRIORITY"
    INSUFFICIENT_DATA = "INSUFFICIENT_DATA"

class FDNAIndicator(BaseModel):
    dimension: str
    score: float  # 0 to 100
    confidence: ConfidenceLevel
    description: str
    evidence: List[str]

class FDNAIndicatorsMap(BaseModel):
    incomeStability: FDNAIndicator
    expenseDiscipline: FDNAIndicator
    savingsBehaviour: FDNAIndicator
    paymentReliability: FDNAIndicator
    borrowingIntent: FDNAIndicator
    financialResilience: FDNAIndicator
    customerEngagement: FDNAIndicator
    digitalActivity: FDNAIndicator

class FDNAProfile(BaseModel):
    customerId: str
    generatedAt: str
    confidenceScore: float  # 0 to 100
    overallConfidence: ConfidenceLevel
    indicators: FDNAIndicatorsMap

class ExplanationObject(BaseModel):
    evidence: List[str]
    positiveIndicators: List[str]
    negativeIndicators: List[str]
    confidence: ConfidenceLevel
    recommendedAction: str
    watchItems: List[str]
    alternativeInterpretation: Optional[str] = None
    humanReviewNotes: Optional[str] = None

class PriorityScore(BaseModel):
    rawScore: float  # 0 to 100
    normalizedScore: float  # 0 to 100
    tier: PriorityTier
    confidence: ConfidenceLevel
    updatedAt: str

class TraditionalSummary(BaseModel):
    averageBalance: float
    existingLoansCount: int
    creditBureauScore: Optional[int] = None

class IngestionRecord(BaseModel):
    upiOutflowAvg: float
    gstTurnoverAvg: Optional[float] = None
    epfoInflowAvg: Optional[float] = None
    utilityBillConsistency: float  # 0 to 100
    rawTransactions: Optional[List[dict]] = None

class AIAnalysisRequest(BaseModel):
    customerId: str
    segment: str  # "RETAIL" or "MSME"
    traditionalSummary: TraditionalSummary
    alternativeSummary: IngestionRecord

class AIAnalysisResponse(BaseModel):
    customerId: str
    fdnaProfile: FDNAProfile
    priorityScore: PriorityScore
    explanation: ExplanationObject
    readinessIndicator: str
