import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { Prisma, PrismaClient, Segment, PricingTierLevel, RuleType, QuoteStatus, SubStatus, BillingCycle, GatewayType, TransactionStatus, EntityType } from '@prisma/client'
import { PrismaService } from '@linkedu/api/common/prisma/prisma.service'

@Injectable()
export class PricingService {
  private prisma: PrismaClient

  constructor(private readonly prismaService: PrismaService) {
    this.prisma = this.prismaService
  }

  // =============================================================================
  // Pricing Tier Management
  // =============================================================================

  async createTier(data: {
    name: string
    segment: Segment
    tierLevel: PricingTierLevel
    basePriceVnd: number
    setupFeeVnd?: number
    features?: Record<string, boolean>
    limits?: Record<string, number>
  }) {
    return this.prisma.pricingTier.create({
      data: {
        ...data,
        features: data.features || {},
        limits: data.limits || {},
      },
    })
  }

  async getTiers(segment?: Segment, isActive = true) {
    return this.prisma.pricingTier.findMany({
      where: {
        segment,
        isActive,
      },
      include: {
        pricingRules: { where: { isActive: true } },
        _count: { select: { subscriptions: true } },
      },
      orderBy: [{ segment: 'asc' }, { tierLevel: 'asc' }],
    })
  }

  async getTierById(id: string) {
    const tier = await this.prisma.pricingTier.findUnique({
      where: { id },
      include: {
        pricingRules: { where: { isActive: true } },
        subscriptions: { where: { status: 'ACTIVE' } },
      },
    })
    if (!tier) throw new NotFoundException(`Pricing tier ${id} not found`)
    return tier
  }

  async updateTier(id: string, data: Partial<{
    name: string
    tierLevel: PricingTierLevel
    basePriceVnd: number
    setupFeeVnd: number
    features: Record<string, boolean>
    limits: Record<string, number>
    isActive: boolean
  }>) {
    return this.prisma.pricingTier.update({
      where: { id },
      data,
    })
  }

  async deleteTier(id: string) {
    const subscriptions = await this.prisma.subscription.count({ where: { tierId: id } })
    if (subscriptions > 0) {
      throw new BadRequestException('Cannot delete tier with active subscriptions')
    }
    return this.prisma.pricingTier.delete({ where: { id } })
  }

  // =============================================================================
  // Pricing Rules (Volume discounts, contract terms, promos)
  // =============================================================================

  async createRule(data: {
    tierId: string
    ruleType: RuleType
    config: Prisma.InputJsonValue
    startDate?: Date
    endDate?: Date
  }) {
    return this.prisma.pricingRule.create({ data })
  }

  async getRulesForTier(tierId: string) {
    return this.prisma.pricingRule.findMany({
      where: { tierId, isActive: true },
      orderBy: { ruleType: 'asc' },
    })
  }

  // =============================================================================
  // Price Quote Engine
  // =============================================================================

  async calculateQuote(input: {
    entityId: string
    entityType: Segment
    tierId: string
    volume?: number // For volume discounts
    contractMonths?: number // For contract term discounts
    promoCode?: string
  }) {
    const tier = await this.getTierById(input.tierId)
    const rules = await this.getRulesForTier(input.tierId)

    let finalPrice = tier.basePriceVnd
    const appliedRules: Prisma.JsonObject = {}

    for (const rule of rules) {
      const config = rule.config as Record<string, unknown>
      const now = new Date()

      if (rule.startDate && rule.startDate > now) continue
      if (rule.endDate && rule.endDate < now) continue

      switch (rule.ruleType) {
        case 'VOLUME_DISCOUNT': {
          const minVolume = config.minVolume as number
          const discountPct = config.discountPct as number
          if (input.volume && input.volume >= minVolume) {
            const discount = Math.round(finalPrice * (discountPct / 100))
            finalPrice -= discount
            appliedRules[rule.id] = { type: 'VOLUME_DISCOUNT', discount, minVolume, volume: input.volume }
          }
          break
        }
        case 'CONTRACT_TERM': {
          const minMonths = config.minMonths as number
          const discountPct = config.discountPct as number
          if (input.contractMonths && input.contractMonths >= minMonths) {
            const discount = Math.round(finalPrice * (discountPct / 100))
            finalPrice -= discount
            appliedRules[rule.id] = { type: 'CONTRACT_TERM', discount, minMonths, months: input.contractMonths }
          }
          break
        }
        case 'PROMO': {
          const code = config.code as string
          const discountPct = config.discountPct as number
          if (input.promoCode && input.promoCode === code) {
            const discount = Math.round(finalPrice * (discountPct / 100))
            finalPrice -= discount
            appliedRules[rule.id] = { type: 'PROMO', discount, code }
          }
          break
        }
        case 'SEASONAL': {
          const discountPct = config.discountPct as number
          const discount = Math.round(finalPrice * (discountPct / 100))
          finalPrice -= discount
          appliedRules[rule.id] = { type: 'SEASONAL', discount }
          break
        }
      }
    }

    // Ensure price doesn't go below 0
    finalPrice = Math.max(0, finalPrice)

    return {
      tierId: tier.id,
      tierName: tier.name,
      basePriceVnd: tier.basePriceVnd,
      finalPriceVnd: finalPrice,
      appliedRules,
      currency: 'VND',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    }
  }

