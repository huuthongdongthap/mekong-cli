import { Controller, Post, Get, Param, Body, UseGuards, Req, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { AcademicRecordsService } from './academic-records.service'
import { SyncAcademicRecordsDto, AcademicRecordQueryDto } from './dto/academic-record.dto'
import { JwtAuthGuard } from '@linkedu/api/modules/auth/guards/jwt-auth.guard.wrapper'
import { RolesGuard } from '@linkedu/api/modules/auth/guards/roles.guard'
import { Roles } from '../../common/decorators/roles.decorator'
import { UserRole } from '@prisma/client'

@ApiTags('Academic Records')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('academic-records')
export class AcademicRecordsController {
  constructor(private readonly academicRecordsService: AcademicRecordsService) {}

  @Post('sync')
  @Roles(UserRole.school_admin, UserRole.school_staff, UserRole.super_admin)
  @ApiOperation({ summary: 'Sync academic records from school API (school admin only)' })
  async syncAcademicRecords(@Body() dto: SyncAcademicRecordsDto, @Req() _req: any) {
    return this.academicRecordsService.syncAcademicRecords(dto)
  }

  @Get('learner/:learnerId/transcript')
  @Roles(UserRole.learner, UserRole.school_admin, UserRole.school_staff, UserRole.enterprise_admin, UserRole.enterprise_hr, UserRole.super_admin)
  @ApiOperation({ summary: 'Get transcript PDF download URL for a learner' })
  async getTranscript(@Param('learnerId') learnerId: string) {
    return this.academicRecordsService.getTranscript(learnerId)
  }

  @Get('learner/:learnerId')
  @Roles(UserRole.learner, UserRole.school_admin, UserRole.school_staff, UserRole.enterprise_admin, UserRole.enterprise_hr, UserRole.super_admin)
  @ApiOperation({ summary: 'Get academic records metadata for a learner' })
  async getAcademicRecords(@Param('learnerId') learnerId: string) {
    return this.academicRecordsService.getAcademicRecordsMetadata(learnerId)
  }

  @Get('learner/:learnerId/data')
  @Roles(UserRole.learner, UserRole.school_admin, UserRole.school_staff, UserRole.enterprise_admin, UserRole.enterprise_hr, UserRole.super_admin)
  @ApiOperation({ summary: 'Get structured transcript JSON data for a learner' })
  async getTranscriptData(@Param('learnerId') learnerId: string) {
    return this.academicRecordsService.getTranscriptData(learnerId)
  }

  @Post('learner/:learnerId/regenerate')
  @Roles(UserRole.school_admin, UserRole.school_staff, UserRole.super_admin)
  @ApiOperation({ summary: 'Regenerate transcript PDF from current data' })
  async regenerateTranscript(@Param('learnerId') learnerId: string) {
    return this.academicRecordsService.generateFreshTranscript(learnerId)
  }

  @Get()
  @Roles(UserRole.super_admin)
  @ApiOperation({ summary: 'List academic records (super admin only)' })
  @ApiQuery({ name: 'learnerId', required: false })
  @ApiQuery({ name: 'schoolId', required: false })
  async listAcademicRecords(@Query() _query: AcademicRecordQueryDto) {
    // This is a simplified list - in practice you'd query documents
    return { message: 'Use learner-specific endpoints for academic records' }
  }
}