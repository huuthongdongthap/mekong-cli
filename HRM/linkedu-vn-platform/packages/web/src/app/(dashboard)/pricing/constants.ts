import { DollarSign, CreditCard, Receipt, Building2 } from "lucide-react"

export const TABS = [
  { key: "tiers" as const, label: "Gói dịch vụ", icon: DollarSign },
  { key: "subscriptions" as const, label: "Đăng ký", icon: CreditCard },
  { key: "billing" as const, label: "Hóa đơn", icon: Receipt },
  { key: "payments" as const, label: "Thanh toán", icon: Building2 },
]

export const STATUS_LABELS: Record<string, string> = {
  pending: "Chờ xử lý", active: "Hoạt động", approved: "Đã duyệt",
  paid: "Đã thanh toán", discharged: "Đã thanh toán",
  cancelled: "Đã hủy", rejected: "Từ chối",
  completed: "Hoàn tất", failed: "Thất bại",
}

export const STATUS_CLASSES: Record<string, string> = {
  pending: "bg-[var(--status-yellow)] text-[var(--status-yellow-fg)] border border-[var(--status-yellow-border)]",
  active: "bg-[var(--status-blue)] text-[var(--status-blue-fg)] border border-[var(--status-blue-border)]",
  approved: "bg-[var(--status-blue)] text-[var(--status-blue-fg)] border border-[var(--status-blue-border)]",
  paid: "bg-[var(--status-green)] text-[var(--status-green-fg)] border border-[var(--status-green-border)]",
  discharged: "bg-[var(--status-green)] text-[var(--status-green-fg)] border border-[var(--status-green-border)]",
  completed: "bg-[var(--status-green)] text-[var(--status-green-fg)] border border-[var(--status-green-border)]",
  cancelled: "bg-destructive/10 text-destructive border border-destructive/20",
  rejected: "bg-destructive/10 text-destructive border border-destructive/20",
  failed: "bg-destructive/10 text-destructive border border-destructive/20",
}

export const SEGMENT_LABELS: Record<string, string> = {
  individual: "Cá nhân", enterprise: "Doanh nghiệp",
  school: "Trường học", partner: "Đối tác",
}

export const SEGMENT_CLASSES: Record<string, string> = {
  individual: "bg-[var(--status-purple)] text-[var(--status-purple-fg)] border border-[var(--status-purple-border)]",
  enterprise: "bg-[var(--status-blue)] text-[var(--status-blue-fg)] border border-[var(--status-blue-border)]",
  school: "bg-[var(--status-green)] text-[var(--status-green-fg)] border border-[var(--status-green-border)]",
  partner: "bg-[var(--status-yellow)] text-[var(--status-yellow-fg)] border border-[var(--status-yellow-border)]",
}

export const CYCLE_LABELS: Record<string, string> = {
  monthly: "Hàng tháng", quarterly: "Hàng quý", yearly: "Hàng năm", once: "Một lần",
}

export function formatVnd(n: number): string {
  return n.toLocaleString("vi-VN") + " đ"
}

export const PAGE_SIZE = 20