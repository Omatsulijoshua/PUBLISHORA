import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AvailabilityStatus, OperatingMode } from '@prisma/client';

export interface AvailabilityCheckDto {
  countryCode: string;
  publicationTypeCode?: string;
  requestedService?: string;
}

export interface AvailabilityCheckResult {
  countryCode: string;
  countryName: string;
  status: AvailabilityStatus;
  recommendedMode: OperatingMode;
  headline: string;
  explanation: string;
  publishingAllowed: boolean;
  preparationAllowed: boolean;
  printAllowed: boolean;
  digitalAllowed: boolean;
  peerReviewAllowed: boolean;
  userOptions: string[];
}

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  async checkAvailability(dto: AvailabilityCheckDto): Promise<AvailabilityCheckResult> {
    const country = await this.prisma.country.findUnique({
      where: { isoCode: dto.countryCode.toUpperCase() },
      include: {
        policies: true,
        services: true,
      },
    });

    if (!country) {
      return {
        countryCode: dto.countryCode,
        countryName: dto.countryCode,
        status: AvailabilityStatus.PREPARATION_ONLY,
        recommendedMode: OperatingMode.PREPARATION_MODE,
        headline: `Publishing status unconfigured for ${dto.countryCode}`,
        explanation: 'Our publishing press is not currently configured for this region. You can still prepare your manuscript using our tools and publish elsewhere.',
        publishingAllowed: false,
        preparationAllowed: true,
        printAllowed: false,
        digitalAllowed: true,
        peerReviewAllowed: false,
        userOptions: ['Continue in Preparation Mode', 'Find External Publisher', 'Change Country'],
      };
    }

    const primaryPolicy = country.policies[0];
    const status = country.defaultStatus;

    if (status === AvailabilityStatus.FULLY_AVAILABLE) {
      return {
        countryCode: country.isoCode,
        countryName: country.name,
        status: AvailabilityStatus.FULLY_AVAILABLE,
        recommendedMode: OperatingMode.PUBLISHING_MODE,
        headline: '🎉 Publishing is available',
        explanation: `Great news. Our publishing services are currently available for your publication type in ${country.name}.`,
        publishingAllowed: primaryPolicy?.publishingAllowed ?? true,
        preparationAllowed: true,
        printAllowed: primaryPolicy?.printAllowed ?? true,
        digitalAllowed: primaryPolicy?.digitalAllowed ?? true,
        peerReviewAllowed: primaryPolicy?.peerReviewAllowed ?? true,
        userOptions: ['Publish with our press', 'Prepare and publish elsewhere', "I'm not sure"],
      };
    }

    if (status === AvailabilityStatus.LIMITED) {
      return {
        countryCode: country.isoCode,
        countryName: country.name,
        status: AvailabilityStatus.LIMITED,
        recommendedMode: OperatingMode.PUBLISHING_MODE,
        headline: 'Publishing is partially available',
        explanation: `Publishing services are partially operational in ${country.name}. Digital publishing is supported while physical print distribution is restricted.`,
        publishingAllowed: true,
        preparationAllowed: true,
        printAllowed: false,
        digitalAllowed: true,
        peerReviewAllowed: true,
        userOptions: ['Publish digital edition with our press', 'Prepare manuscript in Preparation Mode', 'Find print distribution partner'],
      };
    }

    if (status === AvailabilityStatus.PREPARATION_ONLY) {
      return {
        countryCode: country.isoCode,
        countryName: country.name,
        status: AvailabilityStatus.PREPARATION_ONLY,
        recommendedMode: OperatingMode.PREPARATION_MODE,
        headline: 'Preparation Mode',
        explanation: `Our publishing services are not currently available for this publication in ${country.name}. You can still prepare your work using our AI tools and export it to publish through another publisher.`,
        publishingAllowed: false,
        preparationAllowed: true,
        printAllowed: false,
        digitalAllowed: true,
        peerReviewAllowed: false,
        userOptions: ['Continue in Preparation Mode', 'Find a Publisher', 'Change Publishing Country'],
      };
    }

    // UNAVAILABLE / COMING_SOON
    return {
      countryCode: country.isoCode,
      countryName: country.name,
      status: country.defaultStatus,
      recommendedMode: OperatingMode.PREPARATION_MODE,
      headline: `Publishing through our press isn't currently available in ${country.name}`,
      explanation: primaryPolicy?.notes || `Publishing press services are not available in ${country.name} at this time.`,
      publishingAllowed: false,
      preparationAllowed: true,
      printAllowed: false,
      digitalAllowed: false,
      peerReviewAllowed: false,
      userOptions: ['Continue in Preparation Mode', 'Find External Publisher', 'Notify me when available'],
    };
  }
}
