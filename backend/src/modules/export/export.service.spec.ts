import { ExportService } from './export.service';

describe('Phase 6 — Multi-Format Export Engine Specs', () => {
  let service: ExportService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      publication: {
        findUnique: jest.fn(),
      },
    };
    service = new ExportService(mockPrisma);
  });

  const samplePub = {
    id: 'pub-100',
    title: 'Quantum Entanglement Protocols',
    subtitle: 'Volume 1',
    abstractText: 'Study on distributed quantum computing.',
    currentVersionNum: 2,
    createdAt: new Date('2026-01-01'),
    mode: 'PREPARATION_MODE',
    authors: [{ name: 'Ada Lovelace' }],
    versions: [{ versionNumber: 2, contentJson: '{"text": "payload"}' }],
    references: [],
  };

  it('should compile valid JATS XML standard for journal articles', async () => {
    mockPrisma.publication.findUnique.mockResolvedValue(samplePub);

    const result: any = await service.generateExport({
      publicationId: 'pub-100',
      format: 'JATS_XML',
    });

    expect(result.format).toBe('JATS_XML');
    expect(result.content).toContain('<?xml version="1.0"');
    expect(result.content).toContain('<article-title>Quantum Entanglement Protocols</article-title>');
    expect(result.content).toContain('<surname>Ada Lovelace</surname>');
  });

  it('should generate PDF export metadata with Preparation Mode disclaimer notice', async () => {
    mockPrisma.publication.findUnique.mockResolvedValue(samplePub);

    const result: any = await service.generateExport({
      publicationId: 'pub-100',
      format: 'PDF',
    });

    expect(result.format).toBe('PDF');
    expect(result.mimeType).toBe('application/pdf');
    expect(result.modeNotice).toContain('Preparation Mode Export');
  });

  it('should generate valid BibTeX citation bundle', async () => {
    mockPrisma.publication.findUnique.mockResolvedValue(samplePub);

    const result: any = await service.generateExport({
      publicationId: 'pub-100',
      format: 'BIBTEX',
    });

    expect(result.format).toBe('BIBTEX');
    expect(result.content).toContain('@article{');
    expect(result.content).toContain('title = {Quantum Entanglement Protocols}');
    expect(result.content).toContain('author = {Ada Lovelace}');
  });
});
