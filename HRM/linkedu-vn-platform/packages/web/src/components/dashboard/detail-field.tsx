/** Reusable detail list field: label + value in a flex row. */

interface DetailFieldProps {
  label: string
  children: React.ReactNode
  labelWidth?: string
}

export function DetailField({ label, children, labelWidth = "w-36" }: DetailFieldProps) {
  return (
    <div className="flex">
      <dt className={`${labelWidth} text-muted-foreground`}>{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}
