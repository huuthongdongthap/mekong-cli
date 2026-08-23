export function fmtDate(d: string | null | undefined): string {
  if (!d) return "—"
  try { return new Date(d).toLocaleDateString("vi-VN") } catch { return d ?? "—" }
}

export function phoneLink(p: string | null) {
  if (!p) return "—"
  return <a href={"tel:" + p} className="text-primary hover:underline">{p}</a>
}

export function emailLink(e: string | null) {
  if (!e) return "—"
  return <a href={"mailto:" + e} className="text-primary hover:underline">{e}</a>
}