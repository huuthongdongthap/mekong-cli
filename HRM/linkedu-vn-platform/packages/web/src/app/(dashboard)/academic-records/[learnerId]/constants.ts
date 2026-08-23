export const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  "Đang học": { label: "Đang học", cls: "bg-[var(--status-blue)] text-[var(--status-blue-fg)] border border-[var(--status-blue-border)]" },
  "Tốt nghiệp": { label: "Tốt nghiệp", cls: "bg-[var(--status-green)] text-[var(--status-green-fg)] border border-[var(--status-green-border)]" },
  "Thôi học": { label: "Thôi học", cls: "bg-destructive/10 text-destructive border border-destructive/20" },
  "Tạm dừng": { label: "Tạm dừng", cls: "bg-[var(--status-yellow)] text-[var(--status-yellow-fg)] border border-[var(--status-yellow-border)]" },
}

export const STATUS_LABELS: Record<string, string> = {
  passed: "Đạt", failed: "Ko đạt", in_progress: "Đang học",
}

export const STATUS_COLORS: Record<string, string> = {
  passed: "text-green-600", failed: "text-destructive", in_progress: "text-primary",
}

export function gradeColor(g?: number) {
  if (g == null) return "text-muted-foreground"
  if (g >= 3.6) return "text-green-600 font-semibold"
  if (g >= 3.0) return "text-primary"
  if (g >= 2.5) return "text-yellow-600"
  return "text-destructive"
}