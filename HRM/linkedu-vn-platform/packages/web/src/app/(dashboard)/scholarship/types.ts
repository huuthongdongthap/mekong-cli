export interface Fund {
  id: string; name: string; description: string | null; targetAmountVnd: number
  startDate: string | null; endDate: string | null; isActive: boolean
}
export interface FundRes { items: Fund[]; total: number; page: number; limit: number; totalPages: number }

export interface Alloc {
  id: string; amountVnd: number; status: string; academicYear: string | null; semester: string | null
  learner?: { fullName: string } | null; fund?: { name: string } | null
}
export interface AllocRes { items: Alloc[]; total: number }
export type TabKey = "funds" | "allocations"