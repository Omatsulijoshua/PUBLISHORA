import { AiSynthesisService } from './ai-synthesis.service';
import { BadRequestException } from '@nestjs/common';

describe('Phase 44 — AI Literature Synthesis & RAG Specs', () => {
  let service: AiSynthesisService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {};
    service = new AiSynthesisService(mockPrisma);
  });

  it('should execute RAG query and return synthesized answer with grounded citations', () => {
    const rag = service.executeRagQuery({
      prompt: 'What are the physical error rate thresholds for surface code fault tolerance?',
    });

    expect(rag.query).toContain('error rate thresholds');
    expect(rag.synthesizedAnswer).toContain('surface codes require physical error rates');
    expect(rag.groundedCitations.length).toBeGreaterThan(0);
    expect(rag.groundedCitations[0].doi).toBe('10.1038/s41586-026-00101-x');
  });

  it('should throw BadRequestException when RAG query prompt is empty', () => {
    expect(() => service.executeRagQuery({ prompt: '' })).toThrow(BadRequestException);
  });

  it('should generate PRISMA 2020 compliant systematic literature review flow', () => {
    const prisma = service.generatePrismaReview('Quantum Error Correction');

    expect(prisma.systematicReviewTopic).toBe('Quantum Error Correction');
    expect(prisma.prismaFlow2020.identification.recordsIdentifiedFromDatabases).toBeGreaterThan(1000);
    expect(prisma.prismaFlow2020.included.studiesIncludedInReview).toBe(90);
    expect(prisma.prismaDiagramStatus).toBe('PRISMA_2020_VERIFIED_COMPLIANT');
  });

  it('should analyze claim contradictions between manuscripts', () => {
    const contradictions = service.detectContradictions(['pub-101', 'pub-102']);

    expect(contradictions.analyzedManuscriptsCount).toBe(2);
    expect(contradictions.contradictionMatrix.length).toBeGreaterThan(0);
    expect(contradictions.contradictionMatrix[0].conflictSeverity).toContain('CONTRADICTION');
  });
});
