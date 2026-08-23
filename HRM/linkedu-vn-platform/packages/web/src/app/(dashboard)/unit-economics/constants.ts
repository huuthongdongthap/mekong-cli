export const TABS = [
  { value: "monthly" as const, label: "Du lieu hang thang" },
  { value: "cohorts" as const, label: "Cohort" },
]

export function formatVnd(n: number): string {
  return n.toLocaleString("vi-VN") + " d"
}

export function fmtRatio(n: number): string {
  return n.toFixed(1) + "x"
}

export function fmtPct(n: number): string {
  return (n * 100).toFixed(1) + "%"
}

export function cacColor(v: number): string {
  return v > 5000000 ? "text-destructive" : "text-foreground"
}