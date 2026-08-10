import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface SubmitPreprintDto {
  title: string;
  abstract: string;
  category: string;
  authors: { name: string; email: string; affiliation?: string }[];
  license: string;
}

export interface AddPreprintVersionDto {
  preprintId: string;
  title?: string;
  abstract?: string;
  revisionNotes: string;
}

export interface LinkVorDto {
  preprintId: string;
  journalArticleDoi: string;
  journalTitle: string;
}

@Injectable()
export class PreprintsService {
  private mockPreprints: any[] = [
    {
      id: 'prep-2026-881',
      title: 'Scalable Transmon Qubit Control via Cryogenic Microwave CMOS Drivers',
      abstract: 'We present a 4 Kelvin CMOS driver circuit capable of addressing 64 transmon qubits with sub-nanosecond phase resolution...',
      category: 'Quantum Hardware',
      screeningStatus: 'PASSED_SCREENING',
      doi: '10.5555/publishora.preprint.2026.881',
      authors: [
        { name: 'Dr. Ada Lovelace', email: 'ada@mit.edu', affiliation: 'MIT Quantum Lab' },
        { name: 'Marcus Thorne', email: 'marcus@mit.edu', affiliation: 'MIT' },
      ],
      license: 'CC-BY 4.0 International',
      versions: [
        { versionNumber: 1, publishedAt: '2026-08-01T10:00:00Z', revisionNotes: 'Initial preprint release.' },
        { versionNumber: 2, publishedAt: '2026-08-08T14:30:00Z', revisionNotes: 'Updated Figure 3 with 77K control benchmark.' },
      ],
      versionOfRecord: {
        journalArticleDoi: '10.5555/publishora.2026.001',
        journalTitle: 'PUBLISHORA Quantum Systems',
        linkedAt: '2026-08-09T09:00:00Z',
      },
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  async submitPreprint(dto: SubmitPreprintDto) {
    const preprint = {
      id: `prep-${Date.now()}`,
      title: dto.title,
      abstract: dto.abstract,
      category: dto.category,
      screeningStatus: 'PASSED_SCREENING', // 24h rapid screening pass
      doi: `10.5555/publishora.preprint.2026.${Date.now().toString().slice(-4)}`,
      authors: dto.authors,
      license: dto.license || 'CC-BY 4.0 International',
      versions: [
        { versionNumber: 1, publishedAt: new Date().toISOString(), revisionNotes: 'Initial preprint submission.' },
      ],
      versionOfRecord: null,
    };

    this.mockPreprints.push(preprint);
    return preprint;
  }

  async getPreprints() {
    return this.mockPreprints;
  }

  async getPreprintDetails(id: string) {
    const prep = this.mockPreprints.find((p) => p.id === id || id === 'prep-2026-881');
    if (!prep) {
      throw new NotFoundException(`Preprint ${id} not found`);
    }
    return prep;
  }

  async addVersion(dto: AddPreprintVersionDto) {
    const prep = await this.getPreprintDetails(dto.preprintId);
    if (dto.title) prep.title = dto.title;
    if (dto.abstract) prep.abstract = dto.abstract;

    const nextVerNum = prep.versions.length + 1;
    const newVersion = {
      versionNumber: nextVerNum,
      publishedAt: new Date().toISOString(),
      revisionNotes: dto.revisionNotes,
    };

    prep.versions.push(newVersion);
    return newVersion;
  }

  async linkVor(dto: LinkVorDto) {
    const prep = await this.getPreprintDetails(dto.preprintId);
    prep.versionOfRecord = {
      journalArticleDoi: dto.journalArticleDoi,
      journalTitle: dto.journalTitle,
      linkedAt: new Date().toISOString(),
    };
    return prep.versionOfRecord;
  }
}
