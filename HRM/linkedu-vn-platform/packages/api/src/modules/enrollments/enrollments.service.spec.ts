import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentsService } from './enrollments.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { EnrollmentStatus, EnrollmentType } from '@prisma/client';

describe('EnrollmentsService', () => {
  let service: EnrollmentsService;
  let _prisma: jest.Mocked<PrismaService>;

  const mockPrisma = {
    enrollment: {
      findFirst: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  } as unknown as jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get<EnrollmentsService>(EnrollmentsService);
    prisma = module.get(PrismaService) as jest.Mocked<PrismaService>;
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('enroll', () => {
    it('creates enrollment when none exists', async () => {
      mockPrisma.enrollment.findFirst.mockResolvedValue(null);
      mockPrisma.enrollment.count.mockResolvedValue(0);
      mockPrisma.enrollment.create.mockResolvedValue({
        id: 'enr-1',
        enrollmentNo: 'ENR/2026/001',
        status: EnrollmentStatus.pending,
      } as any);
      const result = await service.enroll({
        learnerId: 'learner-1',
        programId: 1,
        enrollmentType: EnrollmentType.self_apply,
      } as any);
      expect(result.enrollmentNo).toContain('ENR/2026/');
    });

    it('throws ConflictException on duplicate enrollment', async () => {
      mockPrisma.enrollment.findFirst.mockResolvedValue({ id: 'existing' } as any);
      await expect(service.enroll({
        learnerId: 'learner-1',
        programId: 1,
      } as any)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('returns paginated results', async () => {
      mockPrisma.enrollment.findMany.mockResolvedValue([]);
      mockPrisma.enrollment.count.mockResolvedValue(0);
      const result = await service.findAll({});
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });
  });

  describe('findOne', () => {
    it('returns enrollment by id', async () => {
      mockPrisma.enrollment.findFirst.mockResolvedValue({
        id: 'enr-1',
        status: EnrollmentStatus.pending,
      } as any);
      const result = await service.findOne('enr-1');
      expect(result.id).toBe('enr-1');
    });

    it('throws NotFoundException when missing', async () => {
      mockPrisma.enrollment.findFirst.mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('updates enrollment status', async () => {
      mockPrisma.enrollment.update.mockResolvedValue({
        id: 'enr-1',
        status: EnrollmentStatus.approved,
      } as any);
      const result = await service.updateStatus('enr-1', EnrollmentStatus.approved);
      expect(result.status).toBe(EnrollmentStatus.approved);
    });
  });
});
