"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Euro,
  Car,
  Target,
  Trophy,
  Star,
  Users,
  ArrowLeft,
  ChevronRight,
  BarChart3,
  Percent,
  Calendar,
  Filter,
  Download,
  PieChart,
  Activity,
  Layers,
  Globe,
  Loader2
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMarques } from "@/hooks/use-marques"
import { useDashboard } from "@/hooks/use-dashboard"
import { type BrandDisplayData, mapMarqueToBrand } from "@/lib/types/display"

// ---------------------------------------------------------------------------

type Period = "month" | "quarter" | "year"
type Metric = "volume" | "revenue" | "margin" | "satisfaction"

interface TrendData {
  category: string
  currentValue: number
  previousValue: number
  unit: string
  trend: "up" | "down" | "stable"
  insight: string
}

function MetricCard({
  title,
  value,
  change,
  target,
  icon: Icon,
  color
}: {
  title: string
  value: string
  change: number
  target?: string
  icon: React.ElementType
  color: string
}) {
  return (
    <Card className="border-0 shadow-premium">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className={`flex items-center gap-1 text-sm ${
            change >= 0 ? "text-emerald-600" : "text-red-600"
          }`}>
            {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {change >= 0 ? "+" : ""}{change}%
          </div>
        </div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {target && (
          <p className="text-xs text-gray-400 mt-1">Objectif: {target}</p>
        )}
      </CardContent>
    </Card>
  )
}

function ComparisonChart({
  metric,
  brands,
  getBrandRanking,
}: {
  metric: Metric
  brands: BrandDisplayData[]
  getBrandRanking: () => BrandDisplayData[]
}) {
  const getMetricValue = (brand: BrandDisplayData) => {
    switch (metric) {
      case "volume": return brand.stats.totalSales
      case "revenue": return brand.stats.totalRevenue / 1000000
      case "margin": return brand.stats.totalMargin / 1000
      case "satisfaction": return brand.stats.satisfaction
    }
  }

  const getMetricLabel = () => {
    switch (metric) {
      case "volume": return "ventes"
      case "revenue": return "M\u20ac"
      case "margin": return "k\u20ac"
      case "satisfaction": return "NPS"
    }
  }

  if (brands.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
        Aucune donn\u00e9e disponible
      </div>
    )
  }

  const maxValue = Math.max(...brands.map(getMetricValue))

  return (
    <div className="space-y-4">
      {getBrandRanking().map((brand, index) => {
        const value = getMetricValue(brand)
        const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0

        return (
          <div key={brand.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === 0 ? "bg-amber-500 text-white" :
                  index === 1 ? "bg-gray-400 text-white" :
                  index === 2 ? "bg-orange-500 text-white" :
                  "bg-gray-200 text-gray-600"
                }`}>
                  {index + 1}
                </span>
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${brand.color} flex items-center justify-center text-sm`}>
                  {brand.logo}
                </div>
                <span className="font-medium text-gray-900">{brand.name}</span>
              </div>
              <span className="font-bold text-gray-900">
                {metric === "revenue" ? value.toFixed(1) : Math.round(value)} {getMetricLabel()}
              </span>
            </div>
            <Progress
              value={percentage}
              className={`h-3 ${
                index === 0 ? "[&>div]:bg-amber-500" :
                index === 1 ? "[&>div]:bg-gray-400" :
                "[&>div]:bg-blue-500"
              }`}
            />
          </div>
        )
      })}
    </div>
  )
}

interface PerBrandHistoryEntry {
  period: string
  label: string
  sales: number
  target: number
  margin: number
  financingRate: number
}

