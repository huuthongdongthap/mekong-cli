// packages/web/src/components/ui/separator.tsx
//
// Horizontal or vertical divider. Wraps Base UI's Separator primitive so the
// color is token-driven and consistent across modules.

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"
import { cn } from "@/lib/utils"

export function Separator({
  orientation = "horizontal",
  className = "",
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "w-full h-px" : "h-full w-px",
        className
      )}
    />
  )
}