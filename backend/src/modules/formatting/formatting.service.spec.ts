import { FormattingService } from './formatting.service';
import { BadRequestException } from '@nestjs/common';

describe('Phase 37 — Dynamic Production Formatting & Multi-Format Specs', () => {
  let service: FormattingService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {};
    service = new FormattingService(mockPrisma);
  });

  it('should render camera-ready vector PDF using Paged Media CSS specifications', () => {
    const pdf = service.renderPdf({
      publicationId: 'pub-101',
      template: 'ACADEMIC_STANDARD',
    });

    expect(pdf.pdfJobId).toContain('pdf-job-');
    expect(pdf.engine).toContain('Paged Media CSS');
    expect(pdf.pdfDownloadUrl).toContain('/exports/pdf/pub-101.pdf');
    expect(pdf.status).toBe('RENDERED_SUCCESSFULLY');
  });

  it('should throw BadRequestException when rendering PDF without publicationId', () => {
    expect(() => service.renderPdf({ publicationId: '', template: 'ACADEMIC_STANDARD' })).toThrow(
      BadRequestException,
    );
  });

  it('should generate reflowable EPUB 3.2 ebook with ARIA accessibility landmarks', () => {
    const epub = service.generateEpub('pub-101');

    expect(epub.epubJobId).toContain('epub-job-');
    expect(epub.version).toContain('EPUB 3.2');
    expect(epub.ariaLandmarksCompliant).toBe(true);
    expect(epub.status).toBe('GENERATED_AND_VALIDATED');
  });

  it('should calculate POD spine width, bleed margins, and IngramSpark/KDP compliance', () => {
    const pod = service.calculatePodSpecs({
      pageCount: 240,
      paperType: '50lb_white',
      bindingType: 'paperback',
    });

    expect(pod.spineWidthInches).toBeGreaterThan(0.4);
    expect(pod.spineWidthMm).toBeGreaterThan(10);
    expect(pod.bleedMarginInches).toBe(0.125);
    expect(pod.ingramSparkCompliant).toBe(true);
    expect(pod.kdpCompliant).toBe(true);
  });
});
