import { DistributionService } from './distribution.service';

describe('Phase 11 — Distribution Engine & OAI-PMH Repository Specs', () => {
  let service: DistributionService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      publication: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'pub-01',
            title: 'Quantum Entanglement Protocols',
            createdAt: new Date('2026-01-01'),
            abstractText: 'Study on distributed quantum computing.',
            publicationType: { name: 'Journal Article', code: 'JOURNAL_ARTICLE' },
            authors: [{ name: 'Ada Lovelace' }],
          },
        ]),
        findUnique: jest.fn().mockResolvedValue({
          id: 'pub-01',
          title: 'Quantum Entanglement Protocols',
          createdAt: new Date('2026-01-01'),
          publicationType: { name: 'Journal Article', code: 'JOURNAL_ARTICLE' },
          authors: [{ name: 'Ada Lovelace' }],
          identifiers: [{ type: 'DOI', value: '10.5555/publishora.2026.pub-01' }],
        }),
      },
    };
    service = new DistributionService(mockPrisma);
  });

  it('should generate valid OAI-PMH 2.0 Identify response', () => {
    const xml = service.generateOaiPmhIdentify();
    expect(xml).toContain('<OAI-PMH');
    expect(xml).toContain('<repositoryName>PUBLISHORA Global Academic Repository</repositoryName>');
    expect(xml).toContain('<protocolVersion>2.0</protocolVersion>');
  });

  it('should generate valid OAI-PMH 2.0 ListRecords response with oai_dc Dublin Core tags', async () => {
    const xml = await service.generateOaiPmhListRecords();
    expect(xml).toContain('<ListRecords>');
    expect(xml).toContain('<dc:creator>Ada Lovelace</dc:creator>');
    expect(xml).toContain('<dc:title>Quantum Entanglement Protocols</dc:title>');
  });

  it('should generate Google Scholar Highwire HTML citation tags', async () => {
    const result = await service.generateGoogleScholarTags('pub-01');
    expect(result.htmlTags).toContain('<meta name="citation_title" content="Quantum Entanglement Protocols">');
    expect(result.htmlTags).toContain('<meta name="citation_author" content="Ada Lovelace">');
    expect(result.htmlTags).toContain('<meta name="citation_doi" content="10.5555/publishora.2026.pub-01">');
  });
});
