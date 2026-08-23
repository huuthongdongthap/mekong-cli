import { Injectable } from '@nestjs/common'
import { PrismaClient, Segment } from '@prisma/client'
import { PrismaService } from '@linkedu/api/common/prisma/prisma.service'

export interface CACLTVData {
  cac: number
  ltv: number
  paybackMonths: number
  nrr: number
  grossMargin: number
  ltvCacRatio: number
}

export interface CohortData {
  cohortMonth: string
  segment: Segment
  totalCustomers: number
  retainedCustomers: number
  revenue: number
  churnedCustomers: number
  expansionRevenue: number
}

@Injectable()
export class UnitEconomicsService {
  private prisma: PrismaClient

  constructor(private readonly prismaService: PrismaService) {
    this.prisma = this.prismaService
  }

  // =============================================================================
  // Daily CAC/LTV Calculation (Research Targets: School 4.2mo, Enterprise 9.5mo base)
  // =============================================================================

  async calculateDailyCACLTV(date: Date = new Date()): Promise<{
    schools: CACLTVData
    enterprises: CACLTVData
    date: Date
  }> {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    // Get marketing spend (simplified - would come from actual spend tracking)
    const marketingSpend = await this.getMarketingSpend(startOfDay, endOfDay)

    // Get new customers
    const newSchools = await this.prisma.school.count({
      where: { createdAt: { gte: startOfDay, lte: endOfDay } },
    })
    const newEnterprises = await this.prisma.enterprise.count({
      where: { createdAt: { gte: startOfDay, lte: endOfDay } },
    })

    // Calculate CAC
    const schoolCAC = newSchools > 0 ? marketingSpend.schools / newSchools : 0
    const enterpriseCAC = newEnterprises > 0 ? marketingSpend.enterprises / newEnterprises : 0

    // Calculate LTV (using historical data)
    const schoolLTV = await this.calculateSegmentLTV('SCHOOL')
    const enterpriseLTV = await this.calculateSegmentLTV('ENTERPRISE')

    // Calculate payback months (Research: School 4.2mo, Enterprise 9.5mo base)
    const schoolMonthlyMargin = await this.getAverageMonthlyMargin('SCHOOL')
    const enterpriseMonthlyMargin = await this.getAverageMonthlyMargin('ENTERPRISE')

    const schoolPayback = schoolMonthlyMargin > 0 ? schoolCAC / schoolMonthlyMargin : 999
    const enterprisePayback = enterpriseMonthlyMargin > 0 ? enterpriseCAC / enterpriseMonthlyMargin : 999

    // Calculate NRR
    const schoolNRR = await this.calculateNRR('SCHOOL', startOfDay, endOfDay)
    const enterpriseNRR = await this.calculateNRR('ENTERPRISE', startOfDay, endOfDay)

    // Calculate Gross Margin
    const schoolGrossMargin = await this.calculateGrossMargin('SCHOOL')
    const enterpriseGrossMargin = await this.calculateGrossMargin('ENTERPRISE')

    return {
      schools: {
        cac: schoolCAC,
        ltv: schoolLTV,
        paybackMonths: schoolPayback,
        nrr: schoolNRR,
        grossMargin: schoolGrossMargin,
        ltvCacRatio: schoolCAC > 0 ? schoolLTV / schoolCAC : 0,
      },
      enterprises: {
        cac: enterpriseCAC,
        ltv: enterpriseLTV,
        paybackMonths: enterprisePayback,
        nrr: enterpriseNRR,
        grossMargin: enterpriseGrossMargin,
        ltvCacRatio: enterpriseCAC > 0 ? enterpriseLTV / enterpriseCAC : 0,
      },
      date,
    }
  }

  private async getMarketingSpend(_start: Date, _end: Date): Promise<{ schools: number; enterprises: number }> {
    // Simplified - in production this would come from actual marketing spend tracking
    // Using estimated values for now
    return { schools: 2_500_000, enterprises: 3_000_000 } // VND per day
  }

  private async calculateSegmentLTV(segment: Segment): Promise<number> {
    const avgMonthlyRevenue = await this.getAverageMonthlyRevenue(segment)
    const avgCustomerLifespanMonths = await this.getAverageCustomerLifespan(segment)
    const grossMargin = await this.calculateGrossMargin(segment)
    return Math.round(avgMonthlyRevenue * avgCustomerLifespanMonths * (grossMargin / 100))
  }

