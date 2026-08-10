import { LegalService } from './legal.service';
import { BadRequestException } from '@nestjs/common';

describe('Phase 35 — Legal Compliance, CC & Rights Engine Specs', () => {
  let service: LegalService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {};
    service = new LegalService(mockPrisma);
  });

  it('should generate Creative Commons CC BY 4.0 RDFa HTML metadata', () => {
    const cc = service.generateCcRdfa({
      licenseCode: 'CC BY 4.0',
      workTitle: 'Quantum Computing Foundations',
      authorName: 'Dr. Eleanor Vance',
    });

    expect(cc.licenseCode).toBe('CC BY 4.0');
    expect(cc.licenseUrl).toContain('creativecommons.org');
    expect(cc.rdfaHtml).toContain('dct:title');
    expect(cc.rdfaHtml).toContain('cc:attributionName');
  });

  it('should throw BadRequestException when generating CC RDFa without work title', () => {
    expect(() =>
      service.generateCcRdfa({ licenseCode: 'CC BY 4.0', workTitle: '', authorName: '' }),
    ).toThrow(BadRequestException);
  });

  it('should sign publishing agreement digitally with eIDAS / ESIGN SHA-256 hash', () => {
    const sig = service.signAgreement({
      publicationId: 'pub-101',
      signerName: 'Dr. Eleanor Vance',
      signerEmail: 'eleanor@oxford.ac.uk',
    });

    expect(sig.agreementId).toContain('agr-');
    expect(sig.eIdasSignatureHash).toContain('eIDAS-SHA256-');
    expect(sig.complianceStandard).toContain('eIDAS & ESIGN Act Compliant');
  });

  it('should return active OA embargo expiration timer status', () => {
    const embargo = service.getEmbargoStatus('pub-101');

    expect(embargo.embargoActive).toBe(true);
    expect(embargo.monthsRemaining).toBe(6);
    expect(embargo.automatedPublicReleaseTrigger).toBe('ACTIVE_TIMER');
  });
});
