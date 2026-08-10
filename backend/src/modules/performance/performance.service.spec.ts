import { PerformanceService } from './performance.service';
import { BadRequestException } from '@nestjs/common';

describe('Phase 33 — Performance Optimization & Edge CDN Specs', () => {
  let service: PerformanceService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {};
    service = new PerformanceService(mockPrisma);
  });

  it('should purge CDN cache by surrogate key and return invalidated edge node count', () => {
    const purge = service.purgeCdnCache({ surrogateKey: 'publication-101' });

    expect(purge.purgeId).toContain('purge-');
    expect(purge.surrogateKey).toBe('publication-101');
    expect(purge.edgeNodesInvalidated).toBeGreaterThan(0);
    expect(purge.status).toBe('PURGED_SUCCESSFULLY');
  });

  it('should throw BadRequestException when purging without surrogateKey or urlPath', () => {
    expect(() => service.purgeCdnCache({})).toThrow(BadRequestException);
  });

  it('should return multi-tier Redis cache statistics and Brotli compression ratios', () => {
    const cache = service.getCacheStats();

    expect(cache.overallHitRatePercent).toBeGreaterThan(90);
    expect(cache.l3EdgeCdnHitRatePercent).toBeGreaterThan(95);
    expect(cache.brotliCompressionRatio).toContain('78.5%');
  });

  it('should return passing Core Web Vitals benchmark metrics', () => {
    const vitals = service.getWebVitals();

    expect(vitals.largestContentfulPaintMs).toBeLessThan(1200);
    expect(vitals.firstInputDelayMs).toBeLessThan(50);
    expect(vitals.cumulativeLayoutShift).toBeLessThan(0.05);
    expect(vitals.overallScore).toContain('EXCELLENT');
  });
});
