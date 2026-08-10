import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { AnalyticsService, CreateReportScheduleDto } from './analytics.service';

@Controller('api/v1/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('counter-r5')
  getCounterR5Report(@Query('type') type: 'JR1' | 'BR2' | 'PR1') {
    return this.analyticsService.getCounterR5Report(type || 'JR1');
  }

  @Get('readership')
  getReadershipBreakdown() {
    return this.analyticsService.getReadershipBreakdown();
  }

  @Get('editorial-throughput')
  getEditorialThroughput() {
    return this.analyticsService.getEditorialThroughput();
  }

  @Post('schedules')
  async createReportSchedule(@Body() dto: CreateReportScheduleDto) {
    return this.analyticsService.createReportSchedule(dto);
  }
}
