export const ACTION_LABELS: Record<string, string> = {
  CREATE: "Tạo", UPDATE: "Cập nhật", DELETE: "Xóa", SIGN: "Ký",
  APPROVE: "Duyệt", REJECT: "Từ chối", LOGIN: "Đăng nhập",
  LOGOUT: "Đăng xuất", EXPORT: "Xuất",
}

export const ACTION_CLS: Record<string, string> = {
  CREATE: "bg-[var(--status-emerald)] text-[var(--status-emerald-fg)] border border-[var(--status-emerald-border)]",
  UPDATE: "bg-[var(--status-blue)] text-[var(--status-blue-fg)] border border-[var(--status-blue-border)]",
  DELETE: "bg-destructive/10 text-destructive border border-destructive/20",
  SIGN: "bg-[var(--status-purple)] text-[var(--status-purple-fg)] border border-[var(--status-purple-border)]",
  APPROVE: "bg-[var(--status-teal)] text-[var(--status-teal-fg)] border border-[var(--status-teal-border)]",
  REJECT: "bg-[var(--status-orange)] text-[var(--status-orange-fg)] border border-[var(--status-orange-border)]",
  LOGIN: "bg-muted text-muted-foreground border border-border",
  LOGOUT: "bg-muted text-muted-foreground border border-border",
  EXPORT: "bg-[var(--status-amber)] text-[var(--status-amber-fg)] border border-[var(--status-amber-border)]",
}

export const PAGE_SIZE = 20