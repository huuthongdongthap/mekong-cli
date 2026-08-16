"use client";
import * as React from "react";
import { cn } from "../../lib/utils";
export interface CandidateCardProps extends React.HTMLAttributes<HTMLDivElement> { label?: string; }
const CandidateCard = React.forwardRef<HTMLDivElement, CandidateCardProps>(({ className, label, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-card)] p-[var(--spacing-lg)]", className)} {...props}>
    <div className="text-[var(--font-sm)] font-semibold text-[var(--text-primary)]">Candidate Card</div>
    <div className="mt-[var(--spacing-sm)] text-[var(--font-xs)] text-[var(--text-muted)]">{label || "Component ready"}</div>
  </div>
));
CandidateCard.displayName = "CandidateCard";
export { CandidateCard };
