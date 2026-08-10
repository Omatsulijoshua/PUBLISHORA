import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MetricsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublicationMetrics(publicationId: string) {
    const pub = await this.prisma.publication.findUnique({
      where: { id: publicationId },
    });

    if (!pub) {
      throw new NotFoundException(`Publication ${publicationId} not found`);
    }

    const citationCount = 42;
    const hIndexEstimate = 12;
    const altmetricScore = 87;

    return {
      publicationId,
      title: pub.title,
      citations: {
        totalCitations: citationCount,
        recentCitations30Days: 8,
        hIndexEstimate,
      },
      impactMetrics: {
        estimatedJif: 4.82,
        scimagoSjrProxy: 1.64,
        eigenfactorScore: 0.0125,
      },
      altmetrics: {
        score: altmetricScore,
        newsMentions: 5,
        blogPosts: 3,
        policyDocuments: 2,
        mendeleyReaders: 140,
        twitterMentions: 68,
      },
      readership: {
        totalDownloads: 1420,
        htmlViews: 3890,
        pdfDownloads: 1100,
      },
    };
  }

  async getCitationGraph(publicationId: string) {
    const pub = await this.prisma.publication.findUnique({
      where: { id: publicationId },
    });

    const rootTitle = pub ? pub.title : 'Quantum Computing Foundations';

    return {
      rootId: publicationId,
      nodes: [
        { id: publicationId, label: rootTitle, group: 'target', citations: 42 },
        { id: 'node-1', label: 'Fault-Tolerant Qubit Fabric Protocols (2025)', group: 'citing', citations: 18 },
        { id: 'node-2', label: 'Topological Quantum Error Correction (2024)', group: 'cited', citations: 125 },
        { id: 'node-3', label: 'Distributed Quantum Gate Synchronization (2026)', group: 'citing', citations: 7 },
        { id: 'node-4', label: 'Superconducting Transmon Array Dynamics (2023)', group: 'cited', citations: 210 },
      ],
      edges: [
        { source: 'node-1', target: publicationId, type: 'CITES' },
        { source: 'node-3', target: publicationId, type: 'CITES' },
        { source: publicationId, target: 'node-2', type: 'CITES' },
        { source: publicationId, target: 'node-4', type: 'CITES' },
      ],
    };
  }

  async getJournalMetrics(journalId: string) {
    const journal = await this.prisma.journal.findUnique({
      where: { id: journalId },
    });

    return {
      journalId,
      journalName: journal?.name || 'PUBLISHORA Quantum Systems Journal',
      issn: journal?.issn || '2026-8472',
      metrics: {
        journalImpactFactor: 5.12,
        fiveYearJif: 5.84,
        sjrScore: 2.14,
        snipScore: 1.88,
        acceptanceRatePercent: 24.5,
        averageTimeToFirstDecisionDays: 18,
      },
    };
  }
}
