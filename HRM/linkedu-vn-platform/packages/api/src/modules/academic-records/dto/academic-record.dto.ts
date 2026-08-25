import { IsString, IsOptional, IsNumber, IsArray, ValidateNested, IsDateString } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export enum GradeScale {
  FOUR_POINT = '4.0',
  TEN_POINT = '10.0',
  LETTER = 'letter',
}

export class SubjectGradeDto {
  @ApiProperty({ description: 'Subject code' })
  @IsString()
  subjectCode: string

  @ApiProperty({ description: 'Subject name' })
  @IsString()
  subjectName: string

  @ApiProperty({ description: 'Number of credits' })
  @IsNumber()
  credits: number

  @ApiPropertyOptional({ description: 'Midterm score' })
  @IsOptional()
  @IsNumber()
  midtermScore?: number

  @ApiPropertyOptional({ description: 'Final exam score' })
  @IsOptional()
  @IsNumber()
  finalScore?: number

  @ApiPropertyOptional({ description: 'Total/average score' })
  @IsOptional()
  @IsNumber()
  totalScore?: number

  @ApiPropertyOptional({ description: 'Letter grade (A, B+, C, etc.)' })
  @IsOptional()
  @IsString()
  letterGrade?: string

  @ApiProperty({ description: 'Numeric grade (0-10 or 0-4)' })
  @IsNumber()
  numericGrade: number

  @ApiProperty({ description: 'Pass/Fail status' })
  @IsString()
  status: 'passed' | 'failed' | 'in_progress'

  @ApiPropertyOptional({ description: 'Subject type' })
  @IsOptional()
  @IsString()
  subjectType?: string
}

export class AcademicTranscriptDto {
  @ApiProperty({ description: 'Learner full name' })
  @IsString()
  learnerName: string

  @ApiProperty({ description: 'Learner code / Student ID' })
  @IsString()
  learnerCode: string

  @ApiProperty({ description: 'Field of study / Major' })
  @IsString()
  fieldOfStudy: string

  @ApiProperty({ description: 'Cohort / Class' })
  @IsString()
  cohort: string

  @ApiProperty({ description: 'Cumulative GPA' })
  @IsNumber()
  gpa: number

  @ApiProperty({ description: 'Total credits earned' })
  @IsNumber()
  totalCredits: number

  @ApiProperty({ description: 'Academic status' })
  @IsString()
  academicStatus: 'Đang học' | 'Tốt nghiệp' | 'Thôi học' | 'Tạm dừng'

  @ApiPropertyOptional({ description: 'Issue date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  issuedDate?: string

  @ApiProperty({ type: [SubjectGradeDto], description: 'Subject grades' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubjectGradeDto)
  subjects: SubjectGradeDto[]
}

export class SyncAcademicRecordsDto {
  @ApiProperty({ description: 'Learner ID in our system' })
  @IsString()
  learnerId: string

  @ApiProperty({ description: 'School ID' })
  @IsString()
  schoolId: string

  @ApiProperty({ type: AcademicTranscriptDto, description: 'Transcript data from school system' })
  @ValidateNested()
  @Type(() => AcademicTranscriptDto)
  transcript: AcademicTranscriptDto
}

export class AcademicRecordQueryDto {
  @ApiPropertyOptional({ description: 'Filter by learner ID' })
  @IsOptional()
  @IsString()
  learnerId?: string

  @ApiPropertyOptional({ description: 'Filter by school ID' })
  @IsOptional()
  @IsString()
  schoolId?: string

  @ApiPropertyOptional({ description: 'Page number' })
  @IsOptional()
  @IsNumber()
  page?: number = 1

  @ApiPropertyOptional({ description: 'Items per page' })
  @IsOptional()
  @IsNumber()
  limit?: number = 20
}