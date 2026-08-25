import { Module } from '@nestjs/common'
import { EnterprisesService } from './enterprises.service'
import { EnterprisesController } from './enterprises.controller'
import { PrismaModule } from '@linkedu/api/common/prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [EnterprisesController],
  providers: [EnterprisesService],
  exports: [EnterprisesService],
})
export class EnterprisesModule {}
