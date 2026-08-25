import { Test, TestingModule } from '@nestjs/testing'
import { GeographicService } from './geographic.service'
import { GeographicController } from './geographic.controller'
import { PrismaService } from '../../common/prisma/prisma.service'
import { NotFoundException } from '@nestjs/common'

describe('GeographicModule', () => {
  let service: GeographicService
  let controller: GeographicController
  let prisma: jest.Mocked<PrismaService>

  const mockProvince = {
    code: '01',
    name: 'Hà Nội',
    nameEn: 'Ha Noi',
    region: 'north' as const,
    _count: { districts: 30 },
  }

  const mockDistrict = {
    provinceCode: '01',
    id: 1,
    name: 'Ba Đình',
    type: 'quan' as const,
    province: mockProvince,
  }

  const mockPrisma = {
    province: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    district: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  } as unknown as jest.Mocked<PrismaService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeographicController],
      providers: [
        GeographicService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile()

    service = module.get<GeographicService>(GeographicService)
    controller = module.get<GeographicController>(GeographicController)
    prisma = module.get(PrismaService) as jest.Mocked<PrismaService>
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
    expect(controller).toBeDefined()
  })

  describe('GeographicService', () => {
    describe('findAllProvinces', () => {
      it('returns all provinces without region filter', async () => {
        prisma.province.findMany.mockResolvedValue([mockProvince] as any)
        const result = await service.findAllProvinces()
        expect(prisma.province.findMany).toHaveBeenCalledWith({
          where: {},
          orderBy: { code: 'asc' },
          include: { _count: { select: { districts: true } } },
        })
        expect(result).toHaveLength(1)
      })

      it('filters provinces by region', async () => {
        prisma.province.findMany.mockResolvedValue([mockProvince] as any)
        await service.findAllProvinces('north')
        expect(prisma.province.findMany).toHaveBeenCalledWith({
          where: { region: 'north' },
          orderBy: { code: 'asc' },
          include: { _count: { select: { districts: true } } },
        })
      })
    })

    describe('findProvinceByCode', () => {
      it('returns province with districts', async () => {
        prisma.province.findUnique.mockResolvedValue({
          ...mockProvince,
          districts: [mockDistrict],
        } as any)
        const result = await service.findProvinceByCode('01')
        expect(result.code).toBe('01')
      })

      it('throws NotFoundException for invalid code', async () => {
        prisma.province.findUnique.mockResolvedValue(null)
        await expect(service.findProvinceByCode('99')).rejects.toThrow(NotFoundException)
      })
    })

    describe('findDistrictsByProvince', () => {
      it('returns districts for valid province', async () => {
        prisma.province.findUnique.mockResolvedValue(mockProvince as any)
        prisma.district.findMany.mockResolvedValue([mockDistrict] as any)
        const result = await service.findDistrictsByProvince('01')
        expect(result).toHaveLength(1)
      })

      it('throws NotFoundException for invalid province', async () => {
        prisma.province.findUnique.mockResolvedValue(null)
        await expect(service.findDistrictsByProvince('99')).rejects.toThrow(NotFoundException)
      })
    })

    describe('findDistrictById', () => {
      it('returns district with province relation', async () => {
        prisma.district.findUnique.mockResolvedValue(mockDistrict as any)
        const result = await service.findDistrictById('01', 1)
        expect(result.name).toBe('Ba Đình')
      })

      it('throws NotFoundException for invalid district', async () => {
        prisma.district.findUnique.mockResolvedValue(null)
        await expect(service.findDistrictById('01', 999)).rejects.toThrow(NotFoundException)
      })
    })
  })

  describe('GeographicController', () => {
    it('delegates findAllProvinces to service', async () => {
      prisma.province.findMany.mockResolvedValue([mockProvince] as any)
      const result = await controller.findAllProvinces({})
      expect(result).toHaveLength(1)
    })

    it('delegates findProvinceByCode to service', async () => {
      prisma.province.findUnique.mockResolvedValue({
        ...mockProvince,
        districts: [],
      } as any)
      const result = await controller.findProvinceByCode('01')
      expect(result.code).toBe('01')
    })

    it('delegates findDistrictsByProvince to service', async () => {
      prisma.province.findUnique.mockResolvedValue(mockProvince as any)
      prisma.district.findMany.mockResolvedValue([mockDistrict] as any)
      const result = await controller.findDistrictsByProvince('01')
      expect(result).toHaveLength(1)
    })

    it('delegates findDistrictById to service', async () => {
      prisma.district.findUnique.mockResolvedValue(mockDistrict as any)
      const result = await controller.findDistrictById({
        provinceCode: '01',
        districtId: 1,
      })
      expect(result.name).toBe('Ba Đình')
    })
  })
})
