import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LibraryService, DepositToRepoDto, GenerateApcInvoiceDto } from './library.service';

@Controller('api/v1/library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Post('deposit')
  @HttpCode(HttpStatus.OK)
  async depositToRepository(@Body() dto: DepositToRepoDto) {
    return this.libraryService.depositToRepository(dto);
  }

  @Get('institutions')
  getInstitutions() {
    return this.libraryService.getInstitutions();
  }

  @Post('apc/invoice')
  async generateApcInvoice(@Body() dto: GenerateApcInvoiceDto) {
    return this.libraryService.generateApcInvoice(dto);
  }
}
