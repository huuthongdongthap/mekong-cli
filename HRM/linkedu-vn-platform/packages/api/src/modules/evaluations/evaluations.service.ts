import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '@linkedu/api/common/prisma/prisma.service'
import { EvaluationType } from '@prisma/client'
import { CreateEvaluationDto, UpdateEvaluationDto } from './dto/evaluations.dto'

@Injectable()
export class EvaluationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEvaluationDto) {
    const [enrollment, learner, evaluator] = await Promise.all([
      this.prisma.enrollment.findUnique({ where: { id: dto.enrollmentId } }),
      this.prisma.learner.findUnique({ where: { id: dto.learnerId } }),
      this.prisma.user.findUnique({ where: { id: dto.evaluatorId } }),
    ])

    if (!enrollment) throw new BadRequestException('Ghi danh không tồn tại')
    if (!learner) throw new BadRequestException('Học viên không tồn tại')
    if (!evaluator) throw new BadRequestException('Đánh giá viên không tồn tại')

    const percentage = this.calculatePercentage(dto.totalScore, dto.maxScore, dto.percentage)

    return this.prisma.evaluation.create({
      data: {
        enrollmentId: dto.enrollmentId,
        learnerId: dto.learnerId,
        evaluatorId: dto.evaluatorId,
        evaluationType: dto.evaluationType as EvaluationType,
        rubric: (dto.rubric as any) || undefined,
        totalScore: dto.totalScore ?? undefined,
        maxScore: dto.maxScore ?? undefined,
        percentage: percentage ?? undefined,
        feedback: dto.feedback || undefined,
        strengths: dto.strengths || [],
        improvements: dto.improvements || [],
        evidenceDocUrl: dto.evidenceDocUrl || undefined,
        evaluatedAt: dto.evaluatedAt ? new Date(dto.evaluatedAt) : new Date(),
      },
      include: {
        enrollment: { include: { program: { select: { name: true } } } },
        learner: { select: { fullName: true, id: true } },
        evaluator: { select: { firstName: true, lastName: true, id: true } },
      },
    })
  }

  async findAll(query: any) {
    const { page = 1, limit = 20, enrollmentId, learnerId, evaluatorId, evaluationType, fromDate, toDate } = query
    const where: any = {}

    if (enrollmentId) where.enrollmentId = enrollmentId
    if (learnerId) where.learnerId = learnerId
    if (evaluatorId) where.evaluatorId = evaluatorId
    if (evaluationType) where.evaluationType = evaluationType
    if (fromDate || toDate) {
      where.evaluatedAt = {}
      if (fromDate) where.evaluatedAt.gte = new Date(fromDate)
      if (toDate) where.evaluatedAt.lte = new Date(toDate)
    }

    const [items, total] = await Promise.all([
      this.prisma.evaluation.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          enrollment: { include: { program: { select: { name: true } } } },
          learner: { select: { fullName: true, id: true } },
          evaluator: { select: { firstName: true, lastName: true, id: true } },
        },
        orderBy: { evaluatedAt: 'desc' },
      }),
      this.prisma.evaluation.count({ where }),
    ])

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findOne(id: string) {
    const evaluation = await this.prisma.evaluation.findFirst({
      where: { id: parseInt(id, 10) },
      include: {
        enrollment: { include: { program: true, learner: true } },
        learner: { select: { fullName: true, id: true } },
        evaluator: { select: { firstName: true, lastName: true, id: true } },
      },
    })
    if (!evaluation) throw new NotFoundException('Đánh giá không tồn tại')
    return evaluation
  }

  async update(id: string, dto: UpdateEvaluationDto) {
    const existing = await this.prisma.evaluation.findFirst({
      where: { id: parseInt(id, 10) },
    })
    if (!existing) throw new NotFoundException('Đánh giá không tồn tại')

    const percentage = this.calculatePercentage(dto.totalScore, dto.maxScore, dto.percentage)

    return this.prisma.evaluation.update({
      where: { id: parseInt(id, 10) },
      data: {
        totalScore: dto.totalScore ?? undefined,
        maxScore: dto.maxScore ?? undefined,
        percentage: percentage ?? undefined,
        feedback: dto.feedback ?? undefined,
        strengths: dto.strengths ?? undefined,
        improvements: dto.improvements ?? undefined,
        evidenceDocUrl: dto.evidenceDocUrl ?? undefined,
        rubric: (dto.rubric as any) ?? undefined,
      },
      include: {
        enrollment: { include: { program: { select: { name: true } } } },
        learner: { select: { fullName: true, id: true } },
        evaluator: { select: { firstName: true, lastName: true, id: true } },
      },
    })
  }

  async remove(id: string) {
    const existing = await this.prisma.evaluation.findFirst({
      where: { id: parseInt(id, 10) },
    })
    if (!existing) throw new NotFoundException('Đánh giá không tồn tại')

    await this.prisma.evaluation.delete({
      where: { id: parseInt(id, 10) },
    })

    return { deleted: true }
  }

  async findByEnrollment(enrollmentId: string) {
    return this.prisma.evaluation.findMany({
      where: { enrollmentId },
      include: {
        learner: { select: { fullName: true, id: true } },
        evaluator: { select: { firstName: true, lastName: true, id: true } },
      },
      orderBy: { evaluatedAt: 'desc' },
    })
  }

  async findByLearner(learnerId: string) {
    return this.prisma.evaluation.findMany({
      where: { learnerId },
      include: {
        enrollment: { include: { program: { select: { name: true } } } },
        evaluator: { select: { firstName: true, lastName: true, id: true } },
      },
      orderBy: { evaluatedAt: 'desc' },
    })
  }

  private calculatePercentage(totalScore?: number, maxScore?: number, explicitPercentage?: number): number | undefined {
    if (explicitPercentage !== undefined) return explicitPercentage
    if (totalScore !== undefined && maxScore !== undefined && maxScore > 0) {
      return Math.round((totalScore / maxScore) * 10000) / 100
    }
    return undefined
  }
}
