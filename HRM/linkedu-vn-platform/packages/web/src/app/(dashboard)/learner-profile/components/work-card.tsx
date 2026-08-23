"use client"
import { Trash2, Plus, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { WorkExperience } from "../types"
import { formatDate } from "@/lib/utils/format"

export function WorkCard({ exp, onDelete }: { exp: WorkExperience; onDelete: (id: string) => void }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm hover:bg-primary/10 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-foreground">{exp.position}</h4>
          <p className="text-sm text-primary mt-0.5">{exp.company}</p>
          <p className="text-xs text-muted-foreground mt-1">{formatDate(exp.startDate)} — {exp.endDate ? formatDate(exp.endDate) : "Hiện tại"}</p>
          {exp.description && <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{exp.description}</p>}
        </div>
        <button onClick={() => onDelete(exp.id)} className="text-muted-foreground/50 hover:text-destructive transition-colors ml-3 flex-shrink-0"><Trash2 className="h-4 w-4" /></button>
      </div>
    </div>
  )
}

export function EmptyWork() {
  return (
    <div className="bg-card rounded-xl border border-border p-12 text-center">
      <UserCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
      <p className="text-sm text-muted-foreground">Chưa có kinh nghiệm làm việc nào.</p>
    </div>
  )
}

export function AddWorkButton({ onClick }: { onClick: () => void }) {
  return (
    <Button size="sm" onClick={onClick} className="gap-1.5"><Plus className="h-4 w-4" /> Thêm kinh nghiệm</Button>
  )
}