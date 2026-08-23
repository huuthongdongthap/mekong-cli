"use client"

import { useState } from "react"
import { ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface Column<T> {
  key: string
  label: string
  sortable?: boolean
  render?: (row: T, index: number) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T, index: number) => void
  className?: string
}

type SortDirection = "asc" | "desc" | null

export function DataTable<T>({
  columns,
  data,
  loading = false,
  emptyMessage = "No data available",
  onRowClick,
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<SortDirection>(null)

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : prev === "desc" ? null : "asc"))
      if (sortDir === "desc") setSortKey(null)
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  const sortedData = (() => {
    if (!sortKey || !sortDir) return data
    return [...data].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey]
      const bVal = (b as Record<string, unknown>)[sortKey]
      if (aVal == null && bVal == null) return 0
      if (aVal == null) return 1
      if (bVal == null) return -1
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      const cmp = Number(aVal) - Number(bVal)
      return sortDir === "asc" ? cmp : -cmp
    })
  })()

  const renderSortIcon = (key: string) => {
    if (sortKey !== key) return <ArrowUpDown className="ml-1 size-3 opacity-40" />
    return sortDir === "asc" ? (
      <ChevronUp className="ml-1 size-3" />
    ) : (
      <ChevronDown className="ml-1 size-3" />
    )
  }

  const skeletonRows = 5

  return (
    <div
      className={cn(
        "bg-card rounded-xl border border-border shadow-sm overflow-hidden",
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/80 border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider",
                    col.sortable && "cursor-pointer select-none hover:text-foreground/70",
                    col.className
                  )}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <span className="inline-flex items-center">
                    {col.label}
                    {col.sortable && renderSortIcon(col.key)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading
              ? Array.from({ length: skeletonRows }).map((_, rowIdx) => (
                  <tr key={`skeleton-${rowIdx}`}>
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3">
                        <Skeleton className="h-4 w-full max-w-[120px]" />
                      </td>
                    ))}
                  </tr>
                ))
              : sortedData.length === 0
                ? (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="px-4 py-12 text-center text-sm text-muted-foreground"
                      >
                        {emptyMessage}
                      </td>
                    </tr>
                  )
                : sortedData.map((row, rowIdx) => (
                    <tr
                      key={rowIdx}
                      onClick={onRowClick ? () => onRowClick(row, rowIdx) : undefined}
                      className={cn(
                        "transition-colors",
                        onRowClick && "cursor-pointer hover:bg-accent"
                      )}
                    >
                      {columns.map((col) => (
                        <td key={col.key} className={cn("px-4 py-3 text-foreground/70", col.className)}>
                          {col.render ? col.render(row, rowIdx) : String((row as Record<string, unknown>)[col.key] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
