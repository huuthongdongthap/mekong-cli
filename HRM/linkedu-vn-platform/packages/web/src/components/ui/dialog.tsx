// packages/web/src/components/ui/dialog.tsx
//
// Modal dialog built on Base UI's Dialog primitive. Token-driven styling, focus
// trap + backdrop click-to-close handled by the primitive.

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export const DialogRoot = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close
export const DialogPortal = DialogPrimitive.Portal
export const DialogTitle = DialogPrimitive.Title
export const DialogDescription = DialogPrimitive.Description

export function DialogViewport({ className = "", ...props }: DialogPrimitive.Viewport.Props) {
  return <DialogPrimitive.Viewport className={cn("p-4", className)} {...props} />
}

export function DialogPopup({
  className = "",
  ...props
}: DialogPrimitive.Popup.Props) {
  return (
    <DialogPrimitive.Popup
      className={cn(
        "relative w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-lg text-card-foreground",
        "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        "data-[ending-style]:scale-95 data-[starting-style]:scale-95",
        "transition-[opacity,transform] duration-200",
        className
      )}
      {...props}
    />
  )
}

export function DialogHeader({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-1.5 pb-4 border-b border-border mb-4", className)} {...props} />
  )
}

export function DialogFooter({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex justify-end gap-2 pt-4 border-t border-border mt-4", className)} {...props} />
  )
}

export function DialogCloseButton({
  label = "Đóng",
  className = "",
  ...props
}: DialogPrimitive.Close.Props & { label?: string }) {
  return (
    <DialogPrimitive.Close
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
    </DialogPrimitive.Close>
  )
}