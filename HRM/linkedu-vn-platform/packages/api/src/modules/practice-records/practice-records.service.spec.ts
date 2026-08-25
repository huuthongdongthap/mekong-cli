import { Test, TestingModule } from '@nestjs/testing'
import { PracticeRecordsService } from './practice-records.service'
import { PrismaService } from '../../common/prisma/prisma.service'
import { NotFoundException, BadRequestException } from '@nestjs/common'

describe('PracticeRecordsService', () => {
  let service: PracticeRecordsService

  const mockPrisma = {
    practiceRecord: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    enrollment: {
      findUnique: jest.fn(),
    },
    enterprise: {
      findUnique: jest.fn(),
    },
  } as unknown as jest.Mocked<PrismaService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PracticeRecordsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile()

    service = module.get<PracticeRecordsService>(PracticeRecordsService)
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('creates a practice record for valid enrollment', async () => {
      mockPrisma.enrollment.findUnique.mockResolvedValue({
        id: 'enr-1',
        learnerId: 'learner-1',
      } as any)
      mockPrisma.enterprise.findUnique.mockResolvedValue({ id: 1 } as any)
      mockPrisma.practiceRecord.create.mockResolvedValue({
        id: 'pr-1',
        enrollmentId: 'enr-1',
        hoursWorked: 8,
      } as any)

      const result = await service.create({
        enrollmentId: 'enr-1',
        learnerId: 'learner-1',
        enterpriseId: 1,
        practiceDate: '2026-08-14',
        activities: 'Frontend development',
        hoursWorked: 8,
        supervisorName: 'Nguyen Van A',
        skillsDemonstrated: ['React', 'TypeScript'],
        createdById: 'user-1',
      })

      expect(result.id).toBe('pr-1')
      expect(mockPrisma.practiceRecord.create).toHaveBeenCalled()
    })

    it('throws NotFoundException when enrollment missing', async () => {
      mockPrisma.enrollment.findUnique.mockResolvedValue(null)
      await expect(service.create({
        enrollmentId: 'missing',
        learnerId: 'learner-1',
        enterpriseId: 1,
        practiceDate: '2026-08-14',
        activities: 'Test',
        hoursWorked: 4,
        supervisorName: 'Test',
        skillsDemonstrated: [],
        createdById: 'user-1',
      })).rejects.toThrow(NotFoundException)
    })

    it('throws BadRequestException when learner mismatch', async () => {
      mockPrisma.enrollment.findUnique.mockResolvedValue({
        id: 'enr-1',
        learnerId: 'other-learner',
      } as any)
      await expect(service.create({
        enrollmentId: 'enr-1',
        learnerId: 'learner-1',
        enterpriseId: 1,
        practiceDate: '2026-08-14',
        activities: 'Test',
        hoursWorked: 4,
        supervisorName: 'Test',
        skillsDemonstrated: [],
        createdById: 'user-1',
      })).rejects.toThrow(BadRequestException)
    })
  })

  describe('findAll', () => {
    it('returns paginated results', async () => {
      mockPrisma.practiceRecord.findMany.mockResolvedValue([])
      mockPrisma.practiceRecord.count.mockResolvedValue(0)
      const result = await service.findAll({})
      expect(result.page).toBe(1)
      expect(result.limit).toBe(20)
    })
  })

  describe('findOne', () => {
    it('returns record by id', async () => {
      mockPrisma.practiceRecord.findUnique.mockResolvedValue({
        id: 'pr-1',
      } as any)
      const result = await service.findOne('pr-1')
      expect(result.id).toBe('pr-1')
    })

    it('throws NotFoundException when missing', async () => {
      mockPrisma.practiceRecord.findUnique.mockResolvedValue(null)
      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException)
    })
  })

  describe('remove', () => {
    it('deletes existing record', async () => {
      mockPrisma.practiceRecord.findUnique.mockResolvedValue({ id: 'pr-1' } as any)
      mockPrisma.practiceRecord.delete.mockResolvedValue({ id: 'pr-1' } as any)
      const result = await service.remove('pr-1')
      expect(result.id).toBe('pr-1')
    })

    it('throws NotFoundException when missing', async () => {
      mockPrisma.practiceRecord.findUnique.mockResolvedValue(null)
      await expect(service.remove('missing')).rejects.toThrow(NotFoundException)
    })
  })
})
