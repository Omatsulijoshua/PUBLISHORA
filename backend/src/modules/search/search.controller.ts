import { Controller, Get, Query, Param } from '@nestjs/common';
import { SearchService, SearchQueryDto } from './search.service';

@Controller('api/v1/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query() query: SearchQueryDto) {
    return this.searchService.search(query);
  }

  @Get('semantic')
  async semanticVectorSearch(@Query('q') query: string) {
    return this.searchService.semanticVectorSearch(query || 'quantum');
  }

  @Get('graph/:pubId')
  async getCitationGraph(@Param('pubId') pubId: string) {
    return this.searchService.getCitationGraph(pubId);
  }
}
