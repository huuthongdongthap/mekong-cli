// packages/web/src/components/ui/tabs.tsx
//
// Horizontal tabs with an animated underline indicator. Built on Base UI's
// Tabs primitive so keyboard arrow navigation + activation semantics are
// handled for free. Token-driven styling.

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cn } from "@/lib/utils"

export const TabsRoot = TabsPrimitive.Root
export const TabsList = TabsPrimitive.List
export const TabsTab = TabsPrimitive.Tab
export const TabsPanel = TabsPrimitive.Panel
export const TabsIndicator = TabsPrimitive.Indicator

export function TabList({ className = "", ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      className={cn(
        "flex items-center gap-1 border-b border-border",
        className
      )}
      {...props}
    />
  )
}

export function Tab({
  value,
  children,
  className = "",
  ...props
}: TabsPrimitive.Tab.Props & { value: string }) {
  return (
    <TabsPrimitive.Tab
      value={value}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground",
        "border-b-2 border-transparent -mb-px transition-colors",
        "hover:text-foreground",
        "data-[selected]:text-foreground data-[selected]:border-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-t-sm",
        className
      )}
      {...props}
    >
      {children}
    </TabsPrimitive.Tab>
  )
}

export function TabPanel({ value, className = "", ...props }: TabsPrimitive.Panel.Props & { value: string }) {
  return (
    <TabsPrimitive.Panel
      value={value}
      className={cn("focus-visible:outline-none", className)}
      {...props}
    />
  )
}

export function TabIndicator({ className = "", ...props }: TabsPrimitive.Indicator.Props) {
  return (
    <TabsPrimitive.Indicator
      className={cn(
        "absolute bottom-0 left-0 h-0.5 w-full bg-primary transition-[left,width] duration-200",
        className
      )}
      {...props}
    />
  )
}