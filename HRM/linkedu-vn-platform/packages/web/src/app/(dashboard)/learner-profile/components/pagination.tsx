"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function Pagination({
  current, total, onChange,
}: {
  current: number
  total: number
  onChange: (p: number) => void
}) {
  if (total <= 1) return null

  return (
    <div className="flex items-center justify-end gap-1.5 mt-3">
      <Button variant="outline" size="sm" disabled={current <= 1}
        onClick={() => onChange(current - 1)} className="h-8 w-8 p-0">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {Array.from({ length: Math.min(5, total) }, (_, i) => {
        const p = Math.max(1, Math.min(current - 2, total - 4)) + i
        if (p > total) return null
        return (
          <Button key={p} variant={p === current ? "default" : "outline"} size="sm"
            onClick={() => onChange(p)} className="h-8 w-8 p-0 text-xs">{p}</Button>
        )
      })}
      <Button variant="outline" size="sm" disabled={current >= total}
        onClick={() => onChange(current + 1)} className="h-8 w-8 p-0">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}