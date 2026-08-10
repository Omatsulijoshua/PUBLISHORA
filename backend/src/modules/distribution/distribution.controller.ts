import { Controller, Get, Query, Param, Header } from '@nestjs/common';
import { DistributionService } from './distribution.service';

@Controller('api/v1')
export class DistributionController {
  constructor(private readonly distributionService: DistributionService) {}

  @Get('oai-pmh')
  @Header('Content-Type', 'text/xml')
  async handleOaiPmh(@Query('verb') verb?: string) {
    if (verb === 'ListRecords') {
      return this.distributionService.generateOaiPmhListRecords();
    }
    return this.distributionService.generateOaiPmhIdentify();
  }

  @Get('distribution/google-scholar/:pubId')
  async getGoogleScholarTags(@Param('pubId') pubId: string) {
    return this.distributionService.generateGoogleScholarTags(pubId);
  }

  @Get('distribution/feeds')
  getFeeds() {
    return this.distributionService.getFeeds();
  }
}
