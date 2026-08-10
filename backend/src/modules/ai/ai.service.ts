import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OpenAiAdapter, AnthropicAdapter, GeminiAdapter, AiProviderAdapter } from '../../common/abstractions/ai-provider.abstract';
import { AiGuardrailsVerifier } from './guardrails/ai-guardrails.verifier';

export interface ProcessAiToolDto {
  userId: string;
  toolType: string;
  inputText: string;
  provider?: 'OPENAI' | 'ANTHROPIC' | 'GEMINI';
  model?: string;
  writingLevel?: 'MINIMAL' | 'BALANCED' | 'ADVANCED';
}

@Injectable()
export class AiService {
  private readonly providers: Record<string, AiProviderAdapter>;

  constructor(private readonly prisma: PrismaService) {
    this.providers = {
      OPENAI: new OpenAiAdapter(),
      ANTHROPIC: new AnthropicAdapter(),
      GEMINI: new GeminiAdapter(),
    };
  }

  async processTool(dto: ProcessAiToolDto) {
    const selectedProviderKey = dto.provider || 'OPENAI';
    const adapter = this.providers[selectedProviderKey] || this.providers.OPENAI;

    // Call Provider Abstraction
    const rawResult = await adapter.generateText({
      prompt: dto.inputText,
      systemPrompt: `You are PUBLISHORA AI Assistant. Tool: ${dto.toolType}. Writing Level: ${dto.writingLevel || 'BALANCED'}.`,
    });

    // Apply Guardrails Verification
    const guardrailCheck = AiGuardrailsVerifier.verifyOutput(rawResult.content, dto.toolType);

    // Save to Database
    const aiRequest = await this.prisma.aIRequest.create({
      data: {
        userId: dto.userId,
        promptType: dto.toolType,
        provider: selectedProviderKey,
        modelUsed: rawResult.model,
        inputText: dto.inputText,
        optionsJson: JSON.stringify({ writingLevel: dto.writingLevel || 'BALANCED' }),
        result: {
          create: {
            outputText: rawResult.content,
            suggestionsJson: JSON.stringify({
              outputType: guardrailCheck.outputType,
              warnings: guardrailCheck.warnings,
              explanation: `Edits generated using ${rawResult.model} with strict authorship preservation.`,
            }),
            tokensUsed: rawResult.tokensUsed,
          },
        },
      },
      include: { result: true },
    });

    return {
      requestId: aiRequest.id,
      toolType: dto.toolType,
      provider: selectedProviderKey,
      modelUsed: rawResult.model,
      outputType: guardrailCheck.outputType,
      content: rawResult.content,
      warnings: guardrailCheck.warnings,
      explanation: `Edits generated using ${rawResult.model} with strict authorship preservation.`,
      tokensUsed: rawResult.tokensUsed,
    };
  }

  getCapabilities() {
    return {
      totalCapabilities: 20,
      tools: [
        { id: 'GRAMMAR', name: 'Grammar & Spelling Correction', category: 'Proofreading' },
        { id: 'ACADEMIC_STYLE', name: 'Academic Style Polish', category: 'Proofreading' },
        { id: 'CLARITY', name: 'Clarity & Conciseness', category: 'Proofreading' },
        { id: 'STRUCTURAL_ANALYSIS', name: 'Structural Flow Analysis', category: 'Structure' },
        { id: 'ABSTRACT_IMPROVEMENT', name: 'Abstract Optimization', category: 'Academic' },
        { id: 'TITLE_SUGGESTIONS', name: 'Title & Subtitle Generator', category: 'Academic' },
        { id: 'KEYWORD_SUGGESTIONS', name: 'Indexed Keyword Generator', category: 'Academic' },
        { id: 'LITERATURE_ORGANIZATION', name: 'Literature Review Synthesizer', category: 'Research' },
        { id: 'RESEARCH_GAP', name: 'Research Gap Identifier', category: 'Research' },
        { id: 'CITATION_ASSISTANCE', name: 'Citation & Reference Formatter', category: 'Citations' },
        { id: 'REFERENCE_CONSISTENCY', name: 'Reference Consistency Auditor', category: 'Citations' },
        { id: 'METHODOLOGY_REVIEW', name: 'Methodology Checklist Review', category: 'Research' },
        { id: 'DISCUSSION_REVIEW', name: 'Discussion & Claims Auditor', category: 'Research' },
        { id: 'CONCLUSION_REVIEW', name: 'Conclusion Strength Assessor', category: 'Research' },
        { id: 'TRANSLATION', name: 'Academic Translation (50+ Languages)', category: 'Language' },
        { id: 'SUMMARIZATION', name: 'Executive Summarization', category: 'Writing' },
        { id: 'PUBLICATION_READINESS', name: 'Publication Readiness Audit', category: 'Integrity' },
        { id: 'FORMATTING_ASSISTANCE', name: 'Publisher Formatting Check', category: 'Formatting' },
        { id: 'CONSISTENCY_CHECKING', name: 'Term & Notation Auditor', category: 'Integrity' },
        { id: 'STATISTICAL_CHECKLIST', name: 'Statistical Reporting Review', category: 'Academic' },
      ],
      providers: ['OPENAI', 'ANTHROPIC', 'GEMINI'],
    };
  }
}
