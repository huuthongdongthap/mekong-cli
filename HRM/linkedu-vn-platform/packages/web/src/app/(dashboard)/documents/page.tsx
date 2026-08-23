"use client"
import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"
import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { AlertCircle, Plus } from "lucide-react"
import type { ApiDoc } from "./types"
import { DocumentsTable } from "./components/documents-table"

export default function DocumentsPage() {
  const [docs, setDocs] = useState<ApiDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [entityType, setEntityType] = useState("learner")
  const [entityId, setEntityId] = useState("")
  const [docTypeFilter, setDocTypeFilter] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  async function load() {
    try {
      setLoading(true)
      if (!entityType || !entityId) { setDocs([]); return }
      const path = docTypeFilter
        ? `/documents/entity/${entityType}/${entityId}/type/${docTypeFilter}`
        : `/documents/entity/${entityType}/${entityId}`
      const res = await api.get<ApiDoc[]>(path)
      setDocs(Array.isArray(res) ? res : [])
      setError(null)
    } catch (err) { setError(err instanceof Error ? err.message : "Lỗi tải tài liệu") }
    finally { setLoading(false) }
  }

  useEffect(() => {
    if (!entityId) return
    let cancelled = false
    ;(async () => {
      await load()
      void cancelled
    })()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load closes over the current filters
  }, [entityType, entityId, docTypeFilter])

  const onUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    const file = fileRef.current?.files?.[0]
    if (!file || !entityId) return
    setSending(true)
    try {
      const form = new FormData()
      form.set("file", file); form.set("entityType", entityType); form.set("entityId", entityId)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1"}/documents/upload`, {
        method: "POST", headers: { Authorization: `Bearer ${api.getToken()}` }, body: form, credentials: "include",
      })
      if (!res.ok) throw new Error("Upload failed")
      toast.success("Tải lên thành công"); await load()
      if (fileRef.current) fileRef.current.value = ""
    } catch (err) { setError(err instanceof Error ? err.message : "Upload lỗi") }
    finally { setSending(false) }
  }

  const onDelete = async (id: string) => {
    if (!confirm("Xóa tài liệu?")) return
    try { await api.delete(`/documents/${id}`); toast.success("Đã xóa"); setDocs((prev) => prev.filter((d) => d.id !== id)) }
    catch (err) { setError(err instanceof Error ? err.message : "Xóa lỗi") }
  }

  const onDownload = async (id: string) => {
    try {
      const r = await api.get<{ url?: string }>(`/documents/${id}/signed-url`)
      if (r?.url) window.open(r.url, "_blank")
    }
    catch { setError("Không lấy được link tải") }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tài liệu</h1>
        <Link href="/documents/upload"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Tải lên mới
        </Link>
      </div>
      <Card className="p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-muted-foreground">Loại thực thể</label>
            <select className="mt-1 w-full border rounded-md px-3 py-2 text-sm" value={entityType} onChange={(e) => setEntityType(e.target.value)}>
              <option value="learner">Người học</option><option value="school">Trường</option><option value="enterprise">Doanh nghiệp</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Entity ID</label>
            <input className="mt-1 w-full border rounded-md px-3 py-2 text-sm" value={entityId} onChange={(e) => setEntityId(e.target.value)} placeholder="uuid..." />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Lọc loại tài liệu</label>
            <select className="mt-1 w-full border rounded-md px-3 py-2 text-sm" value={docTypeFilter} onChange={(e) => setDocTypeFilter(e.target.value)}>
              <option value="">Tất cả</option><option value="cv">CV</option><option value="certificate">Chứng chỉ</option>
              <option value="contract">Hợp đồng</option><option value="report">Báo cáo</option>
              <option value="transcript">Học bạ</option><option value="mou">MOU</option><option value="other">Khác</option>
            </select>
          </div>
        </div>
        <form onSubmit={onUpload} className="flex items-center gap-3">
          <input ref={fileRef} type="file" className="text-sm" />
          <Button type="submit" size="sm" disabled={sending || !entityId}>{sending ? "Đang tải..." : "Tải lên"}</Button>
          <Button type="button" size="sm" variant="outline" onClick={load}>Làm mới</Button>
        </form>
      </Card>
      {error && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}
      <Card className="p-0 overflow-hidden">
        {loading ? <p className="p-4 text-sm text-muted-foreground">Đang tải...</p>
          : docs.length === 0 ? <p className="p-4 text-sm text-muted-foreground">Chưa có tài liệu.</p>
          : <DocumentsTable docs={docs} onDownload={onDownload} onDelete={onDelete} />}
      </Card>
    </div>
  )
}