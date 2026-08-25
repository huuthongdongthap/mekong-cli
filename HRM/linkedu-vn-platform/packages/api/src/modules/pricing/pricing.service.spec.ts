import { Test, TestingModule } from '@nestjs/testing';
import { PricingService } from './pricing.service';
import { PrismaService } from '@linkedu/api/common/prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Segment, PricingTierLevel } from '@prisma/client';

describe('PricingService', () => {
  let service: PricingService;
  let prisma: jest.Mocked<PrismaService>;

  const mockTier = {
    id: 'tier-1',
    name: 'School Starter',
    segment: Segment.SCHOOL,
    tierLevel: PricingTierLevel.STARTER,
    basePriceVnd: 5_000_000,
    setupFeeVnd: 15_000_000,
    isActive: true,
    features: { moaManagement: true },
    limits: { programs: 5 },
  };

  const mockPrisma = {
    pricingTier: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
    pricingRule: { create: jest.fn(), findMany: jest.fn() },
    subscription: { create: jest.fn(), count: jest.fn(), findMany: jest.fn(), update: jest.fn() },
    billingSchedule: { create: jest.fn(), findMany: jest.fn(), update: jest.fn() },
    priceQuote: { create: jest.fn() },
    paymentGateway: { create: jest.fn(), findMany: jest.fn() },
    paymentTransaction: { create: jest.fn(), update: jest.fn() },
    legalEntity: { create: jest.fn(), findMany: jest.fn(), findFirst: jest.fn(), updateMany: jest.fn() },
    vATClassification: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn() },
  } as unknown as jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PricingService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PricingService>(PricingService);
    prisma = module.get(PrismaService) as jest.Mocked<PrismaService>;
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTier', () => {
    it('creates a pricing tier with defaults', async () => {
      (prisma.pricingTier as any).create.mockResolvedValue(mockTier);
      const result = await service.createTier({
        name: 'School Starter',
        segment: Segment.SCHOOL,
        tierLevel: PricingTierLevel.STARTER,
        basePriceVnd: 5_000_000,
      });
      expect((prisma.pricingTier as any).create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'School Starter',
          features: {},
          limits: {},
        }),
      });
      expect(result.name).toBe('School Starter');
    });
  });

  describe('getTiers', () => {
    it('returns active tiers for a segment', async () => {
      (prisma.pricingTier as any).findMany.mockResolvedValue([mockTier]);
      const result = await service.getTiers(Segment.SCHOOL);
      expect(result).toHaveLength(1);
      expect((prisma.pricingTier as any).findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { segment: Segment.SCHOOL, isActive: true },
        }),
      );
    });
  });

  describe('getTierById', () => {
    it('returns tier by id', async () => {
      (prisma.pricingTier as any).findUnique.mockResolvedValue(mockTier);
      const result = await service.getTierById('tier-1');
      expect(result.id).toBe('tier-1');
    });

    it('throws NotFoundException when tier not found', async () => {
      (prisma.pricingTier as any).findUnique.mockResolvedValue(null);
      await expect(service.getTierById('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTier', () => {
    it('updates tier fields', async () => {
      const updated = { ...mockTier, name: 'Updated Tier' };
      (prisma.pricingTier as any).update.mockResolvedValue(updated);
      const result = await service.updateTier('tier-1', { name: 'Updated Tier' });
      expect(result.name).toBe('Updated Tier');
    });
  });

  describe('deleteTier', () => {
    it('deletes tier when no subscriptions exist', async () => {
      (prisma.subscription as any).count.mockResolvedValue(0);
      (prisma.pricingTier as any).delete.mockResolvedValue(mockTier);
      await service.deleteTier('tier-1');
      expect((prisma.pricingTier as any).delete).toHaveBeenCalledWith({ where: { id: 'tier-1' } });
    });

    it('throws BadRequestException when subscriptions exist', async () => {
      (prisma.subscription as any).count.mockResolvedValue(3);
      await expect(service.deleteTier('tier-1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('createRule', () => {
    it('creates a pricing rule', async () => {
      const rule = { id: 'rule-1', tierId: 'tier-1', ruleType: 'VOLUME_DISCOUNT', config: {} };
      (prisma.pricingRule as any).create.mockResolvedValue(rule);
      const result = await service.createRule({
        tierId: 'tier-1',
        ruleType: 'VOLUME_DISCOUNT',
        config: { minVolume: 10, discountPct: 10 },
      });
      expect(result.id).toBe('rule-1');
    });
  });

  describe('calculateQuote', () => {
    it('calculates quote with no discount rules', async () => {
      (prisma.pricingTier as any).findUnique.mockResolvedValue(mockTier);
      (prisma.pricingRule as any).findMany.mockResolvedValue([]);
      const result = await service.calculateQuote({
        entityId: 'school-1',
        entityType: Segment.SCHOOL,
        tierId: 'tier-1',
      });
      expect(result.finalPriceVnd).toBe(5_000_000);
      expect(result.tierName).toBe('School Starter');
    });

    it('applies volume discount', async () => {
      const rule = {
        id: 'rule-1',
        ruleType: 'VOLUME_DISCOUNT',
        config: { minVolume: 5, discountPct: 10 },
        startDate: null,
        endDate: null,
      };
      (prisma.pricingTier as any).findUnique.mockResolvedValue(mockTier);
      (prisma.pricingRule as any).findMany.mockResolvedValue([rule]);
      const result = await service.calculateQuote({
        entityId: 'school-1',
        entityType: Segment.SCHOOL,
        tierId: 'tier-1',
        volume: 10,
      });
      expect(result.finalPriceVnd).toBe(4_500_000);
    });

  });
});
