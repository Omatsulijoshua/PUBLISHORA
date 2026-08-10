import { Controller, Get, Param } from '@nestjs/common';
import { JournalMetricsService } from './journal-metrics.service';

@Controller('api/v1/journal-metrics')
export class JournalMetricsController {
  constructor(private readonly journalMetricsService: JournalMetricsService) {}

  @Get(':journalId')
  getJournalMetrics(@Param('journalId') journalId: string) {
    return this.journalMetricsService.getJournalMetrics(journalId);
  }

  @Get('altmetric/:pubId')
  getAltmetricScore(@Param('pubId') pubId: string) {
    return this.journalMetricsService.getAltmetricScore(pubId);
  }

  @Get('fwci/:pubId')
  getFwciScore(@Param('pubId') pubId: string) {
    return this.journalMetricsService.getFwciScore(pubId);
  }
}
