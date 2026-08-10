import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ConferencesService, CreateConferenceDto, CompileProceedingsDto } from './conferences.service';

@Controller('api/v1/conferences')
export class ConferencesController {
  constructor(private readonly conferencesService: ConferencesService) {}

  @Post()
  async createConference(@Body() dto: CreateConferenceDto) {
    return this.conferencesService.createConference(dto);
  }

  @Get()
  async getConferences() {
    return this.conferencesService.getConferences();
  }

  @Get(':id')
  async getConferenceDetails(@Param('id') id: string) {
    return this.conferencesService.getConferenceDetails(id);
  }

  @Post(':id/proceedings/compile')
  async compileProceedings(@Param('id') id: string, @Body() dto: CompileProceedingsDto) {
    return this.conferencesService.compileProceedings({ ...dto, conferenceId: id });
  }
}
