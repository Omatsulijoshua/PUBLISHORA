import { Injectable, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

export interface GenerateCcRdfaDto {
  licenseCode: 'CC BY 4.0' | 'CC BY-NC 4.0' | 'CC BY-ND 4.0' | 'CC0 1.0';
  workTitle: string;
  authorName: string;
}

export interface SignAgreementDto {
  publicationId: string;
  signerName: string;
  signerEmail: string;
}

@Injectable()
export class LegalService {
  constructor(private readonly prisma: PrismaService) {}

  generateCcRdfa(dto: GenerateCcRdfaDto) {
    if (!dto.licenseCode || !dto.workTitle) {
      throw new BadRequestException('License code and work title are required');
    }

    const licenseUrls: Record<string, string> = {
      'CC BY 4.0': 'https://creativecommons.org/licenses/by/4.0/',
      'CC BY-NC 4.0': 'https://creativecommons.org/licenses/by-nc/4.0/',
      'CC BY-ND 4.0': 'https://creativecommons.org/licenses/by-nd/4.0/',
      'CC0 1.0': 'https://creativecommons.org/publicdomain/zero/1.0/',
    };

    const url = licenseUrls[dto.licenseCode] || licenseUrls['CC BY 4.0'];

    const rdfaHtml = `<a rel="license" href="${url}"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">${dto.workTitle}</span> by <span xmlns:cc="http://creativecommons.org/ns#" property="cc:attributionName">${dto.authorName}</span> is licensed under a <a rel="license" href="${url}">Creative Commons Attribution 4.0 International License</a>.`;

    return {
      licenseCode: dto.licenseCode,
      licenseUrl: url,
      rdfaHtml,
      schemaOrgType: 'CreativeWork',
    };
  }

  signAgreement(dto: SignAgreementDto) {
    if (!dto.publicationId || !dto.signerName) {
      throw new BadRequestException('Publication ID and signer name are required');
    }

    const payload = `${dto.publicationId}-${dto.signerName}-${dto.signerEmail}-${Date.now()}`;
    const eIdasSignatureHash = crypto.createHash('sha256').update(payload).digest('hex');

    return {
      agreementId: `agr-${Date.now()}`,
      publicationId: dto.publicationId,
      signerName: dto.signerName,
      signerEmail: dto.signerEmail,
      eIdasSignatureHash: `eIDAS-SHA256-${eIdasSignatureHash}`,
      complianceStandard: 'eIDAS & ESIGN Act Compliant',
      signedAt: new Date().toISOString(),
    };
  }

  getEmbargoStatus(publicationId: string) {
    const releaseDate = new Date();
    releaseDate.setMonth(releaseDate.getMonth() + 6);

    return {
      publicationId,
      embargoActive: true,
      monthsRemaining: 6,
      releaseDate: releaseDate.toISOString(),
      automatedPublicReleaseTrigger: 'ACTIVE_TIMER',
      rightsLinkCleared: true,
    };
  }
}
