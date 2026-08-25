import { PartialType } from '@nestjs/mapped-types'
import { IsOptional, IsString, IsBoolean, IsArray, IsDateString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class CreateEducationDto {
  @ApiPropertyOptional({ description: 'Institution name' })
  @IsOptional()
  @IsString()
  institution?: string

  @ApiPropertyOptional({ description: 'Degree' })
  @IsOptional()
  @IsString()
  degree?: string

  @ApiPropertyOptional({ description: 'Field of study' })
  @IsOptional()
  @IsString()
  fieldOfStudy?: string

  @ApiPropertyOptional({ description: 'Location' })
  @IsOptional()
  @IsString()
  location?: string

  @ApiPropertyOptional({ description: 'Start date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  startDate?: string

  @ApiPropertyOptional({ description: 'End date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  endDate?: string

  @ApiPropertyOptional({ description: 'Currently studying' })
  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean

  @ApiPropertyOptional({ description: 'GPA' })
  @IsOptional()
  @IsString()
  gpa?: string

  @ApiPropertyOptional({ description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ description: 'Achievements' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  achievements?: string[]
}

export class UpdateEducationDto extends PartialType(CreateEducationDto) {}