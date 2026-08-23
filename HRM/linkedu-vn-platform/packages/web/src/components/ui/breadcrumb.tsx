// packages/web/src/components/ui/breadcrumb.tsx
//
// Lightweight breadcrumb trail for detail/edit pages (depth 2-3). No external
// primitive dependency — it is just a list of links with separators, styled
// with tokens.

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-sm", className)}>
      <ol className="flex items-center gap-1">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={item.label} className="flex items-center gap-1">
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={cn("text-foreground", isLast && "font-medium")}>{item.label}</span>
              )}
              {!isLast && <ChevronRight className="size-3.5 text-muted-foreground/60" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}