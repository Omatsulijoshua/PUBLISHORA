import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateDocumentDto {
  publicationId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  s3Key: string;
  storageUrl?: string;
}

export interface AddCommentDto {
  documentId: string;
  authorName: string;
  commentText: string;
  lineNumber?: number;
}

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createDocument(dto: CreateDocumentDto) {
    return this.prisma.document.create({
      data: {
        publicationId: dto.publicationId,
        fileName: dto.fileName,
        fileSize: dto.fileSize,
        mimeType: dto.mimeType,
        s3Key: dto.s3Key,
        storageUrl: dto.storageUrl || `https://storage.publishora.org/manuscripts/${dto.s3Key}`,
      },
    });
  }

  async addComment(dto: AddCommentDto) {
    const doc = await this.prisma.document.findUnique({
      where: { id: dto.documentId },
    });

    if (!doc) {
      throw new NotFoundException(`Document ${dto.documentId} not found`);
    }

    return this.prisma.documentComment.create({
      data: {
        documentId: dto.documentId,
        authorName: dto.authorName,
        commentText: dto.commentText,
        lineNumber: dto.lineNumber,
      },
    });
  }

  async getComments(documentId: string) {
    return this.prisma.documentComment.findMany({
      where: { documentId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
