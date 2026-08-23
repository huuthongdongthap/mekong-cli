import { z } from 'zod'

export const InvoiceStatusEnum = z.enum([
  'draft', 'issued', 'sent', 'paid', 'overdue', 'cancelled', 'refunded',
])

export const PaymentMethodEnum = z.enum([
  'bank_transfer', 'momo', 'vnpay', 'zalopay', 'cash', 'other',
])

export const CreateInvoiceSchema = z.object({
  schoolId: z.string().uuid().optional(),
  enterpriseId: z.coerce.number().int().positive().optional(),
  amountVnd: z.coerce.number().int().positive('Số tiền phải > 0'),
  taxAmountVnd: z.coerce.number().int().nonnegative().default(0),
  totalVnd: z.coerce.number().int().positive().optional(),
  issueDate: z.coerce.date().optional(),
  dueDate: z.coerce.date(),
  paymentMethod: PaymentMethodEnum.optional(),
  paymentReference: z.string().max(100).optional(),
  invoiceItems: z.array(z.object({
    description: z.string(),
    quantity: z.coerce.number().int().positive(),
    unitPrice: z.coerce.number().int().nonnegative(),
    amount: z.coerce.number().int().nonnegative(),
  })).optional(),
  relatedEntityType: z.string().max(50).optional(),
  relatedEntityId: z.string().uuid().optional(),
  description: z.string().max(500).optional(),
})

export const UpdateInvoiceStatusSchema = z.object({
  status: InvoiceStatusEnum,
  paymentMethod: PaymentMethodEnum.optional(),
  paymentReference: z.string().max(200).optional(),
  note: z.string().max(500).optional(),
})

export const ListInvoiceQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  status: InvoiceStatusEnum.optional(),
  schoolId: z.string().uuid().optional(),
  enterpriseId: z.coerce.number().int().positive().optional(),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
  dueFrom: z.coerce.date().optional(),
  dueTo: z.coerce.date().optional(),
})

export type CreateInvoiceDto = z.infer<typeof CreateInvoiceSchema>
export type UpdateInvoiceStatusDto = z.infer<typeof UpdateInvoiceStatusSchema>
export type ListInvoiceQueryDto = z.infer<typeof ListInvoiceQuerySchema>
