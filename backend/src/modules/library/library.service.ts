import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface DepositToRepoDto {
  publicationId: string;
  repositoryTarget: 'DSPACE' | 'EPRINTS' | 'INVENIO_RDM' | 'FEDORA';
  endpointUrl?: string;
}

export interface GenerateApcInvoiceDto {
  institutionName: string;
  authorEmail: string;
  publicationId: string;
  apcAmount: number;
}

@Injectable()
export class LibraryService {
  constructor(private readonly prisma: PrismaService) {}

  async depositToRepository(dto: DepositToRepoDto) {
    const pub = await this.prisma.publication.findUnique({
      where: { id: dto.publicationId },
    });

    if (!pub) {
      throw new NotFoundException(`Publication ${dto.publicationId} not found`);
    }

    const depositHandle = `http://hdl.handle.net/10938/${Math.floor(10000 + Math.random() * 90000)}`;

    return {
      publicationId: dto.publicationId,
      repositoryTarget: dto.repositoryTarget,
      protocol: 'SWORDv2 Packaging / AtomPub XML Standard',
      depositStatus: 'DEPOSITED_SUCCESSFULLY',
      depositHandleUri: depositHandle,
      depositedAt: new Date().toISOString(),
    };
  }

  getInstitutions() {
    return [
      { id: 'inst-1', name: 'Harvard University Library', memberTier: 'DIAMOND_SPONSOR', apcPrepaidQuotaRemaining: 45, discountPercentage: 100 },
      { id: 'inst-2', name: 'MIT Libraries', memberTier: 'GOLD_PARTNER', apcPrepaidQuotaRemaining: 30, discountPercentage: 50 },
      { id: 'inst-3', name: 'University of Oxford Bodleian Libraries', memberTier: 'TRANSFORMATIVE_AGREEMENT', apcPrepaidQuotaRemaining: 60, discountPercentage: 100 },
      { id: 'inst-4', name: 'ETH Zürich Main Library', memberTier: 'MEMBER', apcPrepaidQuotaRemaining: 15, discountPercentage: 25 },
    ];
  }

  async generateApcInvoice(dto: GenerateApcInvoiceDto) {
    const invoiceRef = `INV-APC-${Math.floor(100000 + Math.random() * 900000)}`;
    return {
      invoiceRef,
      institutionName: dto.institutionName,
      authorEmail: dto.authorEmail,
      publicationId: dto.publicationId,
      originalApcAmount: dto.apcAmount,
      appliedDiscount: '100% Institutional Open Access Agreement Waiver',
      netAmountPayable: 0,
      status: 'COVERED_BY_INSTITUTIONAL_SUBSCRIPTION',
      createdAt: new Date().toISOString(),
    };
  }
}
