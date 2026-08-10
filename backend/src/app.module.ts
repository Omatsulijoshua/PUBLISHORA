import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from './modules/prisma/prisma.service';
import { AuthController } from './modules/auth/auth.controller';
import { AuthService } from './modules/auth/auth.service';
import { HealthController } from './modules/health/health.controller';
import { CountriesController } from './modules/countries/countries.controller';
import { CountriesService } from './modules/countries/countries.service';
import { AvailabilityController } from './modules/availability/availability.controller';
import { AvailabilityService } from './modules/availability/availability.service';
import { OnboardingController } from './modules/onboarding/onboarding.controller';
import { OnboardingService } from './modules/onboarding/onboarding.service';
import { PublicationsController } from './modules/publications/publications.controller';
import { PublicationsService } from './modules/publications/publications.service';
import { DocumentsController } from './modules/documents/documents.controller';
import { DocumentsService } from './modules/documents/documents.service';
import { AiController } from './modules/ai/ai.controller';
import { AiService } from './modules/ai/ai.service';
import { ReferencesController } from './modules/references/references.controller';
import { ReferencesService } from './modules/references/references.service';
import { IntegrityController } from './modules/integrity/integrity.controller';
import { IntegrityService } from './modules/integrity/integrity.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'publishora-super-secret-jwt-key-2026-global-production-grade',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [
    AuthController,
    HealthController,
    CountriesController,
    AvailabilityController,
    OnboardingController,
    PublicationsController,
    DocumentsController,
    AiController,
    ReferencesController,
    IntegrityController,
  ],
  providers: [
    PrismaService,
    AuthService,
    CountriesService,
    AvailabilityService,
    OnboardingService,
    PublicationsService,
    DocumentsService,
    AiService,
    ReferencesService,
    IntegrityService,
  ],
})
export class AppModule {}
