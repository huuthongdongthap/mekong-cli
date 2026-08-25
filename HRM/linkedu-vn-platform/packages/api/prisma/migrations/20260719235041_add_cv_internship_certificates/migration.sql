-- CreateEnum
CREATE TYPE "CertificateStatus" AS ENUM ('draft', 'issued', 'revoked');

-- CreateEnum
CREATE TYPE "ProfileVisibility" AS ENUM ('private', 'public', 'recruiters_only');

-- CreateTable
CREATE TABLE "learner_profiles" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "learnerId" UUID NOT NULL,
    "bio" TEXT,
    "skills" TEXT[],
    "languages" JSONB,
    "careerObjective" TEXT,
    "portfolioUrl" VARCHAR(500),
    "linkedinUrl" VARCHAR(500),
    "githubUrl" VARCHAR(500),
    "websiteUrl" VARCHAR(500),
    "visibility" "ProfileVisibility" NOT NULL DEFAULT 'private',
    "cvTemplate" TEXT DEFAULT 'default',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "learner_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_experiences" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "learnerProfileId" UUID NOT NULL,
    "learnerId" UUID NOT NULL,
    "companyName" VARCHAR(255) NOT NULL,
    "position" VARCHAR(255) NOT NULL,
    "location" VARCHAR(255),
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "skills" TEXT[],
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "work_experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "educations" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "learnerProfileId" UUID NOT NULL,
    "learnerId" UUID NOT NULL,
    "institution" VARCHAR(255) NOT NULL,
    "degree" VARCHAR(255) NOT NULL,
    "fieldOfStudy" VARCHAR(255),
    "location" VARCHAR(255),
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "gpa" VARCHAR(20),
    "description" TEXT,
    "achievements" TEXT[],
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "educations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "internship_certificates" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "learnerId" UUID NOT NULL,
    "enrollmentId" UUID NOT NULL,
    "enterpriseId" INTEGER NOT NULL,
    "programId" INTEGER NOT NULL,
    "certificateNumber" VARCHAR(50) NOT NULL,
    "issueDate" DATE NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "totalHours" INTEGER NOT NULL,
    "position" VARCHAR(255) NOT NULL,
    "department" VARCHAR(255),
    "supervisorName" VARCHAR(255) NOT NULL,
    "supervisorTitle" VARCHAR(255),
    "evaluationScore" INTEGER,
    "evaluationComment" TEXT,
    "skillsAcquired" TEXT[],
    "achievements" TEXT[],
    "certificateUrl" VARCHAR(500),
    "qrCodeUrl" VARCHAR(500),
    "status" "CertificateStatus" NOT NULL DEFAULT 'draft',
    "issuedById" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "revokedAt" TIMESTAMPTZ,
    "revokedById" UUID,

    CONSTRAINT "internship_certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificate_templates" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "htmlTemplate" TEXT NOT NULL,
    "cssStyles" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "certificate_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "learner_profiles_learnerId_key" ON "learner_profiles"("learnerId");

-- CreateIndex
CREATE INDEX "learner_profiles_learnerId_idx" ON "learner_profiles"("learnerId");

-- CreateIndex
CREATE INDEX "work_experiences_learnerProfileId_idx" ON "work_experiences"("learnerProfileId");

-- CreateIndex
CREATE INDEX "work_experiences_learnerId_idx" ON "work_experiences"("learnerId");

-- CreateIndex
CREATE INDEX "educations_learnerProfileId_idx" ON "educations"("learnerProfileId");

-- CreateIndex
CREATE INDEX "educations_learnerId_idx" ON "educations"("learnerId");

-- CreateIndex
CREATE UNIQUE INDEX "internship_certificates_enrollmentId_key" ON "internship_certificates"("enrollmentId");

-- CreateIndex
CREATE UNIQUE INDEX "internship_certificates_certificateNumber_key" ON "internship_certificates"("certificateNumber");

-- CreateIndex
CREATE INDEX "internship_certificates_learnerId_idx" ON "internship_certificates"("learnerId");

-- CreateIndex
CREATE INDEX "internship_certificates_enterpriseId_idx" ON "internship_certificates"("enterpriseId");

-- CreateIndex
CREATE INDEX "internship_certificates_enrollmentId_idx" ON "internship_certificates"("enrollmentId");

-- CreateIndex
CREATE INDEX "internship_certificates_certificateNumber_idx" ON "internship_certificates"("certificateNumber");

-- CreateIndex
CREATE INDEX "internship_certificates_status_idx" ON "internship_certificates"("status");

-- CreateIndex
CREATE UNIQUE INDEX "certificate_templates_name_key" ON "certificate_templates"("name");

-- AddForeignKey
ALTER TABLE "learner_profiles" ADD CONSTRAINT "learner_profiles_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "learners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_experiences" ADD CONSTRAINT "work_experiences_learnerProfileId_fkey" FOREIGN KEY ("learnerProfileId") REFERENCES "learner_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_experiences" ADD CONSTRAINT "work_experiences_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "learners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "educations" ADD CONSTRAINT "educations_learnerProfileId_fkey" FOREIGN KEY ("learnerProfileId") REFERENCES "learner_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "educations" ADD CONSTRAINT "educations_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "learners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internship_certificates" ADD CONSTRAINT "internship_certificates_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "learners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internship_certificates" ADD CONSTRAINT "internship_certificates_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internship_certificates" ADD CONSTRAINT "internship_certificates_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "enterprises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internship_certificates" ADD CONSTRAINT "internship_certificates_programId_fkey" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internship_certificates" ADD CONSTRAINT "internship_certificates_issuedById_fkey" FOREIGN KEY ("issuedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internship_certificates" ADD CONSTRAINT "internship_certificates_revokedById_fkey" FOREIGN KEY ("revokedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
