import { Controller, Post, Get, Body } from '@nestjs/common';
import { PerformanceService, PurgeCdnDto } from './performance.service';

@Controller('api/v1/performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Post('cdn-purge')
  purgeCdnCache(@Body() dto: PurgeCdnDto) {
    return this.performanceService.purgeCdnCache(dto);
  }

  @Get('cache-stats')
  getCacheStats() {
    return this.performanceService.getCacheStats();
  }

  @Get('web-vitals')
  getWebVitals() {
    return this.performanceService.getWebVitals();
  }
}
