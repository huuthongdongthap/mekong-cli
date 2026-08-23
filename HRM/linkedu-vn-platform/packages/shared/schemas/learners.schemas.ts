import { z } from 'zod'

export const LearnerGenderEnum = z.enum(['nam', 'nu', 'khac'])
export const LearnerStatusEnum = z.enum(['active', 'graduated', 'dropped', 'suspended'])

export const CreateLearnerSchema = z.object({
  userId: z.string().uuid().optional(),
  schoolId: z.string().uuid(),
  schoolCode: z.string().max(20).optional(),
  nationalId: z.string().regex(/^[A-Za-z0-9+/=]+$/, 'CCCD phải là chuỗi Base64 (AES-256-GCM encrypt ở app layer)'),
  fullName: z.string().min(2, 'Họ tên tối thiểu 2 ký tự').max(200),
  birthDate: z.coerce.date().optional(),
  gender: LearnerGenderEnum.optional(),
  address: z.string().max(500).optional(),
  provinceCode: z.string().regex(/^[0-9]{2}$/).optional(),
  districtId: z.coerce.number().int().positive().optional(),
  phone: z.string().regex(/^(\+84|0)[0-9]{8,9}$/).optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  schoolMajor: z.string().max(100).optional(),
  graduationYear: z.coerce.number().int().min(1900).max(2100).optional(),
  gpa: z.coerce.number().min(0).max(10).optional(),
  skills: z.array(z.string()).optional(),
  certifications: z.array(z.object({
    name: z.string(),
    issuer: z.string(),
    date: z.coerce.date().optional(),
    credentialId: z.string().optional(),
  })).optional(),
  resumeUrl: z.string().url().optional().or(z.literal('')),
  coverLetterUrl: z.string().url().optional().or(z.literal('')),
  emergencyContact: z.object({
    name: z.string(),
    phone: z.string(),
    relationship: z.string().optional(),
  }).optional(),
  status: LearnerStatusEnum.default('active'),
})

export const UpdateLearnerSchema = CreateLearnerSchema.partial()

export const ListLearnerQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  schoolId: z.string().uuid().optional(),
  status: LearnerStatusEnum.optional(),
  search: z.string().max(200).optional(),
  field: z.string().max(50).optional(),
})

export type CreateLearnerDto = z.infer<typeof CreateLearnerSchema>
export type UpdateLearnerDto = z.infer<typeof UpdateLearnerSchema>
export type ListLearnerQueryDto = z.infer<typeof ListLearnerQuerySchema>
