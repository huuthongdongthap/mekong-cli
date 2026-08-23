"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Dashboard error:", error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-lg bg-card rounded-xl border border-border shadow-sm p-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
        </div>

        <h2 className="text-xl font-semibold text-card-foreground mb-2">
          Đã xảy ra lỗi
        </h2>
        <p className="text-sm text-muted-foreground mb-1">
          {error.message || "Lỗi không xác định"}
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground/70 mb-6 font-mono">
            Ref: {error.digest}
          </p>
        )}

        <div className="flex items-center justify-center gap-3 mt-6">
          <Button variant="outline" size="sm" onClick={reset}>
            Thử lại
          </Button>
          <Link href="/">
            <Button variant="default" size="sm">
              Về trang chủ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
