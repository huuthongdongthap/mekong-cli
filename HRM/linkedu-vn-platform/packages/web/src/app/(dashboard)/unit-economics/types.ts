export interface DailyMetrics {
  date: string
  cac: number
  ltv: number
  ltvCacRatio: number
  paybackMonths: number
  monthlyRevenue: number
  newCustomers: number
}

export interface DashboardMetrics {
  avgCac: number
  avgLtv: number
  avgLtvCacRatio: number
  avgPaybackMonths: number
  totalRevenue: number
  totalCustomers: number
  monthlyData: DailyMetrics[]
}

export interface CohortData {
  cohort: string
  initial: number
  month1: number
  month3: number
  month6: number
  month12: number
  retentionRate: number
}

export type TabKey = "monthly" | "cohorts"