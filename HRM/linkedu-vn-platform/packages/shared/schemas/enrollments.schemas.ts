import { z } from 'zod'

export const EnrollmentTypeEnum = z.enum([
  'self_apply', 'staff_created', 'enterprise_nominated',
])

export const EnrollmentStatusEnum = z.enum([
  'pending', 'approved', 'rejected', 'completed', 'withdrawn',
])

export const EnrollLearnerSchema = z.object({
  learnerId: z.string().uuid('learnerId phải là UUID'),
  programId: z.coerce.number().int().positive('programId không hợp lệ'),
  enrollmentType: EnrollmentTypeEnum.default('staff_created'),
  enrolledById: z.string().uuid().optional(),
  examScore: z.coerce.number().min(0).max(10).optional(),
  examDate: z.coerce.date().optional(),
  examNotes: z.record(z.unknown()).optional(),
  practiceStart: z.coerce.date().optional(),
  practiceEnd: z.coerce.date().optional(),
  notes: z.string().max(1000).optional(),
})

export const UpdateEnrollmentStatusSchema = z.object({
  status: EnrollmentStatusEnum,
  reason: z.string().max(500).optional(),
})

export const ListEnrollmentQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  programId: z.coerce.number().int().positive().optional(),
  learnerId: z.string().uuid().optional(),
  schoolId: z.string().uuid().optional(),
  status: EnrollmentStatusEnum.optional(),
})

export type EnrollLearnerDto = z.infer<typeof EnrollLearnerSchema>
export type UpdateEnrollmentStatusDto = z.infer<typeof UpdateEnrollmentStatusSchema>
export type ListEnrollmentQueryDto = z.infer<typeof ListEnrollmentQuerySchema>
