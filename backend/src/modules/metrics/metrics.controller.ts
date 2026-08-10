import { Controller, Get, Param } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Controller('api/v1/metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('publication/:pubId')
  async getPublicationMetrics(@Param('pubId') pubId: string) {
    return this.metricsService.getPublicationMetrics(pubId);
  }

  @Get('graph/:pubId')
  async getCitationGraph(@Param('pubId') pubId: string) {
    return this.metricsService.getCitationGraph(pubId);
  }

  @Get('journal/:journalId')
  async getJournalMetrics(@Param('journalId') journalId: string) {
    return this.metricsService.getJournalMetrics(journalId);
  }
}
