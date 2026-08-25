import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '@linkedu/api/common/prisma/prisma.service'

/**
 * Scholarship Fund CRUD operations.
 * Expects Prisma model: ScholarshipFund
 */

@Injectable()
export class ScholarshipFundService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    name: string
    description?: string
    targetAmountVnd: number
    currency?: string
    startDate?: Date
    endDate?: Date
    isActive?: boolean
    complianceRef?: string
  }) {
    const existing = await (this.prisma as any).scholarshipFund.findFirst({
      where: { name: data.name, deletedAt: null },
    })
    if (existing) {
      throw new ConflictException(`Quy hoc bong "${data.name}" da ton tai`)
    }

    return (this.prisma as any).scholarshipFund.create({
      data: {
        name: data.name,
        description: data.description,
        targetAmountVnd: data.targetAmountVnd,
        currentAmountVnd: 0,
        currency: data.currency || 'VND',
        startDate: data.startDate,
        endDate: data.endDate,
        isActive: data.isActive !== false,
        complianceRef: data.complianceRef,
      },
    })
  }

  async findAll(query: {
    page?: number
    limit?: number
    isActive?: boolean
    startDateFrom?: Date
    startDateTo?: Date
  }) {
    const { page = 1, limit = 20, isActive, startDateFrom, startDateTo } = query
    const where: any = { deletedAt: null }
    if (isActive !== undefined) where.isActive = isActive
    if (startDateFrom || startDateTo) {
      where.startDate = {}
      if (startDateFrom) where.startDate.gte = startDateFrom
      if (startDateTo) where.startDate.lte = startDateTo
    }

    const [items, total] = await Promise.all([
      (this.prisma as any).scholarshipFund.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          pillars: { where: { isActive: true } },
          _count: { select: { allocations: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      (this.prisma as any).scholarshipFund.count({ where }),
    ])

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findById(id: string) {
    const fund = await (this.prisma as any).scholarshipFund.findFirst({
      where: { id, deletedAt: null },
      include: {
        pillars: { where: { isActive: true } },
        allocations: {
          orderBy: { createdAt: 'desc' },
          take: 50,
          include: { learner: true, pillar: true },
        },
      },
    })
    if (!fund) throw new NotFoundException(`Quy hoc bong ${id} khong ton tai`)
    return fund
  }

  async update(id: string, data: Partial<{
    name: string
    description: string
    targetAmountVnd: number
    startDate: Date
    endDate: Date
    isActive: boolean
    complianceRef: string
  }>) {
    await this.findById(id)
    return (this.prisma as any).scholarshipFund.update({
      where: { id },
      data,
    })
  }

  async softDelete(id: string) {
    await this.findById(id)
    return (this.prisma as any).scholarshipFund.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }
}
