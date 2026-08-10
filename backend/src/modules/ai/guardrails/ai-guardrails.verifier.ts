export interface GuardrailCheckResult {
  passed: boolean;
  warnings: string[];
  outputType: 'FACT' | 'SUGGESTION' | 'WARNING' | 'RECOMMENDATION';
}

export class AiGuardrailsVerifier {
  static verifyOutput(text: string, requestedTool: string): GuardrailCheckResult {
    const warnings: string[] = [];
    let outputType: 'FACT' | 'SUGGESTION' | 'WARNING' | 'RECOMMENDATION' = 'SUGGESTION';

    // Guardrail 1: Fake DOI / ISBN Check
    if (text.includes('10.0000/') || text.includes('10.1234/fake') || text.includes('ISBN 000-0-00-000000-0')) {
      warnings.push('CRITICAL: Fake or unverified DOI/ISBN format detected. Remove unverified identifiers.');
      outputType = 'WARNING';
    }

    // Guardrail 2: Peer Review Decision Fabrication Check
    if (text.toLowerCase().includes('this manuscript is officially accepted') || text.toLowerCase().includes('peer review passed')) {
      warnings.push('REMINDER: AI cannot issue official peer-review or editorial decisions. Human editorial review is required.');
      outputType = 'WARNING';
    }

    // Guardrail 3: Research Fabrication Check
    if (requestedTool === 'RESEARCH_GAP' || requestedTool === 'METHODOLOGY_REVIEW') {
      outputType = 'RECOMMENDATION';
    }

    if (requestedTool === 'PROOFREADING' || requestedTool === 'GRAMMAR') {
      outputType = 'SUGGESTION';
    }

    if (requestedTool === 'STATISTICAL_CHECKLIST' || requestedTool === 'ETHICS_CHECKLIST') {
      outputType = 'FACT';
    }

    return {
      passed: warnings.length === 0,
      warnings,
      outputType,
    };
  }
}
