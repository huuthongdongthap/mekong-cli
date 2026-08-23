import { EMPLOYMENT_LABELS } from "./constants"

export interface PlacementRow {
  id: number
  learnerName?: string
  positionApplied?: string
  positionOffered?: string | null
  employmentType?: string | null
  salaryMinVnd?: number | null
  salaryMaxVnd?: number | null
  startDate?: string | null
  enterpriseName?: string | null
  tracking3mStatus?: string | null
  tracking6mStatus?: string | null
  isCurrentJob?: boolean
  status?: string
}

export function fmtSalary(min: number | null = null, max: number | null = null) {
  if ((min == null || min === 0) && (max == null || max === 0)) return "CNĐ"
  const f = (v: number) => `${(v / 1_000_000).toFixed(1)}tr`
  if (max != null) return `${f(min ?? 0)} – ${f(max)}`
  return min ? `${f(min)} trở lên` : "CNĐ"
}

export function trackingBadge(status: string | null, label: string) {
  if (!status) return <span className="text-muted-foreground text-xs">{label}: —</span>
  const cls =
    status === "passed"
      ? "bg-[var(--status-green)] text-[var(--status-green-fg)]"
      : status === "failed"
        ? "bg-[var(--status-red)] text-[var(--status-red-fg)]"
        : "bg-[var(--status-yellow)] text-[var(--status-yellow-fg)]"
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs mr-1 ${cls}`}>
      {label}: {status}
    </span>
  )
}

export const PLACEMENT_COLUMNS = [
  {
    key: "learnerName",
    label: 'Người học',
    render: (row: PlacementRow) => (
      <a href={`/placements/${row.id}`} className="underline">
        {row.learnerName ?? "—"}
      </a>
    ),
  },
  { key: "positionApplied", label: 'Vị trí ứng tuyển', render: (row: PlacementRow) => row.positionApplied ?? "—" },
  { key: "positionOffered", label: 'Vị trí nhận', render: (row: PlacementRow) => row.positionOffered ?? "Chua nhan" },
  {
    key: "employmentType",
    label: 'Loại',
    render: (row: PlacementRow) => EMPLOYMENT_LABELS[row.employmentType ?? ""] ?? row.employmentType ?? "—",
  },
  { key: "salaryRange", label: 'Mức lương', render: (row: PlacementRow) => fmtSalary(row.salaryMinVnd ?? null, row.salaryMaxVnd ?? null) },
  { key: "enterpriseName", label: 'Công ty', render: (row: PlacementRow) => row.enterpriseName ?? "—" },
  {
    key: "tracking",
    label: 'Theo dõi 3m/6m',
    render: (row: PlacementRow) => {
      if (!row.tracking3mStatus) return "—"
      return (
        <>
          {trackingBadge(row.tracking3mStatus, "3m")}
          {row.tracking6mStatus ? trackingBadge(row.tracking6mStatus, "6m") : <span className="text-muted-foreground text-xs">6m: —</span>}
        </>
      )
    },
  },
  {
    key: "status",
    label: "Trang thai",
    render: (row: PlacementRow) => {
      const cls =
        row.status === "completed" ? "bg-[var(--status-green)] text-[var(--status-green-fg)]"
        : row.status === "in_progress" ? "bg-[var(--status-blue)] text-[var(--status-blue-fg)]"
        : row.status === "terminated" ? "bg-[var(--status-red)] text-[var(--status-red-fg)]"
        : "bg-muted text-foreground"
      return (
        <>
          <span className={`inline-block rounded-full px-2 py-0.5 text-xs ${cls}`}>{row.status}</span>
          {row.isCurrentJob && <span className="ml-1 text-xs text-primary">{"⏵"}</span>}
        </>
      )
    },
  },
]
