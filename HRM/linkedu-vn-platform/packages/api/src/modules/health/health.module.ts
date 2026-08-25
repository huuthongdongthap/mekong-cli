import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { HealthController } from './health.controller'
import { PrismaModule } from '@linkedu/api/common/prisma/prisma.module'

@Module({
  imports: [TerminusModule, PrismaModule],
  controllers: [HealthController],
  providers: [],
  exports: [],
})
export class HealthModule {}
