import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { GrantsService, AttachGrantDto } from './grants.service';

@Controller('api/v1/grants')
export class GrantsController {
  constructor(private readonly grantsService: GrantsService) {}

  @Post()
  async attachGrant(@Body() dto: AttachGrantDto) {
    return this.grantsService.attachGrant(dto);
  }

  @Get('publication/:pubId')
  async getPublicationGrants(@Param('pubId') pubId: string) {
    return this.grantsService.getPublicationGrants(pubId);
  }

  @Get('funders')
  getSupportedFunders() {
    return this.grantsService.getSupportedFunders();
  }
}
