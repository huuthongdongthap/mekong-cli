export const REGION_LABELS: Record<string, string> = {
  north: "Miền Bắc", central: "Miền Trung", south: "Miền Nam",
}

export const REGION_CLS: Record<string, string> = {
  north: "bg-[var(--status-blue)] text-[var(--status-blue-fg)] border border-[var(--status-blue-border)]",
  central: "bg-[var(--status-amber)] text-[var(--status-amber-fg)] border border-[var(--status-amber-border)]",
  south: "bg-[var(--status-emerald)] text-[var(--status-emerald-fg)] border border-[var(--status-emerald-border)]",
}

const TYPE_BADGES: Record<string, string> = {
  "Thành phố": "bg-[var(--status-blue)] text-[var(--status-blue-fg)] border border-[var(--status-blue-border)]",
  city: "bg-[var(--status-blue)] text-[var(--status-blue-fg)] border border-[var(--status-blue-border)]",
  "Tỉnh": "bg-muted text-muted-foreground border border-border",
  province: "bg-muted text-muted-foreground border border-border",
}

export function resolveTypeBadge(name: string, type?: string): { label: string; cls: string } | null {
  const key = type || (name.includes("Thành phố") ? "Thành phố" : "Tỉnh")
  const label = type || (key === "Thành phố" ? "Thành phố" : "Tỉnh")
  return { label, cls: TYPE_BADGES[key] ?? TYPE_BADGES["Tỉnh"] }
}

export const REGION_TABS = [
  { value: "", label: "Tất cả" },
  { value: "north", label: "Miền Bắc" },
  { value: "central", label: "Miền Trung" },
  { value: "south", label: "Miền Nam" },
]