function PerformanceChart({ brands, perBrandHistory }: { brands: BrandDisplayData[]; perBrandHistory: Record<string, PerBrandHistoryEntry[]> }) {
  if (brands.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Donn\u00e9es historiques non disponibles
      </div>
    )
  }

  // Collect all months across brands
  const allMonths = new Set<string>()
  for (const entries of Object.values(perBrandHistory)) {
    for (const e of entries) allMonths.add(e.label)
  }
  const months = Array.from(allMonths).slice(-6)

  if (months.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-6 flex-wrap">
          {brands.map((brand) => (
            <div key={brand.id} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${brand.color}`} />
              <span className="text-sm text-gray-600">{brand.name}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center h-52 text-gray-400 text-sm">
          Pas encore de donn\u00e9es historiques
        </div>
      </div>
    )
  }

  // Find max sales value for scale
  let maxSales = 0
  for (const entries of Object.values(perBrandHistory)) {
    for (const e of entries) {
      if (e.sales > maxSales) maxSales = e.sales
    }
  }

  const BAR_COLORS = ["bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-purple-500", "bg-red-500"]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6 flex-wrap">
        {brands.map((brand, i) => (
          <div key={brand.id} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`} />
            <span className="text-sm text-gray-600">{brand.name}</span>
          </div>
        ))}
      </div>

      <div className="flex items-end gap-2 h-52">
        {months.map((month) => (
          <div key={month} className="flex-1 flex flex-col items-center gap-1">
            <div className="flex items-end gap-0.5 h-44 w-full justify-center">
              {brands.map((brand, i) => {
                const history = perBrandHistory[brand.id] || []
                const entry = history.find(e => e.label === month)
                const sales = entry?.sales || 0
                const height = maxSales > 0 ? (sales / maxSales) * 100 : 0
                return (
                  <div
                    key={brand.id}
                    className={`${BAR_COLORS[i % BAR_COLORS.length]} rounded-t min-w-[8px] max-w-[16px] flex-1`}
                    style={{ height: `${height}%` }}
                    title={`${brand.name}: ${sales} ventes`}
                  />
                )
              })}
            </div>
            <span className="text-xs text-gray-500">{month}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TrendIndicator({ trend }: { trend: TrendData }) {
  return (
    <div className={`p-4 rounded-xl ${
      trend.trend === "up" ? "bg-emerald-50" :
      trend.trend === "down" ? "bg-red-50" :
      "bg-gray-50"
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-gray-900">{trend.category}</span>
        <div className={`flex items-center gap-1 ${
          trend.trend === "up" ? "text-emerald-600" :
          trend.trend === "down" ? "text-red-600" :
          "text-gray-500"
        }`}>
          {trend.trend === "up" ? <TrendingUp className="w-4 h-4" /> :
           trend.trend === "down" ? <TrendingDown className="w-4 h-4" /> :
           <Minus className="w-4 h-4" />}
          <span className="font-bold">{trend.currentValue}{trend.unit}</span>
        </div>
      </div>
      <p className="text-sm text-gray-600">{trend.insight}</p>
      <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
        <span>Pr\u00e9c\u00e9dent: {trend.previousValue}{trend.unit}</span>
        <span>&bull;</span>
        <span className={trend.trend === "up" ? "text-emerald-600" : trend.trend === "down" ? "text-red-600" : ""}>
          {trend.trend === "up" ? "+" : trend.trend === "down" ? "" : ""}
          {((trend.currentValue - trend.previousValue) / trend.previousValue * 100).toFixed(1)}%
        </span>
      </div>
    </div>
  )
}

export default function GroupePerformancePage() {
  const [period, setPeriod] = useState<Period>("month")
  const [metric, setMetric] = useState<Metric>("volume")

  // --- Data from API ---
  const { data: marquesRaw, loading: marquesLoading } = useMarques()
  const { data: dashboardData, loading: dashboardLoading } = useDashboard<Record<string, unknown>>("dir_plaque")

  const loading = marquesLoading || dashboardLoading

  const brands: BrandDisplayData[] = useMemo(
    () => (marquesRaw || []).map(mapMarqueToBrand),
    [marquesRaw]
  )

  // Derive trends from dashboard performanceHistory
  const perfHistory = ((dashboardData as Record<string, unknown>)?.performanceHistory || []) as
    { period: string; label: string; sales: number; target: number; margin: number; financingRate: number }[]

  const trendsData: TrendData[] = useMemo(() => {
    if (perfHistory.length < 2) return []
    const last = perfHistory[perfHistory.length - 1]
    const prev = perfHistory[perfHistory.length - 2]

    const trends: TrendData[] = []
    if (last && prev) {
      const volumeChange = prev.sales > 0 ? ((last.sales - prev.sales) / prev.sales) * 100 : 0
      trends.push({
        category: "Volume de ventes",
        currentValue: last.sales,
        previousValue: prev.sales,
        unit: " ventes",
        trend: volumeChange > 2 ? "up" : volumeChange < -2 ? "down" : "stable",
        insight: volumeChange > 0
          ? `Hausse de ${Math.abs(volumeChange).toFixed(1)}% par rapport au mois précédent`
          : `Baisse de ${Math.abs(volumeChange).toFixed(1)}% par rapport au mois précédent`
      })

      const marginChange = prev.margin > 0 ? ((last.margin - prev.margin) / prev.margin) * 100 : 0
      trends.push({
        category: "Marge totale",
        currentValue: Math.round(last.margin / 1000),
        previousValue: Math.round(prev.margin / 1000),
        unit: "k€",
        trend: marginChange > 2 ? "up" : marginChange < -2 ? "down" : "stable",
        insight: marginChange > 0
          ? `Progression de la marge de ${Math.abs(marginChange).toFixed(1)}%`
          : `Recul de la marge de ${Math.abs(marginChange).toFixed(1)}%`
      })

      const financingDiff = last.financingRate - prev.financingRate
      trends.push({
        category: "Taux de financement",
        currentValue: last.financingRate,
        previousValue: prev.financingRate,
        unit: "%",
        trend: financingDiff > 1 ? "up" : financingDiff < -1 ? "down" : "stable",
        insight: financingDiff > 0
          ? `Amélioration de ${financingDiff} points`
          : `Recul de ${Math.abs(financingDiff)} points`
      })
    }
    return trends
  }, [perfHistory])

  // Derive group KPIs from brands aggregate data
  const groupKPIs = useMemo(() => {
    const totalSales = brands.reduce((s, b) => s + b.stats.totalSales, 0)
    const totalTarget = brands.reduce((s, b) => s + b.stats.salesTarget, 0)
    const totalRevenue = brands.reduce((s, b) => s + b.stats.totalRevenue, 0)
    const totalMargin = brands.reduce((s, b) => s + b.stats.totalMargin, 0)
    const avgSatisfaction = brands.length > 0
      ? Math.round(brands.reduce((s, b) => s + b.stats.satisfaction, 0) / brands.length)
      : 0
    const totalEmployees = brands.reduce((s, b) => s + b.employeeCount, 0)
    const objectiveRate = totalTarget > 0
      ? Math.round((totalSales / totalTarget) * 1000) / 10
      : 0
    const marginRate = totalRevenue > 0
      ? Math.round((totalMargin / totalRevenue) * 1000) / 10
      : 0

    // Use dashboard data for growth/evolution if available
    const db = (dashboardData || {}) as Record<string, unknown>
    const revenueGrowth = typeof db.revenueGrowth === "number" ? db.revenueGrowth : 0
    const marketShareCurrent = typeof db.marketShare === "number" ? db.marketShare : 0
    const marketShareEvolution = typeof db.marketShareEvolution === "number" ? db.marketShareEvolution : 0
    const turnover = typeof db.turnover === "number" ? db.turnover : 0

    return {
      revenue: { current: totalRevenue, target: totalTarget * 30000, growth: revenueGrowth },
      ebitda: { current: totalMargin, margin: marginRate, target: totalMargin * 1.1 },
      volume: { current: totalSales, target: totalTarget, objectiveRate },
      marketShare: { current: marketShareCurrent, evolution: marketShareEvolution },
      satisfaction: { nps: avgSatisfaction, target: 85 },
      workforce: { total: totalEmployees, turnover },
    }
  }, [brands, dashboardData])

  function getBrandRanking(): BrandDisplayData[] {
    return [...brands].sort((a, b) => b.stats.objectiveRate - a.stats.objectiveRate)
  }

  // Calculate performance indicators
  const objectiveRate = groupKPIs.volume.objectiveRate
  const revenueGrowth = groupKPIs.revenue.growth
  const marginRate = groupKPIs.ebitda.margin
  const npsScore = groupKPIs.satisfaction.nps

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-sm text-gray-500">Chargement des donn\u00e9es de performance...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/groupe" className="hover:text-gray-700 flex items-center gap-1">
              <Globe className="w-4 h-4" />
              Groupe AutoPerf
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Performance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            Analyse de Performance
          </h1>
          <p className="text-gray-500 mt-1">
            Vue consolid\u00e9e des indicateurs cl\u00e9s du groupe
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
            <SelectTrigger className="w-36">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
              <SelectItem value="year">Cette ann\u00e9e</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
          <Link href="/groupe">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Taux d'objectif"
          value={`${objectiveRate}%`}
          change={trendsData.find(t => t.category === "Volume de ventes")
            ? Math.round(((trendsData[0]?.currentValue ?? 0) - (trendsData[0]?.previousValue ?? 0)) / Math.max(trendsData[0]?.previousValue ?? 1, 1) * 100)
            : 0}
          target="100%"
          icon={Target}
          color="from-blue-500 to-blue-600"
        />
        <MetricCard
          title="Croissance CA"
          value={revenueGrowth > 0 ? `+${revenueGrowth}%` : `${revenueGrowth}%`}
          change={revenueGrowth}
          target="+10%"
          icon={TrendingUp}
          color="from-emerald-500 to-emerald-600"
        />
        <MetricCard
          title="Marge EBITDA"
          value={`${marginRate}%`}
          change={trendsData.find(t => t.category === "Marge totale")
            ? Math.round(((trendsData[1]?.currentValue ?? 0) - (trendsData[1]?.previousValue ?? 0)) / Math.max(trendsData[1]?.previousValue ?? 1, 1) * 100)
            : 0}
          target="3.5%"
          icon={Euro}
          color="from-purple-500 to-purple-600"
        />
        <MetricCard
          title="Score NPS"
          value={npsScore > 0 ? npsScore.toString() : "N/A"}
          change={0}
          target="85"
          icon={Star}
          color="from-amber-500 to-orange-500"
        />
      </div>

      {/* Performance Analysis */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Evolution Chart */}
        <Card className="border-0 shadow-premium lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  \u00c9volution mensuelle
                </CardTitle>
                <CardDescription>Performance par marque sur 6 mois</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <PerformanceChart brands={brands} perBrandHistory={((dashboardData as Record<string, unknown>)?.perBrandHistory || {}) as Record<string, PerBrandHistoryEntry[]>} />
          </CardContent>
        </Card>

        {/* Comparison */}
        <Card className="border-0 shadow-premium">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-600" />
                Classement
              </CardTitle>
              <Select value={metric} onValueChange={(v) => setMetric(v as Metric)}>
                <SelectTrigger className="w-28 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="volume">Volume</SelectItem>
                  <SelectItem value="revenue">CA</SelectItem>
                  <SelectItem value="margin">Marge</SelectItem>
                  <SelectItem value="satisfaction">NPS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ComparisonChart metric={metric} brands={brands} getBrandRanking={getBrandRanking} />
          </CardContent>
        </Card>
      </div>

      {/* Trends */}
      {trendsData.length > 0 && (
        <Card className="border-0 shadow-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Tendances cl\u00e9s
            </CardTitle>
            <CardDescription>\u00c9volutions et insights strat\u00e9giques</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendsData.map((trend) => (
                <TrendIndicator key={trend.category} trend={trend} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Brand Performance Summary */}
      <Card className="border-0 shadow-premium">
        <CardHeader>
          <CardTitle>Synth\u00e8se par marque</CardTitle>
          <CardDescription>Comparatif des indicateurs cl\u00e9s</CardDescription>
        </CardHeader>
        <CardContent>
          {brands.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
              Aucune marque disponible
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Marque</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600">Volume</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600">CA</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600">Marge</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600">GPU</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600">Financ.</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600">NPS</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600">Obj.</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {getBrandRanking().map((brand, index) => (
                    <tr key={brand.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? "bg-amber-500 text-white" :
                            index === 1 ? "bg-gray-400 text-white" :
                            "bg-orange-500 text-white"
                          }`}>
                            {index + 1}
                          </span>
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${brand.color} flex items-center justify-center`}>
                            {brand.logo}
                          </div>
                          <span className="font-medium">{brand.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-medium">{brand.stats.totalSales}</td>
                      <td className="py-3 px-4 text-right">{(brand.stats.totalRevenue / 1000000).toFixed(1)}M\u20ac</td>
                      <td className="py-3 px-4 text-right text-emerald-600 font-medium">{(brand.stats.totalMargin / 1000).toFixed(0)}k\u20ac</td>
                      <td className="py-3 px-4 text-right">{brand.stats.avgGPU}\u20ac</td>
                      <td className="py-3 px-4 text-right">
                        <span className={brand.stats.financingRate >= 75 ? "text-emerald-600" : "text-amber-600"}>
                          {brand.stats.financingRate}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={brand.stats.satisfaction >= 85 ? "text-emerald-600" : "text-amber-600"}>
                          {brand.stats.satisfaction}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Badge className={`${
                          brand.stats.objectiveRate >= 100 ? "bg-emerald-100 text-emerald-700" :
                          brand.stats.objectiveRate >= 95 ? "bg-blue-100 text-blue-700" :
                          "bg-amber-100 text-amber-700"
                        }`}>
                          {brand.stats.objectiveRate}%
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className={`inline-flex items-center gap-1 ${
                          brand.trend === "up" ? "text-emerald-600" :
                          brand.trend === "down" ? "text-red-600" :
                          "text-gray-500"
                        }`}>
                          {brand.trend === "up" ? <TrendingUp className="w-4 h-4" /> :
                           brand.trend === "down" ? <TrendingDown className="w-4 h-4" /> :
                           <Minus className="w-4 h-4" />}
                          {brand.quarterlyGrowth > 0 ? "+" : ""}{brand.quarterlyGrowth}%
                        </div>
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
