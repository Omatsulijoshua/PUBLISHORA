import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateSubmissionDto {
  publicationId: string;
  journalId?: string;
  submitterId: string;
  coverLetter?: string;
}

export type DeskScreeningDecision = 'SEND_FOR_REVIEW' | 'DESK_REJECT' | 'REQUEST_REVISION';

export interface ScreenSubmissionDto {
  submissionId: string;
  editorId: string;
  decision: DeskScreeningDecision;
  comments?: string;
}

@Injectable()
export class SubmissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createSubmission(dto: CreateSubmissionDto) {
    const pub = await this.prisma.publication.findUnique({
      where: { id: dto.publicationId },
    });

    if (!pub) {
      throw new NotFoundException(`Publication ${dto.publicationId} not found`);
    }

    const count = await this.prisma.submission.count();
    const submissionNum = `SUB-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const submission = await this.prisma.submission.create({
      data: {
        submissionNum,
        publicationId: dto.publicationId,
        journalId: dto.journalId,
        submitterId: dto.submitterId,
        coverLetter: dto.coverLetter || 'Initial submission cover letter.',
        status: 'SUBMITTED',
      },
    });

    // Update Publication status to SUBMITTED
    await this.prisma.publication.update({
      where: { id: dto.publicationId },
      data: { status: 'SUBMITTED' },
    });

    return submission;
  }

  async getIntakeQueue() {
    return this.prisma.submission.findMany({
      where: { status: { in: ['SUBMITTED', 'EDITORIAL_SCREENING'] } },
      include: {
        publication: {
          include: { authors: true, publicationType: true },
        },
        journal: true,
        submitter: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async screenSubmission(dto: ScreenSubmissionDto) {
    const submission = await this.prisma.submission.findUnique({
      where: { id: dto.submissionId },
    });

    if (!submission) {
      throw new NotFoundException(`Submission ${dto.submissionId} not found`);
    }

    let newStatus: 'IN_REVIEW' | 'REJECTED' | 'DRAFT' = 'IN_REVIEW';
    if (dto.decision === 'DESK_REJECT') newStatus = 'REJECTED';
    if (dto.decision === 'REQUEST_REVISION') newStatus = 'DRAFT';

    const updatedSubmission = await this.prisma.submission.update({
      where: { id: dto.submissionId },
      data: { status: newStatus as any },
    });

    await this.prisma.publication.update({
      where: { id: submission.publicationId },
      data: { status: newStatus as any },
    });

    // Assign editor
    await this.prisma.editorialAssignment.create({
      data: {
        submissionId: dto.submissionId,
        editorId: dto.editorId,
      },
    });

    return {
      submissionId: dto.submissionId,
      decision: dto.decision,
      newStatus,
      comments: dto.comments || 'Screening complete.',
      timestamp: new Date().toISOString(),
    };
  }
}
