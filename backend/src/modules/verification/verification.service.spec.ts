import { VerificationService } from './verification.service';

describe('Phase 12 — Global Publication Verification & Anti-Piracy Specs', () => {
  let service: VerificationService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      publication: {
        findUnique: jest.fn(),
      },
      verificationRecord: {
        create: jest.fn().mockImplementation((args) => Promise.resolve({ id: 'rec-1', ...args.data })),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn().mockImplementation((args) => Promise.resolve({ id: args.where.id, ...args.data })),
      },
    };
    service = new VerificationService(mockPrisma);
  });

  it('should issue verification record with QR code URL', async () => {
    mockPrisma.publication.findUnique.mockResolvedValue({
      id: 'pub-100',
      title: 'Quantum Entanglement Protocols',
      createdAt: new Date('2026-01-01'),
    });

    const record = await service.issueVerificationRecord({
      publicationId: 'pub-100',
    });

    expect(record.internalId).toContain('PUB-VERIFY-');
    expect(record.qrCodeUrl).toContain('https://api.qrserver.com/v1/create-qr-code/');
    expect(record.status).toBe('VERIFIED');
    expect(mockPrisma.verificationRecord.create).toHaveBeenCalled();
  });

  it('should resolve verification record with SHA-256 cryptographic checksum', async () => {
    mockPrisma.verificationRecord.findFirst.mockResolvedValue({
      internalId: 'PUB-VERIFY-84729103',
      status: 'VERIFIED',
      publication: {
        id: 'pub-100',
        title: 'Quantum Entanglement Protocols',
        createdAt: new Date('2026-01-01'),
      },
    });

    const result = await service.resolveRecord('PUB-VERIFY-84729103');

    expect(result.internalId).toBe('PUB-VERIFY-84729103');
    expect(result.sha256Checksum.length).toBe(64); // SHA-256 hex string length
  });

  it('should post RETRACTION notice and update verification status to RETRACTED', async () => {
    mockPrisma.verificationRecord.findUnique.mockResolvedValue({
      internalId: 'PUB-VERIFY-84729103',
      status: 'VERIFIED',
      retractionNotice: null,
    });

    const result = await service.postNotice({
      internalId: 'PUB-VERIFY-84729103',
      noticeType: 'RETRACTION',
      noticeText: 'Retracted due to data error in Figure 3.',
    });

    expect(result.status).toBe('RETRACTED');
    expect(result.retractionNotice).toBe('Retracted due to data error in Figure 3.');
    expect(mockPrisma.verificationRecord.update).toHaveBeenCalled();
  });
});
