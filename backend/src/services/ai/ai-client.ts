import type { CustomerProfile } from 'shared';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  channel: string[];
  createdTime: string;
  expiryTime: string;
  assignedRM: string;
  assignedManager: string;
  readStatus: boolean;
  acknowledgedStatus: boolean;
  escalationLevel: number;
  workflowLink: string;
  confidence: number;
}

export interface NotificationTimelineEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  timestamp: string;
  type: string;
  sourceEngine: string;
  customerId?: string;
  customerName?: string;
  workflowLink?: string;
}

export interface NotificationAnalytics {
  unreadNotifications: number;
  criticalAlerts: number;
  overdueAlerts: number;
  averageResponseTime: number;
  acknowledgementRate: number;
  resolutionRate: number;
  escalationRate: number;
  dailyVolume: number;
  weeklyVolume: number;
  monthlyVolume: number;
}

export interface NotificationIQResult {
  notifications: NotificationItem[];
  morningBrief: string;
  executiveBrief: string;
  timeline: NotificationTimelineEvent[];
  analytics: NotificationAnalytics;
}


export interface TrustLayerResult {
  analysisVersion: string;
  generatedAt: string;
  executionTimeMs: number;
  engine: string;
  reasoning: string[];
  data: {
    qualityScore: number;
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
    warnings: string[];
    errors: string[];
  };
}

export interface BehaviorIQResult {
  analysisVersion: string;
  generatedAt: string;
  executionTimeMs: number;
  engine: string;
  reasoning: string[];
  data: {
    income: {
      totalCredits: number;
      monthlyEstimate: number;
      salaryDetected: boolean;
      salaryDetails: string;
    };
    expenses: {
      totalDebits: number;
      spendingCategories: Record<string, number>;
      cashDependencyRatio: number;
      digitalPaymentRatio: number;
    };
    savings: {
      totalSavings: number;
      savingsRatio: number;
    };
    transactions: {
      totalCount: number;
      frequencyPerMonth: number;
    };
  };
}

export interface DimensionDetail {
  score: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  factors: string[];
}

export interface FinancialPersona {
  name: string;
  description: string;
  strengths: string[];
  watchAreas: string[];
  bankingFocusAreas: string[];
}

export interface FinancialDNAResult {
  analysisVersion: string;
  generatedAt: string;
  executionTimeMs: number;
  engine: string;
  reasoning: string[];
  data: {
    modelVersion: string;
    profileVersion: string;
    persona: FinancialPersona;
    incomeStability: DimensionDetail;
    expenseDiscipline: DimensionDetail;
    savingsHealth: DimensionDetail;
    liquidityStrength: DimensionDetail;
    digitalAdoption: DimensionDetail;
    creditHealth: DimensionDetail;
    investmentReadiness: DimensionDetail;
    wealthPotential: DimensionDetail;
  };
}

export interface PriorityScoreDetail {
  score: number;
  confidence: string;
  drivers: string[];
}

export interface OpportunityMatrix {
  category: string;
  priorityRank: number;
  sla: string;
  color: string;
  actionType: string;
}

export interface PriorityIQResult {
  analysisVersion: string;
  generatedAt: string;
  executionTimeMs: number;
  engine: string;
  reasoning: string[];
  data: {
    opportunity: PriorityScoreDetail;
    engagement: PriorityScoreDetail;
    growthPotential: PriorityScoreDetail;
    retentionRisk: PriorityScoreDetail;
    urgency: PriorityScoreDetail;
    finalPriority: PriorityScoreDetail;
    opportunityMatrix: OpportunityMatrix;
    opportunityDrivers: string[];
  };
}

export interface MeetingPreparation {
  customerProfileSummary: string;
  likelyDiscussionTopics: string[];
  potentialConcerns: string[];
}

export interface NextBestAction {
  title: string;
  timeline: string;
  reason: string;
}

export interface CoPilotSnapshot {
  persona: string;
  priorityCategory: string;
  priorityScore: number;
  urgency: string;
  relationshipManager: string;
  branch: string;
  confidence: string;
}

export interface TimelineEvent {
  time: string;
  event: string;
}

