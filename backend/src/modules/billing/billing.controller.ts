import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { BillingService, CreateSubscriptionDto, ValidateCouponDto, RequestPayoutDto } from './billing.service';

@Controller('api/v1/billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('subscriptions')
  async createSubscription(@Body() dto: CreateSubscriptionDto) {
    return this.billingService.createSubscription(dto);
  }

  @Post('coupons/validate')
  async validateCoupon(@Body() dto: ValidateCouponDto) {
    return this.billingService.validateCoupon(dto);
  }

  @Get('royalties/:authorId')
  async getAuthorRoyalties(@Param('authorId') authorId: string) {
    return this.billingService.getAuthorRoyalties(authorId);
  }

  @Post('payouts')
  async requestPayout(@Body() dto: RequestPayoutDto) {
    return this.billingService.requestPayout(dto);
  }
}
