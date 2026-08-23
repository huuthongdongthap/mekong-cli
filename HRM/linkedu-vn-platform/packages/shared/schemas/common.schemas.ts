import { z } from 'zod'

// Pagination
export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type PaginationQueryDto = z.infer<typeof PaginationQuerySchema>

// Generic list query (pagination + filter)
export const ListQuerySchema = PaginationQuerySchema.extend({
  search: z.string().max(200).optional(),
  status: z.string().optional(),
})

export type ListQueryDto = z.infer<typeof ListQuerySchema>

// UUID param
export const UuidParamSchema = z.object({
  id: z.string().uuid(),
})

export type UuidParamDto = z.infer<typeof UuidParamSchema>

// Error response
export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    messageEn: z.string(),
    details: z.array(z.object({
      field: z.string(),
      message: z.string(),
    })).optional(),
    requestId: z.string().optional(),
  }),
  timestamp: z.string().datetime(),
  path: z.string(),
})
