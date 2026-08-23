import { z } from 'zod'

export const CreateEnterpriseSchema = z.object({
  name: z.string().min(2, 'Tên DN tối thiểu 2 ký tự').max(255),
  nameEn: z.string().max(255).optional(),
  taxCode: z.string().regex(/^[0-9]{10,14}$/, 'MST 10-14 số'),
  industry: z.enum(['IT', 'Logistics', 'Manufacturing', 'Healthcare', 'Semiconductor', 'Finance', 'Retail', 'Agriculture', 'GreenEnergy', 'Other']).optional(),
  address: z.string().max(500).optional(),
  provinceCode: z.string().regex(/^[0-9]{2}$/).optional(),
  districtId: z.coerce.number().int().positive().optional(),
  phone: z.string().regex(/^(\+84|0)[0-9]{8,9}$/).optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  contactName: z.string().max(200).optional(),
  contactPosition: z.string().max(100).optional(),
  contactPhone: z.string().regex(/^(\+84|0)[0-9]{8,9}$/).optional().or(z.literal('')),
  contactEmail: z.string().email().optional().or(z.literal('')),
  employeeCount: z.coerce.number().int().nonnegative().optional(),
  description: z.string().max(2000).optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
  status: z.enum(['pending', 'verified', 'active', 'suspended', 'archived']).default('pending'),
  metadata: z.record(z.unknown()).optional(),
})

export const UpdateEnterpriseSchema = CreateEnterpriseSchema.partial()
export type CreateEnterpriseDto = z.infer<typeof CreateEnterpriseSchema>
export type UpdateEnterpriseDto = z.infer<typeof UpdateEnterpriseSchema>
