import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateSubscriptionDto {
  institutionName: string;
  tier: 'INDIVIDUAL' | 'UNIVERSITY_BUNDLE' | 'ENTERPRISE_TRANSFORMATIVE';
  currency: string;
}

export interface ValidateCouponDto {
  code: string;
  originalApcAmount: number;
}

export interface RequestPayoutDto {
  authorId: string;
  amount: number;
  paymentMethod: 'STRIPE_CONNECT' | 'WIRE_TRANSFER';
}

@Injectable()
export class BillingService {
  private mockCoupons: Record<string, number> = {
    PLAN_S_WAIVER_100: 100, // 100% waiver
    LOW_INCOME_50: 50, // 50% discount
    PUBLISHORA2026: 20, // 20% promotional discount
  };

  private mockRoyalties: any[] = [
    {
      authorId: 'user-101',
      authorName: 'Dr. Ada Lovelace',
      totalEarned: 1420.00,
      currency: 'USD',
      payoutHistory: [
        { id: 'pay-1', amount: 500.00, date: '2026-07-15', status: 'COMPLETED', method: 'STRIPE_CONNECT' },
      ],
      pendingBalance: 920.00,
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  async createSubscription(dto: CreateSubscriptionDto) {
    const prices = {
      INDIVIDUAL: 199.00,
      UNIVERSITY_BUNDLE: 4999.00,
      ENTERPRISE_TRANSFORMATIVE: 14999.00,
    };

    const price = prices[dto.tier] || 199.00;

    return {
      id: `sub-${Date.now()}`,
      institutionName: dto.institutionName,
      tier: dto.tier,
      price,
      currency: dto.currency || 'USD',
      status: 'ACTIVE',
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  async validateCoupon(dto: ValidateCouponDto) {
    const discountPercent = this.mockCoupons[dto.code.toUpperCase()];
    if (discountPercent === undefined) {
      throw new BadRequestException(`Invalid or expired coupon code: ${dto.code}`);
    }

    const discountAmount = (dto.originalApcAmount * discountPercent) / 100;
    const finalAmount = dto.originalApcAmount - discountAmount;

    return {
      code: dto.code,
      discountPercent,
      originalAmount: dto.originalApcAmount,
      discountAmount,
      finalAmount,
      currency: 'USD',
    };
  }

  async getAuthorRoyalties(authorId: string) {
    const royalty = this.mockRoyalties.find((r) => r.authorId === authorId || authorId === 'user-101');
    if (!royalty) {
      throw new NotFoundException(`Royalty record for author ${authorId} not found`);
    }
    return royalty;
  }

  async requestPayout(dto: RequestPayoutDto) {
    const royalty = await this.getAuthorRoyalties(dto.authorId);
    if (dto.amount > royalty.pendingBalance) {
      throw new BadRequestException(`Requested payout ${dto.amount} exceeds pending balance ${royalty.pendingBalance}`);
    }

    royalty.pendingBalance -= dto.amount;
    const payout = {
      id: `pay-${Date.now()}`,
      amount: dto.amount,
      date: new Date().toISOString(),
      status: 'PROCESSING',
      method: dto.paymentMethod,
    };

    royalty.payoutHistory.push(payout);
    return payout;
  }
}
