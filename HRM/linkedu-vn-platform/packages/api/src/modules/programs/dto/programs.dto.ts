import { IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateProgramDto {
  @IsString()
  @Min(3, { message: 'Tên CTĐT tối thiểu 3 ký tự' })
  @Max(255)
  name: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsEnum(['thuc_tap', 'thuc_tap_chung', 'viec_lam', 'du_hoc'])
  programType: string;

  @IsEnum(['IT', 'AI', 'Cybersecurity', 'Logistics', 'Manufacturing', 'Healthcare', 'Semiconductor', 'Finance', 'Retail', 'GreenEnergy', 'Agriculture', 'Hospitality', 'Education', 'Construction', 'Automotive'])
  field: string;

  @IsEnum(['nghe', 'trung_cap', 'cao_dang', 'dai_hoc', 'sau_dai_hoc'])
  qualificationLevel: string;

  @IsUUID()
  schoolId: string;

  @IsInt()
  @Min(1)
  enterpriseId: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  moaId?: number;

  @IsInt()
  @Min(1)
  @Max(72)
  @IsOptional()
  durationMonths?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  maxLearners?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  tuitionFeeVnd?: number;

  @IsString()
  @Max(2000)
  @IsOptional()
  description?: string;

  @IsString()
  @Max(50)
  @IsOptional()
  moetRegistrationNo?: string;

  @IsEnum(['draft', 'pending', 'approved', 'active', 'completed', 'archived', 'rejected'])
  @IsOptional()
  status?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsDateString()
  @IsOptional()
  applicationDeadline?: string;
}

export class UpdateProgramDto {
  @IsString()
  @Min(3)
  @Max(255)
  @IsOptional()
  name?: string;

  @IsEnum(['thuc_tap', 'thuc_tap_chung', 'viec_lam', 'du_hoc'])
  @IsOptional()
  programType?: string;

  @IsInt()
  @Min(1)
  @Max(72)
  @IsOptional()
  durationMonths?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  maxLearners?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  tuitionFeeVnd?: number;

  @IsString()
  @Max(2000)
  @IsOptional()
  description?: string;

  @IsEnum(['draft', 'pending', 'approved', 'active', 'completed', 'archived', 'rejected'])
  @IsOptional()
  status?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}

export class ListProgramQueryDto {
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

  @IsInt()
  @Min(1)
  @IsOptional()
  enterpriseId?: number;

  @IsString()
  @IsOptional()
  search?: string;
}
