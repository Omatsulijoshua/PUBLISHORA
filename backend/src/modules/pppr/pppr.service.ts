import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface SubmitPpprReviewDto {
  publicationId: string;
  reviewerName: string;
  orcidId: string;
  affiliation: string;
  title: string;
  comment: string;
}

export interface PostAuthorResponseDto {
  reviewId: string;
  authorName: string;
  responseContent: string;
}

export interface SubmitReplicationReportDto {
  publicationId: string;
  labName: string;
  leadResearcher: string;
  replicationResult: 'REPLICATED_SUCCESSFULLY' | 'PARTIAL_REPLICATION' | 'FAILED_TO_REPLICATE';
  notes: string;
}

@Injectable()
export class PpprService {
  private mockPppr: any[] = [
    {
      id: 'pppr-101',
      publicationId: 'c3be03dd-e3bc-4f81-a82a-fab2e6d44e51',
      reviewerName: 'Dr. Niels Bohr',
      orcidId: '0000-0002-1825-0097',
      affiliation: 'Copenhagen Institute for Advanced Study',
      title: 'Clarification on Equation 12 Decoherence Rate',
      comment: 'The transmon qubit coherence time in Equation 12 holds under thermal noise below 15 mK, but non-Markovian noise may alter the asymptotic limit.',
      createdAt: new Date().toISOString(),
      authorResponses: [
        {
          authorName: 'Dr. Ada Lovelace',
          responseContent: 'We thank Dr. Bohr for pointing this out. We have added a Supplementary Note demonstrating that non-Markovian memory effects remain bounded within 0.02%.',
          createdAt: new Date().toISOString(),
        },
      ],
      replicationReports: [
        {
          labName: 'Stanford Quantum Photonics Lab',
          leadResearcher: 'Dr. Elena Rostova',
          replicationResult: 'REPLICATED_SUCCESSFULLY',
          notes: 'Independently reproduced 99.4% two-qubit gate fidelity using transmon testbed.',
          createdAt: new Date().toISOString(),
        },
      ],
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  async submitReview(dto: SubmitPpprReviewDto) {
    const review = {
      id: `pppr-${Date.now()}`,
      publicationId: dto.publicationId,
      reviewerName: dto.reviewerName,
      orcidId: dto.orcidId,
      affiliation: dto.affiliation,
      title: dto.title,
      comment: dto.comment,
      createdAt: new Date().toISOString(),
      authorResponses: [],
      replicationReports: [],
    };

    this.mockPppr.push(review);
    return review;
  }

  async getPublicationReviews(pubId: string) {
    const reviews = this.mockPppr.filter((r) => r.publicationId === pubId || pubId === 'c3be03dd-e3bc-4f81-a82a-fab2e6d44e51');
    return reviews;
  }

  async postAuthorResponse(dto: PostAuthorResponseDto) {
    const review = this.mockPppr.find((r) => r.id === dto.reviewId || dto.reviewId === 'pppr-101');
    if (!review) {
      throw new NotFoundException(`PPPR Review ${dto.reviewId} not found`);
    }

    const resp = {
      authorName: dto.authorName,
      responseContent: dto.responseContent,
      createdAt: new Date().toISOString(),
    };

    review.authorResponses.push(resp);
    return resp;
  }

  async submitReplicationReport(dto: SubmitReplicationReportDto) {
    const review = this.mockPppr.find((r) => r.publicationId === dto.publicationId || dto.publicationId === 'c3be03dd-e3bc-4f81-a82a-fab2e6d44e51');
    if (!review) {
      throw new NotFoundException(`Publication ${dto.publicationId} not found for PPPR replication report`);
    }

    const report = {
      labName: dto.labName,
      leadResearcher: dto.leadResearcher,
      replicationResult: dto.replicationResult,
      notes: dto.notes,
      createdAt: new Date().toISOString(),
    };

    review.replicationReports.push(report);
    return report;
  }
}
