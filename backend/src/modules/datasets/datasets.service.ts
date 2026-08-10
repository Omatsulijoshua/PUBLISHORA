import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface DepositDatasetDto {
  title: string;
  authors: string[];
  description: string;
  externalRepository: 'HARVARD_DATAVERSE' | 'ZENODO' | 'SOFTWARE_HERITAGE' | 'PUBLISHORA_DATA';
  license: string;
  fileSizeBytes: number;
}

export interface ParseCffDto {
  cffContent: string;
}

@Injectable()
export class DatasetsService {
  private mockDatasets: any[] = [
    {
      id: 'ds-101',
      title: 'Global Single-Cell RNA Sequencing Expression Matrix for Neural Tissue',
      doi: '10.5555/dataset.2026.101',
      authors: ['Dr. Ada Lovelace', 'Dr. Marcus Thorne'],
      description: 'Single-cell transcriptomic profiles of human cortical neurons across 12 developmental stages.',
      externalRepository: 'HARVARD_DATAVERSE',
      license: 'CC0 1.0 Universal',
      fileSizeBytes: 14285714285, // 14.28 GB
      fairScore: {
        overallPercent: 97.5,
        findable: 100,
        accessible: 100,
        interoperable: 95,
        reusable: 95,
      },
      createdAt: new Date().toISOString(),
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  async depositDataset(dto: DepositDatasetDto) {
    const timestamp = new Date().toISOString();
    const doi = `10.5555/dataset.2026.${Math.floor(100 + Math.random() * 900)}`;

    const dataset = {
      id: `ds-${Date.now()}`,
      title: dto.title,
      doi,
      authors: dto.authors,
      description: dto.description,
      externalRepository: dto.externalRepository,
      license: dto.license || 'CC0 1.0 Universal',
      fileSizeBytes: dto.fileSizeBytes || 1073741824,
      fairScore: {
        overallPercent: 98.0,
        findable: 100,
        accessible: 100,
        interoperable: 96,
        reusable: 96,
      },
      createdAt: timestamp,
    };

    this.mockDatasets.push(dataset);
    return dataset;
  }

  async getDatasets() {
    return {
      total: this.mockDatasets.length,
      datasets: this.mockDatasets,
    };
  }

  async getDatasetById(id: string) {
    const ds = this.mockDatasets.find((d) => d.id === id || id === 'ds-101');
    if (!ds) {
      throw new NotFoundException(`Dataset with ID ${id} not found`);
    }
    return ds;
  }

  parseCff(cffContent: string) {
    if (!cffContent || !cffContent.includes('cff-version')) {
      throw new BadRequestException('Invalid Citation File Format (CFF) content');
    }

    return {
      cffVersion: '1.2.0',
      title: 'PUBLISHORA Bio-Simulation Toolkit',
      authors: [{ name: 'Lovelace, Ada', orcid: 'https://orcid.org/0000-0002-1825-0097' }],
      doi: '10.5555/software.2026.881',
      repositoryCode: 'https://github.com/Omatsulijoshua/PUBLISHORA',
      license: 'MIT',
    };
  }

  getDataCiteXml(id: string) {
    const ds = this.mockDatasets.find((d) => d.id === id || id === 'ds-101') || this.mockDatasets[0];
    return `<?xml version="1.0" encoding="UTF-8"?>
<resource xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://datacite.org/schema/kernel-4" xsi:schemaLocation="http://datacite.org/schema/kernel-4 http://schema.datacite.org/meta/kernel-4.4/metadata.xsd">
  <identifier identifierType="DOI">${ds.doi}</identifier>
  <creators>
    ${ds.authors.map((a: string) => `<creator><creatorName>${a}</creatorName></creator>`).join('\n    ')}
  </creators>
  <titles>
    <title>${ds.title}</title>
  </titles>
  <publisher>PUBLISHORA Open Data Repository</publisher>
  <publicationYear>2026</publicationYear>
  <resourceType resourceTypeGeneral="Dataset">Research Dataset</resourceType>
</resource>`;
  }
}
