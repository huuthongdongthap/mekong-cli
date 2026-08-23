import Link from "next/link"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h2 className="text-6xl font-bold text-muted-foreground/50 mb-4">404</h2>
      <p className="text-lg text-muted-foreground mb-6">
        Không tìm thấy trang này
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
      >
        <Home className="h-4 w-4" /> Về trang chủ
      </Link>
    </div>
  )
}
