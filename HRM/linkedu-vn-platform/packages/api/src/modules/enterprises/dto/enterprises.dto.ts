import { IsEnum, IsInt, IsOptional, IsString, Max, Min, IsEmail, IsUrl } from 'class-validator';

export const EnterpriseIndustryEnum = ['IT', 'Logistics', 'Manufacturing', 'Healthcare', 'Semiconductor', 'Finance', 'Retail', 'Agriculture', 'GreenEnergy', 'Other'] as const;
export const EnterpriseStatusEnum = ['pending', 'verified', 'active', 'suspended', 'archived'] as const;

export class CreateEnterpriseDto {
  @IsString()
  @Min(2, { message: 'Tên DN tối thiểu 2 ký tự' })
  @Max(255)
  name: string;

  @IsString()
  @Max(255)
  @IsOptional()
  nameEn?: string;

  @IsString()
  @IsOptional()
  taxCode?: string;

  @IsEnum(EnterpriseIndustryEnum)
  @IsOptional()
  industry?: string;

  @IsString()
  @Max(500)
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  provinceCode?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  districtId?: number;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsOptional()
  email?: string;

  @IsUrl({}, { message: 'Website URL không hợp lệ' })
  @IsOptional()
  website?: string;

  @IsString()
  @Max(200)
  @IsOptional()
  contactName?: string;

  @IsString()
  @Max(100)
  @IsOptional()
  contactPosition?: string;

  @IsString()
  @IsOptional()
  contactPhone?: string;

  @IsEmail({}, { message: 'Email liên hệ không hợp lệ' })
  @IsOptional()
  contactEmail?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  employeeCount?: number;

  @IsString()
  @Max(2000)
  @IsOptional()
  description?: string;

  @IsUrl({}, { message: 'Logo URL không hợp lệ' })
  @IsOptional()
  logoUrl?: string;

  @IsEnum(EnterpriseStatusEnum)
  @IsOptional()
  status?: string;
}

export class UpdateEnterpriseDto {
  @IsString()
  @Max(255)
  @IsOptional()
  name?: string;

  @IsString()
  @Max(255)
  @IsOptional()
  nameEn?: string;

  @IsString()
  @IsOptional()
  taxCode?: string;

  @IsEnum(EnterpriseIndustryEnum)
  @IsOptional()
  industry?: string;

  @IsString()
  @Max(500)
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  provinceCode?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  districtId?: number;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsOptional()
  email?: string;

  @IsUrl({}, { message: 'Website URL không hợp lệ' })
  @IsOptional()
  website?: string;

  @IsString()
  @Max(200)
  @IsOptional()
  contactName?: string;

  @IsString()
  @Max(100)
  @IsOptional()
  contactPosition?: string;

  @IsString()
  @IsOptional()
  contactPhone?: string;

  @IsEmail({}, { message: 'Email liên hệ không hợp lệ' })
  @IsOptional()
  contactEmail?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  employeeCount?: number;

  @IsString()
  @Max(2000)
  @IsOptional()
  description?: string;

  @IsUrl({}, { message: 'Logo URL không hợp lệ' })
  @IsOptional()
  logoUrl?: string;

  @IsEnum(EnterpriseStatusEnum)
  @IsOptional()
  status?: string;
}

export class ListEnterpriseQueryDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  limit?: number = 20;

  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(EnterpriseIndustryEnum)
  @IsOptional()
  industry?: string;

  @IsEnum(EnterpriseStatusEnum)
  @IsOptional()
  status?: string;
}
