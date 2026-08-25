import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@linkedu/api/common/prisma/prisma.service'

@Injectable()
export class SchoolsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Record<string, unknown>) {
    const payload: Record<string, unknown> = {
      name: data.name,
      schoolType: data.schoolType ?? 'nghe_nghiep',
      status: data.status ?? 'active',
      verificationStatus: data.verificationStatus ?? 'pending',
    }
    if (data.code) payload.code = data.code
    if (data.address) payload.address = data.address
    if (data.provinceCode) payload.provinceCode = data.provinceCode
    if (data.districtId != null) payload.districtId = data.districtId
    if (data.phone) payload.phone = data.phone
    if (data.email) payload.email = data.email
    if (data.directorName) payload.directorName = data.directorName
    if (data.taxCode) payload.taxCode = data.taxCode
    if (data.qlgdnnCode) payload.qlgdnnCode = data.qlgdnnCode
    if (data.metadata) payload.metadata = data.metadata
    return this.prisma.school.create({ data: payload as never })
  }

  async findAll(query: Record<string, unknown>) {
    const page = (query.page as number) ?? 1
    const limit = (query.limit as number) ?? 20
    const where: Record<string, unknown> = { deletedAt: null }
    if (query.provinceCode) where.provinceCode = query.provinceCode
    if (query.schoolType) where.schoolType = query.schoolType
    if (query.status) where.status = query.status
    if (query.search) {
      where.name = { contains: query.search as string, mode: 'insensitive' }
    }
    const [items, total] = await Promise.all([
      this.prisma.school.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: { province: true },
      }),
      this.prisma.school.count({ where }),
    ])
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findById(id: string) {
    const school = await this.prisma.school.findFirst({
      where: { id, deletedAt: null },
      include: { province: true, contacts: true },
    })
    if (!school) throw new NotFoundException('Trường không tồn tại')
    return school
  }

  async update(id: string, data: Record<string, unknown>) {
    const payload: Record<string, unknown> = {}
    if (data.name) payload.name = data.name
    if (data.schoolType) payload.schoolType = data.schoolType
    if (data.status) payload.status = data.status
    if (data.verificationStatus) payload.verificationStatus = data.verificationStatus
    if (data.address != null) payload.address = data.address
    if (data.provinceCode != null) payload.provinceCode = data.provinceCode
    if (data.districtId != null) payload.districtId = data.districtId
    if (data.phone != null) payload.phone = data.phone
    if (data.email != null) payload.email = data.email
    if (data.directorName != null) payload.directorName = data.directorName
    if (data.taxCode != null) payload.taxCode = data.taxCode
    if (data.qlgdnnCode != null) payload.qlgdnnCode = data.qlgdnnCode
    if (data.metadata) payload.metadata = data.metadata
    return this.prisma.school.update({ where: { id }, data: payload as never })
  }

  async softDelete(id: string) {
    return this.prisma.school.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }
}
