// packages/web/src/components/ui/popover.tsx
//
// Floating panel anchored to a trigger (filter panels, date pickers, hints).
// Built on Base UI's Popover primitive so positioning, focus management and
// outside-click dismissal are handled for free. Token-driven styling.

import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export const PopoverRoot = PopoverPrimitive.Root
export const PopoverTrigger = PopoverPrimitive.Trigger
export const PopoverClose = PopoverPrimitive.Close
export const PopoverPortal = PopoverPrimitive.Portal
export const PopoverTitle = PopoverPrimitive.Title
export const PopoverDescription = PopoverPrimitive.Description

export interface PopoverContentProps {
  className?: string
  children?: React.ReactNode
}

export function PopoverContent({ className = "", children }: PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        side="bottom"
        align="start"
        sideOffset={4}
        className="z-50"
      >
        <PopoverPrimitive.Popup
          className={cn(
            "w-72 rounded-md border border-border bg-popover p-3 shadow-md text-popover-foreground",
            "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[starting-style]:scale-95",
            "transition-[opacity,transform] duration-150",
            className
          )}
        >
          {children}
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

export function PopoverHeader({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center justify-between mb-2", className)} {...props} />
  )
}

export function PopoverCloseButton({
  label = "Đóng",
  className = "",
  ...props
}: PopoverPrimitive.Close.Props & { label?: string }) {
  return (
    <PopoverPrimitive.Close
      className={cn(
        "inline-flex size-6 items-center justify-center rounded-md text-muted-foreground",
        "hover:bg-muted hover:text-foreground transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        className
      )}
      aria-label={label}
      {...props}
    >
      <X className="size-3.5" />
    </PopoverPrimitive.Close>
  )
}