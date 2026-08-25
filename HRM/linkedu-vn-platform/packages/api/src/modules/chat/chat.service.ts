import { Injectable, Logger } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import { OpenAI } from 'openai'
import { PrismaService } from '@linkedu/api/common/prisma/prisma.service'
import { ChatQueryDto } from './dto/chat.dto'

export interface SendMessageOptions {
  userId: string
  conversationId?: string
  context?: string
}

/**
 * AI Chatbot for LinkEduVN — career counseling, study guidance, FAQ.
 * Uses OpenAI-compatible API (OpenAI, Azure, or local LLM via Ollama).
 * Every exchange (user + assistant) is persisted per user so history
 * survives restarts and can be paginated per conversation.
 */
@Injectable()
export class ChatService {
  private openai: OpenAI
  private readonly logger = new Logger(ChatService.name)

  constructor(private readonly prisma: PrismaService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL,
    })
  }

  async sendMessage(message: string, options: SendMessageOptions) {
    const conversationId = options.conversationId ?? randomUUID()

    const result = await this.generateReply(message, options.context)

    await this.persistExchange(message, result.reply, options.userId, conversationId)

    return { ...result, conversationId }
  }

  async getHistory(userId: string, query: ChatQueryDto) {
    const page = Number(query.page) > 0 ? Number(query.page) : 1
    const limit = Number(query.limit) > 0 ? Math.min(Number(query.limit), 50) : 20

    const where = {
      userId,
      ...(query.conversationId ? { conversationId: query.conversationId } : {}),
    }

    const [total, rows] = await Promise.all([
      this.prisma.chatMessage.count({ where }),
      this.prisma.chatMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ])

    return {
      // Oldest-first within the page so clients can render chronologically.
      messages: rows.reverse(),
      pagination: { page, limit, total },
    }
  }

  private async generateReply(message: string, context?: string) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: process.env.CHATBOT_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Bạn là trợ lý AI của LinkEduVN — nền tảng liên kết đào tạo thực chiến Việt Nam.
              Bạn hỗ trợ: hướng nghiệp, tư vấn đào tạo, giải thích về CTĐT theo QĐ788/2020,
              kết nối trường nghề và doanh nghiệp. Luôn trả lời bằng tiếng Việt.${context ? `\nBối cảnh: ${context}` : ''}`,
          },
          { role: 'user', content: message },
        ],
        max_tokens: 500,
      })
      return {
        reply: completion.choices[0]?.message?.content || 'Xin lỗi, tôi không thể trả lời câu hỏi này.',
        model: completion.model,
      }
    } catch {
      return {
        reply: 'Dịch vụ AI đang bận. Vui lòng thử lại sau hoặc liên hệ trực tiếp với chúng tôi.',
        model: process.env.CHATBOT_MODEL || 'gpt-4o-mini',
      }
    }
  }

  private async persistExchange(
    userMessage: string,
    assistantReply: string,
    userId: string,
    conversationId: string,
  ) {
    try {
      await this.prisma.chatMessage.createMany({
        data: [
          { userId, conversationId, role: 'user', content: userMessage },
          { userId, conversationId, role: 'assistant', content: assistantReply },
        ],
      })
    } catch (error) {
      // Chat reply must not fail because persistence is unavailable.
      this.logger.error(`Failed to persist chat message: ${error}`)
    }
  }
}