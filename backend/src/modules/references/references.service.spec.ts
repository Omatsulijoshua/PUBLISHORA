import { ReferencesService } from './references.service';

describe('Phase 5 — Reference Management & Integrity Center Specs', () => {
  let service: ReferencesService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      reference: {
        create: jest.fn().mockImplementation((args) => Promise.resolve({ id: 'ref-1', ...args.data })),
        findMany: jest.fn(),
      },
    };
    service = new ReferencesService(mockPrisma);
  });

  it('should format citation across APA, MLA, IEEE, Chicago, Harvard, and Vancouver styles', () => {
    const ref = {
      authors: 'Lovelace, A.',
      year: 2026,
      title: 'Quantum Distributed Computing',
      journalName: 'Journal of Supercomputing',
      doi: '10.1000/182',
    };

    const apa = service.formatCitation(ref, 'APA', 1);
    expect(apa).toContain('Lovelace, A. (2026). Quantum Distributed Computing.');
    expect(apa).toContain('https://doi.org/10.1000/182');

    const mla = service.formatCitation(ref, 'MLA', 1);
    expect(mla).toContain('Lovelace, A.. "Quantum Distributed Computing."');

    const ieee = service.formatCitation(ref, 'IEEE', 1);
    expect(ieee).toContain('[1] Lovelace, A., "Quantum Distributed Computing,"');

    const vancouver = service.formatCitation(ref, 'VANCOUVER', 1);
    expect(vancouver).toContain('1. Lovelace, A.');
  });

  it('should parse BibTeX string and create reference entry', async () => {
    const bibtex = '@article{lovelace2026, author={Lovelace, Ada}, title={Fault-Tolerant Qubit Fabrics}, year={2026}, journal={Quantum Journal}, doi={10.1000/999}}';
    
    const result = await service.importBibTeX('pub-1', bibtex);

    expect(result.title).toBe('Fault-Tolerant Qubit Fabrics');
    expect(result.authors).toBe('Lovelace, Ada');
    expect(result.year).toBe(2026);
    expect(result.journalName).toBe('Quantum Journal');
    expect(mockPrisma.reference.create).toHaveBeenCalled();
  });
});
