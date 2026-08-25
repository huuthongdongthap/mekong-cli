import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  IsArray,
  IsNumber,
  Max,
  Min,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

const EvaluationTypeEnum = ['mid_term', 'final', 'supervisor', 'peer', 'self'] as const

export class RubricItemDto {
  @IsString()
  criterion!: string

  @IsNumber()
  @Min(0)
  score!: number

  @IsNumber()
  @Min(0)
  maxScore!: number

  @IsString()
  @IsOptional()
  comment?: string
}

export class CreateEvaluationDto {
  @IsUUID()
  enrollmentId!: string

  @IsUUID()
  learnerId!: string

  @IsUUID()
  evaluatorId!: string

  @IsEnum(EvaluationTypeEnum)
  evaluationType!: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RubricItemDto)
  @IsOptional()
  rubric?: RubricItemDto[]

  @IsNumber()
  @Min(0)
  @IsOptional()
  totalScore?: number

  @IsNumber()
  @Min(1)
  @IsOptional()
  maxScore?: number

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  percentage?: number

  @IsString()
  @Max(5000)
  @IsOptional()
  feedback?: string

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  strengths?: string[]

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  improvements?: string[]

  @IsString()
  @Max(500)
  @IsOptional()
  evidenceDocUrl?: string

  @IsDateString()
  @IsOptional()
  evaluatedAt?: string
}

export class UpdateEvaluationDto {
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalScore?: number

  @IsNumber()
  @Min(1)
  @IsOptional()
  maxScore?: number

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  percentage?: number

  @IsString()
  @Max(5000)
  @IsOptional()
  feedback?: string

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  strengths?: string[]

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  improvements?: string[]

  @IsString()
  @Max(500)
  @IsOptional()
  evidenceDocUrl?: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RubricItemDto)
  @IsOptional()
  rubric?: RubricItemDto[]
}

export class ListEvaluationQueryDto {
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

  @IsUUID()
  @IsOptional()
  evaluatorId?: string

  @IsEnum(EvaluationTypeEnum)
  @IsOptional()
  evaluationType?: string

  @IsDateString()
  @IsOptional()
  fromDate?: string

  @IsDateString()
  @IsOptional()
  toDate?: string
}
