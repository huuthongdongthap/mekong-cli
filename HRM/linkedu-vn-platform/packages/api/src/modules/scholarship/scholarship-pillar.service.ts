import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '@linkedu/api/common/prisma/prisma.service'

/**
 * Scholarship Pillar CRUD operations.
 * Expects Prisma model: ScholarshipPillar
 */

export enum ScholarshipPillarType {
  TUITION_SUPPORT = 'tuition_support',
  LIVING_STIPEND = 'living_stipend',
  BOOK_GRANT = 'book_grant',
  TECHNOLOGY_ACCESS = 'technology_access',
  EMERGENCY_FUND = 'emergency_fund',
}

@Injectable()
export class ScholarshipPillarService {
  constructor(private readonly prisma: PrismaService) {}

  async create(fundId: string, data: {
    name: string
    description?: string
    pillarType: ScholarshipPillarType
    allocationPercent: number
    maxAmountVnd?: number
    minAmountVnd?: number
    isActive?: boolean
    eligibilityCriteria?: string
  }) {
    // Validate fund exists
    const fund = await (this.prisma as any).scholarshipFund.findFirst({
      where: { id: fundId, deletedAt: null },
    })
    if (!fund) throw new NotFoundException(`Quy hoc bong ${fundId} khong ton tai`)

    // Validate allocation percent doesn't exceed 100%
    const existingPillars = await (this.prisma as any).scholarshipPillar.findMany({
      where: { fundId, isActive: true },
    })
    const totalPercent = existingPillars.reduce(
      (sum: number, p: any) => sum + p.allocationPercent, 0
    )
    if (totalPercent + data.allocationPercent > 100) {
      throw new BadRequestException(
        `Tong phan tram phan bo khong duoc vuot qua 100%. Hien tai: ${totalPercent}%`
      )
    }

    return (this.prisma as any).scholarshipPillar.create({
      data: {
        fundId,
        name: data.name,
        description: data.description,
        pillarType: data.pillarType,
        allocationPercent: data.allocationPercent,
        maxAmountVnd: data.maxAmountVnd,
        minAmountVnd: data.minAmountVnd,
        isActive: data.isActive !== false,
        eligibilityCriteria: data.eligibilityCriteria,
      },
    })
  }

  async findByFund(fundId: string) {
    return (this.prisma as any).scholarshipPillar.findMany({
      where: { fundId, isActive: true },
      include: {
        _count: { select: { allocations: true } },
      },
      orderBy: { pillarType: 'asc' },
    })
  }

  async findById(id: string) {
    const pillar = await (this.prisma as any).scholarshipPillar.findFirst({
      where: { id },
      include: {
        fund: true,
        allocations: { orderBy: { createdAt: 'desc' }, take: 20 },
      },
    })
    if (!pillar) throw new NotFoundException(`Tru cot hoc bong ${id} khong ton tai`)
    return pillar
  }

  async update(id: string, data: Partial<{
    name: string
    description: string
    allocationPercent: number
    maxAmountVnd: number
    minAmountVnd: number
    isActive: boolean
    eligibilityCriteria: string
  }>) {
    await this.findById(id)
    return (this.prisma as any).scholarshipPillar.update({
      where: { id },
      data,
    })
  }
}
