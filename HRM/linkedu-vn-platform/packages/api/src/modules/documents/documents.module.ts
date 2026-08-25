import { Module } from '@nestjs/common'
import { DocumentsController } from './documents.controller'
import { DocumentsService } from './documents.service'
import { PrismaModule } from '@linkedu/api/common/prisma/prisma.module'
import { R2StorageModule } from '@linkedu/api/common/r2-storage/r2-storage.module'

@Module({
  imports: [PrismaModule, R2StorageModule],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}