import { Module } from '@nestjs/common'
import { EnrollmentsService } from './enrollments.service'
import { EnrollmentsController } from './enrollments.controller'
import { PrismaModule } from '@linkedu/api/common/prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}
