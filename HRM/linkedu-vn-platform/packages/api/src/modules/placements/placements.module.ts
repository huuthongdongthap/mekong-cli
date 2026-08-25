import { Module } from '@nestjs/common'
import { PlacementsService } from './placements.service'
import { PlacementsController } from './placements.controller'
import { PrismaModule } from '@linkedu/api/common/prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [PlacementsController],
  providers: [PlacementsService],
  exports: [PlacementsService],
})
export class PlacementsModule {}
