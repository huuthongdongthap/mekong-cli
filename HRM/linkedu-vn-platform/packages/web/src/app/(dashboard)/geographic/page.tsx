"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api-client"
import { ChevronRight, MapPin, Search } from "lucide-react"
import { REGION_LABELS, REGION_TABS, resolveTypeBadge } from "./constants"

interface District {
  id: number; name: string; code: string; provinceCode: string
}

interface Province {
  code: string; name: string; region?: string; type?: string
  _count: { districts: number }
}

export default function GeographicPage() {
  const [provinces, setProvinces] = useState<Province[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [region, setRegion] = useState("")
  const [search, setSearch] = useState("")
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [districts, setDistricts] = useState<Record<string, District[]>>({})
  const [loadingDistricts, setLoadingDistricts] = useState<Set<string>>(new Set())

  async function fetchProvinces() {
    setLoading(true); setError(null)
    try {
      const params = region ? `?region=${region}` : ""
      setProvinces(await api.get<Province[]>(`/geographic/provinces${params}`))
    } catch (err) { setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu") }
    setLoading(false)
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true); setError(null)
      try {
        const params = region ? `?region=${region}` : ""
        const res = await api.get<Province[]>(`/geographic/provinces${params}`)
        if (!cancelled) setProvinces(res)
      } catch (err) { if (!cancelled) setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu") }
      if (!cancelled) setLoading(false)
    })()
    return () => { cancelled = true }
  }, [region])

  async function toggleProvince(code: string) {
    const next = new Set(expanded)
    if (next.has(code)) { next.delete(code); setExpanded(next); return }
    next.add(code); setExpanded(next)
    if (districts[code]) return
    setLoadingDistricts((prev) => new Set(prev).add(code))
    try {
      const res = await api.get<District[]>(`/geographic/provinces/${code}/districts`)
      setDistricts((prev) => ({ ...prev, [code]: res }))
    } catch { /* silently fail */ }
    setLoadingDistricts((prev) => { const s = new Set(prev); s.delete(code); return s })
  }

  const filtered = provinces.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.code.includes(search)
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          Quản lý địa lý
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Quản lý danh sách tỉnh/thành phố và quận/huyện trên toàn quốc.</p>
      </div>

      {/* Region Tabs + Search */}
      <div className="flex items-center gap-4">
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {REGION_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => { setRegion(tab.value); setExpanded(new Set()) }}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                region === tab.value
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-muted-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm tỉnh/thành..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Tìm tỉnh/thành"
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring bg-card"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filtered.length} tỉnh/thành
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Province List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden divide-y divide-border">
          {filtered.map((p) => (
            <div key={p.code}>
              <button onClick={() => toggleProvince(p.code)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-primary/10 transition-colors group">
                <div className={`transition-transform ${expanded.has(p.code) ? "rotate-90" : ""}`}>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <MapPin className="h-4 w-4 text-blue-500 shrink-0" />
                <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">{p.name}</span>
                <span className="text-xs text-muted-foreground font-mono">{p.code}</span>
                {(() => {
                  const badge = resolveTypeBadge(p.name, p.type)
                  return badge ? (
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${badge.cls}`}>
                      {badge.label}
                    </span>
                  ) : null
                })()}
                {p.region && (
                  <span className="text-xs text-muted-foreground">{REGION_LABELS[p.region] ?? p.region}</span>
                )}
                <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="font-semibold text-primary">{p._count.districts}</span> quận/huyện
                </span>
              </button>
              {expanded.has(p.code) && (
                <div className="border-t border-border px-5 py-3 bg-muted/50">
                  {loadingDistricts.has(p.code) ? (
                    <div className="py-2 text-xs text-muted-foreground flex items-center gap-2">
                      <div className="h-3 w-3 animate-spin rounded-full border border-border border-t-primary" />
                      Đang tải...
                    </div>
                  ) : districts[p.code]?.length ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {districts[p.code].map((d) => (
                        <div key={d.id} className="flex items-center gap-2 text-sm px-3 py-2 bg-card rounded-lg border border-border">
                          <span className="font-mono text-xs text-muted-foreground">{d.code}</span>
                          <span className="text-muted-foreground">{d.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground py-2">Không có quận/huyện</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <MapPin className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Chưa có dữ liệu địa phương.</p>
        </div>
      )}
    </div>
  )
}
