import { Controller, Post, Get, Body } from '@nestjs/common';
import { IndexingService, CrossrefDepositDto } from './indexing.service';

@Controller('api/v1/indexing')
export class IndexingController {
  constructor(private readonly indexingService: IndexingService) {}

  @Post('crossref/deposit')
  depositCrossref(@Body() dto: CrossrefDepositDto) {
    return this.indexingService.depositCrossref(dto);
  }

  @Post('pmc/upload')
  uploadPmcJats(@Body('publicationId') publicationId: string) {
    return this.indexingService.uploadPmcJats(publicationId || 'pub-101');
  }

  @Get('kbart-feed')
  getKbartFeed() {
    return this.indexingService.getKbartFeed();
  }
}
