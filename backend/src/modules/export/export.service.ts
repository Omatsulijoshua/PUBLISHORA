import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type ExportFormat = 'PDF' | 'EPUB' | 'HTML' | 'JATS_XML' | 'BIBTEX' | 'RIS';

export interface GenerateExportDto {
  publicationId: string;
  format: ExportFormat;
}

@Injectable()
export class ExportService {
  constructor(private readonly prisma: PrismaService) {}

  async generateExport(dto: GenerateExportDto) {
    const pub = await this.prisma.publication.findUnique({
      where: { id: dto.publicationId },
      include: {
        publicationType: true,
        authors: true,
        versions: { orderBy: { versionNumber: 'desc' }, take: 1 },
        references: true,
      },
    });

    if (!pub) {
      throw new NotFoundException(`Publication ${dto.publicationId} not found`);
    }

    const version = pub.versions[0];
    const rawContent = version?.contentJson || '{}';

    switch (dto.format) {
      case 'PDF':
        return this.compilePdf(pub, version);
      case 'EPUB':
        return this.compileEpub(pub, version);
      case 'HTML':
        return this.compileHtml(pub, version);
      case 'JATS_XML':
        return this.compileJatsXml(pub, version);
      case 'BIBTEX':
        return this.compileBibTeXBundle(pub);
      case 'RIS':
        return this.compileRisBundle(pub);
      default:
        throw new NotFoundException(`Format ${dto.format} not supported`);
    }
  }

  private compilePdf(pub: any, version: any) {
    return {
      format: 'PDF',
      mimeType: 'application/pdf',
      downloadUrl: `https://export.publishora.org/pdf/${pub.id}_v${pub.currentVersionNum}.pdf`,
      fileName: `${pub.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-v${pub.currentVersionNum}.pdf`,
      compiledBytes: 1542000,
      modeNotice: pub.mode === 'PREPARATION_MODE' ? 'Preparation Mode Export — Prepared Manuscript Draft' : 'Official Press Publication PDF',
    };
  }

  private compileEpub(pub: any, version: any) {
    return {
      format: 'EPUB',
      mimeType: 'application/epub+zip',
      downloadUrl: `https://export.publishora.org/epub/${pub.id}_v${pub.currentVersionNum}.epub`,
      fileName: `${pub.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.epub`,
      compiledBytes: 890000,
      modeNotice: pub.mode === 'PREPARATION_MODE' ? 'Preparation Mode Export — E-Book Prepared Draft' : 'Official Press E-Book',
    };
  }

  private compileHtml(pub: any, version: any) {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${pub.title}</title>
  <meta name="author" content="${pub.authors.map((a: any) => a.name).join(', ')}">
</head>
<body>
  <article>
    <h1>${pub.title}</h1>
    ${pub.subtitle ? `<h2>${pub.subtitle}</h2>` : ''}
    <div className="abstract"><p>${pub.abstractText || ''}</p></div>
  </article>
</body>
</html>`;

    return {
      format: 'HTML',
      mimeType: 'text/html',
      content: htmlContent,
      fileName: `${pub.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.html`,
    };
  }

  private compileJatsXml(pub: any, version: any) {
    const jatsXml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE article PUBLIC "-//NLM//DTD JATS (Z39.96) Journal Archiving and Interchange DTD v1.2 20190208//EN" "JATS-archivearticle1.dtd">
<article xmlns:xlink="http://www.w3.org/1999/xlink" article-type="research-article">
  <front>
    <journal-meta>
      <journal-title-group><journal-title>PUBLISHORA Repository</journal-title></journal-title-group>
    </journal-meta>
    <article-meta>
      <title-group><article-title>${pub.title}</article-title></title-group>
      <contrib-group>
        ${pub.authors.map((a: any) => `<contrib contrib-type="author"><name><surname>${a.name}</surname></name></contrib>`).join('')}
      </contrib-group>
      <abstract><p>${pub.abstractText || ''}</p></abstract>
    </article-meta>
  </front>
  <body>
    <sec><title>Manuscript Content</title><p>Prepared manuscript payload.</p></sec>
  </body>
</article>`;

    return {
      format: 'JATS_XML',
      mimeType: 'application/xml',
      content: jatsXml,
      fileName: `${pub.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-jats.xml`,
    };
  }

  private compileBibTeXBundle(pub: any) {
    const bibtex = `@article{pub_${pub.id.substring(0, 8)},
  title = {${pub.title}},
  author = {${pub.authors.map((a: any) => a.name).join(' and ')}},
  year = {${new Date(pub.createdAt).getFullYear()}},
  note = {${pub.mode === 'PREPARATION_MODE' ? 'Prepared Manuscript Draft' : 'PUBLISHORA Press'}}
}`;

    return {
      format: 'BIBTEX',
      mimeType: 'text/plain',
      content: bibtex,
      fileName: `citation_${pub.id.substring(0, 8)}.bib`,
    };
  }

  private compileRisBundle(pub: any) {
    const ris = `TY  - JOUR
TI  - ${pub.title}
AU  - ${pub.authors.map((a: any) => a.name).join('\nAU  - ')}
PY  - ${new Date(pub.createdAt).getFullYear()}
ER  -`;

    return {
      format: 'RIS',
      mimeType: 'application/x-research-info-systems',
      content: ris,
      fileName: `citation_${pub.id.substring(0, 8)}.ris`,
    };
  }
}
