import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AvailabilityService, AvailabilityCheckDto } from './availability.service';

@Controller('api/v1/availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Post('check')
  @HttpCode(HttpStatus.OK)
  async checkAvailability(@Body() dto: AvailabilityCheckDto) {
    return this.availabilityService.checkAvailability(dto);
  }
}
