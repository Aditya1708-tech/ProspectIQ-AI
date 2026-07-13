from pydantic import BaseModel
from typing import List, Dict, Optional, Any

class SystemHealthItem(BaseModel):
  engineName: str
  version: str
  status: str # HEALTHY, DEGRADED, OFFLINE
  averageLatencyMs: float
  successRate: float
  requestsToday: int
  errorsToday: int
  lastExecutionTime: str
  overallHealthScore: float

class PlatformHealthSummary(BaseModel):
  totalUsers: int
  relationshipManagers: int
  branchManagers: int
  administrators: int
  branches: int
  customers: int
  tasks: int
  interactions: int
  todayLogins: int
  todayAnalyses: int
  totalAIRequests: int
  averageResponseTimeMs: float
  platformUptimeDays: float
  backendStatus: str # HEALTHY, DEGRADED, OFFLINE
  frontendStatus: str
  databaseStatus: str
  aiStatus: str

class PerformanceMetrics(BaseModel):
  averageApiLatencyMs: float
  p95LatencyMs: float
  maxLatencyMs: float
  engineProcessingTimes: Dict[str, float]
  memoryUsageMb: float
  cpuUsagePct: float
  databaseQueryTimeMs: float
  dailyRequestVolume: int
  hourlyRequestTrend: List[int]

class SecuritySummary(BaseModel):
  failedLoginAttempts: int
  passwordResetRequests: int
  accountLockouts: int
  permissionChanges: int
  roleChanges: int
  auditViolations: int
  inactiveUsers: int
  suspiciousActivities: int
  securityHealthScore: float

class AuditLogItem(BaseModel):
  timestamp: str
  user: str
  role: str
  action: str
  module: str
  entity: str
  status: str # SUCCESS, FAILURE
  traceId: str

class ConfigSettings(BaseModel):
  aiConfidenceThreshold: float
  priorityThreshold: float
  relationshipThreshold: float
  portfolioThreshold: float
  taskReminderIntervalMinutes: int
  sessionTimeoutMinutes: int
  theme: str
  featureFlags: Dict[str, bool]
  environment: str

class BranchKPI(BaseModel):
  branchName: str
  customerCount: int
  averageTrustScore: float
  averagePriorityScore: float
  averageRelationshipHealth: float
  averagePortfolioHealth: float
  averageRMWorkload: float
  performanceRating: str # High, Stable, Needs Attention

class UserProductivity(BaseModel):
  username: str
  role: str
  branch: str
  status: str # ACTIVE, INACTIVE
  lastLogin: str
  assignedCustomers: int
  assignedTasks: int
  productivityScore: float

class OperationalAnalytics(BaseModel):
  dailyAIRequests: List[Dict[str, Any]]
  monthlyCustomerGrowth: List[Dict[str, Any]]
  engineUsage: Dict[str, int]
  dashboardVisits: List[Dict[str, Any]]
  taskCompletionRates: Dict[str, float]
  relationshipMeetingsTrend: List[Dict[str, Any]]
  priorityTrends: List[Dict[str, Any]]

class PlatformNotification(BaseModel):
  id: str
  type: str
  message: str
  timestamp: str
  severity: str # INFO, WARNING, CRITICAL

class AdminSummaryBriefing(BaseModel):
  briefing: str # 200-250 words
  platformStatus: str
  operationalHighlights: str
  largestOperationalConcern: str
  securityPosture: str
  overallAIPlatformHealth: float
  recommendedAdministrativeFocus: str
  overallConfidence: str # HIGH, MEDIUM, LOW

class PlatformIQProfile(BaseModel):
  platformSummary: PlatformHealthSummary
  engineHealths: List[SystemHealthItem]
  performance: PerformanceMetrics
  security: SecuritySummary
  auditLogs: List[AuditLogItem]
  configuration: ConfigSettings
  branches: List[BranchKPI]
  users: List[UserProductivity]
  analytics: OperationalAnalytics
  notifications: List[PlatformNotification]
  summary: AdminSummaryBriefing
  confidence: str # HIGH, MEDIUM, LOW
