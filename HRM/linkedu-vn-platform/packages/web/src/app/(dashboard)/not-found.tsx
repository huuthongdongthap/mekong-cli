import Link from "next/link"

export default function DashboardNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h2 className="text-2xl font-semibold mb-2">Không tìm thấy trang</h2>
      <p className="text-muted-foreground mb-6">Trang bạn tìm không tồn tại trong bảng điều khiển.</p>
      <Link href="/" className="text-sm text-primary hover:underline">Về trang chủ</Link>
    </div>
  )
}
