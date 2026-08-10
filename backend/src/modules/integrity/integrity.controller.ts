import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { IntegrityService, IntegrityAuditDto } from './integrity.service';

@Controller('api/v1/integrity')
export class IntegrityController {
  constructor(private readonly integrityService: IntegrityService) {}

  @Post('audit')
  @HttpCode(HttpStatus.OK)
  async runAudit(@Body() dto: IntegrityAuditDto) {
    return this.integrityService.runAudit(dto);
  }
}
