import { IsString, IsInt, IsOptional, IsEnum, Max, Min, IsBoolean } from 'class-validator'

export enum ScholarshipPillarType {
  TUITION_SUPPORT = 'tuition_support',
  LIVING_STIPEND = 'living_stipend',
  BOOK_GRANT = 'book_grant',
  TECHNOLOGY_ACCESS = 'technology_access',
  EMERGENCY_FUND = 'emergency_fund',
}

export class CreateScholarshipPillarDto {
  @IsString()
  @Max(100)
  name!: string

  @IsString()
  @Max(500)
  @IsOptional()
  description?: string

  @IsEnum(ScholarshipPillarType)
  pillarType!: ScholarshipPillarType

  @IsInt()
  @Min(0)
  allocationPercent!: number

  @IsInt()
  @Min(0)
  @IsOptional()
  maxAmountVnd?: number

  @IsInt()
  @Min(0)
  @IsOptional()
  minAmountVnd?: number

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true

  @IsString()
  @Max(200)
  @IsOptional()
  eligibilityCriteria?: string
}

export class UpdateScholarshipPillarDto {
  @IsString()
  @Max(100)
  @IsOptional()
  name?: string

  @IsString()
  @Max(500)
  @IsOptional()
  description?: string

  @IsInt()
  @Min(0)
  @IsOptional()
  allocationPercent?: number

  @IsInt()
  @Min(0)
  @IsOptional()
  maxAmountVnd?: number

  @IsInt()
  @Min(0)
  @IsOptional()
  minAmountVnd?: number

  @IsBoolean()
  @IsOptional()
  isActive?: boolean

  @IsString()
  @Max(200)
  @IsOptional()
  eligibilityCriteria?: string
}
