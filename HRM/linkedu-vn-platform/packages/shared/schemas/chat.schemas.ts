import { z } from 'zod'

export const SendMessageSchema = z.object({
  message: z.string().min(1, 'Nội dung không được trống').max(4000),
  context: z.string().max(2000).optional(),
  conversationId: z.string().uuid().optional(),
})

export const ChatQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  conversationId: z.string().uuid().optional(),
})

export type SendMessageDto = z.infer<typeof SendMessageSchema>
export type ChatQueryDto = z.infer<typeof ChatQuerySchema>
