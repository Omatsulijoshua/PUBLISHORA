import { Controller, Post, Body, HttpCode, HttpStatus, Get, Param } from '@nestjs/common';
import { ExportService, GenerateExportDto } from './export.service';

@Controller('api/v1/export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  async generateExport(@Body() dto: GenerateExportDto) {
    return this.exportService.generateExport(dto);
  }
}
