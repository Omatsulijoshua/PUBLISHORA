import { LibraryService } from './library.service';

describe('Phase 15 — Institutional Library & Repository Auto-Deposit Specs', () => {
  let service: LibraryService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      publication: {
        findUnique: jest.fn(),
      },
    };
    service = new LibraryService(mockPrisma);
  });

  it('should trigger SWORDv2 repository auto-deposit for DSpace', async () => {
    mockPrisma.publication.findUnique.mockResolvedValue({ id: 'pub-55', title: 'Quantum Computing' });

    const result = await service.depositToRepository({
      publicationId: 'pub-55',
      repositoryTarget: 'DSPACE',
    });

    expect(result.depositStatus).toBe('DEPOSITED_SUCCESSFULLY');
    expect(result.repositoryTarget).toBe('DSPACE');
    expect(result.depositHandleUri).toContain('http://hdl.handle.net/');
  });

  it('should list institutional library members and APC discount agreements', () => {
    const institutions = service.getInstitutions();
    expect(institutions.length).toBeGreaterThanOrEqual(4);
    expect(institutions[0].name).toContain('Harvard University');
  });

  it('should generate institutional APC invoice with 100% waiver under transformative agreement', async () => {
    const invoice = await service.generateApcInvoice({
      institutionName: 'University of Oxford',
      authorEmail: 'author@ox.ac.uk',
      publicationId: 'pub-55',
      apcAmount: 2500,
    });

    expect(invoice.invoiceRef).toContain('INV-APC-');
    expect(invoice.netAmountPayable).toBe(0);
    expect(invoice.status).toBe('COVERED_BY_INSTITUTIONAL_SUBSCRIPTION');
  });
});
