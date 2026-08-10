import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReviewRecommendation } from '@prisma/client';

export interface InviteReviewerDto {
  submissionId: string;
  reviewerId: string;
}

export interface SubmitReviewDto {
  reviewId: string;
  recommendation: ReviewRecommendation;
  commentsForAuthor?: string;
  commentsForEditor?: string;
}

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async inviteReviewer(dto: InviteReviewerDto) {
    const submission = await this.prisma.submission.findUnique({
      where: { id: dto.submissionId },
    });

    if (!submission) {
      throw new NotFoundException(`Submission ${dto.submissionId} not found`);
    }

    return this.prisma.review.create({
      data: {
        submissionId: dto.submissionId,
        reviewerId: dto.reviewerId,
      },
    });
  }

  async getReviewsForSubmission(submissionId: string) {
    return this.prisma.review.findMany({
      where: { submissionId },
      include: {
        reviewer: {
          select: { id: true, email: true },
        },
      },
    });
  }

  async submitReview(dto: SubmitReviewDto) {
    const review = await this.prisma.review.findUnique({
      where: { id: dto.reviewId },
    });

    if (!review) {
      throw new NotFoundException(`Review ${dto.reviewId} not found`);
    }

    return this.prisma.review.update({
      where: { id: dto.reviewId },
      data: {
        recommendation: dto.recommendation,
        commentsToAuthor: dto.commentsForAuthor || 'No comments provided for author.',
        commentsToEditor: dto.commentsForEditor || 'Confidential comments to editor.',
        submittedAt: new Date(),
      },
    });
  }
}
