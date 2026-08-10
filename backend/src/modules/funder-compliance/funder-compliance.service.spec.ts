import { FunderComplianceService } from './funder-compliance.service';
import { BadRequestException } from '@nestjs/common';

describe('Phase 41 — Funder Compliance & Plan S Specs', () => {
  let service: FunderComplianceService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {};
    service = new FunderComplianceService(mockPrisma);
  });

  it('should evaluate manuscript as Plan S compliant when CC BY 4.0 and 0 embargo', () => {
    const check = service.checkPlanSCompliance({
      publicationId: 'pub-101',
      licenseType: 'CC BY 4.0',
      embargoMonths: 0,
      funderName: 'Wellcome Trust',
    });

    expect(check.planSCompliant).toBe(true);
    expect(check.rightsRetentionStrategyRrsApplied).toBe(true);
    expect(check.rrsStatement).toContain('applied a CC BY public copyright license');
  });

  it('should evaluate manuscript as non-compliant for Plan S when non-commercial CC BY-NC is used', () => {
    const check = service.checkPlanSCompliance({
      publicationId: 'pub-101',
      licenseType: 'CC BY-NC 4.0',
      embargoMonths: 0,
      funderName: 'Wellcome Trust',
    });

    expect(check.planSCompliant).toBe(false);
  });

  it('should throw BadRequestException when checking Plan S without publication ID', () => {
    expect(() =>
      service.checkPlanSCompliance({ publicationId: '', licenseType: 'CC BY 4.0', embargoMonths: 0, funderName: '' }),
    ).toThrow(BadRequestException);
  });

  it('should validate NIH Public Access PMC deposit mandate', () => {
    const nih = service.validateNihMandate('NIH-R01-HG009182');

    expect(nih.grantAwardId).toBe('NIH-R01-HG009182');
    expect(nih.pmcDepositMandateRequired).toBe(true);
    expect(nih.complianceStatus).toContain('PMC_DEPOSIT');
  });

  it('should resolve Crossref FundRef Registry ID', () => {
    const fundref = service.resolveFundRef('100004447');

    expect(fundref.funderName).toBe('Wellcome Trust');
    expect(fundref.openAccessMandate).toContain('CC BY 4.0 mandatory');
    expect(fundref.crossrefFundRefUri).toContain('10.13039/100004447');
  });
});
