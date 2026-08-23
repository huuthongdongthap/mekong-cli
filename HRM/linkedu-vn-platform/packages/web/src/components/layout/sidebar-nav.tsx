"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { NAV, visibleNavFor } from "./nav.config"

interface SidebarNavProps {
  visibleNav: ReturnType<typeof visibleNavFor>
  onNavClick?: () => void
}

export function SidebarNav({ visibleNav, onNavClick }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav className="flex-1 p-3 space-y-1" aria-label="Main navigation">
      {visibleNav.map((item) => {
        const Icon = item.icon
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavClick}
            className="block"
            aria-current={active ? "page" : undefined}
            aria-label={item.label}
          >
            <div
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                active ? "bg-primary text-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{item.label}</span>
            </div>
          </Link>
        )
      })}
    </nav>
  )
}
