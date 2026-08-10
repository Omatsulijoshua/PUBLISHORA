import { SystemHealthService } from './system-health.service';

describe('Phase 45 — System Health & Production Launch Specs', () => {
  let service: SystemHealthService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {};
    service = new SystemHealthService(mockPrisma);
  });

  it('should audit all 45 platform modules and return 100% operational health score', () => {
    const audit = service.auditSystemHealth();

    expect(audit.totalModulesCount).toBe(45);
    expect(audit.operationalModulesCount).toBe(45);
    expect(audit.healthScorePercent).toBe(100);
    expect(audit.systemStatus).toContain('100% OPERATIONAL');
    expect(audit.verifiedModules.length).toBe(45);
  });

  it('should verify strict Preparation Mode vs. Publishing Mode compliance rules', () => {
    const matrix = service.getModeMatrix();

    expect(matrix.preparationModeRules.doiIssuanceAllowed).toBe(false);
    expect(matrix.preparationModeRules.isbnIssuanceAllowed).toBe(false);
    expect(matrix.preparationModeRules.issnIssuanceAllowed).toBe(false);
    expect(matrix.preparationModeRules.status).toContain('ZERO_FAKE_IDENTIFIERS');
    expect(matrix.publishingModeRules.doiIssuanceAllowed).toBe(true);
  });

  it('should generate official Production Launch Sign-Off Certificate', () => {
    const cert = service.generateLaunchCertificate();

    expect(cert.certificateId).toContain('PUBLISHORA-LAUNCH-2026-FINAL');
    expect(cert.phasesCompleted).toContain('45 / 45 PHASES');
    expect(cert.launchStatus).toBe('APPROVED_FOR_GLOBAL_PRODUCTION_DEPLOYMENT');
    expect(cert.repositoryUrl).toBe('https://github.com/Omatsulijoshua/PUBLISHORA');
  });
});
