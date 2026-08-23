"use client"
import { UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { STATUS_CLS, STATUS_LABELS } from "../constants"
import { formatDate } from "@/lib/utils/format"
import type { LearnerProfile } from "../types"

export function InfoView({ profile, editMode, editForm, saving, onToggleEdit, onSave, onCancel, onChangeEdit }: { profile: LearnerProfile; editMode: boolean; editForm: { gender: string; dateOfBirth: string; phone: string; address: string; bio: string }; saving: boolean; onToggleEdit: () => void; onSave: () => void; onCancel: () => void; onChangeEdit: (v: typeof editForm) => void }) {
  if (!profile) return null
  const fullName = profile.user ? `${profile.user.firstName} ${profile.user.lastName}`.trim() : "—"
  const genderLabel = { male: "Nam", female: "Nữ", other: "Khác" }[profile.gender ?? ""] ?? profile.gender ?? "—"
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-sm text-foreground">Thông tin cá nhân</h3>
          {!editMode ? (
            <Button size="sm" variant="outline" onClick={onToggleEdit} className="gap-1.5"><UserCircle className="h-3.5 w-3.5" /> Chỉnh sửa</Button>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" onClick={onSave} disabled={saving} className="gap-1.5">Lưu</Button>
              <Button size="sm" variant="outline" onClick={onCancel}>Hủy</Button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div><label className="block text-xs font-medium text-muted-foreground mb-1">Họ và tên</label><div className="text-sm text-foreground font-medium">{fullName}</div></div>
          <div><label className="block text-xs font-medium text-muted-foreground mb-1">Email</label><div className="flex items-center gap-1.5 text-sm text-muted-foreground">{profile.user?.email ?? "—"}</div></div>
          {editMode ? (
            <>
              <div><label className="block text-xs font-medium text-muted-foreground mb-1">Giới tính</label>
                <select value={editForm.gender} onChange={(e) => onChangeEdit({ ...editForm, gender: e.target.value })} className="w-full rounded-lg border border-border px-3 py-2 text-sm">
                  <option value="">— Chọn —</option><option value="male">Nam</option><option value="female">Nữ</option><option value="other">Khác</option>
                </select></div>
              <div><label className="block text-xs font-medium text-muted-foreground mb-1">Ngày sinh</label>
                <input type="date" value={editForm.dateOfBirth} onChange={(e) => onChangeEdit({ ...editForm, dateOfBirth: e.target.value })} className="w-full rounded-lg border border-border px-3 py-2 text-sm" /></div>
              <div><label className="block text-xs font-medium text-muted-foreground mb-1">Số điện thoại</label>
                <input value={editForm.phone} onChange={(e) => onChangeEdit({ ...editForm, phone: e.target.value })} className="w-full rounded-lg border border-border px-3 py-2 text-sm" /></div>
              <div><label className="block text-xs font-medium text-muted-foreground mb-1">Trạng thái</label>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_CLS[profile.status] ?? "bg-muted text-muted-foreground border border-border"}`}>{STATUS_LABELS[profile.status] ?? profile.status}</span></div>
              <div className="col-span-2"><label className="block text-xs font-medium text-muted-foreground mb-1">Địa chỉ</label>
                <input value={editForm.address} onChange={(e) => onChangeEdit({ ...editForm, address: e.target.value })} className="w-full rounded-lg border border-border px-3 py-2 text-sm" /></div>
              <div className="col-span-2"><label className="block text-xs font-medium text-muted-foreground mb-1">Giới thiệu bản thân</label>
                <textarea value={editForm.bio} onChange={(e) => onChangeEdit({ ...editForm, bio: e.target.value })} rows={3} className="w-full rounded-lg border border-border px-3 py-2 text-sm" /></div>
            </>
          ) : (
            <>
              <div><label className="block text-xs font-medium text-muted-foreground mb-1">Giới tính</label><div className="text-sm text-foreground">{genderLabel}</div></div>
              <div><label className="block text-xs font-medium text-muted-foreground mb-1">Ngày sinh</label><div className="text-sm text-foreground">{formatDate(profile.dateOfBirth)}</div></div>
              <div><label className="block text-xs font-medium text-muted-foreground mb-1">Số điện thoại</label><div className="text-sm text-foreground">{profile.phone ?? "—"}</div></div>
              <div><label className="block text-xs font-medium text-muted-foreground mb-1">Trạng thái</label>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_CLS[profile.status] ?? "bg-muted text-muted-foreground border border-border"}`}>{STATUS_LABELS[profile.status] ?? profile.status}</span></div>
              <div className="col-span-2"><label className="block text-xs font-medium text-muted-foreground mb-1">Địa chỉ</label><div className="text-sm text-foreground">{profile.address ?? "—"}</div></div>
              <div className="col-span-2"><label className="block text-xs font-medium text-muted-foreground mb-1">Giới thiệu bản thân</label><p className="text-sm text-muted-foreground whitespace-pre-wrap">{profile.bio || "—"}</p></div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}