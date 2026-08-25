/*
  Warnings:

  - You are about to drop the `retention_events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_disco_scores` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('super_admin', 'school_admin', 'school_staff', 'enterprise_admin', 'enterprise_hr', 'learner');

-- CreateEnum
CREATE TYPE "SchoolType" AS ENUM ('nghe_nghiep', 'cao_dang', 'dai_hoc', 'giao_duc_thuong_xuyen');

-- CreateEnum
CREATE TYPE "SchoolStatus" AS ENUM ('pending', 'verified', 'active', 'suspended', 'archived');

-- CreateEnum
CREATE TYPE "EnterpriseIndustry" AS ENUM ('IT', 'Logistics', 'Manufacturing', 'Healthcare', 'Semiconductor', 'Finance', 'Retail', 'Agriculture', 'GreenEnergy', 'Other');

-- CreateEnum
CREATE TYPE "EnterpriseStatus" AS ENUM ('pending', 'verified', 'active', 'suspended', 'archived');

-- CreateEnum
CREATE TYPE "VnRegion" AS ENUM ('north', 'central', 'south');

-- CreateEnum
CREATE TYPE "DistrictType" AS ENUM ('thanh_pho', 'quan', 'huyen', 'thi_xa', 'xa');

-- CreateEnum
CREATE TYPE "MoaStatus" AS ENUM ('draft', 'pending', 'signed', 'approved', 'active', 'expired', 'cancelled');

-- CreateEnum
CREATE TYPE "ProgramType" AS ENUM ('thuc_tap', 'thuc_tap_chung', 'viec_lam', 'du_hoc');

-- CreateEnum
CREATE TYPE "ProgramField" AS ENUM ('IT', 'AI', 'Cybersecurity', 'Logistics', 'Manufacturing', 'Healthcare', 'Semiconductor', 'Finance', 'Retail', 'GreenEnergy', 'Agriculture', 'Hospitality', 'Education', 'Construction', 'Automotive');

-- CreateEnum
CREATE TYPE "QualificationLevel" AS ENUM ('nghe', 'trung_cap', 'cao_dang', 'dai_hoc', 'sau_dai_hoc');

-- CreateEnum
CREATE TYPE "ProgramStatus" AS ENUM ('draft', 'pending', 'approved', 'active', 'completed', 'archived', 'rejected');

-- CreateEnum
CREATE TYPE "LearnerGender" AS ENUM ('nam', 'nu', 'khac');

-- CreateEnum
CREATE TYPE "LearnerStatus" AS ENUM ('active', 'graduated', 'dropped', 'suspended');

-- CreateEnum
CREATE TYPE "EnrollmentType" AS ENUM ('self_apply', 'staff_created', 'enterprise_nominated');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('pending', 'approved', 'rejected', 'completed', 'withdrawn');

-- CreateEnum
CREATE TYPE "EvaluationType" AS ENUM ('mid_term', 'final', 'supervisor', 'peer', 'self');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('full_time', 'part_time', 'internship', 'contract');

-- CreateEnum
CREATE TYPE "PlacementStatus" AS ENUM ('in_progress', 'completed', 'terminated', 'ongoing');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('draft', 'issued', 'sent', 'paid', 'overdue', 'cancelled', 'refunded');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('bank_transfer', 'momo', 'vnpay', 'zalopay', 'cash', 'other');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'SIGN', 'APPROVE', 'REJECT', 'LOGIN', 'LOGOUT', 'EXPORT');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('mou', 'cv', 'transcript', 'certificate', 'contract', 'report', 'other');

-- DropTable
DROP TABLE "retention_events";

-- DropTable
DROP TABLE "user_disco_scores";

-- CreateTable
CREATE TABLE "provinces" (
    "code" VARCHAR(2) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "nameEn" VARCHAR(100),
    "region" "VnRegion" NOT NULL,

    CONSTRAINT "provinces_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "districts" (
    "id" SERIAL NOT NULL,
    "provinceCode" VARCHAR(2) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" "DistrictType" NOT NULL,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("provinceCode","id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "passwordHash" VARCHAR(255) NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "role" "UserRole" NOT NULL,
    "schoolId" UUID,
    "enterpriseId" INTEGER,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "avatarUrl" TEXT,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schools" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "nameEn" VARCHAR(255),
    "schoolType" "SchoolType" NOT NULL,
    "address" VARCHAR(500),
    "provinceCode" VARCHAR(2),
    "districtId" INTEGER,
    "phone" VARCHAR(20),
    "email" VARCHAR(255),
    "directorName" VARCHAR(200),
    "taxCode" VARCHAR(20),
    "qlgdnnCode" VARCHAR(50),
    "verificationStatus" "SchoolStatus" NOT NULL DEFAULT 'pending',
    "verificationDocs" JSONB,
    "status" "SchoolStatus" NOT NULL DEFAULT 'active',
    "metadata" JSONB,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_contacts" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "schoolId" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "position" VARCHAR(100),
    "phone" VARCHAR(20),
    "email" VARCHAR(255),
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "school_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enterprises" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "nameEn" VARCHAR(255),
    "taxCode" VARCHAR(20) NOT NULL,
    "industry" "EnterpriseIndustry" NOT NULL,
    "address" VARCHAR(500),
    "provinceCode" VARCHAR(2),
    "districtId" INTEGER,
    "phone" VARCHAR(20),
    "email" VARCHAR(255),
    "website" VARCHAR(255),
    "contactName" VARCHAR(200),
    "contactPosition" VARCHAR(100),
    "contactPhone" VARCHAR(20),
    "contactEmail" VARCHAR(255),
    "employeeCount" INTEGER,
    "description" TEXT,
    "logoUrl" TEXT,
    "coverImageUrl" TEXT,
    "status" "EnterpriseStatus" NOT NULL DEFAULT 'pending',
    "metadata" JSONB,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "enterprises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enterprise_contacts" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "enterpriseId" INTEGER NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "position" VARCHAR(100),
    "department" VARCHAR(100),
    "phone" VARCHAR(20),
    "email" VARCHAR(255),
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "enterprise_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moa" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(30) NOT NULL,
    "schoolId" UUID NOT NULL,
    "enterpriseId" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "scope" TEXT,
    "content" TEXT,
    "terms" JSONB,
    "signedDate" DATE,
    "expiresDate" DATE,
    "signedDocUrl" TEXT,
    "signedDocHash" VARCHAR(64),
    "status" "MoaStatus" NOT NULL DEFAULT 'draft',
    "createdById" UUID NOT NULL,
    "approvedById" UUID,
    "approvedAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "moa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programs" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(30) NOT NULL,
    "schoolId" UUID NOT NULL,
    "enterpriseId" INTEGER NOT NULL,
    "moaId" INTEGER,
    "name" VARCHAR(255) NOT NULL,
    "nameEn" VARCHAR(255),
    "programType" "ProgramType" NOT NULL,
    "field" "ProgramField" NOT NULL,
    "qualificationLevel" "QualificationLevel" NOT NULL,
    "durationMonths" INTEGER,
    "maxLearners" INTEGER,
    "enrolledCount" INTEGER NOT NULL DEFAULT 0,
    "startDate" DATE,
    "endDate" DATE,
    "applicationDeadline" DATE,
    "tuitionFeeVnd" INTEGER,
    "description" TEXT,
    "requirements" JSONB,
    "curriculum" JSONB,
    "moetRegistrationNo" VARCHAR(50),
    "status" "ProgramStatus" NOT NULL DEFAULT 'draft',
    "createdById" UUID NOT NULL,
    "approvedById" UUID,
    "approvedAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learners" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "userId" UUID,
    "schoolId" UUID NOT NULL,
    "schoolCode" VARCHAR(20),
    "nationalId" TEXT NOT NULL,
    "fullName" VARCHAR(200) NOT NULL,
    "birthDate" DATE,
    "gender" "LearnerGender" NOT NULL,
    "address" VARCHAR(500),
    "provinceCode" VARCHAR(2),
    "districtId" INTEGER,
    "phone" TEXT,
    "email" TEXT,
    "schoolMajor" VARCHAR(100),
    "graduationYear" INTEGER,
    "gpa" DOUBLE PRECISION,
    "skills" TEXT[],
    "certifications" JSONB,
    "resumeUrl" TEXT,
    "coverLetterUrl" TEXT,
    "emergencyContact" JSONB,
    "status" "LearnerStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "learners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollments" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "enrollmentNo" VARCHAR(30) NOT NULL,
    "programId" INTEGER NOT NULL,
    "learnerId" UUID NOT NULL,
    "enrolledById" UUID,
    "enrollmentType" "EnrollmentType" NOT NULL,
    "examScore" DOUBLE PRECISION,
    "examDate" DATE,
    "examNotes" JSONB,
    "enrolledAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "practiceStart" DATE,
    "practiceEnd" DATE,
    "evaluationScore" DOUBLE PRECISION,
    "evaluationRubric" JSONB,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'pending',
    "approvedById" UUID,
    "approvedAt" TIMESTAMPTZ,
    "rejectionReason" TEXT,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "practice_records" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "enrollmentId" UUID NOT NULL,
    "learnerId" UUID NOT NULL,
    "enterpriseId" INTEGER NOT NULL,
    "practiceDate" DATE NOT NULL,
    "activities" TEXT NOT NULL,
    "hoursWorked" DOUBLE PRECISION NOT NULL,
    "supervisorName" VARCHAR(200) NOT NULL,
    "supervisorSignatureUrl" TEXT,
    "skillsDemonstrated" TEXT[],
    "feedback" TEXT,
    "rating" INTEGER,
    "createdById" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "practice_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluations" (
    "id" SERIAL NOT NULL,
    "enrollmentId" UUID NOT NULL,
    "learnerId" UUID NOT NULL,
    "evaluatorId" UUID NOT NULL,
    "evaluationType" "EvaluationType" NOT NULL,
    "rubric" JSONB,
    "totalScore" DOUBLE PRECISION,
    "maxScore" DOUBLE PRECISION,
    "percentage" DOUBLE PRECISION,
    "feedback" TEXT,
    "strengths" TEXT[],
    "improvements" TEXT[],
    "evidenceDocUrl" TEXT,
    "evaluatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "placements" (
    "id" SERIAL NOT NULL,
    "enrollmentId" UUID NOT NULL,
    "learnerId" UUID NOT NULL,
    "programId" INTEGER NOT NULL,
    "enterpriseId" INTEGER NOT NULL,
    "positionApplied" VARCHAR(200),
    "positionOffered" VARCHAR(200),
    "employmentType" "EmploymentType",
    "salaryMinVnd" INTEGER,
    "salaryMaxVnd" INTEGER,
    "acceptedAt" DATE,
    "startDate" DATE,
    "endDate" DATE,
    "tracking3mStatus" VARCHAR(50),
    "tracking3mDate" DATE,
    "tracking3mNotes" TEXT,
    "tracking6mStatus" VARCHAR(50),
    "tracking6mDate" DATE,
    "tracking6mNotes" TEXT,
    "learnerSatisfaction" INTEGER,
    "enterpriseSatisfaction" INTEGER,
    "learnerFeedback" TEXT,
    "enterpriseFeedback" TEXT,
    "isCurrentJob" BOOLEAN NOT NULL DEFAULT false,
    "endedAt" DATE,
    "status" "PlacementStatus" NOT NULL DEFAULT 'in_progress',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "placements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" SERIAL NOT NULL,
    "invoiceNumber" VARCHAR(30) NOT NULL,
    "schoolId" UUID,
    "enterpriseId" INTEGER,
    "amountVnd" INTEGER NOT NULL,
    "taxAmountVnd" INTEGER NOT NULL DEFAULT 0,
    "totalVnd" INTEGER NOT NULL,
    "issueDate" DATE NOT NULL,
    "dueDate" DATE NOT NULL,
    "paidDate" DATE,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'draft',
    "paymentMethod" "PaymentMethod",
    "paymentReference" VARCHAR(100),
    "invoiceItems" JSONB,
    "relatedEntityType" VARCHAR(50),
    "relatedEntityId" TEXT,
    "issuedById" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" SERIAL NOT NULL,
    "actorId" UUID NOT NULL,
    "actorRole" "UserRole" NOT NULL,
    "action" "AuditAction" NOT NULL,
    "entityType" VARCHAR(50) NOT NULL,
    "entityId" TEXT NOT NULL,
    "changes" JSONB,
    "ipAddress" VARCHAR(45),
    "userAgent" TEXT,
    "requestId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "entityType" VARCHAR(50) NOT NULL,
    "entityId" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "filename" VARCHAR(255) NOT NULL,
    "originalFilename" VARCHAR(255) NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" VARCHAR(100) NOT NULL,
    "r2Bucket" VARCHAR(100) NOT NULL,
    "r2Key" VARCHAR(500) NOT NULL,
    "r2Url" VARCHAR(500),
    "uploadedById" UUID NOT NULL,
    "uploadedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sha256Hash" VARCHAR(64) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_schoolId_role_idx" ON "users"("schoolId", "role");

-- CreateIndex
CREATE INDEX "users_enterpriseId_role_idx" ON "users"("enterpriseId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "schools_code_key" ON "schools"("code");

-- CreateIndex
CREATE UNIQUE INDEX "schools_taxCode_key" ON "schools"("taxCode");

-- CreateIndex
CREATE INDEX "schools_provinceCode_idx" ON "schools"("provinceCode");

-- CreateIndex
CREATE INDEX "schools_status_idx" ON "schools"("status");

-- CreateIndex
CREATE INDEX "schools_code_idx" ON "schools"("code");

-- CreateIndex
CREATE INDEX "school_contacts_schoolId_idx" ON "school_contacts"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "enterprises_taxCode_key" ON "enterprises"("taxCode");

-- CreateIndex
CREATE INDEX "enterprises_industry_idx" ON "enterprises"("industry");

-- CreateIndex
CREATE INDEX "enterprises_provinceCode_idx" ON "enterprises"("provinceCode");

-- CreateIndex
CREATE INDEX "enterprises_status_idx" ON "enterprises"("status");

-- CreateIndex
CREATE INDEX "enterprise_contacts_enterpriseId_idx" ON "enterprise_contacts"("enterpriseId");

-- CreateIndex
CREATE UNIQUE INDEX "moa_code_key" ON "moa"("code");

-- CreateIndex
CREATE INDEX "moa_schoolId_status_idx" ON "moa"("schoolId", "status");

-- CreateIndex
CREATE INDEX "moa_enterpriseId_status_idx" ON "moa"("enterpriseId", "status");

-- CreateIndex
CREATE INDEX "moa_status_idx" ON "moa"("status");

-- CreateIndex
CREATE UNIQUE INDEX "programs_code_key" ON "programs"("code");

-- CreateIndex
CREATE INDEX "programs_schoolId_status_idx" ON "programs"("schoolId", "status");

-- CreateIndex
CREATE INDEX "programs_enterpriseId_status_idx" ON "programs"("enterpriseId", "status");

-- CreateIndex
CREATE INDEX "programs_field_idx" ON "programs"("field");

-- CreateIndex
CREATE INDEX "programs_status_idx" ON "programs"("status");

-- CreateIndex
CREATE UNIQUE INDEX "learners_userId_key" ON "learners"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "learners_nationalId_key" ON "learners"("nationalId");

-- CreateIndex
CREATE INDEX "learners_schoolId_status_idx" ON "learners"("schoolId", "status");

-- CreateIndex
CREATE INDEX "learners_provinceCode_idx" ON "learners"("provinceCode");

-- CreateIndex
CREATE INDEX "learners_status_idx" ON "learners"("status");

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_enrollmentNo_key" ON "enrollments"("enrollmentNo");

-- CreateIndex
CREATE INDEX "enrollments_programId_status_idx" ON "enrollments"("programId", "status");

-- CreateIndex
CREATE INDEX "enrollments_learnerId_status_idx" ON "enrollments"("learnerId", "status");

-- CreateIndex
CREATE INDEX "enrollments_status_idx" ON "enrollments"("status");

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_programId_learnerId_key" ON "enrollments"("programId", "learnerId");

-- CreateIndex
CREATE INDEX "practice_records_enrollmentId_practiceDate_idx" ON "practice_records"("enrollmentId", "practiceDate");

-- CreateIndex
CREATE INDEX "practice_records_learnerId_practiceDate_idx" ON "practice_records"("learnerId", "practiceDate");

-- CreateIndex
CREATE INDEX "evaluations_enrollmentId_evaluationType_idx" ON "evaluations"("enrollmentId", "evaluationType");

-- CreateIndex
CREATE INDEX "placements_enterpriseId_status_idx" ON "placements"("enterpriseId", "status");

-- CreateIndex
CREATE INDEX "placements_learnerId_status_idx" ON "placements"("learnerId", "status");

-- CreateIndex
CREATE INDEX "placements_programId_idx" ON "placements"("programId");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoiceNumber_key" ON "invoices"("invoiceNumber");

-- CreateIndex
CREATE INDEX "invoices_schoolId_status_idx" ON "invoices"("schoolId", "status");

-- CreateIndex
CREATE INDEX "invoices_enterpriseId_status_idx" ON "invoices"("enterpriseId", "status");

-- CreateIndex
CREATE INDEX "invoices_status_idx" ON "invoices"("status");

-- CreateIndex
CREATE INDEX "invoices_dueDate_idx" ON "invoices"("dueDate");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_createdAt_idx" ON "audit_logs"("entityType", "entityId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_actorId_idx" ON "audit_logs"("actorId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "documents_entityType_entityId_idx" ON "documents"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "documents_uploadedById_idx" ON "documents"("uploadedById");

-- AddForeignKey
ALTER TABLE "districts" ADD CONSTRAINT "districts_provinceCode_fkey" FOREIGN KEY ("provinceCode") REFERENCES "provinces"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "enterprises"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schools" ADD CONSTRAINT "schools_provinceCode_fkey" FOREIGN KEY ("provinceCode") REFERENCES "provinces"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schools" ADD CONSTRAINT "schools_provinceCode_districtId_fkey" FOREIGN KEY ("provinceCode", "districtId") REFERENCES "districts"("provinceCode", "id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_contacts" ADD CONSTRAINT "school_contacts_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprises" ADD CONSTRAINT "enterprises_provinceCode_fkey" FOREIGN KEY ("provinceCode") REFERENCES "provinces"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprises" ADD CONSTRAINT "enterprises_provinceCode_districtId_fkey" FOREIGN KEY ("provinceCode", "districtId") REFERENCES "districts"("provinceCode", "id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_contacts" ADD CONSTRAINT "enterprise_contacts_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "enterprises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moa" ADD CONSTRAINT "moa_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moa" ADD CONSTRAINT "moa_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "enterprises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moa" ADD CONSTRAINT "moa_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moa" ADD CONSTRAINT "moa_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "programs_moaId_fkey" FOREIGN KEY ("moaId") REFERENCES "moa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "programs_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "programs_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "enterprises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "programs_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "programs_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learners" ADD CONSTRAINT "learners_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learners" ADD CONSTRAINT "learners_provinceCode_fkey" FOREIGN KEY ("provinceCode") REFERENCES "provinces"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learners" ADD CONSTRAINT "learners_provinceCode_districtId_fkey" FOREIGN KEY ("provinceCode", "districtId") REFERENCES "districts"("provinceCode", "id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_programId_fkey" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "learners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_enrolledById_fkey" FOREIGN KEY ("enrolledById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_records" ADD CONSTRAINT "practice_records_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_records" ADD CONSTRAINT "practice_records_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "learners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_records" ADD CONSTRAINT "practice_records_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "enterprises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_records" ADD CONSTRAINT "practice_records_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_evaluatorId_fkey" FOREIGN KEY ("evaluatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "learners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "placements" ADD CONSTRAINT "placements_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "placements" ADD CONSTRAINT "placements_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "learners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "placements" ADD CONSTRAINT "placements_programId_fkey" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "placements" ADD CONSTRAINT "placements_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "enterprises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_issuedById_fkey" FOREIGN KEY ("issuedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
