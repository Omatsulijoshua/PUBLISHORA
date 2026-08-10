import { ArchivingService } from './archiving.service';
import { BadRequestException } from '@nestjs/common';

describe('Phase 34 — Institutional Archiving & Digital Preservation Specs', () => {
  let service: ArchivingService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {};
    service = new ArchivingService(mockPrisma);
  });

  it('should generate BagIt v1.0 archive package with SHA-512 checksum manifest', () => {
    const bag = service.generateBagItPackage({
      publicationId: 'pub-101',
      title: 'Quantum Computing Foundations',
    });

    expect(bag.bagItVersion).toBe('BagIt v1.0');
    expect(bag.manifestFile).toBe('manifest-sha512.txt');
    expect(bag.checksum.length).toBe(128); // 128-char hex SHA-512 hash
    expect(bag.status).toBe('BAG_PACKAGED_AND_VERIFIED');
  });

  it('should throw BadRequestException when generating BagIt without publicationId', () => {
    expect(() => service.generateBagItPackage({ publicationId: '', title: 'Test' })).toThrow(BadRequestException);
  });

  it('should deposit publication to Portico with METS/MODS XML metadata', () => {
    const deposit = service.depositPortico('pub-101');

    expect(deposit.depositId).toContain('portico-');
    expect(deposit.metsXml).toContain('mods:title');
    expect(deposit.status).toBe('DEPOSITED_AND_INDEXED');
  });

  it('should return CLOCKSS/LOCKSS preservation status and 100% bit-rot integrity score', () => {
    const status = service.getPreservationStatus('pub-101');

    expect(status.clockssStatus).toContain('PRESERVED');
    expect(status.bitRotIntegrityScorePercent).toBe(100.0);
    expect(status.dspaceAutoArchived).toBe(true);
  });
});
