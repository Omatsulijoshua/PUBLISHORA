import { Controller, Post, Get, Body } from '@nestjs/common';
import { DisasterRecoveryService, CreateSnapshotDto, FailoverDto } from './disaster-recovery.service';

@Controller('api/v1/disaster-recovery')
export class DisasterRecoveryController {
  constructor(private readonly drService: DisasterRecoveryService) {}

  @Post('snapshots')
  async createSnapshot(@Body() dto: CreateSnapshotDto) {
    return this.drService.createSnapshot(dto);
  }

  @Get('snapshots')
  async getSnapshots() {
    return this.drService.getSnapshots();
  }

  @Get('health')
  getClusterHealthStatus() {
    return this.drService.getClusterHealthStatus();
  }

  @Post('failover')
  async initiateFailover(@Body() dto: FailoverDto) {
    return this.drService.initiateFailover(dto);
  }
}
