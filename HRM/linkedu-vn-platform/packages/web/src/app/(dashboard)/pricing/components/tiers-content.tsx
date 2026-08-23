"use client"
import Link from "next/link"
import { DollarSign } from "lucide-react"
import type { PricingTier } from "../types"
import { SEGMENT_CLASSES, SEGMENT_LABELS, CYCLE_LABELS, formatVnd } from "../constants"

export function TiersContent({ items }: { items: PricingTier[] }) {
  if (items.length === 0) return (
    <div className="bg-card rounded-xl border border-border p-12 text-center">
      <DollarSign className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
      <p className="text-sm text-muted-foreground">Chưa có gói dịch vụ nào.</p>
    </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((tier) => (
        <div key={tier.id} className="bg-card rounded-xl border border-border shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <Link href={`/pricing/tiers/${tier.id}`} className="font-semibold text-foreground truncate hover:underline">{tier.name}</Link>
              {tier.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{tier.description}</p>
              )}
            </div>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ml-2 shrink-0 ${
              tier.isActive
                ? "bg-[var(--status-green)] text-[var(--status-green-fg)] border border-[var(--status-green-border)]"
                : "bg-muted text-muted-foreground border border-border"
            }`}>
              {tier.isActive ? "Hoạt động" : "Tạm tắt"}
            </span>
          </div>

          <div className="text-2xl font-bold text-foreground mb-1">
            {formatVnd(tier.priceVnd)}
            <span className="text-xs font-normal text-muted-foreground ml-1">/ {CYCLE_LABELS[tier.billingCycle] ?? tier.billingCycle}</span>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
              SEGMENT_CLASSES[tier.segment] ?? "bg-muted text-foreground border border-border"
            }`}>
              {SEGMENT_LABELS[tier.segment] ?? tier.segment}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
              {tier.level}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}