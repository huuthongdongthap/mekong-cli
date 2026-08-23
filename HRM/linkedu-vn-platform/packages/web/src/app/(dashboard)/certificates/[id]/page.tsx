'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api-client'
import { ArrowLeft, Download, Loader2 } from 'lucide-react'

const M = {
  draft: { l: 'Nhap', c: 'bg-muted text-muted-foreground' },
  issued: { l: 'Đã cấp', c: 'bg-[var(--status-green)] text-[var(--status-green-fg)]' },
  revoked: { l: 'Thu hồi', c: 'bg-destructive/10 text-destructive' },
} as const

interface CertificateDetail {
  status?: string
  certificateNumber?: string
  certificateUrl?: string | null
  learnerId?: string
  learner?: { fullName?: string } | null
  issueDate?: string | null
  enterprise?: { name?: string; taxCode?: string | null } | null
  program?: { name?: string; field?: string | null } | null
  revokedAt?: string | null
  revokedReason?: string | null
}

export default function CertDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [item, setItem] = useState<CertificateDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<{ data: CertificateDetail }>(`/internship-certificates/${params.id}`)
      .then((r) => setItem(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground/70" /></div>
  if (!item) return (
    <div>
      <p className="text-muted-foreground">Không tìm thấy chứng chỉ.</p>
      <Link href="/certificates" className="text-sm text-primary hover:underline mt-2 block">Quay lại</Link>
    </div>
  )

  const s = M[item.status as keyof typeof M] || { l: item.status, c: 'bg-muted' }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-md border hover:bg-accent"><ArrowLeft className="h-4 w-4" /></button>
          <div>
            <h2 className="text-2xl font-semibold">{item.certificateNumber}</h2>
            <span className={"inline-flex rounded-full px-2 py-0.5 text-xs font-medium " + s.c}>{s.l}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/certificates/${params.id}/edit`} className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-accent">
            Chỉnh sửa
          </Link>
          {item.certificateUrl && (
            <a href={item.certificateUrl} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-accent">
              <Download className="h-4 w-4" /> Tai PDF
            </a>
          )}
        </div>
      </div>

      <div className="rounded-lg border p-6 space-y-4">
        {item.learner && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Nguoi hoc</p>
              <Link href={"/learners/" + item.learnerId} className="text-primary hover:underline">{item.learner.fullName}</Link>
            </div>
            {item.issueDate && <p className="text-sm">{new Date(item.issueDate).toLocaleDateString('vi-VN')}</p>}
          </div>
        )}
        {item.enterprise && (
          <div>
            <p className="text-sm text-muted-foreground">Doanh nghiep</p>
            <p className="font-medium">{item.enterprise.name}</p>
            {item.enterprise.taxCode && <p className="text-xs text-muted-foreground">MST: {item.enterprise.taxCode}</p>}
          </div>
        )}
        {item.program && (
          <div>
            <p className="text-sm text-muted-foreground">Chuong trinh</p>
            <p className="font-medium">{item.program.name}</p>
            {item.program.field && <p className="text-xs text-muted-foreground">Linh vuc: {item.program.field}</p>}
          </div>
        )}
        {item.revokedAt && (
          <div className="border-t pt-4">
            <p className="text-sm text-destructive">Thu hồi lúc: {new Date(item.revokedAt).toLocaleString('vi-VN')}</p>
            {item.revokedReason && <p className="text-sm text-muted-foreground">Ly do: {item.revokedReason}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
