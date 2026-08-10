import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { DevelopersService, CreateApiKeyDto, RegisterWebhookDto } from './developers.service';

@Controller('api/v1/developers')
export class DevelopersController {
  constructor(private readonly developersService: DevelopersService) {}

  @Post('api-keys')
  async createApiKey(@Body() dto: CreateApiKeyDto) {
    return this.developersService.createApiKey(dto);
  }

  @Get('api-keys')
  async getApiKeys() {
    return this.developersService.getApiKeys();
  }

  @Post('webhooks')
  async registerWebhook(@Body() dto: RegisterWebhookDto) {
    return this.developersService.registerWebhook(dto);
  }

  @Get('webhooks')
  getWebhooks() {
    return this.developersService.getWebhooks();
  }

  @Post('webhooks/:id/test-dispatch')
  dispatchTestWebhook(@Param('id') id: string) {
    return this.developersService.dispatchTestWebhook(id);
  }
}
