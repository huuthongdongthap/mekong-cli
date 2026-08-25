import { Controller, Get, UseGuards, Param } from '@nestjs/common'
import { DashboardService } from './dashboard.service'
import { JwtAuthGuard } from '@linkedu/api/modules/auth/guards/jwt-auth.guard.wrapper'
import { TenantGuard } from '@linkedu/api/common/guards/tenant.guard'

/**
 * @Routes:
 * GET  /dashboard/school/:schoolId        — school admin overview
 * GET  /dashboard/enterprise/:entId       — enterprise admin overview
 * GET  /dashboard/system                  — super_admin systemic dashboard
 */
@Controller('dashboard')
@UseGuards(JwtAuthGuard, TenantGuard)
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get('school/:schoolId')
  schoolOverview(@Param('schoolId') schoolId: string) {
    return this.service.schoolOverview(schoolId)
  }

  @Get('enterprise/:enterpriseId')
  enterpriseOverview(@Param('enterpriseId') enterpriseId: string) {
    return this.service.enterpriseOverview(Number(enterpriseId))
  }

  @Get('system')
  systemOverview() {
    return this.service.systemOverview()
  }
}
