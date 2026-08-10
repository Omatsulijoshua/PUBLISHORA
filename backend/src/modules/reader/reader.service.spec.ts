import { ReaderService } from './reader.service';

describe('Phase 17 — Reader Workspace & Research Notes Specs', () => {
  let service: ReaderService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      publication: {
        findUnique: jest.fn(),
      },
    };
    service = new ReaderService(mockPrisma);
  });

  it('should add publication to personal bookshelf', async () => {
    mockPrisma.publication.findUnique.mockResolvedValue({ id: 'pub-101', title: 'Quantum Computing Foundations' });

    const item = await service.addToBookshelf('user-101', 'pub-101');

    expect(item.userId).toBe('user-101');
    expect(item.publicationId).toBe('pub-101');
    expect(item.progressPercent).toBe(0);
  });

  it('should save multicolor manuscript text highlight annotation', async () => {
    const ann = await service.addAnnotation({
      publicationId: 'pub-101',
      userId: 'user-101',
      selectedText: 'distributed quantum computing protocol',
      color: 'yellow',
      noteComment: 'Key insight for Chapter 3',
    });

    expect(ann.color).toBe('yellow');
    expect(ann.selectedText).toBe('distributed quantum computing protocol');
    expect(ann.noteComment).toBe('Key insight for Chapter 3');
  });

  it('should return personalized research recommendation feed', () => {
    const feed = service.getResearchFeed('user-101');
    expect(feed.length).toBeGreaterThanOrEqual(2);
    expect(feed[0].matchScore).toBeGreaterThan(90);
  });
});