  private async getAverageMonthlyRevenue(segment: Segment): Promise<number> {
    const invoices = await this.prisma.invoice.findMany({
      where: {
        status: 'paid',
        [segment === 'SCHOOL' ? 'schoolId' : 'enterpriseId']: { not: null },
        createdAt: { gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }, // Last 90 days
      },
      select: { totalVnd: true, schoolId: true, enterpriseId: true },
    })

    const revenueByCustomer = new Map<string, number>()
    for (const inv of invoices) {
      const key = segment === 'SCHOOL' ? inv.schoolId! : String(inv.enterpriseId!)
      revenueByCustomer.set(key, (revenueByCustomer.get(key) || 0) + inv.totalVnd)
    }

    const values = Array.from(revenueByCustomer.values())
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length / 3 : 0 // Monthly average
  }

  private async getAverageCustomerLifespan(segment: Segment): Promise<number> {
    // Simplified - using churn rate to estimate lifespan
    const churnRate = await this.getChurnRate(segment)
    return churnRate > 0 ? 1 / churnRate : 24 // Default 24 months if no churn data
  }

  private async getChurnRate(segment: Segment): Promise<number> {
    const threeMonthsAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)

    const customers3m = await (segment === 'SCHOOL'
      ? this.prisma.school.count({ where: { createdAt: { lte: threeMonthsAgo } } })
      : this.prisma.enterprise.count({ where: { createdAt: { lte: threeMonthsAgo } } }))

    const customers6m = await (segment === 'SCHOOL'
      ? this.prisma.school.count({ where: { createdAt: { lte: sixMonthsAgo } } })
      : this.prisma.enterprise.count({ where: { createdAt: { lte: sixMonthsAgo } } }))

