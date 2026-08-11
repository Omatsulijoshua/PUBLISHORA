import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AiRouterService, AiRouterConfigDto } from './ai-router.service';

@Controller('api/v1/ai-router')
export class AiRouterController {
  constructor(private readonly aiRouterService: AiRouterService) {}

  @Get('config')
  getConfig() {
    return this.aiRouterService.getConfig();
  }

  @Post('config')
  updateConfig(@Body() dto: AiRouterConfigDto) {
    return this.aiRouterService.updateConfig(dto);
  }

  @Post('test-rotation')
  simulateRotation(@Body('provider') provider: string) {
    return this.aiRouterService.simulateRotation(provider || 'GROQ');
  }

  @Post('simulate-failover')
  simulateRateLimitFailover(
    @Body('provider') provider: string,
    @Body('keyIndexToFail') keyIndexToFail: number
  ) {
    return this.aiRouterService.simulateRateLimitFailover(
      provider || 'GROQ',
      keyIndexToFail ?? 0
    );
  }
}
