import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ArchivingService, CreateBagItDto } from './archiving.service';

@Controller('api/v1/archiving')
export class ArchivingController {
  constructor(private readonly archivingService: ArchivingService) {}

  @Post('bagit/package')
  generateBagItPackage(@Body() dto: CreateBagItDto) {
    return this.archivingService.generateBagItPackage(dto);
  }

  @Post('portico/deposit')
  depositPortico(@Body('publicationId') publicationId: string) {
    return this.archivingService.depositPortico(publicationId || 'pub-101');
  }

  @Get('preservation-status/:pubId')
  getPreservationStatus(@Param('pubId') pubId: string) {
    return this.archivingService.getPreservationStatus(pubId);
  }
}
