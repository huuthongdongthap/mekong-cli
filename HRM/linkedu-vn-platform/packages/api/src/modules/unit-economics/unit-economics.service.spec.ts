import { Test, TestingModule } from '@nestjs/testing';
import { UnitEconomicsService } from './unit-economics.service';
import { PrismaService } from '@linkedu/api/common/prisma/prisma.service';

describe('UnitEconomicsService', () => {
  let service: UnitEconomicsService;

  const mockPrisma = {
    school: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    enterprise: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    invoice: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      aggregate: jest.fn(),
    },
    unitEconomicsDaily: {
      create: jest.fn(),
    },
  } as unknown as jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnitEconomicsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UnitEconomicsService>(UnitEconomicsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateDailyCACLTV', () => {
    it('returns CAC/LTV data for schools and enterprises', async () => {
      // Mock counts for new customers
      // Mock counts for new customers
      (mockPrisma.school as any).count.mockResolvedValue(5);
      (mockPrisma.enterprise as any).count.mockResolvedValue(3);

      // Mock invoices for LTV calculation
      (mockPrisma.invoice as any).findMany.mockResolvedValue([]);

      // Mock customer counts for churn
      (mockPrisma.school as any).count
        .mockResolvedValueOnce(5)  // new schools
        .mockResolvedValueOnce(100) // schools 3mo ago
        .mockResolvedValueOnce(95); // schools 6mo ago

      (mockPrisma.enterprise as any).count
        .mockResolvedValueOnce(3)   // new enterprises
        .mockResolvedValueOnce(50)  // enterprises 3mo ago
        .mockResolvedValueOnce(48); // enterprises 6mo ago

      // Mock NRR - school/enterprise findMany
      (mockPrisma.school as any).findMany.mockResolvedValue([]);
      (mockPrisma.enterprise as any).findMany.mockResolvedValue([]);

      // Mock invoice aggregates
      (mockPrisma.invoice as any).aggregate.mockResolvedValue({ _sum: { totalVnd: 0 } });

      const result = await service.calculateDailyCACLTV();

      expect(result.schools).toBeDefined();
      expect(result.enterprises).toBeDefined();
      expect(result.schools).toHaveProperty('cac');
      expect(result.schools).toHaveProperty('ltv');
      expect(result.schools).toHaveProperty('paybackMonths');
      expect(result.schools).toHaveProperty('nrr');
      expect(result.schools).toHaveProperty('grossMargin');
      expect(result.schools).toHaveProperty('ltvCacRatio');
    });

    it('returns zero CAC when no new customers', async () => {
      (mockPrisma.school as any).count.mockResolvedValue(0);
      (mockPrisma.enterprise as any).count.mockResolvedValue(0);
      (mockPrisma.invoice as any).findMany.mockResolvedValue([]);
      (mockPrisma.school as any).findMany.mockResolvedValue([]);
      (mockPrisma.enterprise as any).findMany.mockResolvedValue([]);
      (mockPrisma.invoice as any).aggregate.mockResolvedValue({ _sum: { totalVnd: 0 } });

      const result = await service.calculateDailyCACLTV();

      expect(result.schools.cac).toBe(0);
      expect(result.enterprises.cac).toBe(0);
      expect(result.schools.ltvCacRatio).toBe(0);
    });
  });

  describe('getCohortAnalysis', () => {
    it('returns cohort data for specified months', async () => {
      (mockPrisma.school as any).findMany.mockResolvedValue([]);
      (mockPrisma.enterprise as any).findMany.mockResolvedValue([]);
      (mockPrisma.invoice as any).findFirst.mockResolvedValue(null);
      (mockPrisma.invoice as any).aggregate.mockResolvedValue({ _sum: { totalVnd: 0 } });

      const result = await service.getCohortAnalysis(3);

      // 3 months x 2 segments = 6 cohort entries
      expect(result).toHaveLength(6);
      expect(result[0]).toHaveProperty('cohortMonth');
      expect(result[0]).toHaveProperty('segment');
      expect(result[0]).toHaveProperty('totalCustomers');
      expect(result[0]).toHaveProperty('retainedCustomers');
      expect(result[0]).toHaveProperty('revenue');
    });

    it('defaults to 12 months', async () => {
      (mockPrisma.school as any).findMany.mockResolvedValue([]);
      (mockPrisma.enterprise as any).findMany.mockResolvedValue([]);
      (mockPrisma.invoice as any).findFirst.mockResolvedValue(null);
      (mockPrisma.invoice as any).aggregate.mockResolvedValue({ _sum: { totalVnd: 0 } });

      const result = await service.getCohortAnalysis();

      // 12 months x 2 segments = 24 cohort entries
      expect(result).toHaveLength(24);
    });
  });

  describe('getDashboardMetrics', () => {
    it('returns full dashboard with research targets', async () => {
      // Mock for calculateDailyCACLTV
      (mockPrisma.school as any).count.mockResolvedValue(5);
      (mockPrisma.enterprise as any).count.mockResolvedValue(3);
      (mockPrisma.invoice as any).findMany.mockResolvedValue([]);
      (mockPrisma.school as any).findMany.mockResolvedValue([]);
      (mockPrisma.enterprise as any).findMany.mockResolvedValue([]);
      (mockPrisma.invoice as any).aggregate.mockResolvedValue({ _sum: { totalVnd: 0 } });

      const result = await service.getDashboardMetrics();

      expect(result.unitEconomics).toBeDefined();
      expect(result.unitEconomics.schools).toBeDefined();
      expect(result.unitEconomics.enterprises).toBeDefined();
      expect(result.cohorts).toBeDefined();
      expect(result.researchTargets).toEqual({
        schoolPaybackMonths: 4.2,
        enterprisePaybackMonths: 9.5,
        schoolLTV: 500_000_000,
        enterpriseLTV: 300_000_000,
        schoolCAC: 50_000_000,
        enterpriseCAC: 30_000_000,
      });
      expect(typeof result.expansionRevenuePct).toBe('number');
    });
  });

  describe('runDailyCalculation', () => {
    it('calculates and stores daily metrics', async () => {
      (mockPrisma.school as any).count.mockResolvedValue(5);
      (mockPrisma.enterprise as any).count.mockResolvedValue(3);
      (mockPrisma.invoice as any).findMany.mockResolvedValue([]);
      (mockPrisma.school as any).findMany.mockResolvedValue([]);
      (mockPrisma.enterprise as any).findMany.mockResolvedValue([]);
      (mockPrisma.invoice as any).aggregate.mockResolvedValue({ _sum: { totalVnd: 0 } });
      (mockPrisma.unitEconomicsDaily as any).create.mockResolvedValue({});

      const result = await service.runDailyCalculation();

      expect(result).toHaveProperty('schools');
      expect(result).toHaveProperty('enterprises');
      expect((mockPrisma.unitEconomicsDaily as any).create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          schoolCac: expect.any(Number),
          schoolLtv: expect.any(Number),
          enterpriseCac: expect.any(Number),
          enterpriseLtv: expect.any(Number),
        }),
      });
    });
  });
});
