import { Test, TestingModule } from '@nestjs/testing'
import { ScholarshipModule } from './scholarship.module'
import { ScholarshipService } from './scholarship.service'
import { ScholarshipController } from './scholarship.controller'
import { PrismaService } from '@linkedu/api/common/prisma/prisma.service'

describe('ScholarshipModule', () => {
  let module: TestingModule

  const mockPrisma = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  }

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [ScholarshipModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should be defined', () => {
    expect(module).toBeDefined()
  })

  it('should provide ScholarshipService', () => {
    const service = module.get<ScholarshipService>(ScholarshipService)
    expect(service).toBeDefined()
  })

  it('should provide ScholarshipController', () => {
    const controller = module.get<ScholarshipController>(ScholarshipController)
    expect(controller).toBeDefined()
  })
})
