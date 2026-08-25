import { Module } from '@nestjs/common'
import { LearnerProfileService } from './learner-profile.service'
import { LearnerProfileController } from './learner-profile.controller'
import { PrismaModule } from '@linkedu/api/common/prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [LearnerProfileController],
  providers: [LearnerProfileService],
  exports: [LearnerProfileService],
})
export class LearnerProfileModule {}