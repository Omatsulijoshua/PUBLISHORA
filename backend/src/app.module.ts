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
import { ConferencesController } from './modules/conferences/conferences.controller';
import { ConferencesService } from './modules/conferences/conferences.service';
import { BooksController } from './modules/books/books.controller';
import { BooksService } from './modules/books/books.service';
import { PreprintsController } from './modules/preprints/preprints.controller';
import { PreprintsService } from './modules/preprints/preprints.service';
import { PpprController } from './modules/pppr/pppr.controller';
import { PpprService } from './modules/pppr/pppr.service';
import { TenantsController } from './modules/tenants/tenants.controller';
import { TenantsService } from './modules/tenants/tenants.service';
import { SearchController } from './modules/search/search.controller';
import { SearchService } from './modules/search/search.service';
import { SecurityController } from './modules/security/security.controller';
import { SecurityService } from './modules/security/security.service';
import { DisasterRecoveryController } from './modules/disaster-recovery/disaster-recovery.controller';
import { DisasterRecoveryService } from './modules/disaster-recovery/disaster-recovery.service';
import { BillingController } from './modules/billing/billing.controller';
import { BillingService } from './modules/billing/billing.service';
import { AnalyticsController } from './modules/analytics/analytics.controller';
import { AnalyticsService } from './modules/analytics/analytics.service';
import { DatasetsController } from './modules/datasets/datasets.controller';
import { DatasetsService } from './modules/datasets/datasets.service';
import { LocalizationController } from './modules/localization/localization.controller';
import { LocalizationService } from './modules/localization/localization.service';
import { OfflineController } from './modules/offline/offline.controller';
import { OfflineService } from './modules/offline/offline.service';
import { DevelopersController } from './modules/developers/developers.controller';
import { DevelopersService } from './modules/developers/developers.service';
import { PerformanceController } from './modules/performance/performance.controller';
import { PerformanceService } from './modules/performance/performance.service';
import { ArchivingController } from './modules/archiving/archiving.controller';
import { ArchivingService } from './modules/archiving/archiving.service';
import { LegalController } from './modules/legal/legal.controller';
import { LegalService } from './modules/legal/legal.service';
import { IndexingController } from './modules/indexing/indexing.controller';
import { IndexingService } from './modules/indexing/indexing.service';
import { FormattingController } from './modules/formatting/formatting.controller';
import { FormattingService } from './modules/formatting/formatting.service';
import { JournalMetricsController } from './modules/journal-metrics/journal-metrics.controller';
import { JournalMetricsService } from './modules/journal-metrics/journal-metrics.service';
import { ReviewerCreditController } from './modules/reviewer-credit/reviewer-credit.controller';
import { ReviewerCreditService } from './modules/reviewer-credit/reviewer-credit.service';
import { DataDepositsController } from './modules/data-deposits/data-deposits.controller';
import { DataDepositsService } from './modules/data-deposits/data-deposits.service';
import { FunderComplianceController } from './modules/funder-compliance/funder-compliance.controller';
import { FunderComplianceService } from './modules/funder-compliance/funder-compliance.service';
import { UniversalSearchController } from './modules/universal-search/universal-search.controller';
import { UniversalSearchService } from './modules/universal-search/universal-search.service';
import { CounterR5Controller } from './modules/counter-r5/counter-r5.controller';
import { CounterR5Service } from './modules/counter-r5/counter-r5.service';
import { AiSynthesisController } from './modules/ai-synthesis/ai-synthesis.controller';
import { AiSynthesisService } from './modules/ai-synthesis/ai-synthesis.service';
import { SystemHealthController } from './modules/system-health/system-health.controller';
import { SystemHealthService } from './modules/system-health/system-health.service';
import { AiRouterController } from './modules/ai-router/ai-router.controller';
import { AiRouterService } from './modules/ai-router/ai-router.service';

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
    ConferencesController,
    BooksController,
    PreprintsController,
    PpprController,
    TenantsController,
    SearchController,
    SecurityController,
    DisasterRecoveryController,
    BillingController,
    AnalyticsController,
    DatasetsController,
    LocalizationController,
    OfflineController,
    DevelopersController,
    PerformanceController,
    ArchivingController,
    LegalController,
    IndexingController,
    FormattingController,
    JournalMetricsController,
    ReviewerCreditController,
    DataDepositsController,
    FunderComplianceController,
    UniversalSearchController,
    CounterR5Controller,
    AiSynthesisController,
    SystemHealthController,
    AiRouterController,
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
    ConferencesService,
    BooksService,
    PreprintsService,
    PpprService,
    TenantsService,
    SearchService,
    SecurityService,
    DisasterRecoveryService,
    BillingService,
    AnalyticsService,
    DatasetsService,
    LocalizationService,
    OfflineService,
    DevelopersService,
    PerformanceService,
    ArchivingService,
    LegalService,
    IndexingService,
    FormattingService,
    JournalMetricsService,
    ReviewerCreditService,
    DataDepositsService,
    FunderComplianceService,
    UniversalSearchService,
    CounterR5Service,
    AiSynthesisService,
    SystemHealthService,
    AiRouterService,
  ],
})
export class AppModule {}
