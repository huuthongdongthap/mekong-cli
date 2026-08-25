import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '@linkedu/api/common/prisma/prisma.service'
import { EnrollmentStatus, EnrollmentType } from '@prisma/client'

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async enroll(data: any) {
    // Check for duplicate enrollment
    const existing = await this.prisma.enrollment.findFirst({
      where: { learnerId: data.learnerId, programId: data.programId },
    })
    if (existing) throw new ConflictException('Người học đã đăng ký trong CTĐT này')

    const enrollmentNo = await this.generateEnrollmentNo(data.programId)

    return this.prisma.enrollment.create({
      data: {
        learnerId: data.learnerId,
        programId: data.programId,
        enrollmentType: data.enrollmentType || EnrollmentType.self_apply,
        enrolledById: data.enrolledById,
        enrollmentNo,
      },
      include: { learner: true, program: true },
    })
  }

  async findAll(query: any) {
    const { page = 1, limit = 20, status, programId, learnerId } = query
    const where: any = {}
    if (status) where.status = status
    if (programId) where.programId = programId
    if (learnerId) where.learnerId = learnerId

    const [items, total] = await Promise.all([
      this.prisma.enrollment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: { learner: true, program: true },
      }),
      this.prisma.enrollment.count({ where }),
    ])

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findOne(id: string) {
    const enrollment = await this.prisma.enrollment.findFirst({
      where: { id },
      include: { learner: true, program: true, practiceRecords: true, evaluations: true },
    })
    if (!enrollment) throw new NotFoundException('Đăng ký không tồn tại')
    return enrollment
  }

  async updateStatus(id: string, status: EnrollmentStatus) {
    return this.prisma.enrollment.update({
      where: { id },
      data: { status },
    })
  }

  private async generateEnrollmentNo(_programId: number): Promise<string> {
    const year = new Date().getFullYear()
    const count = await this.prisma.enrollment.count({
      where: {
        enrollmentNo: { startsWith: `ENR/${year}/` },
      },
    })
    return `ENR/${year}/${String(count + 1).padStart(3, '0')}`
  }
}
