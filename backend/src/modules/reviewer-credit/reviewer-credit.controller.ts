import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ReviewerCreditService, DepositOrcidDto } from './reviewer-credit.service';

@Controller('api/v1/reviewer-credit')
export class ReviewerCreditController {
  constructor(private readonly reviewerCreditService: ReviewerCreditService) {}

  @Post('orcid/deposit')
  depositOrcidReviewCredit(@Body() dto: DepositOrcidDto) {
    return this.reviewerCreditService.depositOrcidReviewCredit(dto);
  }

  @Get('certificate/:reviewId')
  generateReviewCertificate(@Param('reviewId') reviewId: string) {
    return this.reviewerCreditService.generateReviewCertificate(reviewId);
  }

  @Get('ledger/:reviewerId')
  getReviewerLedger(@Param('reviewerId') reviewerId: string) {
    return this.reviewerCreditService.getReviewerLedger(reviewerId);
  }
}
