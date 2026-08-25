import { IsEnum, IsInt, IsOptional, IsString, Max, Min, IsEmail } from 'class-validator';

export const SchoolTypeEnum = ['nghe_nghiep', 'cao_dang', 'dai_hoc', 'giao_duc_thuong_xuyen'] as const;
export const SchoolStatusEnum = ['pending', 'verified', 'active', 'suspended', 'archived'] as const;

export class CreateSchoolDto {
  @IsString()
  @Min(2, { message: 'Tên trường tối thiểu 2 ký tự' })
  @Max(255)
  name: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsEnum(SchoolTypeEnum)
  @IsOptional()
  schoolType?: string;

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

  @IsString()
  @Max(200)
  @IsOptional()
  directorName?: string;

  @IsString()
  @IsOptional()
  taxCode?: string;

  @IsString()
  @Max(50)
  @IsOptional()
  qlgdnnCode?: string;

  @IsEnum(SchoolStatusEnum)
  @IsOptional()
  verificationStatus?: string;

  @IsEnum(SchoolStatusEnum)
  @IsOptional()
  status?: string;
}

export class UpdateSchoolDto {
  @IsString()
  @Max(255)
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsEnum(SchoolTypeEnum)
  @IsOptional()
  schoolType?: string;

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

  @IsString()
  @Max(200)
  @IsOptional()
  directorName?: string;

  @IsString()
  @IsOptional()
  taxCode?: string;

  @IsString()
  @Max(50)
  @IsOptional()
  qlgdnnCode?: string;

  @IsEnum(SchoolStatusEnum)
  @IsOptional()
  verificationStatus?: string;

  @IsEnum(SchoolStatusEnum)
  @IsOptional()
  status?: string;
}

export class ListSchoolQueryDto {
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

  @IsEnum(SchoolStatusEnum)
  @IsOptional()
  status?: string;
}
