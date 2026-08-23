import { Controller, Get, Post, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { UnitEconomicsService } from './unit-economics.service'

@ApiTags('Unit Economics')
@Controller('unit-economics')
export class UnitEconomicsController {
  constructor(private readonly unitEconomicsService: UnitEconomicsService) {}

  @Get('daily')
  @ApiOperation({ summary: 'Get daily CAC/LTV metrics' })
  @ApiQuery({ name: 'date', type: Date, required: false })
  async getDailyMetrics(@Query('date') date?: string) {
    return this.unitEconomicsService.calculateDailyCACLTV(date ? new Date(date) : new Date())
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard metrics with cohort analysis' })
  async getDashboardMetrics() {
    return this.unitEconomicsService.getDashboardMetrics()
  }

  @Get('cohorts')
  @ApiOperation({ summary: 'Get cohort analysis' })
  @ApiQuery({ name: 'months', type: Number, required: false })
  async getCohorts(@Query('months') months?: number) {
    return this.unitEconomicsService.getCohortAnalysis(months || 12)
  }

  @Post('calculate/daily')
  @ApiOperation({ summary: 'Trigger daily calculation job' })
  async runDailyCalculation() {
    return this.unitEconomicsService.runDailyCalculation()
  }
}