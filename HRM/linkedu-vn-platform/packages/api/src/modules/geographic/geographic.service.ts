import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@linkedu/api/common/prisma/prisma.service'

@Injectable()
export class GeographicService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllProvinces(region?: string) {
    const where = region ? { region: region as 'north' | 'central' | 'south' } : {}
    return this.prisma.province.findMany({
      where,
      orderBy: { code: 'asc' },
      include: { _count: { select: { districts: true } } },
    })
  }

  async findProvinceByCode(code: string) {
    const province = await this.prisma.province.findUnique({
      where: { code },
      include: { districts: { orderBy: { id: 'asc' } } },
    })
    if (!province) {
      throw new NotFoundException(`Tỉnh/thành phố với mã "${code}" không tồn tại`)
    }
    return province
  }

  async findDistrictsByProvince(provinceCode: string) {
    const province = await this.prisma.province.findUnique({
      where: { code: provinceCode },
    })
    if (!province) {
      throw new NotFoundException(`Tỉnh/thành phố với mã "${provinceCode}" không tồn tại`)
    }
    return this.prisma.district.findMany({
      where: { provinceCode },
      orderBy: { id: 'asc' },
    })
  }

  async findDistrictById(provinceCode: string, districtId: number) {
    const district = await this.prisma.district.findUnique({
      where: { provinceCode_id: { provinceCode, id: districtId } },
      include: { province: true },
    })
    if (!district) {
      throw new NotFoundException(
        `Quận/huyện với id ${districtId} trong tỉnh "${provinceCode}" không tồn tại`,
      )
    }
    return district
  }
}
