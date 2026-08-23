import Link from "next/link"
import { api } from "@/lib/api-client"
import { ArrowLeft } from "lucide-react"

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  draft: { label: "Nhap", cls: "bg-muted text-muted-foreground" },
  pending: { label: "Chờ duyệt", cls: "bg-[var(--status-yellow)] text-[var(--status-yellow-fg)]" },
  signed: { label: "Da ky", cls: "bg-[var(--status-blue)] text-[var(--status-blue-fg)]" },
  approved: { label: "Phe duyet", cls: "bg-[var(--status-purple)] text-[var(--status-purple-fg)]" },
  active: { label: "Hoạt động", cls: "bg-[var(--status-green)] text-[var(--status-green-fg)]" },
  expired: { label: "Hết hạn", cls: "bg-destructive/10 text-destructive" },
  cancelled: { label: "Huy", cls: "bg-muted text-muted-foreground" },
}

interface MoaDetail {
  id: number
  title: string
  scope?: string
  content?: string
  status: string
  school?: { id: string; name: string; code?: string }
  enterprise?: { id: number; name: string; code?: string }
  validFrom?: string
  validTo?: string
  signedDocUrl?: string
  createdAt: string
  updatedAt: string
}

export const dynamic = "force-dynamic"

async function getMoa(id: string): Promise<MoaDetail | null> {
  try {
    const r = await api.get<{ data: MoaDetail }>(`/moas/${id}`)
    return r.data ?? null
  } catch {
    return null
  }
}

export default async function MoaDetailPage({ params }: { params: { id: string } }) {
  const moa = await getMoa(params.id)

  if (!moa) {
    return (
      <div>
        <Link href="/moas" className="text-sm text-muted-foreground hover:underline mb-4 inline-block">
          <ArrowLeft className="h-4 w-4 inline mr-1" /> Quay lại
        </Link>
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">Không tìm thấy thỏa thuận #{params.id}</p>
        </div>
      </div>
    )
  }

  const s = STATUS_MAP[moa.status] ?? { label: moa.status, cls: "bg-muted" }

  return (
    <div>
      <Link href="/moas" className="text-sm text-muted-foreground hover:underline mb-4 inline-block">
        <ArrowLeft className="h-4 w-4 inline mr-1" /> Quay lại danh sach
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">{moa.title}</h2>
          <span className={"inline-flex rounded-full px-2 py-0.5 text-xs font-medium mt-1 " + s.cls}>{s.label}</span>
        </div>
        <Link href={`/moas/${moa.id}/edit`} className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-accent">
          Chinh sua
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border p-6">
            <h3 className="font-medium mb-4">Noi dung thoa thuan</h3>
            {moa.scope && (
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-1">Pham vi</p>
                <p className="text-sm whitespace-pre-wrap">{moa.scope}</p>
              </div>
            )}
            {moa.content && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Noi dung chi tiet</p>
                <p className="text-sm whitespace-pre-wrap">{moa.content}</p>
              </div>
            )}
          </div>
          {(moa.validFrom || moa.validTo) && (
            <div className="rounded-lg border p-6">
              <h3 className="font-medium mb-3">Thoi han</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Tu ngay</p>
                  <p>{moa.validFrom ? new Date(moa.validFrom).toLocaleDateString("vi-VN") : "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Den ngay</p>
                  <p>{moa.validTo ? new Date(moa.validTo).toLocaleDateString("vi-VN") : "—"}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border p-5">
            <h3 className="font-medium mb-3">Ben lien ket</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Truong</p>
                <p className="font-medium">{moa.school?.name ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Doanh nghiep</p>
                <p className="font-medium">{moa.enterprise?.name ?? "—"}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border p-5">
            <h3 className="font-medium mb-3">He thong</h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">ID</dt>
                <dd className="font-mono text-xs">#{moa.id}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Tao luc</dt>
                <dd>{new Date(moa.createdAt).toLocaleString("vi-VN")}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Cập nhật</dt>
                <dd>{new Date(moa.updatedAt).toLocaleString("vi-VN")}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
