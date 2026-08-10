import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IdentifierType } from '@prisma/client';

export interface RegisterIdentifierDto {
  publicationId: string;
  type: IdentifierType;
  customValue?: string;
}

@Injectable()
export class IdentifiersService {
  private readonly PREFIX_DOI = '10.5555/publishora.2026.';

  constructor(private readonly prisma: PrismaService) {}

  async registerIdentifier(dto: RegisterIdentifierDto) {
    const pub = await this.prisma.publication.findUnique({
      where: { id: dto.publicationId },
    });

    if (!pub) {
      throw new NotFoundException(`Publication ${dto.publicationId} not found`);
    }

    if (pub.mode === 'PREPARATION_MODE' && (dto.type === 'DOI' || dto.type === 'ISBN' || dto.type === 'ISSN')) {
      throw new BadRequestException(
        `Legitimate ${dto.type} issuance requires Publishing Mode. In Preparation Mode, register identifiers directly through your external publisher or Zenodo/Crossref registrar.`,
      );
    }

    let value = dto.customValue;
    let agency = 'PUBLISHORA Agency';
    if (!value) {
      if (dto.type === 'DOI') {
        value = `${this.PREFIX_DOI}${pub.id.substring(0, 8)}`;
        agency = 'Crossref';
      }
      if (dto.type === 'ISBN') {
        value = `978-3-16-148410-${Math.floor(Math.random() * 9)}`;
        agency = 'Bowker / ISBN Agency';
      }
      if (dto.type === 'ISSN') {
        value = `2981-${Math.floor(1000 + Math.random() * 9000)}`;
        agency = 'ISSN International Centre';
      }
      if (dto.type === 'INTERNAL_ID') {
        value = `PUB-ID-${Math.floor(100000 + Math.random() * 900000)}`;
        agency = 'PUBLISHORA System';
      }
    }

    return this.prisma.identifier.create({
      data: {
        publicationId: dto.publicationId,
        type: dto.type,
        value: value || 'UNASSIGNED',
        registrationAgency: agency,
        status: 'REGISTERED',
      },
    });
  }

  async getIdentifiersByPublication(publicationId: string) {
    return this.prisma.identifier.findMany({
      where: { publicationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  generateCrossrefXml(pub: any) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<doi_batch xmlns="http://www.crossref.org/schema/5.3.1" version="5.3.1">
  <head>
    <doi_batch_id>publishora_${pub.id.substring(0, 8)}</doi_batch_id>
    <timestamp>${Date.now()}</timestamp>
    <depositor>
      <depositor_name>PUBLISHORA Press</depositor_name>
      <email_address>deposits@publishora.org</email_address>
    </depositor>
  </head>
  <body>
    <journal>
      <journal_metadata>
        <full_title>PUBLISHORA Academic Press</full_title>
      </journal_metadata>
      <journal_article publication_type="full_text">
        <titles><title>${pub.title}</title></titles>
        <doi_data>
          <doi>${pub.doi || `${this.PREFIX_DOI}${pub.id.substring(0, 8)}`}</doi>
          <resource>https://publishora.org/publications/${pub.id}</resource>
        </doi_data>
      </journal_article>
    </journal>
  </body>
</doi_batch>`;
  }
}
