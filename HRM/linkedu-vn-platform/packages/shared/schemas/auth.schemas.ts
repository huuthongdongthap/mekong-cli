import { z } from 'zod'

// Register
export const RegisterSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự'),
  fullName: z.string().min(2, 'Họ tên tối thiểu 2 ký tự'),
  phone: z.string().regex(/^(\+84|0)[0-9]{9,10}$/, 'Số điện thoại không hợp lệ'),
  role: z.enum(['school_admin', 'school_staff', 'enterprise_admin', 'enterprise_hr', 'learner']),
  schoolId: z.string().uuid().optional(),
  enterpriseId: z.string().uuid().optional(),
})

// Login
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  mfaCode: z.string().optional(),
})

// Refresh token
export const RefreshTokenSchema = z.object({
  refreshToken: z.string().uuid(),
})

// Reset password / forgot
export const ForgotPasswordSchema = z.object({
  email: z.string().email(),
})

export const ResetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8),
})
