export interface PricingTier {
  id: string; name: string; description: string | null; segment: string
  level: string; priceVnd: number; billingCycle: string; isActive: boolean
}

export interface Subscription {
  id: string; entityType: string; entityId: string; tierId: string
  status: string; startDate: string; endDate: string | null
  tier?: { name: string; priceVnd: number } | null
}

export interface BillingSchedule {
  id: string; subscriptionId: string; amountVnd: number; dueDate: string
  status: string; invoiceId: string | null
}

export interface PaymentTransaction {
  id: string; amountVnd: number; status: string; gatewayType: string
  createdAt: string; billingScheduleId: string | null
}

export interface PageRes<T> { items: T[]; total: number; page?: number; limit?: number; totalPages?: number }

export type TabKey = "tiers" | "subscriptions" | "billing" | "payments"