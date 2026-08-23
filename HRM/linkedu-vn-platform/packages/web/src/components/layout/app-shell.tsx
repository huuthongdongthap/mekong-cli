// packages/web/src/components/layout/app-shell.tsx
//
// Dashboard shell. Replaces the old `DashboardShell` (which lived inside the
// route layout and mixed auth checks with layout markup). Auth state comes
// exclusively from `useAuthStore` — no direct `localStorage` reads. The shell
// renders a top bar, a persistent desktop sidebar and a mobile Sheet drawer,
// with `<main id="main-content">` as the skip-link target.

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { TopBar } from "./top-bar"
import { Sidebar, MobileSidebar } from "./sidebar"
import { Role, visibleNavFor } from "./nav.config"

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { loading, user, initialized, hydrate } = useAuthStore()

  // Hydrate the store from the persisted token once. `useAuthStore` already
  // seeds `token` from localStorage on creation; this fetches the profile.
  useEffect(() => {
    if (!initialized) hydrate()
  }, [initialized, hydrate])

  // Redirect to login when there is no token and the store has finished
  // loading. Reads `token` from the store, never from localStorage directly.
  useEffect(() => {
    const token = useAuthStore.getState().token
    if (!token && !loading && initialized) router.replace("/login")
  }, [loading, initialized, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
      </div>
    )
  }

  const visibleNav = visibleNavFor((user?.role ?? "") as Role)

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Skip link: WCAG 2.1 SC 2.4.1 — keyboard users jump past the chrome. */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:inline-flex focus:items-center focus:gap-1 focus:rounded-md focus:bg-primary focus:px-3 focus:py-1.5 focus:text-sm focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
      >
        Bỏ qua đến nội dung chính
      </a>
      <MobileSidebar user={user} onLogout={() => useAuthStore.getState().logout()} visibleNav={visibleNav} />
      <Sidebar user={user} onLogout={() => useAuthStore.getState().logout()} visibleNav={visibleNav} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar user={user} onLogout={() => useAuthStore.getState().logout()} />
        <main id="main-content" className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}