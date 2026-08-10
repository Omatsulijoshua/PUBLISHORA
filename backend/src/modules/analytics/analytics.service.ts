import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateReportScheduleDto {
  reportType: 'COUNTER_R5_JR1' | 'COUNTER_R5_BR2' | 'EDITORIAL_PIPELINE';
  recipientEmail: string;
  frequency: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
}

@Injectable()
export class AnalyticsService {
  private mockSchedules: any[] = [];

  constructor(private readonly prisma: PrismaService) {}

  getCounterR5Report(type: 'JR1' | 'BR2' | 'PR1' = 'JR1') {
    return {
      reportHeader: {
        reportName: type === 'JR1' ? 'Journal Usage Report (JR1)' : 'Book Usage Report (BR2)',
        reportId: `COUNTER_R5_${type}`,
        release: '5.0',
        institutionName: 'Global Academic Library Network',
        period: '2026-01-01 to 2026-08-10',
        created: new Date().toISOString(),
      },
      metrics: {
        totalItemInvestigations: 12450,
        totalItemRequests: 8920,
        uniqueItemInvestigations: 9800,
        uniqueItemRequests: 7450,
      },
      topPerformingItems: [
        { title: 'Quantum Computing Foundations for Distributed Systems', doi: '10.5555/publishora.2026.001', requests: 3410 },
        { title: 'CRISPR-Cas13 RNA Editing Dynamics in Eukaryotic Cells', doi: '10.5555/publishora.2026.002', requests: 2890 },
      ],
    };
  }

  getReadershipBreakdown() {
    return {
      totalDownloads: 48920,
      totalCitations: 3120,
      geographicDistribution: [
        { countryCode: 'US', countryName: 'United States', percentage: 42.5, downloads: 20791 },
        { countryCode: 'GB', countryName: 'United Kingdom', percentage: 21.0, downloads: 10273 },
        { countryCode: 'DE', countryName: 'Germany', percentage: 14.2, downloads: 6946 },
        { countryCode: 'JP', countryName: 'Japan', percentage: 11.8, downloads: 5772 },
        { countryCode: 'CA', countryName: 'Canada', percentage: 10.5, downloads: 5138 },
      ],
    };
  }

  getEditorialThroughput() {
    return {
      avgDaysToFirstDecision: 14.2,
      avgDaysToFinalPublication: 48.5,
      acceptanceRatePercent: 32.4,
      deskRejectionRatePercent: 18.6,
      peerReviewerResponseRatePercent: 88.4,
      submissionsInPipelineCount: 142,
    };
  }

  async createReportSchedule(dto: CreateReportScheduleDto) {
    const schedule = {
      id: `sched-${Date.now()}`,
      reportType: dto.reportType,
      recipientEmail: dto.recipientEmail,
      frequency: dto.frequency,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    this.mockSchedules.push(schedule);
    return schedule;
  }
}
