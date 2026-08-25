import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min, IsArray, ArrayMaxSize, IsDateString } from 'class-validator';

export const LearnerGenderEnum = ['nam', 'nu', 'khac'] as const;
export const LearnerStatusEnum = ['active', 'graduated', 'dropped', 'suspended'] as const;

export class CertificationDto {
  @IsString()
  name: string;

  @IsString()
  issuer: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  credentialId?: string;
}

export class EmergencyContactDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  @IsOptional()
  relationship?: string;
}

export class CreateLearnerDto {
  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsUUID()
  schoolId: string;

  @IsString()
  @Max(20)
  @IsOptional()
  schoolCode?: string;

  @IsString()
  @IsOptional()
  nationalId?: string;

  @IsString()
  @Min(2, { message: 'Họ tên tối thiểu 2 ký tự' })
  @Max(200)
  fullName: string;

  @IsDateString()
  @IsOptional()
  birthDate?: string;

  @IsEnum(LearnerGenderEnum)
  @IsOptional()
  gender?: string;

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

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @Max(100)
  @IsOptional()
  schoolMajor?: string;

  @IsInt()
  @Min(1900)
  @Max(2100)
  @IsOptional()
  graduationYear?: number;

  @IsInt()
  @Min(0)
  @Max(10)
  @IsOptional()
  gpa?: number;

  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(50)
  @IsOptional()
  skills?: string[];

  @IsArray()
  @IsOptional()
  certifications?: CertificationDto[];

  @IsOptional()
  resumeUrl?: string;

  @IsOptional()
  coverLetterUrl?: string;

  @IsOptional()
  emergencyContact?: EmergencyContactDto;

  @IsEnum(LearnerStatusEnum)
  @IsOptional()
  status?: string;
}

export class UpdateLearnerDto {
  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsString()
  @Max(20)
  @IsOptional()
  schoolCode?: string;

  @IsString()
  @IsOptional()
  nationalId?: string;

  @IsString()
  @Min(2, { message: 'Họ tên tối thiểu 2 ký tự' })
  @Max(200)
  @IsOptional()
  fullName?: string;

  @IsDateString()
  @IsOptional()
  birthDate?: string;

  @IsEnum(LearnerGenderEnum)
  @IsOptional()
  gender?: string;

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

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @Max(100)
  @IsOptional()
  schoolMajor?: string;

  @IsInt()
  @Min(1900)
  @Max(2100)
  @IsOptional()
  graduationYear?: number;

  @IsInt()
  @Min(0)
  @Max(10)
  @IsOptional()
  gpa?: number;

  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(50)
  @IsOptional()
  skills?: string[];

  @IsArray()
  @IsOptional()
  certifications?: CertificationDto[];

  @IsOptional()
  resumeUrl?: string;

  @IsOptional()
  coverLetterUrl?: string;

  @IsOptional()
  emergencyContact?: EmergencyContactDto;

  @IsEnum(LearnerStatusEnum)
  @IsOptional()
  status?: string;
}

export class ListLearnerQueryDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  limit?: number = 20;

  @IsUUID()
  @IsOptional()
  schoolId?: string;

  @IsEnum(LearnerStatusEnum)
  @IsOptional()
  status?: string;

  @IsString()
  @Max(200)
  @IsOptional()
  search?: string;

  @IsString()
  @Max(50)
  @IsOptional()
  field?: string;
}
