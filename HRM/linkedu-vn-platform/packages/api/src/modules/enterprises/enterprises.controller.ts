import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Query } from '@nestjs/common'
import { EnterprisesService } from './enterprises.service'
import { JwtAuthGuard } from '@linkedu/api/modules/auth/guards/jwt-auth.guard.wrapper'
import { Roles } from '@linkedu/api/common/decorators/roles.decorator'
import { TenantGuard } from '@linkedu/api/common/guards/tenant.guard'
import { CreateEnterpriseDto, UpdateEnterpriseDto, ListEnterpriseQueryDto } from './dto/enterprises.dto'

@Controller('enterprises')
@UseGuards(JwtAuthGuard, TenantGuard)
export class EnterprisesController {
  constructor(private readonly service: EnterprisesService) {}

  @Post()
  @Roles('super_admin')
  create(@Body() dto: CreateEnterpriseDto) {
    return this.service.create(dto)
  }

  @Get()
  findAll(@Query() query: ListEnterpriseQueryDto) {
    return this.service.findAll(query as any)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id)
  }

  @Patch(':id')
  @Roles('super_admin')
  update(@Param('id') id: string, @Body() dto: UpdateEnterpriseDto) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @Roles('super_admin')
  remove(@Param('id') id: string) {
    return this.service.softDelete(id)
  }
}
