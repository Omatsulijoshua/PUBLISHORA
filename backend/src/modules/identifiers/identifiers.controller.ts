import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { IdentifiersService, RegisterIdentifierDto } from './identifiers.service';

@Controller('api/v1/identifiers')
export class IdentifiersController {
  constructor(private readonly identifiersService: IdentifiersService) {}

  @Post('issue')
  async registerIdentifier(@Body() dto: RegisterIdentifierDto) {
    return this.identifiersService.registerIdentifier(dto);
  }

  @Get('publication/:pubId')
  async getIdentifiersByPublication(@Param('pubId') pubId: string) {
    return this.identifiersService.getIdentifiersByPublication(pubId);
  }
}
