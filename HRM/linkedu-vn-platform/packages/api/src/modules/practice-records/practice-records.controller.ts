import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common'
import { PracticeRecordsService } from './practice-records.service'
import { JwtAuthGuard } from '@linkedu/api/modules/auth/guards/jwt-auth.guard.wrapper'
import { Roles } from '@linkedu/api/common/decorators/roles.decorator'
import { TenantGuard } from '@linkedu/api/common/guards/tenant.guard'
import {
  CreatePracticeRecordDto,
  UpdatePracticeRecordDto,
  ListPracticeRecordsQueryDto,
} from './dto'

@Controller('practice-records')
@UseGuards(JwtAuthGuard, TenantGuard)
export class PracticeRecordsController {
  constructor(private readonly service: PracticeRecordsService) {}

  @Post()
  @Roles('super_admin', 'school_admin', 'enterprise_admin', 'enterprise_hr')
  create(@Body() dto: CreatePracticeRecordDto) {
    return this.service.create(dto)
  }

  @Get()
  findAll(@Query() query: ListPracticeRecordsQueryDto) {
    return this.service.findAll(query)
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

  @Get(':id/hours-summary')
  getHoursSummary(@Param('id') enrollmentId: string) {
    return this.service.getHoursSummary(enrollmentId)
  }

  @Patch(':id')
  @Roles('super_admin', 'school_admin', 'enterprise_admin', 'enterprise_hr')
  update(@Param('id') id: string, @Body() dto: UpdatePracticeRecordDto) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @Roles('super_admin', 'school_admin')
  remove(@Param('id') id: string) {
    return this.service.remove(id)
  }
}
