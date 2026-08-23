import { z } from 'zod'

export const CreateSchoolSchema = z.object({
  name: z.string().min(2, 'Tên trường tối thiểu 2 ký tự').max(255),
  code: z.string().regex(/^[A-Z0-9\-]{2,20}$/, 'Mã trường: chữ hoa, số, dấu gạch ngang').optional(),
  schoolType: z.enum(['nghe_nghiep', 'cao_dang', 'dai_hoc', 'giao_duc_thuong_xuyen']).optional(),
  address: z.string().max(500).optional(),
  provinceCode: z.string().regex(/^[0-9]{2}$/, 'Mã tỉnh 2 số, ví dụ "01"').optional(),
  districtId: z.coerce.number().int().positive().optional(),
  phone: z.string().regex(/^(\+84|0)[0-9]{8,9}$/, 'Số điện thoại').optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  directorName: z.string().max(200).optional(),
  taxCode: z.string().regex(/^[0-9]{10,14}$/, 'MST 10-14 số').optional().or(z.literal('')),
  qlgdnnCode: z.string().max(50).optional(),
  verificationStatus: z.enum(['pending', 'verified', 'active', 'suspended', 'archived']).default('pending'),
  status: z.enum(['pending', 'verified', 'active', 'suspended', 'archived']).default('active'),
  metadata: z.record(z.unknown()).optional(),
})

export const UpdateSchoolSchema = CreateSchoolSchema.partial()
export type CreateSchoolDto = z.infer<typeof CreateSchoolSchema>
export type UpdateSchoolDto = z.infer<typeof UpdateSchoolSchema>
