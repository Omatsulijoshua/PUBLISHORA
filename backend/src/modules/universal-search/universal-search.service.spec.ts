import { UniversalSearchService } from './universal-search.service';
import { BadRequestException } from '@nestjs/common';

describe('Phase 42 — Universal Search & Vector Discovery Specs', () => {
  let service: UniversalSearchService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {};
    service = new UniversalSearchService(mockPrisma);
  });

  it('should query universal search across journals, preprints, and datasets', () => {
    const search = service.queryUniversalSearch({ query: 'quantum computing' });

    expect(search.query).toBe('quantum computing');
    expect(search.totalCount).toBeGreaterThan(0);
    expect(search.meshExpandedTerms.length).toBeGreaterThan(0);
    expect(search.results[0].title).toContain('Quantum');
  });

  it('should fetch Semantic Scholar citation graph and paper metadata', () => {
    const graph = service.getSemanticScholarGraph('10.1038/s41586-026-00101-x');

    expect(graph.semanticScholarId).toContain('S2-PAPER-');
    expect(graph.citationCount).toBeGreaterThan(0);
    expect(graph.citationGraphNodes.length).toBeGreaterThan(0);
  });

  it('should perform HNSW vector similarity search on text embeddings', () => {
    const vector = service.performVectorSimilaritySearch('quantum error correction');

    expect(vector.embeddingModel).toBe('text-embedding-3-small');
    expect(vector.vectorDimensions).toBe(1536);
    expect(vector.distanceMetric).toBe('COSINE_SIMILARITY_HNSW');
    expect(vector.nearestMatches.length).toBeGreaterThan(0);
  });

  it('should throw BadRequestException when vector similarity text is empty', () => {
    expect(() => service.performVectorSimilaritySearch('')).toThrow(BadRequestException);
  });
});
