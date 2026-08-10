export type UserRole = 'SUPER_ADMIN' | 'PRESS_ADMIN' | 'EDITOR_IN_CHIEF' | 'MANAGING_EDITOR' | 'REVIEWER' | 'AUTHOR' | 'INSTITUTION_ADMIN';

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  institution?: string;
  country: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  createdAt: string;
  lastLoginAt: string;
}

export interface AdminJournal {
  id: string;
  title: string;
  issn: string;
  eIssn: string;
  mode: 'PREPARATION_MODE' | 'PUBLISHING_MODE';
  publishingAvailableInRegion: boolean;
  totalSubmissions: number;
  publishedCount: number;
  apcPriceUsd: number;
  editorInChief: string;
}

export interface AdminSubmission {
  id: string;
  title: string;
  journalTitle: string;
  authorName: string;
  submittedAt: string;
  stage: 'SCREENING' | 'PEER_REVIEW' | 'REVISION' | 'COPYEDITING' | 'PROOFING' | 'PUBLISHED' | 'REJECTED';
  plagiarismSimilarityPercent: number;
  aiGeneratedScorePercent: number;
  assignedEditor: string;
}

export interface SystemEngineHealth {
  phaseNumber: number;
  engineName: string;
  status: 'HEALTHY' | 'DEGRADED' | 'MAINTENANCE';
  latencyMs: number;
  lastAudited: string;
}

export interface FinancialMetric {
  totalApcRevenueUsd: number;
  pendingInvoicesCount: number;
  activeWaiversCount: number;
  authorRoyaltyPayoutsUsd: number;
  monthlyGrowthPercent: number;
}
