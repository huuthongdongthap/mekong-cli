export const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  draft: { label: "Nháp", cls: "bg-muted text-muted-foreground" },
  issued: { label: "Đã cấp", cls: "bg-[var(--status-green)] text-[var(--status-green-fg)] border border-[var(--status-green-border)]" },
  revoked: { label: "Thu hồi", cls: "bg-[var(--status-red)] text-[var(--status-red-fg)] border border-[var(--status-red-border)]" },
}

export const CERT_STATUS: Record<string, { label: string; cls: string }> = {
  draft: { label: "Nháp", cls: "bg-muted text-muted-foreground" },
  issued: { label: "Đã cấp", cls: "bg-[var(--status-green)] text-[var(--status-green-fg)] border border-[var(--status-green-border)]" },
  revoked: { label: "Thu hồi", cls: "bg-[var(--status-red)] text-[var(--status-red-fg)] border border-[var(--status-red-border)]" },
}

export const GENDER_MAP: Record<string, string> = { nam: "Nam", nu: "Nữ", khac: "Khác" }