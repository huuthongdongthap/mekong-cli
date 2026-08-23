// packages/web/src/components/ui/tooltip.tsx
//
// Hover/focus hint anchored to a trigger element. Built on Base UI's Tooltip
// primitive so positioning, arrow alignment and open/close timing are handled
// for free. Token-driven styling.

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
import { cn } from "@/lib/utils"

import { cloneElement } from "react"

export const TooltipRoot = TooltipPrimitive.Root
export const TooltipTrigger = TooltipPrimitive.Trigger
export const TooltipPopup = TooltipPrimitive.Popup
export const TooltipPortal = TooltipPrimitive.Portal
export const TooltipPositioner = TooltipPrimitive.Positioner
export const TooltipArrow = TooltipPrimitive.Arrow

export interface TooltipProps {
  content: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  delay?: number
  defaultOpen?: boolean
  children: React.ReactNode
  className?: string
}

/**
 * Extra props merged onto the trigger child. Typed loosely because Base UI's
 * `render` prop accepts a ReactElement whose props are not statically known;
 * `className` is concatenated so callers can layer styles on top of the
 * child's own classes.
 */
type ExtraTriggerProps = Partial<TooltipPrimitive.Trigger.Props<unknown>> & {
  className?: string
  "data-tooltip-trigger"?: string
}

/**
 * Merge extra props onto the trigger child without clobbering its existing
 * props. `className` is concatenated so callers can layer styles on top of
 * the child's own classes.
 */
function mergeTriggerProps(
  node: React.ReactNode,
  extra: ExtraTriggerProps,
): React.ReactElement {
  const el = node as React.ReactElement
  const existing = (el.props ?? {}) as ExtraTriggerProps
  const merged: ExtraTriggerProps = {
    ...existing,
    ...extra,
    className: cn(existing.className, extra.className),
  }
  // `cloneElement`'s overloads require the merged props to satisfy
  // `HTMLAttributes`, which Base UI's trigger props do not. Cast to the
  // element's own prop shape so the merge is type-checked but the
  // overload resolution is bypassed.
  return cloneElement(el, merged as React.HTMLAttributes<HTMLElement>)
}

/**
 * Composite tooltip. The trigger child must be a single element; it gets the
 * tooltip's open/close handlers merged in via the render prop.
 */
export function Tooltip({
  content,
  side = "top",
  align = "center",
  delay = 600,
  defaultOpen = false,
  children,
  className = "",
}: TooltipProps) {
  return (
    <TooltipPrimitive.Root defaultOpen={defaultOpen}>
      <TooltipPrimitive.Trigger
        delay={delay}
        render={mergeTriggerProps(children, {
          "data-tooltip-trigger": "",
          className,
        }) as React.ReactElement}
      />
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Positioner side={side} align={align} sideOffset={6} className="z-50">
          <TooltipPrimitive.Popup
            className={cn(
              "max-w-xs rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md",
              "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[starting-style]:scale-95",
              "transition-[opacity,transform] duration-150",
              className
            )}
          >
            {content}
          </TooltipPrimitive.Popup>
        </TooltipPrimitive.Positioner>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}