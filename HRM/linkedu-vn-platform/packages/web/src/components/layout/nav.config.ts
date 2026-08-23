// packages/web/src/components/layout/nav.config.ts
//
// Single source of truth for navigation. `NAV` defines every route the
// platform exposes; `ROLE_ACCESS` defines which roles may see each route;
// `ROLE_LABELS` is the human-readable label rendered in the top bar and
// elsewhere. Keep the data here so the render layer cannot drift.

import {
  LayoutDashboard, School, Building2, Users, FileText,
  UserRound, Briefcase, GraduationCap, Award, Receipt,
  ClipboardCheck, MapPin, BarChart3, MessageSquare, FileStack, DollarSign, TrendingUp, UserCircle,
} from "lucide-react"

export type Role =
  | "super_admin"
  | "school_admin"
  | "school_staff"
  | "enterprise_admin"
  | "enterprise_hr"
  | "learner"

/** Routes visible to each role. A role missing from the map sees nothing. */
export const ROLE_ACCESS: Record<Role, string[]> = {
  super_admin: ["/", "/schools", "/enterprises", "/learners", "/programs", "/enrollments", "/placements", "/certificates", "/academic-records", "/invoices", "/moas", "/evaluations", "/practice-records", "/scholarship", "/audit-logs", "/geographic", "/chat", "/documents", "/learner-profile", "/pricing", "/unit-economics"],
  school_admin: ["/", "/schools", "/learners", "/programs", "/enrollments", "/certificates", "/academic-records", "/invoices", "/moas", "/evaluations", "/practice-records", "/scholarship", "/audit-logs", "/geographic", "/chat", "/documents", "/learner-profile"],
  school_staff: ["/", "/schools", "/learners", "/programs", "/enrollments", "/certificates", "/academic-records", "/invoices", "/evaluations", "/practice-records", "/chat", "/documents"],
  enterprise_admin: ["/", "/enterprises", "/learners", "/programs", "/placements", "/invoices", "/moas", "/practice-records", "/chat", "/documents", "/pricing"],
  enterprise_hr: ["/", "/enterprises", "/learners", "/placements", "/programs", "/practice-records", "/chat"],
  // Learners browse their own record only — `/learners` (admin directory) is
  // intentionally absent so a learner never sees the student directory.
  learner: ["/", "/enrollments", "/certificates", "/academic-records", "/placements", "/scholarship", "/chat", "/learner-profile"],
}

/** Every route the platform exposes, in sidebar order. */
export const NAV = [
  { href: "/", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/schools", label: "Trường", icon: School },
  { href: "/enterprises", label: "Doanh nghiệp", icon: Building2 },
  { href: "/learners", label: "Người học", icon: Users },
  { href: "/programs", label: "Chương trình", icon: FileText },
  { href: "/enrollments", label: "Tuyển sinh", icon: UserRound },
  { href: "/placements", label: "Việc làm", icon: Briefcase },
  { href: "/certificates", label: "Chứng chỉ", icon: Award },
  { href: "/academic-records", label: "Học tập", icon: GraduationCap },
  { href: "/invoices", label: "Hóa đơn", icon: Receipt },
  { href: "/moas", label: "MoU/MoA", icon: Briefcase },
  { href: "/evaluations", label: "Đánh giá", icon: BarChart3 },
  { href: "/practice-records", label: "Thực tập", icon: Briefcase },
  { href: "/scholarship", label: "Học bổng", icon: Award },
  { href: "/audit-logs", label: "Nhật ký", icon: ClipboardCheck },
  { href: "/geographic", label: "Địa lý", icon: MapPin },
  { href: "/chat", label: "AI Chat", icon: MessageSquare },
  { href: "/documents", label: "Tài liệu", icon: FileStack },
  { href: "/learner-profile", label: "Hồ sơ", icon: UserCircle },
  { href: "/pricing", label: "Bảng giá", icon: DollarSign },
  { href: "/unit-economics", label: "Kinh tế DV", icon: TrendingUp },
]

/** Human-readable role labels rendered in the top bar and elsewhere. */
export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Quản trị viên",
  school_admin: "Trường học",
  school_staff: "Giáo viên",
  enterprise_admin: "Doanh nghiệp",
  enterprise_hr: "HR",
  learner: "Người học",
}

/** Returns the nav items a given role is allowed to see, preserving NAV order. */
export function visibleNavFor(role: Role | null | undefined) {
  const allowed = role ? ROLE_ACCESS[role] : []
  return NAV.filter((item) => allowed.includes(item.href))
}