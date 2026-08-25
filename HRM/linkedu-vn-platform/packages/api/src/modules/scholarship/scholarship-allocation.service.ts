import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common'
import { PrismaService } from '@linkedu/api/common/prisma/prisma.service'

/**
 * Scholarship Allocation operations.
 * Expects Prisma model: ScholarshipAllocation
 */

export enum AllocationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DISBURSED = 'disbursed',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

@Injectable()
export class ScholarshipAllocationService {
  constructor(private readonly prisma: PrismaService) {}

  async allocate(data: {
    fundId: string
    pillarId: string
    learnerId: string
    amountVnd: number
    justification?: string
    academicYear?: string
    semester?: string
  }) {
    // Validate fund is active
    const fund = await (this.prisma as any).scholarshipFund.findFirst({
      where: { id: data.fundId, deletedAt: null },
    })
    if (!fund) throw new NotFoundException(`Quy hoc bong ${data.fundId} khong ton tai`)
    if (!fund.isActive) throw new BadRequestException('Quy hoc bong khong hoat dong')

    // Validate pillar belongs to fund
    const pillar = await (this.prisma as any).scholarshipPillar.findFirst({
      where: { id: data.pillarId },
    })
    if (!pillar) throw new NotFoundException(`Tru cot hoc bong ${data.pillarId} khong ton tai`)
    if (pillar.fundId !== data.fundId) {
      throw new BadRequestException('Tru cot khong thuoc quy hoc bong nay')
    }

    // Check amount within pillar limits
    if (pillar.maxAmountVnd && data.amountVnd > pillar.maxAmountVnd) {
      throw new BadRequestException(
        `So tien vuot qua gioi han toi da: ${pillar.maxAmountVnd} VND`
      )
    }
    if (pillar.minAmountVnd && data.amountVnd < pillar.minAmountVnd) {
      throw new BadRequestException(
        `So tinh thap hon gioi han toi thieu: ${pillar.minAmountVnd} VND`
      )
    }

    // Check fund has sufficient balance
    const totalAllocated = await this.getTotalAllocatedForFund(data.fundId)
    if (totalAllocated + data.amountVnd > fund.targetAmountVnd) {
      throw new BadRequestException(
        `Quy khong du so du. Con lai: ${fund.targetAmountVnd - totalAllocated} VND`
      )
    }

    // Check for duplicate allocation
    const existingAllocation = await (this.prisma as any).scholarshipAllocation.findFirst({
      where: {
        fundId: data.fundId,
        learnerId: data.learnerId,
        pillarId: data.pillarId,
        academicYear: data.academicYear,
        semester: data.semester,
        status: { notIn: ['cancelled', 'rejected'] },
      },
    })
    if (existingAllocation) {
      throw new ConflictException('Hoc vien da duoc phan bo hoc bong cho tru cot nay')
    }

    return (this.prisma as any).scholarshipAllocation.create({
      data: {
        fundId: data.fundId,
        pillarId: data.pillarId,
        learnerId: data.learnerId,
        amountVnd: data.amountVnd,
        justification: data.justification,
        academicYear: data.academicYear,
        semester: data.semester,
        status: AllocationStatus.PENDING,
      },
      include: { fund: true, pillar: true, learner: true },
    })
  }

  async findAll(query: {
    page?: number
    limit?: number
    fundId?: string
    pillarId?: string
    learnerId?: string
    status?: AllocationStatus
  }) {
    const { page = 1, limit = 20, fundId, pillarId, learnerId, status } = query
    const where: any = {}
    if (fundId) where.fundId = fundId
    if (pillarId) where.pillarId = pillarId
    if (learnerId) where.learnerId = learnerId
    if (status) where.status = status

    const [items, total] = await Promise.all([
      (this.prisma as any).scholarshipAllocation.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: { fund: true, pillar: true, learner: true },
        orderBy: { createdAt: 'desc' },
      }),
      (this.prisma as any).scholarshipAllocation.count({ where }),
    ])

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async updateStatus(
    id: string,
    status: AllocationStatus,
    data?: { rejectionReason?: string; disbursedAt?: Date; disbursedBy?: string }
  ) {
    const allocation = await (this.prisma as any).scholarshipAllocation.findFirst({
      where: { id },
    })
    if (!allocation) throw new NotFoundException(`Phan bo hoc bong ${id} khong ton tai`)

    // Validate status transitions
    const validTransitions: Record<string, string[]> = {
      pending: ['approved', 'rejected', 'cancelled'],
      approved: ['disbursed', 'cancelled'],
      disbursed: [],
      rejected: [],
      cancelled: [],
    }
    if (!validTransitions[allocation.status]?.includes(status)) {
      throw new BadRequestException(
        `Khong the chuyen trang thai tu ${allocation.status} sang ${status}`
      )
    }

    const updateData: any = { status }
    if (data?.rejectionReason) updateData.rejectionReason = data.rejectionReason
    if (data?.disbursedAt) updateData.disbursedAt = data.disbursedAt
    if (data?.disbursedBy) updateData.disbursedBy = data.disbursedBy
    if (status === 'disbursed') updateData.disbursedAt = data?.disbursedAt || new Date()

    return (this.prisma as any).scholarshipAllocation.update({
      where: { id },
      data: updateData,
      include: { fund: true, pillar: true, learner: true },
    })
  }

  private async getTotalAllocatedForFund(fundId: string): Promise<number> {
    const result = await (this.prisma as any).scholarshipAllocation.aggregate({
      where: {
        fundId,
        status: { notIn: ['cancelled', 'rejected'] },
      },
      _sum: { amountVnd: true },
    })
    return result._sum.amountVnd || 0
  }
}
