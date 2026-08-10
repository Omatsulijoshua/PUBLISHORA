import { Controller, Post, Get, Body, Param, Header } from '@nestjs/common';
import { DatasetsService, DepositDatasetDto, ParseCffDto } from './datasets.service';

@Controller('api/v1/datasets')
export class DatasetsController {
  constructor(private readonly datasetsService: DatasetsService) {}

  @Post()
  async depositDataset(@Body() dto: DepositDatasetDto) {
    return this.datasetsService.depositDataset(dto);
  }

  @Get()
  async getDatasets() {
    return this.datasetsService.getDatasets();
  }

  @Get(':id')
  async getDatasetById(@Param('id') id: string) {
    return this.datasetsService.getDatasetById(id);
  }

  @Post('parse-cff')
  parseCff(@Body() dto: ParseCffDto) {
    return this.datasetsService.parseCff(dto.cffContent);
  }

  @Get(':id/datacite-xml')
  @Header('Content-Type', 'application/xml')
  getDataCiteXml(@Param('id') id: string) {
    return this.datasetsService.getDataCiteXml(id);
  }
}
