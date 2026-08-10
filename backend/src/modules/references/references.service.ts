import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateReferenceDto {
  publicationId: string;
  rawText: string;
  title?: string;
  authors?: string;
  journalName?: string;
  year?: number;
  doi?: string;
  isbn?: string;
  url?: string;
}

export type CitationStyle = 'APA' | 'MLA' | 'CHICAGO' | 'HARVARD' | 'VANCOUVER' | 'IEEE';

@Injectable()
export class ReferencesService {
  constructor(private readonly prisma: PrismaService) {}

  async createReference(dto: CreateReferenceDto) {
    return this.prisma.reference.create({
      data: {
        publicationId: dto.publicationId,
        rawText: dto.rawText,
        title: dto.title,
        authors: dto.authors,
        journalName: dto.journalName,
        year: dto.year,
        doi: dto.doi,
        isbn: dto.isbn,
        url: dto.url,
      },
    });
  }

  async findByPublication(publicationId: string, style: CitationStyle = 'APA') {
    const refs = await this.prisma.reference.findMany({
      where: { publicationId },
      orderBy: { createdAt: 'asc' },
    });

    return refs.map((ref, idx) => ({
      ...ref,
      formattedCitation: this.formatCitation(ref, style, idx + 1),
    }));
  }

  formatCitation(ref: any, style: CitationStyle, index: number): string {
    const authors = ref.authors || 'Unknown Author';
    const year = ref.year || 'n.d.';
    const title = ref.title || ref.rawText;
    const journal = ref.journalName ? `*${ref.journalName}*` : '';
    const doiStr = ref.doi ? `https://doi.org/${ref.doi}` : '';

    switch (style) {
      case 'APA':
        return `${authors} (${year}). ${title}. ${journal}. ${doiStr}`.trim();
      case 'MLA':
        return `${authors}. "${title}." ${journal}, ${year}. ${doiStr}`.trim();
      case 'CHICAGO':
        return `${authors}. "${title}." ${journal} (${year}). ${doiStr}`.trim();
      case 'IEEE':
        return `[${index}] ${authors}, "${title}," ${journal}, ${year}. ${doiStr}`.trim();
      case 'HARVARD':
        return `${authors}, ${year}. ${title}. ${journal}. ${doiStr}`.trim();
      case 'VANCOUVER':
        return `${index}. ${authors}. ${title}. ${journal}. ${year}. ${doiStr}`.trim();
      default:
        return ref.rawText;
    }
  }

  async importBibTeX(publicationId: string, bibtexString: string) {
    // Simple BibTeX entry extractor
    const titleMatch = bibtexString.match(/title\s*=\s*[{"]([^}"]+)[}"]/i);
    const authorMatch = bibtexString.match(/author\s*=\s*[{"]([^}"]+)[}"]/i);
    const yearMatch = bibtexString.match(/year\s*=\s*[{"]?(\d{4})[}"]?/i);
    const journalMatch = bibtexString.match(/journal\s*=\s*[{"]([^}"]+)[}"]/i);
    const doiMatch = bibtexString.match(/doi\s*=\s*[{"]([^}"]+)[}"]/i);

    return this.createReference({
      publicationId,
      rawText: bibtexString,
      title: titleMatch ? titleMatch[1] : 'Imported BibTeX Entry',
      authors: authorMatch ? authorMatch[1] : 'Unknown Author',
      year: yearMatch ? parseInt(yearMatch[1], 10) : 2026,
      journalName: journalMatch ? journalMatch[1] : undefined,
      doi: doiMatch ? doiMatch[1] : undefined,
    });
  }
}
