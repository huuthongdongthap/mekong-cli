import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'

const VALID_REGIONS = ['north', 'central', 'south'] as const

export class ProvinceQueryDto {
  @IsString()
  @IsOptional()
  @IsIn(VALID_REGIONS, { message: 'Vùng miền phải là: north, central, hoặc south' })
  region?: string
}

export class DistrictParamDto {
  @IsString()
  @Max(2)
  provinceCode!: string

  @Type(() => Number)
  @IsInt()
  @Min(1)
  districtId!: number
}
