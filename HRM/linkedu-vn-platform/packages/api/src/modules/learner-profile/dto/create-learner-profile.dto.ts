import { IsOptional, IsString, IsUrl, IsEnum, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { ProfileVisibility } from '@prisma/client'
import { CreateWorkExperienceDto } from './work-experience.dto'
import { CreateEducationDto } from './education.dto'

export class CreateLearnerProfileDto {
  @ApiPropertyOptional({ description: 'Bio/About section' })
  @IsOptional()
  @IsString()
  bio?: string

  @ApiPropertyOptional({ description: 'Skills array' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[]

  @ApiPropertyOptional({ description: 'Languages: [{language: "Vietnamese", level: "Native"}]' })
  @IsOptional()
  languages?: any[]

  @ApiPropertyOptional({ description: 'Career objective' })
  @IsOptional()
  @IsString()
  careerObjective?: string

  @ApiPropertyOptional({ description: 'Portfolio URL' })
  @IsOptional()
  @IsUrl()
  portfolioUrl?: string

  @ApiPropertyOptional({ description: 'LinkedIn URL' })
  @IsOptional()
  @IsUrl()
  linkedinUrl?: string

  @ApiPropertyOptional({ description: 'GitHub URL' })
  @IsOptional()
  @IsUrl()
  githubUrl?: string

  @ApiPropertyOptional({ description: 'Website URL' })
  @IsOptional()
  @IsUrl()
  websiteUrl?: string

  @ApiPropertyOptional({ enum: ProfileVisibility, default: ProfileVisibility.private })
  @IsOptional()
  @IsEnum(ProfileVisibility)
  visibility?: ProfileVisibility

  @ApiPropertyOptional({ description: 'CV template name' })
  @IsOptional()
  @IsString()
  cvTemplate?: string

  @ApiPropertyOptional({ type: [CreateWorkExperienceDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateWorkExperienceDto)
  workExperiences?: CreateWorkExperienceDto[]

  @ApiPropertyOptional({ type: [CreateEducationDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateEducationDto)
  educations?: CreateEducationDto[]
}

export class UpdateLearnerProfileDto extends CreateLearnerProfileDto {}