"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { api } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { t } from "@/lib/i18n"
import { TrendingUp, Calculator, Users, DollarSign, Clock, BarChart3 } from "lucide-react"
import { TABS, formatVnd, cacColor } from "./constants"
import type { TabKey, DashboardMetrics, CohortData } from "./types"
import { MonthlyTable } from "./components/monthly-table"
import { CohortsTable } from "./components/cohorts-table"

export default function UnitEconomicsPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [cohorts, setCohorts] = useState<CohortData[]>([])
  const [loading, setLoading] = useState(true)
  const [calculating, setCalculating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<TabKey>("monthly")

  const fetchDashboard = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const [dash, coh] = await Promise.all([
        api.get<DashboardMetrics>("/unit-economics/dashboard"),
        api.get<CohortData[]>("/unit-economics/cohorts?months=12"),
      ])
      setMetrics(dash); setCohorts(coh)
    } catch (err) { setError(err instanceof Error ? err.message : "Loi tai du lieu") }
    setLoading(false)
  }, [])

  // Mount-only fetch; guard keeps setState out of the effect's sync path.
  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; fetchDashboard() }
  }, [fetchDashboard])

  async function handleCalculate() {
    setCalculating(true); setError(null)
    try { await api.post("/unit-economics/calculate/daily", {}); await fetchDashboard() }
    catch (err) { setError(err instanceof Error ? err.message : "Loi tinh toan") }
    setCalculating(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" /> Kinh te don vi
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Theo doi CAC, LTV, va hieu qua kinh doanh theo cohort.</p>
        </div>
        <Button size="sm" onClick={handleCalculate} disabled={calculating} className="gap-2">
          <Calculator className="h-4 w-4" />{calculating ? t('CALCULATING') : t('CALCULATE')}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
        </div>
      ) : metrics ? (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <KpiCard icon={<DollarSign className="h-4 w-4 text-destructive" />} label="CAC TB" value={formatVnd(metrics.avgCac)} valueClass={cacColor(metrics.avgCac)} />
            <KpiCard icon={<TrendingUp className="h-4 w-4 text-green-500" />} label="LTV TB" value={formatVnd(metrics.avgLtv)} valueClass="text-green-600" />
            <KpiCard icon={<BarChart3 className="h-4 w-4 text-primary" />} label="LTV / CAC" value={metrics.avgLtvCacRatio.toFixed(1) + "x"} valueClass="text-primary" />
            <KpiCard icon={<Clock className="h-4 w-4 text-amber-500" />} label="Hoan von" value={metrics.avgPaybackMonths.toFixed(1) + " thang"} valueClass="text-foreground" />
            <KpiCard icon={<Users className="h-4 w-4 text-purple-500" />} label="Tong doanh thu" value={formatVnd(metrics.totalRevenue)} valueClass="text-foreground" />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
            {TABS.map((t) => (
              <button key={t.value} onClick={() => setTab(t.value)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${tab === t.value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {tab === "monthly" && <MonthlyTable metrics={metrics} />}
          {tab === "cohorts" && <CohortsTable items={cohorts} />}
        </>
      ) : (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <TrendingUp className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Khong co du lieu kinh te don vi.</p>
        </div>
      )}
    </div>
  )
}

function KpiCard({ icon, label, value, valueClass }: { icon: React.ReactNode; label: string; value: string; valueClass: string }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-2">{icon}<span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span></div>
      <p className={`text-xl font-bold ${valueClass}`}>{value}</p>
    </div>
  )
}