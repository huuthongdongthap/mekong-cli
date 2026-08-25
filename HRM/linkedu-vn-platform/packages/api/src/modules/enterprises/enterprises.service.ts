import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@linkedu/api/common/prisma/prisma.service'

@Injectable()
export class EnterprisesService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.enterprise.create({
      data: {
        name: data.name,
        taxCode: data.taxCode,
        industry: data.industry,
        address: data.address,
        provinceCode: data.provinceCode,
        districtId: data.districtId,
        phone: data.phone,
        email: data.email,
        website: data.website,
        contactName: data.contactName,
        contactPosition: data.contactPosition,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
        employeeCount: data.employeeCount,
        description: data.description,
        status: data.status || 'pending',
      },
    })
  }

  async findAll(query: any) {
    const { page = 1, limit = 20, industry, status, provinceCode } = query
    const where: any = { deletedAt: null }
    if (industry) where.industry = industry
    if (status) where.status = status
    if (provinceCode) where.provinceCode = provinceCode

    const [items, total] = await Promise.all([
      this.prisma.enterprise.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: { contacts: true, moas: { where: { deletedAt: null } } },
      }),
      this.prisma.enterprise.count({ where }),
    ])

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findOne(id: string) {
    const ent = await this.prisma.enterprise.findFirst({
      where: { id: parseInt(id, 10), deletedAt: null },
      include: { contacts: true, moas: true, placements: true, programs: true },
    })
    if (!ent) throw new NotFoundException('Doanh nghiệp không tồn tại')
    return ent
  }

  async update(id: string, data: any) {
    return this.prisma.enterprise.update({
      where: { id: parseInt(id, 10) },
      data: {
        name: data.name,
        taxCode: data.taxCode,
        industry: data.industry,
        address: data.address,
        provinceCode: data.provinceCode,
        districtId: data.districtId,
        phone: data.phone,
        email: data.email,
        website: data.website,
        contactName: data.contactName,
        contactPosition: data.contactPosition,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
        employeeCount: data.employeeCount,
        description: data.description,
        status: data.status,
      },
    })
  }

  async softDelete(id: string) {
    return this.prisma.enterprise.update({
      where: { id: parseInt(id, 10) },
      data: { deletedAt: new Date(), status: 'archived' },
    })
  }
}