import { Module } from '@nestjs/common'
import { ChatService } from './chat.service'
import { ChatController } from './chat.controller'
import { RedisModule } from '../redis.module'
import { PrismaModule } from '@linkedu/api/common/prisma/prisma.module'

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
