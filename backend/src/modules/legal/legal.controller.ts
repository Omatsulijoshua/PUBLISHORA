import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { LegalService, GenerateCcRdfaDto, SignAgreementDto } from './legal.service';

@Controller('api/v1/legal')
export class LegalController {
  constructor(private readonly legalService: LegalService) {}

  @Post('licenses/cc-rdfa')
  generateCcRdfa(@Body() dto: GenerateCcRdfaDto) {
    return this.legalService.generateCcRdfa(dto);
  }

  @Post('agreements/sign')
  signAgreement(@Body() dto: SignAgreementDto) {
    return this.legalService.signAgreement(dto);
  }

  @Get('embargoes/:pubId')
  getEmbargoStatus(@Param('pubId') pubId: string) {
    return this.legalService.getEmbargoStatus(pubId);
  }
}
