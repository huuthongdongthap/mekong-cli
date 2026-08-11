import { Module } from '@nestjs/common'
import { UnitEconomicsService } from './unit-economics.service'
import { UnitEconomicsController } from './unit-economics.controller'
import { PrismaModule } from '@linkedu/api/common/prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [UnitEconomicsController],
  providers: [UnitEconomicsService],
  exports: [UnitEconomicsService],
})
export class UnitEconomicsModule {}