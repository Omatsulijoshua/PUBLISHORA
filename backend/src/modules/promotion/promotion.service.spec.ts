import { PromotionService } from './promotion.service';

describe('Phase 13 — Academic Promotion Engine & Tenure Dossier Specs', () => {
  let service: PromotionService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      promotionProfile: {
        findUnique: jest.fn(),
        create: jest.fn().mockImplementation((args) => Promise.resolve({ id: 'prof-1', ...args.data })),
        update: jest.fn().mockImplementation((args) => Promise.resolve({ id: 'prof-1', ...args.data })),
      },
      publicationAuthor: {
        findMany: jest.fn().mockResolvedValue([
          {
            authorOrder: 1,
            isCorresponding: false,
            publication: { id: 'p1', title: 'Paper 1', createdAt: new Date('2026-01-01'), publicationType: { name: 'Journal' }, identifiers: [] },
          },
          {
            authorOrder: 2,
            isCorresponding: true,
            publication: { id: 'p2', title: 'Paper 2', createdAt: new Date('2025-01-01'), publicationType: { name: 'Conference' }, identifiers: [] },
          },
          {
            authorOrder: 3,
            isCorresponding: false,
            publication: { id: 'p3', title: 'Paper 3', createdAt: new Date('2024-01-01'), publicationType: { name: 'Journal' }, identifiers: [] },
          },
        ]),
      },
      review: {
        findMany: jest.fn().mockResolvedValue([{ id: 'r1' }, { id: 'r2' }]),
      },
    };
    service = new PromotionService(mockPrisma);
  });

  it('should compile tenure dossier with author credit allocation (40 pts first, 30 pts corresponding, 10 pts co-author)', async () => {
    const dossier = await service.getTenureDossier('user-101');

    expect(dossier.summary.totalPublications).toBe(3);
    expect(dossier.summary.firstAuthorCount).toBe(1);
    expect(dossier.summary.correspondingCount).toBe(1);
    expect(dossier.summary.coAuthorCount).toBe(1);
    expect(dossier.summary.totalPeerReviewsCompleted).toBe(2);
    expect(dossier.summary.totalCalculatedCreditScore).toBe(80); // 40 + 30 + 10 = 80
  });

  it('should setup promotion profile for Associate Professor rank', async () => {
    const profile = await service.setupProfile({
      userId: 'user-101',
      currentRank: 'Assistant Professor',
      targetRank: 'Associate Professor',
      universityId: 'univ-mit-cs',
    });

    expect(profile.targetRank).toBe('Associate Professor');
    expect(mockPrisma.promotionProfile.create).toHaveBeenCalled();
  });
});
