"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { documents, DOCUMENT_TYPE_LABELS, formatFileSize } from "@/lib/api/documents"
import { ArrowLeft, Upload, File, X } from "lucide-react"

const ALLOWED_TYPES = [
  "application/pdf", "image/png", "image/jpeg", "image/jpg",
  "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]
const MAX_SIZE = 50 * 1024 * 1024

export default function UploadDocumentPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    entityType: "learner", entityId: "",
    documentType: "OTHER", notes: "",
  })

  function handleFileSelect(f: File | null) {
    if (!f) return
    if (!ALLOWED_TYPES.includes(f.type)) {
      toast.error("Loại file không hỗ trợ"); return
    }
    if (f.size > MAX_SIZE) {
      toast.error(`File quá lớn (${formatFileSize(f.size)}). Tối đa 50MB.`); return
    }
    setFile(f)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragging(false)
    handleFileSelect(e.dataTransfer.files[0] || null)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault(); setDragging(true)
  }

  async function handleUpload() {
    if (!file || !form.entityId) {
      toast.error("Chọn file và nhập mã đối tượng"); return
    }
    setUploading(true)
    try {
      await documents.upload(file, {
        entityType: form.entityType,
        entityId: form.entityId,
        documentType: form.documentType,
      })
      toast.success("Tải lên thành công")
      router.push("/documents")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lỗi tải lên")
    }
    setUploading(false)
  }

  const inputCls = "w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
  const labelCls = "block text-xs font-medium text-muted-foreground mb-1"

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tải lên tài liệu</h1>
        <Link href="/documents"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Quay lại
        </Link>
      </div>

      <div className="rounded-lg border p-6 space-y-4">
        {/* Drop zone */}
        <div
          onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={() => setDragging(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
          <input ref={fileInputRef} type="file" className="hidden"
            accept={ALLOWED_TYPES.join(",")}
            onChange={(e) => handleFileSelect(e.target.files?.[0] || null)} />
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <File className="h-8 w-8 text-primary" />
              <div className="text-left">
                <p className="font-medium text-sm">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setFile(null) }}
                className="text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button>
            </div>
          ) : (
            <div>
              <Upload className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Kéo thả file hoặc nhấn để chọn</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, ảnh, Word — Tối đa 50MB</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Loại đối tượng *</label>
            <select className={inputCls} value={form.entityType}
              onChange={(e) => setForm({ ...form, entityType: e.target.value })}>
              <option value="learner">Người học</option>
              <option value="enterprise">Doanh nghiệp</option>
              <option value="school">Trường học</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Mã đối tượng *</label>
            <input className={inputCls} placeholder="ID"
              value={form.entityId} onChange={(e) => setForm({ ...form, entityId: e.target.value })} />
          </div>
        </div>

        <div>
          <label className={labelCls}>Loại tài liệu *</label>
          <select className={inputCls} value={form.documentType}
            onChange={(e) => setForm({ ...form, documentType: e.target.value })}>
            {Object.entries(DOCUMENT_TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>Ghi chú</label>
          <textarea className={inputCls} rows={2} placeholder="Ghi chú (tùy chọn)"
            value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link href="/documents"
            className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-accent">
            Hủy
          </Link>
          <Button onClick={handleUpload} disabled={!file || !form.entityId || uploading}>
            {uploading ? "Đang tải lên..." : "Tải lên"}
          </Button>
        </div>
      </div>
    </div>
  )
}
