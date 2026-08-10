import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { JournalsService, CreateJournalDto } from './journals.service';

@Controller('api/v1/journals')
export class JournalsController {
  constructor(private readonly journalsService: JournalsService) {}

  @Post()
  async createJournal(@Body() dto: CreateJournalDto) {
    return this.journalsService.createJournal(dto);
  }

  @Get()
  async findAllJournals() {
    return this.journalsService.findAllJournals();
  }

  @Get(':id')
  async findJournalById(@Param('id') id: string) {
    return this.journalsService.findJournalById(id);
  }
}
