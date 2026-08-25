import { Injectable } from '@nestjs/common'
import { PrismaService } from '@linkedu/api/common/prisma/prisma.service'
import { ScholarshipFundService } from './scholarship-fund.service'
import { ScholarshipPillarService, ScholarshipPillarType } from './scholarship-pillar.service'
import { ScholarshipAllocationService, AllocationStatus } from './scholarship-allocation.service'

export { ScholarshipPillarType, AllocationStatus }

/**
 * Scholarship Fund Management Service
 *
 * Orchestrates fund, pillar, and allocation operations for TT 23/2021 compliance.
 * Target: 50B VND AUM by Y3 with 5 pillars.
 *
 * NOTE: This service expects the following Prisma models to exist:
 * - ScholarshipFund, ScholarshipPillar, ScholarshipAllocation
 * Schema changes will be done separately.
 */

@Injectable()
export class ScholarshipService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fundService: ScholarshipFundService,
    private readonly pillarService: ScholarshipPillarService,
    private readonly allocationService: ScholarshipAllocationService,
  ) {}

  // Fund operations
  createFund(data: Parameters<ScholarshipFundService['create']>[0]) {
    return this.fundService.create(data)
  }

  getFunds(query: Parameters<ScholarshipFundService['findAll']>[0]) {
    return this.fundService.findAll(query)
  }

  getFundById(id: string) {
    return this.fundService.findById(id)
  }

  updateFund(id: string, data: Parameters<ScholarshipFundService['update']>[1]) {
    return this.fundService.update(id, data)
  }

  softDeleteFund(id: string) {
    return this.fundService.softDelete(id)
  }

  // Pillar operations
  createPillar(fundId: string, data: Parameters<ScholarshipPillarService['create']>[1]) {
    return this.pillarService.create(fundId, data)
  }

  getPillars(fundId: string) {
    return this.pillarService.findByFund(fundId)
  }

  getPillarById(id: string) {
    return this.pillarService.findById(id)
  }

  updatePillar(id: string, data: Parameters<ScholarshipPillarService['update']>[1]) {
    return this.pillarService.update(id, data)
  }

  // Allocation operations
  allocate(data: Parameters<ScholarshipAllocationService['allocate']>[0]) {
    return this.allocationService.allocate(data)
  }

  getAllocations(query: Parameters<ScholarshipAllocationService['findAll']>[0]) {
    return this.allocationService.findAll(query)
  }

  updateAllocationStatus(
    id: string,
    status: AllocationStatus,
    data?: Parameters<ScholarshipAllocationService['updateStatus']>[2]
  ) {
    return this.allocationService.updateStatus(id, status, data)
  }

  // Summary & reporting
  async getFundSummary(fundId: string) {
    const fund = await this.fundService.findById(fundId)
    const allocations = await (this.prisma as any).scholarshipAllocation.findMany({
      where: { fundId },
    })

    const totalAllocated = allocations
      .filter((a: any) => a.status !== 'cancelled' && a.status !== 'rejected')
      .reduce((sum: number, a: any) => sum + a.amountVnd, 0)

    const totalDisbursed = allocations
      .filter((a: any) => a.status === 'disbursed')
      .reduce((sum: number, a: any) => sum + a.amountVnd, 0)

    const byPillar = allocations.reduce((acc: any, a: any) => {
      if (a.status === 'cancelled' || a.status === 'rejected') return acc
      acc[a.pillarId] = (acc[a.pillarId] || 0) + a.amountVnd
      return acc
    }, {})

    return {
      fundId: fund.id,
      fundName: fund.name,
      targetAmountVnd: fund.targetAmountVnd,
      totalAllocated,
      totalDisbursed,
      remainingVnd: fund.targetAmountVnd - totalAllocated,
      utilizationPercent: fund.targetAmountVnd > 0
        ? Math.round((totalAllocated / fund.targetAmountVnd) * 100)
        : 0,
      allocationCount: allocations.filter(
        (a: any) => a.status !== 'cancelled' && a.status !== 'rejected'
      ).length,
      byPillar,
    }
  }
}
