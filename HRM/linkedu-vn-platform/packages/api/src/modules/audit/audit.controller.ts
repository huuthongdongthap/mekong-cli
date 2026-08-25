import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { AuditService } from './audit.service'
import { JwtAuthGuard } from '@linkedu/api/modules/auth/guards/jwt-auth.guard.wrapper'
import { Roles } from '@linkedu/api/common/decorators/roles.decorator'
import { TenantGuard } from '@linkedu/api/common/guards/tenant.guard'
import { ListAuditLogQueryDto } from './dto/audit.dto'

@Controller('audit-logs')
@UseGuards(JwtAuthGuard, TenantGuard)
export class AuditController {
  constructor(private readonly service: AuditService) {}

  @Get()
  @Roles('super_admin', 'school_admin')
  findAll(@Query() query: ListAuditLogQueryDto) {
    return this.service.findAll(query)
  }

  @Get('entity/:entityType/:entityId')
  @Roles('super_admin', 'school_admin')
  findByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.service.findByEntity(entityType, entityId)
  }

  @Get(':id')
  @Roles('super_admin', 'school_admin')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id))
  }
}
