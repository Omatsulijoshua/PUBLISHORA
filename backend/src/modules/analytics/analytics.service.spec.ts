import { AnalyticsService } from './analytics.service';

describe('Phase 28 — Platform Analytics & Institutional Reporting Specs', () => {
  let service: AnalyticsService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {};
    service = new AnalyticsService(mockPrisma);
  });

  it('should return COUNTER Release 5 JR1 journal usage report', () => {
    const report = service.getCounterR5Report('JR1');

    expect(report.reportHeader.release).toBe('5.0');
    expect(report.metrics.totalItemInvestigations).toBeGreaterThan(0);
    expect(report.metrics.totalItemRequests).toBeGreaterThan(0);
  });

  it('should return global readership geographic distribution breakdown', () => {
    const readership = service.getReadershipBreakdown();

    expect(readership.totalDownloads).toBeGreaterThan(0);
    expect(readership.geographicDistribution.length).toBeGreaterThanOrEqual(3);
    expect(readership.geographicDistribution[0].countryCode).toBe('US');
  });

  it('should return editorial pipeline throughput metrics', () => {
    const throughput = service.getEditorialThroughput();

    expect(throughput.avgDaysToFirstDecision).toBeLessThan(30);
    expect(throughput.acceptanceRatePercent).toBeGreaterThan(0);
  });

  it('should create recurring automated report email schedule', async () => {
    const schedule = await service.createReportSchedule({
      reportType: 'COUNTER_R5_JR1',
      recipientEmail: 'library-admin@mit.edu',
      frequency: 'MONTHLY',
    });

    expect(schedule.id).toContain('sched-');
    expect(schedule.frequency).toBe('MONTHLY');
    expect(schedule.status).toBe('ACTIVE');
  });
});
