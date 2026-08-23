"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { api } from "@/lib/api-client"
import { Card } from "@/components/ui/card"
import { School, Building2, Users, FileText, UserRound, Briefcase, Award, Handshake } from "lucide-react"

type Stats = {
  schools: number
  enterprises: number
  learners: number
  programs: number
  enrollments: number
  placements: number
  certificates: number
  moas: number
}

async function fetchCount(endpoint: string): Promise<number> {
  try {
    const r = await api.get<{ total?: number }>(endpoint + "?limit=1")
    return r.total ?? 0
  } catch {
    return 0
  }
}

const STAT_CONFIG = [
  { key: "schools" as const, title: "Trường", href: "/schools", Icon: School },
  { key: "enterprises" as const, title: "Doanh nghiệp", href: "/enterprises", Icon: Building2 },
  { key: "learners" as const, title: "Người học", href: "/learners", Icon: Users },
  { key: "programs" as const, title: "Chương trình", href: "/programs", Icon: FileText },
  { key: "enrollments" as const, title: "Tuyển sinh", href: "/enrollments", Icon: UserRound },
  { key: "placements" as const, title: "Việc làm", href: "/placements", Icon: Briefcase },
  { key: "certificates" as const, title: "Chứng chỉ", href: "/certificates", Icon: Award },
  { key: "moas" as const, title: "MoU/MoA", href: "/moas", Icon: Handshake },
]

const quickLinks = [
  { href: "/schools", label: "Trường" },
  { href: "/enterprises", label: "Doanh nghiệp" },
  { href: "/learners", label: "Người học" },
  { href: "/programs", label: "Chương trình" },
  { href: "/enrollments", label: "Tuyển sinh" },
  { href: "/placements", label: "Việc làm" },
  { href: "/certificates", label: "Chứng chỉ" },
  { href: "/moas", label: "MoU/MoA" },
]

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    schools: 0, enterprises: 0, learners: 0, programs: 0,
    enrollments: 0, placements: 0, certificates: 0, moas: 0,
  })

  useEffect(() => {
    async function load() {
      const [schools, enterprises, learners, programs, enrollments, placements, certificates, moas] = await Promise.all([
        fetchCount("/schools"), fetchCount("/enterprises"), fetchCount("/learners"),
        fetchCount("/programs"), fetchCount("/enrollments"), fetchCount("/placements"),
        fetchCount("/internship-certificates"), fetchCount("/moas"),
      ])
      setStats({ schools, enterprises, learners, programs, enrollments, placements, certificates, moas })
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Tổng quan hệ sinh thái</h1>
        <p className="text-sm text-muted-foreground mt-1">Hệ sinh thái liên kết đào tạo thực chiến Việt Nam</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CONFIG.map(({ key, title, href, Icon }) => (
          <Link key={key} href={href} className="block">
            <Card className="h-full">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{title}</p>
                  <p className="mt-1 text-2xl font-bold">{stats[key]}</p>
                </div>
                <Icon className="h-8 w-8 text-muted-foreground/50" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="p-6">
        <p className="text-sm text-muted-foreground text-center py-8">
          Biểu đồ xu hướng sẽ sớm có khi dữ liệu được kết nối từ API.
        </p>
      </Card>

      <Card>
        <h3 className="font-medium mb-3">Truy cập nhanh</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {quickLinks.map((l) => (
            <Link key={l.href} href={l.href} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-accent border-border">
              <span>{l.label}</span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  )
}
