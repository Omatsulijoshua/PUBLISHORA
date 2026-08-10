import { CounterR5Service } from './counter-r5.service';

describe('Phase 43 — COUNTER Release 5 & SUSHI API Specs', () => {
  let service: CounterR5Service;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {};
    service = new CounterR5Service(mockPrisma);
  });

  it('should generate COUNTER R5 SUSHI TR_J1 Journal Usage Report JSON payload', () => {
    const report = service.getSushiTrJ1Report('2026-01-01', '2026-06-30');

    expect(report.reportHeader.reportId).toBe('TR_J1');
    expect(report.reportHeader.release).toBe('5');
    expect(report.reportItems.length).toBeGreaterThan(0);
    expect(report.reportItems[0].itemPerformance[0].instance.length).toBeGreaterThan(0);
  });

  it('should return readership geographic heatmaps sorted by total downloads', () => {
    const geo = service.getGeoHeatmap();

    expect(geo.topReadershipCountries.length).toBeGreaterThan(0);
    expect(geo.topReadershipCountries[0].countryCode).toBe('US');
    expect(geo.totalGlobalDownloadsCurrentYear).toBeGreaterThan(500000);
  });

  it('should calculate institutional Cost-Per-Download (CPD)', () => {
    const cpd = service.getCpdMetrics('inst-camb-901');

    expect(cpd.institutionId).toBe('inst-camb-901');
    expect(cpd.costPerDownloadUsd).toBeLessThan(1.0);
    expect(cpd.valueAssessment).toContain('HIGH_VALUE');
  });
});
