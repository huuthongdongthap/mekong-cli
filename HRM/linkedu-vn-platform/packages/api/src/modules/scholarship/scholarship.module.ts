import { Module } from '@nestjs/common'
import { ScholarshipService } from './scholarship.service'
import { ScholarshipFundService } from './scholarship-fund.service'
import { ScholarshipPillarService } from './scholarship-pillar.service'
import { ScholarshipAllocationService } from './scholarship-allocation.service'
import { ScholarshipController } from './scholarship.controller'
import { PrismaModule } from '@linkedu/api/common/prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [ScholarshipController],
  providers: [
    ScholarshipService,
    ScholarshipFundService,
    ScholarshipPillarService,
    ScholarshipAllocationService,
  ],
  exports: [ScholarshipService],
})
export class ScholarshipModule {}
