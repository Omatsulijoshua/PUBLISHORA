import { PreprintsService } from './preprints.service';

describe('Phase 21 — Preprint Server & Versioned Instant Open Access Specs', () => {
  let service: PreprintsService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {};
    service = new PreprintsService(mockPrisma);
  });

  it('should submit a new preprint with 24h rapid screening pass and DOI minting', async () => {
    const preprint = await service.submitPreprint({
      title: 'Photonic Topological Insulators for High-Speed Optical Interconnects',
      abstract: 'We report experimental realization of topological insulator waveguides...',
      category: 'Photonics',
      authors: [{ name: 'Kenji Sato', email: 'kenji@tokyo.edu' }],
      license: 'CC-BY 4.0 International',
    });

    expect(preprint.screeningStatus).toBe('PASSED_SCREENING');
    expect(preprint.doi).toContain('10.5555/publishora.preprint.2026.');
    expect(preprint.versions.length).toBe(1);
  });

  it('should add a new version v2 to existing preprint with revision notes', async () => {
    const v2 = await service.addVersion({
      preprintId: 'prep-2026-881',
      revisionNotes: 'Updated manuscript section 3.2 with cryo-CMOS phase margins.',
    });

    expect(v2.versionNumber).toBe(3);
    expect(v2.revisionNotes).toBe('Updated manuscript section 3.2 with cryo-CMOS phase margins.');
  });

  it('should link preprint to published Version of Record (VOR) journal article', async () => {
    const vor = await service.linkVor({
      preprintId: 'prep-2026-881',
      journalArticleDoi: '10.5555/publishora.2026.001',
      journalTitle: 'PUBLISHORA Quantum Systems',
    });

    expect(vor.journalArticleDoi).toBe('10.5555/publishora.2026.001');
    expect(vor.journalTitle).toBe('PUBLISHORA Quantum Systems');
  });
});
