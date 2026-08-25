import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@linkedu/api/common/prisma/prisma.service'

const PLACEMENT_STATUSES = Object.freeze({
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  TERMINATED: 'terminated',
  ONGOING: 'ongoing',
})

@Injectable()
export class PlacementsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.placement.create({
      data: {
        enrollmentId: data.enrollmentId,
        learnerId: data.learnerId,
        programId: data.programId,
        enterpriseId: data.enterpriseId,
        positionApplied: data.positionApplied,
        positionOffered: data.positionOffered,
        employmentType: data.employmentType,
        salaryMinVnd: data.salaryMinVnd,
        salaryMaxVnd: data.salaryMaxVnd,
        startDate: data.startDate ? new Date(data.startDate) : new Date(),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        status: PLACEMENT_STATUSES.IN_PROGRESS,
      },
      include: { learner: { include: { user: true } }, enterprise: true, enrollment: { include: { program: true } } },
    })
  }

  async findAll(query: any) {
    const { page = 1, limit = 20, status, enterpriseId, learnerId } = query
    const where: any = {}
    if (status) where.status = status
    if (enterpriseId) where.enterpriseId = parseInt(enterpriseId, 10)
    if (learnerId) where.learnerId = learnerId

    const [items, total] = await Promise.all([
      this.prisma.placement.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: { learner: { include: { user: true } }, enterprise: true, enrollment: { include: { program: true } } },
      }),
      this.prisma.placement.count({ where }),
    ])

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findOne(id: string) {
    const placement = await this.prisma.placement.findFirst({
      where: { id: parseInt(id, 10) },
      include: { learner: { include: { user: true } }, enterprise: true, enrollment: { include: { program: true } } },
    })
    if (!placement) throw new NotFoundException('Thực tập/việc làm không tồn tại')
    return placement
  }

  async update(id: string, data: any) {
    return this.prisma.placement.update({
      where: { id: parseInt(id, 10) },
      data: {
        status: data.status,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        employmentType: data.employmentType,
        salaryMinVnd: data.salaryMinVnd,
        salaryMaxVnd: data.salaryMaxVnd,
        isCurrentJob: data.isCurrentJob,
        learnerFeedback: data.learnerFeedback,
        enterpriseFeedback: data.enterpriseFeedback,
      },
    })
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.placement.update({
      where: { id: parseInt(id, 10) },
      data: { status: status as any },
    })
  }
}