  async createQuote(data: {
    entityId: string
    entityType: Segment
    tierId: string
    volume?: number
    contractMonths?: number
    promoCode?: string
    validUntil?: Date
  }) {
    const calculation = await this.calculateQuote(data)

    return this.prisma.priceQuote.create({
      data: {
        entityId: data.entityId,
        entityType: data.entityType,
        tierId: data.tierId,
        appliedRules: calculation.appliedRules,
        finalPriceVnd: calculation.finalPriceVnd,
        validUntil: data.validUntil || calculation.validUntil,
        status: 'DRAFT',
      },
    })
  }

  // =============================================================================
  // Subscription Management
  // =============================================================================

  async createSubscription(data: {
    entityId: string
    entityType: Segment
    tierId: string
    billingCycle: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL'
    trialEnd?: Date
  }) {
    const tier = await this.getTierById(data.tierId)
    const now = new Date()

    let periodEnd: Date
    switch (data.billingCycle) {
      case 'MONTHLY':
        periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())
        break
      case 'QUARTERLY':
        periodEnd = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate())
        break
      case 'ANNUAL':
        periodEnd = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
        break
      default:
        periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())
    }

    const subscription = await this.prisma.subscription.create({
      data: {
        entityId: data.entityId,
        entityType: data.entityType,
        tierId: data.tierId,
        billingCycle: data.billingCycle,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        trialEnd: data.trialEnd,
      },
      include: { tier: true },
    })

    // Create first billing schedule
    await this.createBillingSchedule({
      subscriptionId: subscription.id,
      amountVnd: tier.basePriceVnd,
      scheduledAt: now,
    })

    return subscription
  }

  async getSubscriptions(entityId: string, entityType: Segment) {
    return this.prisma.subscription.findMany({
      where: { entityId, entityType },
      include: {
        tier: { include: { pricingRules: true } },
        billingSchedules: { orderBy: { scheduledAt: 'asc' }, take: 10 },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd = true) {
    return this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        cancelAtPeriodEnd,
        cancelledAt: cancelAtPeriodEnd ? null : new Date(),
        status: cancelAtPeriodEnd ? 'ACTIVE' : 'CANCELLED',
      },
    })
  }

  // =============================================================================
  // Billing Schedules
  // =============================================================================

  async createBillingSchedule(data: {
    subscriptionId: string
    amountVnd: number
    scheduledAt: Date
    invoiceId?: number
  }) {
    return this.prisma.billingSchedule.create({ data })
  }

  async getPendingBillingSchedules(before: Date = new Date()) {
    return this.prisma.billingSchedule.findMany({
      where: {
        status: 'PENDING',
        scheduledAt: { lte: before },
      },
      include: {
        subscription: {
          include: { tier: true },
        },
      },
    })
  }

  async markBillingScheduleGenerated(scheduleId: string, invoiceId: number) {
    return this.prisma.billingSchedule.update({
      where: { id: scheduleId },
      data: { status: 'GENERATED', generatedAt: new Date(), invoiceId },
    })
  }

  async markBillingSchedulePaid(scheduleId: string) {
    return this.prisma.billingSchedule.update({
      where: { id: scheduleId },
      data: { status: 'PAID' },
    })
  }

  // =============================================================================
  // Payment Gateways
  // =============================================================================

  async createGateway(data: {
    name: string
    type: GatewayType
    config: Prisma.InputJsonValue
    isTestMode?: boolean
  }) {
    return this.prisma.paymentGateway.create({ data })
  }

  async getGateways(isActive = true) {
    return this.prisma.paymentGateway.findMany({ where: { isActive } })
  }

  async recordPayment(data: {
    gatewayId: string
    invoiceId?: number
    amountVnd: number
    gatewayRef?: string
    responseData?: Prisma.InputJsonValue
    status: TransactionStatus
    errorMessage?: string
  }) {
    return this.prisma.paymentTransaction.create({ data })
  }

  async updatePaymentStatus(transactionId: string, status: 'SUCCESS' | 'FAILED' | 'REFUNDED') {
    return this.prisma.paymentTransaction.update({
      where: { id: transactionId },
      data: {
        status,
        completedAt: new Date(),
      },
    })
  }

  // =============================================================================
  // Legal Entity & VAT
  // =============================================================================

  async createLegalEntity(data: {
    name: string
    type: 'EDCO' | 'TECHCO'
    taxCode: string
    vatRate: number
    address: string
    isDefault?: boolean
  }) {
    // Ensure only one default per type
    if (data.isDefault) {
      await this.prisma.legalEntity.updateMany({
        where: { type: data.type, isDefault: true },
        data: { isDefault: false },
      })
    }
    return this.prisma.legalEntity.create({ data })
  }

  async getLegalEntities() {
    return this.prisma.legalEntity.findMany({ orderBy: { type: 'asc' } })
  }

  async getDefaultEntity(type: 'EDCO' | 'TECHCO') {
    return this.prisma.legalEntity.findFirst({ where: { type, isDefault: true } })
  }

  async createVATClassification(data: {
    productCode: string
    description: string
    vatRate: number
    legalEntityId: string
  }) {
    return this.prisma.vATClassification.create({ data })
  }

  async getVATClassifications(legalEntityId?: string) {
    return this.prisma.vATClassification.findMany({
      where: legalEntityId ? { legalEntityId } : { isActive: true },
    })
  }

  // =============================================================================
  // Seed Default Vietnam Pricing Tiers
  // =============================================================================

  async seedVietnamDefaults() {
    const defaults = [
      // School tiers
      {
        name: 'School Starter',
        segment: 'SCHOOL' as Segment,
        tierLevel: 'STARTER' as PricingTierLevel,
        basePriceVnd: 5_000_000, // 5M VND/month
        setupFeeVnd: 15_000_000, // 15M VND
        features: { moaManagement: true, programListing: true, basicAnalytics: true, enrollmentPortal: true },
        limits: { programs: 5, learners: 200, admins: 3 },
      },
      {
        name: 'School Growth',
        segment: 'SCHOOL' as Segment,
        tierLevel: 'GROWTH' as PricingTierLevel,
        basePriceVnd: 10_000_000, // 10M VND/month
        setupFeeVnd: 25_000_000, // 25M VND
        features: { moaManagement: true, programListing: true, advancedAnalytics: true, enrollmentPortal: true, referralTracking: true },
        limits: { programs: 15, learners: 1000, admins: 10 },
      },
      {
        name: 'School Enterprise',
        segment: 'SCHOOL' as Segment,
        tierLevel: 'ENTERPRISE' as PricingTierLevel,
        basePriceVnd: 20_000_000, // 20M VND/month
        setupFeeVnd: 50_000_000, // 50M VND
        features: { moaManagement: true, programListing: true, advancedAnalytics: true, enrollmentPortal: true, referralTracking: true, customBranding: true, apiAccess: true, dedicatedSupport: true },
        limits: { programs: -1, learners: -1, admins: -1 },
      },
      // Enterprise tiers
      {
        name: 'Enterprise Starter',
        segment: 'ENTERPRISE' as Segment,
        tierLevel: 'STARTER' as PricingTierLevel,
        basePriceVnd: 3_000_000, // 3M VND/month
        setupFeeVnd: 10_000_000, // 10M VND
        features: { talentSearch: true, basicMatching: true, placementPosting: true, basicReports: true },
        limits: { activeJobs: 10, matchesPerMonth: 20, users: 3 },
      },
      {
        name: 'Enterprise Growth',
        segment: 'ENTERPRISE' as Segment,
        tierLevel: 'GROWTH' as PricingTierLevel,
        basePriceVnd: 8_000_000, // 8M VND/month
        setupFeeVnd: 20_000_000, // 20M VND
        features: { talentSearch: true, advancedMatching: true, placementPosting: true, advancedReports: true, employerBranding: true, apiAccess: true },
        limits: { activeJobs: 50, matchesPerMonth: 100, users: 10 },
      },
      {
        name: 'Enterprise Enterprise',
        segment: 'ENTERPRISE' as Segment,
        tierLevel: 'ENTERPRISE' as PricingTierLevel,
        basePriceVnd: 15_000_000, // 15M VND/month
        setupFeeVnd: 50_000_000, // 50M VND
        features: { talentSearch: true, advancedMatching: true, placementPosting: true, advancedReports: true, employerBranding: true, apiAccess: true, customAssessments: true, dedicatedCSM: true, sso: true },
        limits: { activeJobs: -1, matchesPerMonth: -1, users: -1 },
      },
      // Learner premium tiers
      {
        name: 'Learner Basic',
        segment: 'LEARNER' as Segment,
        tierLevel: 'STARTER' as PricingTierLevel,
        basePriceVnd: 0, // Free
        setupFeeVnd: 0,
        features: { programAccess: true, basicProfile: true, jobBoard: true },
        limits: { applications: 5, profileViews: 10 },
      },
      {
        name: 'Learner Premium',
        segment: 'LEARNER' as Segment,
        tierLevel: 'GROWTH' as PricingTierLevel,
        basePriceVnd: 500_000, // 500K VND/month
        setupFeeVnd: 0,
        features: { programAccess: true, advancedProfile: true, jobBoard: true, priorityMatching: true, careerCoaching: true, certificateVerification: true },
        limits: { applications: -1, profileViews: -1, coachingSessions: 2 },
      },
      {
        name: 'Learner Pro',
        segment: 'LEARNER' as Segment,
        tierLevel: 'ENTERPRISE' as PricingTierLevel,
        basePriceVnd: 1_500_000, // 1.5M VND/month
        setupFeeVnd: 0,
        features: { programAccess: true, advancedProfile: true, jobBoard: true, priorityMatching: true, careerCoaching: true, certificateVerification: true, mentorNetwork: true, skillAssessment: true, jobMatchGuarantee: true },
        limits: { applications: -1, profileViews: -1, coachingSessions: -1, assessments: -1 },
      },
    ]

    const results = []
    for (const tier of defaults) {
      const existing = await this.prisma.pricingTier.findUnique({ where: { name: tier.name } })
      if (!existing) {
        const created = await this.prisma.pricingTier.create({ data: tier })
        results.push(created)
      }
    }

    // Seed default legal entities
    const edco = await this.prisma.legalEntity.findFirst({ where: { type: 'EDCO' } })
    if (!edco) {
      await this.prisma.legalEntity.create({
        data: {
          name: 'LinkEduVN Education JSC',
          type: 'EDCO',
          taxCode: '0101234567', // placeholder
          vatRate: 0,
          address: 'Ho Chi Minh City, Vietnam',
          isDefault: true,
        },
      })
    }

    const techco = await this.prisma.legalEntity.findFirst({ where: { type: 'TECHCO' } })
    if (!techco) {
      await this.prisma.legalEntity.create({
        data: {
          name: 'LinkEduVN Technology JSC',
          type: 'TECHCO',
          taxCode: '0101234568', // placeholder
          vatRate: 10,
          address: 'Ho Chi Minh City, Vietnam',
          isDefault: true,
        },
      })
    }

    // Seed VAT classifications
    const vatClassifications = [
      { productCode: 'SAAS_PLATFORM', description: 'SaaS Platform Subscription', vatRate: 10, legalEntityId: techco?.id },
      { productCode: 'SETUP_FEE', description: 'One-time Setup Fee', vatRate: 10, legalEntityId: techco?.id },
      { productCode: 'PLACEMENT_FEE', description: 'Placement Success Fee', vatRate: 10, legalEntityId: techco?.id },
      { productCode: 'EDUCATION_SERVICE', description: 'Education Coordination Service', vatRate: 0, legalEntityId: edco?.id },
      { productCode: 'SCHOLARSHIP_ADMIN', description: 'Scholarship Fund Administration', vatRate: 10, legalEntityId: techco?.id },
    ]

    for (const vc of vatClassifications) {
      if (vc.legalEntityId) {
        const existing = await this.prisma.vATClassification.findUnique({ where: { productCode: vc.productCode } })
        if (!existing) {
          await this.prisma.vATClassification.create({ data: vc as { productCode: string; description: string; vatRate: number; legalEntityId: string } })
        }
      }
    }

    return { tiersCreated: results.length }
  }
}