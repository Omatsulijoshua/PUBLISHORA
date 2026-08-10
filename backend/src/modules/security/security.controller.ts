import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { SecurityService, RecordAuditLogDto } from './security.service';

@Controller('api/v1/security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Post('audit-logs')
  async recordAuditLog(@Body() dto: RecordAuditLogDto) {
    return this.securityService.recordAuditLog(dto);
  }

  @Get('audit-logs')
  async getAuditLogs() {
    return this.securityService.getAuditLogs();
  }

  @Post('gdpr-export')
  async exportGdprData(@Body('userId') userId: string) {
    return this.securityService.exportGdprData(userId || 'user-101');
  }

  @Get('soc2-evidence')
  getSoc2ComplianceStatus() {
    return this.securityService.getSoc2ComplianceStatus();
  }
}
