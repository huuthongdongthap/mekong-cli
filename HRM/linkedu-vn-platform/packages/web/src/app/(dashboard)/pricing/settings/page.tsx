"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { DetailField } from "@/components/dashboard/detail-field"
import { EntitySection } from "@/components/pricing/entity-section"
import { VatSection } from "@/components/pricing/vat-section"
import { pricingEntities, pricingVAT, type LegalEntity, type VATClassification } from "@/lib/api/pricing"
import { Settings, ArrowLeft, Plus } from "lucide-react"

export default function PricingSettingsPage() {
  const [entities, setEntities] = useState<LegalEntity[]>([])
  const [vatClassifications, setVatClassifications] = useState<VATClassification[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [entRes, vatRes] = await Promise.all([
        pricingEntities.list(),
        pricingVAT.list(),
      ])
      setEntities(entRes.data)
      setVatClassifications(vatRes.data)
    } catch {}
    setLoading(false)
  }

  // Mount-only fetch; guard keeps setState out of the effect's sync path.
  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; fetchData() }
  }, [])

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" /> Cài đặt giá
        </h1>
        <Link href="/pricing" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Quay lại
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          <EntitySection entities={entities} onRefresh={fetchData} />
          <VatSection vatClassifications={vatClassifications} entities={entities} onRefresh={fetchData} />
        </div>
      )}
    </div>
  )
}