import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { OfflineService, SyncQueueDto } from './offline.service';

@Controller('api/v1/offline')
export class OfflineController {
  constructor(private readonly offlineService: OfflineService) {}

  @Get('manifest.json')
  getPwaManifest() {
    return this.offlineService.getPwaManifest();
  }

  @Post('sync-queue')
  async processSyncQueue(@Body() dto: SyncQueueDto) {
    return this.offlineService.processSyncQueue(dto);
  }

  @Get('bandwidth-status')
  getBandwidthStatus(@Query('type') type: string) {
    return this.offlineService.getBandwidthStatus(type || '4g');
  }
}
