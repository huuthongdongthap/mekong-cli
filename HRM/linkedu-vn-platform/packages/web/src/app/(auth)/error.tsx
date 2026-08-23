"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Auth error:", error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-md bg-card rounded-xl border border-border shadow-sm p-8 text-center">
        <h2 className="text-xl font-semibold text-card-foreground mb-2">
          Lỗi xác thực
        </h2>
        <p className="text-sm text-muted-foreground mb-1">
          {error.message || "Không thể tải trang xác thực"}
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground/70 mb-6 font-mono">
            Ref: {error.digest}
          </p>
        )}
        <div className="flex items-center justify-center gap-3 mt-6">
          <Button variant="outline" size="sm" onClick={reset}>
            <RefreshCw className="h-4 w-4 mr-2" /> Thử lại
          </Button>
          <Link href="/login">
            <Button variant="default" size="sm">
              Đăng nhập
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
