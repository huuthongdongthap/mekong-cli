"use client";
import * as React from "react";
import { cn } from "../../lib/utils";
export interface TraceWaterfallProps extends React.HTMLAttributes<HTMLDivElement> { label?: string; }
const TraceWaterfall = React.forwardRef<HTMLDivElement, TraceWaterfallProps>(({ className, label, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-card)] p-[var(--spacing-lg)]", className)} {...props}>
    <div className="text-[var(--font-sm)] font-semibold text-[var(--text-primary)]">Trace Waterfall</div>
    <p className="mt-[var(--spacing-xs)] text-[var(--font-xs)] text-[var(--text-muted)]">Distributed trace timeline visualization</p>
    <div className="mt-[var(--spacing-sm)] text-[var(--font-xs)] text-[var(--text-secondary)]">{label || "Ready"}</div>
  </div>
));
TraceWaterfall.displayName = "TraceWaterfall";
export { TraceWaterfall };
