import { PpprService } from './pppr.service';

describe('Phase 22 — Post-Publication Peer Review & Dynamic Annotations Specs', () => {
  let service: PpprService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {};
    service = new PpprService(mockPrisma);
  });

  it('should submit a post-publication critique with verified ORCID ID', async () => {
    const review = await service.submitReview({
      publicationId: 'c3be03dd-e3bc-4f81-a82a-fab2e6d44e51',
      reviewerName: 'Dr. Richard Feynman',
      orcidId: '0000-0003-9120-4491',
      affiliation: 'Caltech Quantum Group',
      title: 'Path Integral Formulation in Figure 2',
      comment: 'The classical action S in equation 8 needs clarification on phase factor boundary conditions.',
    });

    expect(review.reviewerName).toBe('Dr. Richard Feynman');
    expect(review.orcidId).toBe('0000-0003-9120-4491');
  });

  it('should post official author response thread', async () => {
    const resp = await service.postAuthorResponse({
      reviewId: 'pppr-101',
      authorName: 'Dr. Ada Lovelace',
      responseContent: 'We appreciate the detailed critique. Boundary conditions have been clarified in v2.',
    });

    expect(resp.authorName).toBe('Dr. Ada Lovelace');
    expect(resp.responseContent).toContain('Boundary conditions have been clarified');
  });

  it('should submit independent lab replication attempt report', async () => {
    const report = await service.submitReplicationReport({
      publicationId: 'c3be03dd-e3bc-4f81-a82a-fab2e6d44e51',
      labName: 'Oxford Quantum Micro-Fabrication Lab',
      leadResearcher: 'Dr. Marcus Thorne',
      replicationResult: 'REPLICATED_SUCCESSFULLY',
      notes: 'Independently confirmed transmon coherence times within 1.2% variance.',
    });

    expect(report.replicationResult).toBe('REPLICATED_SUCCESSFULLY');
    expect(report.labName).toBe('Oxford Quantum Micro-Fabrication Lab');
  });
});
