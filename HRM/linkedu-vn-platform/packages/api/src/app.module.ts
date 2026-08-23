import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

// Infrastructure (ConfigModule, ThrottlerModule, PrismaModule, RedisModule,
// StorageModule, LoggerModule, HealthModule, filters, interceptors — all in AppConfigModule)
import { AppConfigModule } from './app.config'

// Feature modules
import { AuthModule } from './modules/auth/auth.module'
import { SchoolsModule } from './modules/schools/schools.module'
import { EnterprisesModule } from './modules/enterprises/enterprises.module'
import { MoasModule } from './modules/moas/moas.module'
import { ProgramsModule } from './modules/programs/programs.module'
import { LearnersModule } from './modules/learners/learners.module'
import { LearnerProfileModule } from './modules/learner-profile/learner-profile.module'
import { EnrollmentsModule } from './modules/enrollments/enrollments.module'
import { PlacementsModule } from './modules/placements/placements.module'
import { InvoicesModule } from './modules/invoices/invoices.module'
import { DashboardModule } from './modules/dashboard/dashboard.module'
import { ChatModule } from './modules/chat/chat.module'
import { InternshipCertificatesModule } from './modules/internship-certificates/internship-certificates.module'
import { AcademicRecordsModule } from './modules/academic-records/academic-records.module'

import { RetentionModule } from './retention/retention.module'

// New Phase 1-2 modules
import { PricingModule } from './modules/pricing/pricing.module'
import { UnitEconomicsModule } from './modules/unit-economics/unit-economics.module'
import { UnitEconomicsJob } from './jobs/unit-economics.job'

// Placeholder stubs for remaining modules (to be implemented in later phases)
import { GeographicModule } from './modules/geographic/geographic.module'
import { PracticeRecordsModule } from './modules/practice-records/practice-records.module'
import { EvaluationsModule } from './modules/evaluations/evaluations.module'
import { DocumentsModule } from './modules/documents/documents.module'
import { AuditModule } from './modules/audit/audit.module'
import { ScholarshipModule } from './modules/scholarship/scholarship.module'

@Module({
  imports: [
    // Infrastructure (Config, Throttler, Prisma, Redis, Storage, Logger, Health, filters, interceptors)
    AppConfigModule,

    // Scheduling
    ScheduleModule.forRoot(),

    // Feature modules
    AuthModule,
    SchoolsModule,
    EnterprisesModule,
    GeographicModule,
    MoasModule,
    ProgramsModule,
    LearnersModule,
    LearnerProfileModule,
    EnrollmentsModule,
    PracticeRecordsModule,
    EvaluationsModule,
    PlacementsModule,
    InvoicesModule,
    DocumentsModule,
    AuditModule,
    DashboardModule,
    ChatModule,
    InternshipCertificatesModule,
    AcademicRecordsModule,

    // New Phase 1-2 modules
    PricingModule,
    UnitEconomicsModule,
    ScholarshipModule,

    RetentionModule,
  ],
  providers: [
    // Scheduled jobs
    UnitEconomicsJob,
  ],
})
export class AppModule {}
