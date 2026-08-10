import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { VerificationService, IssueVerificationDto, PostNoticeDto } from './verification.service';

@Controller('api/v1/verify')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post('issue')
  async issueVerificationRecord(@Body() dto: IssueVerificationDto) {
    return this.verificationService.issueVerificationRecord(dto);
  }

  @Get(':internalId')
  async resolveRecord(@Param('internalId') internalId: string) {
    return this.verificationService.resolveRecord(internalId);
  }

  @Post(':internalId/notice')
  @HttpCode(HttpStatus.OK)
  async postNotice(@Param('internalId') internalId: string, @Body() dto: PostNoticeDto) {
    return this.verificationService.postNotice({ ...dto, internalId });
  }
}
