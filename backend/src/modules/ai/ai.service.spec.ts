import { AiService } from './ai.service';
import { AiGuardrailsVerifier } from './guardrails/ai-guardrails.verifier';

describe('Phase 4 — AI Assistant & Guardrails Engine Specs', () => {
  let service: AiService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      aIRequest: {
        create: jest.fn().mockImplementation((args) => Promise.resolve({
          id: 'req-101',
          ...args.data,
          result: { outputText: args.data.result.create.outputText },
        })),
      },
    };
    service = new AiService(mockPrisma);
  });

  it('should list all 20 supported AI tool capabilities and 3 providers', () => {
    const caps = service.getCapabilities();
    expect(caps.totalCapabilities).toBe(20);
    expect(caps.tools.length).toBe(20);
    expect(caps.providers).toEqual(['OPENAI', 'ANTHROPIC', 'GEMINI']);
  });

  it('should process AI tools with OpenAI and classify output as SUGGESTION for proofreading', async () => {
    const result = await service.processTool({
      userId: 'user-1',
      toolType: 'PROOFREADING',
      inputText: 'This is a sample manuscript text.',
      provider: 'OPENAI',
    });

    expect(result.provider).toBe('OPENAI');
    expect(result.outputType).toBe('SUGGESTION');
    expect(result.content).toContain('Proofread');
    expect(mockPrisma.aIRequest.create).toHaveBeenCalled();
  });

  it('should trigger WARNING output type when unverified fake DOI is detected by guardrails', () => {
    const check = AiGuardrailsVerifier.verifyOutput('This paper references DOI 10.0000/fake-doi.', 'CITATION_ASSISTANCE');
    expect(check.passed).toBe(false);
    expect(check.outputType).toBe('WARNING');
    expect(check.warnings.length).toBeGreaterThan(0);
    expect(check.warnings[0]).toContain('Fake or unverified DOI');
  });

  it('should classify RESEARCH_GAP as RECOMMENDATION', () => {
    const check = AiGuardrailsVerifier.verifyOutput('Potential research gap in distributed quantum routing.', 'RESEARCH_GAP');
    expect(check.outputType).toBe('RECOMMENDATION');
  });
});
