-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "deletedAt" TIMESTAMPTZ;

-- AddForeignKey
ALTER TABLE "learners" ADD CONSTRAINT "learners_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "enterprises"("id") ON DELETE SET NULL ON UPDATE CASCADE;
