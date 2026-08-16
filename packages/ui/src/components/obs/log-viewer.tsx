"use client";
import * as React from "react";
import { cn } from "../../lib/utils";
export interface LogViewerProps extends React.HTMLAttributes<HTMLDivElement> { label?: string; }
const LogViewer = React.forwardRef<HTMLDivElement, LogViewerProps>(({ className, label, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-card)] p-[var(--spacing-lg)]", className)} {...props}>
    <div className="text-[var(--font-sm)] font-semibold text-[var(--text-primary)]">Log Viewer</div>
    <p className="mt-[var(--spacing-xs)] text-[var(--font-xs)] text-[var(--text-muted)]">Structured log stream viewer</p>
    <div className="mt-[var(--spacing-sm)] text-[var(--font-xs)] text-[var(--text-secondary)]">{label || "Ready"}</div>
  </div>
));
LogViewer.displayName = "LogViewer";
export { LogViewer };
