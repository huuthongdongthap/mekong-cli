"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { DetailField } from "@/components/dashboard/detail-field"
import { documents, formatFileSize, DOCUMENT_TYPE_LABELS, MIME_ICONS, type Document } from "@/lib/api/documents"
import { ArrowLeft, Download, Trash2, ExternalLink } from "lucide-react"

export default function DocumentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [doc, setDoc] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        // Fetch by entity — we need to list all docs to find by id
        const res = await documents.listByEntity("learner", params.id)
        setDoc(res.data.find((d) => d.id === params.id) || null)
      } catch {}
      setLoading(false)
    }
    load()
  }, [params.id])

  async function handleDownload() {
    if (!doc) return
    try {
      const res = await documents.getSignedUrl(doc.id)
      window.open(res.data.url, "_blank")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lỗi tải file")
    }
  }

  async function handleDelete() {
    if (!doc) return
    if (!confirm("Xác nhận xóa tài liệu này?")) return
    try {
      await documents.delete(doc.id)
      toast.success("Đã xóa tài liệu")
      router.push("/documents")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lỗi xóa")
    }
  }

  if (loading) return <p className="text-muted-foreground">Đang tải...</p>
  if (!doc) return <p className="text-muted-foreground">Không tìm thấy tài liệu.</p>

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
            <Link href="/documents" className="hover:text-foreground">Tài liệu</Link>
            <span>/</span>
            <span className="text-foreground">{doc.originalFilename}</span>
          </nav>
          <h2 className="text-2xl font-semibold">{doc.originalFilename}</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-md border px-4 py-2 text-sm hover:bg-accent">
            <Download className="h-4 w-4" /> Tải xuống
          </button>
          <button onClick={handleDelete}
            className="inline-flex items-center gap-1.5 rounded-md border border-destructive/20 px-4 py-2 text-sm text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" /> Xóa
          </button>
          <Link href="/documents"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Quay lại
          </Link>
        </div>
      </div>

      <div className="rounded-lg border p-6">
        <h3 className="font-medium mb-4">Thông tin tài liệu</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <DetailField label="Tên file" labelWidth="w-32">
            <span className="flex items-center gap-1.5">
              {MIME_ICONS[doc.mimeType] || "📄"} {doc.originalFilename}
            </span>
          </DetailField>
          <DetailField label="Kích thước" labelWidth="w-32">{formatFileSize(doc.fileSize)}</DetailField>
          <DetailField label="Loại" labelWidth="w-32">{DOCUMENT_TYPE_LABELS[doc.documentType] || doc.documentType}</DetailField>
          <DetailField label="MIME" labelWidth="w-32"><code className="text-xs">{doc.mimeType}</code></DetailField>
          <DetailField label="Đối tượng" labelWidth="w-32">{doc.entityType} / {doc.entityId.slice(0, 8)}</DetailField>
          <DetailField label="SHA256" labelWidth="w-32"><code className="text-xs break-all">{doc.sha256Hash.slice(0, 16)}...</code></DetailField>
          <DetailField label="Ngày tạo" labelWidth="w-32">{new Date(doc.createdAt).toLocaleDateString("vi-VN")}</DetailField>
        </dl>
        {doc.metadata && Object.keys(doc.metadata).length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-1">Metadata:</p>
            <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">{JSON.stringify(doc.metadata, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
