import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { SubmissionsService, CreateSubmissionDto, ScreenSubmissionDto } from './submissions.service';

@Controller('api/v1/submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  async createSubmission(@Body() dto: CreateSubmissionDto) {
    return this.submissionsService.createSubmission(dto);
  }

  @Get('intake')
  async getIntakeQueue() {
    return this.submissionsService.getIntakeQueue();
  }

  @Post(':id/screen')
  @HttpCode(HttpStatus.OK)
  async screenSubmission(
    @Param('id') id: string,
    @Body() dto: ScreenSubmissionDto,
  ) {
    return this.submissionsService.screenSubmission({ ...dto, submissionId: id });
  }
}
