import { AiRouterService } from './ai-router.service';

describe('AiRouterService Specs', () => {
  let service: AiRouterService;

  beforeEach(() => {
    service = new AiRouterService();
  });

  it('should parse comma-separated API keys into key pools', () => {
    const config = service.updateConfig({
      strategy: 'ROUND_ROBIN',
      providerPriorities: ['GROQ', 'GEMINI'],
      groqKeys: 'gsk_key1, gsk_key2, gsk_key3',
      geminiKeys: 'AIzaSy_key1, AIzaSy_key2',
    });

    const groqPool = config.keyPools.find((p) => p.provider === 'GROQ');
    expect(groqPool.totalKeysCount).toBe(3);
    expect(groqPool.keys[0].key).toBe('gsk_key1');
    expect(groqPool.keys[1].key).toBe('gsk_key2');
    expect(groqPool.keys[2].key).toBe('gsk_key3');
  });

  it('should rotate keys sequentially in ROUND_ROBIN strategy', () => {
    service.updateConfig({
      strategy: 'ROUND_ROBIN',
      providerPriorities: ['GROQ'],
      groqKeys: 'key_alpha, key_beta',
    });

    const req1 = service.routeRequest('GROQ');
    const req2 = service.routeRequest('GROQ');

    expect(req1.selectedKey).toBe('key_alpha');
    expect(req2.selectedKey).toBe('key_beta');
  });

  it('should fail over to secondary key when primary key encounters rate limit (429)', () => {
    service.updateConfig({
      strategy: 'PRIORITY_FAILOVER',
      providerPriorities: ['GROQ'],
      groqKeys: 'key_primary_long_string_12345, key_secondary_long_string_67890',
    });

    const failover = service.simulateRateLimitFailover('GROQ', 0);
    expect(failover.event).toBe('RATE_LIMIT_TRIGGERED_AUTOMATIC_FAILOVER');
    expect(failover.failoverServedKey).toBeDefined();
    expect(failover.status).toContain('SUCCESSFULLY_FAILED_OVER');
  });
});
