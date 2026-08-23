"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export default function EnrollmentDetailError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("Enrollment detail error:", error) }, [error])
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h2 className="text-2xl font-semibold mb-2">Lỗi tải tuyển sinh</h2>
      <p className="text-muted-foreground mb-1">{error.message || "Đã xảy ra lỗi"}</p>
      {error.digest && <p className="text-xs text-muted-foreground/70 mb-6 font-mono">Ref: {error.digest}</p>}
      <div className="flex gap-3">
        <Button variant="outline" size="sm" onClick={reset}><RefreshCw className="h-4 w-4 mr-2" /> Thử lại</Button>
        <Link href="/enrollments"><Button variant="default" size="sm">Danh sách</Button></Link>
      </div>
    </div>
  )
}
