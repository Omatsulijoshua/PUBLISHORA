import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateTenantDto {
  pressName: string;
  subdomain: string;
  customDomain?: string;
  institutionName: string;
  primaryColor?: string;
}

export interface ConfigureSsoDto {
  tenantId: string;
  idpEntityId: string;
  ssoUrl: string;
  certificatePem: string;
}

@Injectable()
export class TenantsService {
  private mockTenants: any[] = [
    {
      id: 'tenant-mit-press',
      pressName: 'MIT Quantum Academic Press',
      subdomain: 'mitquantum',
      customDomain: 'press.mit.edu',
      domainStatus: 'ACTIVE_SSL',
      institutionName: 'Massachusetts Institute of Technology',
      primaryColor: '#A31F34',
      ssoConfig: {
        provider: 'SHIBBOLETH_SAML2',
        idpEntityId: 'https://idp.mit.edu/shibboleth',
        status: 'ENABLED',
      },
      apiKey: 'pub_live_mit_8472910384712049',
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  async createTenant(dto: CreateTenantDto) {
    const tenant = {
      id: `tenant-${Date.now()}`,
      pressName: dto.pressName,
      subdomain: dto.subdomain,
      customDomain: dto.customDomain || `${dto.subdomain}.publishora.org`,
      domainStatus: dto.customDomain ? 'PENDING_CNAME_VERIFICATION' : 'ACTIVE_SSL',
      institutionName: dto.institutionName,
      primaryColor: dto.primaryColor || '#6366F1',
      ssoConfig: null,
      apiKey: `pub_live_${dto.subdomain}_${Date.now()}`,
    };

    this.mockTenants.push(tenant);
    return tenant;
  }

  async getTenants() {
    return this.mockTenants;
  }

  async getTenantDetails(id: string) {
    const tenant = this.mockTenants.find((t) => t.id === id || id === 'tenant-mit-press');
    if (!tenant) {
      throw new NotFoundException(`Tenant press ${id} not found`);
    }
    return tenant;
  }

  async verifyCname(id: string) {
    const tenant = await this.getTenantDetails(id);
    tenant.domainStatus = 'ACTIVE_SSL';
    return {
      customDomain: tenant.customDomain,
      domainStatus: tenant.domainStatus,
      sslIssuedAt: new Date().toISOString(),
    };
  }

  async configureSso(dto: ConfigureSsoDto) {
    const tenant = await this.getTenantDetails(dto.tenantId);
    tenant.ssoConfig = {
      provider: 'SHIBBOLETH_SAML2',
      idpEntityId: dto.idpEntityId,
      ssoUrl: dto.ssoUrl,
      status: 'ENABLED',
      configuredAt: new Date().toISOString(),
    };
    return tenant.ssoConfig;
  }
}
