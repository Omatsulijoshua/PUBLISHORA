import { Controller, Get, Post, Body } from '@nestjs/common';
import { LocalizationService, TranslateAbstractDto } from './localization.service';

@Controller('api/v1/localization')
export class LocalizationController {
  constructor(private readonly localizationService: LocalizationService) {}

  @Get('locales')
  getSupportedLocales() {
    return this.localizationService.getSupportedLocales();
  }

  @Post('translate-abstract')
  translateAbstract(@Body() dto: TranslateAbstractDto) {
    return this.localizationService.translateAbstract(dto);
  }

  @Get('wcag-audit')
  getWcagComplianceStatus() {
    return this.localizationService.getWcagComplianceStatus();
  }
}
