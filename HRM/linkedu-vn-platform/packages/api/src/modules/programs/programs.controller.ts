import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Query } from '@nestjs/common'
import { ProgramsService } from './programs.service'
import { JwtAuthGuard } from '@linkedu/api/modules/auth/guards/jwt-auth.guard.wrapper'
import { Roles } from '@linkedu/api/common/decorators/roles.decorator'
import { TenantGuard } from '@linkedu/api/common/guards/tenant.guard'

@Controller('programs')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ProgramsController {
  constructor(private readonly service: ProgramsService) {}

  @Post()
  @Roles('super_admin', 'school_admin')
  create(@Body() body: any) {
    return this.service.create(body)
  }

  @Get()
  findAll(@Query() query: any) {
    return this.service.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id))
  }

  @Patch(':id')
  @Roles('super_admin', 'school_admin')
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(Number(id), body)
  }

  @Delete(':id')
  @Roles('super_admin')
  remove(@Param('id') id: string) {
    return this.service.softDelete(Number(id))
  }
}