import { ReviewerCreditService } from './reviewer-credit.service';
import { BadRequestException } from '@nestjs/common';

describe('Phase 39 — Peer Reviewer Recognition & ORCID Credit Specs', () => {
  let service: ReviewerCreditService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {};
    service = new ReviewerCreditService(mockPrisma);
  });

  it('should deposit peer review activity credit to ORCID record', () => {
    const deposit = service.depositOrcidReviewCredit({
      reviewerId: 'user-101',
      orcidId: '0000-0002-1825-0097',
      reviewId: 'rev-901',
    });

    expect(deposit.orcidPutCode).toContain('put-code-');
    expect(deposit.orcidId).toBe('0000-0002-1825-0097');
    expect(deposit.orcidXmlPayload).toContain('peer-review:reviewer-role');
    expect(deposit.depositStatus).toBe('DEPOSITED_TO_ORCID_RECORD');
  });

  it('should throw BadRequestException when depositing ORCID credit without ORCID iD', () => {
    expect(() =>
      service.depositOrcidReviewCredit({ reviewerId: 'user-101', orcidId: '', reviewId: 'rev-901' }),
    ).toThrow(BadRequestException);
  });

  it('should generate Web of Science / Publons verified review certificate', () => {
    const cert = service.generateReviewCertificate('rev-901');

    expect(cert.certificateId).toContain('cert-');
    expect(cert.publonsVerified).toBe(true);
    expect(cert.webOfScienceReviewerId).toContain('WOS-REV-');
  });

  it('should return reviewer APC discount reward ledger and voucher balance', () => {
    const ledger = service.getReviewerLedger('user-101');

    expect(ledger.reviewerId).toBe('user-101');
    expect(ledger.totalCompletedReviews).toBeGreaterThan(0);
    expect(ledger.rewardPointsBalance).toBe(300);
    expect(ledger.apcDiscountVouchers.length).toBeGreaterThan(0);
  });
});
