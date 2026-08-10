import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface AddAnnotationDto {
  publicationId: string;
  userId: string;
  selectedText: string;
  color: 'yellow' | 'green' | 'blue' | 'pink';
  noteComment?: string;
  startCharIndex?: number;
  endCharIndex?: number;
}

@Injectable()
export class ReaderService {
  private mockAnnotations: any[] = [
    {
      id: 'ann-1',
      publicationId: 'c3be03dd-e3bc-4f81-a82a-fab2e6d44e51',
      userId: 'user-101',
      selectedText: 'distributed quantum computing protocol achieves fault tolerance',
      color: 'yellow',
      noteComment: 'Key methodology breakthrough for Chapter 3 review.',
      createdAt: new Date().toISOString(),
    },
  ];

  private mockBookshelf: any[] = [
    {
      id: 'book-1',
      publicationId: 'c3be03dd-e3bc-4f81-a82a-fab2e6d44e51',
      userId: 'user-101',
      title: 'Quantum Computing Foundations for Distributed Systems',
      progressPercent: 75,
      addedAt: new Date().toISOString(),
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  async addToBookshelf(userId: string, publicationId: string) {
    const pub = await this.prisma.publication.findUnique({
      where: { id: publicationId },
    });

    const item = {
      id: `book-${Date.now()}`,
      publicationId,
      userId,
      title: pub?.title || 'Quantum Computing Foundations',
      progressPercent: 0,
      addedAt: new Date().toISOString(),
    };

    this.mockBookshelf.push(item);
    return item;
  }

  async getBookshelf(userId: string) {
    return this.mockBookshelf.filter((b) => b.userId === userId || userId === 'user-101');
  }

  async addAnnotation(dto: AddAnnotationDto) {
    const annotation = {
      id: `ann-${Date.now()}`,
      publicationId: dto.publicationId,
      userId: dto.userId,
      selectedText: dto.selectedText,
      color: dto.color,
      noteComment: dto.noteComment || '',
      createdAt: new Date().toISOString(),
    };

    this.mockAnnotations.push(annotation);
    return annotation;
  }

  async getAnnotations(publicationId: string, userId: string) {
    return this.mockAnnotations.filter((a) => a.publicationId === publicationId);
  }

  getResearchFeed(userId: string) {
    return [
      {
        id: 'feed-1',
        title: 'Topological Qubit Fabric Architectures for Fault-Tolerant Clusters',
        authors: 'Elena Rostova, Marcus Thorne',
        journal: 'PUBLISHORA Quantum Systems',
        matchScore: 98,
        reason: 'Recommended based on your interest in Quantum Error Correction',
        publishedAt: '2026-08-01',
      },
      {
        id: 'feed-2',
        title: 'Scalable Photonic Interconnects in Distributed Quantum Networks',
        authors: 'Kenji Sato, Liang Wei',
        journal: 'Physical Review Quantum',
        matchScore: 94,
        reason: 'Highly cited in your saved reading list',
        publishedAt: '2026-07-28',
      },
    ];
  }
}
