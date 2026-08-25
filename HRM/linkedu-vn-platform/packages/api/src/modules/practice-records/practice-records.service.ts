import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '@linkedu/api/common/prisma/prisma.service'
import { CreatePracticeRecordDto } from './dto/create-practice-record.dto'
import { UpdatePracticeRecordDto } from './dto/update-practice-record.dto'
import { ListPracticeRecordsQueryDto } from './dto/list-practice-records.dto'

@Injectable()
export class PracticeRecordsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePracticeRecordDto) {
    // Validate enrollment exists and is approved
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: dto.enrollmentId },
    })
    if (!enrollment) {
      throw new NotFoundException('Đăng ký không tồn tại')
    }

    // Validate learner belongs to enrollment
    if (enrollment.learnerId !== dto.learnerId) {
      throw new BadRequestException('Người học không thuộc đăng ký này')
    }

    // Validate enterprise exists
    const enterprise = await this.prisma.enterprise.findUnique({
      where: { id: dto.enterpriseId },
    })
    if (!enterprise) {
      throw new NotFoundException('Doanh nghiệp không tồn tại')
    }

    return this.prisma.practiceRecord.create({
      data: {
        enrollmentId: dto.enrollmentId,
        learnerId: dto.learnerId,
        enterpriseId: dto.enterpriseId,
        practiceDate: new Date(dto.practiceDate),
        activities: dto.activities,
        hoursWorked: dto.hoursWorked,
        supervisorName: dto.supervisorName,
        skillsDemonstrated: dto.skillsDemonstrated,
        feedback: dto.feedback || null,
        rating: dto.rating || null,
        createdById: dto.createdById,
      },
      include: {
        enrollment: true,
        learner: true,
        enterprise: true,
        createdBy: { select: { id: true, firstName: true, lastName: true } },
      },
    })
  }

  async findAll(query: ListPracticeRecordsQueryDto) {
    const { page = 1, limit = 20, enrollmentId, learnerId, enterpriseId, startDate, endDate } = query
    const where: any = {}

    if (enrollmentId) where.enrollmentId = enrollmentId
    if (learnerId) where.learnerId = learnerId
    if (enterpriseId) where.enterpriseId = enterpriseId

    if (startDate || endDate) {
      where.practiceDate = {}
      if (startDate) where.practiceDate.gte = new Date(startDate)
      if (endDate) where.practiceDate.lte = new Date(endDate)
    }

    const [items, total] = await Promise.all([
      this.prisma.practiceRecord.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          learner: { select: { id: true, fullName: true } },
          enterprise: { select: { id: true, name: true } },
        },
        orderBy: { practiceDate: 'desc' },
      }),
      this.prisma.practiceRecord.count({ where }),
    ])

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findOne(id: string) {
    const record = await this.prisma.practiceRecord.findUnique({
      where: { id },
      include: {
        enrollment: true,
        learner: true,
        enterprise: true,
        createdBy: { select: { id: true, firstName: true, lastName: true } },
      },
    })
    if (!record) {
      throw new NotFoundException('Bản ghi thực hành không tồn tại')
    }
    return record
  }

  async update(id: string, dto: UpdatePracticeRecordDto) {
    const existing = await this.prisma.practiceRecord.findUnique({ where: { id } })
    if (!existing) {
      throw new NotFoundException('Bản ghi thực hành không tồn tại')
    }

    return this.prisma.practiceRecord.update({
      where: { id },
      data: {
        ...(dto.practiceDate && { practiceDate: new Date(dto.practiceDate) }),
        ...(dto.activities && { activities: dto.activities }),
        ...(dto.hoursWorked !== undefined && { hoursWorked: dto.hoursWorked }),
        ...(dto.supervisorName && { supervisorName: dto.supervisorName }),
        ...(dto.supervisorSignatureUrl !== undefined && { supervisorSignatureUrl: dto.supervisorSignatureUrl }),
        ...(dto.skillsDemonstrated && { skillsDemonstrated: dto.skillsDemonstrated }),
        ...(dto.feedback !== undefined && { feedback: dto.feedback }),
        ...(dto.rating !== undefined && { rating: dto.rating }),
      },
      include: {
        enrollment: true,
        learner: true,
        enterprise: true,
        createdBy: { select: { id: true, firstName: true, lastName: true } },
      },
    })
  }

  async remove(id: string) {
    const existing = await this.prisma.practiceRecord.findUnique({ where: { id } })
    if (!existing) {
      throw new NotFoundException('Bản ghi thực hành không tồn tại')
    }

    return this.prisma.practiceRecord.delete({ where: { id } })
  }

  async findByEnrollment(enrollmentId: string) {
    return this.prisma.practiceRecord.findMany({
      where: { enrollmentId },
      include: {
        learner: { select: { id: true, fullName: true } },
        enterprise: { select: { id: true, name: true } },
      },
      orderBy: { practiceDate: 'asc' },
    })
  }

  async findByLearner(learnerId: string) {
    return this.prisma.practiceRecord.findMany({
      where: { learnerId },
      include: {
        enterprise: { select: { id: true, name: true } },
        enrollment: { select: { id: true, enrollmentNo: true } },
      },
      orderBy: { practiceDate: 'desc' },
    })
  }

  async getHoursSummary(enrollmentId: string) {
    const records = await this.prisma.practiceRecord.findMany({
      where: { enrollmentId },
      select: { hoursWorked: true, practiceDate: true },
      orderBy: { practiceDate: 'asc' },
    })

    const totalHours = records.reduce((sum, r) => sum + r.hoursWorked, 0)
    const totalDays = records.length

    return { enrollmentId, totalHours, totalDays, records }
  }
}
