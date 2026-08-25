import { PartialType } from '@nestjs/mapped-types'
import { IsOptional, IsString, IsBoolean, IsArray, IsDateString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class CreateWorkExperienceDto {
  @ApiPropertyOptional({ description: 'Company name' })
  @IsOptional()
  @IsString()
  companyName?: string

  @ApiPropertyOptional({ description: 'Position title' })
  @IsOptional()
  @IsString()
  position?: string

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

  @ApiPropertyOptional({ description: 'Currently working here' })
  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean

  @ApiPropertyOptional({ description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ description: 'Skills used' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[]
}

export class UpdateWorkExperienceDto extends PartialType(CreateWorkExperienceDto) {}