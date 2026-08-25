import { Test, TestingModule } from '@nestjs/testing'
import { AuditService } from './audit.service'
import { AuditController } from './audit.controller'
import { PrismaService } from '../../common/prisma/prisma.service'

describe('AuditModule', () => {
  let module: TestingModule

  const mockPrisma = {
    auditLog: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
    },
  }

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [AuditController],
      providers: [
        AuditService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile()
  })

  it('should compile the module', () => {
    expect(module).toBeDefined()
  })

  it('should provide AuditService', () => {
    const service = module.get<AuditService>(AuditService)
    expect(service).toBeDefined()
  })

  it('should have AuditController', () => {
    const controller = module.get<AuditController>(AuditController)
    expect(controller).toBeDefined()
  })

  describe('AuditService', () => {
    let service: AuditService

    beforeEach(() => {
      service = module.get<AuditService>(AuditService)
      jest.clearAllMocks()
    })

    it('findAll returns paginated results', async () => {
      mockPrisma.auditLog.findMany.mockResolvedValue([])
      mockPrisma.auditLog.count.mockResolvedValue(0)
      const result = await service.findAll({})
      expect(result.page).toBe(1)
      expect(result.limit).toBe(20)
    })

    it('findOne returns audit log by id', async () => {
      mockPrisma.auditLog.findUnique.mockResolvedValue({ id: 1, action: 'CREATE' } as any)
      const result = await service.findOne(1)
      expect(result.id).toBe(1)
    })

    it('findByEntity returns logs for entity', async () => {
      mockPrisma.auditLog.findMany.mockResolvedValue([])
      const result = await service.findByEntity('Learner', 'uuid-1')
      expect(Array.isArray(result)).toBe(true)
    })
  })
})
