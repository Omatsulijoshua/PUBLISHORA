import { Controller, Post, Get, Patch, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { PublicationsService, CreatePublicationDto, CreateVersionDto } from './publications.service';

@Controller('api/v1/publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Post()
  async createPublication(@Body() dto: CreatePublicationDto) {
    return this.publicationsService.createPublication(dto);
  }

  @Get()
  async getPublications(@Query('userId') userId?: string) {
    return this.publicationsService.findAll(userId);
  }

  @Get(':id')
  async getPublication(@Param('id') id: string) {
    return this.publicationsService.findOne(id);
  }

  @Post(':id/versions')
  async createVersion(
    @Param('id') id: string,
    @Body() dto: Omit<CreateVersionDto, 'publicationId'>,
  ) {
    return this.publicationsService.createVersion({
      ...dto,
      publicationId: id,
    });
  }

  @Post(':id/versions/:versionId/restore')
  @HttpCode(HttpStatus.OK)
  async restoreVersion(
    @Param('id') id: string,
    @Param('versionId') versionId: string,
  ) {
    return this.publicationsService.restoreVersion(id, versionId);
  }
}
