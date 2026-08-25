import { Module } from '@nestjs/common'
import { GeographicController } from './geographic.controller'
import { GeographicService } from './geographic.service'
import { PrismaModule } from '@linkedu/api/common/prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [GeographicController],
  providers: [GeographicService],
  exports: [GeographicService],
})
export class GeographicModule {}
