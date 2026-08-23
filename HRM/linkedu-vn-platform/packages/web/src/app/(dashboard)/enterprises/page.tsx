import Link from 'next/link'
import { api } from '@/lib/api-client'
import { Card } from '@/components/ui/card'
import { StatusBadge, Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Enterprise {
  id: number
  name: string
  taxCode: string | null
  industry: string | null
  companySize: string | null
  status: string
  contactPhone: string | null
}

export default async function EnterprisesPage() {
  let items: Enterprise[] = []
  try {
    const res = await api.get<{ data: Enterprise[] }>('/enterprises?limit=50')
    items = res.data ?? []
  } catch { items = [] }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Doanh nghiep</h1>
        <Button><Link href="/enterprises/new">+ Them DN</Link></Button>
      </div>

      {items.length === 0 ? (
        <Card>
          <p className="text-sm text-muted-foreground">Chưa có doanh nghiệp nào.</p>
        </Card>
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted">
                  <th className="px-4 py-3 text-left font-medium">Ma</th>
                  <th className="px-4 py-3 text-left font-medium">Ten</th>
                  <th className="px-4 py-3 text-left font-medium">MST</th>
                  <th className="px-4 py-3 text-left font-medium">Nganh</th>
                  <th className="px-4 py-3 text-left font-medium">Quy mo</th>
                  <th className="px-4 py-3 text-left font-medium">Trang thai</th>
                  <th className="px-4 py-3 text-left font-medium">Lien he</th>
                </tr>
              </thead>
              <tbody>
                {items.map((e) => (
                  <tr key={e.id} className="border-b last:border-0 hover:bg-accent">
                    <td className="px-4 py-3 font-mono text-xs">{e.id}</td>
                    <td className="px-4 py-3">
                      <Link href={`/enterprises/${e.id}`} className="text-primary hover:underline">
                        {e.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{e.taxCode ?? '—'}</td>
                    <td className="px-4 py-3">{e.industry ?? '—'}</td>
                    <td className="px-4 py-3">{e.companySize ?? '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={e.status} /></td>
                    <td className="px-4 py-3">{e.contactPhone ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
