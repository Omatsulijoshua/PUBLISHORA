import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateLabDto {
  name: string;
  institutionName: string;
  piUserId: string;
  description?: string;
}

export interface AddLabMemberDto {
  labId: string;
  userId: string;
  memberName: string;
  memberEmail: string;
  role: 'PI' | 'POSTDOC' | 'PHD_STUDENT' | 'RESEARCH_ASSISTANT';
}

export interface PostDiscussionDto {
  labId: string;
  authorName: string;
  topicTitle: string;
  content: string;
}

@Injectable()
export class LabsService {
  private mockLabs: any[] = [
    {
      id: 'lab-101',
      name: 'Quantum Information Systems Lab',
      institutionName: 'MIT & Global Academic Press',
      piUserId: 'user-101',
      description: 'Researching fault-tolerant qubit interconnects and topological error correction.',
      members: [
        { userId: 'user-101', name: 'Dr. Ada Lovelace', role: 'PI', email: 'ada@mit.edu' },
        { userId: 'user-102', name: 'Dr. Elena Rostova', role: 'POSTDOC', email: 'elena@mit.edu' },
        { userId: 'user-103', name: 'Marcus Thorne', role: 'PHD_STUDENT', email: 'marcus@mit.edu' },
      ],
      sharedManuscripts: [
        { id: 'c3be03dd-e3bc-4f81-a82a-fab2e6d44e51', title: 'Quantum Computing Foundations for Distributed Systems', status: 'IN_PREPARATION' },
      ],
      discussions: [
        { id: 'disc-1', authorName: 'Dr. Elena Rostova', topicTitle: 'Feedback on Figure 4 Error Rates', content: 'The transmon qubit coherence time in Figure 4 looks solid, but let’s double check the noise margin.', createdAt: new Date().toISOString() },
      ],
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  async createLab(dto: CreateLabDto) {
    const lab = {
      id: `lab-${Date.now()}`,
      name: dto.name,
      institutionName: dto.institutionName,
      piUserId: dto.piUserId,
      description: dto.description || '',
      members: [
        { userId: dto.piUserId, name: 'Principal Investigator', role: 'PI', email: 'pi@institution.edu' },
      ],
      sharedManuscripts: [],
      discussions: [],
    };

    this.mockLabs.push(lab);
    return lab;
  }

  async getLabDetails(labId: string) {
    const lab = this.mockLabs.find((l) => l.id === labId || labId === 'lab-101');
    if (!lab) {
      throw new NotFoundException(`Research lab ${labId} not found`);
    }
    return lab;
  }

  async addMember(dto: AddLabMemberDto) {
    const lab = await this.getLabDetails(dto.labId);
    const newMember = {
      userId: dto.userId,
      name: dto.memberName,
      email: dto.memberEmail,
      role: dto.role,
    };
    lab.members.push(newMember);
    return newMember;
  }

  async postDiscussion(dto: PostDiscussionDto) {
    const lab = await this.getLabDetails(dto.labId);
    const discussion = {
      id: `disc-${Date.now()}`,
      authorName: dto.authorName,
      topicTitle: dto.topicTitle,
      content: dto.content,
      createdAt: new Date().toISOString(),
    };
    lab.discussions.push(discussion);
    return discussion;
  }
}
