import { Injectable } from '@nestjs/common'
import { PrismaService } from '@linkedu/api/common/prisma/prisma.service'
import { PlacementStatus } from '@prisma/client'

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async schoolOverview(schoolId: string) {
    const [learnerCount, activePrograms, activeEnrollments, placements] = await Promise.all([
      this.prisma.learner.count({ where: { schoolId } }),
      this.prisma.program.count({ where: { schoolId, status: 'active' } }),
      this.prisma.enrollment.count({
        where: { program: { schoolId }, status: 'completed' }
      }),
      this.prisma.placement.count({ where: { learner: { schoolId } } }),
    ])

    const totalEnrollments = await this.prisma.enrollment.count({
      where: { program: { schoolId } }
    })

    return {
      totalLearners: learnerCount,
      activePrograms,
      activeEnrollments,
      placements,
      completionRate: totalEnrollments > 0 ? (placements / totalEnrollments) * 100 : 0,
    }
  }

  async enterpriseOverview(enterpriseId: number) {
    const [moas, placements, activePlacements] = await Promise.all([
      this.prisma.moa.count({ where: { enterpriseId, status: 'active' } }),
      this.prisma.placement.count({ where: { enterpriseId } }),
      this.prisma.placement.count({ where: { enterpriseId, status: PlacementStatus.in_progress } }),
    ])

    const salaryPlacements = await this.prisma.placement.findMany({
      where: { enterpriseId, salaryMaxVnd: { not: null } },
      select: { salaryMinVnd: true, salaryMaxVnd: true },
    })

    const avgSalaryVnd = salaryPlacements.length > 0
      ? Math.round(
          salaryPlacements.reduce(
            (sum, p) => sum + ((p.salaryMinVnd || 0) + (p.salaryMaxVnd || 0)) / 2,
            0
          ) / salaryPlacements.length
        )
      : 0

    return { moas, placements, activePlacements, avgSalaryVnd }
  }

  async systemOverview() {
    const [totalSchools, totalEnterprises, totalPrograms, totalLearners, totalPlacements] = await Promise.all([
      this.prisma.school.count({ where: { deletedAt: null } }),
      this.prisma.enterprise.count({ where: { deletedAt: null } }),
      this.prisma.program.count({ where: { deletedAt: null } }),
      this.prisma.learner.count({ where: { deletedAt: null } }),
      this.prisma.placement.count(),
    ])

    return { totalSchools, totalEnterprises, totalPrograms, totalLearners, totalPlacements }
  }
}