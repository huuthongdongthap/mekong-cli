"use client";
import * as React from "react";
import { cn } from "../../lib/utils";
export interface OncallRosterProps extends React.HTMLAttributes<HTMLDivElement> { label?: string; }
const OncallRoster = React.forwardRef<HTMLDivElement, OncallRosterProps>(({ className, label, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-card)] p-[var(--spacing-lg)]", className)} {...props}>
    <div className="text-[var(--font-sm)] font-semibold text-[var(--text-primary)]">On-Call Roster</div>
    <p className="mt-[var(--spacing-xs)] text-[var(--font-xs)] text-[var(--text-muted)]">Current on-call rotation and schedule</p>
    <div className="mt-[var(--spacing-sm)] text-[var(--font-xs)] text-[var(--text-secondary)]">{label || "Ready"}</div>
  </div>
));
OncallRoster.displayName = "OncallRoster";
export { OncallRoster };
