export interface AiCompletionOptions {
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
  mode?: 'FACT' | 'SUGGESTION' | 'WARNING' | 'RECOMMENDATION';
}

export interface AiCompletionResult {
  provider: 'OPENAI' | 'ANTHROPIC' | 'GEMINI';
  model: string;
  content: string;
  outputType: 'FACT' | 'SUGGESTION' | 'WARNING' | 'RECOMMENDATION';
  tokensUsed: number;
}

export abstract class AiProviderAdapter {
  abstract readonly providerName: 'OPENAI' | 'ANTHROPIC' | 'GEMINI';
  abstract generateText(options: AiCompletionOptions): Promise<AiCompletionResult>;
}

export class OpenAiAdapter extends AiProviderAdapter {
  readonly providerName = 'OPENAI';
  async generateText(options: AiCompletionOptions): Promise<AiCompletionResult> {
    return {
      provider: 'OPENAI',
      model: 'gpt-4o',
      content: `[AI Output by OpenAI GPT-4o] Proofread & Analyzed: "${options.prompt.substring(0, 100)}..."`,
      outputType: options.mode || 'SUGGESTION',
      tokensUsed: 150,
    };
  }
}

export class AnthropicAdapter extends AiProviderAdapter {
  readonly providerName = 'ANTHROPIC';
  async generateText(options: AiCompletionOptions): Promise<AiCompletionResult> {
    return {
      provider: 'ANTHROPIC',
      model: 'claude-3-5-sonnet',
      content: `[AI Output by Anthropic Claude] Academic Review: "${options.prompt.substring(0, 100)}..."`,
      outputType: options.mode || 'RECOMMENDATION',
      tokensUsed: 160,
    };
  }
}

export class GeminiAdapter extends AiProviderAdapter {
  readonly providerName = 'GEMINI';
  async generateText(options: AiCompletionOptions): Promise<AiCompletionResult> {
    return {
      provider: 'GEMINI',
      model: 'gemini-1.5-pro',
      content: `[AI Output by Google Gemini] Structure Analysis: "${options.prompt.substring(0, 100)}..."`,
      outputType: options.mode || 'FACT',
      tokensUsed: 140,
    };
  }
}
