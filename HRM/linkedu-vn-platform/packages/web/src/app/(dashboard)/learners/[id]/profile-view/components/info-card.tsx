import type { ReactNode } from "react"

export function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border p-5">
      <h3 className="font-medium mb-3">{title}</h3>
      <dl className="space-y-2 text-sm">{children}</dl>
    </div>
  )
}

export function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex">
      <dt className="w-32 text-muted-foreground">{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}