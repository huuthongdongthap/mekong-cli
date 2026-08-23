import { ReactNode } from "react"

type BadgeColor = "gray" | "green" | "blue" | "yellow" | "red" | "purple"

const COLOR_MAP: Record<BadgeColor, string> = {
  gray: "bg-muted text-muted-foreground",
  green: "bg-[var(--status-green)] text-[var(--status-green-fg)] border border-[var(--status-green-border)]",
  blue: "bg-[var(--status-blue)] text-[var(--status-blue-fg)] border border-[var(--status-blue-border)]",
  yellow: "bg-[var(--status-yellow)] text-[var(--status-yellow-fg)] border border-[var(--status-yellow-border)]",
  red: "bg-[var(--status-red)] text-[var(--status-red-fg)] border border-[var(--status-red-border)]",
  purple: "bg-[var(--status-purple)] text-[var(--status-purple-fg)] border border-[var(--status-purple-border)]",
}

interface BadgeProps {
  children: ReactNode
  color?: BadgeColor
  className?: string
}

export function Badge({ children, color = "gray", className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${COLOR_MAP[color]} ${className}`}>
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const s = (status ?? "").toLowerCase()
  const map: Record<string, { color: BadgeColor; label: string }> = {
    active: { color: "green", label: "Hoạt động" },
    graduated: { color: "blue", label: "Tốt nghiệp" },
    pending: { color: "yellow", label: "Chờ duyệt" },
    draft: { color: "gray", label: "Nháp" },
    issued: { color: "green", label: "Đã cấp" },
    revoked: { color: "red", label: "Thu hồi" },
    suspended: { color: "yellow", label: "Tạm dừng" },
    withdrawn: { color: "red", label: "Bỏ học" },
    expired: { color: "gray", label: "Hết hạn" },
    completed: { color: "blue", label: "Hoàn thành" },
    approved: { color: "green", label: "Duyệt" },
    rejected: { color: "red", label: "Từ chối" },
    open: { color: "blue", label: "Mở" },
    filled: { color: "green", label: "Đã tuyển" },
  }
  const info = map[s] ?? { color: "gray", label: status }
  return <Badge color={info.color}>{info.label}</Badge>
}
