import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common'
import { EnrollmentsService } from './enrollments.service'
import { JwtAuthGuard } from '@linkedu/api/modules/auth/guards/jwt-auth.guard.wrapper'
import { Roles } from '@linkedu/api/common/decorators/roles.decorator'
import { TenantGuard } from '@linkedu/api/common/guards/tenant.guard'
import {
  EnrollLearnerDto,
  ListEnrollmentQueryDto,
  UpdateEnrollmentStatusDto,
} from './dto/enrollments.dto'
import { EnrollmentStatus } from '@prisma/client'

@Controller('enrollments')
@UseGuards(JwtAuthGuard, TenantGuard)
export class EnrollmentsController {
  constructor(private readonly service: EnrollmentsService) {}

  @Post()
  @Roles('super_admin', 'school_admin')
  enroll(@Body() dto: EnrollLearnerDto) {
    return this.service.enroll(dto)
  }

  @Get()
  findAll(@Query() query: ListEnrollmentQueryDto) {
    return this.service.findAll(query as any)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id)
  }

  @Patch(':id/status')
  @Roles('super_admin', 'school_admin')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateEnrollmentStatusDto,
  ) {
    return this.service.updateStatus(id, dto.status as EnrollmentStatus)
  }
}
