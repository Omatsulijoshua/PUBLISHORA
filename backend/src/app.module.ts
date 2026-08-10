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
import { ExportController } from './modules/export/export.controller';
import { ExportService } from './modules/export/export.service';
import { ModesService } from './modules/modes/modes.service';
import { JournalsController } from './modules/journals/journals.controller';
import { JournalsService } from './modules/journals/journals.service';
import { SubmissionsController } from './modules/submissions/submissions.controller';
import { SubmissionsService } from './modules/submissions/submissions.service';
import { ReviewsController } from './modules/reviews/reviews.controller';
import { ReviewsService } from './modules/reviews/reviews.service';
import { IdentifiersController } from './modules/identifiers/identifiers.controller';
import { IdentifiersService } from './modules/identifiers/identifiers.service';
import { ProductionController } from './modules/production/production.controller';
import { ProductionService } from './modules/production/production.service';
import { DistributionController } from './modules/distribution/distribution.controller';
import { DistributionService } from './modules/distribution/distribution.service';
import { VerificationController } from './modules/verification/verification.controller';
import { VerificationService } from './modules/verification/verification.service';
import { PromotionController } from './modules/promotion/promotion.controller';
import { PromotionService } from './modules/promotion/promotion.service';
import { GrantsController } from './modules/grants/grants.controller';
import { GrantsService } from './modules/grants/grants.service';
import { LibraryController } from './modules/library/library.controller';
import { LibraryService } from './modules/library/library.service';
import { MetricsController } from './modules/metrics/metrics.controller';
import { MetricsService } from './modules/metrics/metrics.service';
import { ReaderController } from './modules/reader/reader.controller';
import { ReaderService } from './modules/reader/reader.service';
import { LabsController } from './modules/labs/labs.controller';
import { LabsService } from './modules/labs/labs.service';

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
    ExportController,
    JournalsController,
    SubmissionsController,
    ReviewsController,
    IdentifiersController,
    ProductionController,
    DistributionController,
    VerificationController,
    PromotionController,
    GrantsController,
    LibraryController,
    MetricsController,
    ReaderController,
    LabsController,
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
    ExportService,
    ModesService,
    JournalsService,
    SubmissionsService,
    ReviewsService,
    IdentifiersService,
    ProductionService,
    DistributionService,
    VerificationService,
    PromotionService,
    GrantsService,
    LibraryService,
    MetricsService,
    ReaderService,
    LabsService,
  ],
})
export class AppModule {}
