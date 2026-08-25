import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator'
import { Type } from 'class-transformer'

const AuditActionEnum = [
  'CREATE',
  'UPDATE',
  'DELETE',
  'SIGN',
  'APPROVE',
  'REJECT',
  'LOGIN',
  'LOGOUT',
  'EXPORT',
] as const

export class ListAuditLogQueryDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1

  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20

  @IsUUID()
  @IsOptional()
  actorId?: string

  @IsEnum(AuditActionEnum)
  @IsOptional()
  action?: string

  @IsString()
  @IsOptional()
  entityType?: string

  @IsString()
  @IsOptional()
  entityId?: string

  @IsDateString()
  @IsOptional()
  fromDate?: string

  @IsDateString()
  @IsOptional()
  toDate?: string
}

export class AuditLogByIdDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  id!: number
}
