import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface SetupPromotionProfileDto {
  userId: string;
  currentRank: string;
  targetRank: string;
  universityId?: string;
}

@Injectable()
export class PromotionService {
  constructor(private readonly prisma: PrismaService) {}

  async setupProfile(dto: SetupPromotionProfileDto) {
    const existing = await this.prisma.promotionProfile.findUnique({
      where: { userId: dto.userId },
    });

    if (existing) {
      return this.prisma.promotionProfile.update({
        where: { userId: dto.userId },
        data: {
          currentRank: dto.currentRank,
          targetRank: dto.targetRank,
          universityId: dto.universityId,
        },
      });
    }

    return this.prisma.promotionProfile.create({
      data: {
        userId: dto.userId,
        currentRank: dto.currentRank,
        targetRank: dto.targetRank,
        universityId: dto.universityId,
      },
    });
  }

  async getTenureDossier(userId: string) {
    const profile = await this.prisma.promotionProfile.findUnique({
      where: { userId },
    });

    const publications = await this.prisma.publicationAuthor.findMany({
      where: { userId },
      include: {
        publication: {
          include: { publicationType: true, identifiers: true },
        },
      },
    });

    const reviews = await this.prisma.review.findMany({
      where: { reviewerId: userId },
    });

    // Calculate Credit Allocation breakdown
    let totalCredit = 0;
    let firstAuthorCount = 0;
    let correspondingCount = 0;
    let coAuthorCount = 0;

    publications.forEach((pa) => {
      if (pa.authorOrder === 1) {
        firstAuthorCount++;
        totalCredit += 40;
      } else if (pa.isCorresponding) {
        correspondingCount++;
        totalCredit += 30;
      } else {
        coAuthorCount++;
        totalCredit += 10;
      }
    });

    return {
      userId,
      profile: profile || {
        currentRank: 'Senior Lecturer / Assistant Professor',
        targetRank: 'Associate Professor',
        universityId: 'univ-mit-cs',
      },
      summary: {
        totalPublications: publications.length,
        firstAuthorCount,
        correspondingCount,
        coAuthorCount,
        totalPeerReviewsCompleted: reviews.length,
        totalCalculatedCreditScore: totalCredit,
        dossierReadinessScore: Math.min(Math.round((totalCredit / 150) * 100), 100),
      },
      publications: publications.map((pa) => ({
        id: pa.publication.id,
        title: pa.publication.title,
        type: pa.publication.publicationType.name,
        role: pa.authorOrder === 1 ? 'First Author' : pa.isCorresponding ? 'Corresponding Author' : 'Co-Author',
        creditScore: pa.authorOrder === 1 ? 40 : pa.isCorresponding ? 30 : 10,
        publishedYear: new Date(pa.publication.createdAt).getFullYear(),
      })),
      peerReviewContributions: reviews.length,
      generatedAt: new Date().toISOString(),
    };
  }
}
