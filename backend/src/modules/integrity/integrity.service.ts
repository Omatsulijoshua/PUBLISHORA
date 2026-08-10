import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface IntegrityAuditDto {
  publicationId?: string;
  manuscriptText: string;
}

export interface IntegrityIssue {
  category: 'CITATION_CONSISTENCY' | 'UNSUPPORTED_CLAIM' | 'AI_CHARACTERISTICS' | 'METADATA_INCONSISTENCY';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  suggestion: string;
}

@Injectable()
export class IntegrityService {
  constructor(private readonly prisma: PrismaService) {}

  async runAudit(dto: IntegrityAuditDto) {
    const issues: IntegrityIssue[] = [];

    // Audit 1: Check for brackets or parenthetical citations vs bibliography
    const text = dto.manuscriptText;
    const citationMatches = text.match(/\[\d+\]|\([A-Za-z\s]+,\s*\d{4}\)/g) || [];

    let registeredRefs: any[] = [];
    if (dto.publicationId) {
      registeredRefs = await this.prisma.reference.findMany({
        where: { publicationId: dto.publicationId },
      });
    }

    if (citationMatches.length > 0 && registeredRefs.length === 0) {
      issues.push({
        category: 'CITATION_CONSISTENCY',
        severity: 'HIGH',
        title: 'Citations Detected Without Registered References',
        description: `Found ${citationMatches.length} in-text citations, but 0 reference entries are saved in your bibliography manager.`,
        suggestion: 'Import reference metadata or add matching entries to your reference manager.',
      });
    }

    // Audit 2: Empirical Claim Checker
    if (text.toLowerCase().includes('proved beyond doubt') || text.toLowerCase().includes('100% conclusive')) {
      issues.push({
        category: 'UNSUPPORTED_CLAIM',
        severity: 'MEDIUM',
        title: 'Absolute Claim Language Detected',
        description: 'Phrases like "proved beyond doubt" can be flagged by academic peer reviewers.',
        suggestion: 'Consider replacing absolute language with qualified academic phrases (e.g. "evidence strongly indicates").',
      });
    }

    // Audit 3: AI Writing Characteristics Indicator
    if (text.toLowerCase().includes('delve into') || text.toLowerCase().includes('tapestry') || text.toLowerCase().includes('in conclusion, it is important to note')) {
      issues.push({
        category: 'AI_CHARACTERISTICS',
        severity: 'LOW',
        title: 'Potential AI-Generated Characteristics Detected',
        description: 'Notice: Certain stylistic patterns frequently associated with LLM generation were identified in section paragraphs.',
        suggestion: 'Review phrasing to ensure your authentic personal scholarly voice comes through.',
      });
    }

    return {
      auditTimestamp: new Date().toISOString(),
      score: Math.max(100 - issues.length * 15, 60),
      totalIssuesFound: issues.length,
      citationCountFound: citationMatches.length,
      registeredReferencesCount: registeredRefs.length,
      issues,
      disclaimer: 'Integrity checks provide automated quality assistance and do not replace official human peer review or institutional evaluation.',
    };
  }
}
