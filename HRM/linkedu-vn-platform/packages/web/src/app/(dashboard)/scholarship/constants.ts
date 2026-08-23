export const STATUS_LABELS: Record<string, string> = {
  pending: "Chờ duyệt", approved: "Đã duyệt", disbursed: "Đã chi",
  rejected: "Từ chối", cancelled: "Đã hủy",
}

export const STATUS_CLASSES: Record<string, string> = {
  pending: "bg-[var(--status-amber)] text-[var(--status-amber-fg)] border border-[var(--status-amber-border)]",
  approved: "bg-[var(--status-blue)] text-[var(--status-blue-fg)] border border-[var(--status-blue-border)]",
  disbursed: "bg-[var(--status-emerald)] text-[var(--status-emerald-fg)] border border-[var(--status-emerald-border)]",
  rejected: "bg-destructive/10 text-destructive border border-destructive/20",
  cancelled: "bg-muted text-muted-foreground border border-border",
}

export function formatVnd(n: number): string {
  return n.toLocaleString("vi-VN") + " đ"
}

export const PAGE_SIZE = 20