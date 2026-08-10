import { DevelopersService } from './developers.service';
import { BadRequestException } from '@nestjs/common';

describe('Phase 32 — Third-Party Integrations & Webhooks Specs', () => {
  let service: DevelopersService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {};
    service = new DevelopersService(mockPrisma);
  });

  it('should create new developer API key credentials with rate limits', async () => {
    const key = await service.createApiKey({
      label: 'Staging Integration Key',
      rateLimitPerHour: 5000,
    });

    expect(key.id).toContain('key-');
    expect(key.apiKeySecret).toContain('pub_live_');
    expect(key.rateLimitPerHour).toBe(5000);
  });

  it('should register webhook URL and generate HMAC-SHA256 signing secret', async () => {
    const wh = await service.registerWebhook({
      targetUrl: 'https://journals.cambridge.org/webhooks',
      subscribedEvents: ['publication.published', 'doi.minted'],
    });

    expect(wh.id).toContain('wh-');
    expect(wh.secret).toContain('whsec_');
    expect(wh.status).toBe('ACTIVE');
  });

  it('should throw BadRequestException when registering invalid webhook URL', async () => {
    await expect(
      service.registerWebhook({ targetUrl: 'invalid-url', subscribedEvents: [] }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should dispatch test webhook and include HMAC-SHA256 signature header', () => {
    const testDelivery = service.dispatchTestWebhook('wh-101');

    expect(testDelivery.signatureHeader).toContain('sha256=');
    expect(testDelivery.signatureHeader.length).toBeGreaterThan(64);
    expect(testDelivery.responseStatus).toBe(200);
  });
});
