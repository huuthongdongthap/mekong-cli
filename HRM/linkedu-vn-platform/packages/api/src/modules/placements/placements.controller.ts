import { Controller, Get, Post, Body, Param, Patch, UseGuards, Query } from '@nestjs/common'
import { PlacementsService } from './placements.service'
import { JwtAuthGuard } from '@linkedu/api/modules/auth/guards/jwt-auth.guard.wrapper'
import { Roles } from '@linkedu/api/common/decorators/roles.decorator'
import { TenantGuard } from '@linkedu/api/common/guards/tenant.guard'
import {
  CreatePlacementDto,
  ListPlacementQueryDto,
  UpdatePlacementDto,
  UpdatePlacementStatusDto,
} from './dto/placements.dto'

@Controller('placements')
@UseGuards(JwtAuthGuard, TenantGuard)
export class PlacementsController {
  constructor(private readonly service: PlacementsService) {}

  @Post()
  @Roles('super_admin', 'enterprise_admin', 'enterprise_hr')
  create(@Body() dto: CreatePlacementDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: ListPlacementQueryDto) {
    return this.service.findAll(query as any);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles('super_admin', 'enterprise_admin', 'enterprise_hr')
  update(@Param('id') id: string, @Body() dto: UpdatePlacementDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/status')
  @Roles('super_admin', 'enterprise_admin', 'enterprise_hr')
  updateStatus(@Param('id') id: string, @Body() dto: UpdatePlacementStatusDto) {
    return this.service.updateStatus(id, dto.status);
  }
}
