import { DisasterRecoveryService } from './disaster-recovery.service';

describe('Phase 26 — Automated Backup & Disaster Recovery Specs', () => {
  let service: DisasterRecoveryService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {};
    service = new DisasterRecoveryService(mockPrisma);
  });

  it('should create point-in-time database snapshot with SHA-256 checksum', async () => {
    const snap = await service.createSnapshot({
      label: 'MANUAL_PRE_MIGRATION_PITR',
      region: 'us-east-1',
    });

    expect(snap.id).toContain('snap-');
    expect(snap.checksumSha256.length).toBe(64);
    expect(snap.integrityStatus).toBe('VERIFIED_VALID');
  });

  it('should return cluster health with sub-minute RPO and sub-5-minute RTO metrics', () => {
    const health = service.getClusterHealthStatus();

    expect(health.activePrimaryRegion).toBe('us-east-1');
    expect(health.currentRpoSeconds).toBeLessThan(60);
    expect(health.currentRtoMinutes).toBeLessThan(5);
    expect(health.regions.length).toBe(3);
  });

  it('should initiate controlled multi-region failover to standby region', async () => {
    const failover = await service.initiateFailover({
      targetRegion: 'eu-west-1',
      reason: 'Scheduled latency optimization test',
    });

    expect(failover.previousRegion).toBe('us-east-1');
    expect(failover.newPrimaryRegion).toBe('eu-west-1');
    expect(failover.dnsFailoverStatus).toBe('PROPAGATED_SUCCESSFULLY');
  });
});
