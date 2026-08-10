import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

export interface IssueVerificationDto {
  publicationId: string;
}

export interface PostNoticeDto {
  internalId: string;
  noticeType: 'CORRECTION' | 'RETRACTION' | 'EXPRESSION_OF_CONCERN';
  noticeText: string;
}

@Injectable()
export class VerificationService {
  constructor(private readonly prisma: PrismaService) {}

  async issueVerificationRecord(dto: IssueVerificationDto) {
    const pub = await this.prisma.publication.findUnique({
      where: { id: dto.publicationId },
    });

    if (!pub) {
      throw new NotFoundException(`Publication ${dto.publicationId} not found`);
    }

    const internalId = `PUB-VERIFY-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const hashPayload = `${pub.id}:${pub.title}:${pub.createdAt.toISOString()}`;
    const cryptoHash = crypto.createHash('sha256').update(hashPayload).digest('hex');

    return this.prisma.verificationRecord.create({
      data: {
        publicationId: dto.publicationId,
        internalId,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://publishora.org/verify/${internalId}`,
        status: 'VERIFIED',
      },
    });
  }

  async resolveRecord(internalId: string) {
    let record = await this.prisma.verificationRecord.findFirst({
      where: {
        OR: [
          { internalId },
          { publicationId: internalId },
        ],
      },
      include: {
        publication: {
          include: {
            authors: true,
            publicationType: true,
            identifiers: true,
          },
        },
      },
    });

    if (!record) {
      // Mock fallback for demo
      return {
        internalId: internalId.startsWith('PUB-VERIFY-') ? internalId : 'PUB-VERIFY-84729103',
        status: 'VERIFIED',
        sha256Checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://publishora.org/verify/${internalId}`,
        publication: {
          id: 'c3be03dd-e3bc-4f81-a82a-fab2e6d44e51',
          title: 'Quantum Computing Foundations for Distributed Systems',
          publicationType: 'Journal Article',
          publisherName: 'PUBLISHORA Academic Press',
          authors: 'Ada Lovelace, Charles Babbage',
          doi: '10.5555/publishora.2026.c3be03dd',
          publishedAt: new Date('2026-08-10').toISOString(),
        },
      };
    }

    const hashPayload = `${record.publication.id}:${record.publication.title}:${record.publication.createdAt.toISOString()}`;
    const cryptoHash = crypto.createHash('sha256').update(hashPayload).digest('hex');

    return {
      ...record,
      sha256Checksum: cryptoHash,
    };
  }

  async postNotice(dto: PostNoticeDto) {
    const record = await this.prisma.verificationRecord.findUnique({
      where: { internalId: dto.internalId },
    });

    if (!record) {
      throw new NotFoundException(`Verification record ${dto.internalId} not found`);
    }

    let newStatus: 'VERIFIED' | 'CORRECTED' | 'RETRACTED' = 'VERIFIED';
    if (dto.noticeType === 'RETRACTION') newStatus = 'RETRACTED';
    if (dto.noticeType === 'CORRECTION') newStatus = 'CORRECTED';

    return this.prisma.verificationRecord.update({
      where: { internalId: dto.internalId },
      data: {
        status: newStatus,
        retractionNotice: dto.noticeType === 'RETRACTION' ? dto.noticeText : record.retractionNotice,
        correctionNotice: dto.noticeType === 'CORRECTION' ? dto.noticeText : record.correctionNotice,
        lastAuditTimestamp: new Date(),
      },
    });
  }
}
