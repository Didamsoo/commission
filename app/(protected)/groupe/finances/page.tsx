"use client"

import { useMemo } from "react"
import Link from "next/link"
import {
  Euro,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  Building,
  BarChart3,
  Loader2,
  Download,
  Printer
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useDashboard } from "@/hooks/use-dashboard"

interface PLLine {
  label: string
  type: "revenue" | "cost" | "subtotal" | "result"
  values: Record<string, number>
  total: number
  budget: number
}

function formatK(n: number) {
  if (Math.abs(n) >= 1000000) return `${(n / 1000000).toFixed(1)}M€`
  if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(0)}k€`
  return `${n.toLocaleString()}€`
}

function VarianceBadge({ actual, budget }: { actual: number; budget: number }) {
  if (!budget) return <span className="text-xs text-gray-400">—</span>
  const pct = ((actual - budget) / Math.abs(budget)) * 100
  const isPositive = pct >= 0
  return (
    <Badge className={`text-xs ${isPositive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
      {isPositive ? "+" : ""}{pct.toFixed(1)}%
    </Badge>
  )
}

export default function GroupeFinancesPage() {
  const { data: dashboard, loading } = useDashboard("dir_plaque")

  const brands = (dashboard as Record<string, unknown> | null)?.brands as Array<{ name: string; revenue: number; margin: number }> | undefined
  const kpis = (dashboard as Record<string, unknown> | null)?.kpis as Record<string, number> | undefined

  const plData = useMemo<PLLine[]>(() => {
    if (!brands || brands.length === 0) return []

    const brandValues = (field: "revenue" | "margin") => {
      const vals: Record<string, number> = {}
      brands.forEach(b => { vals[b.name] = b[field] || 0 })
      return vals
    }

    const totalRevenue = brands.reduce((s, b) => s + (b.revenue || 0), 0)
    const totalMargin = brands.reduce((s, b) => s + (b.margin || 0), 0)
    const personnelCost = totalRevenue * 0.12
    const otherCosts = totalRevenue * 0.05
    const ebitda = totalMargin - personnelCost - otherCosts

    return [
      { label: "Chiffre d'affaires", type: "revenue", values: brandValues("revenue"), total: totalRevenue, budget: totalRevenue * 1.05 },
      { label: "Marge brute", type: "subtotal", values: brandValues("margin"), total: totalMargin, budget: totalMargin * 1.03 },
      { label: "Frais de personnel", type: "cost", values: Object.fromEntries(brands.map(b => [b.name, (b.revenue || 0) * 0.12])), total: personnelCost, budget: personnelCost * 0.98 },
      { label: "Autres charges", type: "cost", values: Object.fromEntries(brands.map(b => [b.name, (b.revenue || 0) * 0.05])), total: otherCosts, budget: otherCosts * 0.97 },
      { label: "EBITDA", type: "result", values: Object.fromEntries(brands.map(b => [b.name, (b.margin || 0) - (b.revenue || 0) * 0.17])), total: ebitda, budget: ebitda * 1.08 },
    ]
  }, [brands])

  const brandNames = brands?.map(b => b.name) || []

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/groupe">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <Euro className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Finances Groupe</h1>
              <p className="text-sm text-gray-500">Compte de résultat consolidé</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Printer className="w-4 h-4" />
            Imprimer
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Chiffre d'affaires", value: kpis?.totalRevenue || 0, icon: BarChart3, gradient: "from-blue-500 to-blue-600" },
          { label: "Marge brute", value: kpis?.totalMargin || 0, icon: TrendingUp, gradient: "from-emerald-500 to-green-600" },
          { label: "EBITDA", value: kpis?.ebitda || 0, icon: Euro, gradient: "from-purple-500 to-violet-600" },
          { label: "Marge EBITDA", value: 0, icon: BarChart3, gradient: "from-amber-500 to-orange-500", isPct: true, pctValue: kpis?.ebitdaMargin || 0 },
        ].map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.label} className="border-0 shadow-premium">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.gradient} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm text-gray-500">{kpi.label}</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {"isPct" in kpi && kpi.isPct ? `${(kpi.pctValue as number).toFixed(1)}%` : formatK(kpi.value)}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* P&L Table */}
      <Card className="border-0 shadow-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gray-400" />
            Compte de résultat par marque
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {plData.length === 0 ? (
            <div className="p-8 text-center text-gray-400">Aucune donnée disponible</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-4 font-semibold text-gray-700">Ligne</th>
                    {brandNames.map(name => (
                      <th key={name} className="text-right p-4 font-semibold text-gray-700">{name}</th>
                    ))}
                    <th className="text-right p-4 font-semibold text-gray-900">Total</th>
                    <th className="text-right p-4 font-semibold text-gray-700">Budget</th>
                    <th className="text-right p-4 font-semibold text-gray-700">Écart</th>
                  </tr>
                </thead>
                <tbody>
                  {plData.map((line) => (
                    <tr
                      key={line.label}
                      className={`border-b ${
                        line.type === "result" ? "bg-gradient-to-r from-gray-50 to-white font-bold" :
                        line.type === "subtotal" ? "bg-gray-50 font-semibold" :
                        line.type === "cost" ? "text-red-700" : ""
                      }`}
                    >
                      <td className="p-4">{line.label}</td>
                      {brandNames.map(name => (
                        <td key={name} className="text-right p-4">
                          {line.type === "cost" ? "-" : ""}{formatK(line.values[name] || 0)}
                        </td>
                      ))}
                      <td className="text-right p-4 font-bold text-gray-900">
                        {line.type === "cost" ? "-" : ""}{formatK(line.total)}
                      </td>
                      <td className="text-right p-4 text-gray-500">{formatK(line.budget)}</td>
                      <td className="text-right p-4">
                        <VarianceBadge actual={line.total} budget={line.budget} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
