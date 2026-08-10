import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JournalMetricsService {
  constructor(private readonly prisma: PrismaService) {}

  getJournalMetrics(journalId: string) {
    const citations20242025 = 1420;
    const articles20242025 = 168;

    const jif2Year = Number((citations20242025 / articles20242025).toFixed(2)); // 8.45
    const jif5Year = Number((jif2Year * 1.08).toFixed(2)); // 9.13

    return {
      journalId,
      journalTitle: 'PUBLISHORA Journal of Quantum Computing',
      jif2Year,
      jif5Year,
      scimagoJournalRankSjr: 2.18,
      eigenfactorScore: 0.0428,
      snipNormalizedImpact: 2.34,
      totalCitationsCurrentYear: 3890,
      journalQuartile: 'Q1 (Top 5% in Quantum Physics & Computing)',
      calculatedAt: new Date().toISOString(),
    };
  }

  getAltmetricScore(publicationId: string) {
    return {
      publicationId,
      altmetricAttentionScore: 482,
      percentile: 99,
      mentionsBreakdown: {
        newsOutlets: 24,
        twitterX: 312,
        wikipediaPages: 4,
        policyDocuments: 6,
        blogs: 14,
        mendeleyReaders: 840,
      },
      badgeUrl: `https://badges.altmetric.com/?size=100&score=482`,
      fetchedAt: new Date().toISOString(),
    };
  }

  getFwciScore(publicationId: string) {
    const actualCitations = 42;
    const expectedFieldCitations = 22.8;

    const fwci = Number((actualCitations / expectedFieldCitations).toFixed(2)); // 1.84

    return {
      publicationId,
      actualCitations,
      expectedFieldCitations,
      fieldWeightedCitationImpactFwci: fwci,
      impactComparison: '84% above global average for Quantum Computing',
      calculatedAt: new Date().toISOString(),
    };
  }
}
