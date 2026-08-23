import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationBarProps {
  page: number
  totalPages: number
  totalItems: number
  onPageChange: (page: number) => void
}

export function PaginationBar({ page, totalPages, totalItems, onPageChange }: PaginationBarProps) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between px-5 py-3 bg-card rounded-xl border border-border shadow-sm">
      <p className="text-xs text-muted-foreground">
        Tổng {totalItems} bản ghi — Trang {page}/{totalPages}
      </p>
      <div className="flex gap-1.5">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="h-8 w-8 p-0">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i
          if (p > totalPages) return null
          return (
            <Button key={p} variant={p === page ? "default" : "outline"} size="sm"
              onClick={() => onPageChange(p)} className="h-8 w-8 p-0 text-xs">{p}</Button>
          )
        })}
        <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="h-8 w-8 p-0">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
