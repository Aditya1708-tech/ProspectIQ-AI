import type { LoginInput } from 'shared';

const API_BASE_URL = 'http://localhost:5000/api/v1';

function getHeaders() {
  const token = localStorage.getItem('prospectiq_access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export async function login(input: LoginInput) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || 'Login failed');
  }
  return data.data; // { accessToken, refreshToken, user: { id, username, name, roles } }
}

export async function logout(refreshToken: string) {
  const res = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || 'Logout failed');
  }
  return data.data;
}

export async function refresh(refreshToken: string) {
  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || 'Refresh failed');
  }
  return data.data;
}

export async function me() {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: getHeaders()
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || 'Failed to fetch current user profile');
  }
  return data.data;
}

// Sprint 3 Customer Directory API calls
export async function getCustomers(params: {
  page: number;
  limit: number;
  sort: string;
  order: 'asc' | 'desc';
  search?: string;
  status?: string;
  segment?: string;
  riskCategory?: string;
}) {
  const query = new URLSearchParams();
  query.append('page', params.page.toString());
  query.append('limit', params.limit.toString());
  query.append('sort', params.sort);
  query.append('order', params.order);
  if (params.search) query.append('search', params.search);
  if (params.status) query.append('status', params.status);
  if (params.segment) query.append('segment', params.segment);
  if (params.riskCategory) query.append('riskCategory', params.riskCategory);

  const res = await fetch(`${API_BASE_URL}/customers?${query.toString()}`, {
    headers: getHeaders()
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || 'Failed to fetch customers');
  }
  return data.data; // { data: Customer[], pagination: PaginationMeta }
}

export async function getCustomerProfile(id: string) {
  const res = await fetch(`${API_BASE_URL}/customers/${id}/profile`, {
    headers: getHeaders()
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || 'Failed to fetch customer profile');
  }
  return data.data; // CustomerProfile
}

export async function getCustomerAnalyze(id: string) {
  const res = await fetch(`${API_BASE_URL}/customers/${id}/analyze`, {
    headers: getHeaders()
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || 'Failed to analyze customer profile');
  }
  return data.data; // AIAnalysisResponse
}

export async function getDashboardData() {
  const res = await fetch(`${API_BASE_URL}/dashboard`, {
    headers: getHeaders()
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || 'Failed to fetch dashboard intelligence');
  }
  return data.data;
}

