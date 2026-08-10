import { Injectable } from '@nestjs/common';
import { OperatingMode } from '@prisma/client';

export interface ModeCapability {
  feature: string;
  publishingModeAccess: boolean;
  preparationModeAccess: boolean;
  description: string;
}

@Injectable()
export class ModesService {
  getCapabilities(): ModeCapability[] {
    return [
      { feature: 'MANUSCRIPT_CREATION', publishingModeAccess: true, preparationModeAccess: true, description: 'Create and edit manuscripts' },
      { feature: 'AI_PROOFREADING', publishingModeAccess: true, preparationModeAccess: true, description: 'AI grammar, style, and clarity tools' },
      { feature: 'REFERENCE_MANAGEMENT', publishingModeAccess: true, preparationModeAccess: true, description: 'Bibliography manager and citation formatting' },
      { feature: 'MULTI_FORMAT_EXPORT', publishingModeAccess: true, preparationModeAccess: true, description: 'Export to PDF, EPUB, HTML, JATS/XML, BibTeX' },
      { feature: 'PUBLICATION_READINESS_AUDIT', publishingModeAccess: true, preparationModeAccess: true, description: 'Check manuscript formatting readiness' },
      { feature: 'EXTERNAL_PUBLISHER_GUIDANCE', publishingModeAccess: false, preparationModeAccess: true, description: 'Guidance and directories for external publishing' },
      { feature: 'EDITORIAL_SUBMISSION', publishingModeAccess: true, preparationModeAccess: false, description: 'Submit manuscript to our press editorial screening' },
      { feature: 'PEER_REVIEW_WORKFLOW', publishingModeAccess: true, preparationModeAccess: false, description: 'Peer review and referee invitation management' },
      { feature: 'IDENTIFIER_ASSIGNMENT', publishingModeAccess: true, preparationModeAccess: false, description: 'Legitimate DOI / ISBN / ISSN issuance' },
      { feature: 'GLOBAL_DISTRIBUTION', publishingModeAccess: true, preparationModeAccess: false, description: 'Press distribution and indexing' },
    ];
  }
}
