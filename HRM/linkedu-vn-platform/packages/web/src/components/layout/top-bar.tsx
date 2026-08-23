// packages/web/src/components/layout/top-bar.tsx
//
// Top bar: brand logo, breadcrumb trail, user avatar + role badge, theme
// toggle and logout. Rendered on every dashboard page. Token-driven styling.

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { DropdownContent, DropdownItem, DropdownRoot, DropdownTrigger } from "@/components/ui/dropdown-menu"
import { ROLE_LABELS } from "./nav.config"
import { cn } from "@/lib/utils"

type Role = "super_admin" | "school_admin" | "school_staff" | "enterprise_admin" | "enterprise_hr" | "learner"

/** Map a pathname to a breadcrumb trail. Depth is shallow (2-3) by design. */
function useBreadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  const items: { label: string; href?: string }[] = [{ label: "Trang chủ", href: "/" }]

  if (segments.length === 0) return items

  // Build cumulative hrefs and translate the last segment to a friendly label.
  let href = ""
  segments.forEach((seg, i) => {
    href += `/${seg}`
    const isLast = i === segments.length - 1
    const label = isLast ? humanizeSegment(seg) : humanizeSegment(seg)
    items.push({ label, href: isLast ? undefined : href })
  })

  return items
}

function humanizeSegment(seg: string) {
  const map: Record<string, string> = {
    schools: "Trường",
    enterprises: "Doanh nghiệp",
    learners: "Người học",
    programs: "Chương trình",
    enrollments: "Tuyển sinh",
    placements: "Việc làm",
    certificates: "Chứng chỉ",
    "academic-records": "Học tập",
    invoices: "Hóa đơn",
    moas: "MoU/MoA",
    evaluations: "Đánh giá",
    "practice-records": "Thực tập",
    scholarship: "Học bổng",
    "audit-logs": "Nhật ký",
    geographic: "Địa lý",
    chat: "AI Chat",
    documents: "Tài liệu",
    "learner-profile": "Hồ sơ",
    pricing: "Bảng giá",
    "unit-economics": "Kinh tế DV",
  }
  return map[seg] ?? seg.replace(/-/g, " ")
}

export interface TopBarProps {
  user: { firstName?: string; lastName?: string; email?: string; role?: string } | null
  onLogout: () => void
  className?: string
}

export function TopBar({ user, onLogout, className = "" }: TopBarProps) {
  const breadcrumbs = useBreadcrumbs()
  const role = (user?.role ?? "") as Role
  const roleLabel = ROLE_LABELS[role] ?? "Người học"
  const displayName = user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : ""

  return (
    <header
      className={cn(
        "flex h-14 items-center gap-3 border-b border-border bg-background px-4",
        "sticky top-0 z-30",
        className
      )}
    >
      <Link href="/" className="flex items-center gap-2 font-semibold text-foreground shrink-0">
        <span className="inline-flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold">
          L
        </span>
        <span className="hidden sm:inline text-sm">LinkEduVN</span>
      </Link>

      <div className="hidden md:block">
        <Breadcrumb items={breadcrumbs} />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />

        <DropdownRoot>
          <DropdownTrigger
            render={
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline max-w-[140px] truncate">
                  {displayName || "Tài khoản"}
                </span>
              </Button>
            }
          />
          <DropdownContent>
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium truncate">{displayName || "—"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || ""}</p>
              <p className="mt-1 text-[11px] font-medium text-muted-foreground">{roleLabel}</p>
            </div>
            <DropdownItem onClick={onLogout}>
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </DropdownItem>
          </DropdownContent>
        </DropdownRoot>
      </div>
    </header>
  )
}