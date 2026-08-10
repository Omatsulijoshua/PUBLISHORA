import { DataDepositsService } from './data-deposits.service';
import { BadRequestException } from '@nestjs/common';

describe('Phase 40 — Research Data Repositories & FAIR Data Specs', () => {
  let service: DataDepositsService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {};
    service = new DataDepositsService(mockPrisma);
  });

  it('should create deposit on Zenodo and issue Data DOI', () => {
    const deposit = service.createDeposit({
      title: 'Quantum State Vector Dataset',
      repository: 'zenodo',
      authors: ['Dr. Eleanor Vance'],
      fileSizeMb: 1420,
    });

    expect(deposit.depositId).toContain('dep-');
    expect(deposit.dataDoi).toContain('10.5281/zenodo.');
    expect(deposit.depositStatus).toBe('COMPLETED_SUCCESSFULLY');
    expect(deposit.fairComplianceScore).toBeGreaterThan(90);
  });

  it('should throw BadRequestException when creating deposit without title', () => {
    expect(() =>
      service.createDeposit({ title: '', repository: 'zenodo', authors: [], fileSizeMb: 10 }),
    ).toThrow(BadRequestException);
  });

  it('should perform FAIR Data Principles compliance audit', () => {
    const audit = service.performFairAudit('ds-101');

    expect(audit.fairOverallScore).toBeGreaterThanOrEqual(90);
    expect(audit.passStatus).toContain('FAIR_COMPLIANT');
    expect(audit.pillars.findable.score).toBeGreaterThan(90);
  });

  it('should generate valid DataCite 4.4 Schema XML payload', () => {
    const xml = service.generateDataCiteXml('ds-101');

    expect(xml.dataCiteVersion).toBe('4.4');
    expect(xml.xmlContent).toContain('http://datacite.org/schema/kernel-4');
    expect(xml.xmlContent).toContain('resourceTypeGeneral="Dataset"');
  });
});