export async function getCustomerExplain(id: string) {
  const res = await fetch(`${API_BASE_URL}/customers/${id}/explain`, {
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch explainability profile');
  return data.data;
}

export async function getCustomerAudit(id: string) {
  const res = await fetch(`${API_BASE_URL}/customers/${id}/audit`, {
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch audit log');
  return data.data;
}

export async function getCustomerTimeline(id: string) {
  const res = await fetch(`${API_BASE_URL}/customers/${id}/timeline`, {
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch reasoning timeline');
  return data.data;
}

export async function getCustomerEvidence(id: string) {
  const res = await fetch(`${API_BASE_URL}/customers/${id}/evidence`, {
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch evidence matrix');
  return data.data;
}

export async function getCustomerConfidence(id: string) {
  const res = await fetch(`${API_BASE_URL}/customers/${id}/confidence`, {
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch confidence rating');
  return data.data;
}

export interface EngineExplanation {
  decision: string;
  reason: string;
  evidenceUsed: string[];
  supportingMetrics: string[];
  negativeFactors: string[];
  positiveFactors: string[];
  confidence: string;
  modelVersion: string;
  executionTimeMs: number;
}

export interface DecisionTreeNode {
  title: string;
  summary: string;
  inputReferences: string[];
  outputReferences: string[];
  dependencies: string[];
  executionLatencyMs: number;
}

export interface EvidenceItem {
  evidenceName: string;
  engine: string;
  contribution: string;
  confidenceWeight: string;
  status: string;
  evidenceSource: string;
}

export interface ConfidenceDimension {
  score: number;
  explanation: string;
}

export interface ConfidenceModel {
  overallConfidence: number;
  dataCompleteness: ConfidenceDimension;
  behaviorConsistency: ConfidenceDimension;
  interactionCoverage: ConfidenceDimension;
  portfolioContext: ConfidenceDimension;
}

export interface ExplainTimelineEvent {
  stepName: string;
  timestamp: string;
  latencyMs: number;
  status: string;
}

export interface ScoreComparison {
  previousScore: number;
  currentScore: number;
  difference: number;
  status: string;
  reason: string;
}

export interface ComparisonAnalysis {
  priorityScore: ScoreComparison;
  trustScore: ScoreComparison;
  digitalAdoption: ScoreComparison;
  wealthScore: ScoreComparison;
  growthScore: ScoreComparison;
  retentionRisk: ScoreComparison;
}

export interface AuditRecord {
  auditId: string;
  generatedTime: string;
  engineVersions: Record<string, string>;
  inputSummary: string;
  outputSummary: string;
  sha256Digest: string;
  executionTimeMs: number;
  traceId: string;
}

export interface ExplainabilityRating {
  explainabilityScore: number;
  transparencyRating: string;
  coverage: number;
  auditCompleteness: number;
  decisionConsistency: number;
}

export interface ExplainIQProfile {
  executiveExplanation: string;
  explanations: Record<string, EngineExplanation>;
  decisionTree: DecisionTreeNode[];
  evidenceMatrix: EvidenceItem[];
  confidenceModel: ConfidenceModel;
  reasoningTimeline: ExplainTimelineEvent[];
  comparisonAnalysis: ComparisonAnalysis;
  auditRecord: AuditRecord;
  explainabilityRating: ExplainabilityRating;
  analysisVersion: string;
}

export async function getCustomerNextAction(id: string) {
  const res = await fetch(`${API_BASE_URL}/customers/${id}/next-action`, {
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch next action');
  return data.data;
}

export async function getCustomerWorkflow(id: string) {
  const res = await fetch(`${API_BASE_URL}/customers/${id}/workflow`, {
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch workflows');
  return data.data;
}

export async function getCustomerChecklist(id: string) {
  const res = await fetch(`${API_BASE_URL}/customers/${id}/checklist`, {
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch checklist');
  return data.data;
}

export async function getCustomerSchedule(id: string) {
  const res = await fetch(`${API_BASE_URL}/customers/${id}/schedule`, {
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch schedules');
  return data.data;
}

// NBAIQ TypeScript Interfaces
export interface NBAAction {
  title: string;
  description: string;
  reason: string;
  expectedDuration: string;
  priority: string;
  owner: string;
  recommendedDueDate: string;
  sla: string;
}

export interface NBAIQConfidenceDetails {
  overallScore: number;
  trustLayerQuality: number;
  dataCompleteness: number;
  priorityConfidence: number;
  portfolioConfidence: number;
  interactionCoverage: number;
}

export interface NBAIQBusinessJustification {
  whyThisActionExists: string;
  triggeringEngine: string;
  contributingMetrics: string[];
  expectedBenefit: string;
}

export interface NBAIQCustomerTaskCard {
  headline: string;
  summary: string;
  checklist: string[];
  talkingPoints: string[];
  preparationNotes: string[];
  successCriteria: string;
}

export interface NBAIQProfile {
  overallRecommendation: string;
  recommendationCategory: string;
  urgency: string;
  businessJustification: NBAIQBusinessJustification;
  expectedOutcome: string;
  estimatedRMTime: string;
  recommendedCompletionWindow: string;
  confidence: NBAIQConfidenceDetails;
  primaryAction: NBAAction;
  secondaryAction: NBAAction | null;
  optionalFollowUp: NBAAction | null;
  taskCard: NBAIQCustomerTaskCard;
  schedule: string[];
  checklist: string[];
}

// Sprint 11 Task Management Interfaces & APIs
export interface RMTask {
  id: string;
  customerId: string;
  assignedRM: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  completedAt?: string;
  estimatedDuration?: number;
  actualDuration?: number;
  createdBy?: string;
  updatedBy?: string;
  customer?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    segment: string;
  };
  comments?: TaskComment[];
  reminders?: TaskReminder[];
  history?: TaskHistory[];
  attachments?: TaskAttachment[];
}

export interface TaskComment {
  id: string;
  taskId: string;
  comment: string;
  authorId: string;
  createdAt: string;
  author?: {
    id: string;
    name: string;
    username: string;
  };
}

export interface TaskReminder {
  id: string;
  taskId: string;
  reminderTime: string;
  message: string;
  isSent: boolean;
  createdAt: string;
}

export interface TaskHistory {
  id: string;
  taskId: string;
  fieldName: string;
  oldValue?: string;
  newValue?: string;
  changedById: string;
  createdAt: string;
  changedBy?: {
    id: string;
    name: string;
  };
}

export interface TaskAttachment {
  id: string;
  taskId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  uploadedById: string;
  createdAt: string;
  uploadedBy?: {
    id: string;
    name: string;
  };
}

export interface TaskCalendarData {
  overdue: RMTask[];
  today: RMTask[];
  tomorrow: RMTask[];
  thisWeek: RMTask[];
  nextWeek: RMTask[];
  nextMonth: RMTask[];
  upcoming: RMTask[];
}

export interface TaskWorkloadData {
  totalTasks: number;
  pendingCount: number;
  completedCount: number;
  cancelledCount: number;
  overdueCount: number;
  pendingPercentage: number;
  completedPercentage: number;
  overduePercentage: number;
  averageWorkload: number;
  tasksByCategory: Record<string, number>;
  rmWorkload: Array<{
    rmName: string;
    pending: number;
    completed: number;
    overdue: number;
    total: number;
  }>;
}

export interface TaskAnalyticsData {
  totalTasks: number;
  totalCompleted: number;
  completedOnTime: number;
  averageCompletionTimeHours: number;
  slaComplianceRate: number;
  overdueActivePercentage: number;
  completionTrends: Record<string, number>;
}

export async function getTasks(filters?: { status?: string; priority?: string; category?: string; customerId?: string }): Promise<RMTask[]> {
  const query = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, val]) => {
      if (val) query.append(key, val);
    });
  }
  const res = await fetch(`${API_BASE_URL}/tasks?${query.toString()}`, {
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch tasks');
  return data.data;
}

export async function getTaskDetails(id: string): Promise<RMTask> {
  const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch task details');
  return data.data;
}

export async function createTask(payload: any): Promise<RMTask> {
  const res = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: { ...getHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to create task');
  return data.data;
}

export async function updateTask(id: string, payload: any): Promise<RMTask> {
  const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: { ...getHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to update task');
  return data.data;
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to delete task');
}

export async function addTaskComment(id: string, comment: string): Promise<TaskComment> {
  const res = await fetch(`${API_BASE_URL}/tasks/${id}/comment`, {
    method: 'POST',
    headers: { ...getHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ comment })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to add comment');
  return data.data;
}

export async function completeTask(id: string, actualDuration?: number, completionNotes?: string): Promise<RMTask> {
  const res = await fetch(`${API_BASE_URL}/tasks/${id}/complete`, {
    method: 'POST',
    headers: { ...getHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ actualDuration, completionNotes })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to complete task');
  return data.data;
}

export async function getTaskCalendar(): Promise<TaskCalendarData> {
  const res = await fetch(`${API_BASE_URL}/tasks/calendar`, {
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch task calendar');
  return data.data;
}

export async function getTaskWorkload(): Promise<TaskWorkloadData> {
  const res = await fetch(`${API_BASE_URL}/tasks/workload`, {
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch task workload');
  return data.data;
}

export async function getTaskAnalytics(): Promise<TaskAnalyticsData> {
  const res = await fetch(`${API_BASE_URL}/tasks/analytics`, {
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch task analytics');
  return data.data;
}

export async function getNotifications() {
  const res = await fetch(`${API_BASE_URL}/notifications`, {
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch notifications');
  return data.data;
}

export async function getUnreadNotifications() {
  const res = await fetch(`${API_BASE_URL}/notifications/unread`, {
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch unread notifications');
  return data.data;
}

export async function getCriticalNotifications() {
  const res = await fetch(`${API_BASE_URL}/notifications/critical`, {
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch critical notifications');
  return data.data;
}

export async function getNotificationTimeline() {
  const res = await fetch(`${API_BASE_URL}/notifications/timeline`, {
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch timeline');
  return data.data;
}

export async function getMorningBrief() {
  const res = await fetch(`${API_BASE_URL}/notifications/morning-brief`, {
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch morning brief');
  return data.data;
}

export async function getExecutiveBrief() {
  const res = await fetch(`${API_BASE_URL}/notifications/executive-brief`, {
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch executive brief');
  return data.data;
}

export async function getNotificationAnalytics() {
  const res = await fetch(`${API_BASE_URL}/notifications/analytics`, {
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch analytics');
  return data.data;
}

export async function markNotificationAsRead(id: string) {
  const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
    method: 'PATCH',
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to mark read');
  return data.data;
}

export async function acknowledgeNotification(id: string) {
  const res = await fetch(`${API_BASE_URL}/notifications/${id}/acknowledge`, {
    method: 'PATCH',
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to acknowledge');
  return data.data;
}




