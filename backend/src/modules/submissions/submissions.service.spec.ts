import { SubmissionsService } from './submissions.service';

describe('Phase 8 — Submission Engine & Editorial Intake Specs', () => {
  let service: SubmissionsService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      publication: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      submission: {
        count: jest.fn().mockResolvedValue(41),
        create: jest.fn().mockImplementation((args) => Promise.resolve({ id: 'sub-1', ...args.data })),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn().mockImplementation((args) => Promise.resolve({ id: args.where.id, ...args.data })),
      },
      editorialAssignment: {
        create: jest.fn().mockResolvedValue({ id: 'assign-1' }),
      },
    };
    service = new SubmissionsService(mockPrisma);
  });

  it('should create manuscript submission with formatted SUB-2026-0042 tracking number', async () => {
    mockPrisma.publication.findUnique.mockResolvedValue({ id: 'pub-1' });

    const submission = await service.createSubmission({
      publicationId: 'pub-1',
      submitterId: 'user-1',
      coverLetter: 'Please consider our work for publication.',
    });

    expect(submission.submissionNum).toContain('SUB-');
    expect(submission.status).toBe('SUBMITTED');
    expect(mockPrisma.submission.create).toHaveBeenCalled();
  });

  it('should execute desk decision SEND_FOR_REVIEW and assign editor', async () => {
    mockPrisma.submission.findUnique.mockResolvedValue({ id: 'sub-1', publicationId: 'pub-1' });

    const result = await service.screenSubmission({
      submissionId: 'sub-1',
      editorId: 'editor-99',
      decision: 'SEND_FOR_REVIEW',
      comments: 'Scope matches journal.',
    });

    expect(result.decision).toBe('SEND_FOR_REVIEW');
    expect(result.newStatus).toBe('IN_REVIEW');
    expect(mockPrisma.editorialAssignment.create).toHaveBeenCalled();
  });
});
