import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { OnboardingService, OnboardingSubmissionDto } from './onboarding.service';

@Controller('api/v1/onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post('submit')
  @HttpCode(HttpStatus.OK)
  async submitOnboarding(@Body() dto: OnboardingSubmissionDto) {
    return this.onboardingService.processOnboarding(dto);
  }
}
