import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface SearchQueryDto {
  query?: string;
  journal?: string;
  year?: number;
  openAccessOnly?: boolean;
  license?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class SearchService {
  private mockCorpus: any[] = [
    {
      id: 'c3be03dd-e3bc-4f81-a82a-fab2e6d44e51',
      title: 'Quantum Computing Foundations for Distributed Systems',
      abstract: 'We introduce a unified framework for topological quantum error correction across distributed nodes...',
      journal: 'PUBLISHORA Quantum Systems',
      year: 2026,
      openAccess: true,
      license: 'CC-BY 4.0',
      doi: '10.5555/publishora.2026.001',
      authors: ['Ada Lovelace', 'Charles Babbage'],
      vectorScore: 0.96,
      citationCount: 42,
    },
    {
      id: 'prep-2026-881',
      title: 'Scalable Transmon Qubit Control via Cryogenic Microwave CMOS Drivers',
      abstract: 'We present a 4 Kelvin CMOS driver circuit capable of addressing 64 transmon qubits...',
      journal: 'PUBLISHORA Preprints',
      year: 2026,
      openAccess: true,
      license: 'CC-BY 4.0',
      doi: '10.5555/publishora.preprint.2026.881',
      authors: ['Ada Lovelace', 'Marcus Thorne'],
      vectorScore: 0.89,
      citationCount: 14,
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  async search(dto: SearchQueryDto) {
    let results = [...this.mockCorpus];

    if (dto.query) {
      const q = dto.query.toLowerCase();
      results = results.filter(
        (item) => item.title.toLowerCase().includes(q) || item.abstract.toLowerCase().includes(q),
      );
    }

    if (dto.journal) {
      results = results.filter((item) => item.journal.toLowerCase().includes(dto.journal.toLowerCase()));
    }

    if (dto.year) {
      results = results.filter((item) => item.year === Number(dto.year));
    }

    if (dto.openAccessOnly) {
      results = results.filter((item) => item.openAccess === true);
    }

    return {
      total: results.length,
      facets: {
        journals: [{ name: 'PUBLISHORA Quantum Systems', count: 1 }, { name: 'PUBLISHORA Preprints', count: 1 }],
        years: [{ year: 2026, count: 2 }],
        licenses: [{ name: 'CC-BY 4.0', count: 2 }],
      },
      hits: results,
    };
  }

  async semanticVectorSearch(query: string) {
    return {
      query,
      vectorEmbeddingDim: 1536,
      distanceMetric: 'COSINE_SIMILARITY',
      results: this.mockCorpus.map((item) => ({
        ...item,
        similarityScore: item.vectorScore,
      })),
    };
  }

  async getCitationGraph(pubId: string) {
    return {
      centerNodeId: pubId,
      nodes: [
        { id: pubId, label: 'Quantum Computing Foundations for Distributed Systems', type: 'TARGET' },
        { id: 'node-cit-1', label: 'Topological Qubit Fabric Architectures (Rostova et al., 2026)', type: 'CITED_BY' },
        { id: 'node-ref-1', label: 'Fault-Tolerant Quantum Computation (Shor, 1996)', type: 'REFERENCES' },
      ],
      edges: [
        { source: 'node-cit-1', target: pubId, weight: 1.0, relation: 'CITES' },
        { source: pubId, target: 'node-ref-1', weight: 0.85, relation: 'REFERENCES' },
      ],
    };
  }
}
