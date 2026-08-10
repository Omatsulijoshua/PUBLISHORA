import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { TenantsService, CreateTenantDto, ConfigureSsoDto } from './tenants.service';

@Controller('api/v1/tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  async createTenant(@Body() dto: CreateTenantDto) {
    return this.tenantsService.createTenant(dto);
  }

  @Get()
  async getTenants() {
    return this.tenantsService.getTenants();
  }

  @Get(':id')
  async getTenantDetails(@Param('id') id: string) {
    return this.tenantsService.getTenantDetails(id);
  }

  @Post(':id/cname-verify')
  async verifyCname(@Param('id') id: string) {
    return this.tenantsService.verifyCname(id);
  }

  @Post(':id/sso-config')
  async configureSso(@Param('id') id: string, @Body() dto: ConfigureSsoDto) {
    return this.tenantsService.configureSso({ ...dto, tenantId: id });
  }
}
