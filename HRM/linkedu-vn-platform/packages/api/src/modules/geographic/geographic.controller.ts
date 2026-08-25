import { Controller, Get, Param, Query } from '@nestjs/common'
import { GeographicService } from './geographic.service'
import { ProvinceQueryDto, DistrictParamDto } from './dto/geographic.dto'

@Controller('geographic')
export class GeographicController {
  constructor(private readonly service: GeographicService) {}

  @Get('provinces')
  findAllProvinces(@Query() query: ProvinceQueryDto) {
    return this.service.findAllProvinces(query.region)
  }

  @Get('provinces/:code')
  findProvinceByCode(@Param('code') code: string) {
    return this.service.findProvinceByCode(code)
  }

  @Get('provinces/:code/districts')
  findDistrictsByProvince(@Param('code') code: string) {
    return this.service.findDistrictsByProvince(code)
  }

  @Get('provinces/:code/districts/:districtId')
  findDistrictById(@Param() params: DistrictParamDto) {
    return this.service.findDistrictById(params.provinceCode, params.districtId)
  }
}
