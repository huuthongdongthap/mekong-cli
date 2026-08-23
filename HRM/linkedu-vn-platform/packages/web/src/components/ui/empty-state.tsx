// packages/web/src/components/ui/empty-state.tsx
//
// Reusable "nothing here yet" state shown by list pages when the query returns
// zero items. Replaces 19 near-identical inline empty messages with one
// component that standardizes icon + heading + description + optional action.

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export interface EmptyStateProps {
  icon?: ReactNode
  title?: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({
  icon,
  title = "Chưa có dữ liệu.",
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-12 px-4",
        className
      )}
    >
      {icon && (
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          {icon}
        </div>
      )}
      {title && <p className="text-sm font-medium text-foreground">{title}</p>}
      {description && (
        <p className="mt-1 text-xs text-muted-foreground max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}