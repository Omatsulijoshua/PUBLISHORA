import { BillingService } from './billing.service';
import { BadRequestException } from '@nestjs/common';

describe('Phase 27 — Billing, Subscriptions & Royalties Specs', () => {
  let service: BillingService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {};
    service = new BillingService(mockPrisma);
  });

  it('should create institutional subscription tier', async () => {
    const sub = await service.createSubscription({
      institutionName: 'MIT University Libraries',
      tier: 'UNIVERSITY_BUNDLE',
      currency: 'USD',
    });

    expect(sub.id).toContain('sub-');
    expect(sub.price).toBe(4999.00);
    expect(sub.status).toBe('ACTIVE');
  });

  it('should validate 100% Plan S APC waiver coupon', async () => {
    const coupon = await service.validateCoupon({
      code: 'PLAN_S_WAIVER_100',
      originalApcAmount: 1800,
    });

    expect(coupon.discountPercent).toBe(100);
    expect(coupon.finalAmount).toBe(0);
  });

  it('should throw BadRequestException on invalid coupon code', async () => {
    await expect(
      service.validateCoupon({ code: 'INVALID_CODE', originalApcAmount: 1800 }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should return author royalty earnings and process valid payout request', async () => {
    const royalty = await service.getAuthorRoyalties('user-101');
    expect(royalty.totalEarned).toBe(1420.00);

    const payout = await service.requestPayout({
      authorId: 'user-101',
      amount: 400.00,
      paymentMethod: 'STRIPE_CONNECT',
    });

    expect(payout.amount).toBe(400.00);
    expect(payout.status).toBe('PROCESSING');
  });
});
