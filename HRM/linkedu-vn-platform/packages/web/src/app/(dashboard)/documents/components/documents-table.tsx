"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Trash2 } from "lucide-react"
import type { ApiDoc } from "../types"
import { MIME_LABEL, DOC_TYPE_LABEL, fmtSize } from "../constants"

export function DocumentsTable({ docs, onDownload, onDelete }: { docs: ApiDoc[]; onDownload: (id: string) => void; onDelete: (id: string) => void }) {
  return (
    <table className="w-full text-sm">
      <thead className="bg-muted">
        <tr>
          <th className="px-4 py-2 text-left">Tên file</th>
          <th className="px-4 py-2 text-left">Loại</th>
          <th className="px-4 py-2 text-left">Loại TL</th>
          <th className="px-4 py-2 text-left">Kích thước</th>
          <th className="px-4 py-2 text-left">Ngày tải</th>
          <th className="px-4 py-2 text-right">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {docs.map((d) => (
          <tr key={d.id} className="border-t">
            <td className="px-4 py-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="truncate max-w-[280px]">{d.originalFilename}</span>
              </div>
            </td>
            <td className="px-4 py-2"><Badge color="gray">{MIME_LABEL[d.mimeType] ?? d.mimeType}</Badge></td>
            <td className="px-4 py-2">{DOC_TYPE_LABEL[d.documentType] ?? d.documentType}</td>
            <td className="px-4 py-2 text-muted-foreground">{fmtSize(d.fileSize)}</td>
            <td className="px-4 py-2 text-muted-foreground">{new Date(d.uploadedAt).toLocaleString('vi-VN')}</td>
            <td className="px-4 py-2 text-right">
              <div className="flex items-center justify-end gap-2">
                <Button size="icon" variant="ghost" onClick={() => onDownload(d.id)}><FileText className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => onDelete(d.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}