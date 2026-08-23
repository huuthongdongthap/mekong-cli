// packages/web/src/components/dashboard/form-input.tsx
//
// Reusable labeled text/number/select input used by pricing settings forms.
// Keeps each field to one line instead of a 3-line inline label + input block.

import { forwardRef } from "react"

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  required?: boolean
  error?: string
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  function FormInput({ label, required, error, ...props }, ref) {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </label>
        <input
          ref={ref}
          className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
          {...props}
        />
        {error && <span className="text-xs text-destructive">{error}</span>}
      </div>
    )
  }
)

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  required?: boolean
}

export function FormSelect({ label, required, ...props }: FormSelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      <select
        className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 bg-card"
        {...props}
      />
    </div>
  )
}