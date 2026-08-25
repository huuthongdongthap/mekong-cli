import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Query } from '@nestjs/common'
import { EvaluationsService } from './evaluations.service'
import { JwtAuthGuard } from '@linkedu/api/modules/auth/guards/jwt-auth.guard.wrapper'
import { Roles } from '@linkedu/api/common/decorators/roles.decorator'
import { TenantGuard } from '@linkedu/api/common/guards/tenant.guard'
import {
  CreateEvaluationDto,
  UpdateEvaluationDto,
  ListEvaluationQueryDto,
} from './dto/evaluations.dto'

@Controller('evaluations')
@UseGuards(JwtAuthGuard, TenantGuard)
export class EvaluationsController {
  constructor(private readonly service: EvaluationsService) {}

  @Post()
  @Roles('super_admin', 'school_admin', 'enterprise_admin', 'enterprise_hr')
  create(@Body() dto: CreateEvaluationDto) {
    return this.service.create(dto)
  }

  @Get()
  findAll(@Query() query: ListEvaluationQueryDto) {
    return this.service.findAll(query as any)
  }

  @Get('enrollment/:enrollmentId')
  findByEnrollment(@Param('enrollmentId') enrollmentId: string) {
    return this.service.findByEnrollment(enrollmentId)
  }

  @Get('learner/:learnerId')
  findByLearner(@Param('learnerId') learnerId: string) {
    return this.service.findByLearner(learnerId)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id)
  }

  @Patch(':id')
  @Roles('super_admin', 'school_admin', 'enterprise_admin', 'enterprise_hr')
  update(@Param('id') id: string, @Body() dto: UpdateEvaluationDto) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @Roles('super_admin', 'school_admin')
  remove(@Param('id') id: string) {
    return this.service.remove(id)
  }
}
