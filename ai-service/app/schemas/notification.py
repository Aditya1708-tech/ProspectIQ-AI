from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from schemas.analyze import CustomerProfileRequest, TaskSchema

class NotificationModel(BaseModel):
  id: str
  title: str
  description: str
  category: str
  priority: str # LOW, MEDIUM, HIGH, CRITICAL
  channel: List[str]
  createdTime: str
  expiryTime: str
  assignedRM: str
  assignedManager: str
  readStatus: bool = False
  acknowledgedStatus: bool = False
  escalationLevel: int = 0
  workflowLink: str
  confidence: float

class TimelineEvent(BaseModel):
  id: str
  title: str
  description: str
  category: str
  timestamp: str
  type: str # e.g. TASK, INTERACTION, ALERTS, MILESTONES
  sourceEngine: str
  customerId: Optional[str] = None
  customerName: Optional[str] = None
  workflowLink: Optional[str] = None

class NotificationAnalyticsModel(BaseModel):
  unreadNotifications: int
  criticalAlerts: int
  overdueAlerts: int
  averageResponseTime: float
  acknowledgementRate: float
  resolutionRate: float
  escalationRate: float
  dailyVolume: int
  weeklyVolume: int
  monthlyVolume: int

class NotificationIQProfile(BaseModel):
  notifications: List[NotificationModel]
  morningBrief: str
  executiveBrief: str
  timeline: List[TimelineEvent]
  analytics: NotificationAnalyticsModel

class NotificationIQRequest(BaseModel):
  profiles: List[CustomerProfileRequest]
  tasks: List[TaskSchema]
  userId: str
  userRole: str
