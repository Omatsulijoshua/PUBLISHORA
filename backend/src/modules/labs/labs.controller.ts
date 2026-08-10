import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { LabsService, CreateLabDto, AddLabMemberDto, PostDiscussionDto } from './labs.service';

@Controller('api/v1/labs')
export class LabsController {
  constructor(private readonly labsService: LabsService) {}

  @Post()
  async createLab(@Body() dto: CreateLabDto) {
    return this.labsService.createLab(dto);
  }

  @Get(':labId')
  async getLabDetails(@Param('labId') labId: string) {
    return this.labsService.getLabDetails(labId);
  }

  @Post(':labId/members')
  async addMember(@Param('labId') labId: string, @Body() dto: AddLabMemberDto) {
    return this.labsService.addMember({ ...dto, labId });
  }

  @Post(':labId/discussions')
  async postDiscussion(@Param('labId') labId: string, @Body() dto: PostDiscussionDto) {
    return this.labsService.postDiscussion({ ...dto, labId });
  }
}
