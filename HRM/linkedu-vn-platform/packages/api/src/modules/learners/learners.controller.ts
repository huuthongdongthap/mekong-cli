import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Query } from '@nestjs/common'
import { LearnersService } from './learners.service'
import { JwtAuthGuard } from '@linkedu/api/modules/auth/guards/jwt-auth.guard.wrapper'
import { Roles } from '@linkedu/api/common/decorators/roles.decorator'
import { TenantGuard } from '@linkedu/api/common/guards/tenant.guard'
import { CreateLearnerDto, UpdateLearnerDto, ListLearnerQueryDto } from './dto/learners.dto'

@Controller('learners')
@UseGuards(JwtAuthGuard, TenantGuard)
export class LearnersController {
  constructor(private readonly service: LearnersService) {}

  @Post()
  @Roles('super_admin', 'school_admin')
  create(@Body() dto: CreateLearnerDto) {
    return this.service.create(dto)
  }

  @Get()
  findAll(@Query() query: ListLearnerQueryDto) {
    return this.service.findAll(query as any)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id)
  }

  @Patch(':id')
  @Roles('super_admin', 'school_admin')
  update(@Param('id') id: string, @Body() dto: UpdateLearnerDto) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @Roles('super_admin')
  remove(@Param('id') id: string) {
    return this.service.softDelete(id)
  }
}
