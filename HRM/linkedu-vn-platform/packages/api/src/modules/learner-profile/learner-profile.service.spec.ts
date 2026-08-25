import { Test, TestingModule } from '@nestjs/testing';
import { LearnerProfileService } from '@linkedu/api/modules/learner-profile/learner-profile.service';
import { PrismaService } from '@linkedu/api/common/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { ProfileVisibility } from '@prisma/client';

describe('LearnerProfileService', () => {
  let service: LearnerProfileService;
  let prisma: jest.Mocked<PrismaService>;
  const mockLearnerId = '550e8400-e29b-41d4-a716-446655440000';

  const makeProfile = (overrides?: any) => ({
    id: 'pf1',
    learnerId: mockLearnerId,
    headline: null,
    visibility: ProfileVisibility.private,
    workExperiences: [],
    educations: [],
    ...overrides,
  });

  const mockPrisma = {
    learnerProfile: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
    },
    workExperience: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
      createMany: jest.fn(),
    },
    education: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
      createMany: jest.fn(),
    },
  } as unknown as jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LearnerProfileService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get<LearnerProfileService>(LearnerProfileService);
    prisma = module.get(PrismaService) as jest.Mocked<PrismaService>;
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfile', () => {
    it('returns existing profile', async () => {
      const profile = makeProfile({ id: 'pf1' });
      prisma.learnerProfile.findUnique.mockResolvedValue(profile as any);
      const result = await service.getProfile(mockLearnerId);
      expect(prisma.learnerProfile.findUnique).toHaveBeenCalledWith({
        where: { learnerId: mockLearnerId },
        include: expect.any(Object),
      });
      expect(result).toEqual(profile);
    });

    it('auto-creates private profile when missing', async () => {
      prisma.learnerProfile.findUnique.mockResolvedValue(null);
      prisma.learnerProfile.create.mockResolvedValue(makeProfile() as any);
      const result = await service.getProfile(mockLearnerId);
      expect(prisma.learnerProfile.create).toHaveBeenCalledWith({
        data: { learnerId: mockLearnerId, visibility: ProfileVisibility.private },
        include: expect.any(Object),
      });
      expect(result.visibility).toBe(ProfileVisibility.private);
    });
  });

  describe('updateProfile', () => {
    it('uses upsert to update profile', async () => {
      const updated = makeProfile({ id: 'pf1', headline: 'Senior Dev' });
      prisma.learnerProfile.upsert.mockResolvedValue(updated as any);
      // updateProfile calls getProfile again after upsert (line 105)
      prisma.learnerProfile.findUnique.mockResolvedValue(updated as any);
      const result = await service.updateProfile(mockLearnerId, { headline: 'Senior Dev' });
      expect(prisma.learnerProfile.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { learnerId: mockLearnerId },
          create: { learnerId: mockLearnerId, headline: 'Senior Dev' },
          update: { headline: 'Senior Dev' },
        })
      );
      expect(result.headline).toBe('Senior Dev');
    });
  });

  describe('addWorkExperience', () => {
    it('creates work experience via getOrCreateProfile', async () => {
      prisma.learnerProfile.findUnique.mockResolvedValue(makeProfile({ id: 'pf1' }) as any);
      prisma.workExperience.create.mockResolvedValue({ id: 'we1', learnerId: mockLearnerId, learnerProfileId: 'pf1' } as any);
      const result = await service.addWorkExperience(mockLearnerId, { companyName: 'Acme' } as any);
      expect(prisma.workExperience.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ companyName: 'Acme', learnerProfileId: 'pf1', learnerId: mockLearnerId }),
      });
      expect(result.id).toBe('we1');
    });
  });

  describe('updateWorkExperience', () => {
    it('updates work experience after ownership check', async () => {
      prisma.learnerProfile.findUnique.mockResolvedValue(makeProfile({ id: 'pf1' }) as any);
      prisma.workExperience.findUnique.mockResolvedValue({ id: 'we1', learnerProfileId: 'pf1', learnerId: mockLearnerId } as any);
      prisma.workExperience.update.mockResolvedValue({ id: 'we1', companyName: 'NewCo' } as any);
      const result = await service.updateWorkExperience(mockLearnerId, 'we1', { companyName: 'NewCo' } as any);
      expect(prisma.workExperience.update).toHaveBeenCalledWith({
        where: { id: 'we1' },
        data: expect.objectContaining({ companyName: 'NewCo' }),
      });
      expect(result.id).toBe('we1');
    });

    it('throws NotFoundException when experience not found', async () => {
      prisma.learnerProfile.findUnique.mockResolvedValue(makeProfile({ id: 'pf1' }) as any);
      prisma.workExperience.findUnique.mockResolvedValue(null);
      await expect(service.updateWorkExperience(mockLearnerId, 'we1', {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteWorkExperience', () => {
    it('deletes work experience after ownership check', async () => {
      prisma.learnerProfile.findUnique.mockResolvedValue(makeProfile({ id: 'pf1' }) as any);
      prisma.workExperience.findUnique.mockResolvedValue({ id: 'we1', learnerProfileId: 'pf1', learnerId: mockLearnerId } as any);
      prisma.workExperience.delete.mockResolvedValue({} as any);
      await service.deleteWorkExperience(mockLearnerId, 'we1');
      expect(prisma.workExperience.delete).toHaveBeenCalledWith({ where: { id: 'we1' } });
    });

    it('throws NotFoundException when experience not found', async () => {
      prisma.learnerProfile.findUnique.mockResolvedValue(makeProfile({ id: 'pf1' }) as any);
      prisma.workExperience.findUnique.mockResolvedValue(null);
      await expect(service.deleteWorkExperience(mockLearnerId, 'we1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('addEducation', () => {
    it('creates education via getOrCreateProfile', async () => {
      prisma.learnerProfile.findUnique.mockResolvedValue(makeProfile({ id: 'pf1' }) as any);
      prisma.education.create.mockResolvedValue({ id: 'edu1', learnerId: mockLearnerId, learnerProfileId: 'pf1' } as any);
      const result = await service.addEducation(mockLearnerId, { institution: 'Uni' } as any);
      expect(prisma.education.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ institution: 'Uni', learnerProfileId: 'pf1', learnerId: mockLearnerId }),
      });
      expect(result.id).toBe('edu1');
    });
  });

  describe('updateEducation', () => {
    it('updates education after ownership check', async () => {
      prisma.learnerProfile.findUnique.mockResolvedValue(makeProfile({ id: 'pf1' }) as any);
      prisma.education.findUnique.mockResolvedValue({ id: 'edu1', learnerProfileId: 'pf1', learnerId: mockLearnerId } as any);
      prisma.education.update.mockResolvedValue({ id: 'edu1', degree: 'BSc' } as any);
      const result = await service.updateEducation(mockLearnerId, 'edu1', { degree: 'BSc' } as any);
      expect(prisma.education.update).toHaveBeenCalledWith({
        where: { id: 'edu1' },
        data: expect.objectContaining({ degree: 'BSc' }),
      });
      expect(result.id).toBe('edu1');
    });

    it('throws NotFoundException when education not found', async () => {
      prisma.learnerProfile.findUnique.mockResolvedValue(makeProfile({ id: 'pf1' }) as any);
      prisma.education.findUnique.mockResolvedValue(null);
      await expect(service.updateEducation(mockLearnerId, 'edu1', {} as any)).rejects.toThrow(NotFoundException);
    });
  });
});
