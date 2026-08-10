import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { PreprintsService, SubmitPreprintDto, AddPreprintVersionDto, LinkVorDto } from './preprints.service';

@Controller('api/v1/preprints')
export class PreprintsController {
  constructor(private readonly preprintsService: PreprintsService) {}

  @Post()
  async submitPreprint(@Body() dto: SubmitPreprintDto) {
    return this.preprintsService.submitPreprint(dto);
  }

  @Get()
  async getPreprints() {
    return this.preprintsService.getPreprints();
  }

  @Get(':id')
  async getPreprintDetails(@Param('id') id: string) {
    return this.preprintsService.getPreprintDetails(id);
  }

  @Post(':id/versions')
  async addVersion(@Param('id') id: string, @Body() dto: AddPreprintVersionDto) {
    return this.preprintsService.addVersion({ ...dto, preprintId: id });
  }

  @Post(':id/link-vor')
  async linkVor(@Param('id') id: string, @Body() dto: LinkVorDto) {
    return this.preprintsService.linkVor({ ...dto, preprintId: id });
  }
}
