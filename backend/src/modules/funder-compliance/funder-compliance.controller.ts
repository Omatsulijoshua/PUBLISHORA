import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { FunderComplianceService, PlanSCheckDto } from './funder-compliance.service';

@Controller('api/v1/funder-compliance')
export class FunderComplianceController {
  constructor(private readonly funderComplianceService: FunderComplianceService) {}

  @Post('plan-s-check')
  checkPlanSCompliance(@Body() dto: PlanSCheckDto) {
    return this.funderComplianceService.checkPlanSCompliance(dto);
  }

  @Post('nih-mandate')
  validateNihMandate(@Body('grantAwardId') grantAwardId: string) {
    return this.funderComplianceService.validateNihMandate(grantAwardId);
  }

  @Get('fundref/:funderId')
  resolveFundRef(@Param('funderId') funderId: string) {
    return this.funderComplianceService.resolveFundRef(funderId);
  }
}
