import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateApiKeyDto {
  label: string;
  rateLimitPerHour: number;
}

export interface RegisterWebhookDto {
  targetUrl: string;
  subscribedEvents: string[];
}

@Injectable()
export class DevelopersService {
  private mockApiKeys: any[] = [
    {
      id: 'key-101',
      label: 'Production University Press Integration',
      keyPrefix: 'pub_live_9f8a',
      apiKeySecret: 'pub_live_9f8a10c9b2d3e4f5a6b7c8d9e0f1a2b3',
      rateLimitPerHour: 10000,
      requestsUsedCurrentHour: 1420,
      createdAt: new Date().toISOString(),
    },
  ];

  private mockWebhooks: any[] = [
    {
      id: 'wh-101',
      targetUrl: 'https://press.mit.edu/api/webhooks/publishora',
      subscribedEvents: ['publication.published', 'pppr.review_created', 'doi.minted'],
      secret: 'whsec_7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  async createApiKey(dto: CreateApiKeyDto) {
    const rawSecret = `pub_live_${crypto.randomBytes(16).toString('hex')}`;

    const key = {
      id: `key-${Date.now()}`,
      label: dto.label,
      keyPrefix: rawSecret.substring(0, 12),
      apiKeySecret: rawSecret,
      rateLimitPerHour: dto.rateLimitPerHour || 10000,
      requestsUsedCurrentHour: 0,
      createdAt: new Date().toISOString(),
    };

    this.mockApiKeys.push(key);
    return key;
  }

  async getApiKeys() {
    return {
      total: this.mockApiKeys.length,
      apiKeys: this.mockApiKeys,
    };
  }

  async registerWebhook(dto: RegisterWebhookDto) {
    if (!dto.targetUrl || !dto.targetUrl.startsWith('http')) {
      throw new BadRequestException('Target URL must be a valid HTTP/HTTPS endpoint');
    }

    const secret = `whsec_${crypto.randomBytes(16).toString('hex')}`;
    const webhook = {
      id: `wh-${Date.now()}`,
      targetUrl: dto.targetUrl,
      subscribedEvents: dto.subscribedEvents || ['publication.published'],
      secret,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    this.mockWebhooks.push(webhook);
    return webhook;
  }

  getWebhooks() {
    return {
      total: this.mockWebhooks.length,
      webhooks: this.mockWebhooks,
    };
  }

  dispatchTestWebhook(webhookId: string) {
    const wh = this.mockWebhooks.find((w) => w.id === webhookId || webhookId === 'wh-101') || this.mockWebhooks[0];
    const payload = JSON.stringify({
      event: 'publication.published',
      timestamp: new Date().toISOString(),
      data: {
        id: 'c3be03dd-e3bc-4f81-a82a-fab2e6d44e51',
        doi: '10.5555/publishora.2026.001',
        title: 'Quantum Computing Foundations for Distributed Systems',
      },
    });

    const signature = crypto.createHmac('sha256', wh.secret).update(payload).digest('hex');

    return {
      webhookId: wh.id,
      targetUrl: wh.targetUrl,
      signatureHeader: `sha256=${signature}`,
      payload: JSON.parse(payload),
      responseStatus: 200,
      deliveredAt: new Date().toISOString(),
    };
  }
}
