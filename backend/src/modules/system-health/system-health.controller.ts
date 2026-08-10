import { Controller, Get } from '@nestjs/common';
import { SystemHealthService } from './system-health.service';

@Controller('api/v1/system-health')
export class SystemHealthController {
  constructor(private readonly systemHealthService: SystemHealthService) {}

  @Get('audit')
  auditSystemHealth() {
    return this.systemHealthService.auditSystemHealth();
  }

  @Get('mode-matrix')
  getModeMatrix() {
    return this.systemHealthService.getModeMatrix();
  }

  @Get('launch-certificate')
  generateLaunchCertificate() {
    return this.systemHealthService.generateLaunchCertificate();
  }
}
