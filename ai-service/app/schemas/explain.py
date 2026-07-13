from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class EngineExplanation(BaseModel):
  decision: str
  reason: str
  evidenceUsed: List[str]
  supportingMetrics: List[str]
  negativeFactors: List[str]
  positiveFactors: List[str]
  confidence: str
  modelVersion: str = "1.0.0"
  executionTimeMs: float

class DecisionTreeNode(BaseModel):
  title: str
  summary: str
  inputReferences: List[str]
  outputReferences: List[str]
  dependencies: List[str]
  executionLatencyMs: float

class EvidenceItem(BaseModel):
  evidenceName: str
  engine: str
  contribution: str
  confidenceWeight: str
  status: str # Positive, Negative
  evidenceSource: str

class ConfidenceDimension(BaseModel):
  score: float
  explanation: str

class ConfidenceModel(BaseModel):
  overallConfidence: float
  dataCompleteness: ConfidenceDimension
  behaviorConsistency: ConfidenceDimension
  interactionCoverage: ConfidenceDimension
  portfolioContext: ConfidenceDimension

class TimelineEvent(BaseModel):
  stepName: str
  timestamp: str
  latencyMs: float
  status: str

class ScoreComparison(BaseModel):
  previousScore: float
  currentScore: float
  difference: float
  status: str # Improved, Declined, Stable
  reason: str

class ComparisonAnalysis(BaseModel):
  priorityScore: ScoreComparison
  trustScore: ScoreComparison
  digitalAdoption: ScoreComparison
  wealthScore: ScoreComparison
  growthScore: ScoreComparison
  retentionRisk: ScoreComparison

class AuditRecord(BaseModel):
  auditId: str
  generatedTime: str
  engineVersions: Dict[str, str]
  inputSummary: str
  outputSummary: str
  sha256Digest: str
  executionTimeMs: float
  traceId: str

class ExplainabilityRating(BaseModel):
  explainabilityScore: float
  transparencyRating: str # Excellent, Good, Moderate, Needs Review
  coverage: float
  auditCompleteness: float
  decisionConsistency: float

class ExplainIQProfile(BaseModel):
  executiveExplanation: str
  explanations: Dict[str, EngineExplanation]
  decisionTree: List[DecisionTreeNode]
  evidenceMatrix: List[EvidenceItem]
  confidenceModel: ConfidenceModel
  reasoningTimeline: List[TimelineEvent]
  comparisonAnalysis: ComparisonAnalysis
  auditRecord: AuditRecord
  explainabilityRating: ExplainabilityRating
  analysisVersion: str = "1.0.0"
