import { ReactNode } from "react"

interface CardProps {
  children: ReactNode
  variant?: "elevated" | "outlined"
  className?: string
  padding?: "none" | "sm" | "md" | "lg"
}

const pad = { none: "", sm: "p-3", md: "p-5", lg: "p-6" }
const base = "rounded-lg border border-border bg-card text-card-foreground"
const variant = { elevated: "shadow-sm", outlined: "" }

export function Card({ children, variant: v = "elevated", className = "", padding = "md" }: CardProps) {
  return <div className={`${base} ${variant[v]} ${pad[padding]} ${className}`}>{children}</div>
}

export function CardHeader({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mb-3 ${className}`}>{children}</div>
}

export function CardTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h3 className={`font-medium text-foreground ${className}`}>{children}</h3>
}

export function CardBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}
