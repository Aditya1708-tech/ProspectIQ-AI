from pydantic import BaseModel, Field
from typing import List, Dict, Optional

class RelationshipHealthData(BaseModel):
  score: float
  category: str # Healthy, Growing, Needs Attention, Critical
  positiveDrivers: List[str]
  negativeDrivers: List[str]
  confidence: str # HIGH, MEDIUM, LOW

class JourneyEvent(BaseModel):
  timestamp: str
  title: str
  description: str
  sourceEngine: str
  confidence: float

class InteractionIntelligenceData(BaseModel):
  meetings: int
  calls: int
  emails: int
  followUps: int
  completedTasks: int
  pendingTasks: int
  missedTasks: int
  averageResponseTime: float # in hours or days
  interactionCoverage: float # percentage (e.g. 0-100)
  daysSinceLastContact: int

class EngagementMetrics(BaseModel):
  interactionScore: float
  followUpQuality: float
  responseConsistency: float
  rmCoverage: float
  meetingCompletion: float
  touchpointFrequency: float # average touchpoints per month

class Milestone(BaseModel):
  title: str
  description: str
  category: str
  importance: str # HIGH, MEDIUM, LOW
  date: str

class TouchpointChannelDetail(BaseModel):
  count: int
  completionRate: float
  successRate: float
  resolutionTime: float # in hours
  effectivenessScore: float

class TouchpointEffectivenessData(BaseModel):
  calls: TouchpointChannelDetail
  meetings: TouchpointChannelDetail
  emails: TouchpointChannelDetail
  followUps: TouchpointChannelDetail
  tasks: TouchpointChannelDetail

class RelationshipRisk(BaseModel):
  severity: str # HIGH, MEDIUM, LOW
  reason: str
  suggestedRMWorkflow: str
  confidence: float

class ExecutiveRelationshipSummaryData(BaseModel):
  briefing: str # 150-200 words
  relationshipStatus: str
  engagementQuality: str
  strengths: List[str]
  risks: List[str]
  rmEffectiveness: str
  trajectory: str
  recommendedFocus: str
  confidence: str # HIGH, MEDIUM, LOW

class RelationshipIQProfile(BaseModel):
  health: RelationshipHealthData
  journey: List[JourneyEvent]
  interactions: InteractionIntelligenceData
  engagement: EngagementMetrics
  milestones: List[Milestone]
  touchpoints: TouchpointEffectivenessData
  risks: List[RelationshipRisk]
  summary: ExecutiveRelationshipSummaryData
  confidence: str
