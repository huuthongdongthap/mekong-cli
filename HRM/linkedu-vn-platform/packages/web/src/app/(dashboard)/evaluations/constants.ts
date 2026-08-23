export const TYPE_LABELS: Record<string, string> = {
  mid_term: "Giữa kỳ", final: "Cuối kỳ", supervisor: "Giám sát",
  peer: "Đồng nghiệp", self: "Tự đánh giá",
}

export const TYPE_COLORS: Record<string, string> = {
  "Học thuật": "bg-[var(--status-purple)] text-[var(--status-purple-fg)] border border-[var(--status-purple-border)]",
  "Thực hành": "bg-[var(--status-blue)] text-[var(--status-blue-fg)] border border-[var(--status-blue-border)]",
  "Hành vi": "bg-[var(--status-orange)] text-[var(--status-orange-fg)] border border-[var(--status-orange-border)]",
  "Kỹ năng mềm": "bg-[var(--status-emerald)] text-[var(--status-emerald-fg)] border border-[var(--status-emerald-border)]",
  "Khác": "bg-muted text-muted-foreground border border-border",
}

export const TYPE_CLS: Record<string, string> = {
  mid_term: TYPE_COLORS["Học thuật"],
  final: TYPE_COLORS["Học thuật"],
  supervisor: TYPE_COLORS["Hành vi"],
  peer: TYPE_COLORS["Kỹ năng mềm"],
  self: TYPE_COLORS["Khác"],
}

export const PAGE_SIZE = 20