import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { UniversalSearchService, UniversalSearchQueryDto } from './universal-search.service';

@Controller('api/v1/universal-search')
export class UniversalSearchController {
  constructor(private readonly universalSearchService: UniversalSearchService) {}

  @Get()
  queryUniversalSearch(@Query() dto: UniversalSearchQueryDto) {
    return this.universalSearchService.queryUniversalSearch(dto);
  }

  @Get('semantic-scholar')
  getSemanticScholarGraph(@Query('doi') doi: string) {
    return this.universalSearchService.getSemanticScholarGraph(doi);
  }

  @Post('vector-similarity')
  performVectorSimilaritySearch(@Body('text') text: string) {
    return this.universalSearchService.performVectorSimilaritySearch(text || 'quantum error correction');
  }
}
