import { JournalsService } from './journals.service';

describe('Phase 7 — Journal Management & Publisher Dashboard Specs', () => {
  let service: JournalsService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      journal: {
        create: jest.fn().mockImplementation((args) => Promise.resolve({ id: 'j-1', ...args.data })),
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
    };
    service = new JournalsService(mockPrisma);
  });

  it('should create new journal with ISSN and open access policy settings', async () => {
    const journal = await service.createJournal({
      name: 'Global Journal of AI Systems',
      issn: '2981-1111',
      description: 'Peer reviewed open access journal.',
      openAccessPolicy: 'Gold Open Access',
    });

    expect(journal.name).toBe('Global Journal of AI Systems');
    expect(journal.issn).toBe('2981-1111');
    expect(journal.openAccessPolicy).toBe('Gold Open Access');
    expect(mockPrisma.journal.create).toHaveBeenCalled();
  });
});
