import { AvailabilityService } from './availability.service';
import { AvailabilityStatus, OperatingMode } from '@prisma/client';

describe('Phase 2 — Publishing Availability Engine Specs', () => {
  let service: AvailabilityService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      country: {
        findUnique: jest.fn(),
      },
    };
    service = new AvailabilityService(mockPrisma);
  });

  it('should return FULLY_AVAILABLE and PUBLISHING_MODE for supported country (Nigeria)', async () => {
    mockPrisma.country.findUnique.mockResolvedValue({
      isoCode: 'NG',
      name: 'Nigeria',
      defaultStatus: AvailabilityStatus.FULLY_AVAILABLE,
      policies: [{ publishingAllowed: true, printAllowed: true, digitalAllowed: true, peerReviewAllowed: true }],
      services: [],
    });

    const result = await service.checkAvailability({ countryCode: 'NG' });

    expect(result.status).toBe(AvailabilityStatus.FULLY_AVAILABLE);
    expect(result.recommendedMode).toBe(OperatingMode.PUBLISHING_MODE);
    expect(result.publishingAllowed).toBe(true);
    expect(result.headline).toContain('Publishing is available');
  });

  it('should return PREPARATION_ONLY and PREPARATION_MODE for preparation-only region', async () => {
    mockPrisma.country.findUnique.mockResolvedValue({
      isoCode: 'RA',
      name: 'Restricted Region Alpha',
      defaultStatus: AvailabilityStatus.PREPARATION_ONLY,
      policies: [{ publishingAllowed: false, printAllowed: false, digitalAllowed: true, peerReviewAllowed: false, notes: 'Preparation mode active.' }],
      services: [],
    });

    const result = await service.checkAvailability({ countryCode: 'RA' });

    expect(result.status).toBe(AvailabilityStatus.PREPARATION_ONLY);
    expect(result.recommendedMode).toBe(OperatingMode.PREPARATION_MODE);
    expect(result.publishingAllowed).toBe(false);
    expect(result.preparationAllowed).toBe(true);
    expect(result.headline).toBe('Preparation Mode');
  });

  it('should return LIMITED status for partially supported country', async () => {
    mockPrisma.country.findUnique.mockResolvedValue({
      isoCode: 'KE',
      name: 'Kenya',
      defaultStatus: AvailabilityStatus.LIMITED,
      policies: [{ publishingAllowed: true, printAllowed: false, digitalAllowed: true, peerReviewAllowed: true }],
      services: [],
    });

    const result = await service.checkAvailability({ countryCode: 'KE' });

    expect(result.status).toBe(AvailabilityStatus.LIMITED);
    expect(result.recommendedMode).toBe(OperatingMode.PUBLISHING_MODE);
    expect(result.printAllowed).toBe(false);
    expect(result.digitalAllowed).toBe(true);
  });
});
