import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CounterR5Service {
  constructor(private readonly prisma: PrismaService) {}

  getSushiTrJ1Report(beginDate?: string, endDate?: string) {
    return {
      reportHeader: {
        reportName: 'Journal Requests (Excluding OA_Gold)',
        reportId: 'TR_J1',
        release: '5',
        institutionName: 'University of Cambridge Library Consortium',
        customerID: 'CUST-CAMB-901',
        created: new Date().toISOString(),
        createdBY: 'PUBLISHORA SUSHI R5 Server v2.0',
      },
      reportItems: [
        {
          title: 'PUBLISHORA Journal of Quantum Computing',
          itemPlatform: 'PUBLISHORA Press Global Platform',
          publisher: 'PUBLISHORA Press Ltd',
          platform: 'PUBLISHORA',
          journalIssn: '2768-9014',
          eIssn: '2768-9022',
          itemPerformance: [
            {
              period: { beginDate: beginDate || '2026-01-01', endDate: endDate || '2026-06-30' },
              instance: [
                { metricType: 'Total_Item_Investigations', count: 142890 },
                { metricType: 'Unique_Item_Investigations', count: 112040 },
                { metricType: 'Total_Item_Requests', count: 98420 },
                { metricType: 'Unique_Item_Requests', count: 82190 },
              ],
            },
          ],
        },
      ],
    };
  }

  getGeoHeatmap() {
    return {
      topReadershipCountries: [
        { countryCode: 'US', countryName: 'United States', totalDownloads: 342100, sharePercent: 32.4 },
        { countryCode: 'GB', countryName: 'United Kingdom', totalDownloads: 184200, sharePercent: 17.5 },
        { countryCode: 'DE', countryName: 'Germany', totalDownloads: 120500, sharePercent: 11.4 },
        { countryCode: 'JP', countryName: 'Japan', totalDownloads: 98400, sharePercent: 9.3 },
        { countryCode: 'NG', countryName: 'Nigeria', totalDownloads: 74200, sharePercent: 7.0 },
      ],
      totalGlobalDownloadsCurrentYear: 1054400,
      generatedAt: new Date().toISOString(),
    };
  }

  getCpdMetrics(institutionId: string) {
    const annualSubscriptionCostUsd = 12500;
    const totalFullTextDownloads = 98420;

    const costPerDownloadUsd = Number((annualSubscriptionCostUsd / totalFullTextDownloads).toFixed(2)); // 0.13

    return {
      institutionId: institutionId || 'inst-camb-901',
      institutionName: 'University of Cambridge Library Consortium',
      annualSubscriptionCostUsd,
      totalFullTextDownloads,
      costPerDownloadUsd,
      valueAssessment: 'HIGH_VALUE_COST_EFFECTIVE ($0.13 per article download)',
      calculatedAt: new Date().toISOString(),
    };
  }
}
