import { Test, TestingModule } from '@nestjs/testing';
import { PlacementsService } from './placements.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { PlacementStatus } from '@prisma/client';

describe('PlacementsService', () => {
  let service: PlacementsService;
  let _prisma: jest.Mocked<PrismaService>;

  const mockPrisma = {
    placement: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    learner: { findUnique: jest.fn() },
    enterprise: { findUnique: jest.fn() },
    enrollment: { findUnique: jest.fn() },
  } as unknown as jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlacementsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get<PlacementsService>(PlacementsService);
    prisma = module.get(PrismaService) as jest.Mocked<PrismaService>;
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('creates placement with default status', async () => {
      mockPrisma.placement.create.mockResolvedValue({
        id: 1,
        status: PlacementStatus.in_progress,
      } as any);
      const result = await service.create({
        learnerId: 'learner-1',
        programId: 1,
        enterpriseId: 1,
        positionApplied: 'Backend Intern',
      } as any);
      expect(result.status).toBe(PlacementStatus.in_progress);
    });
  });

  describe('findAll', () => {
    it('returns paginated list', async () => {
      mockPrisma.placement.findMany.mockResolvedValue([]);
      mockPrisma.placement.count.mockResolvedValue(0);
      const result = await service.findAll({});
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });

    it('filters by enterpriseId/learnerId', async () => {
      mockPrisma.placement.findMany.mockResolvedValue([]);
      mockPrisma.placement.count.mockResolvedValue(0);
      await service.findAll({ enterpriseId: 1, learnerId: 'l1' });
      expect(mockPrisma.placement.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ enterpriseId: 1, learnerId: 'l1' }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('returns placement by id', async () => {
      mockPrisma.placement.findFirst.mockResolvedValue({ id: 1 } as any);
      const result = await service.findOne('1');
      expect(result.id).toBe(1);
    });

    it('throws NotFoundException when missing', async () => {
      mockPrisma.placement.findFirst.mockResolvedValue(null);
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('updates placement fields', async () => {
      mockPrisma.placement.update.mockResolvedValue({
        id: 1,
        status: PlacementStatus.completed,
      } as any);
      const result = await service.update('1', {
        status: PlacementStatus.completed,
      } as any);
      expect(result.status).toBe(PlacementStatus.completed);
    });
  });

  describe('updateStatus', () => {
    it('updates status endpoint', async () => {
      mockPrisma.placement.update.mockResolvedValue({
        id: 1,
        status: PlacementStatus.ongoing,
      } as any);
      const result = await service.updateStatus('1', PlacementStatus.ongoing);
      expect(result.status).toBe(PlacementStatus.ongoing);
    });
  });
});
