import { IdentifiersService } from './identifiers.service';
import { BadRequestException } from '@nestjs/common';

describe('Phase 10 — Persistent Identifiers & Crossref Deposit Specs', () => {
  let service: IdentifiersService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      publication: {
        findUnique: jest.fn(),
      },
      identifier: {
        create: jest.fn().mockImplementation((args) => Promise.resolve({ id: 'id-1', ...args.data })),
        findMany: jest.fn(),
      },
    };
    service = new IdentifiersService(mockPrisma);
  });

  it('should register legitimate DOI in Publishing Mode with prefix 10.5555/publishora.2026.', async () => {
    mockPrisma.publication.findUnique.mockResolvedValue({ id: 'pub-88', mode: 'PUBLISHING_MODE' });

    const result = await service.registerIdentifier({
      publicationId: 'pub-88',
      type: 'DOI',
    });

    expect(result.type).toBe('DOI');
    expect(result.value).toContain('10.5555/publishora.2026.');
    expect(mockPrisma.identifier.create).toHaveBeenCalled();
  });

  it('should block fake DOI registration in Preparation Mode', async () => {
    mockPrisma.publication.findUnique.mockResolvedValue({ id: 'pub-99', mode: 'PREPARATION_MODE' });

    await expect(
      service.registerIdentifier({
        publicationId: 'pub-99',
        type: 'DOI',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should generate valid Crossref DOI deposit XML', () => {
    const pub = { id: 'pub-88', title: 'Quantum Computing Foundations', doi: '10.5555/publishora.2026.pub-88' };
    const xml = service.generateCrossrefXml(pub);

    expect(xml).toContain('<doi_batch');
    expect(xml).toContain('<title>Quantum Computing Foundations</title>');
    expect(xml).toContain('<doi>10.5555/publishora.2026.pub-88</doi>');
  });
});
