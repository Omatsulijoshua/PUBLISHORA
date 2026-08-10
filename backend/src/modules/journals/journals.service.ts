import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateJournalDto {
  name: string;
  issn?: string;
  description?: string;
  aimsAndScope?: string;
  openAccessPolicy?: string;
  publisherName?: string;
}

@Injectable()
export class JournalsService {
  constructor(private readonly prisma: PrismaService) {}

  async createJournal(dto: CreateJournalDto) {
    return this.prisma.journal.create({
      data: {
        name: dto.name,
        issn: dto.issn,
        description: dto.description,
        aimsAndScope: dto.aimsAndScope,
        openAccessPolicy: dto.openAccessPolicy || 'Gold Open Access',
        publisherName: dto.publisherName || 'PUBLISHORA Academic Press',
      },
    });
  }

  async findAllJournals() {
    return this.prisma.journal.findMany({
      include: {
        submissions: { take: 5 },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findJournalById(id: string) {
    const journal = await this.prisma.journal.findUnique({
      where: { id },
      include: {
        submissions: true,
      },
    });

    if (!journal) {
      throw new NotFoundException(`Journal ${id} not found`);
    }

    return journal;
  }
}
