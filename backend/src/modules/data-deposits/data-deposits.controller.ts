import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { DataDepositsService, CreateDepositDto } from './data-deposits.service';

@Controller('api/v1/data-deposits')
export class DataDepositsController {
  constructor(private readonly dataDepositsService: DataDepositsService) {}

  @Post('deposit')
  createDeposit(@Body() dto: CreateDepositDto) {
    return this.dataDepositsService.createDeposit(dto);
  }

  @Post('fair-audit')
  performFairAudit(@Body('datasetId') datasetId: string) {
    return this.dataDepositsService.performFairAudit(datasetId || 'ds-101');
  }

  @Get('datacite-xml/:datasetId')
  generateDataCiteXml(@Param('datasetId') datasetId: string) {
    return this.dataDepositsService.generateDataCiteXml(datasetId);
  }
}
