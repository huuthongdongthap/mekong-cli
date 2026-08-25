import { IsDateString, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator'

export class ListPracticeRecordsQueryDto {
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
  enrollmentId?: string

  @IsUUID()
  @IsOptional()
  learnerId?: string

  @IsInt()
  @Min(1)
  @IsOptional()
  enterpriseId?: number

  @IsDateString()
  @IsOptional()
  startDate?: string

  @IsDateString()
  @IsOptional()
  endDate?: string
}
