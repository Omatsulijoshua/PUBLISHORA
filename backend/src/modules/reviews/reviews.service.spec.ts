import { ReviewsService } from './reviews.service';

describe('Phase 9 — Peer Review Management & Referee Workspace Specs', () => {
  let service: ReviewsService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      submission: {
        findUnique: jest.fn(),
      },
      review: {
        create: jest.fn().mockImplementation((args) => Promise.resolve({ id: 'rev-1', ...args.data })),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn().mockImplementation((args) => Promise.resolve({ id: args.where.id, ...args.data })),
      },
    };
    service = new ReviewsService(mockPrisma);
  });

  it('should invite referee for peer review', async () => {
    mockPrisma.submission.findUnique.mockResolvedValue({ id: 'sub-100' });

    const review = await service.inviteReviewer({
      submissionId: 'sub-100',
      reviewerId: 'user-turing',
    });

    expect(review.submissionId).toBe('sub-100');
    expect(review.reviewerId).toBe('user-turing');
    expect(mockPrisma.review.create).toHaveBeenCalled();
  });

  it('should submit peer review recommendation ACCEPT', async () => {
    mockPrisma.review.findUnique.mockResolvedValue({ id: 'rev-100' });

    const result = await service.submitReview({
      reviewId: 'rev-100',
      recommendation: 'ACCEPT',
      commentsForAuthor: 'Excellent methodology and clear results.',
    });

    expect(result.recommendation).toBe('ACCEPT');
    expect(result.commentsToAuthor).toBe('Excellent methodology and clear results.');
    expect(mockPrisma.review.update).toHaveBeenCalled();
  });
});
