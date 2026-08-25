import { Module } from '@nestjs/common'
import { LearnersService } from './learners.service'
import { LearnersController } from './learners.controller'
import { PrismaModule } from '@linkedu/api/common/prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [LearnersController],
  providers: [LearnersService],
  exports: [LearnersService],
})
export class LearnersModule {}
