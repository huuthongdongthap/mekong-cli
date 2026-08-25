import { Module } from '@nestjs/common'
import { PracticeRecordsService } from './practice-records.service'
import { PracticeRecordsController } from './practice-records.controller'
import { PrismaModule } from '@linkedu/api/common/prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [PracticeRecordsController],
  providers: [PracticeRecordsService],
  exports: [PracticeRecordsService],
})
export class PracticeRecordsModule {}
