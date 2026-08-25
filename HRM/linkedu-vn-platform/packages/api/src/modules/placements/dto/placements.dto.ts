import { IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min, IsBoolean } from 'class-validator'

const EmploymentTypeEnum = ['full_time', 'part_time', 'internship', 'contract'] as const
const PlacementStatusEnum = ['in_progress', 'completed', 'terminated', 'ongoing'] as const

export class CreatePlacementDto {
  @IsUUID()
  enrollmentId: string

  @IsUUID()
  learnerId: string

  @IsInt()
  @Min(1)
  programId: number

  @IsInt()
  @Min(1)
  enterpriseId: number

  @IsString()
  @Min(2, { message: 'Vị trí tối thiểu 2 ký tự' })
  @Max(200)
  positionApplied: string

  @IsString()
  @Max(200)
  @IsOptional()
  positionOffered?: string

  @IsEnum(EmploymentTypeEnum)
  @IsOptional()
  employmentType?: string

  @IsInt()
  @Min(0)
  @IsOptional()
  salaryMinVnd?: number

  @IsInt()
  @Min(0)
  @IsOptional()
  salaryMaxVnd?: number

  @IsDateString()
  @IsOptional()
  acceptedAt?: string

  @IsDateString()
  @IsOptional()
  startDate?: string

  @IsDateString()
  @IsOptional()
  endDate?: string

  @IsString()
  @Max(50)
  @IsOptional()
  tracking3mStatus?: string

  @IsDateString()
  @IsOptional()
  tracking3mDate?: string

  @IsString()
  @Max(1000)
  @IsOptional()
  tracking3mNotes?: string

  @IsString()
  @Max(50)
  @IsOptional()
  tracking6mStatus?: string

  @IsDateString()
  @IsOptional()
  tracking6mDate?: string

  @IsString()
  @Max(1000)
  @IsOptional()
  tracking6mNotes?: string

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  learnerSatisfaction?: number

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  enterpriseSatisfaction?: number

  @IsString()
  @Max(2000)
  @IsOptional()
  learnerFeedback?: string

  @IsString()
  @Max(2000)
  @IsOptional()
  enterpriseFeedback?: string

  @IsBoolean()
  @IsOptional()
  isCurrentJob?: boolean

  @IsEnum(PlacementStatusEnum)
  @IsOptional()
  status?: string
}

export class UpdatePlacementDto extends CreatePlacementDto {
  @IsUUID()
  id: string
}

export class UpdatePlacementStatusDto {
  @IsEnum(PlacementStatusEnum)
  status: string

  @IsString()
  @Max(500)
  @IsOptional()
  note?: string
}

export class ListPlacementQueryDto {
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
  learnerId?: string

  @IsInt()
  @Min(1)
  @IsOptional()
  enterpriseId?: number

  @IsInt()
  @Min(1)
  @IsOptional()
  programId?: number

  @IsEnum(PlacementStatusEnum)
  @IsOptional()
  status?: string
}
