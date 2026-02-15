"use client"

import { useState } from "react"
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
  Globe
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
import {
  brands,
  groupKPIs,
  groupPerformanceHistory,
  trendsData,
  getBrandRanking
} from "@/lib/mock-dir-plaque-data"

type Period = "month" | "quarter" | "year"
type Metric = "volume" | "revenue" | "margin" | "satisfaction"

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

function ComparisonChart({ metric }: { metric: Metric }) {
  const getMetricValue = (brand: typeof brands[0]) => {
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
      case "revenue": return "M€"
      case "margin": return "k€"
      case "satisfaction": return "NPS"
    }
  }

  const maxValue = Math.max(...brands.map(getMetricValue))

  return (
    <div className="space-y-4">
      {getBrandRanking().map((brand, index) => {
        const value = getMetricValue(brand)
        const percentage = (value / maxValue) * 100

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

function PerformanceChart() {
  const maxTotal = Math.max(...groupPerformanceHistory.map(h => h.total.sales))

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-sm text-gray-600">Ford</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-sm text-gray-600">Nissan</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-sm text-gray-600">Suzuki</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-500" />
          <span className="text-sm text-gray-600">Total</span>
        </div>
      </div>

      <div className="flex items-end gap-4 h-64">
        {groupPerformanceHistory.map((month) => {
          const fordHeight = (month.ford.sales / maxTotal) * 100
          const nissanHeight = (month.nissan.sales / maxTotal) * 100
          const suzukiHeight = (month.suzuki.sales / maxTotal) * 100
          const totalHeight = (month.total.sales / maxTotal) * 100

          return (
            <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
              <div className="text-xs font-semibold text-indigo-600">{month.total.sales}</div>
              <div className="relative w-full h-52 flex items-end justify-center gap-1">
                <div
                  className="w-4 bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                  style={{ height: `${fordHeight}%` }}
                  title={`Ford: ${month.ford.sales}`}
                />
                <div
                  className="w-4 bg-red-500 rounded-t transition-all hover:bg-red-600"
                  style={{ height: `${nissanHeight}%` }}
                  title={`Nissan: ${month.nissan.sales}`}
                />
                <div
                  className="w-4 bg-yellow-500 rounded-t transition-all hover:bg-yellow-600"
                  style={{ height: `${suzukiHeight}%` }}
                  title={`Suzuki: ${month.suzuki.sales}`}
                />
              </div>
              <span className="text-sm font-medium text-gray-600">{month.month}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TrendIndicator({ trend }: { trend: typeof trendsData[0] }) {
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
        <span>Précédent: {trend.previousValue}{trend.unit}</span>
        <span>•</span>
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

  // Calculate performance indicators
  const objectiveRate = groupKPIs.volume.objectiveRate
  const revenueGrowth = groupKPIs.revenue.growth
  const marginRate = groupKPIs.ebitda.margin
  const npsScore = groupKPIs.satisfaction.nps

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
            Vue consolidée des indicateurs clés du groupe
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
              <SelectItem value="year">Cette année</SelectItem>
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
          change={2.3}
          target="100%"
          icon={Target}
          color="from-blue-500 to-blue-600"
        />
        <MetricCard
          title="Croissance CA"
          value={`+${revenueGrowth}%`}
          change={revenueGrowth}
          target="+10%"
          icon={TrendingUp}
          color="from-emerald-500 to-emerald-600"
        />
        <MetricCard
          title="Marge EBITDA"
          value={`${marginRate}%`}
          change={0.5}
          target="3.5%"
          icon={Euro}
          color="from-purple-500 to-purple-600"
        />
        <MetricCard
          title="Score NPS"
          value={npsScore.toString()}
          change={3}
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
                  Évolution mensuelle
                </CardTitle>
                <CardDescription>Performance par marque sur 6 mois</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <PerformanceChart />
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
            <ComparisonChart metric={metric} />
          </CardContent>
        </Card>
      </div>

      {/* Trends */}
      <Card className="border-0 shadow-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            Tendances clés
          </CardTitle>
          <CardDescription>Évolutions et insights stratégiques</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendsData.map((trend) => (
              <TrendIndicator key={trend.category} trend={trend} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Brand Performance Summary */}
      <Card className="border-0 shadow-premium">
        <CardHeader>
          <CardTitle>Synthèse par marque</CardTitle>
          <CardDescription>Comparatif des indicateurs clés</CardDescription>
        </CardHeader>
        <CardContent>
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
                    <td className="py-3 px-4 text-right">{(brand.stats.totalRevenue / 1000000).toFixed(1)}M€</td>
                    <td className="py-3 px-4 text-right text-emerald-600 font-medium">{(brand.stats.totalMargin / 1000).toFixed(0)}k€</td>
                    <td className="py-3 px-4 text-right">{brand.stats.avgGPU}€</td>
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
        </CardContent>
      </Card>
    </div>
  )
}
