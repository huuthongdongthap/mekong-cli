"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Root layout error:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h2 className="text-2xl font-semibold mb-2">Đã xảy ra lỗi</h2>
      <p className="text-sm text-muted-foreground mb-1">
        {error.message || "Lỗi không xác định"}
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
    </div>
  )
}
