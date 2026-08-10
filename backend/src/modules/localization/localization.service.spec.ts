import { LocalizationService } from './localization.service';
import { BadRequestException } from '@nestjs/common';

describe('Phase 30 — Multi-Language Localization & Accessibility Specs', () => {
  let service: LocalizationService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {};
    service = new LocalizationService(mockPrisma);
  });

  it('should return 14 supported global locales including Swahili and Yoruba', () => {
    const locales = service.getSupportedLocales();

    expect(locales.total).toBe(14);
    expect(locales.locales.some((l) => l.code === 'sw')).toBe(true);
    expect(locales.locales.some((l) => l.code === 'yo')).toBe(true);
  });

  it('should auto-translate abstract and detect RTL direction for Arabic', () => {
    const result = service.translateAbstract({
      text: 'Quantum foundations abstract',
      sourceLang: 'en',
      targetLang: 'ar',
    });

    expect(result.targetLang).toBe('ar');
    expect(result.direction).toBe('rtl');
    expect(result.translatedText).toContain('[Translated to Arabic]:');
  });

  it('should throw BadRequestException when translation parameters are missing', () => {
    expect(() => service.translateAbstract({ text: '', sourceLang: 'en', targetLang: '' })).toThrow(BadRequestException);
  });

  it('should return WCAG 2.1 AAA accessibility audit status', () => {
    const wcag = service.getWcagComplianceStatus();

    expect(wcag.standard).toBe('WCAG 2.1 AAA');
    expect(wcag.screenReaderSupport).toBe('FULL_ARIA_1.2_COMPLIANT');
    expect(wcag.controls.length).toBeGreaterThanOrEqual(3);
  });
});
