// packages/web/src/components/ui/drawer.tsx
//
// Slide-in panel for mobile create/edit flows and filter panels. Built on
// Base UI's Drawer primitive (swipe + escape + focus trap) with token-driven
// styling pinned to the right edge.

import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export const DrawerRoot = DrawerPrimitive.Root
export const DrawerTrigger = DrawerPrimitive.Trigger
export const DrawerClose = DrawerPrimitive.Close
export const DrawerPortal = DrawerPrimitive.Portal
export const DrawerTitle = DrawerPrimitive.Title
export const DrawerDescription = DrawerPrimitive.Description

export function DrawerViewport({ className = "", ...props }: DrawerPrimitive.Viewport.Props) {
  return <DrawerPrimitive.Viewport className={cn("p-4", className)} {...props} />
}

export function DrawerContent({
  className = "",
  ...props
}: DrawerPrimitive.Content.Props) {
  return (
    <DrawerPrimitive.Content
      data-side="right"
      className={cn(
        "fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l border-border bg-card p-6 shadow-lg",
        "data-[ending-style]:translate-x-full data-[starting-style]:translate-x-full",
        "transition-transform duration-200",
        className
      )}
      {...props}
    />
  )
}

export function DrawerCloseButton({
  label = "Đóng",
  className = "",
  ...props
}: DrawerPrimitive.Close.Props & { label?: string }) {
  return (
    <DrawerPrimitive.Close
      className={cn(
        "absolute right-3 top-3 inline-flex size-7 items-center justify-center rounded-md",
        "text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        className
      )}
      aria-label={label}
      {...props}
    >
      <X className="size-4" />
    </DrawerPrimitive.Close>
  )
}

export function DrawerHeader({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-1.5 pb-4 border-b border-border mb-4", className)} {...props} />
  )
}

export function DrawerFooter({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex justify-end gap-2 pt-4 border-t border-border mt-4", className)} {...props} />
  )
}