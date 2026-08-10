import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ProductionService, CreateProductionJobDto } from './production.service';

@Controller('api/v1/production')
export class ProductionController {
  constructor(private readonly productionService: ProductionService) {}

  @Post('jobs')
  async createProductionJob(@Body() dto: CreateProductionJobDto) {
    return this.productionService.createProductionJob(dto);
  }

  @Get('submission/:subId')
  async getProductionStatus(@Param('subId') subId: string) {
    return this.productionService.getProductionStatus(subId);
  }

  @Post('jobs/:id/status')
  async advanceStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.productionService.advanceStatus(id, body.status);
  }
}
