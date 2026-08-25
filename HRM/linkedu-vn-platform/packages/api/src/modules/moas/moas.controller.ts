import { Controller, Get, Post, Body, Param, Patch, UseGuards, Query, Delete } from '@nestjs/common'
import { MoasService } from './moas.service'
import { JwtAuthGuard } from '@linkedu/api/modules/auth/guards/jwt-auth.guard.wrapper'
import { Roles } from '@linkedu/api/common/decorators/roles.decorator'
import { TenantGuard } from '@linkedu/api/common/guards/tenant.guard'
import { CreateMoaDto, SignMoaDto, ListMoaQueryDto } from './dto/moas.dto'

@Controller('moas')
@UseGuards(JwtAuthGuard, TenantGuard)
export class MoasController {
  constructor(private readonly service: MoasService) {}

  @Post()
  @Roles('super_admin', 'school_admin', 'enterprise_admin')
  create(@Body() dto: CreateMoaDto) {
    return this.service.create(dto)
  }

  @Get()
  findAll(@Query() query: ListMoaQueryDto) {
    return this.service.findAll(query as any)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id))
  }

  @Patch(':id/sign')
  @Roles('super_admin', 'school_admin', 'enterprise_admin')
  sign(@Param('id') id: string, @Body() dto: SignMoaDto) {
    return this.service.sign(Number(id), dto)
  }

  @Delete(':id')
  @Roles('super_admin', 'school_admin', 'enterprise_admin')
  softDelete(@Param('id') id: string) {
    return this.service.softDelete(Number(id))
  }
}