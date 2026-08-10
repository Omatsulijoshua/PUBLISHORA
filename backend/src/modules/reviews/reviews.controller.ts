import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ReviewsService, InviteReviewerDto, SubmitReviewDto } from './reviews.service';

@Controller('api/v1/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('invite')
  async inviteReviewer(@Body() dto: InviteReviewerDto) {
    return this.reviewsService.inviteReviewer(dto);
  }

  @Get('submission/:subId')
  async getReviewsForSubmission(@Param('subId') subId: string) {
    return this.reviewsService.getReviewsForSubmission(subId);
  }

  @Post('submit')
  @HttpCode(HttpStatus.OK)
  async submitReview(@Body() dto: SubmitReviewDto) {
    return this.reviewsService.submitReview(dto);
  }
}
