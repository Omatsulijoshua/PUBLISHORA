import { SecurityService } from './security.service';

describe('Phase 25 — Platform Security & Audit Logging Specs', () => {
  let service: SecurityService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {};
    service = new SecurityService(mockPrisma);
  });

  it('should record tamper-evident audit log with SHA-256 hash chaining', async () => {
    const log1 = await service.recordAuditLog({
      actorUserId: 'user-101',
      action: 'USER_LOGIN',
      resource: 'AUTH_GATEWAY',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0',
    });

    expect(log1.hash.length).toBe(64);

    const log2 = await service.recordAuditLog({
      actorUserId: 'user-101',
      action: 'UPDATE_ROLE',
      resource: 'USER_RBAC',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0',
    });

    expect(log2.previousHash).toBe(log1.hash);
    expect(log2.hash.length).toBe(64);
  });

  it('should generate GDPR Article 15 DSAR personal data export', async () => {
    const exportData = await service.exportGdprData('user-101');

    expect(exportData.dataSubjectId).toBe('user-101');
    expect(exportData.complianceFrameworks).toContain('GDPR_ART15');
    expect(exportData.personalData.email).toBe('ada@mit.edu');
  });

  it('should return SOC2 Type II security compliance controls status', () => {
    const soc2 = service.getSoc2ComplianceStatus();

    expect(soc2.overallStatus).toBe('COMPLIANT_SOC2_TYPE_II');
    expect(soc2.controls.length).toBeGreaterThanOrEqual(3);
    expect(soc2.controls[0].status).toBe('PASS');
  });
});
