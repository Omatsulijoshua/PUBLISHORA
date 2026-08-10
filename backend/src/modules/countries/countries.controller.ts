import { Controller, Get, Query, Param } from '@nestjs/common';
import { CountriesService } from './countries.service';

@Controller('api/v1/countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  async getCountries(@Query('search') search?: string) {
    return this.countriesService.findAll(search);
  }

  @Get(':code')
  async getCountryByCode(@Param('code') code: string) {
    return this.countriesService.findByCode(code);
  }
}
