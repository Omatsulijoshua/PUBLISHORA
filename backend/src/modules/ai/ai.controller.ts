import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AiService, ProcessAiToolDto } from './ai.service';

@Controller('api/v1/ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('assist')
  @HttpCode(HttpStatus.OK)
  async assist(@Body() dto: ProcessAiToolDto) {
    return this.aiService.processTool(dto);
  }

  @Get('capabilities')
  getCapabilities() {
    return this.aiService.getCapabilities();
  }
}
