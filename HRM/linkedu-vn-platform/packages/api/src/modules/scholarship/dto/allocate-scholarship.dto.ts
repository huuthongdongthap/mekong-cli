import { IsString, IsInt, IsOptional, IsUUID, Max, Min, IsEnum, IsDateString } from 'class-validator'

export enum AllocationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DISBURSED = 'disbursed',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

export class AllocateScholarshipDto {
  @IsUUID()
  fundId!: string

  @IsUUID()
  pillarId!: string

  @IsUUID()
  learnerId!: string

  @IsInt()
  @Min(0)
  amountVnd!: number

  @IsString()
  @Max(500)
  @IsOptional()
  justification?: string

  @IsString()
  @Max(100)
  @IsOptional()
  academicYear?: string

  @IsString()
  @Max(100)
  @IsOptional()
  semester?: string

  @IsDateString()
  @IsOptional()
  disbursedAt?: string

  @IsString()
  @Max(200)
  @IsOptional()
  disbursedBy?: string
}

export class UpdateAllocationStatusDto {
  @IsEnum(AllocationStatus)
  status!: AllocationStatus

  @IsString()
  @Max(500)
  @IsOptional()
  rejectionReason?: string

  @IsDateString()
  @IsOptional()
  disbursedAt?: string

  @IsString()
  @Max(200)
  @IsOptional()
  disbursedBy?: string
}
