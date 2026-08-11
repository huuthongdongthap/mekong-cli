import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { UnitEconomicsService } from '../modules/unit-economics/unit-economics.service'
import { PricingService } from '../modules/pricing/pricing.service'

@Injectable()
export class UnitEconomicsJob {
  private readonly logger = new Logger(UnitEconomicsJob.name)

  constructor(
    private readonly unitEconomicsService: UnitEconomicsService,
    private readonly pricingService: PricingService,
  ) {}

  // Run daily at 2 AM
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async runDailyCACLTVCalculation() {
    this.logger.log('Starting daily CAC/LTV calculation...')
    try {
      const metrics = await this.unitEconomicsService.runDailyCalculation()
      this.logger.log(
        `Daily calculation complete. School CAC: ${metrics.schools.cac}, Enterprise CAC: ${metrics.enterprises.cac}`,
      )
    } catch (error) {
      this.logger.error('Daily CAC/LTV calculation failed', error)
    }
  }

  // Run hourly to check pending billing schedules
  @Cron(CronExpression.EVERY_HOUR)
  async processPendingBilling() {
    this.logger.log('Processing pending billing schedules...')
    try {
      const pending = await this.pricingService.getPendingBillingSchedules(new Date())
      this.logger.log(`Found ${pending.length} pending billing schedules`)

      for (const schedule of pending) {
        // In production, this would generate invoice and process payment
        // For now, just log
        this.logger.log(
          `Pending: Subscription ${schedule.subscriptionId}, Amount: ${schedule.amountVnd} VND, Scheduled: ${schedule.scheduledAt}`,
        )
      }
    } catch (error) {
      this.logger.error('Pending billing processing failed', error)
    }
  }

  // Run daily at 3 AM for network metrics
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async runDailyNetworkMetrics() {
    this.logger.log('Running daily network metrics calculation...')
    // This would be implemented in Phase 3
  }

  // Run weekly on Monday at 4 AM for compliance checks
  @Cron('0 4 * * 1')
  async runWeeklyComplianceCheck() {
    this.logger.log('Running weekly compliance check...')
    // This would be implemented in Phase 5
  }
}