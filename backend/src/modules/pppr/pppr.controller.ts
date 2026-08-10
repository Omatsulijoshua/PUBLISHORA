import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { PpprService, SubmitPpprReviewDto, PostAuthorResponseDto, SubmitReplicationReportDto } from './pppr.service';

@Controller('api/v1/pppr')
export class PpprController {
  constructor(private readonly ppprService: PpprService) {}

  @Post('reviews')
  async submitReview(@Body() dto: SubmitPpprReviewDto) {
    return this.ppprService.submitReview(dto);
  }

  @Get('publication/:pubId')
  async getPublicationReviews(@Param('pubId') pubId: string) {
    return this.ppprService.getPublicationReviews(pubId);
  }

  @Post('responses')
  async postAuthorResponse(@Body() dto: PostAuthorResponseDto) {
    return this.ppprService.postAuthorResponse(dto);
  }

  @Post('replication-reports')
  async submitReplicationReport(@Body() dto: SubmitReplicationReportDto) {
    return this.ppprService.submitReplicationReport(dto);
  }
}
