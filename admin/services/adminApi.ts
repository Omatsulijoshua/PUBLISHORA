import { AdminUser, AdminJournal, AdminSubmission, SystemEngineHealth, FinancialMetric } from '../types';

const API_BASE_URL = 'http://localhost:4000/api/v1';

export class AdminApiService {
  static async getSystemHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/system-health/audit`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API Offline, using admin fallback data');
    }
    return {
      totalModulesCount: 45,
      operationalModulesCount: 45,
      healthScorePercent: 100,
      systemStatus: '100% OPERATIONAL',
    };
  }

  static async getUsers(): Promise<AdminUser[]> {
    return [
      {
        id: 'usr-101',
        fullName: 'Prof. Alexandra Vance',
        email: 'a.vance@cambridge.ac.uk',
        role: 'EDITOR_IN_CHIEF',
        institution: 'University of Cambridge',
        country: 'GB',
        status: 'ACTIVE',
        createdAt: '2025-01-15T09:30:00Z',
        lastLoginAt: '2026-08-10T22:15:00Z',
      },
      {
        id: 'usr-102',
        fullName: 'Dr. Marcus Thorne',
        email: 'm.thorne@stanford.edu',
        role: 'SUPER_ADMIN',
        institution: 'Stanford University',
        country: 'US',
        status: 'ACTIVE',
        createdAt: '2024-11-01T14:20:00Z',
        lastLoginAt: '2026-08-11T00:10:00Z',
      },
      {
        id: 'usr-103',
        fullName: 'Dr. Chidi Okafor',
        email: 'c.okafor@unilag.edu.ng',
        role: 'AUTHOR',
        institution: 'University of Lagos',
        country: 'NG',
        status: 'ACTIVE',
        createdAt: '2026-02-10T11:00:00Z',
        lastLoginAt: '2026-08-09T18:45:00Z',
      },
      {
        id: 'usr-104',
        fullName: 'Elena Rostova',
        email: 'e.rostova@ethz.ch',
        role: 'PRESS_ADMIN',
        institution: 'ETH Zürich',
        country: 'CH',
        status: 'ACTIVE',
        createdAt: '2025-06-20T08:15:00Z',
        lastLoginAt: '2026-08-10T19:30:00Z',
      },
    ];
  }

  static async getJournals(): Promise<AdminJournal[]> {
    return [
      {
        id: 'j-101',
        title: 'PUBLISHORA Journal of Quantum Computing & AI',
        issn: '2768-9014',
        eIssn: '2768-9022',
        mode: 'PUBLISHING_MODE',
        publishingAvailableInRegion: true,
        totalSubmissions: 1420,
        publishedCount: 380,
        apcPriceUsd: 1850,
        editorInChief: 'Prof. Alexandra Vance',
      },
      {
        id: 'j-102',
        title: 'Global Journal of Tropical Medicine & Public Health',
        issn: '2819-4021',
        eIssn: '2819-403X',
        mode: 'PREPARATION_MODE',
        publishingAvailableInRegion: false,
        totalSubmissions: 890,
        publishedCount: 0,
        apcPriceUsd: 0,
        editorInChief: 'Dr. Chidi Okafor',
      },
    ];
  }

  static async getSubmissions(): Promise<AdminSubmission[]> {
    return [
      {
        id: 'sub-901',
        title: 'Fault-Tolerant Surface Codes for 2D Transmon Arrays',
        journalTitle: 'PUBLISHORA Journal of Quantum Computing & AI',
        authorName: 'Dr. Lin Wei et al.',
        submittedAt: '2026-08-05T14:30:00Z',
        stage: 'PEER_REVIEW',
        plagiarismSimilarityPercent: 3.2,
        aiGeneratedScorePercent: 4.1,
        assignedEditor: 'Prof. Alexandra Vance',
      },
      {
        id: 'sub-902',
        title: 'Epidemiological Modeling of Sub-Saharan Vector-Borne Pathogens',
        journalTitle: 'Global Journal of Tropical Medicine & Public Health',
        authorName: 'Dr. Chidi Okafor',
        submittedAt: '2026-08-08T09:12:00Z',
        stage: 'SCREENING',
        plagiarismSimilarityPercent: 1.8,
        aiGeneratedScorePercent: 2.0,
        assignedEditor: 'Dr. Marcus Thorne',
      },
    ];
  }

  static async getFinancials(): Promise<FinancialMetric> {
    return {
      totalApcRevenueUsd: 485900,
      pendingInvoicesCount: 14,
      activeWaiversCount: 42,
      authorRoyaltyPayoutsUsd: 68400,
      monthlyGrowthPercent: 18.4,
    };
  }
}