    if (customers6m === 0) return 0
    return Math.max(0, (customers6m - customers3m) / customers6m / 3) // Monthly churn rate
  }

  private async getAverageMonthlyMargin(segment: Segment): Promise<number> {
    const revenue = await this.getAverageMonthlyRevenue(segment)
    const grossMargin = await this.calculateGrossMargin(segment)
    return revenue * (grossMargin / 100)
  }

  private async calculateNRR(segment: Segment, start: Date, end: Date): Promise<number> {
    const startOfPeriod = new Date(start)
    startOfPeriod.setMonth(startOfPeriod.getMonth() - 1)
    const endOfPeriod = new Date(start)
    endOfPeriod.setDate(0)

    const customers = await (segment === 'SCHOOL'
      ? this.prisma.school.findMany({
          where: { createdAt: { lte: endOfPeriod } },
          select: { id: true },
        })
      : this.prisma.enterprise.findMany({
          where: { createdAt: { lte: endOfPeriod } },
          select: { id: true },
        })) as Array<{ id: string }>

    let startingMRR = 0
    let endingMRR = 0

    for (const customer of customers) {
      const customerId = segment === 'SCHOOL' ? customer.id : String(customer.id)
      const startRevenue = await this.getCustomerRevenue(segment, customerId, startOfPeriod, endOfPeriod)
      const endRevenue = await this.getCustomerRevenue(segment, customerId, start, end)
      startingMRR += startRevenue
      endingMRR += endRevenue
    }

    return startingMRR > 0 ? (endingMRR / startingMRR) * 100 : 100
  }

  private async getCustomerRevenue(segment: Segment, customerId: string, start: Date, end: Date): Promise<number> {
    const result = await this.prisma.invoice.aggregate({
      where: {
        [segment === 'SCHOOL' ? 'schoolId' : 'enterpriseId']: segment === 'SCHOOL' ? customerId : parseInt(customerId, 10),
        status: 'paid',
        createdAt: { gte: start, lte: end },
      },
      _sum: { totalVnd: true },
    })
    return result._sum.totalVnd ?? 0
  }

  private async calculateGrossMargin(segment: Segment): Promise<number> {
    // Simplified - in production would use actual COGS
    // For platform businesses, gross margin typically 70-80%
    return segment === 'SCHOOL' ? 75 : 70
  }

  // =============================================================================
  // Cohort Analysis
  // =============================================================================

  async getCohortAnalysis(months = 12): Promise<CohortData[]> {
    const cohorts: CohortData[] = []

    for (let i = months - 1; i >= 0; i--) {
      const cohortStart = new Date()
      cohortStart.setMonth(cohortStart.getMonth() - i)
      cohortStart.setDate(1)
      cohortStart.setHours(0, 0, 0, 0)

      const cohortEnd = new Date(cohortStart)
      cohortEnd.setMonth(cohortEnd.getMonth() + 1)
      cohortEnd.setDate(0)
      cohortEnd.setHours(23, 59, 59, 999)

      for (const segment of ['SCHOOL', 'ENTERPRISE'] as Segment[]) {
        const customers = await (segment === 'SCHOOL'
          ? this.prisma.school.findMany({
              where: { createdAt: { gte: cohortStart, lte: cohortEnd } },
              select: { id: true },
            })
          : this.prisma.enterprise.findMany({
              where: { createdAt: { gte: cohortStart, lte: cohortEnd } },
              select: { id: true },
            })) as Array<{ id: string }>

        let retained = 0
        let revenue = 0
        let expansionRevenue = 0

        for (const customer of customers) {
          const customerId = segment === 'SCHOOL' ? customer.id : String(customer.id)
          // Check if still active (has paid invoice in last 30 days)
          const recentInvoice = await this.prisma.invoice.findFirst({
            where: {
              [segment === 'SCHOOL' ? 'schoolId' : 'enterpriseId']: segment === 'SCHOOL' ? customer.id : parseInt(customerId, 10),
              status: 'paid',
              createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
            },
          })
          if (recentInvoice) retained++

          // Get total revenue for this customer
          const customerRevenue = await this.prisma.invoice.aggregate({
            where: {
              [segment === 'SCHOOL' ? 'schoolId' : 'enterpriseId']: segment === 'SCHOOL' ? customer.id : parseInt(customerId, 10),
              status: 'paid',
            },
            _sum: { totalVnd: true },
          })
          const totalRevenueForCustomer = customerRevenue._sum.totalVnd ?? 0
          revenue += totalRevenueForCustomer

          // Calculate expansion (revenue beyond first month)
          const firstMonthRevenue = await this.getCustomerRevenue(segment, customerId, cohortStart, cohortEnd)
          if (totalRevenueForCustomer > firstMonthRevenue) {
            expansionRevenue += totalRevenueForCustomer - firstMonthRevenue
          }
        }

        const churned = customers.length - retained

        cohorts.push({
          cohortMonth: cohortStart.toISOString().slice(0, 7),
          segment,
          totalCustomers: customers.length,
          retainedCustomers: retained,
          revenue,
          churnedCustomers: churned,
          expansionRevenue,
        })
      }
    }

    return cohorts
  }

  // =============================================================================
  // Dashboard Metrics
  // =============================================================================

  async getDashboardMetrics() {
    const today = await this.calculateDailyCACLTV()
    const cohorts = await this.getCohortAnalysis(12)

    // Expansion revenue %
    const totalRevenue = await this.getTotalRevenue(30)
    const expansionRevenue = await this.getExpansionRevenue(30)
    const expansionPct = totalRevenue > 0 ? (expansionRevenue / totalRevenue) * 100 : 0

    return {
      unitEconomics: {
        schools: today.schools,
        enterprises: today.enterprises,
      },
      cohorts: cohorts.slice(0, 12), // Last 12 months
      expansionRevenuePct: Math.round(expansionPct * 100) / 100,
      researchTargets: {
        schoolPaybackMonths: 4.2,
        enterprisePaybackMonths: 9.5,
        schoolLTV: 500_000_000,
        enterpriseLTV: 300_000_000,
        schoolCAC: 50_000_000,
        enterpriseCAC: 30_000_000,
      },
    }
  }

  private async getTotalRevenue(days: number): Promise<number> {
    const result = await this.prisma.invoice.aggregate({
      where: {
        status: 'paid',
        createdAt: { gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) },
      },
      _sum: { totalVnd: true },
    })
    return result._sum.totalVnd ?? 0
  }

  private async getExpansionRevenue(days: number): Promise<number> {
    // Revenue from upsells, subscriptions beyond base tier, etc.
    // Simplified - in production would track via expansion products
    const result = await this.prisma.invoice.aggregate({
      where: {
        status: 'paid',
        relatedEntityType: { in: ['EXPANSION', 'UPSELL', 'SUBSCRIPTION_RENEWAL'] },
        createdAt: { gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) },
      },
      _sum: { totalVnd: true },
    })
    return result._sum.totalVnd ?? 0
  }

  // =============================================================================
  // Scheduled Job: Daily Calculation
  // =============================================================================

  async runDailyCalculation() {
    const today = new Date()
    const metrics = await this.calculateDailyCACLTV(today)

    // Store in database for historical tracking
    await this.prisma.unitEconomicsDaily.create({
      data: {
        date: today,
        schoolCac: metrics.schools.cac,
        schoolLtv: metrics.schools.ltv,
        schoolPaybackMonths: metrics.schools.paybackMonths,
        schoolNrr: metrics.schools.nrr,
        schoolGrossMargin: metrics.schools.grossMargin,
        schoolLtvCacRatio: metrics.schools.ltvCacRatio,
        enterpriseCac: metrics.enterprises.cac,
        enterpriseLtv: metrics.enterprises.ltv,
        enterprisePaybackMonths: metrics.enterprises.paybackMonths,
        enterpriseNrr: metrics.enterprises.nrr,
        enterpriseGrossMargin: metrics.enterprises.grossMargin,
        enterpriseLtvCacRatio: metrics.enterprises.ltvCacRatio,
      },
    })

    return metrics
  }
}