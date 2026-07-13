export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface FDNAIndicator {
  dimension: string;
  score: number; // 0 to 100
  confidence: ConfidenceLevel;
  description: string;
  evidence: string[];
}

export interface FDNAProfile {
  customerId: string;
  generatedAt: string;
  confidenceScore: number; // 0 to 100
  overallConfidence: ConfidenceLevel;
  indicators: {
    incomeStability: FDNAIndicator;
    expenseDiscipline: FDNAIndicator;
    savingsBehaviour: FDNAIndicator;
    paymentReliability: FDNAIndicator;
    borrowingIntent: FDNAIndicator;
    financialResilience: FDNAIndicator;
    customerEngagement: FDNAIndicator;
    digitalActivity: FDNAIndicator;
  };
}

export interface ExplanationObject {
  evidence: string[];
  positiveIndicators: string[];
  negativeIndicators: string[];
  confidence: ConfidenceLevel;
  recommendedAction: string;
  watchItems: string[];
  alternativeInterpretation?: string;
  humanReviewNotes?: string;
}

export type PriorityTier = 'PRIORITY_ENGAGE' | 'ENGAGE_WITH_CONTEXT' | 'LOWER_PRIORITY' | 'INSUFFICIENT_DATA';

export interface PriorityScore {
  rawScore: number; // 0 to 100
  normalizedScore: number; // 0 to 100
  tier: PriorityTier;
  confidence: ConfidenceLevel;
  updatedAt: string;
}

export interface Prospect {
  id: string;
  name: string;
  rmId: string;
  segment: 'RETAIL' | 'MSME';
  traditionalSummary: {
    averageBalance: number;
    existingLoansCount: number;
    creditBureauScore?: number;
  };
  alternativeSummary: {
    upiOutflowAvg: number;
    gstTurnoverAvg?: number;
    epfoInflowAvg?: number;
    utilityBillConsistency: number; // percentage of on-time payments
  };
  fdnaProfile?: FDNAProfile;
  priorityScore?: PriorityScore;
  readinessIndicator?: string;
  engagementStatus: 'UNCONTACTED' | 'CONTACTED' | 'CONVERTED' | 'DECLINED' | 'FOLLOW_UP_NEEDED';
  overrideLogged?: boolean;
  overrideReason?: string;
}

export interface AuditLogEvent {
  id: string;
  actorId: string;
  actorRole: string;
  action: 'READ_DNA' | 'LOG_OVERRIDE' | 'LOG_OUTCOME' | 'EXPORT_REPORT' | 'LOGIN' | 'LOGOUT';
  targetId: string;
  timestamp: string;
  details: string;
}

// Sprint 2 Auth & Access Types
export type RoleCode = 'RM' | 'BRANCH_MANAGER' | 'REGIONAL_MANAGER' | 'ADMIN';

export interface UserContext {
  id: string;
  username: string;
  name: string;
  roles: RoleCode[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserContext;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    requestId?: string;
    timestamp: string;
  };
}

// Sprint 3 Customer Foundation Types
export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'DORMANT' | 'PROSPECT' | 'BLACKLISTED';

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  occupation: string;
  incomeRange: string;
  riskCategory: string;
  segment: string;
  status: CustomerStatus;
  rmId: string;
  assignedAt: string;
  lastInteractionAt: string | null;
  preferredContact: string | null;
  preferredLanguage: string | null;
  branchCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerAddress {
  id: string;
  customerId: string;
  type: string; // RESIDENTIAL, OFFICE
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankAccount {
  id: string;
  customerId: string;
  accountNumber: string;
  accountType: string; // SAVINGS, CURRENT
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  bankAccountId: string;
  amount: number;
  type: 'DEBIT' | 'CREDIT';
  category: string; // UPI, GST, SALARY, UTILITY, Discretionary, Shopping
  description: string;
  reference: string | null;
  valueDate: string;
  createdAt: string;
}

export interface Interaction {
  id: string;
  customerId: string;
  rmId: string;
  type: string; // CALL, EMAIL, MEETING
  summary: string;
  notes: string | null;
  interactionDate: string;
  createdAt: string;
}

export interface Document {
  id: string;
  customerId: string;
  name: string;
  type: string; // PAN, GSTIN, Bank Statement
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductHolding {
  id: string;
  customerId: string;
  name: string; // Savings Account, FIXED_DEPOSIT, etc.
  status: string; // ACTIVE, CLOSED
  createdAt: string;
  updatedAt: string;
}

export interface CustomerProfile {
  customer: Customer & { rm: { name: string; username: string } };
  addresses: CustomerAddress[];
  accounts: BankAccount[];
  transactions: Transaction[];
  interactions: Interaction[];
  documents: Document[];
  productHoldings: ProductHolding[];
  summary: {
    totalBalance: number;
    totalAccounts: number;
    lastInteraction: Interaction | null;
  };
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PagedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface ImportError {
  row: number;
  column?: string;
  error: string;
}

export interface ImportSummary {
  total: number;
  imported: number;
  skipped: number;
  failed: number;
  errors: ImportError[];
}
