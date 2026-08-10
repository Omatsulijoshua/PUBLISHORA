import { GrantsService } from './grants.service';

describe('Phase 14 — Grant & Funding Integration Engine Specs', () => {
  let service: GrantsService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      publication: {
        findUnique: jest.fn(),
      },
      grantFunding: {
        create: jest.fn().mockImplementation((args) => Promise.resolve({ id: 'grant-1', ...args.data })),
        findMany: jest.fn(),
      },
    };
    service = new GrantsService(mockPrisma);
  });

  it('should attach grant funding metadata to a publication', async () => {
    mockPrisma.publication.findUnique.mockResolvedValue({ id: 'pub-99', title: 'Quantum Computing' });

    const grant = await service.attachGrant({
      publicationId: 'pub-99',
      funderName: 'National Institutes of Health (NIH)',
      grantNumber: 'R01-HG001234',
    });

    expect(grant.funderName).toBe('National Institutes of Health (NIH)');
    expect(grant.grantNumber).toBe('R01-HG001234');
    expect(mockPrisma.grantFunding.create).toHaveBeenCalled();
  });

  it('should audit Plan S Open Access compliance as COMPLIANT when grants are attached', async () => {
    mockPrisma.grantFunding.findMany.mockResolvedValue([
      { id: 'g1', funderName: 'NIH', grantNumber: 'R01-HG001234' },
    ]);
    mockPrisma.publication.findUnique.mockResolvedValue({ id: 'pub-99', title: 'Quantum Computing' });

    const result = await service.getPublicationGrants('pub-99');

    expect(result.totalGrantsAttached).toBe(1);
    expect(result.openAccessCompliance.auditStatus).toBe('COMPLIANT');
    expect(result.openAccessCompliance.isPlanSCompliant).toBe(true);
  });

  it('should list supported global funder agencies', () => {
    const funders = service.getSupportedFunders();
    expect(funders.length).toBeGreaterThanOrEqual(5);
    expect(funders[0].name).toContain('National Institutes of Health');
  });
});
