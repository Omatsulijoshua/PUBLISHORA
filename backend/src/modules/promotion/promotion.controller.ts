import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { PromotionService, SetupPromotionProfileDto } from './promotion.service';

@Controller('api/v1/promotion')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post('profile')
  async setupProfile(@Body() dto: SetupPromotionProfileDto) {
    return this.promotionService.setupProfile(dto);
  }

  @Get('dossier/:userId')
  async getTenureDossier(@Param('userId') userId: string) {
    return this.promotionService.getTenureDossier(userId);
  }
}
