import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ReferencesService, CreateReferenceDto, CitationStyle } from './references.service';

@Controller('api/v1/references')
export class ReferencesController {
  constructor(private readonly referencesService: ReferencesService) {}

  @Post()
  async createReference(@Body() dto: CreateReferenceDto) {
    return this.referencesService.createReference(dto);
  }

  @Get('publication/:pubId')
  async getByPublication(
    @Param('pubId') pubId: string,
    @Query('style') style?: CitationStyle,
  ) {
    return this.referencesService.findByPublication(pubId, style || 'APA');
  }

  @Post('import/bibtex')
  async importBibTeX(
    @Body() body: { publicationId: string; bibtex: string },
  ) {
    return this.referencesService.importBibTeX(body.publicationId, body.bibtex);
  }
}
