// packages/web/src/components/ui/dropdown-menu.tsx
//
// Row-action menu (edit / delete / view / export ...). Built on Base UI's Menu
// primitive so arrow-key navigation, focus restoration and outside-click
// dismissal are handled for free. Token-driven styling.

import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { Check, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export const DropdownRoot = MenuPrimitive.Root
export const DropdownTrigger = MenuPrimitive.Trigger
export const DropdownPortal = MenuPrimitive.Portal
export const DropdownSeparator = MenuPrimitive.Separator

export interface DropdownContentProps {
  className?: string
  children?: React.ReactNode
}

export function DropdownContent({ className = "", children }: DropdownContentProps) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        side="bottom"
        align="start"
        sideOffset={4}
        className="z-50"
      >
        <MenuPrimitive.Popup
          className={cn(
            "min-w-[160px] rounded-md border border-border bg-popover p-1 shadow-md text-popover-foreground",
            "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[starting-style]:scale-95",
            "transition-[opacity,transform] duration-150",
            className
          )}
        >
          {children}
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

export function DropdownItem({
  className = "",
  ...props
}: MenuPrimitive.Item.Props) {
  return (
    <MenuPrimitive.Item
      className={cn(
        "flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none cursor-pointer",
        "text-popover-foreground",
        "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
        "data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
        className
      )}
      {...props}
    />
  )
}

export function DropdownLabel({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-2 py-1.5 text-xs font-semibold text-muted-foreground", className)} {...props} />
  )
}

export function DropdownSeparatorItem() {
  return <MenuPrimitive.Separator className="my-1 h-px bg-border" />
}

export function DropdownCheckItem({
  checked,
  className = "",
  ...props
}: MenuPrimitive.CheckboxItem.Props & { checked?: boolean }) {
  return (
    <MenuPrimitive.CheckboxItem
      checked={checked}
      className={cn(
        "flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none cursor-pointer",
        "text-popover-foreground",
        "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
        className
      )}
      {...props}
    >
      <span className="size-4 flex items-center justify-center text-primary">
        {checked ? <Check className="size-3.5" /> : null}
      </span>
      <span className="flex-1">{props.children}</span>
    </MenuPrimitive.CheckboxItem>
  )
}

export interface DropdownSubItemProps extends MenuPrimitive.SubmenuRoot.Props {
  className?: string
}

export function DropdownSubItem({ className = "", children, ...props }: DropdownSubItemProps) {
  return (
    <MenuPrimitive.SubmenuRoot {...props}>
      <div className={cn("relative", className)}>
        <MenuPrimitive.SubmenuTrigger
          className={cn(
            "flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none cursor-pointer",
            "text-popover-foreground",
            "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
          )}
        >
          <span className="flex-1">{children}</span>
          <ChevronRight className="size-3.5 text-muted-foreground" />
        </MenuPrimitive.SubmenuTrigger>
      </div>
    </MenuPrimitive.SubmenuRoot>
  )
}