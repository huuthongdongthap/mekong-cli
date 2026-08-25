import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@linkedu/api/common/prisma/prisma.service'
import { ProgramStatus, ProgramType, ProgramField, QualificationLevel } from '@prisma/client'

@Injectable()
export class ProgramsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const code = await this.generateProgramCode()
    return this.prisma.program.create({
      data: {
        code,
        schoolId: data.schoolId,
        enterpriseId: data.enterpriseId,
        moaId: data.moaId,
        name: data.name,
        nameEn: data.nameEn,
        programType: data.programType || ProgramType.thuc_tap,
        field: data.field || ProgramField.IT,
        qualificationLevel: data.qualificationLevel || QualificationLevel.trung_cap,
        durationMonths: data.durationMonths,
        maxLearners: data.maxLearners,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        applicationDeadline: data.applicationDeadline ? new Date(data.applicationDeadline) : null,
        tuitionFeeVnd: data.tuitionFeeVnd,
        description: data.description,
        requirements: data.requirements,
        curriculum: data.curriculum,
        moetRegistrationNo: data.moetRegistrationNo,
        status: ProgramStatus.draft,
        createdById: data.createdById,
      },
    })
  }

  async findAll(query: any) {
    const { page = 1, limit = 20, type, field, status, schoolId, enterpriseId } = query
    const where: any = { deletedAt: null }
    if (type) where.programType = type
    if (field) where.field = field
    if (status) where.status = status
    if (schoolId) where.schoolId = schoolId
    if (enterpriseId) where.enterpriseId = enterpriseId

    const [items, total] = await Promise.all([
      this.prisma.program.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: { school: true, enterprise: true, enrollments: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.program.count({ where }),
    ])

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findOne(id: number) {
    const program = await this.prisma.program.findFirst({
      where: { id, deletedAt: null },
      include: { school: true, enterprise: true, enrollments: true },
    })
    if (!program) throw new NotFoundException('Chương trình đào tạo không tồn tại')
    return program
  }

  async update(id: number, data: any) {
    return this.prisma.program.update({
      where: { id },
      data: {
        name: data.name,
        nameEn: data.nameEn,
        durationMonths: data.durationMonths,
        maxLearners: data.maxLearners,
        tuitionFeeVnd: data.tuitionFeeVnd,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        applicationDeadline: data.applicationDeadline ? new Date(data.applicationDeadline) : undefined,
        description: data.description,
        requirements: data.requirements,
        curriculum: data.curriculum,
        status: data.status,
      },
    })
  }

  async softDelete(id: number) {
    return this.prisma.program.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }

  private async generateProgramCode(): Promise<string> {
    const year = new Date().getFullYear()
    const count = await this.prisma.program.count({
      where: {
        code: { startsWith: `CTDT/${year}/` },
      },
    })
    return `CTDT/${year}/${String(count + 1).padStart(3, '0')}`
  }
}