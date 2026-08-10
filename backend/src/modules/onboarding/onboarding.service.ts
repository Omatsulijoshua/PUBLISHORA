import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AvailabilityService } from '../availability/availability.service';
import { ExperienceLevel, GuidancePreference, AiWritingLevel, RoleName } from '@prisma/client';

export interface OnboardingSubmissionDto {
  email: string;
  firstName: string;
  lastName: string;
  countryCode: string;
  userTypes: string[];
  publicationFormats: string[];
  publishingGoals: string[];
  experienceLevel: ExperienceLevel;
  guidancePreference: GuidancePreference;
  aiWritingLevel: AiWritingLevel;
  aiFeatures?: string[];
}

@Injectable()
export class OnboardingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly availabilityService: AvailabilityService,
  ) {}

  async processOnboarding(dto: OnboardingSubmissionDto) {
    const availability = await this.availabilityService.checkAvailability({
      countryCode: dto.countryCode,
    });

    let user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (user) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          countryCode: dto.countryCode,
          activeMode: availability.recommendedMode,
        },
      });
    }

    // Upsert Profile
    const profile = user ? await this.prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        experienceLevel: dto.experienceLevel,
        guidancePreference: dto.guidancePreference,
        aiPreference: dto.aiWritingLevel,
      },
      create: {
        userId: user.id,
        experienceLevel: dto.experienceLevel,
        guidancePreference: dto.guidancePreference,
        aiPreference: dto.aiWritingLevel,
      },
    }) : null;

    return {
      success: true,
      countryCode: dto.countryCode,
      assignedMode: availability.recommendedMode,
      availability,
      onboardingSummary: {
        userTypes: dto.userTypes,
        formats: dto.publicationFormats,
        goals: dto.publishingGoals,
        experience: dto.experienceLevel,
        guidance: dto.guidancePreference,
        aiLevel: dto.aiWritingLevel,
      },
    };
  }
}
