// packages/web/src/components/ui/sheet.tsx
//
// Full-screen slide-over panel (mobile sidebar / action sheet). Built on Base UI's
// Drawer primitive but forced to cover full viewport height. Token-driven styling.

import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export const SheetRoot = DrawerPrimitive.Root
export const SheetTrigger = DrawerPrimitive.Trigger
export const SheetClose = DrawerPrimitive.Close
export const SheetPortal = DrawerPrimitive.Portal
export const SheetTitle = DrawerPrimitive.Title
export const SheetDescription = DrawerPrimitive.Description

export function SheetViewport({ className = "", ...props }: DrawerPrimitive.Viewport.Props) {
  return <DrawerPrimitive.Viewport className={cn("p-4", className)} {...props} />
}

export function SheetContent({
  className = "",
  ...props
}: DrawerPrimitive.Content.Props) {
  return (
    <DrawerPrimitive.Content
      data-side="right"
      className={cn(
        "fixed inset-0 z-50 w-full max-w-sm border-l border-border bg-card p-6 shadow-lg",
        "data-[ending-style]:translate-x-full data-[starting-style]:translate-x-full",
        "transition-transform duration-300",
        className
      )}
      {...props}
    />
  )
}

export function SheetCloseButton({
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

export function SheetHeader({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-1.5 pb-4 border-b border-border mb-4", className)} {...props} />
  )
}

export function SheetFooter({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex justify-end gap-2 pt-4 border-t border-border mt-4", className)} {...props} />
  )
}