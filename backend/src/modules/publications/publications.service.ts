import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PublicationStatus, OperatingMode } from '@prisma/client';

export interface CreatePublicationDto {
  title: string;
  subtitle?: string;
  publicationTypeCode: string;
  abstractText?: string;
  keywords?: string[];
  rights?: string;
  license?: string;
  ownerUserId: string;
  countryCode?: string;
  language?: string;
}

export interface CreateVersionDto {
  publicationId: string;
  title: string;
  contentJson: string;
  changeSummary?: string;
  createdById: string;
}

@Injectable()
export class PublicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createPublication(dto: CreatePublicationDto) {
    const pubType = await this.prisma.publicationType.findUnique({
      where: { code: dto.publicationTypeCode },
    });

    if (!pubType) {
      throw new NotFoundException(`Publication type ${dto.publicationTypeCode} not found`);
    }

    const publication = await this.prisma.publication.create({
      data: {
        title: dto.title,
        subtitle: dto.subtitle,
        publicationTypeId: pubType.id,
        abstractText: dto.abstractText,
        keywords: dto.keywords ? JSON.stringify(dto.keywords) : null,
        rights: dto.rights || 'Copyright © 2026 Author',
        license: dto.license || 'All Rights Reserved',
        status: PublicationStatus.DRAFT,
        mode: OperatingMode.PREPARATION_MODE,
        countryCode: dto.countryCode || 'US',
        language: dto.language || 'en',
        ownerUserId: dto.ownerUserId,
        createdById: dto.ownerUserId,
        authors: {
          create: [
            {
              name: 'Primary Author',
              authorOrder: 1,
              isCorresponding: true,
              userId: dto.ownerUserId,
            },
          ],
        },
        versions: {
          create: [
            {
              versionNumber: 1,
              title: dto.title,
              contentJson: JSON.stringify({
                sections: [
                  { type: 'heading1', text: dto.title },
                  { type: 'paragraph', text: dto.abstractText || 'Start writing your manuscript here...' },
                ],
              }),
              changeSummary: 'Initial manuscript draft created',
              createdById: dto.ownerUserId,
            },
          ],
        },
      },
      include: {
        publicationType: true,
        authors: true,
        versions: true,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: dto.ownerUserId,
        action: 'PUBLICATION_CREATED',
        resource: `Publication:${publication.id}`,
        metadataJson: JSON.stringify({ title: publication.title, type: pubType.code }),
      },
    });

    return publication;
  }

  async findAll(ownerUserId?: string) {
    return this.prisma.publication.findMany({
      where: ownerUserId ? { ownerUserId } : undefined,
      include: {
        publicationType: true,
        authors: true,
        versions: {
          orderBy: { versionNumber: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const publication = await this.prisma.publication.findUnique({
      where: { id },
      include: {
        publicationType: true,
        authors: true,
        contributors: true,
        versions: {
          orderBy: { versionNumber: 'desc' },
        },
        documents: {
          include: { comments: true },
        },
        references: true,
        verification: true,
      },
    });

    if (!publication) {
      throw new NotFoundException(`Publication ${id} not found`);
    }

    return publication;
  }

  async createVersion(dto: CreateVersionDto) {
    const pub = await this.findOne(dto.publicationId);
    const nextVersionNum = pub.currentVersionNum + 1;

    const version = await this.prisma.publicationVersion.create({
      data: {
        publicationId: dto.publicationId,
        versionNumber: nextVersionNum,
        title: dto.title,
        contentJson: dto.contentJson,
        changeSummary: dto.changeSummary || `Version ${nextVersionNum} saved`,
        createdById: dto.createdById,
      },
    });

    await this.prisma.publication.update({
      where: { id: dto.publicationId },
      data: {
        currentVersionNum: nextVersionNum,
        title: dto.title,
      },
    });

    return version;
  }

  async restoreVersion(publicationId: string, versionId: string) {
    const version = await this.prisma.publicationVersion.findUnique({
      where: { id: versionId },
    });

    if (!version || version.publicationId !== publicationId) {
      throw new NotFoundException('Version not found for this publication');
    }

    return this.createVersion({
      publicationId,
      title: version.title,
      contentJson: version.contentJson || '{}',
      changeSummary: `Restored from Version ${version.versionNumber}`,
      createdById: version.createdById,
    });
  }
}
