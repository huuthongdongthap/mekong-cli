// packages/web/src/components/layout/sidebar.tsx
//
// Dashboard sidebar. Desktop: persistent panel. Mobile: hamburger button that
// slides a Sheet (Base UI Drawer) over the viewport — the Drawer primitive
// provides focus trap, Escape dismissal and backdrop for free. Token-driven.

"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import {
  SheetClose,
  SheetContent,
  SheetCloseButton,
  SheetFooter,
  SheetHeader,
  SheetPortal,
  SheetRoot,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SidebarNav } from "./sidebar-nav"
import { cn } from "@/lib/utils"
import { visibleNavFor } from "./nav.config"

type UserSummary = { firstName?: string; lastName?: string; email?: string; role?: string } | null

export interface SidebarProps {
  user: UserSummary
  onLogout: () => void
  visibleNav: ReturnType<typeof visibleNavFor>
  className?: string
}

/** Persistent desktop sidebar. Hidden on mobile via `md:flex`. */
export function Sidebar({ user, onLogout, visibleNav, className = "" }: SidebarProps) {
  return (
    <aside
      className={cn(
        "w-56 shrink-0 border-r bg-sidebar flex flex-col",
        "hidden md:flex",
        className
      )}
    >
      <SidebarNav visibleNav={visibleNav} />
      <SidebarFooter user={user} onLogout={onLogout} visibleNav={visibleNav} />
    </aside>
  )
}

/** Mobile hamburger + sliding Sheet. The Drawer keeps focus trapped inside and
 * closes on Escape or backdrop click, so no manual a11y plumbing is needed. */
export function MobileSidebar({ user, onLogout, visibleNav, className = "" }: SidebarProps) {
  return (
    <SheetRoot>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-40 md:hidden"
            aria-label="Mở menu điều hướng"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </Button>
        }
      />
      <SheetPortal>
        <SheetContent
          data-side="left"
          className={cn(
            "w-56 max-w-[80vw] bg-sidebar border-r border-border shadow-xl",
            "data-[ending-style]:-translate-x-full data-[starting-style]:-translate-x-full",
            "transition-transform duration-200",
            className
          )}
        >
          <SheetHeader>
            <SheetCloseButton label="Đóng menu" />
          </SheetHeader>
          <div className="-mt-2">
            <SidebarNav visibleNav={visibleNav} />
          </div>
          <SheetFooter>
            <SidebarFooter user={user} onLogout={onLogout} visibleNav={visibleNav} />
          </SheetFooter>
        </SheetContent>
      </SheetPortal>
    </SheetRoot>
  )
}

function SidebarFooter({ user, onLogout, visibleNav }: SidebarProps) {
  return (
    <div className="p-3 border-t border-border space-y-2">
      {user && (
        <div className="px-3 py-1.5">
          <p className="text-sm font-medium truncate">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
      )}
      <div className="flex items-center justify-between px-3 py-1.5">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </Button>
      </div>
    </div>
  )
}