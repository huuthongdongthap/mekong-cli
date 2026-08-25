import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationsService } from './evaluations.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('EvaluationsService', () => {
  let service: EvaluationsService;
  let _prisma: jest.Mocked<PrismaService>;

  const mockPrisma = {
    evaluation: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    enrollment: { findUnique: jest.fn() },
    learner: { findUnique: jest.fn() },
    user: { findUnique: jest.fn() },
  } as unknown as jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EvaluationsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get<EvaluationsService>(EvaluationsService);
    prisma = module.get(PrismaService) as jest.Mocked<PrismaService>;
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('creates evaluation with valid references', async () => {
      mockPrisma.enrollment.findUnique.mockResolvedValue({ id: 'enr-1' } as any);
      mockPrisma.learner.findUnique.mockResolvedValue({ id: 'l-1' } as any);
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u-1' } as any);
      mockPrisma.evaluation.create.mockResolvedValue({
        id: 1,
        evaluationType: 'mid_term',
        totalScore: 85,
        maxScore: 100,
        percentage: 85,
      } as any);

      const result = await service.create({
        enrollmentId: 'enr-1',
        learnerId: 'l-1',
        evaluatorId: 'u-1',
        evaluationType: 'mid_term',
        totalScore: 85,
        maxScore: 100,
      } as any);

      expect(result.evaluationType).toBe('mid_term');
      expect(result.percentage).toBe(85);
    });

    it('throws BadRequestException when enrollment not found', async () => {
      mockPrisma.enrollment.findUnique.mockResolvedValue(null);
      mockPrisma.learner.findUnique.mockResolvedValue({ id: 'l-1' } as any);
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u-1' } as any);

      await expect(
        service.create({
          enrollmentId: 'invalid',
          learnerId: 'l-1',
          evaluatorId: 'u-1',
          evaluationType: 'mid_term',
        } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when learner not found', async () => {
      mockPrisma.enrollment.findUnique.mockResolvedValue({ id: 'enr-1' } as any);
      mockPrisma.learner.findUnique.mockResolvedValue(null);
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u-1' } as any);

      await expect(
        service.create({
          enrollmentId: 'enr-1',
          learnerId: 'invalid',
          evaluatorId: 'u-1',
          evaluationType: 'final',
        } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('auto-calculates percentage from totalScore/maxScore', async () => {
      mockPrisma.enrollment.findUnique.mockResolvedValue({ id: 'enr-1' } as any);
      mockPrisma.learner.findUnique.mockResolvedValue({ id: 'l-1' } as any);
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'u-1' } as any);
      mockPrisma.evaluation.create.mockResolvedValue({ id: 1 } as any);

      await service.create({
        enrollmentId: 'enr-1',
        learnerId: 'l-1',
        evaluatorId: 'u-1',
        evaluationType: 'final',
        totalScore: 73,
        maxScore: 100,
      } as any);

      const createCall = mockPrisma.evaluation.create.mock.calls[0][0].data;
      expect(createCall.percentage).toBe(73);
    });
  });

  describe('findAll', () => {
    it('returns paginated results', async () => {
      mockPrisma.evaluation.findMany.mockResolvedValue([]);
      mockPrisma.evaluation.count.mockResolvedValue(0);
      const result = await service.findAll({});
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(result.totalPages).toBe(0);
    });

    it('filters by evaluationType and learnerId', async () => {
      mockPrisma.evaluation.findMany.mockResolvedValue([]);
      mockPrisma.evaluation.count.mockResolvedValue(0);
      await service.findAll({ evaluationType: 'mid_term', learnerId: 'l-1' });
      expect(mockPrisma.evaluation.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ evaluationType: 'mid_term', learnerId: 'l-1' }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('returns evaluation by id', async () => {
      mockPrisma.evaluation.findFirst.mockResolvedValue({ id: 1, evaluationType: 'final' } as any);
      const result = await service.findOne('1');
      expect(result.id).toBe(1);
    });

    it('throws NotFoundException when missing', async () => {
      mockPrisma.evaluation.findFirst.mockResolvedValue(null);
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('updates evaluation fields', async () => {
      mockPrisma.evaluation.findFirst.mockResolvedValue({ id: 1 } as any);
      mockPrisma.evaluation.update.mockResolvedValue({ id: 1, totalScore: 90 } as any);
      const result = await service.update('1', { totalScore: 90 } as any);
      expect(result.totalScore).toBe(90);
    });

    it('throws NotFoundException when evaluation not found', async () => {
      mockPrisma.evaluation.findFirst.mockResolvedValue(null);
      await expect(service.update('999', { totalScore: 90 } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deletes evaluation', async () => {
      mockPrisma.evaluation.findFirst.mockResolvedValue({ id: 1 } as any);
      mockPrisma.evaluation.delete.mockResolvedValue({ id: 1 } as any);
      const result = await service.remove('1');
      expect(result.deleted).toBe(true);
    });

    it('throws NotFoundException when evaluation not found', async () => {
      mockPrisma.evaluation.findFirst.mockResolvedValue(null);
      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEnrollment', () => {
    it('returns evaluations for enrollment', async () => {
      mockPrisma.evaluation.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }] as any);
      const result = await service.findByEnrollment('enr-1');
      expect(result).toHaveLength(2);
    });
  });

  describe('findByLearner', () => {
    it('returns evaluations for learner', async () => {
      mockPrisma.evaluation.findMany.mockResolvedValue([{ id: 1 }] as any);
      const result = await service.findByLearner('l-1');
      expect(result).toHaveLength(1);
    });
  });
});