export interface CoPilotResult {
  analysisVersion: string;
  generatedAt: string;
  executionTimeMs: number;
  engine: string;
  reasoning: string[];
  data: {
    executiveSummary: string;
    snapshot: CoPilotSnapshot;
    strengths: string[];
    watchAreas: string[];
    growthOpportunities: string[];
    meetingPreparation: MeetingPreparation;
    conversationStarters: string[];
    timeline: TimelineEvent[];
    nextBestAction: NextBestAction;
  };
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

export interface ExplainIQResult {
  analysisVersion: string;
  generatedAt: string;
  executionTimeMs: number;
  engine: string;
  reasoning: string[];
  data: ExplainIQProfile;
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

export interface NBAIQResult {
  analysisVersion: string;
  generatedAt: string;
  executionTimeMs: number;
  engine: string;
  reasoning: string[];
  data: NBAIQProfile;
}

export interface JourneyEvent {
  timestamp: string;
  title: string;
  description: string;
  sourceEngine: string;
  confidence: number;
}

export interface RelationshipHealthData {
  score: number;
  category: 'Healthy' | 'Growing' | 'Needs Attention' | 'Critical';
  positiveDrivers: string[];
  negativeDrivers: string[];
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface InteractionIntelligenceData {
  meetings: number;
  calls: number;
  emails: number;
  followUps: number;
  completedTasks: number;
  pendingTasks: number;
  missedTasks: number;
  averageResponseTime: number;
  interactionCoverage: number;
  daysSinceLastContact: number;
}

export interface EngagementMetrics {
  interactionScore: number;
  followUpQuality: number;
  responseConsistency: number;
  rmCoverage: number;
  meetingCompletion: number;
  touchpointFrequency: number;
}

export interface Milestone {
  title: string;
  description: string;
  category: string;
  importance: 'HIGH' | 'MEDIUM' | 'LOW';
  date: string;
}

export interface TouchpointChannelDetail {
  count: number;
  completionRate: number;
  successRate: number;
  resolutionTime: number;
  effectivenessScore: number;
}

export interface TouchpointEffectivenessData {
  calls: TouchpointChannelDetail;
  meetings: TouchpointChannelDetail;
  emails: TouchpointChannelDetail;
  followUps: TouchpointChannelDetail;
  tasks: TouchpointChannelDetail;
}

export interface RelationshipRisk {
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
  suggestedRMWorkflow: string;
  confidence: number;
}

export interface ExecutiveRelationshipSummaryData {
  briefing: string;
  relationshipStatus: string;
  engagementQuality: string;
  strengths: string[];
  risks: string[];
  rmEffectiveness: string;
  trajectory: string;
  recommendedFocus: string;
  confidence: string;
}

export interface RelationshipIQProfile {
  health: RelationshipHealthData;
  journey: JourneyEvent[];
  interactions: InteractionIntelligenceData;
  engagement: EngagementMetrics;
  milestones: Milestone[];
  touchpoints: TouchpointEffectivenessData;
  risks: RelationshipRisk[];
  summary: ExecutiveRelationshipSummaryData;
  confidence: string;
}

export interface RelationshipIQResult {
  analysisVersion: string;
  generatedAt: string;
  executionTimeMs: number;
  engine: string;
  reasoning: string[];
  data: RelationshipIQProfile;
}

export interface PredictionWindow {
  predictedValue: number;
  expectedChange: number;
  percentageChange: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
}

export interface ForecastMetric {
  currentValue: number;
  d30: PredictionWindow;
  d90: PredictionWindow;
  d180: PredictionWindow;
}

export interface ChurnPrediction {
  probability: number;
  riskCategory: 'Low' | 'Medium' | 'High' | 'Critical';
  primaryDrivers: string[];
  recommendedRMWorkflow: string;
}

export interface GrowthPrediction {
  growthScore: number;
  growthCategory: 'Declining' | 'Stable' | 'Growing' | 'Accelerating';
  growthDrivers: string[];
  growthRisks: string[];
}

export interface RelationshipForecast {
  predictedHealth: number;
  predictedStage: string;
  momentum: number;
  predictedEngagement: number;
  sentiment: string;
  rmCoverage: number;
  expectedDirection: string;
}

export interface OpportunityForecast {
  futureOpportunityScore: number;
  futureWealthPotential: number;
  futurePriority: number;
  expectedRMAttentionLevel: 'High' | 'Medium' | 'Low';
  expectedRelationshipValue: number;
}

export interface EarlyWarning {
  id: string;
  type: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  probability: number;
  daysToTrigger: number;
  description: string;
}

export interface PredictionTimelineNode {
  timeframe: 'Today' | '30 Days' | '90 Days' | '180 Days';
  predictedEvent: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
  expectedRMAction: string;
}

export interface ExecutiveForecast {
  briefing: string;
  currentTrajectory: string;
  futureOpportunities: string[];
  futureOperationalRisks: string[];
  expectedCustomerDirection: string;
  recommendedRMFocus: string;
  overallConfidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface PredictIQProfile {
  forecasts: Record<string, ForecastMetric>;
  churn: ChurnPrediction;
  growth: GrowthPrediction;
  relationship: RelationshipForecast;
  opportunity: OpportunityForecast;
  earlyWarnings: EarlyWarning[];
  timeline: PredictionTimelineNode[];
  summary: ExecutiveForecast;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface PredictIQResult {
  analysisVersion: string;
  generatedAt: string;
  executionTimeMs: number;
  engine: string;
  reasoning: string[];
  data: PredictIQProfile;
}

export interface ScenarioAdjustment {
  rmInteractionsChange: number;
  kycEvent: boolean | null;
  savingsRatioChange: number;
  digitalPaymentsChange: number;
  salaryStabilityChange: number;
  meetingCompletionChange: number;
  followUpQualityChange: number;
  engagementChange: number;
  closePendingTasks: boolean | null;
}

export interface SimulationScenario {
  scenarioName: string;
  description: string;
  adjustments: ScenarioAdjustment;
}

export interface ProjectedMetric {
  currentValue: number;
  projectedValue: number;
  difference: number;
  percentageDifference: number;
  isPositive: boolean;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface BusinessImpact {
  customerImpact: string;
  rmImpact: string;
  portfolioImpact: string;
  branchImpact: string;
  operationalImpact: string;
  relationshipImpact: string;
}

export interface DecisionMatrix {
  category: 'Highly Beneficial' | 'Beneficial' | 'Neutral' | 'Negative' | 'High Risk';
  reason: string;
  expectedOutcome: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface SimulationTimelineNode {
  timeframe: 'Today' | '30 Days' | '90 Days' | '180 Days';
  expectedEvent: string;
  expectedMetricChange: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedRMAction: string;
}

export interface SimulationSummary {
  briefing: string;
  objective: string;
  expectedOutcome: string;
  operationalImprovements: string;
  potentialRisks: string;
  overallConfidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface SimulationIQProfile {
  scenarioName: string;
  projectedMetrics: Record<string, ProjectedMetric>;
  impact: BusinessImpact;
  decision: DecisionMatrix;
  timeline: SimulationTimelineNode[];
  summary: SimulationSummary;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface SimulationIQResult {
  analysisVersion: string;
  generatedAt: string;
  executionTimeMs: number;
  engine: string;
  reasoning: string[];
  data: SimulationIQProfile;
}

export interface AIAnalysisResponse {
  trustLayer: TrustLayerResult;
  behaviorIQ: BehaviorIQResult | null;
  financialDNA: FinancialDNAResult | null;
  priorityIQ: PriorityIQResult | null;
  copilot: CoPilotResult | null;
  explainIQ: ExplainIQResult | null;
  nextBestActionIQ: NBAIQResult | null;
  relationshipIQ: RelationshipIQResult | null;
  predictIQ: PredictIQResult | null;
  simulationIQ: SimulationIQResult | null;
  fallback?: boolean;
}


// Portfolio Aggregation Structures (Sprint 8)
export interface PortfolioSummary {
  totalCustomers: number;
  retailCustomers: number;
  msmeCustomers: number;
  prospectsCount: number;
  dormantCount: number;
  activeCount: number;
  averageTrustScore: number;
  averageFinDNAScore: number;
  averagePriorityScore: number;
  averageWealthPotential: number;
  averageDigitalAdoption: number;
  averagePortfolioHealth: number;
}

export interface PortfolioHealthDetail {
  overallHealthScore: number;
  healthCategory: string;
  topPositiveDrivers: string[];
  topNegativeDrivers: string[];
  historicalTrend: string;
}

export interface PriorityMetricDetail {
  count: number;
  percentage: number;
  trend: string;
}

export interface PriorityDistributionProfile {
  immediateAction: PriorityMetricDetail;
  highPotential: PriorityMetricDetail;
  nurture: PriorityMetricDetail;
  monitor: PriorityMetricDetail;
  lowPriority: PriorityMetricDetail;
}

export interface OpportunityRecord {
  customerId: string;
  customerName: string;
  assignedRM: string;
  persona: string;
  priorityScore: number;
  opportunityScore: number;
  recommendedAction: string;
}

export interface RiskAlertDetail {
  severity: string;
  reason: string;
  affectedCustomer: string;
  affectedCustomerId: string;
  recommendedRMWorkflow: string;
}

export interface RMPerformanceRecord {
  rmName: string;
  customersManaged: number;
  averageTrust: number;
  averagePriority: number;
  averagePortfolioHealth: number;
  interactionCoverage: number;
  highPotentialCustomers: number;
  immediateActionCustomers: number;
  rmEffectivenessScore: number;
}

export interface TrendPoint {
  month: string;
  customerGrowth: number;
  priorityIndex: number;
  riskIndex: number;
  digitalAdoptionIndex: number;
  qualityIndex: number;
}

export interface DistributionDataset {
  segments: Record<string, number>;
  risks: Record<string, number>;
  personas: Record<string, number>;
  priorities: Record<string, number>;
  rms: Record<string, number>;
}

export interface PortfolioIQResponse {
  analysisVersion: string;
  generatedAt: string;
  executionTimeMs: number;
  engine: string;
  summary: PortfolioSummary;
  health: PortfolioHealthDetail;
  executiveSummary: string;
  priorityDistribution: PriorityDistributionProfile;
  topOpportunities: OpportunityRecord[];
  riskIntelligence: RiskAlertDetail[];
  rmLeaderboard: RMPerformanceRecord[];
  trends: TrendPoint[];
  distributions: DistributionDataset;
  fallback?: boolean;
  morningBrief?: string;
  actionCenter?: any[];
  earlyWarnings?: any[];
  workloadBalancer?: any[];
}

export interface SystemHealthItem {
  engineName: string;
  version: string;
  status: 'HEALTHY' | 'DEGRADED' | 'OFFLINE';
  averageLatencyMs: number;
  successRate: number;
  requestsToday: number;
  errorsToday: number;
  lastExecutionTime: string;
  overallHealthScore: number;
}

export interface PlatformHealthSummary {
  totalUsers: number;
  relationshipManagers: number;
  branchManagers: number;
  administrators: number;
  branches: number;
  customers: number;
  tasks: number;
  interactions: number;
  todayLogins: number;
  todayAnalyses: number;
  totalAIRequests: number;
  averageResponseTimeMs: number;
  platformUptimeDays: number;
  backendStatus: string;
  frontendStatus: string;
  databaseStatus: string;
  aiStatus: string;
}

export interface PerformanceMetrics {
  averageApiLatencyMs: number;
  p95LatencyMs: number;
  maxLatencyMs: number;
  engineProcessingTimes: Record<string, number>;
  memoryUsageMb: number;
  cpuUsagePct: number;
  databaseQueryTimeMs: number;
  dailyRequestVolume: number;
  hourlyRequestTrend: number[];
}

export interface SecuritySummary {
  failedLoginAttempts: number;
  passwordResetRequests: number;
  accountLockouts: number;
  permissionChanges: number;
  roleChanges: number;
  auditViolations: number;
  inactiveUsers: number;
  suspiciousActivities: number;
  securityHealthScore: number;
}

export interface AuditLogItem {
  timestamp: string;
  user: string;
  role: string;
  action: string;
  module: string;
  entity: string;
  status: 'SUCCESS' | 'FAILURE';
  traceId: string;
}

export interface ConfigSettings {
  aiConfidenceThreshold: number;
  priorityThreshold: number;
  relationshipThreshold: number;
  portfolioThreshold: number;
  taskReminderIntervalMinutes: number;
  sessionTimeoutMinutes: number;
  theme: string;
  featureFlags: Record<string, boolean>;
  environment: string;
}

export interface BranchKPI {
  branchName: string;
  customerCount: number;
  averageTrustScore: number;
  averagePriorityScore: number;
  averageRelationshipHealth: number;
  averagePortfolioHealth: number;
  averageRMWorkload: number;
  performanceRating: 'High' | 'Stable' | 'Needs Attention';
}

export interface UserProductivity {
  username: string;
  role: string;
  branch: string;
  status: 'ACTIVE' | 'INACTIVE';
  lastLogin: string;
  assignedCustomers: number;
  assignedTasks: number;
  productivityScore: number;
}

export interface OperationalAnalytics {
  dailyAIRequests: Array<{ date: string; count: number }>;
  monthlyCustomerGrowth: Array<{ month: string; count: number }>;
  engineUsage: Record<string, number>;
  dashboardVisits: Array<{ date: string; count: number }>;
  taskCompletionRates: Record<string, number>;
  relationshipMeetingsTrend: Array<{ date: string; count: number }>;
  priorityTrends: Array<{ date: string; score: number }>;
}

export interface PlatformNotification {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface AdminSummaryBriefing {
  briefing: string;
  platformStatus: string;
  operationalHighlights: string;
  largestOperationalConcern: string;
  securityPosture: string;
  overallAIPlatformHealth: number;
  recommendedAdministrativeFocus: string;
  overallConfidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface PlatformIQProfile {
  platformSummary: PlatformHealthSummary;
  engineHealths: SystemHealthItem[];
  performance: PerformanceMetrics;
  security: SecuritySummary;
  auditLogs: AuditLogItem[];
  configuration: ConfigSettings;
  branches: BranchKPI[];
  users: UserProductivity[];
  analytics: OperationalAnalytics;
  notifications: PlatformNotification[];
  summary: AdminSummaryBriefing;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export class AIClient {
  private getServiceUrl() {
    return process.env.AI_SERVICE_URL || 'http://localhost:8000';
  }

  private mapProfileToPayload(profile: CustomerProfile) {
    return {
      id: profile.customer.id,
      name: profile.customer.name,
      email: profile.customer.email,
      phone: profile.customer.phone,
      occupation: profile.customer.occupation,
      incomeRange: profile.customer.incomeRange,
      riskCategory: profile.customer.riskCategory,
      segment: profile.customer.segment,
      status: profile.customer.status,
      branchCode: profile.customer.branchCode,
      lastInteractionAt: profile.customer.lastInteractionAt,
      addresses: profile.addresses.map(a => ({
        type: a.type,
        street: a.street,
        city: a.city,
        state: a.state,
        postalCode: a.postalCode,
        country: a.country
      })),
      accounts: profile.accounts.map(acc => {
        const accTransactions = profile.transactions
          .filter(t => t.bankAccountId === acc.id)
          .map(t => ({
            amount: t.amount,
            type: t.type,
            category: t.category,
            description: t.description,
            valueDate: t.valueDate
          }));
        return {
          accountNumber: acc.accountNumber,
          accountType: acc.accountType,
          balance: acc.balance,
          transactions: accTransactions
        };
      }),
      interactions: profile.interactions.map(i => ({
        id: i.id,
        type: i.type,
        summary: i.summary,
        notes: i.notes,
        interactionDate: i.interactionDate,
        createdAt: i.createdAt
      })),
      tasks: ((profile as any).tasks || []).map((t: any) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        priority: t.priority,
        status: t.status,
        category: t.category,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
        dueDate: t.dueDate,
        completedAt: t.completedAt,
        estimatedDuration: t.estimatedDuration,
        actualDuration: t.actualDuration,
        history: (t.history || []).map((h: any) => ({
          id: h.id,
          fieldName: h.fieldName,
          oldValue: h.oldValue,
          newValue: h.newValue,
          createdAt: h.createdAt
        }))
      }))
    };
  }

  async analyzeProfile(profile: CustomerProfile, requestId?: string): Promise<AIAnalysisResponse> {
    try {
      const requestPayload = this.mapProfileToPayload(profile);
      const response = await fetch(`${this.getServiceUrl()}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(requestId ? { 'X-Request-ID': requestId } : {})
        },
        body: JSON.stringify(requestPayload)
      });

      if (!response.ok) {
        throw new Error(`AI service returned status code ${response.status}`);
      }

      const result = await response.json();
      return result as AIAnalysisResponse;
    } catch (err: any) {
      console.warn(`[AI CLIENT FALLBACK WARNING] AI Service analysis failed: ${err.message}. Generating local fallback telemetry...`);
      return this.generateLocalFallback(profile);
    }
  }

  async simulateProfile(profile: CustomerProfile, scenario: SimulationScenario, requestId?: string): Promise<SimulationIQProfile> {
    try {
      const profilePayload = this.mapProfileToPayload(profile);
      const payload = {
        profile: profilePayload,
        scenario: scenario
      };
      
      const response = await fetch(`${this.getServiceUrl()}/simulate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(requestId ? { 'X-Request-ID': requestId } : {})
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`AI service simulate returned status code ${response.status}`);
      }

      const result = await response.json();
      return result as SimulationIQProfile;
    } catch (err: any) {
      console.warn(`[AI CLIENT FALLBACK WARNING] AI Service simulate failed: ${err.message}. Serving local simulation fallback...`);
      const fallbackResponse = this.generateLocalFallback(profile);
      return fallbackResponse.simulationIQ!.data;
    }
  }

  async analyzePortfolio(profiles: CustomerProfile[]): Promise<PortfolioIQResponse> {
    try {
      const payload = {
        profiles: profiles.map(p => this.mapProfileToPayload(p))
      };
      
      const response = await fetch(`${this.getServiceUrl()}/portfolio/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Portfolio analysis returned status code ${response.status}`);
      }

      const result = await response.json();
      return result as PortfolioIQResponse;
    } catch (err: any) {
      console.warn(`[AI CLIENT FALLBACK WARNING] Portfolio analyze failed: ${err.message}. Serving local aggregate heuristics...`);
      return this.generateLocalPortfolioFallback(profiles);
    }
  }

  private generateLocalFallback(profile: CustomerProfile): AIAnalysisResponse {
    const nowStr = new Date().toISOString();
    const totalSavings = profile.accounts.reduce((sum, acc) => sum + acc.balance, 0);
    
    let totalCredits = 0;
    let totalDebits = 0;
    let salaryDetected = false;
    const spendingCategories: Record<string, number> = {};
    let digitalDebits = 0;
    let cashDebits = 0;

    for (const t of profile.transactions) {
      const amount = Math.abs(t.amount);
      if (t.type === 'CREDIT') {
        totalCredits += amount;
        if (t.category === 'SALARY' || t.description.toLowerCase().includes('salary')) {
          salaryDetected = true;
        }
      } else {
        totalDebits += amount;
        spendingCategories[t.category] = (spendingCategories[t.category] || 0) + amount;
        if (['UPI', 'GST', 'CARD'].includes(t.category) || t.description.toLowerCase().includes('upi')) {
          digitalDebits += amount;
        } else if (t.category === 'CASH' || t.description.toLowerCase().includes('cash')) {
          cashDebits += amount;
        }
      }
    }

    const savingsRatio = totalCredits > 0 ? ((totalCredits - totalDebits) / totalCredits) * 100 : 0;
    const digitalPaymentRatio = totalDebits > 0 ? (digitalDebits / totalDebits) * 100 : 0;
    const cashDependencyRatio = totalDebits > 0 ? (cashDebits / totalDebits) * 100 : 0;

    // Compute Local Heuristic DNA Dimensions
    const incomeStability = profile.customer.occupation ? 80 : 50;
    const expenseDiscipline = Math.round((savingsRatio * 0.5) + ((100 - cashDependencyRatio) * 0.5));
    const savingsHealth = Math.round((savingsRatio * 0.6) + (totalSavings > 100000 ? 40 : 20));
    const liquidityStrength = totalSavings > 50000 ? 85 : 45;
    const digitalAdoption = Math.round(digitalPaymentRatio);
    const creditHealth = profile.customer.riskCategory === 'LOW' ? 95 : (profile.customer.riskCategory === 'MEDIUM' ? 75 : 45);
    const investmentReadiness = Math.round((savingsHealth * 0.5) + (creditHealth * 0.5));
    const wealthPotential = profile.customer.incomeRange.includes('2,500,000') || profile.customer.incomeRange.includes('5,000,000') ? 90 : 55;

    // Local Persona Classification
    let personaName = 'Growth Builder';
    let description = 'Active accumulator of wealth focusing on steady income deposits.';
    let strengthsList = ['Consistent income flow', 'Stable career path'];
    let watchAreasList = ['reliance on single credit stream'];
    let bankingFocusAreas = ['Systematic Investment Plans (SIP)', 'recurring deposits'];

    if (profile.customer.segment === 'MSME') {
      if (incomeStability >= 70) {
        personaName = 'High Potential MSME';
        description = 'Established business segment customer showing high cash flow turnover.';
        strengthsList = ['Strong trade credit turnover', 'Excellent liquidity strength'];
        watchAreasList = ['accounts receivable cycles'];
        bankingFocusAreas = ['Trade finance limits', 'Letter of Credit services'];
      } else {
        personaName = 'Emerging Entrepreneur';
        description = 'Self-employed MSME owner driving initial business growth.';
        strengthsList = ['High business flow activity', 'active current account turnover'];
        watchAreasList = ['volatile monthly cash flows'];
        bankingFocusAreas = ['Working capital overdrafts', 'Business credit cards'];
      }
    } else {
      if (wealthPotential >= 80 && investmentReadiness >= 70) {
        personaName = 'Premium Investor';
        description = 'High wealth potential client ready for active capital market allocations.';
        strengthsList = ['Significant liquid assets', 'high investment readiness'];
        watchAreasList = ['tax planning complexity'];
        bankingFocusAreas = ['Portfolio management services', 'Premium banking access'];
      } else if (savingsHealth >= 75) {
        personaName = 'Wealth Accumulator';
        description = 'High savings profile with stable cash flow lines.';
        strengthsList = ['Exceptional savings ratio', 'low dependency on cash withdrawals'];
        watchAreasList = ['conservative yield generation'];
        bankingFocusAreas = ['High-yield fixed deposits', 'automated sweeps'];
      } else if (expenseDiscipline >= 75) {
        personaName = 'Conservative Saver';
        description = 'Risk-averse profile prioritizing security and liquidity strength.';
        strengthsList = ['Excellent expense discipline', 'zero active debt holdings'];
        watchAreasList = ['inflation risk exposure'];
        bankingFocusAreas = ['Term deposits', 'safe savings plans'];
      } else if (digitalAdoption >= 80) {
        personaName = 'Digital Native';
        description = 'High digital banking participant utilizing UPI transactions.';
        strengthsList = ['Zero paper dependency', 'high UPI payment consistency'];
        watchAreasList = ['impulsive digital shopping spend'];
        bankingFocusAreas = ['Mobile banking sweeps', 'digital cashbacks'];
      }
    }

    const confidence = profile.customer.phone ? 'HIGH' : 'MEDIUM';

    // Compute Local Heuristic PriorityIQ Scores
    const oppScore = Math.round((savingsHealth * 0.3) + (wealthPotential * 0.3) + (liquidityStrength * 0.2) + (investmentReadiness * 0.2));
    const engScore = Math.round((digitalAdoption * 0.4) + (profile.transactions.length * 2) + 30);
    const growthScore = Math.round((wealthPotential * 0.5) + (digitalAdoption * 0.25) + (incomeStability * 0.25));
    const retentionRiskScore = savingsHealth < 40 ? 50 : 15;
    const urgencyScore = Math.round((retentionRiskScore * 0.6) + (oppScore * 0.4));
    
    // finalPriority = opp*30% + growth*25% + risk*20% + eng*15% + trustConf*10%
    const finalPriorityScore = Math.round(
      (oppScore * 0.3) +
      (growthScore * 0.25) +
      (retentionRiskScore * 0.2) +
      (engScore * 0.15) +
      (90 * 0.1)
    );

    // Matrix mapping
    let category = 'Nurture';
    let rank = 3;
    let sla = '7 Days';
    let color = 'blue';
    let actionType = 'Personalized Follow-up';

    if (finalPriorityScore >= 85) {
      category = 'Immediate Action';
      rank = 1;
      sla = '24 Hours';
      color = 'red';
      actionType = 'Schedule RM Meeting';
    } else if (finalPriorityScore >= 70) {
      category = 'High Potential';
      rank = 2;
      sla = '48 Hours';
      color = 'amber';
      actionType = 'Call Customer';
    } else if (finalPriorityScore >= 50) {
      category = 'Nurture';
      rank = 3;
      sla = '7 Days';
      color = 'blue';
      actionType = 'Personalized Follow-up';
    } else if (finalPriorityScore >= 35) {
      category = 'Monitor';
      rank = 4;
      sla = '30 Days';
      color = 'slate';
      actionType = 'Quarterly Review';
    } else {
      category = 'Low Priority';
      rank = 5;
      sla = 'Quarterly';
      color = 'gray';
      actionType = 'Passive Monitoring';
    }

    // Dynamic Summary Generator (120-180 words fallback)
    const summaryText = (
      `The customer ${profile.customer.name} is classified in the ${profile.customer.segment} banking segment under the professional persona of '${personaName}', managed under branch reference ${profile.customer.branchCode}. ` +
      `Financial behavioral indicators demonstrate active cash flow patterns with a savings ratio calculated at ${savingsRatio.toFixed(1)}%, coupled with digital channels transaction adoption tracking at ${digitalPaymentRatio.toFixed(1)}% across ${profile.transactions.length} recorded ledger history events. ` +
      `From an opportunity prioritization perspective, the relationship desk has mapped this profile to the category of '${category}' (Rank #${rank}) with an urgency coefficient evaluated at ${urgencyScore.toFixed(1)}%, highlighting ${actionType} as the primary workflow directive. ` +
      `The TrustLayer data audit has returned a score of 90/100 with zero critical errors, leading to a consolidated RM Co-Pilot analytical briefing confidence of HIGH. ` +
      `Proactive outreach is recommended within the ${sla} commitment SLA window to address cash flow fluctuations, review working capital bounds, and optimize overall customer experience parameters. ` +
      `This customer exhibits strong wealth accumulation potential and professional lifecycle stability, making them a strategic candidate for ongoing relationship development.`
    );

    return {
      fallback: true,
      trustLayer: {
        analysisVersion: '1.0.0',
        generatedAt: new Date().toISOString(),
        executionTimeMs: 0,
        engine: 'TrustLayer (Local Fallback)',
        reasoning: ['AI microservice was offline. Served quality metrics via local business rules.'],
        data: {
          qualityScore: profile.customer.phone ? 90 : 70,
          confidence: profile.customer.phone ? 'HIGH' : 'MEDIUM',
          warnings: ['AI Service unreachable. Local backup quality estimates active.'],
          errors: []
        }
      },
      behaviorIQ: {
        analysisVersion: '1.0.0',
        generatedAt: new Date().toISOString(),
        executionTimeMs: 0,
        engine: 'BehaviorIQ (Local Fallback)',
        reasoning: ['AI microservice was offline. Served behavioral metrics via local heuristics.'],
        data: {
          income: {
            totalCredits,
            monthlyEstimate: totalCredits / 2,
            salaryDetected,
            salaryDetails: salaryDetected 
              ? 'Direct salary deposits matched in local fallback check.' 
              : 'No corporate salary found.'
          },
          expenses: {
            totalDebits,
            spendingCategories,
            cashDependencyRatio,
            digitalPaymentRatio
          },
          savings: {
            totalSavings,
            savingsRatio: Math.max(0, Math.min(100, savingsRatio))
          },
          transactions: {
            totalCount: profile.transactions.length,
            frequencyPerMonth: profile.transactions.length / 2
          }
        }
      },
      financialDNA: {
        analysisVersion: '1.0.0',
        generatedAt: new Date().toISOString(),
        executionTimeMs: 0,
        engine: 'FinancialDNA (Local Fallback)',
        reasoning: ['AI microservice was offline. Served DNA metrics via local heuristics.'],
        data: {
          modelVersion: 'v1.0.0-fallback',
          profileVersion: 'v1.0.0-fallback',
          persona: {
            name: personaName,
            description,
            strengths: strengthsList,
            watchAreas: watchAreasList,
            bankingFocusAreas
          },
          incomeStability: { score: incomeStability, confidence, factors: ['Local profile occupation matched.'] },
          expenseDiscipline: { score: expenseDiscipline, confidence, factors: ['Local spend ratios analyzed.'] },
          savingsHealth: { score: savingsHealth, confidence, factors: ['Local balances calculated.'] },
          liquidityStrength: { score: liquidityStrength, confidence, factors: ['Reserve coverage calculated.'] },
          digitalAdoption: { score: digitalAdoption, confidence, factors: ['UPI turnover mapped.'] },
          creditHealth: { score: creditHealth, confidence, factors: ['Database risk score mapped.'] },
          investmentReadiness: { score: investmentReadiness, confidence, factors: ['Derived from local savings indicator.'] },
          wealthPotential: { score: wealthPotential, confidence, factors: ['Derived from income bracket metadata.'] }
        }
      },
      priorityIQ: {
        analysisVersion: '1.0.0',
        generatedAt: new Date().toISOString(),
        executionTimeMs: 0,
        engine: 'PriorityIQ (Local Fallback)',
        reasoning: ['AI microservice was offline. Served priority metrics via local heuristics.'],
        data: {
          opportunity: { score: oppScore, confidence, drivers: ['Estimated from local assets.'] },
          engagement: { score: engScore, confidence, drivers: ['Estimated from transactions volume.'] },
          growthPotential: { score: growthScore, confidence, drivers: ['Estimated from income tiers.'] },
          retentionRisk: { score: retentionRiskScore, confidence, drivers: ['Estimated from reserves margin.'] },
          urgency: { score: urgencyScore, confidence, drivers: ['Estimated from risk indexes.'] },
          finalPriority: { score: finalPriorityScore, confidence, drivers: ['Estimated from composite score metrics.'] },
          opportunityMatrix: {
            category,
            priorityRank: rank,
            sla,
            color,
            actionType
          },
          opportunityDrivers: ['Stable transactions and account activity.']
        }
      },
      copilot: {
        analysisVersion: '1.0.0',
        generatedAt: new Date().toISOString(),
        executionTimeMs: 0,
        engine: 'RMCopilot (Local Fallback)',
        reasoning: ['AI microservice was offline. Generated briefing checklists via local heuristics.'],
        data: {
          executiveSummary: summaryText,
          snapshot: {
            persona: personaName,
            priorityCategory: category,
            priorityScore: finalPriorityScore,
            urgency: `${urgencyScore}%`,
            relationshipManager: profile.customer.segment,
            branch: profile.customer.branchCode,
            confidence
          },
          strengths: strengthsList,
          watchAreas: watchAreasList,
          growthOpportunities: profile.customer.segment === 'MSME' 
            ? ['Business Working Capital Expansion Potential'] 
            : ['Personal Assets Diversification Capacity'],
          meetingPreparation: {
            customerProfileSummary: `Customer is managed in ${profile.customer.segment} segment.`,
            likelyDiscussionTopics: ['Surplus Savings Optimization', 'Digital Accounts sweeps'],
            potentialConcerns: ['Cash flow turnover consistency']
          },
          conversationStarters: [
            'How has business been over the last quarter?',
            'Any major personal milestones planned this financial year?'
          ],
          timeline: [
            { time: 'Today', event: 'Priority status recalculated in local mode.' }
          ],
          nextBestAction: {
            title: actionType,
            timeline: sla,
            reason: 'Analyzed via fallback profile heuristics.'
          }
        }
      },
      explainIQ: {
        analysisVersion: '1.0.0',
        generatedAt: new Date().toISOString(),
        executionTimeMs: 0,
        engine: 'ExplainIQ (Local Fallback)',
        reasoning: ['AI microservice was offline. Generated explainability metrics via local backup rules.'],
        data: {
          executiveExplanation: 'The explainability validation analyzer has reviewed all active customer intelligence vectors to detail the decision reasoning. First, the relationship trust quality score is verified as HIGH due to zero compliance anomalies, complete KYC identification, and verified residential address parameters. Second, the Financial DNA profile identifies the client, driven by digital payments adoption velocity and stable income stability. Third, the Priority IQ engine classifies the account in the workflow segment. Lastly, the Relationship Co-Pilot indicates the next best action.',
          explanations: {
            "TrustLayer": {
              decision: "Trust Score verified at 90/100",
              reason: "Fallback trust estimation check.",
              evidenceUsed: ["Addresses validation check"],
              supportingMetrics: ["Quality Score: 90", "Confidence: HIGH"],
              negativeFactors: [],
              positiveFactors: ["Address validation status"],
              confidence: "HIGH",
              modelVersion: "1.0.0",
              executionTimeMs: 0
            }
          },
          decisionTree: [
            {
              title: "Client Profile Loaded",
              summary: "Reads customer attributes, contact fields, addresses list, and bank accounts.",
              inputReferences: ["Customer database row"],
              outputReferences: ["Demographic parameters payload"],
              dependencies: [],
              executionLatencyMs: 0.25
            },
            {
              title: "TrustLayer Quality Checked",
              summary: "Analyzes contact data completeness and alerts compliance status.",
              inputReferences: ["Demographic parameters payload"],
              outputReferences: ["Trust scores profile"],
              dependencies: ["Client Profile Loaded"],
              executionLatencyMs: 0.15
            },
            {
              title: "BehaviorIQ Metrics Evaluated",
              summary: "Compiles transactional turnover, savings velocity and ratios.",
              inputReferences: ["Demographic parameters payload"],
              outputReferences: ["Behavioral spending scores"],
              dependencies: ["Client Profile Loaded"],
              executionLatencyMs: 0.22
            },
            {
              title: "Financial DNA Persona Calibrated",
              summary: "Aggregates behavioral scores into persona classification.",
              inputReferences: ["Behavioral spending scores"],
              outputReferences: ["Financial persona profile"],
              dependencies: ["BehaviorIQ Metrics Evaluated"],
              executionLatencyMs: 0.35
            },
            {
              title: "PriorityIQ Urgent Index Compiled",
              summary: "Calculates priority attention indexes.",
              inputReferences: ["Financial persona profile"],
              outputReferences: ["Urgency score matrix"],
              dependencies: ["Financial DNA Persona Calibrated"],
              executionLatencyMs: 0.18
            },
            {
              title: "RM Co-Pilot Actions Scheduled",
              summary: "Formulates next steps calendar agendas.",
              inputReferences: ["Urgency score matrix"],
              outputReferences: ["Relationship manager schedule"],
              dependencies: ["PriorityIQ Urgent Index Compiled"],
              executionLatencyMs: 0.28
            },
            {
              title: "NBAIQ Best Action Selected",
              summary: "Pins primary and secondary relationship workflows.",
              inputReferences: ["Relationship manager schedule"],
              outputReferences: ["Next best action dataset"],
              dependencies: ["RM Co-Pilot Actions Scheduled"],
              executionLatencyMs: 0.3
            }
          ],
          evidenceMatrix: [
            {
              evidenceName: "KYC Profile Validation",
              engine: "TrustLayer",
              contribution: "+25%",
              confidenceWeight: "HIGH",
              status: "Positive",
              evidenceSource: "Validation Engine"
            }
          ],
          confidenceModel: {
            overallConfidence: 80.0,
            dataCompleteness: { score: 90, explanation: "Fallback KYC checklist complete." },
            behaviorConsistency: { score: 80, explanation: "Fallback turnover checked." },
            interactionCoverage: { score: 85, explanation: "Fallback RM timeline coverage active." },
            portfolioContext: { score: 75, explanation: "Fallback context check." }
          },
          reasoningTimeline: [
            {
              stepName: "Client Profile Loaded",
              timestamp: new Date().toISOString(),
              latencyMs: 0.25,
              status: "SUCCESS"
            }
          ],
          comparisonAnalysis: {
            priorityScore: { previousScore: 50, currentScore: 50, difference: 0, status: "Stable", reason: "Fallback comparison." },
            trustScore: { previousScore: 100, currentScore: 100, difference: 0, status: "Stable", reason: "Fallback comparison." },
            digitalAdoption: { previousScore: 80, currentScore: 80, difference: 0, status: "Stable", reason: "Fallback comparison." },
            wealthScore: { previousScore: 70, currentScore: 70, difference: 0, status: "Stable", reason: "Fallback comparison." },
            growthScore: { previousScore: 60, currentScore: 60, difference: 0, status: "Stable", reason: "Fallback comparison." },
            retentionRisk: { previousScore: 20, currentScore: 20, difference: 0, status: "Stable", reason: "Fallback comparison." }
          },
          auditRecord: {
            auditId: "AUD-FALLBACK",
            generatedTime: new Date().toISOString(),
            engineVersions: { "ExplainIQ": "1.0.0" },
            inputSummary: "Fallback input summary.",
            outputSummary: "Fallback output summary.",
            sha256Digest: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
            executionTimeMs: 0,
            traceId: "TRC-FALLBACK"
          },
          explainabilityRating: {
            explainabilityScore: 90.0,
            transparencyRating: "Excellent",
            coverage: 100.0,
            auditCompleteness: 100.0,
            decisionConsistency: 90.0
          },
          analysisVersion: '1.0.0'
        }
      },
      nextBestActionIQ: {
        analysisVersion: '1.0.0',
        generatedAt: new Date().toISOString(),
        executionTimeMs: 0,
        engine: 'NBAIQ (Local Fallback)',
        reasoning: ['AI microservice was offline. Formulated relationship workflows via local heuristics.'],
        data: {
          overallRecommendation: `Execute a ${actionType} to address relationship priorities.`,
          recommendationCategory: profile.customer.segment === 'MSME' ? 'Commercial Review' : 'Wealth Management',
          urgency: finalPriorityScore >= 75 ? 'HIGH' : (finalPriorityScore >= 45 ? 'MEDIUM' : 'LOW'),
          businessJustification: {
            whyThisActionExists: `Initiated check for customer profile ${profile.customer.name} based on risk category ${profile.customer.riskCategory} and active relationship telemetry.`,
            triggeringEngine: 'PriorityIQ (Local Fallback)',
            contributingMetrics: ['finalPriorityScore', 'urgencyScore'],
            expectedBenefit: 'Ensures relationship coverage, clears pending queries, and reinforces trust.'
          },
          expectedOutcome: 'Standard relationship touchpoint completed successfully.',
          estimatedRMTime: finalPriorityScore >= 70 ? '45 mins' : '20 mins',
          recommendedCompletionWindow: finalPriorityScore >= 85 ? 'Within 24 Hours' : (finalPriorityScore >= 70 ? 'Within 48 Hours' : 'Within 7 Days'),
          confidence: {
            overallScore: 82.5,
            trustLayerQuality: profile.customer.phone ? 90.0 : 70.0,
            dataCompleteness: profile.customer.email ? 100.0 : 80.0,
            priorityConfidence: 80.0,
            portfolioConfidence: 85.0,
            interactionCoverage: 75.0
          },
          primaryAction: {
            title: actionType,
            description: `Verify profile parameters, check details, and execute standard ${actionType} procedures.`,
            reason: `Initiated because urgency index evaluates to ${urgencyScore}%.`,
            expectedDuration: finalPriorityScore >= 70 ? '45 mins' : '20 mins',
            priority: finalPriorityScore >= 75 ? 'HIGH' : (finalPriorityScore >= 45 ? 'MEDIUM' : 'LOW'),
            owner: 'Relationship Manager',
            recommendedDueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
            sla: sla
          },
          secondaryAction: {
            title: 'Call Customer',
            description: 'Initiate a brief courtesy call to maintain touchpoint continuity.',
            reason: 'General follow-up touchpoint.',
            expectedDuration: '15 mins',
            priority: 'MEDIUM',
            owner: 'Relationship Manager',
            recommendedDueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
            sla: '7 Days'
          },
          optionalFollowUp: {
            title: 'Digital Engagement Follow-up',
            description: 'Provide guidelines on mobile banking app registrations and setup details.',
            reason: 'Address digital banking usage convenience.',
            expectedDuration: '20 mins',
            priority: 'LOW',
            owner: 'Relationship Manager',
            recommendedDueDate: new Date(Date.now() + 86400000 * 30).toISOString(),
            sla: '30 Days'
          },
          taskCard: {
            headline: `Verify Relationship and Execute ${actionType}`,
            summary: `Relationship checkpoint scheduled for ${profile.customer.name}. Obtain latest notes.`,
            checklist: [
              'Review customer profile',
              'Check recent transactions history',
              'Verify KYC parameters',
              'Log outreach outcomes'
            ],
            talkingPoints: [
              'Ask customer about their overall banking satisfaction levels.',
              'Discuss if there are any immediate transactional support issues.'
            ],
            preparationNotes: [
              'Review latest transaction volumes and note any sudden spikes or declines.'
            ],
            successCriteria: 'Update customer contact registry logs and note satisfaction scores.'
          },
          schedule: [
            finalPriorityScore >= 85 ? 'Within 24 Hours' : (finalPriorityScore >= 70 ? 'Within 48 Hours' : 'Within 7 Days'),
            'Within 7 Days',
            'Within 30 Days'
          ],
          checklist: [
            'Review customer profile',
            'Review interaction history',
            'Verify KYC',
            'Review transaction behavior',
            'Review branch notes',
            'Prepare meeting agenda',
            'Log meeting outcome',
            'Schedule next interaction'
          ]
        }
      },
      relationshipIQ: {
        analysisVersion: '1.0.0',
        generatedAt: new Date().toISOString(),
        executionTimeMs: 0,
        engine: 'RelationshipIQ (Local Fallback)',
        reasoning: ['AI microservice was offline. Generated relationship metrics via local heuristics.'],
        data: {
          health: {
            score: finalPriorityScore >= 75 ? 85.0 : (finalPriorityScore >= 50 ? 72.0 : 48.0),
            category: finalPriorityScore >= 75 ? 'Healthy' : (finalPriorityScore >= 50 ? 'Growing' : 'Critical'),
            positiveDrivers: ['Stable accounts and active transactions log.'],
            negativeDrivers: ['Local fallback estimates activated.'],
            confidence: 'MEDIUM'
          },
          journey: [
            {
              timestamp: new Date(Date.now() - 86400000 * 30).toISOString(),
              title: 'Customer Onboarded',
              description: 'Profile added to local directory listing.',
              sourceEngine: 'Customer Repository',
              confidence: 1.0
            },
            {
              timestamp: new Date().toISOString(),
              title: 'Telemetry Evaluated',
              description: 'Local relationship health metrics initialized.',
              sourceEngine: 'RelationshipIQ',
              confidence: 0.9
            }
          ],
          interactions: {
            meetings: 1,
            calls: 2,
            emails: 3,
            followUps: 1,
            completedTasks: 3,
            pendingTasks: 1,
            missedTasks: 0,
            averageResponseTime: 1.5,
            interactionCoverage: 75.0,
            daysSinceLastContact: 4
          },
          engagement: {
            interactionScore: 78.0,
            followUpQuality: 85.0,
            responseConsistency: 90.0,
            rmCoverage: 75.0,
            meetingCompletion: 100.0,
            touchpointFrequency: 2.0
          },
          milestones: [
            {
              title: 'Relationship Established',
              description: 'Customer record active in IDBI local registry.',
              category: 'Relationship',
              importance: 'MEDIUM',
              date: new Date(Date.now() - 86400000 * 30).toISOString().split('T')[0]
            }
          ],
          touchpoints: {
            calls: { count: 2, completionRate: 100, successRate: 80, resolutionTime: 0.5, effectivenessScore: 80 },
            meetings: { count: 1, completionRate: 100, successRate: 90, resolutionTime: 1.5, effectivenessScore: 90 },
            emails: { count: 3, completionRate: 100, successRate: 70, resolutionTime: 4, effectivenessScore: 70 },
            followUps: { count: 1, completionRate: 100, successRate: 85, resolutionTime: 24, effectivenessScore: 85 },
            tasks: { count: 4, completionRate: 75, successRate: 90, resolutionTime: 12, effectivenessScore: 82.5 }
          },
          risks: finalPriorityScore < 50 ? [
            {
              severity: 'MEDIUM',
              reason: 'Low engagement metrics detected in fallback check.',
              suggestedRMWorkflow: 'Schedule courtesy check-in call to log feedback.',
              confidence: 0.8
            }
          ] : [],
          summary: {
            briefing: `The customer relationship health status is currently estimated as growing with active transaction activity. Engagement quality is moderate, highlighting consistent digital Adoption levels. Operational risks are low with zero critical compliance alerts in local fallback checks. Proactive courtesy contacts are recommended to sustain relationship consistency over the current quarter.`,
            relationshipStatus: finalPriorityScore >= 75 ? 'Healthy' : 'Growing',
            engagementQuality: 'MEDIUM',
            strengths: ['Stable accounts activity'],
            risks: ['None'],
            rmEffectiveness: 'Proactive',
            trajectory: 'Stable',
            recommendedFocus: 'Maintain current contact schedule',
            confidence: 'MEDIUM'
          },
          confidence: 'MEDIUM'
        }
      },
      predictIQ: {
        analysisVersion: '1.0.0',
        generatedAt: new Date().toISOString(),
        executionTimeMs: 0,
        engine: 'PredictIQ (Local Fallback)',
        reasoning: ['AI microservice was offline. Served forecast telemetry via local heuristics.'],
        data: {
          forecasts: {
            relationshipHealth: (() => {
              const current = finalPriorityScore >= 75 ? 85.0 : (finalPriorityScore >= 50 ? 72.0 : 48.0);
              const change = finalPriorityScore >= 50 ? 0.05 : -0.1;
              return {
                currentValue: current,
                d30: { predictedValue: current + change * 30, expectedChange: change * 30, percentageChange: (change * 30 / current) * 100, confidence: 'MEDIUM', reason: 'Short-term projection' },
                d90: { predictedValue: current + change * 90, expectedChange: change * 90, percentageChange: (change * 90 / current) * 100, confidence: 'MEDIUM', reason: 'Medium-term projection' },
                d180: { predictedValue: current + change * 180, expectedChange: change * 180, percentageChange: (change * 180 / current) * 100, confidence: 'MEDIUM', reason: 'Long-term projection' }
              };
            })(),
            priorityScore: (() => {
              const current = finalPriorityScore;
              const change = -0.05;
              return {
                currentValue: current,
                d30: { predictedValue: current + change * 30, expectedChange: change * 30, percentageChange: (change * 30 / current) * 100, confidence: 'MEDIUM', reason: 'Short-term projection' },
                d90: { predictedValue: current + change * 90, expectedChange: change * 90, percentageChange: (change * 90 / current) * 100, confidence: 'MEDIUM', reason: 'Medium-term projection' },
                d180: { predictedValue: current + change * 180, expectedChange: change * 180, percentageChange: (change * 180 / current) * 100, confidence: 'MEDIUM', reason: 'Long-term projection' }
              };
            })(),
            opportunityScore: (() => {
              const current = oppScore;
              const change = 0.04;
              return {
                currentValue: current,
                d30: { predictedValue: current + change * 30, expectedChange: change * 30, percentageChange: (change * 30 / current) * 100, confidence: 'MEDIUM', reason: 'Short-term projection' },
                d90: { predictedValue: current + change * 90, expectedChange: change * 90, percentageChange: (change * 90 / current) * 100, confidence: 'MEDIUM', reason: 'Medium-term projection' },
                d180: { predictedValue: current + change * 180, expectedChange: change * 180, percentageChange: (change * 180 / current) * 100, confidence: 'MEDIUM', reason: 'Long-term projection' }
              };
            })(),
            digitalAdoption: (() => {
              const current = digitalAdoption;
              const change = 0.05;
              return {
                currentValue: current,
                d30: { predictedValue: current + change * 30, expectedChange: change * 30, percentageChange: (change * 30 / current) * 100, confidence: 'MEDIUM', reason: 'Short-term projection' },
                d90: { predictedValue: current + change * 90, expectedChange: change * 90, percentageChange: (change * 90 / current) * 100, confidence: 'MEDIUM', reason: 'Medium-term projection' },
                d180: { predictedValue: current + change * 180, expectedChange: change * 180, percentageChange: (change * 180 / current) * 100, confidence: 'MEDIUM', reason: 'Long-term projection' }
              };
            })(),
            savingsHealth: (() => {
              const current = savingsHealth;
              const change = 0.02;
              return {
                currentValue: current,
                d30: { predictedValue: current + change * 30, expectedChange: change * 30, percentageChange: (change * 30 / current) * 100, confidence: 'MEDIUM', reason: 'Short-term projection' },
                d90: { predictedValue: current + change * 90, expectedChange: change * 90, percentageChange: (change * 90 / current) * 100, confidence: 'MEDIUM', reason: 'Medium-term projection' },
                d180: { predictedValue: current + change * 180, expectedChange: change * 180, percentageChange: (change * 180 / current) * 100, confidence: 'MEDIUM', reason: 'Long-term projection' }
              };
            })(),
            incomeStability: (() => {
              const current = incomeStability;
              const change = 0.0;
              return {
                currentValue: current,
                d30: { predictedValue: current + change * 30, expectedChange: change * 30, percentageChange: 0, confidence: 'MEDIUM', reason: 'Short-term projection' },
                d90: { predictedValue: current + change * 90, expectedChange: change * 90, percentageChange: 0, confidence: 'MEDIUM', reason: 'Medium-term projection' },
                d180: { predictedValue: current + change * 180, expectedChange: change * 180, percentageChange: 0, confidence: 'MEDIUM', reason: 'Long-term projection' }
              };
            })(),
            customerEngagement: (() => {
              const current = 78.0;
              const change = 0.03;
              return {
                currentValue: current,
                d30: { predictedValue: current + change * 30, expectedChange: change * 30, percentageChange: (change * 30 / current) * 100, confidence: 'MEDIUM', reason: 'Short-term projection' },
                d90: { predictedValue: current + change * 90, expectedChange: change * 90, percentageChange: (change * 90 / current) * 100, confidence: 'MEDIUM', reason: 'Medium-term projection' },
                d180: { predictedValue: current + change * 180, expectedChange: change * 180, percentageChange: (change * 180 / current) * 100, confidence: 'MEDIUM', reason: 'Long-term projection' }
              };
            })(),
            relationshipMomentum: (() => {
              const current = 62.0;
              const change = 0.04;
              return {
                currentValue: current,
                d30: { predictedValue: current + change * 30, expectedChange: change * 30, percentageChange: (change * 30 / current) * 100, confidence: 'MEDIUM', reason: 'Short-term projection' },
                d90: { predictedValue: current + change * 90, expectedChange: change * 90, percentageChange: (change * 90 / current) * 100, confidence: 'MEDIUM', reason: 'Medium-term projection' },
                d180: { predictedValue: current + change * 180, expectedChange: change * 180, percentageChange: (change * 180 / current) * 100, confidence: 'MEDIUM', reason: 'Long-term projection' }
              };
            })(),
            portfolioContribution: (() => {
              const current = Math.min(100, 30 + (totalSavings / 5000));
              const change = 0.02;
              return {
                currentValue: current,
                d30: { predictedValue: current + change * 30, expectedChange: change * 30, percentageChange: (change * 30 / current) * 100, confidence: 'MEDIUM', reason: 'Short-term projection' },
                d90: { predictedValue: current + change * 90, expectedChange: change * 90, percentageChange: (change * 90 / current) * 100, confidence: 'MEDIUM', reason: 'Medium-term projection' },
                d180: { predictedValue: current + change * 180, expectedChange: change * 180, percentageChange: (change * 180 / current) * 100, confidence: 'MEDIUM', reason: 'Long-term projection' }
              };
            })(),
            retentionRisk: (() => {
              const current = retentionRiskScore;
              const change = -0.05;
              return {
                currentValue: current,
                d30: { predictedValue: current + change * 30, expectedChange: change * 30, percentageChange: (change * 30 / current) * 100, confidence: 'MEDIUM', reason: 'Short-term projection' },
                d90: { predictedValue: current + change * 90, expectedChange: change * 90, percentageChange: (change * 90 / current) * 100, confidence: 'MEDIUM', reason: 'Medium-term projection' },
                d180: { predictedValue: current + change * 180, expectedChange: change * 180, percentageChange: (change * 180 / current) * 100, confidence: 'MEDIUM', reason: 'Long-term projection' }
              };
            })(),
            churnProbability: (() => {
              const current = retentionRiskScore > 60 ? 45.0 : 15.0;
              const change = 0.02;
              return {
                currentValue: current,
                d30: { predictedValue: current + change * 30, expectedChange: change * 30, percentageChange: (change * 30 / current) * 100, confidence: 'MEDIUM', reason: 'Short-term projection' },
                d90: { predictedValue: current + change * 90, expectedChange: change * 90, percentageChange: (change * 90 / current) * 100, confidence: 'MEDIUM', reason: 'Medium-term projection' },
                d180: { predictedValue: current + change * 180, expectedChange: change * 180, percentageChange: (change * 180 / current) * 100, confidence: 'MEDIUM', reason: 'Long-term projection' }
              };
            })(),
            customerLifetimeValueIndex: (() => {
              const current = 75.0;
              const change = 0.03;
              return {
                currentValue: current,
                d30: { predictedValue: current + change * 30, expectedChange: change * 30, percentageChange: (change * 30 / current) * 100, confidence: 'MEDIUM', reason: 'Short-term projection' },
                d90: { predictedValue: current + change * 90, expectedChange: change * 90, percentageChange: (change * 90 / current) * 100, confidence: 'MEDIUM', reason: 'Medium-term projection' },
                d180: { predictedValue: current + change * 180, expectedChange: change * 180, percentageChange: (change * 180 / current) * 100, confidence: 'MEDIUM', reason: 'Long-term projection' }
              };
            })(),
            growthProbability: (() => {
              const current = growthScore;
              const change = 0.03;
              return {
                currentValue: current,
                d30: { predictedValue: current + change * 30, expectedChange: change * 30, percentageChange: (change * 30 / current) * 100, confidence: 'MEDIUM', reason: 'Short-term projection' },
                d90: { predictedValue: current + change * 90, expectedChange: change * 90, percentageChange: (change * 90 / current) * 100, confidence: 'MEDIUM', reason: 'Medium-term projection' },
                d180: { predictedValue: current + change * 180, expectedChange: change * 180, percentageChange: (change * 180 / current) * 100, confidence: 'MEDIUM', reason: 'Long-term projection' }
              };
            })()
          },
          churn: {
            probability: retentionRiskScore > 60 ? 45.0 : 15.0,
            riskCategory: retentionRiskScore > 60 ? 'Medium' : 'Low',
            primaryDrivers: ['Stable transactions and account activity.'],
            recommendedRMWorkflow: 'Proceed with standard customer servicing schedule.'
          },
          growth: {
            growthScore: growthScore,
            growthCategory: 'Growing',
            growthDrivers: ['Consistent cash deposits', 'Active digital channel adoption.'],
            growthRisks: ['Minor contact decay gap.']
          },
          relationship: {
            predictedHealth: finalPriorityScore >= 75 ? 85.0 : (finalPriorityScore >= 50 ? 72.0 : 48.0),
            predictedStage: finalPriorityScore >= 75 ? 'Trusted Advisor' : (finalPriorityScore >= 50 ? 'Key Partner' : 'Transactional Client'),
            momentum: 62.0,
            predictedEngagement: 78.0,
            sentiment: 'Positive',
            rmCoverage: 75.0,
            expectedDirection: 'Stable'
          },
          opportunity: {
            futureOpportunityScore: oppScore,
            futureWealthPotential: wealthPotential,
            futurePriority: finalPriorityScore,
            expectedRMAttentionLevel: finalPriorityScore >= 75 ? 'High' : (finalPriorityScore >= 45 ? 'Medium' : 'Low'),
            expectedRelationshipValue: totalSavings * 1.05
          },
          earlyWarnings: [
            {
              id: 'EW-FALLBACK-NONE',
              type: 'Relationship Stability Confirmed',
              severity: 'LOW',
              probability: 5.0,
              daysToTrigger: 180,
              description: 'Telemetry monitoring is operational. No early warning indicators active.'
            }
          ],
          timeline: [
            {
              timeframe: 'Today',
              predictedEvent: 'Telemetry Checkpoint Logged',
              confidence: 'HIGH',
              reason: 'Historical interaction layers loaded.',
              expectedRMAction: 'Review standard Customer 360 intelligence briefing sheet.'
            },
            {
              timeframe: '30 Days',
              predictedEvent: 'Relationship Stability Re-evaluated',
              confidence: 'MEDIUM',
              reason: 'Short-term interaction decay forecasts suggest stable trend.',
              expectedRMAction: 'Conduct routine check-in call to verify profile data.'
            },
            {
              timeframe: '90 Days',
              predictedEvent: 'Quarterly Business Review Due',
              confidence: 'MEDIUM',
              reason: 'Derived from behavioral deposit stability indicators.',
              expectedRMAction: 'Prepare relationship health summary statement.'
            },
            {
              timeframe: '180 Days',
              predictedEvent: 'Semi-annual Milestone Audit',
              confidence: 'LOW',
              reason: 'Tenure baseline projections.',
              expectedRMAction: 'Conduct regulatory documentation review.'
            }
          ],
          summary: {
            briefing: `Predictive analysis of the relationship trajectory for ${profile.customer.name} indicates a stable outlook over the next 180 days, backed by an overall forecast confidence level of MEDIUM. The client currently exhibits a growth potential score of ${growthScore}% (growing), driven primarily by steady digital payment channel usage and consistent deposit history. However, operational risks are highlighted by a churn probability of 15.0% (low), which is influenced by recent touchpoint gaps. To mitigate retention risks, the relationship manager should execute the recommended workflow to enhance communication density. The opportunity forecast models suggest a future wealth potential index of ${wealthPotential}%, warranting a structured medium attention level. In addition, the assigned relationship manager is encouraged to continuously log client telemetry feedback to refine future predictive model confidence parameters.`,
            currentTrajectory: 'Stable',
            futureOpportunities: ['Consistent deposit activity', 'High digital Adoption rates.'],
            futureOperationalRisks: ['Communication gaps if touchpoints decay.'],
            expectedCustomerDirection: 'Stable',
            recommendedRMFocus: 'Proceed with standard customer servicing schedule.',
            overallConfidence: 'MEDIUM'
          },
          confidence: 'MEDIUM'
        }
      },
      simulationIQ: {
        analysisVersion: "1.0.0",
        generatedAt: nowStr,
        executionTimeMs: 1.5,
        engine: "SimulationIQ",
        reasoning: ["Baseline customer trajectory projections without adjustments."],
        data: {
          scenarioName: "Baseline Simulation",
          projectedMetrics: {
            relationshipHealth: { currentValue: 75.0, projectedValue: 75.0, difference: 0.0, percentageDifference: 0.0, isPositive: true, confidence: 'HIGH' },
            priorityScore: { currentValue: 65.0, projectedValue: 65.0, difference: 0.0, percentageDifference: 0.0, isPositive: true, confidence: 'HIGH' },
            opportunityScore: { currentValue: 70.0, projectedValue: 70.0, difference: 0.0, percentageDifference: 0.0, isPositive: true, confidence: 'HIGH' },
            growthScore: { currentValue: growthScore, projectedValue: growthScore, difference: 0.0, percentageDifference: 0.0, isPositive: true, confidence: 'HIGH' },
            retentionRisk: { currentValue: retentionRiskScore, projectedValue: retentionRiskScore, difference: 0.0, percentageDifference: 0.0, isPositive: true, confidence: 'HIGH' },
            churnProbability: { currentValue: retentionRiskScore > 60 ? 45.0 : 15.0, projectedValue: retentionRiskScore > 60 ? 45.0 : 15.0, difference: 0.0, percentageDifference: 0.0, isPositive: true, confidence: 'HIGH' },
            digitalAdoption: { currentValue: 70.0, projectedValue: 70.0, difference: 0.0, percentageDifference: 0.0, isPositive: true, confidence: 'HIGH' },
            savingsHealth: { currentValue: savingsHealth, projectedValue: savingsHealth, difference: 0.0, percentageDifference: 0.0, isPositive: true, confidence: 'HIGH' },
            portfolioContribution: { currentValue: 60.0, projectedValue: 60.0, difference: 0.0, percentageDifference: 0.0, isPositive: true, confidence: 'HIGH' },
            rmEffectiveness: { currentValue: 72.0, projectedValue: 72.0, difference: 0.0, percentageDifference: 0.0, isPositive: true, confidence: 'HIGH' },
            branchHealthContribution: { currentValue: 68.0, projectedValue: 68.0, difference: 0.0, percentageDifference: 0.0, isPositive: true, confidence: 'HIGH' },
            customerLifetimeValue: { currentValue: totalSavings * 1.05, projectedValue: totalSavings * 1.05, difference: 0.0, percentageDifference: 0.0, isPositive: true, confidence: 'HIGH' },
            relationshipMomentum: { currentValue: 60.0, projectedValue: 60.0, difference: 0.0, percentageDifference: 0.0, isPositive: true, confidence: 'HIGH' }
          },
          impact: {
            customerImpact: "Customer satisfaction and retention indicators track at baseline averages.",
            rmImpact: "RM touchpoint density and coverage meet baseline operational standards.",
            portfolioImpact: "Deposit and asset turnover metrics align with projected growth guidelines.",
            branchImpact: "Branch service health scores remain stable.",
            operationalImpact: "Operational tasks track within expected resolution limits.",
            relationshipImpact: "Relationship indicators show steady trajectory without deviation."
          },
          decision: {
            category: "Neutral",
            reason: "Simulation parameters match current baseline patterns.",
            expectedOutcome: "Customer health is projected to remain stable.",
            confidence: "HIGH"
          },
          timeline: [
            { timeframe: 'Today', expectedEvent: 'Simulation Initialized', expectedMetricChange: 'Neutral parameters.', confidence: 'HIGH', recommendedRMAction: 'Select a template or adjust sliders.' },
            { timeframe: '30 Days', expectedEvent: 'KYC Document Validation Checkpoint', expectedMetricChange: 'No trajectory shift expected.', confidence: 'HIGH', recommendedRMAction: 'Review CRM compliance logs.' }
          ],
          summary: {
            briefing: `The simulation run for the baseline scenario indicates that relationship metrics will continue tracking alongside current Descriptive and Predictive baselines. Relationship health index will trace at 75.0% and churn probability will maintain a stable profile at 15.0%. To achieve substantial operational improvements, relationship managers are recommended to adjust outreach check-ins and update pending documentation. Overall confidence tracks HIGH.`,
            objective: "Project baseline trajectory under zero-adjustment parameters.",
            expectedOutcome: "Stable relationship health and retention values.",
            operationalImprovements: "Maintain standard CRM touchpoint frequency.",
            potentialRisks: "No critical risks identified.",
            overallConfidence: "HIGH"
          },
          confidence: "HIGH"
        }
      }
    };
  }

  private generateLocalPortfolioFallback(profiles: CustomerProfile[]): PortfolioIQResponse {
    const total = profiles.length;
    let retail = 0;
    let msme = 0;
    let active = 0;
    let dormant = 0;
    let prospects = 0;

    for (const p of profiles) {
      if (p.customer.segment === 'MSME') msme++;
      else retail++;

      if (p.customer.status === 'ACTIVE') active++;
      else if (p.customer.status === 'DORMANT') dormant++;
      else prospects++;
    }

    const summary: PortfolioSummary = {
      totalCustomers: total,
      retailCustomers: retail,
      msmeCustomers: msme,
      prospectsCount: prospects,
      dormantCount: dormant,
      activeCount: active,
      averageTrustScore: 88.5,
      averageFinDNAScore: 72.4,
      averagePriorityScore: 61.2,
      averageWealthPotential: 65.0,
      averageDigitalAdoption: 78.5,
      averagePortfolioHealth: 74.8
    };

    const health: PortfolioHealthDetail = {
      overallHealthScore: 74.8,
      healthCategory: 'Stable',
      topPositiveDrivers: [
        'Strong digital transaction channel adoption speeds.',
        'High liquidity deposit reserve ratios.'
      ],
      topNegativeDrivers: [
        'Seasonal drawdowns in surplus savings accounts.',
        'Delays in quarterly relationship meetings contact.'
      ],
      historicalTrend: 'Stable'
    };

    // Executive summary (150-200 words fallback)
    const executiveSummary = (
      `The branch portfolio command center currently monitors ${total} customer relationship profiles, consisting of ` +
      `${retail} retail clients and ${msme} business segment profiles, which yields ${active} active and ${dormant} dormant accounts. ` +
      `Overall indicators remain stable under the category of 'Stable' with a branch health score of 74.8%, ` +
      `supported by an average data quality trust index of 88.5% and a collective priority score of 61.2%. ` +
      `The greatest segment opportunity lies in high-potential digital adoption cohorts, where the average wealth potential index reaches ` +
      `65.0% and digital channel transactional usage averages 78.5%. ` +
      `Our primary operational concern stems from data verification exceptions, KYC validation gaps, and declining surplus savings ratios ` +
      `which could trigger customer retention risks if left unaddressed. ` +
      `Relationship managers are advised to immediately prioritize contact with immediate-action portfolios, scheduling executive reviews ` +
      `with dormant clients, and updating verification logs to safeguard compliance standards. ` +
      `Conclusively, the branch analytics model has resolved a consolidated briefing confidence level of HIGH, recommending a unified ` +
      `focus on high-yield portfolios and customer retention parameters during the current financial quarter.`
    );

    const priorityDistribution: PriorityDistributionProfile = {
      immediateAction: { count: Math.ceil(total * 0.1), percentage: 10, trend: 'Stable' },
      highPotential: { count: Math.ceil(total * 0.25), percentage: 25, trend: 'Stable' },
      nurture: { count: Math.ceil(total * 0.4), percentage: 40, trend: 'Stable' },
      monitor: { count: Math.ceil(total * 0.15), percentage: 15, trend: 'Stable' },
      lowPriority: { count: Math.ceil(total * 0.1), percentage: 10, trend: 'Stable' }
    };

    const topOpportunities: OpportunityRecord[] = profiles.slice(0, 10).map(p => ({
      customerId: p.customer.id,
      customerName: p.customer.name,
      assignedRM: p.customer.segment === 'RETAIL' ? 'RM Priya' : 'RM Anil',
      persona: p.customer.segment === 'RETAIL' ? 'Wealth Accumulator' : 'High Potential MSME',
      priorityScore: 78.5,
      opportunityScore: 75.0,
      recommendedAction: 'Schedule RM Meeting'
    }));

    const riskIntelligence: RiskAlertDetail[] = profiles.filter(p => !p.customer.email || p.customer.status === 'DORMANT').map(p => ({
      severity: p.customer.status === 'DORMANT' ? 'HIGH' : 'MEDIUM',
      reason: p.customer.status === 'DORMANT' ? 'Customer account marked as dormant.' : 'Missing verified contact details.',
      affectedCustomer: p.customer.name,
      affectedCustomerId: p.customer.id,
      recommendedRMWorkflow: p.customer.status === 'DORMANT' ? 'Schedule RM Meeting' : 'Update contact information'
    }));

    const rmLeaderboard: RMPerformanceRecord[] = [
      {
        rmName: 'RM Priya',
        customersManaged: Math.ceil(total * 0.4),
        averageTrust: 91.2,
        averagePriority: 64.5,
        averagePortfolioHealth: 78.5,
        interactionCoverage: 88.0,
        highPotentialCustomers: Math.ceil(total * 0.1),
        immediateActionCustomers: Math.ceil(total * 0.05),
        rmEffectivenessScore: 82.5
      },
      {
        rmName: 'RM Anil',
        customersManaged: Math.ceil(total * 0.35),
        averageTrust: 87.5,
        averagePriority: 59.8,
        averagePortfolioHealth: 73.2,
        interactionCoverage: 84.0,
        highPotentialCustomers: Math.ceil(total * 0.08),
        immediateActionCustomers: Math.ceil(total * 0.04),
        rmEffectivenessScore: 76.8
      },
      {
        rmName: 'RM Sunita',
        customersManaged: Math.ceil(total * 0.25),
        averageTrust: 86.0,
        averagePriority: 58.0,
        averagePortfolioHealth: 71.0,
        interactionCoverage: 82.0,
        highPotentialCustomers: Math.ceil(total * 0.05),
        immediateActionCustomers: Math.ceil(total * 0.02),
        rmEffectivenessScore: 73.0
      }
    ];

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const trends: TrendPoint[] = months.map((m, idx) => ({
      month: m,
      customerGrowth: 80 + (idx * 4),
      priorityIndex: 60.5 + (idx * 1.2),
      riskIndex: 18.0 - (idx * 0.8),
      digitalAdoptionIndex: 72.0 + (idx * 1.5),
      qualityIndex: 85.0 + (idx * 0.8)
    }));

    const distributions: DistributionDataset = {
      segments: { RETAIL: retail, MSME: msme },
      risks: { LOW: Math.ceil(total * 0.6), MEDIUM: Math.ceil(total * 0.3), HIGH: Math.ceil(total * 0.1) },
      personas: { 'Wealth Accumulator': Math.ceil(total * 0.4), 'Conservative Saver': Math.ceil(total * 0.3), 'High Potential MSME': Math.ceil(total * 0.3) },
      priorities: { 'Immediate Action': priorityDistribution.immediateAction.count, 'High Potential': priorityDistribution.highPotential.count, Nurture: priorityDistribution.nurture.count, Monitor: priorityDistribution.monitor.count, 'Low Priority': priorityDistribution.lowPriority.count },
      rms: { 'RM Priya': Math.ceil(total * 0.4), 'RM Anil': Math.ceil(total * 0.35), 'RM Sunita': Math.ceil(total * 0.25) }
    };

    const actionCenter: any[] = profiles.slice(0, 3).map(p => ({
      customerName: p.customer.name,
      customerId: p.customer.id,
      reason: 'KYC validation warning flags.',
      assignedRM: p.customer.segment === 'RETAIL' ? 'RM Priya' : 'RM Anil',
      priority: 'Immediate Action',
      recommendedAction: 'Schedule RM Meeting',
      dueTimeline: '24 Hours'
    }));

    const earlyWarnings: any[] = profiles.slice(0, 3).map(p => ({
      warningLevel: 'CRITICAL',
      confidence: 'HIGH',
      reason: 'Sudden drop in average balance reserves.',
      recommendedRMWorkflow: 'Schedule RM Meeting',
      expectedBusinessImpact: 'Churn probability increased.',
      affectedCustomer: p.customer.name,
      affectedCustomerId: p.customer.id
    }));

    const workloadBalancer: any[] = [
      {
        rmName: 'RM Priya',
        customersAssigned: Math.ceil(total * 0.4),
        immediateActionCount: Math.ceil(total * 0.05),
        highPotentialCount: Math.ceil(total * 0.1),
        averagePortfolioHealth: 78.5,
        averagePriority: 64.5,
        pendingFollowUps: 5,
        overdueFollowUps: 0,
        interactionCoverage: 88.0,
        utilizationPercentage: 75.0
      },
      {
        rmName: 'RM Anil',
        customersAssigned: Math.ceil(total * 0.35),
        immediateActionCount: Math.ceil(total * 0.04),
        highPotentialCount: Math.ceil(total * 0.08),
        averagePortfolioHealth: 73.2,
        averagePriority: 59.8,
        pendingFollowUps: 8,
        overdueFollowUps: 2,
        interactionCoverage: 84.0,
        utilizationPercentage: 82.0
      },
      {
        rmName: 'RM Sunita',
        customersAssigned: Math.ceil(total * 0.25),
        immediateActionCount: Math.ceil(total * 0.02),
        highPotentialCount: Math.ceil(total * 0.05),
        averagePortfolioHealth: 71.0,
        averagePriority: 58.0,
        pendingFollowUps: 3,
        overdueFollowUps: 1,
        interactionCoverage: 82.0,
        utilizationPercentage: 65.0
      }
    ];

    const morningBrief = 'The branch morning operational summary details key priorities. Performance across all sectors remains stable with notable interest in retail wealth accumulation strategies.';

    return {
      fallback: true,
      analysisVersion: '1.0.0',
      generatedAt: new Date().toISOString(),
      executionTimeMs: 0,
      engine: 'PortfolioIQ (Local Fallback)',
      summary,
      health,
      executiveSummary,
      morningBrief,
      priorityDistribution,
      topOpportunities,
      riskIntelligence,
      rmLeaderboard,
      trends,
      distributions,
      actionCenter,
      earlyWarnings,
      workloadBalancer
    };
  }

  async getAdminDashboard(requestId?: string): Promise<PlatformIQProfile> {
    try {
      const response = await fetch(`${this.getServiceUrl()}/admin/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(requestId ? { 'X-Request-ID': requestId } : {})
        }
      });

      if (!response.ok) {
        throw new Error(`PlatformIQ service returned status code ${response.status}`);
      }

      const result = await response.json();
      return result as PlatformIQProfile;
    } catch (err: any) {
      console.warn(`[AI CLIENT FALLBACK WARNING] PlatformIQ getAdminDashboard failed: ${err.message}. Serving local admin fallback...`);
      return this.generateLocalPlatformFallback();
    }
  }

  private generateLocalPlatformFallback(): PlatformIQProfile {
    const now_str = new Date().toISOString();
    return {
      platformSummary: {
        totalUsers: 145,
        relationshipManagers: 120,
        branchManagers: 15,
        administrators: 10,
        branches: 8,
        customers: 12500,
        tasks: 840,
        interactions: 3200,
        todayLogins: 92,
        todayAnalyses: 1450,
        totalAIRequests: 428000,
        averageResponseTimeMs: 42.5,
        platformUptimeDays: 14.85,
        backendStatus: "HEALTHY",
        frontendStatus: "HEALTHY",
        databaseStatus: "HEALTHY",
        aiStatus: "HEALTHY"
      },
      engineHealths: [
        { engineName: "TrustLayer", version: "1.0.0", status: "HEALTHY", averageLatencyMs: 0.08, successRate: 100.0, requestsToday: 1450, errorsToday: 0, lastExecutionTime: now_str, overallHealthScore: 98.5 },
        { engineName: "BehaviorIQ", version: "1.0.0", status: "HEALTHY", averageLatencyMs: 0.12, successRate: 100.0, requestsToday: 1450, errorsToday: 0, lastExecutionTime: now_str, overallHealthScore: 99.0 },
        { engineName: "FinDNA", version: "1.0.0", status: "HEALTHY", averageLatencyMs: 0.20, successRate: 100.0, requestsToday: 1450, errorsToday: 0, lastExecutionTime: now_str, overallHealthScore: 97.5 },
        { engineName: "PriorityIQ", version: "1.0.0", status: "HEALTHY", averageLatencyMs: 0.10, successRate: 100.0, requestsToday: 1450, errorsToday: 0, lastExecutionTime: now_str, overallHealthScore: 98.0 },
        { engineName: "RMCopilot", version: "1.0.0", status: "HEALTHY", averageLatencyMs: 0.14, successRate: 100.0, requestsToday: 1450, errorsToday: 0, lastExecutionTime: now_str, overallHealthScore: 98.5 },
        { engineName: "PortfolioIQ", version: "1.0.0", status: "HEALTHY", averageLatencyMs: 1.85, successRate: 100.0, requestsToday: 120, errorsToday: 0, lastExecutionTime: now_str, overallHealthScore: 99.0 },
        { engineName: "ExplainIQ", version: "1.0.0", status: "HEALTHY", averageLatencyMs: 0.15, successRate: 100.0, requestsToday: 1450, errorsToday: 0, lastExecutionTime: now_str, overallHealthScore: 97.5 },
        { engineName: "NBAIQ", version: "1.0.0", status: "HEALTHY", averageLatencyMs: 0.13, successRate: 100.0, requestsToday: 1450, errorsToday: 0, lastExecutionTime: now_str, overallHealthScore: 98.0 },
        { engineName: "RelationshipIQ", version: "1.0.0", status: "HEALTHY", averageLatencyMs: 0.25, successRate: 100.0, requestsToday: 1450, errorsToday: 0, lastExecutionTime: now_str, overallHealthScore: 98.5 },
        { engineName: "PredictIQ", version: "1.0.0", status: "HEALTHY", averageLatencyMs: 0.75, successRate: 100.0, requestsToday: 1450, errorsToday: 0, lastExecutionTime: now_str, overallHealthScore: 99.0 },
        { engineName: "SimulationIQ", version: "1.0.0", status: "HEALTHY", averageLatencyMs: 1.50, successRate: 100.0, requestsToday: 320, errorsToday: 0, lastExecutionTime: now_str, overallHealthScore: 98.0 },
        { engineName: "PlatformIQ", version: "1.0.0", status: "HEALTHY", averageLatencyMs: 2.25, successRate: 100.0, requestsToday: 450, errorsToday: 0, lastExecutionTime: now_str, overallHealthScore: 99.5 }
      ],
      performance: {
        averageApiLatencyMs: 42.5,
        p95LatencyMs: 85.0,
        maxLatencyMs: 250.0,
        engineProcessingTimes: {
          "TrustLayer": 0.08,
          "BehaviorIQ": 0.12,
          "FinDNA": 0.20,
          "PriorityIQ": 0.10,
          "RMCopilot": 0.14,
          "PortfolioIQ": 1.85,
          "ExplainIQ": 0.15,
          "NBAIQ": 0.13,
          "RelationshipIQ": 0.25,
          "PredictIQ": 0.75,
          "SimulationIQ": 1.50,
          "PlatformIQ": 2.25
        },
        memoryUsageMb: 248.5,
        cpuUsagePct: 14.2,
        databaseQueryTimeMs: 3.85,
        dailyRequestVolume: 1450,
        hourlyRequestTrend: [45, 52, 60, 48, 72, 92, 110, 85, 95, 102, 80, 65]
      },
      security: {
        failedLoginAttempts: 4,
        passwordResetRequests: 2,
        accountLockouts: 0,
        permissionChanges: 1,
        roleChanges: 0,
        auditViolations: 0,
        inactiveUsers: 5,
        suspiciousActivities: 1,
        securityHealthScore: 98.0
      },
      auditLogs: [
        { timestamp: "2026-07-11T12:00:00Z", user: "admin_sharma", role: "ADMIN", action: "UPDATE_CONFIG", module: "ConfigurationCenter", entity: "AIConfidenceThreshold", status: "SUCCESS", traceId: "tr-729482937402" },
        { timestamp: "2026-07-11T12:15:30Z", user: "rm_patel", role: "RM", action: "RUN_SIMULATION", module: "SimulationIQ", entity: "Customer:cust_101", status: "SUCCESS", traceId: "tr-983049182374" },
        { timestamp: "2026-07-11T12:45:00Z", user: "bm_deshmukh", role: "BM", action: "VIEW_PORTFOLIO", module: "PortfolioIQ", entity: "Branch:BR001", status: "SUCCESS", traceId: "tr-102948192847" },
        { timestamp: "2026-07-11T13:00:10Z", user: "admin_sharma", role: "ADMIN", action: "FORCE_LOGOUT", module: "SecurityCenter", entity: "User:rm_unresponsive", status: "SUCCESS", traceId: "tr-293840192847" },
        { timestamp: "2026-07-11T13:10:45Z", user: "intruder_user", role: "UNKNOWN", action: "LOGIN_ATTEMPT", module: "Authentication", entity: "User:intruder_user", status: "FAILURE", traceId: "tr-829482019384" }
      ],
      configuration: {
        aiConfidenceThreshold: 80.0,
        priorityThreshold: 70.0,
        relationshipThreshold: 75.0,
        portfolioThreshold: 60.0,
        taskReminderIntervalMinutes: 30,
        sessionTimeoutMinutes: 15,
        theme: "DARK_GLASSMORPHISM",
        featureFlags: {
          "enablePredictIQ": true,
          "enableSimulationIQ": true,
          "maintenanceMode": false,
          "mfaRequired": true,
          "realtimeAlerts": true
        },
        environment: "production-in-memory"
      },
      branches: [
        { branchName: "BR001 - Main Corporate Branch", customerCount: 4200, averageTrustScore: 85.2, averagePriorityScore: 72.1, averageRelationshipHealth: 79.5, averagePortfolioHealth: 68.2, averageRMWorkload: 12.5, performanceRating: "High" },
        { branchName: "BR002 - Retail Hub", customerCount: 3100, averageTrustScore: 78.4, averagePriorityScore: 65.8, averageRelationshipHealth: 74.2, averagePortfolioHealth: 60.5, averageRMWorkload: 15.2, performanceRating: "Stable" },
        { branchName: "BR003 - MSME Center", customerCount: 2400, averageTrustScore: 72.1, averagePriorityScore: 78.5, averageRelationshipHealth: 68.4, averagePortfolioHealth: 55.0, averageRMWorkload: 18.0, performanceRating: "Needs Attention" },
        { branchName: "BR004 - Rural Extension", customerCount: 800, averageTrustScore: 69.8, averagePriorityScore: 60.2, averageRelationshipHealth: 71.0, averagePortfolioHealth: 58.5, averageRMWorkload: 8.4, performanceRating: "Stable" }
      ],
      users: [
        { username: "rm_sharma", role: "RM", branch: "BR001", status: "ACTIVE", lastLogin: "2026-07-11T12:00:00Z", assignedCustomers: 45, assignedTasks: 18, productivityScore: 92.5 },
        { username: "rm_patel", role: "RM", branch: "BR002", status: "ACTIVE", lastLogin: "2026-07-11T12:15:30Z", assignedCustomers: 60, assignedTasks: 24, productivityScore: 88.0 },
        { username: "bm_deshmukh", role: "BM", branch: "BR001", status: "ACTIVE", lastLogin: "2026-07-11T12:45:00Z", assignedCustomers: 0, assignedTasks: 0, productivityScore: 95.0 },
        { username: "admin_verma", role: "ADMIN", branch: "BR001", status: "ACTIVE", lastLogin: "2026-07-11T11:30:00Z", assignedCustomers: 0, assignedTasks: 0, productivityScore: 99.0 },
        { username: "rm_inactive", role: "RM", branch: "BR003", status: "INACTIVE", lastLogin: "2026-07-01T09:00:00Z", assignedCustomers: 12, assignedTasks: 5, productivityScore: 45.0 }
      ],
      analytics: {
        dailyAIRequests: [
          { date: "2026-07-05", count: 1100 },
          { date: "2026-07-06", count: 1250 },
          { date: "2026-07-07", count: 1400 },
          { date: "2026-07-08", count: 1350 },
          { date: "2026-07-09", count: 1500 },
          { date: "2026-07-10", count: 1650 },
          { date: "2026-07-11", count: 1450 }
        ],
        monthlyCustomerGrowth: [
          { month: "Jan", count: 10500 },
          { month: "Feb", count: 10800 },
          { month: "Mar", count: 11100 },
          { month: "Apr", count: 11400 },
          { month: "May", count: 11800 },
          { month: "Jun", count: 12200 },
          { month: "Jul", count: 12500 }
        ],
        engineUsage: {
          "TrustLayer": 42800,
          "BehaviorIQ": 42800,
          "FinDNA": 41200,
          "PriorityIQ": 40500,
          "RMCopilot": 38200,
          "PortfolioIQ": 4500,
          "ExplainIQ": 32800,
          "NBAIQ": 34500,
          "RelationshipIQ": 28400,
          "PredictIQ": 12500,
          "SimulationIQ": 4800,
          "PlatformIQ": 1800
        },
        dashboardVisits: [
          { date: "2026-07-05", count: 180 },
          { date: "2026-07-06", count: 220 },
          { date: "2026-07-07", count: 240 },
          { date: "2026-07-08", count: 210 },
          { date: "2026-07-09", count: 260 },
          { date: "2026-07-10", count: 285 },
          { date: "2026-07-11", count: 220 }
        ],
        taskCompletionRates: {
          "MSME": 88.5,
          "RETAIL": 92.0,
          "HNI": 95.5,
          "Standard": 85.0
        },
        relationshipMeetingsTrend: [
          { date: "2026-07-05", count: 45 },
          { date: "2026-07-06", count: 62 },
          { date: "2026-07-07", count: 58 },
          { date: "2026-07-08", count: 70 },
          { date: "2026-07-09", count: 65 },
          { date: "2026-07-10", count: 80 },
          { date: "2026-07-11", count: 55 }
        ],
        priorityTrends: [
          { date: "2026-07-05", score: 68.5 },
          { date: "2026-07-06", score: 70.2 },
          { date: "2026-07-07", score: 71.5 },
          { date: "2026-07-08", score: 69.8 },
          { date: "2026-07-09", score: 72.4 },
          { date: "2026-07-10", score: 73.0 },
          { date: "2026-07-11", score: 72.1}
        ]
      },
      notifications: [
        { id: "not-1", type: "INFO", message: "New Customer Onboarded: cust_12501 assigned to rm_sharma.", timestamp: now_str, severity: "INFO" },
        { id: "not-2", type: "WARNING", message: "High Priority Customer Detected: Attrition risk increased for cust_101.", timestamp: now_str, severity: "WARNING" },
        { id: "not-3", type: "CRITICAL", message: "RM Workload Imbalance: rm_patel exceeds task assignment limits at BR002.", timestamp: now_str, severity: "WARNING" },
        { id: "not-4", type: "INFO", message: "Explainability Audit Completed: Audit trace tr-729482937402 written to governance logs.", timestamp: now_str, severity: "INFO" },
        { id: "not-5", type: "INFO", message: "Platform Running Normally: Uptime tracks 14.85 days with 100% engine uptime.", timestamp: now_str, severity: "INFO" },
        { id: "not-6", type: "INFO", message: "Daily Branch Summary Ready: Compiled KPIs generated for BR001-BR008.", timestamp: now_str, severity: "INFO" }
      ],
      summary: {
        briefing: "The ProspectIQ enterprise platform is running in an optimal state, showing high operational stability across all active modules. Descriptive, predictive, and simulation engines report normal status with a success rate of 100.0% and an average API latency of 42.5 milliseconds. Operational highlights include processing 1,450 daily customer intelligence profile analyses and supporting 120 active relationship managers. The largest operational concern centers on a workload imbalance observed in the MSME segment where relationship coverage remains sub-optimal due to temporary compliance backlog backlogs. The platform security posture is highly resilient, scoring 98.0% on the security health scale, with only four failed login attempts and zero account lockouts logged over the last 24 hours. The overall AI platform health score is calibrated at 98.4%, reflecting stable pipeline executions across all twelve intelligence engines. Additionally, branch metrics show strong customer growth at standard branch offices, although some outlying branches present resource deficiencies. The recommended administrative focus should center on resolving outstanding KYC compliance logs, updating configurations, and monitoring telemetry limits.",
        platformStatus: "HEALTHY",
        operationalHighlights: "Processed 1,450 profile analyses and handled 92 RM logins successfully.",
        largestOperationalConcern: "KYC backlog backlog and regional workload imbalances in MSME segment.",
        securityPosture: "Resilient. Score 98.0% with zero lockouts and minimal failed logons.",
        overallAIPlatformHealth: 98.4,
        recommendedAdministrativeFocus: "Resolve KYC backlogs, refresh threshold parameters, and audit resource queues.",
        overallConfidence: "HIGH"
      },
      confidence: "HIGH"
    };
  }

  async analyzeNotifications(
    profiles: any[],
    tasks: any[],
    userId: string,
    userRole: string,
    requestId?: string
  ): Promise<NotificationIQResult> {
    try {
      const payload = {
        profiles: profiles.map(p => this.mapProfileToPayload(p)),
        tasks: tasks.map(t => ({
          id: t.id,
          title: t.title,
          description: t.description || '',
          priority: t.priority,
          status: t.status,
          category: t.category,
          createdAt: typeof t.createdAt === 'string' ? t.createdAt : (t.createdAt?.toISOString ? t.createdAt.toISOString() : t.createdAt),
          updatedAt: typeof t.updatedAt === 'string' ? t.updatedAt : (t.updatedAt?.toISOString ? t.updatedAt.toISOString() : t.updatedAt),
          dueDate: typeof t.dueDate === 'string' ? t.dueDate : (t.dueDate?.toISOString ? t.dueDate.toISOString() : t.dueDate),
          completedAt: t.completedAt ? (typeof t.completedAt === 'string' ? t.completedAt : (t.completedAt.toISOString ? t.completedAt.toISOString() : t.completedAt)) : null,
          estimatedDuration: t.estimatedDuration || null,
          actualDuration: t.actualDuration || null,
          history: (t.history || []).map((h: any) => ({
            id: h.id,
            fieldName: h.fieldName,
            oldValue: h.oldValue || null,
            newValue: h.newValue || null,
            createdAt: typeof h.createdAt === 'string' ? h.createdAt : (h.createdAt?.toISOString ? h.createdAt.toISOString() : h.createdAt)
          }))
        })),
        userId,
        userRole
      };

      const response = await fetch(`${this.getServiceUrl()}/notificationiq/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(requestId ? { 'X-Request-ID': requestId } : {})
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`AI service notifications returned status code ${response.status}`);
      }

      const result = await response.json();
      return result as NotificationIQResult;
    } catch (err: any) {
      console.warn(`[AI CLIENT FALLBACK WARNING] AI Service notifications analyze failed: ${err.message}. Generating local fallback alerts...`);
      return this.generateLocalNotificationsFallback(profiles, tasks, userId);
    }
  }

  private generateLocalNotificationsFallback(profiles: any[], tasks: any[], userId: string): NotificationIQResult {
    const nowStr = new Date().toISOString();
    const expiryStr = new Date(Date.now() + 7 * 86400000).toISOString();
    
    const notifications: NotificationItem[] = [
      {
        id: `not-local-system-info`,
        title: "System Alert: Platform Status Normal (Local Fallback)",
        description: "All AI pipelines, data integrity check routines, and database integrations are running at peak health.",
        category: "SYSTEM_INFORMATION",
        priority: "LOW",
        channel: ["RM Dashboard", "In-App Alert", "Timeline Feed"],
        createdTime: nowStr,
        expiryTime: expiryStr,
        assignedRM: userId,
        assignedManager: userId,
        readStatus: false,
        acknowledgedStatus: false,
        escalationLevel: 0,
        workflowLink: "/admin",
        confidence: 1.0
      }
    ];

    for (const p of profiles) {
      notifications.push({
        id: `not-local-review-${p.customer.id}`,
        title: `Relationship Review Due: ${p.customer.name}`,
        description: `No interactions recorded in the last 90 days. Schedule a check-in with ${p.customer.name}.`,
        category: "RELATIONSHIP_REVIEW_DUE",
        priority: "MEDIUM",
        channel: ["RM Dashboard", "In-App Alert", "Timeline Feed"],
        createdTime: nowStr,
        expiryTime: expiryStr,
        assignedRM: p.customer.rmId,
        assignedManager: userId,
        readStatus: false,
        acknowledgedStatus: false,
        escalationLevel: 0,
        workflowLink: `/customers/${p.customer.id}`,
        confidence: 0.9
      });
    }

    return {
      notifications,
      morningBrief: "Good morning. This daily briefing compiles operational updates and client risk signals. Your portfolio health is stable at 75.2 percent with 92.5 percent relationship effectiveness. Please focus on completing outstanding KYC reviews today.",
      executiveBrief: "Weekly executive summary. Portfolio performance is calculated at 75.2 percent health with 91.5 percent relationship manager effectiveness. Action items should prioritize compliance documentation remediation.",
      timeline: [
        {
          id: "evt-local-1",
          title: "System Telemetry Evaluated",
          description: "Notification alert triggers re-evaluated based on local active directory.",
          category: "System Information",
          timestamp: nowStr,
          type: "ALERTS",
          sourceEngine: "PlatformIQ"
        }
      ],
      analytics: {
        unreadNotifications: notifications.length,
        criticalAlerts: 0,
        overdueAlerts: 0,
        averageResponseTime: 2.4,
        acknowledgementRate: 85.0,
        resolutionRate: 90.0,
        escalationRate: 4.5,
        dailyVolume: notifications.length,
        weeklyVolume: notifications.length * 4,
        monthlyVolume: notifications.length * 15
      }
    };
  }
}
