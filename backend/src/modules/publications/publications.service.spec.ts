import { PublicationsService } from './publications.service';
import { PublicationStatus, OperatingMode } from '@prisma/client';

describe('Phase 3 — Publication Workspace & Version Control Specs', () => {
  let service: PublicationsService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      publicationType: {
        findUnique: jest.fn(),
      },
      publication: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      publicationVersion: {
        create: jest.fn(),
        findUnique: jest.fn(),
      },
      auditLog: {
        create: jest.fn(),
      },
    };
    service = new PublicationsService(mockPrisma);
  });

  it('should initialize a new publication with Version 1 snapshot and DRAFT status', async () => {
    mockPrisma.publicationType.findUnique.mockResolvedValue({ id: 'pt-1', code: 'JOURNAL_ARTICLE', name: 'Journal Article' });
    mockPrisma.publication.create.mockResolvedValue({
      id: 'pub-100',
      title: 'Quantum Entanglement Research',
      status: PublicationStatus.DRAFT,
      mode: OperatingMode.PREPARATION_MODE,
      currentVersionNum: 1,
      ownerUserId: 'user-1',
    });

    const result = await service.createPublication({
      title: 'Quantum Entanglement Research',
      publicationTypeCode: 'JOURNAL_ARTICLE',
      ownerUserId: 'user-1',
    });

    expect(result.id).toBe('pub-100');
    expect(result.status).toBe(PublicationStatus.DRAFT);
    expect(mockPrisma.publication.create).toHaveBeenCalled();
    expect(mockPrisma.auditLog.create).toHaveBeenCalled();
  });

  it('should create new version snapshot and increment currentVersionNum', async () => {
    mockPrisma.publication.findUnique.mockResolvedValue({
      id: 'pub-100',
      currentVersionNum: 1,
    });
    mockPrisma.publicationVersion.create.mockResolvedValue({
      id: 'v2',
      versionNumber: 2,
      title: 'Quantum Entanglement Research v2',
    });

    const result = await service.createVersion({
      publicationId: 'pub-100',
      title: 'Quantum Entanglement Research v2',
      contentJson: '{"text": "updated"}',
      createdById: 'user-1',
    });

    expect(result.versionNumber).toBe(2);
    expect(mockPrisma.publication.update).toHaveBeenCalledWith({
      where: { id: 'pub-100' },
      data: { currentVersionNum: 2, title: 'Quantum Entanglement Research v2' },
    });
  });
});
