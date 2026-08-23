import { z } from 'zod'

export const EmploymentTypeEnum = z.enum([
  'full_time', 'part_time', 'internship', 'contract',
])

export const PlacementStatusEnum = z.enum([
  'in_progress', 'completed', 'terminated', 'ongoing',
])

export const CreatePlacementSchema = z.object({
  enrollmentId: z.string().uuid('enrollmentId phải là UUID'),
  learnerId: z.string().uuid('learnerId phải là UUID'),
  programId: z.coerce.number().int().positive(),
  enterpriseId: z.coerce.number().int().positive(),
  positionApplied: z.string().min(2, 'Vị trí tối thiểu 2 ký tự').max(200),
  positionOffered: z.string().max(200).optional(),
  employmentType: EmploymentTypeEnum.optional(),
  salaryMinVnd: z.coerce.number().int().nonnegative().optional(),
  salaryMaxVnd: z.coerce.number().int().nonnegative().optional(),
  acceptedAt: z.coerce.date().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  tracking3mStatus: z.string().max(50).optional(),
  tracking3mDate: z.coerce.date().optional(),
  tracking3mNotes: z.string().max(1000).optional(),
  tracking6mStatus: z.string().max(50).optional(),
  tracking6mDate: z.coerce.date().optional(),
  tracking6mNotes: z.string().max(1000).optional(),
  learnerSatisfaction: z.coerce.number().int().min(1).max(5).optional(),
  enterpriseSatisfaction: z.coerce.number().int().min(1).max(5).optional(),
  learnerFeedback: z.string().max(2000).optional(),
  enterpriseFeedback: z.string().max(2000).optional(),
  isCurrentJob: z.boolean().default(false),
  status: PlacementStatusEnum.default('in_progress'),
})

export const UpdatePlacementSchema = CreatePlacementSchema.partial()

export const UpdatePlacementStatusSchema = z.object({
  status: PlacementStatusEnum,
  note: z.string().max(500).optional(),
})

export const ListPlacementQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  learnerId: z.string().uuid().optional(),
  enterpriseId: z.coerce.number().int().positive().optional(),
  programId: z.coerce.number().int().positive().optional(),
  status: PlacementStatusEnum.optional(),
})

export type CreatePlacementDto = z.infer<typeof CreatePlacementSchema>
export type UpdatePlacementDto = z.infer<typeof UpdatePlacementSchema>
export type UpdatePlacementStatusDto = z.infer<typeof UpdatePlacementStatusSchema>
export type ListPlacementQueryDto = z.infer<typeof ListPlacementQuerySchema>
