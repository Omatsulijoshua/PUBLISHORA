import { SearchService } from './search.service';

describe('Phase 24 — Global Search & Knowledge Graph Specs', () => {
  let service: SearchService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {};
    service = new SearchService(mockPrisma);
  });

  it('should execute full-text search with journal and year facets', async () => {
    const res = await service.search({
      query: 'Quantum',
      openAccessOnly: true,
    });

    expect(res.hits.length).toBeGreaterThanOrEqual(1);
    expect(res.facets.journals.length).toBeGreaterThanOrEqual(1);
  });

  it('should perform semantic vector search with cosine similarity ranking', async () => {
    const sem = await service.semanticVectorSearch('topological error correction');

    expect(sem.distanceMetric).toBe('COSINE_SIMILARITY');
    expect(sem.results.length).toBeGreaterThanOrEqual(1);
    expect(sem.results[0].similarityScore).toBeGreaterThan(0.8);
  });

  it('should traverse citation knowledge graph for target publication', async () => {
    const graph = await service.getCitationGraph('c3be03dd-e3bc-4f81-a82a-fab2e6d44e51');

    expect(graph.centerNodeId).toBe('c3be03dd-e3bc-4f81-a82a-fab2e6d44e51');
    expect(graph.nodes.length).toBeGreaterThanOrEqual(3);
    expect(graph.edges.length).toBeGreaterThanOrEqual(2);
  });
});
