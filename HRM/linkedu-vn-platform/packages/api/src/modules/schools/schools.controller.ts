import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Query } from '@nestjs/common'
import { SchoolsService } from './schools.service'
import { JwtAuthGuard } from '@linkedu/api/modules/auth/guards/jwt-auth.guard.wrapper'
import { Roles } from '@linkedu/api/common/decorators/roles.decorator'
import { TenantGuard } from '@linkedu/api/common/guards/tenant.guard'
import { CreateSchoolDto, UpdateSchoolDto, ListSchoolQueryDto } from './dto/schools.dto'

@Controller('schools')
@UseGuards(JwtAuthGuard, TenantGuard)
export class SchoolsController {
  constructor(private readonly service: SchoolsService) {}

  @Post()
  @Roles('super_admin')
  create(@Body() dto: CreateSchoolDto) {
    return this.service.create(dto as any)
  }

  @Get()
  list(@Query() query: ListSchoolQueryDto) {
    return this.service.findAll(query as any)
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.findById(id)
  }

  @Patch(':id')
  @Roles('super_admin')
  update(@Param('id') id: string, @Body() dto: UpdateSchoolDto) {
    return this.service.update(id, dto as any)
  }

  @Delete(':id')
  @Roles('super_admin')
  remove(@Param('id') id: string) {
    return this.service.softDelete(id)
  }
}
