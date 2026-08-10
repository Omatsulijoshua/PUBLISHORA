import { Controller, Post, Body } from '@nestjs/common';
import { AiSynthesisService, RagQueryDto } from './ai-synthesis.service';

@Controller('api/v1/ai-synthesis')
export class AiSynthesisController {
  constructor(private readonly aiSynthesisService: AiSynthesisService) {}

  @Post('rag-query')
  executeRagQuery(@Body() dto: RagQueryDto) {
    return this.aiSynthesisService.executeRagQuery(dto);
  }

  @Post('prisma-review')
  generatePrismaReview(@Body('topic') topic: string) {
    return this.aiSynthesisService.generatePrismaReview(topic);
  }

  @Post('contradiction-detect')
  detectContradictions(@Body('manuscriptIds') manuscriptIds: string[]) {
    return this.aiSynthesisService.detectContradictions(manuscriptIds);
  }
}
