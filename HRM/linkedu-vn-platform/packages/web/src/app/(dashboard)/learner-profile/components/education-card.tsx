"use client"
import { Trash2, Plus, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Education } from "../types"
import { formatDate } from "@/lib/utils/format"

export function EducationCard({ edu, onDelete }: { edu: Education; onDelete: (id: string) => void }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm hover:bg-primary/10 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-foreground">{edu.degree} — {edu.fieldOfStudy}</h4>
          <p className="text-sm text-primary mt-0.5">{edu.schoolName}</p>
          <p className="text-xs text-muted-foreground mt-1">{formatDate(edu.startDate)} — {edu.endDate ? formatDate(edu.endDate) : "Hiện tại"}</p>
        </div>
        <button onClick={() => onDelete(edu.id)} className="text-muted-foreground/50 hover:text-destructive transition-colors ml-3 flex-shrink-0"><Trash2 className="h-4 w-4" /></button>
      </div>
    </div>
  )
}

export function EmptyEducation() {
  return (
    <div className="bg-card rounded-xl border border-border p-12 text-center">
      <UserCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
      <p className="text-sm text-muted-foreground">Chưa có thông tin học vấn nào.</p>
    </div>
  )
}

export function AddEducationButton({ onClick }: { onClick: () => void }) {
  return (
    <Button size="sm" onClick={onClick} className="gap-1.5"><Plus className="h-4 w-4" /> Thêm học vấn</Button>
  )
}