import { IsString, IsInt, IsOptional, IsDateString, Max, Min, IsBoolean } from 'class-validator'

export class CreateScholarshipFundDto {
  @IsString()
  @Max(100)
  name!: string

  @IsString()
  @Max(500)
  @IsOptional()
  description?: string

  @IsInt()
  @Min(0)
  targetAmountVnd!: number

  @IsString()
  @Max(50)
  currency?: string = 'VND'

  @IsDateString()
  @IsOptional()
  startDate?: string

  @IsDateString()
  @IsOptional()
  endDate?: string

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true

  @IsString()
  @Max(200)
  @IsOptional()
  complianceRef?: string
}

export class UpdateScholarshipFundDto {
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
  targetAmountVnd?: number

  @IsDateString()
  @IsOptional()
  startDate?: string

  @IsDateString()
  @IsOptional()
  endDate?: string

  @IsBoolean()
  @IsOptional()
  isActive?: boolean

  @IsString()
  @Max(200)
  @IsOptional()
  complianceRef?: string
}
