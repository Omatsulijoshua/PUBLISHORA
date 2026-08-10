import { MetricsService } from './metrics.service';

describe('Phase 16 — Journal Metrics & Citation Knowledge Graph Specs', () => {
  let service: MetricsService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      publication: {
        findUnique: jest.fn(),
      },
      journal: {
        findUnique: jest.fn(),
      },
    };
    service = new MetricsService(mockPrisma);
  });

  it('should fetch publication impact metrics, citation count, and Altmetric score', async () => {
    mockPrisma.publication.findUnique.mockResolvedValue({ id: 'pub-88', title: 'Quantum Computing Foundations' });

    const metrics = await service.getPublicationMetrics('pub-88');

    expect(metrics.publicationId).toBe('pub-88');
    expect(metrics.citations.totalCitations).toBe(42);
    expect(metrics.impactMetrics.estimatedJif).toBeGreaterThan(0);
    expect(metrics.altmetrics.score).toBe(87);
  });

  it('should generate citation network graph nodes and edges', async () => {
    mockPrisma.publication.findUnique.mockResolvedValue({ id: 'pub-88', title: 'Quantum Computing Foundations' });

    const graph = await service.getCitationGraph('pub-88');

    expect(graph.nodes.length).toBeGreaterThanOrEqual(4);
    expect(graph.edges.length).toBeGreaterThanOrEqual(4);
    expect(graph.nodes[0].id).toBe('pub-88');
  });

  it('should fetch journal impact factor and SJR proxy metrics', async () => {
    mockPrisma.journal.findUnique.mockResolvedValue({ id: 'j-1', name: 'PUBLISHORA Quantum Systems', issn: '2026-8472' });

    const jMetrics = await service.getJournalMetrics('j-1');

    expect(jMetrics.metrics.journalImpactFactor).toBe(5.12);
    expect(jMetrics.metrics.sjrScore).toBe(2.14);
  });
});
