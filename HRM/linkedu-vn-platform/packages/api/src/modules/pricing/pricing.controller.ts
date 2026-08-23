import { Controller, Get, Post, Body, Param, Query, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger'
import { PricingService } from './pricing.service'
import { Prisma } from '@prisma/client'
import { Segment, PricingTierLevel, RuleType, GatewayType, TransactionStatus, BillingCycle } from '@prisma/client'

@ApiTags('Pricing')
@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  // =============================================================================
  // Pricing Tier Endpoints
  // =============================================================================

  @Post('tiers')
  @ApiOperation({ summary: 'Create pricing tier' })
  @ApiResponse({ status: 201, description: 'Tier created' })
  async createTier(@Body() data: {
    name: string
    segment: Segment
    tierLevel: PricingTierLevel
    basePriceVnd: number
    setupFeeVnd?: number
    features?: Record<string, boolean>
    limits?: Record<string, number>
  }) {
    return this.pricingService.createTier(data)
  }

  @Get('tiers')
  @ApiOperation({ summary: 'List pricing tiers' })
  @ApiQuery({ name: 'segment', enum: Segment, required: false })
  @ApiQuery({ name: 'isActive', type: Boolean, required: false })
  async getTiers(@Query('segment') segment?: Segment, @Query('isActive') isActive?: string) {
    return this.pricingService.getTiers(segment, isActive !== 'false')
  }

  @Get('tiers/:id')
  @ApiOperation({ summary: 'Get pricing tier by ID' })
  @ApiParam({ name: 'id', type: String })
  async getTier(@Param('id') id: string) {
    return this.pricingService.getTierById(id)
  }

  @Put('tiers/:id')
  @ApiOperation({ summary: 'Update pricing tier' })
  @ApiParam({ name: 'id', type: String })
  async updateTier(
    @Param('id') id: string,
    @Body() data: Partial<{
      name: string
      tierLevel: PricingTierLevel
      basePriceVnd: number
      setupFeeVnd: number
      features: Record<string, boolean>
      limits: Record<string, number>
      isActive: boolean
    }>
  ) {
    return this.pricingService.updateTier(id, data)
  }

  @Delete('tiers/:id')
  @ApiOperation({ summary: 'Delete pricing tier' })
  @ApiParam({ name: 'id', type: String })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTier(@Param('id') id: string) {
    await this.pricingService.deleteTier(id)
  }

  // =============================================================================
  // Pricing Rules Endpoints
  // =============================================================================

  @Post('rules')
  @ApiOperation({ summary: 'Create pricing rule' })
  async createRule(@Body() data: {
    tierId: string
    ruleType: RuleType
    config: Prisma.InputJsonValue
    startDate?: Date
    endDate?: Date
  }) {
    return this.pricingService.createRule(data)
  }

  @Get('tiers/:tierId/rules')
  @ApiOperation({ summary: 'Get pricing rules for tier' })
  @ApiParam({ name: 'tierId', type: String })
  async getRules(@Param('tierId') tierId: string) {
    return this.pricingService.getRulesForTier(tierId)
  }

  // =============================================================================
  // Price Quote Endpoints
  // =============================================================================

  @Post('quotes/calculate')
  @ApiOperation({ summary: 'Calculate price quote' })
  async calculateQuote(@Body() data: {
    entityId: string
    entityType: Segment
    tierId: string
    volume?: number
    contractMonths?: number
    promoCode?: string
  }) {
    return this.pricingService.calculateQuote(data)
  }

  @Post('quotes')
  @ApiOperation({ summary: 'Create price quote' })
  async createQuote(@Body() data: {
    entityId: string
    entityType: Segment
    tierId: string
    volume?: number
    contractMonths?: number
    promoCode?: string
    validUntil?: Date
  }) {
    return this.pricingService.createQuote(data)
  }

  // =============================================================================
  // Subscription Endpoints
  // =============================================================================

  @Post('subscriptions')
  @ApiOperation({ summary: 'Create subscription' })
  async createSubscription(@Body() data: {
    entityId: string
    entityType: Segment
    tierId: string
    billingCycle: BillingCycle
    trialEnd?: Date
  }) {
    return this.pricingService.createSubscription(data)
  }

  @Get('subscriptions')
  @ApiOperation({ summary: 'Get subscriptions for entity' })
  @ApiQuery({ name: 'entityId', type: String, required: true })
  @ApiQuery({ name: 'entityType', enum: Segment, required: true })
  async getSubscriptions(
    @Query('entityId') entityId: string,
    @Query('entityType') entityType: Segment
  ) {
    return this.pricingService.getSubscriptions(entityId, entityType)
  }

  @Post('subscriptions/:id/cancel')
  @ApiOperation({ summary: 'Cancel subscription' })
  @ApiParam({ name: 'id', type: String })
  async cancelSubscription(
    @Param('id') id: string,
    @Body('cancelAtPeriodEnd') cancelAtPeriodEnd: boolean = true
  ) {
    return this.pricingService.cancelSubscription(id, cancelAtPeriodEnd)
  }

  // =============================================================================
  // Billing Schedule Endpoints
  // =============================================================================

  @Get('billing/pending')
  @ApiOperation({ summary: 'Get pending billing schedules' })
  @ApiQuery({ name: 'before', type: Date, required: false })
  async getPendingBilling(@Query('before') before?: Date) {
    return this.pricingService.getPendingBillingSchedules(before)
  }

  @Post('billing/:scheduleId/generate')
  @ApiOperation({ summary: 'Mark billing schedule as generated with invoice' })
  @ApiParam({ name: 'scheduleId', type: String })
  async markGenerated(@Param('scheduleId') scheduleId: string, @Body('invoiceId') invoiceId: number) {
    return this.pricingService.markBillingScheduleGenerated(scheduleId, invoiceId)
  }

  @Post('billing/:scheduleId/pay')
  @ApiOperation({ summary: 'Mark billing schedule as paid' })
  @ApiParam({ name: 'scheduleId', type: String })
  async markPaid(@Param('scheduleId') scheduleId: string) {
    return this.pricingService.markBillingSchedulePaid(scheduleId)
  }

  // =============================================================================
  // Payment Gateway Endpoints
  // =============================================================================

  @Post('gateways')
  @ApiOperation({ summary: 'Create payment gateway' })
  async createGateway(@Body() data: {
    name: string
    type: GatewayType
    config: Prisma.InputJsonValue
    isTestMode?: boolean
  }) {
    return this.pricingService.createGateway(data)
  }

  @Get('gateways')
  @ApiOperation({ summary: 'List payment gateways' })
  @ApiQuery({ name: 'isActive', type: Boolean, required: false })
  async getGateways(@Query('isActive') isActive?: string) {
    return this.pricingService.getGateways(isActive !== 'false')
  }

  @Post('payments')
  @ApiOperation({ summary: 'Record payment transaction' })
  async recordPayment(@Body() data: {
    gatewayId: string
    invoiceId?: number
    amountVnd: number
    gatewayRef?: string
    responseData?: Prisma.InputJsonValue
    status: TransactionStatus
    errorMessage?: string
  }) {
    return this.pricingService.recordPayment(data)
  }

  @Post('payments/:id/status')
  @ApiOperation({ summary: 'Update payment status' })
  @ApiParam({ name: 'id', type: String })
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body('status') status: 'SUCCESS' | 'FAILED' | 'REFUNDED'
  ) {
    return this.pricingService.updatePaymentStatus(id, status)
  }

  // =============================================================================
  // Legal Entity & VAT Endpoints
  // =============================================================================

  @Post('entities')
  @ApiOperation({ summary: 'Create legal entity' })
  async createEntity(@Body() data: {
    name: string
    type: 'EDCO' | 'TECHCO'
    taxCode: string
    vatRate: number
    address: string
    isDefault?: boolean
  }) {
    return this.pricingService.createLegalEntity(data)
  }

  @Get('entities')
  @ApiOperation({ summary: 'List legal entities' })
  async getEntities() {
    return this.pricingService.getLegalEntities()
  }

  @Get('entities/default/:type')
  @ApiOperation({ summary: 'Get default entity by type' })
  @ApiParam({ name: 'type', enum: ['EDCO', 'TECHCO'] })
  async getDefaultEntity(@Param('type') type: 'EDCO' | 'TECHCO') {
    return this.pricingService.getDefaultEntity(type)
  }

  @Post('vat/classifications')
  @ApiOperation({ summary: 'Create VAT classification' })
  async createVATClassification(@Body() data: {
    productCode: string
    description: string
    vatRate: number
    legalEntityId: string
  }) {
    return this.pricingService.createVATClassification(data)
  }

  @Get('vat/classifications')
  @ApiOperation({ summary: 'List VAT classifications' })
  @ApiQuery({ name: 'legalEntityId', type: String, required: false })
  async getVATClassifications(@Query('legalEntityId') legalEntityId?: string) {
    return this.pricingService.getVATClassifications(legalEntityId)
  }

  // =============================================================================
  // Seeding Endpoint
  // =============================================================================

  @Post('seed/vietnam-defaults')
  @ApiOperation({ summary: 'Seed default Vietnam pricing tiers and legal entities' })
  async seedDefaults() {
    return this.pricingService.seedVietnamDefaults()
  }
}