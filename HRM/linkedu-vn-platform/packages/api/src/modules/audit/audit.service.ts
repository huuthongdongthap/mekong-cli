import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@linkedu/api/common/prisma/prisma.service'
import { AuditAction } from '@prisma/client'

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const {
      page = 1,
      limit = 20,
      actorId,
      action,
      entityType,
      entityId,
      fromDate,
      toDate,
    } = query

    const where: any = {}
    if (actorId) where.actorId = actorId
    if (action) where.action = action as AuditAction
    if (entityType) where.entityType = entityType
    if (entityId) where.entityId = entityId
    if (fromDate || toDate) {
      where.createdAt = {}
      if (fromDate) where.createdAt.gte = new Date(fromDate)
      if (toDate) where.createdAt.lte = new Date(toDate)
    }

    const [items, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { actor: { select: { id: true, firstName: true, lastName: true, email: true } } },
      }),
      this.prisma.auditLog.count({ where }),
    ])

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findOne(id: number) {
    const log = await this.prisma.auditLog.findUnique({
      where: { id },
      include: { actor: { select: { id: true, firstName: true, lastName: true, email: true } } },
    })
    if (!log) throw new NotFoundException('Audit log không tồn tại')
    return log
  }

  async findByEntity(entityType: string, entityId: string) {
    return this.prisma.auditLog.findMany({
      where: { entityType, entityId },
      orderBy: { createdAt: 'desc' },
      include: { actor: { select: { id: true, firstName: true, lastName: true, email: true } } },
    })
  }
}
