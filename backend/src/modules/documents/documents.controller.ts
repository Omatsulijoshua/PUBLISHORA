import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { DocumentsService, CreateDocumentDto, AddCommentDto } from './documents.service';

@Controller('api/v1/documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  async createDocument(@Body() dto: CreateDocumentDto) {
    return this.documentsService.createDocument(dto);
  }

  @Post('comments')
  async addComment(@Body() dto: AddCommentDto) {
    return this.documentsService.addComment(dto);
  }

  @Get(':id/comments')
  async getComments(@Param('id') id: string) {
    return this.documentsService.getComments(id);
  }
}
