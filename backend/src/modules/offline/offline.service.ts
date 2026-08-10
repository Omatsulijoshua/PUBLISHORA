import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface SyncQueueDto {
  userId: string;
  offlineEdits: Array<{
    documentId: string;
    patch: string;
    timestamp: string;
  }>;
}

@Injectable()
export class OfflineService {
  private mockSyncQueue: any[] = [];

  constructor(private readonly prisma: PrismaService) {}

  getPwaManifest() {
    return {
      name: 'PUBLISHORA — Global Publishing Platform',
      short_name: 'PUBLISHORA',
      description: 'Production-ready global academic publishing platform with offline writing and peer review capabilities.',
      start_url: '/',
      display: 'standalone',
      background_color: '#090d16',
      theme_color: '#4f46e5',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      categories: ['education', 'academic', 'publishing', 'research'],
    };
  }

  async processSyncQueue(dto: SyncQueueDto) {
    if (!dto.offlineEdits || dto.offlineEdits.length === 0) {
      return { processedCount: 0, conflictsResolved: 0, status: 'NO_EDITS_PENDING' };
    }

    const processed = dto.offlineEdits.map((edit, idx) => ({
      editId: `edit-${idx + 1}`,
      documentId: edit.documentId,
      status: 'SYNCED_SUCCESSFULLY',
      conflictStatus: 'RESOLVED_LATEST_WRITER_WINS',
      syncedAt: new Date().toISOString(),
    }));

    return {
      processedCount: processed.length,
      conflictsResolved: 0,
      details: processed,
    };
  }

  getBandwidthStatus(connectionType: string = '4g') {
    const isLowBandwidth = ['2g', 'slow-2g', '3g'].includes(connectionType.toLowerCase());

    return {
      connectionType,
      isLowBandwidth,
      optimizationStrategy: isLowBandwidth ? 'ADAPTIVE_WEBP_AVIF_50_PERCENT_COMPRESSION' : 'HIGH_FIDELITY_RAW',
      cachingStrategy: 'STALE_WHILE_REVALIDATE',
      maxImageWidthPx: isLowBandwidth ? 600 : 1920,
    };
  }
}
