import { Module } from '@nestjs/common'
import { AcademicRecordsController } from './academic-records.controller'
import { AcademicRecordsService } from './academic-records.service'
import { PrismaModule } from '../../common/prisma/prisma.module'
import { DocumentsModule } from '../documents/documents.module'
import { R2StorageModule } from '../../common/r2-storage/r2-storage.module'
import { PdfModule } from '../../common/pdf/pdf.module'

@Module({
  imports: [PrismaModule, DocumentsModule, R2StorageModule, PdfModule],
  controllers: [AcademicRecordsController],
  providers: [AcademicRecordsService],
  exports: [AcademicRecordsService],
})
export class AcademicRecordsModule {}