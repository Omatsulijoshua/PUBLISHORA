import { IndexingService } from './indexing.service';
import { BadRequestException } from '@nestjs/common';

describe('Phase 36 — Automated Indexing & Discovery Specs', () => {
  let service: IndexingService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {};
    service = new IndexingService(mockPrisma);
  });

  it('should deposit Crossref XML metadata payload and return indexed status', () => {
    const cr = service.depositCrossref({
      publicationId: 'pub-101',
      doi: '10.5555/publishora.2026.001',
    });

    expect(cr.batchId).toContain('cr-batch-');
    expect(cr.crossrefXml).toContain('doi_batch');
    expect(cr.submissionStatus).toBe('COMPLETED_INDEXED');
  });

  it('should throw BadRequestException when depositing Crossref without DOI', () => {
    expect(() => service.depositCrossref({ publicationId: 'pub-101', doi: '' })).toThrow(BadRequestException);
  });

  it('should generate NLM JATS XML package and upload to PMC SFTP server', () => {
    const pmc = service.uploadPmcJats('pub-101');

    expect(pmc.packageId).toContain('pmc-pkg-');
    expect(pmc.sftpEndpoint).toContain('ftp.ncbi.nlm.nih.gov');
    expect(pmc.status).toBe('PACKAGED_AND_UPLOADED');
  });

  it('should generate KBART v2.0 TSV feed for Scopus and Web of Science', () => {
    const kbart = service.getKbartFeed();

    expect(kbart.format).toBe('KBART v2.0 TSV');
    expect(kbart.tsvFeedContent).toContain('publication_title');
    expect(kbart.scopusSyncStatus).toBe('SYNCED');
    expect(kbart.doajStatus).toBe('SEAL_QUALIFIED');
  });
});
