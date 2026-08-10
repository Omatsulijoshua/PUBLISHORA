import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('api/v1/health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async checkHealth() {
    let dbStatus = 'OFFLINE';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbStatus = 'ONLINE';
    } catch (err) {
      dbStatus = 'ERROR';
    }

    return {
      status: 'OK',
      platform: 'PUBLISHORA Global Platform',
      version: '1.0.0',
      phase: 'PHASE_1_BRAND_AND_ARCHITECTURE',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      supportedModes: ['PUBLISHING_MODE', 'PREPARATION_MODE'],
    };
  }
}
