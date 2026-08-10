import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ReaderService, AddAnnotationDto } from './reader.service';

@Controller('api/v1/reader')
export class ReaderController {
  constructor(private readonly readerService: ReaderService) {}

  @Post('bookshelf')
  async addToBookshelf(@Body() body: { userId: string; publicationId: string }) {
    return this.readerService.addToBookshelf(body.userId, body.publicationId);
  }

  @Get('bookshelf/:userId')
  async getBookshelf(@Param('userId') userId: string) {
    return this.readerService.getBookshelf(userId);
  }

  @Post('annotations')
  async addAnnotation(@Body() dto: AddAnnotationDto) {
    return this.readerService.addAnnotation(dto);
  }

  @Get('annotations/:pubId')
  async getAnnotations(@Param('pubId') pubId: string, @Query('userId') userId: string) {
    return this.readerService.getAnnotations(pubId, userId || 'user-101');
  }

  @Get('feed/:userId')
  getResearchFeed(@Param('userId') userId: string) {
    return this.readerService.getResearchFeed(userId);
  }
}
