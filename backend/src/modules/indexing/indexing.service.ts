import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CrossrefDepositDto {
  publicationId: string;
  doi: string;
}

@Injectable()
export class IndexingService {
  constructor(private readonly prisma: PrismaService) {}

  depositCrossref(dto: CrossrefDepositDto) {
    if (!dto.publicationId || !dto.doi) {
      throw new BadRequestException('Publication ID and DOI are required for Crossref deposit');
    }

    return {
      batchId: `cr-batch-${Date.now()}`,
      doi: dto.doi,
      crossrefXml: `<?xml version="1.0" encoding="UTF-8"?><doi_batch xmlns="http://www.crossref.org/schema/5.3.1"><head><doi_batch_id>cr-batch-101</doi_batch_id></head></doi_batch>`,
      submissionStatus: 'COMPLETED_INDEXED',
      indexedAt: new Date().toISOString(),
    };
  }

  uploadPmcJats(publicationId: string) {
    return {
      packageId: `pmc-pkg-${Date.now()}`,
      publicationId,
      jatsXmlFile: 'article.xml',
      sftpEndpoint: 'sftp://ftp.ncbi.nlm.nih.gov/pmc/incoming/publishora/',
      status: 'PACKAGED_AND_UPLOADED',
      uploadedAt: new Date().toISOString(),
    };
  }

  getKbartFeed() {
    const tsvContent = `publication_title\tprint_identifier\tonline_identifier\tdate_first_issue_online\tnum_first_vol_online\n` +
      `PUBLISHORA Journal of Quantum Computing\t1234-5678\t8765-4321\t2026-01-01\t1\n` +
      `PUBLISHORA Journal of Global Health\t2345-6789\t9876-5432\t2026-01-01\t1`;

    return {
      format: 'KBART v2.0 TSV',
      totalTitles: 2,
      tsvFeedContent: tsvContent,
      scopusSyncStatus: 'SYNCED',
      wosSyncStatus: 'SYNCED',
      doajStatus: 'SEAL_QUALIFIED',
    };
  }
}
