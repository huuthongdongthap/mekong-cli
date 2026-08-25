import { Module } from '@nestjs/common'
import { SchoolsService } from './schools.service'
import { SchoolsController } from './schools.controller'
import { PrismaModule } from '@linkedu/api/common/prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [SchoolsController],
  providers: [SchoolsService],
  exports: [SchoolsService],
})
export class SchoolsModule {}
