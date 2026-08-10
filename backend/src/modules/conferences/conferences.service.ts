import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateConferenceDto {
  name: string;
  acronym: string;
  location: string;
  startDate: string;
  endDate: string;
  cfpDeadline: string;
  tracks: string[];
}

export interface CompileProceedingsDto {
  conferenceId: string;
  volumeTitle: string;
  isbn?: string;
}

@Injectable()
export class ConferencesService {
  private mockConferences: any[] = [
    {
      id: 'conf-2026-qis',
      name: 'International Conference on Quantum Information & Distributed Systems (QIDS 2026)',
      acronym: 'QIDS 2026',
      location: 'Boston, MA & Virtual',
      startDate: '2026-10-15',
      endDate: '2026-10-18',
      cfpDeadline: '2026-08-30',
      tracks: ['Quantum Algorithms', 'Fault-Tolerant Hardware', 'Quantum Cryptography', 'Photonic Interconnects'],
      proceedings: {
        volumeTitle: 'Proceedings of QIDS 2026 - Volume I',
        isbn: '978-3-16-148499-1',
        totalAcceptedPapers: 18,
        tableOfContents: [
          { title: 'Quantum Computing Foundations for Distributed Systems', authors: 'Ada Lovelace, Charles Babbage', slidesUrl: 'https://slides.publishora.org/qids2026-keynote.pdf' },
          { title: 'Topological Qubit Fabric Architectures', authors: 'Elena Rostova, Marcus Thorne', slidesUrl: 'https://slides.publishora.org/qids2026-sess1.pdf' },
        ],
        compiledAt: new Date().toISOString(),
      },
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  async createConference(dto: CreateConferenceDto) {
    const conf = {
      id: `conf-${Date.now()}`,
      name: dto.name,
      acronym: dto.acronym,
      location: dto.location,
      startDate: dto.startDate,
      endDate: dto.endDate,
      cfpDeadline: dto.cfpDeadline,
      tracks: dto.tracks,
      proceedings: null,
    };

    this.mockConferences.push(conf);
    return conf;
  }

  async getConferences() {
    return this.mockConferences;
  }

  async getConferenceDetails(id: string) {
    const conf = this.mockConferences.find((c) => c.id === id || id === 'conf-2026-qis');
    if (!conf) {
      throw new NotFoundException(`Conference ${id} not found`);
    }
    return conf;
  }

  async compileProceedings(dto: CompileProceedingsDto) {
    const conf = await this.getConferenceDetails(dto.conferenceId);
    conf.proceedings = {
      volumeTitle: dto.volumeTitle,
      isbn: dto.isbn || '978-3-16-148499-1',
      totalAcceptedPapers: 18,
      tableOfContents: [
        { title: 'Quantum Computing Foundations for Distributed Systems', authors: 'Ada Lovelace, Charles Babbage', slidesUrl: 'https://slides.publishora.org/qids2026-keynote.pdf' },
        { title: 'Topological Qubit Fabric Architectures', authors: 'Elena Rostova, Marcus Thorne', slidesUrl: 'https://slides.publishora.org/qids2026-sess1.pdf' },
      ],
      compiledAt: new Date().toISOString(),
    };
    return conf.proceedings;
  }
}
