import { IsOptional, IsString, IsNumber, IsDateString, IsEnum } from 'class-validator'
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger'
import { CertificateStatus } from '@prisma/client'

export class CreateInternshipCertificateDto {
  @ApiProperty({ description: 'Learner UUID' })
  @IsString()
  learnerId: string

  @ApiProperty({ description: 'Enrollment UUID' })
  @IsString()
  enrollmentId: string

  @ApiProperty({ description: 'Enterprise ID (integer)' })
  @IsNumber()
  enterpriseId: number

  @ApiProperty({ description: 'Program ID (integer)' })
  @IsNumber()
  programId: number

  @ApiProperty({ description: 'Certificate number (e.g., CERT/2026/00001)' })
  @IsString()
  certificateNumber: string

  @ApiProperty({ description: 'Issue date (YYYY-MM-DD)' })
  @IsDateString()
  issueDate: string

  @ApiProperty({ description: 'Start date (YYYY-MM-DD)' })
  @IsDateString()
  startDate: string

  @ApiProperty({ description: 'End date (YYYY-MM-DD)' })
  @IsDateString()
  endDate: string

  @ApiProperty({ description: 'Total internship hours' })
  @IsNumber()
  totalHours: number

  @ApiProperty({ description: 'Position/Title' })
  @IsString()
  position: string

  @ApiPropertyOptional({ description: 'Department' })
  @IsOptional()
  @IsString()
  department?: string

  @ApiProperty({ description: 'Supervisor name' })
  @IsString()
  supervisorName: string

  @ApiPropertyOptional({ description: 'Supervisor title' })
  @IsOptional()
  @IsString()
  supervisorTitle?: string

  @ApiPropertyOptional({ description: 'Evaluation score (1-100)' })
  @IsOptional()
  @IsNumber()
  evaluationScore?: number

  @ApiPropertyOptional({ description: 'Evaluation comment' })
  @IsOptional()
  @IsString()
  evaluationComment?: string

  @ApiPropertyOptional({ description: 'Skills acquired array' })
  @IsOptional()
  @IsString({ each: true })
  skillsAcquired?: string[]

  @ApiPropertyOptional({ description: 'Achievements array' })
  @IsOptional()
  @IsString({ each: true })
  achievements?: string[]

  @ApiProperty({ description: 'Issued by user UUID' })
  @IsString()
  issuedById: string
}

export class IssueCertificateDto {
  @ApiPropertyOptional({ description: 'Certificate number (auto-generated if not provided)' })
  @IsOptional()
  @IsString()
  certificateNumber?: string

  @ApiPropertyOptional({ description: 'Issue date (defaults to today)' })
  @IsOptional()
  @IsDateString()
  issueDate?: string
}

export class UpdateInternshipCertificateDto {
  @ApiPropertyOptional({ enum: CertificateStatus })
  @IsOptional()
  @IsEnum(CertificateStatus)
  status?: CertificateStatus

  @ApiPropertyOptional({ description: 'Certificate URL (R2)' })
  @IsOptional()
  @IsString()
  certificateUrl?: string

  @ApiPropertyOptional({ description: 'QR code URL (R2)' })
  @IsOptional()
  @IsString()
  qrCodeUrl?: string
}

export class VerifyCertificateDto {
  @ApiProperty({ description: 'Certificate number to verify' })
  @IsString()
  certificateNumber: string
}