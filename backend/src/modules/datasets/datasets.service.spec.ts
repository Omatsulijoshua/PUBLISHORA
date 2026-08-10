import { DatasetsService } from './datasets.service';
import { BadRequestException } from '@nestjs/common';

describe('Phase 29 — Dataset & Software Citation Engine Specs', () => {
  let service: DatasetsService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {};
    service = new DatasetsService(mockPrisma);
  });

  it('should deposit research dataset and mint DataCite DOI', async () => {
    const ds = await service.depositDataset({
      title: 'Human Brain Cell Atlas High-Resolution Spatial Proteomics',
      authors: ['Dr. Ada Lovelace'],
      description: 'Multiplexed protein expression maps across 48 brain subregions.',
      externalRepository: 'HARVARD_DATAVERSE',
      license: 'CC0 1.0 Universal',
      fileSizeBytes: 5368709120,
    });

    expect(ds.id).toContain('ds-');
    expect(ds.doi).toContain('10.5555/dataset.2026.');
    expect(ds.fairScore.overallPercent).toBeGreaterThanOrEqual(95);
  });

  it('should parse GitHub CITATION.cff file metadata', () => {
    const cff = service.parseCff('cff-version: 1.2.0\ntitle: Test Package');

    expect(cff.cffVersion).toBe('1.2.0');
    expect(cff.doi).toContain('10.5555/software.');
    expect(cff.license).toBe('MIT');
  });

  it('should throw BadRequestException on invalid CFF content', () => {
    expect(() => service.parseCff('invalid text')).toThrow(BadRequestException);
  });

  it('should generate valid DataCite 4.4 XML schema payload', () => {
    const xml = service.getDataCiteXml('ds-101');

    expect(xml).toContain('<?xml version="1.0"');
    expect(xml).toContain('datacite.org/schema/kernel-4');
    expect(xml).toContain('10.5555/dataset.2026.101');
  });
});
