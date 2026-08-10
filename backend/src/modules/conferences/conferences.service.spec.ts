import { ConferencesService } from './conferences.service';

describe('Phase 19 — Conferences & Symposia Management Specs', () => {
  let service: ConferencesService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {};
    service = new ConferencesService(mockPrisma);
  });

  it('should create a new academic conference event with CFP deadline', async () => {
    const conf = await service.createConference({
      name: 'IEEE International Conference on Distributed AI',
      acronym: 'ICDAI 2026',
      location: 'Tokyo, Japan',
      startDate: '2026-11-10',
      endDate: '2026-11-14',
      cfpDeadline: '2026-09-15',
      tracks: ['Agentic AI', 'Distributed Deep Learning'],
    });

    expect(conf.acronym).toBe('ICDAI 2026');
    expect(conf.tracks.length).toBe(2);
  });

  it('should compile proceedings volume with Table of Contents and ISBN', async () => {
    const proceedings = await service.compileProceedings({
      conferenceId: 'conf-2026-qis',
      volumeTitle: 'Proceedings of QIDS 2026',
      isbn: '978-3-16-148499-1',
    });

    expect(proceedings.volumeTitle).toBe('Proceedings of QIDS 2026');
    expect(proceedings.isbn).toBe('978-3-16-148499-1');
    expect(proceedings.tableOfContents.length).toBeGreaterThanOrEqual(2);
  });
});
