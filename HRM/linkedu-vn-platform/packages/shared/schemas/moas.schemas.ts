import { z } from 'zod'

export const MoaStatusEnum = z.enum([
  'draft', 'pending', 'signed', 'approved', 'active', 'expired', 'cancelled',
])

export const CreateMoaSchema = z.object({
  title: z.string().min(5, 'Tiêu đề tối thiểu 5 ký tự').max(255),
  scope: z.string().max(2000).optional(),
  content: z.string().max(5000).optional(),
  terms: z.record(z.unknown()).optional(),
  schoolId: z.string().uuid(),
  enterpriseId: z.coerce.number().int().positive(),
  signedDocUrl: z.string().url().optional().or(z.literal('')),
  validFrom: z.coerce.date().optional(),
  validTo: z.coerce.date().optional(),
})

export const SignMoaSchema = z.object({
  signedDocUrl: z.string().url('URL không hợp lệ'),
  note: z.string().max(1000).optional(),
})

export const ListMoaQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  status: MoaStatusEnum.optional(),
  schoolId: z.string().uuid().optional(),
  enterpriseId: z.coerce.number().int().positive().optional(),
})

export type CreateMoaDto = z.infer<typeof CreateMoaSchema>
export type SignMoaDto = z.infer<typeof SignMoaSchema>
export type ListMoaQueryDto = z.infer<typeof ListMoaQuerySchema>
