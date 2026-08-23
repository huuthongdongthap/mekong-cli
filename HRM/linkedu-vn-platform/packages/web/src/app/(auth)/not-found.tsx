import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AuthNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-md bg-card rounded-xl border border-border shadow-sm p-8 text-center">
        <h2 className="text-5xl font-bold text-muted-foreground/30 mb-4">404</h2>
        <p className="text-muted-foreground mb-6">
          Trang không tồn tại
        </p>
        <Link href="/login">
          <Button variant="default" size="sm">
            Về trang đăng nhập
          </Button>
        </Link>
      </div>
    </div>
  )
}
