import { Module } from '@nestjs/common'
import { MoasService } from './moas.service'
import { MoasController } from './moas.controller'
import { PrismaModule } from '@linkedu/api/common/prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [MoasController],
  providers: [MoasService],
  exports: [MoasService],
})
export class MoasModule {}
