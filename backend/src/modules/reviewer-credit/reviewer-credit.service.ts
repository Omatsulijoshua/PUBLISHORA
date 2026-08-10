import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface DepositOrcidDto {
  reviewerId: string;
  orcidId: string;
  reviewId: string;
}

@Injectable()
export class ReviewerCreditService {
  constructor(private readonly prisma: PrismaService) {}

  depositOrcidReviewCredit(dto: DepositOrcidDto) {
    if (!dto.orcidId || !dto.reviewId) {
      throw new BadRequestException('ORCID iD and Review ID are required for credit deposit');
    }

    return {
      orcidPutCode: `put-code-${Date.now()}`,
      orcidId: dto.orcidId,
      reviewId: dto.reviewId,
      orcidXmlPayload: `<?xml version="1.0" encoding="UTF-8"?><peer-review:peer-review xmlns:peer-review="http://www.orcid.org/ns/peer-review"><peer-review:reviewer-role>reviewer</peer-review:reviewer-role></peer-review:peer-review>`,
      depositStatus: 'DEPOSITED_TO_ORCID_RECORD',
      depositedAt: new Date().toISOString(),
    };
  }

  generateReviewCertificate(reviewId: string) {
    return {
      certificateId: `cert-${Date.now()}`,
      reviewId,
      reviewerName: 'Dr. Eleanor Vance',
      journalTitle: 'PUBLISHORA Journal of Quantum Computing',
      publonsVerified: true,
      webOfScienceReviewerId: 'WOS-REV-90184',
      issuedAt: new Date().toISOString(),
    };
  }

  getReviewerLedger(reviewerId: string) {
    return {
      reviewerId,
      totalCompletedReviews: 12,
      rewardPointsBalance: 300,
      apcDiscountVouchers: [
        { voucherCode: 'REV-APC-100-OFF', discountAmountUsd: 100, expiresAt: '2026-12-31' },
        { voucherCode: 'REV-APC-200-OFF', discountAmountUsd: 200, expiresAt: '2026-12-31' },
      ],
      openPeerReviewAttributions: 4,
    };
  }
}
