import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Query, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger'
import { ScholarshipService, AllocationStatus } from './scholarship.service'
import { JwtAuthGuard } from '@linkedu/api/modules/auth/guards/jwt-auth.guard.wrapper'
import { Roles } from '@linkedu/api/common/decorators/roles.decorator'
import { TenantGuard } from '@linkedu/api/common/guards/tenant.guard'
import {
  CreateScholarshipFundDto,
  UpdateScholarshipFundDto,
  CreateScholarshipPillarDto,
  UpdateScholarshipPillarDto,
  AllocateScholarshipDto,
  UpdateAllocationStatusDto,
  ListScholarshipFundDto,
  ListScholarshipAllocationDto,
} from './dto'

@ApiTags('Scholarship')
@Controller('scholarship')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ScholarshipController {
  constructor(private readonly scholarshipService: ScholarshipService) {}

  // =============================================================================
  // Fund Endpoints
  // =============================================================================

  @Post('funds')
  @ApiOperation({ summary: 'Create scholarship fund' })
  @ApiResponse({ status: 201, description: 'Fund created' })
  @Roles('super_admin')
  async createFund(@Body() dto: CreateScholarshipFundDto) {
    return this.scholarshipService.createFund(dto as any)
  }

  @Get('funds')
  @ApiOperation({ summary: 'List scholarship funds' })
  async getFunds(@Query() query: ListScholarshipFundDto) {
    return this.scholarshipService.getFunds(query as any)
  }

  @Get('funds/:id')
  @ApiOperation({ summary: 'Get scholarship fund by ID' })
  @ApiParam({ name: 'id', type: String })
  async getFund(@Param('id') id: string) {
    return this.scholarshipService.getFundById(id)
  }

  @Patch('funds/:id')
  @ApiOperation({ summary: 'Update scholarship fund' })
  @ApiParam({ name: 'id', type: String })
  @Roles('super_admin')
  async updateFund(@Param('id') id: string, @Body() dto: UpdateScholarshipFundDto) {
    return this.scholarshipService.updateFund(id, dto as any)
  }

  @Delete('funds/:id')
  @ApiOperation({ summary: 'Soft delete scholarship fund' })
  @ApiParam({ name: 'id', type: String })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('super_admin')
  async deleteFund(@Param('id') id: string) {
    await this.scholarshipService.softDeleteFund(id)
  }

  @Get('funds/:id/summary')
  @ApiOperation({ summary: 'Get fund allocation summary' })
  @ApiParam({ name: 'id', type: String })
  async getFundSummary(@Param('id') id: string) {
    return this.scholarshipService.getFundSummary(id)
  }

  // =============================================================================
  // Pillar Endpoints
  // =============================================================================

  @Post('funds/:fundId/pillars')
  @ApiOperation({ summary: 'Create scholarship pillar' })
  @ApiParam({ name: 'fundId', type: String })
  @Roles('super_admin')
  async createPillar(
    @Param('fundId') fundId: string,
    @Body() dto: CreateScholarshipPillarDto
  ) {
    return this.scholarshipService.createPillar(fundId, dto as any)
  }

  @Get('funds/:fundId/pillars')
  @ApiOperation({ summary: 'List pillars for fund' })
  @ApiParam({ name: 'fundId', type: String })
  async getPillars(@Param('fundId') fundId: string) {
    return this.scholarshipService.getPillars(fundId)
  }

  @Get('pillars/:id')
  @ApiOperation({ summary: 'Get pillar by ID' })
  @ApiParam({ name: 'id', type: String })
  async getPillar(@Param('id') id: string) {
    return this.scholarshipService.getPillarById(id)
  }

  @Patch('pillars/:id')
  @ApiOperation({ summary: 'Update scholarship pillar' })
  @ApiParam({ name: 'id', type: String })
  @Roles('super_admin')
  async updatePillar(
    @Param('id') id: string,
    @Body() dto: UpdateScholarshipPillarDto
  ) {
    return this.scholarshipService.updatePillar(id, dto as any)
  }

  // =============================================================================
  // Allocation Endpoints
  // =============================================================================

  @Post('allocations')
  @ApiOperation({ summary: 'Allocate scholarship' })
  @ApiResponse({ status: 201, description: 'Allocation created' })
  @Roles('super_admin', 'school_admin')
  async allocate(@Body() dto: AllocateScholarshipDto) {
    return this.scholarshipService.allocate(dto as any)
  }

  @Get('allocations')
  @ApiOperation({ summary: 'List scholarship allocations' })
  async getAllocations(@Query() query: ListScholarshipAllocationDto) {
    return this.scholarshipService.getAllocations(query as any)
  }

  @Patch('allocations/:id/status')
  @ApiOperation({ summary: 'Update allocation status' })
  @ApiParam({ name: 'id', type: String })
  @Roles('super_admin', 'school_admin')
  async updateAllocationStatus(
    @Param('id') id: string,
    @Body() dto: UpdateAllocationStatusDto
  ) {
    return this.scholarshipService.updateAllocationStatus(
      id,
      dto.status as AllocationStatus,
      dto as any
    )
  }
}
