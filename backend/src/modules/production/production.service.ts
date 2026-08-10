import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateProductionJobDto {
  submissionId: string;
  pdfUrl?: string;
  epubUrl?: string;
}

@Injectable()
export class ProductionService {
  constructor(private readonly prisma: PrismaService) {}

  async createProductionJob(dto: CreateProductionJobDto) {
    const submission = await this.prisma.submission.findUnique({
      where: { id: dto.submissionId },
    });

    if (!submission) {
      throw new NotFoundException(`Submission ${dto.submissionId} not found`);
    }

    return this.prisma.productionJob.create({
      data: {
        submissionId: dto.submissionId,
        status: 'TYPESETTING',
        pdfUrl: dto.pdfUrl,
        epubUrl: dto.epubUrl,
      },
    });
  }

  async getProductionStatus(submissionId: string) {
    return this.prisma.productionJob.findMany({
      where: { submissionId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async advanceStatus(jobId: string, status: string) {
    return this.prisma.productionJob.update({
      where: { id: jobId },
      data: { status },
    });
  }
}
