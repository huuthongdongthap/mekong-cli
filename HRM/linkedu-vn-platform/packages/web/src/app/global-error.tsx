"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Global error (root layout):", error)
  }, [error])

  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
        <h1 className="text-4xl font-bold mb-4">Lỗi hệ thống</h1>
        <p className="text-muted-foreground mb-1">
          {error.message || "Đã xảy ra lỗi không xác định"}
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground/70 mb-6 font-mono">
            Ref: {error.digest}
          </p>
        )}
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={reset}>
            <RefreshCw className="h-4 w-4 mr-2" /> Thử lại
          </Button>
          <Link href="/">
            <Button variant="default" size="sm">Về trang chủ</Button>
          </Link>
        </div>
      </body>
    </html>
  )
}
