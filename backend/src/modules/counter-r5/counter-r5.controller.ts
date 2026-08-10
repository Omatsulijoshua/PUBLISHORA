import { Controller, Get, Query, Param } from '@nestjs/common';
import { CounterR5Service } from './counter-r5.service';

@Controller('api/v1')
export class CounterR5Controller {
  constructor(private readonly counterR5Service: CounterR5Service) {}

  @Get('sushi/r5/reports/tr_j1')
  getSushiTrJ1Report(@Query('begin_date') beginDate: string, @Query('end_date') endDate: string) {
    return this.counterR5Service.getSushiTrJ1Report(beginDate, endDate);
  }

  @Get('counter-r5/geo-heatmap')
  getGeoHeatmap() {
    return this.counterR5Service.getGeoHeatmap();
  }

  @Get('counter-r5/cpd-metrics/:institutionId')
  getCpdMetrics(@Param('institutionId') institutionId: string) {
    return this.counterR5Service.getCpdMetrics(institutionId);
  }
}
