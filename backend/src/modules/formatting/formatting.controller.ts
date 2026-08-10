import { Controller, Post, Body } from '@nestjs/common';
import { FormattingService, RenderPdfDto, PodCalculatorDto } from './formatting.service';

@Controller('api/v1/formatting')
export class FormattingController {
  constructor(private readonly formattingService: FormattingService) {}

  @Post('render-pdf')
  renderPdf(@Body() dto: RenderPdfDto) {
    return this.formattingService.renderPdf(dto);
  }

  @Post('generate-epub')
  generateEpub(@Body('publicationId') publicationId: string) {
    return this.formattingService.generateEpub(publicationId || 'pub-101');
  }

  @Post('pod-calculator')
  calculatePodSpecs(@Body() dto: PodCalculatorDto) {
    return this.formattingService.calculatePodSpecs(dto);
  }
}
