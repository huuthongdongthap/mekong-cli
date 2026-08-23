import { UserCircle, Briefcase, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react"

export const TABS = [
  { key: "info" as const, label: "Thông tin", icon: UserCircle },
  { key: "experience" as const, label: "Kinh nghiệm", icon: Briefcase },
  { key: "education" as const, label: "Học vấn", icon: GraduationCap },
]

export const STATUS_CLS: Record<string, string> = {
  student: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  graduated: "bg-blue-50 text-blue-700 border border-blue-200",
  pending: "bg-amber-50 text-amber-700 border border-amber-200",
  active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  inactive: "bg-muted text-muted-foreground border border-border",
  suspended: "bg-destructive/10 text-destructive border border-destructive/20",
}

export const STATUS_LABELS: Record<string, string> = {
  student: "Đang học",
  graduated: "Đã tốt nghiệp",
  pending: "Chờ xác nhận",
  active: "Đang hoạt động",
  inactive: "Không hoạt động",
  suspended: "Đình chỉ",
}

export const PAGE_SIZE = 5

export const EMPTY_WORK = {
  company: "", position: "", startDate: "", endDate: "", description: "",
}

export const EMPTY_EDU = {
  schoolName: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "",
}