import { LabsService } from './labs.service';

describe('Phase 18 — Collaborative Research Groups & Lab Workspaces Specs', () => {
  let service: LabsService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {};
    service = new LabsService(mockPrisma);
  });

  it('should create a new research lab workspace', async () => {
    const lab = await service.createLab({
      name: 'Quantum Optics & Photonics Lab',
      institutionName: 'Stanford University',
      piUserId: 'user-201',
      description: 'Optofluidics and photonic quantum gates.',
    });

    expect(lab.id).toContain('lab-');
    expect(lab.name).toBe('Quantum Optics & Photonics Lab');
    expect(lab.members.length).toBe(1);
    expect(lab.members[0].role).toBe('PI');
  });

  it('should invite a postdoc team member to the research lab', async () => {
    const member = await service.addMember({
      labId: 'lab-101',
      userId: 'user-301',
      memberName: 'Dr. Niels Bohr',
      memberEmail: 'bohr@mit.edu',
      role: 'POSTDOC',
    });

    expect(member.role).toBe('POSTDOC');
    expect(member.name).toBe('Dr. Niels Bohr');
  });

  it('should post a lab discussion thread on manuscript critique', async () => {
    const discussion = await service.postDiscussion({
      labId: 'lab-101',
      authorName: 'Dr. Ada Lovelace',
      topicTitle: 'Review of Section 2.1 Hamiltonian Formulation',
      content: 'Please review the operator commutation relation in eq 14.',
    });

    expect(discussion.topicTitle).toBe('Review of Section 2.1 Hamiltonian Formulation');
    expect(discussion.authorName).toBe('Dr. Ada Lovelace');
  });
});
