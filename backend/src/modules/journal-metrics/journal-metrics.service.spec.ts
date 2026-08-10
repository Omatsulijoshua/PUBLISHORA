import { JournalMetricsService } from './journal-metrics.service';

describe('Phase 38 — Journal Impact Metrics & Altmetrics Specs', () => {
  let service: JournalMetricsService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {};
    service = new JournalMetricsService(mockPrisma);
  });

  it('should calculate 2-Year & 5-Year Journal Impact Factor (JIF) and SJR metrics', () => {
    const metrics = service.getJournalMetrics('journal-101');

    expect(metrics.jif2Year).toBeGreaterThan(5.0);
    expect(metrics.jif5Year).toBeGreaterThan(metrics.jif2Year);
    expect(metrics.scimagoJournalRankSjr).toBeGreaterThan(1.0);
    expect(metrics.journalQuartile).toContain('Q1');
  });

  it('should return Altmetric attention score and social/news mentions breakdown', () => {
    const altmetric = service.getAltmetricScore('pub-101');

    expect(altmetric.altmetricAttentionScore).toBeGreaterThan(100);
    expect(altmetric.mentionsBreakdown.newsOutlets).toBeGreaterThan(0);
    expect(altmetric.mentionsBreakdown.twitterX).toBeGreaterThan(0);
  });

  it('should calculate Field-Weighted Citation Impact (FWCI)', () => {
    const fwci = service.getFwciScore('pub-101');

    expect(fwci.fieldWeightedCitationImpactFwci).toBeGreaterThan(1.0);
    expect(fwci.impactComparison).toContain('global average');
  });
});
