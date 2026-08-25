import { IsEmail, IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator'

export class RegisterDto {
  @IsEmail()
  email: string

  @IsString()
  @Length(8, 100)
  password: string

  @IsString()
  @Length(2, 50)
  firstName: string

  @IsString()
  @Length(2, 50)
  lastName: string

  @IsString()
  @Matches(/^(\+84|0)[0-9]{9,10}$/, { message: 'Số điện thoại không hợp lệ' })
  phone: string

  @IsEnum(['school_admin', 'school_staff', 'enterprise_admin', 'enterprise_hr', 'learner'])
  role: string

  @IsString()
  @IsOptional()
  schoolId?: string

  @IsString()
  @IsOptional()
  enterpriseId?: string
}

export class LoginDto {
  @IsEmail()
  email: string

  @IsString()
  password: string

  @IsString()
  @IsOptional()
  mfaCode?: string
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string
}

export class ForgotPasswordDto {
  @IsEmail()
  email: string
}

export class ResetPasswordDto {
  @IsString()
  token: string

  @IsString()
  @Length(8, 100)
  newPassword: string
}
