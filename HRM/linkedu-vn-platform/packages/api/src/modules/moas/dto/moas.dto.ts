import { IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min, MinLength } from 'class-validator'

export class CreateMoaDto {
  @IsString()
  @MinLength(5, { message: 'Tiêu đề tối thiểu 5 ký tự' })
  @Max(255)
  title: string

  @IsString()
  @Max(2000)
  @IsOptional()
  scope?: string

  @IsString()
  @Max(5000)
  @IsOptional()
  content?: string

  @IsUUID()
  schoolId: string

  @IsInt()
  @Min(1)
  enterpriseId: number

  @IsString()
  @IsOptional()
  signedDocUrl?: string

  @IsDateString()
  @IsOptional()
  validFrom?: string

  @IsDateString()
  @IsOptional()
  validTo?: string
}

export class SignMoaDto {
  @IsString()
  signedDocUrl: string

  @IsString()
  @Max(1000)
  @IsOptional()
  note?: string
}

export class ListMoaQueryDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1

  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  limit?: number = 20

  @IsEnum(['draft', 'pending', 'signed', 'approved', 'active', 'expired', 'cancelled'])
  @IsOptional()
  status?: string

  @IsUUID()
  @IsOptional()
  schoolId?: string

  @IsInt()
  @Min(1)
  @IsOptional()
  enterpriseId?: number
}
