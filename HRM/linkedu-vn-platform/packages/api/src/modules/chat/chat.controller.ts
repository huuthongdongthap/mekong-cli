import { Controller, Post, Get, UseGuards, Body, Query, Req } from '@nestjs/common'
import { ChatService } from './chat.service'
import { JwtAuthGuard } from '@linkedu/api/modules/auth/guards/jwt-auth.guard.wrapper'
import { TenantGuard } from '@linkedu/api/common/guards/tenant.guard'
import { SendMessageDto, ChatQueryDto } from './dto/chat.dto'

@Controller('chat')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ChatController {
  constructor(private readonly service: ChatService) {}

  @Post('message')
  async sendMessage(@Req() req: any, @Body() dto: SendMessageDto) {
    return this.service.sendMessage(dto.message, {
      userId: req.user.id,
      conversationId: dto.conversationId,
      context: dto.context,
    })
  }

  @Get('history')
  getHistory(@Req() req: any, @Query() query: ChatQueryDto) {
    return this.service.getHistory(req.user.id, query)
  }
}