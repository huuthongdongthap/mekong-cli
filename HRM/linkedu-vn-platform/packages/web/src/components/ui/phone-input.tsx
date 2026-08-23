"use client"

import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { formatVnPhone, isValidVnPhone, parseVnPhone } from "@/lib/utils/format"

export function PhoneInput({ name, label, placeholder = "0xx xxx xxxx" }: { name: string; label: string; placeholder?: string }) {
  const { register, setValue, watch } = useFormContext()
  const rawValue = watch(name) ?? ""
  const [display, setDisplay] = useState(() => formatVnPhone(String(rawValue)))

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        {...register(name, {
          validate: (v) => {
            if (!v || v === "") return undefined
            return isValidVnPhone(v) || "Số điện thoại không hợp lệ (0xxxxxxxxx)"
          },
        })}
        value={display}
        onChange={(e) => setDisplay(formatVnPhone(e.target.value))}
        onBlur={() => {
          const parsed = parseVnPhone(display)
          setDisplay(formatVnPhone(parsed))
          setValue(name, parsed)
        }}
        className="w-full rounded-md border px-3 py-2 text-sm"
        placeholder={placeholder}
      />
    </div>
  )
}