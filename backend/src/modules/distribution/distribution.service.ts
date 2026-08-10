import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DistributionService {
  constructor(private readonly prisma: PrismaService) {}

  generateOaiPmhIdentify() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/ http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd">
  <responseDate>${new Date().toISOString()}</responseDate>
  <request verb="Identify">https://publishora.org/api/v1/oai-pmh</request>
  <Identify>
    <repositoryName>PUBLISHORA Global Academic Repository</repositoryName>
    <baseURL>https://publishora.org/api/v1/oai-pmh</baseURL>
    <protocolVersion>2.0</protocolVersion>
    <adminEmail>oai-admin@publishora.org</adminEmail>
    <earliestDatestamp>2026-01-01T00:00:00Z</earliestDatestamp>
    <deletedRecord>persistent</deletedRecord>
    <granularity>YYYY-MM-DDThh:mm:ssZ</granularity>
  </Identify>
</OAI-PMH>`;
  }

  async generateOaiPmhListRecords() {
    const publications = await this.prisma.publication.findMany({
      take: 10,
      include: { authors: true, publicationType: true },
      orderBy: { createdAt: 'desc' },
    });

    const recordsXml = publications
      .map(
        (pub) => `
    <record>
      <header>
        <identifier>oai:publishora.org:${pub.id}</identifier>
        <datestamp>${new Date(pub.createdAt).toISOString()}</datestamp>
      </header>
      <metadata>
        <oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/"
                   xmlns:dc="http://purl.org/dc/elements/1.1/"
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
          <dc:title>${pub.title}</dc:title>
          ${pub.authors.map((a) => `<dc:creator>${a.name}</dc:creator>`).join('\n          ')}
          <dc:subject>${pub.publicationType.name}</dc:subject>
          <dc:description>${pub.abstractText || 'Academic Publication'}</dc:description>
          <dc:date>${new Date(pub.createdAt).getFullYear()}</dc:date>
          <dc:type>${pub.publicationType.code}</dc:type>
          <dc:identifier>https://publishora.org/publications/${pub.id}</dc:identifier>
        </oai_dc:dc>
      </metadata>
    </record>`,
      )
      .join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/ http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd">
  <responseDate>${new Date().toISOString()}</responseDate>
  <request verb="ListRecords" metadataPrefix="oai_dc">https://publishora.org/api/v1/oai-pmh</request>
  <ListRecords>
    ${recordsXml}
  </ListRecords>
</OAI-PMH>`;
  }

  async generateGoogleScholarTags(publicationId: string) {
    const pub = await this.prisma.publication.findUnique({
      where: { id: publicationId },
      include: { authors: true, publicationType: true, identifiers: true },
    });

    if (!pub) {
      throw new NotFoundException(`Publication ${publicationId} not found`);
    }

    const doiIdent = (pub.identifiers || []).find((i) => i.type === 'DOI');

    const tags = [
      `<meta name="citation_title" content="${pub.title}">`,
      ...pub.authors.map((a) => `<meta name="citation_author" content="${a.name}">`),
      `<meta name="citation_publication_date" content="${new Date(pub.createdAt).getFullYear()}">`,
      `<meta name="citation_publisher" content="PUBLISHORA Academic Press">`,
      doiIdent ? `<meta name="citation_doi" content="${doiIdent.value}">` : '',
      `<meta name="citation_pdf_url" content="https://export.publishora.org/pdf/${pub.id}.pdf">`,
    ].filter(Boolean);

    return {
      publicationId,
      metaTagsCount: tags.length,
      htmlTags: tags.join('\n'),
    };
  }

  getFeeds() {
    return {
      channels: [
        { name: 'OAI-PMH 2.0 Repository Feed', url: 'http://localhost:4000/api/v1/oai-pmh?verb=ListRecords', protocol: 'OAI-PMH 2.0' },
        { name: 'Google Scholar Highwire Metadata Feed', url: 'http://localhost:4000/api/v1/distribution/google-scholar/feed', protocol: 'Highwire HTML Tags' },
        { name: 'DOAJ Open Access Directory Feed', url: 'http://localhost:4000/api/v1/distribution/doaj', protocol: 'DOAJ XML' },
        { name: 'Institutional RSS/Atom Feed', url: 'http://localhost:4000/api/v1/distribution/rss.xml', protocol: 'RSS 2.0 / Atom' },
      ],
    };
  }
}
