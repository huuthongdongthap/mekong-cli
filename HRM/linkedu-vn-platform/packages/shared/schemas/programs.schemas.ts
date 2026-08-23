import { z } from 'zod'

export const ProgramTypeEnum = z.enum([
  'thuc_tap', 'thuc_tap_chung', 'viec_lam', 'du_hoc',
])

export const ProgramFieldEnum = z.enum([
  'IT', 'AI', 'Cybersecurity', 'Logistics', 'Manufacturing', 'Healthcare',
  'Semiconductor', 'Finance', 'Retail', 'GreenEnergy', 'Agriculture',
  'Hospitality', 'Education', 'Construction', 'Automotive',
])

export const QualificationLevelEnum = z.enum([
  'nghe', 'trung_cap', 'cao_dang', 'dai_hoc', 'sau_dai_hoc',
])

export const ProgramStatusEnum = z.enum([
  'draft', 'pending', 'approved', 'active', 'completed', 'archived', 'rejected',
])

export const CreateProgramSchema = z.object({
  name: z.string().min(3, 'Tên CTĐT tối thiểu 3 ký tự').max(255),
  code: z.string().regex(/^CTDT\/\d{4}\/\d{3,6}$/, 'Format: CTDT/YYYY/NNN').optional(),
  programType: ProgramTypeEnum,
  field: ProgramFieldEnum,
  qualificationLevel: QualificationLevelEnum,
  schoolId: z.string().uuid(),
  enterpriseId: z.coerce.number().int().positive(),
  moaId: z.coerce.number().int().positive().optional(),
  durationMonths: z.coerce.number().int().positive().max(72).optional(),
  maxLearners: z.coerce.number().int().positive().optional(),
  tuitionFeeVnd: z.coerce.number().int().nonnegative().optional(),
  description: z.string().max(2000).optional(),
  requirements: z.record(z.unknown()).optional(),
  curriculum: z.record(z.unknown()).optional(),
  moetRegistrationNo: z.string().max(50).optional(),
  status: ProgramStatusEnum.default('draft'),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  applicationDeadline: z.coerce.date().optional(),
})

export const UpdateProgramSchema = CreateProgramSchema.partial().omit({ schoolId: true })

export const ListProgramQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  schoolId: z.string().uuid().optional(),
  enterpriseId: z.coerce.number().int().positive().optional(),
  field: ProgramFieldEnum.optional(),
  status: ProgramStatusEnum.optional(),
  search: z.string().max(200).optional(),
})

export type CreateProgramDto = z.infer<typeof CreateProgramSchema>
export type UpdateProgramDto = z.infer<typeof UpdateProgramSchema>
export type ListProgramQueryDto = z.infer<typeof ListProgramQuerySchema>
