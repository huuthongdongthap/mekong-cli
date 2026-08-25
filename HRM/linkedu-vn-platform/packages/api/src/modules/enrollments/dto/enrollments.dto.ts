import { IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator'

// Prisma EnrollmentStatus enum: pending, approved, rejected, completed, withdrawn
const EnrollmentStatusEnum = ['pending', 'approved', 'rejected', 'completed', 'withdrawn'] as const
const EnrollmentTypeEnum = ['self_apply', 'staff_created', 'enterprise_nominated'] as const

export class EnrollLearnerDto {
  @IsUUID()
  learnerId: string

  @IsInt()
  @Min(1)
  programId: number

  @IsEnum(EnrollmentTypeEnum)
  @IsOptional()
  enrollmentType?: string

  @IsString()
  @IsOptional()
  enrolledById?: string

  @IsInt()
  @Min(0)
  @Max(10)
  @IsOptional()
  examScore?: number

  @IsOptional()
  examDate?: string

  @IsString()
  @IsOptional()
  examNotes?: Record<string, unknown>

  @IsDateString()
  @IsOptional()
  practiceStart?: string

  @IsDateString()
  @IsOptional()
  practiceEnd?: string

  @IsString()
  @Max(1000)
  @IsOptional()
  notes?: string
}

export class UpdateEnrollmentStatusDto {
  @IsEnum(EnrollmentStatusEnum)
  status: string

  @IsString()
  @Max(500)
  @IsOptional()
  reason?: string
}

export class ListEnrollmentQueryDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1

  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  limit?: number = 20

  @IsInt()
  @Min(1)
  @IsOptional()
  programId?: number

  @IsUUID()
  @IsOptional()
  learnerId?: string

  @IsUUID()
  @IsOptional()
  schoolId?: string

  @IsEnum(EnrollmentStatusEnum)
  @IsOptional()
  status?: string
}