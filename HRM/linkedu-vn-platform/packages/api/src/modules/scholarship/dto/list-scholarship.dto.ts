import { IsInt, IsOptional, IsUUID, IsEnum, IsDateString, Max, Min } from 'class-validator'

export class ListScholarshipFundDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1

  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  limit?: number = 20

  @IsOptional()
  isActive?: boolean

  @IsDateString()
  @IsOptional()
  startDateFrom?: string

  @IsDateString()
  @IsOptional()
  startDateTo?: string
}

export class ListScholarshipAllocationDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1

  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  limit?: number = 20

  @IsUUID()
  @IsOptional()
  fundId?: string

  @IsUUID()
  @IsOptional()
  pillarId?: string

  @IsUUID()
  @IsOptional()
  learnerId?: string

  @IsEnum(['pending', 'approved', 'disbursed', 'rejected', 'cancelled'])
  @IsOptional()
  status?: string
}

export class ScholarshipSummaryDto {
  @IsUUID()
  fundId!: string
}
