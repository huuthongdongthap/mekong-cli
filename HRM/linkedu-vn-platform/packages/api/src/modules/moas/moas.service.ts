import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@linkedu/api/common/prisma/prisma.service'
import { MoaStatus } from '@prisma/client'

@Injectable()
export class MoasService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const code = await this.generateMoaCode()
    return this.prisma.moa.create({
      data: {
        code,
        schoolId: data.schoolId,
        enterpriseId: data.enterpriseId,
        title: data.title,
        scope: data.scope,
        content: data.content,
        terms: data.terms || {},
        signedDate: data.validFrom ? new Date(data.validFrom) : null,
        expiresDate: data.validTo ? new Date(data.validTo) : null,
        signedDocUrl: data.signedDocUrl,
        status: MoaStatus.draft,
        createdById: data.createdById,
      },
    })
  }

  async findAll(query: any) {
    const { page = 1, limit = 20, status, schoolId, enterpriseId } = query
    const where: any = { deletedAt: null }
    if (status) where.status = status
    if (schoolId) where.schoolId = schoolId
    if (enterpriseId) where.enterpriseId = enterpriseId

    const [items, total] = await Promise.all([
      this.prisma.moa.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: { school: true, enterprise: true, programs: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.moa.count({ where }),
    ])

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findOne(id: number) {
    const moa = await this.prisma.moa.findFirst({
      where: { id, deletedAt: null },
      include: { school: true, enterprise: true, programs: true },
    })
    if (!moa) throw new NotFoundException('MOU không tồn tại')
    return moa
  }

  async sign(id: number, body: any) {
    const moa = await this.prisma.moa.findUnique({ where: { id } })
    if (!moa) throw new NotFoundException('MOU không tồn tại')

    // State machine transition
    let nextStatus = moa.status
    if (moa.status === MoaStatus.draft && body.signerType === 'school') {
      nextStatus = MoaStatus.pending
    } else if (moa.status === MoaStatus.draft && body.signerType === 'enterprise') {
      nextStatus = MoaStatus.pending
    } else if (moa.status === MoaStatus.pending && body.signerType === 'enterprise' && nextStatus !== MoaStatus.approved) {
      nextStatus = MoaStatus.approved
    } else if (moa.status === MoaStatus.approved && body.signerType === 'school') {
      nextStatus = MoaStatus.signed
    }

    return this.prisma.moa.update({
      where: { id },
      data: {
        status: nextStatus,
        signedDocUrl: body.signedDocUrl || moa.signedDocUrl,
        signedDocHash: body.signedDocHash || moa.signedDocHash,
        signedDate: new Date(),
      },
      include: { school: true, enterprise: true },
    })
  }

  async softDelete(id: number) {
    return this.prisma.moa.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }

  private async generateMoaCode(): Promise<string> {
    const year = new Date().getFullYear()
    const count = await this.prisma.moa.count({
      where: {
        code: { startsWith: `MOU/${year}/` },
      },
    })
    return `MOU/${year}/${String(count + 1).padStart(3, '0')}`
  }
}