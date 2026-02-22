"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BarChart3,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Euro,
  Car,
  Percent,
  Star,
  Clock,
  Trophy,
  Building2,
  ArrowUpDown,
  Download
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
// ============================================
// TYPES
// ============================================

interface DealershipData {
  id: string
  name: string
  code: string
  location: string
  address: string
  directorId: string
  directorName: string
  directorAvatar?: string
  coordinates: { lat: number; lng: number }
  stats: {
    totalSales: number
    salesTarget: number
    objectiveRate: number
    totalMargin: number
    avgGPU: number
    financingRate: number
    satisfaction: number
    stockDays: number
  }
  departments: {
    vn: { sales: number; target: number; margin: number }
    vo: { sales: number; target: number; margin: number }
    vu: { sales: number; target: number; margin: number }
  }
  trend: "up" | "down" | "stable"
  alerts: Array<{
    type: "warning" | "critical" | "info"
    message: string
  }>
}

interface BrandKPIs {
  volume: {
    current: number
    target: number
    objectiveRate: number
    trend: number
  }
  margin: {
    total: number
    target: number
    avgGPU: number
    trend: number
  }
  financing: {
    rate: number
    target: number
    trend: number
  }
  satisfaction: {
    nps: number
    target: number
    trend: number
  }
  stock: {
    avgDays: number
    target: number
    totalUnits: number
  }
  constructorBonus: {
    estimated: number
    volumeAchieved: boolean
    financingAchieved: boolean
    satisfactionAchieved: boolean
  }
}

interface PerformanceHistory {
  month: string
  volume: number
  volumeTarget: number
  margin: number
  financingRate: number
  satisfaction: number
}

// ============================================
// STATIC DATA
// TODO: replace with API data
// ============================================

const dealerships: DealershipData[] = [
  {
    id: "dealership-paris-est",
    name: "Ford Paris Est",
    code: "FPE-001",
    location: "Paris Est",
    address: "125 Avenue de la République, 75011 Paris",
    directorId: "dir-concession-1",
    directorName: "Marie Dubois",
    coordinates: { lat: 48.8634, lng: 2.3815 },
    stats: {
      totalSales: 58,
      salesTarget: 52,
      objectiveRate: 112,
      totalMargin: 87000,
      avgGPU: 1500,
      financingRate: 82,
      satisfaction: 89,
      stockDays: 35
    },
    departments: {
      vn: { sales: 32, target: 28, margin: 48000 },
      vo: { sales: 18, target: 16, margin: 27000 },
      vu: { sales: 8, target: 8, margin: 12000 }
    },
    trend: "up",
    alerts: []
  },
  {
    id: "dealership-paris-ouest",
    name: "Ford Paris Ouest",
    code: "FPO-002",
    location: "Paris Ouest",
    address: "45 Boulevard Exelmans, 75016 Paris",
    directorId: "dir-concession-2",
    directorName: "Pierre Martin",
    coordinates: { lat: 48.8424, lng: 2.2635 },
    stats: {
      totalSales: 49,
      salesTarget: 50,
      objectiveRate: 98,
      totalMargin: 71050,
      avgGPU: 1450,
      financingRate: 75,
      satisfaction: 86,
      stockDays: 42
    },
    departments: {
      vn: { sales: 26, target: 28, margin: 37700 },
      vo: { sales: 16, target: 15, margin: 23200 },
      vu: { sales: 7, target: 7, margin: 10150 }
    },
    trend: "stable",
    alerts: [
      { type: "warning", message: "Stock VN > 40 jours" }
    ]
  },
  {
    id: "dealership-versailles",
    name: "Ford Versailles",
    code: "FVS-003",
    location: "Versailles",
    address: "8 Rue des Chantiers, 78000 Versailles",
    directorId: "dir-concession-3",
    directorName: "Sophie Bernard",
    coordinates: { lat: 48.8014, lng: 2.1301 },
    stats: {
      totalSales: 52,
      salesTarget: 50,
      objectiveRate: 104,
      totalMargin: 78000,
      avgGPU: 1500,
      financingRate: 78,
      satisfaction: 91,
      stockDays: 38
    },
    departments: {
      vn: { sales: 28, target: 26, margin: 42000 },
      vo: { sales: 17, target: 17, margin: 25500 },
      vu: { sales: 7, target: 7, margin: 10500 }
    },
    trend: "up",
    alerts: []
  },
  {
    id: "dealership-creteil",
    name: "Ford Créteil",
    code: "FCR-004",
    location: "Créteil",
    address: "Centre Commercial Créteil Soleil, 94000 Créteil",
    directorId: "dir-concession-4",
    directorName: "Lucas Petit",
    coordinates: { lat: 48.7905, lng: 2.4595 },
    stats: {
      totalSales: 40,
      salesTarget: 45,
      objectiveRate: 89,
      totalMargin: 56000,
      avgGPU: 1400,
      financingRate: 68,
      satisfaction: 82,
      stockDays: 52
    },
    departments: {
      vn: { sales: 20, target: 24, margin: 28000 },
      vo: { sales: 14, target: 15, margin: 19600 },
      vu: { sales: 6, target: 6, margin: 8400 }
    },
    trend: "down",
    alerts: [
      { type: "critical", message: "Objectif VN à risque" },
      { type: "warning", message: "Taux financement bas (68%)" },
      { type: "warning", message: "Stock > 50 jours" }
    ]
  },
  {
    id: "dealership-saint-denis",
    name: "Ford Saint-Denis",
    code: "FSD-005",
    location: "Saint-Denis",
    address: "52 Boulevard Marcel Sembat, 93200 Saint-Denis",
    directorId: "dir-concession-5",
    directorName: "Emma Leroy",
    coordinates: { lat: 48.9362, lng: 2.3574 },
    stats: {
      totalSales: 45,
      salesTarget: 48,
      objectiveRate: 94,
      totalMargin: 63000,
      avgGPU: 1400,
      financingRate: 72,
      satisfaction: 84,
      stockDays: 44
    },
    departments: {
      vn: { sales: 24, target: 26, margin: 33600 },
      vo: { sales: 15, target: 15, margin: 21000 },
      vu: { sales: 6, target: 7, margin: 8400 }
    },
    trend: "stable",
    alerts: [
      { type: "info", message: "Nouveau directeur depuis 3 mois" }
    ]
  },
  {
    id: "dealership-evry",
    name: "Ford Évry",
    code: "FEV-006",
    location: "Évry",
    address: "15 Avenue du Lac, 91000 Évry",
    directorId: "dir-concession-6",
    directorName: "Thomas Garcia",
    coordinates: { lat: 48.6249, lng: 2.4295 },
    stats: {
      totalSales: 43,
      salesTarget: 42,
      objectiveRate: 102,
      totalMargin: 64500,
      avgGPU: 1500,
      financingRate: 80,
      satisfaction: 88,
      stockDays: 36
    },
    departments: {
      vn: { sales: 22, target: 22, margin: 33000 },
      vo: { sales: 15, target: 14, margin: 22500 },
      vu: { sales: 6, target: 6, margin: 9000 }
    },
    trend: "up",
    alerts: []
  }
]

// TODO: replace with API data
const brandKPIs: BrandKPIs = {
  volume: {
    current: 287,
    target: 300,
    objectiveRate: 95.7,
    trend: 8
  },
  margin: {
    total: 430500,
    target: 450000,
    avgGPU: 1500,
    trend: 5
  },
  financing: {
    rate: 76,
    target: 75,
    trend: 2
  },
  satisfaction: {
    nps: 86,
    target: 85,
    trend: 1
  },
  stock: {
    avgDays: 41,
    target: 45,
    totalUnits: 485
  },
  constructorBonus: {
    estimated: 125000,
    volumeAchieved: false,
    financingAchieved: true,
    satisfactionAchieved: true
  }
}

// TODO: replace with API data
const performanceHistory: PerformanceHistory[] = [
  { month: "Sep 2023", volume: 265, volumeTarget: 280, margin: 397500, financingRate: 72, satisfaction: 83 },
  { month: "Oct 2023", volume: 278, volumeTarget: 290, margin: 417000, financingRate: 74, satisfaction: 84 },
  { month: "Nov 2023", volume: 290, volumeTarget: 295, margin: 435000, financingRate: 75, satisfaction: 85 },
  { month: "Déc 2023", volume: 312, volumeTarget: 310, margin: 468000, financingRate: 77, satisfaction: 86 },
  { month: "Jan 2024", volume: 275, volumeTarget: 290, margin: 412500, financingRate: 74, satisfaction: 85 },
  { month: "Fév 2024", volume: 287, volumeTarget: 300, margin: 430500, financingRate: 76, satisfaction: 86 }
]

// TODO: replace with API data
function getDealershipRanking(): DealershipData[] {
  return [...dealerships].sort((a, b) => b.stats.objectiveRate - a.stats.objectiveRate)
}

// ============================================
// CONSTANTS
// ============================================

type MetricType = "objective" | "sales" | "margin" | "gpu" | "financing" | "satisfaction" | "stock"

const metrics: Array<{
  key: MetricType
  label: string
  unit: string
  icon: React.ElementType
  getValue: (d: DealershipData) => number
  getTarget?: () => number
  higherIsBetter: boolean
}> = [
  { key: "objective", label: "Objectif", unit: "%", icon: TrendingUp, getValue: d => d.stats.objectiveRate, higherIsBetter: true },
  { key: "sales", label: "Ventes", unit: "", icon: Car, getValue: d => d.stats.totalSales, higherIsBetter: true },
  { key: "margin", label: "Marge", unit: "€", icon: Euro, getValue: d => d.stats.totalMargin, higherIsBetter: true },
  { key: "gpu", label: "GPU", unit: "€", icon: Euro, getValue: d => d.stats.avgGPU, higherIsBetter: true },
  { key: "financing", label: "Financement", unit: "%", icon: Percent, getValue: d => d.stats.financingRate, getTarget: () => 75, higherIsBetter: true },
  { key: "satisfaction", label: "NPS", unit: "", icon: Star, getValue: d => d.stats.satisfaction, getTarget: () => 85, higherIsBetter: true },
  { key: "stock", label: "Stock", unit: "j", icon: Clock, getValue: d => d.stats.stockDays, getTarget: () => 45, higherIsBetter: false }
]

// ============================================
// COMPONENTS
// ============================================

function MetricComparisonChart({ metric }: { metric: typeof metrics[0] }) {
  const sortedDealerships = [...dealerships].sort((a, b) => {
    const valA = metric.getValue(a)
    const valB = metric.getValue(b)
    return metric.higherIsBetter ? valB - valA : valA - valB
  })

  const maxValue = Math.max(...sortedDealerships.map(d => metric.getValue(d)))
  const target = metric.getTarget?.()

  return (
    <div className="space-y-3">
      {sortedDealerships.map((d, index) => {
        const value = metric.getValue(d)
        const barWidth = (value / maxValue) * 100
        const isAboveTarget = target ? (metric.higherIsBetter ? value >= target : value <= target) : true

        return (
          <div key={d.id} className="flex items-center gap-4">
            <div className="w-8 text-center">
              <Badge className={`${
                index === 0 ? "bg-amber-100 text-amber-700" :
                index === 1 ? "bg-gray-100 text-gray-700" :
                index === 2 ? "bg-orange-100 text-orange-700" :
                "bg-gray-50 text-gray-500"
              }`}>
                #{index + 1}
              </Badge>
            </div>
            <div className="w-32 truncate">
              <span className="text-sm font-medium text-gray-900">{d.name}</span>
            </div>
            <div className="flex-1">
              <div className="h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                <div
                  className={`h-full rounded-lg transition-all ${
                    isAboveTarget ? "bg-gradient-to-r from-emerald-400 to-emerald-500" :
                    "bg-gradient-to-r from-amber-400 to-amber-500"
                  }`}
                  style={{ width: `${barWidth}%` }}
                />
                {target && (
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500"
                    style={{ left: `${(target / maxValue) * 100}%` }}
                  />
                )}
              </div>
            </div>
            <div className="w-20 text-right">
              <span className={`font-bold ${isAboveTarget ? "text-emerald-600" : "text-amber-600"}`}>
                {metric.key === "margin"
                  ? `${(value / 1000).toFixed(0)}k`
                  : value.toLocaleString()
                }
                {metric.unit}
              </span>
            </div>
          </div>
        )
      })}

      {target && (
        <div className="flex items-center gap-2 pt-2 border-t">
          <div className="w-3 h-0.5 bg-red-500" />
          <span className="text-xs text-gray-500">Objectif: {target}{metric.unit}</span>
        </div>
      )}
    </div>
  )
}

function RadarChartMock({ dealershipId }: { dealershipId: string }) {
  const dealership = dealerships.find(d => d.id === dealershipId)
  if (!dealership) return null

  const avgValues = {
    objective: dealerships.reduce((sum, d) => sum + d.stats.objectiveRate, 0) / dealerships.length,
    financing: dealerships.reduce((sum, d) => sum + d.stats.financingRate, 0) / dealerships.length,
    satisfaction: dealerships.reduce((sum, d) => sum + d.stats.satisfaction, 0) / dealerships.length,
    gpu: dealerships.reduce((sum, d) => sum + d.stats.avgGPU, 0) / dealerships.length
  }

  const metricsData = [
    { label: "Objectif", value: dealership.stats.objectiveRate, avg: avgValues.objective, max: 120 },
    { label: "Financement", value: dealership.stats.financingRate, avg: avgValues.financing, max: 100 },
    { label: "NPS", value: dealership.stats.satisfaction, avg: avgValues.satisfaction, max: 100 },
    { label: "GPU", value: dealership.stats.avgGPU / 20, avg: avgValues.gpu / 20, max: 100 }
  ]

  return (
    <div className="space-y-4">
      {metricsData.map((m) => (
        <div key={m.label} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{m.label}</span>
            <span className="font-semibold">{m.label === "GPU" ? `${m.value * 20}€` : `${m.value}%`}</span>
          </div>
          <div className="relative h-2 bg-gray-100 rounded-full">
            <div
              className="absolute h-full bg-gray-300 rounded-full"
              style={{ width: `${(m.avg / m.max) * 100}%` }}
            />
            <div
              className={`absolute h-full rounded-full ${
                m.value >= m.avg ? "bg-emerald-500" : "bg-amber-500"
              }`}
              style={{ width: `${(m.value / m.max) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-400">Moyenne réseau: {m.label === "GPU" ? `${Math.round(m.avg * 20)}€` : `${Math.round(m.avg)}%`}</p>
        </div>
      ))}
    </div>
  )
}

function EvolutionChart() {
  const maxVolume = Math.max(...performanceHistory.map(p => p.volume))

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-500" />
          <span className="text-sm text-gray-600">Réalisé</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-300" />
          <span className="text-sm text-gray-600">Objectif</span>
        </div>
      </div>

      <div className="flex items-end gap-3 h-48">
        {performanceHistory.map((month) => {
          const volumeHeight = (month.volume / maxVolume) * 100
          const targetHeight = (month.volumeTarget / maxVolume) * 100
          const achieved = month.volume >= month.volumeTarget

          return (
            <div key={month.month} className="flex-1 flex flex-col items-center gap-1">
              <div className="text-xs font-semibold text-gray-700 mb-1">{month.volume}</div>
              <div className="relative w-full h-40 flex items-end justify-center gap-1">
                <div
                  className="w-5 bg-gray-200 rounded-t"
                  style={{ height: `${targetHeight}%` }}
                />
                <div
                  className={`w-5 rounded-t ${achieved ? "bg-emerald-500" : "bg-indigo-500"}`}
                  style={{ height: `${volumeHeight}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">{month.month.split(" ")[0]}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================
// MAIN PAGE
// ============================================

export default function BenchmarkPage() {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("objective")
  const [selectedDealership, setSelectedDealership] = useState<string>(dealerships[0].id)

  const currentMetric = metrics.find(m => m.key === selectedMetric)!
  const rankedDealerships = getDealershipRanking()

  // Calculate averages
  const avgObjective = Math.round(dealerships.reduce((sum, d) => sum + d.stats.objectiveRate, 0) / dealerships.length)
  const avgGPU = Math.round(dealerships.reduce((sum, d) => sum + d.stats.avgGPU, 0) / dealerships.length)
  const avgFinancing = Math.round(dealerships.reduce((sum, d) => sum + d.stats.financingRate, 0) / dealerships.length)
  const avgSatisfaction = Math.round(dealerships.reduce((sum, d) => sum + d.stats.satisfaction, 0) / dealerships.length)

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/marque" className="hover:text-indigo-600 transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Benchmark</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Benchmark des concessions
          </h1>
          <p className="text-gray-500 mt-1">
            Comparaison des performances de vos {dealerships.length} concessions
          </p>
        </div>

        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Exporter
        </Button>
      </div>

      {/* Average KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-premium">
          <CardContent className="p-5 text-center">
            <p className="text-sm text-gray-500">Objectif moyen</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{avgObjective}%</p>
            <Badge className={`mt-2 ${avgObjective >= 95 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
              {avgObjective >= 95 ? "En bonne voie" : "À améliorer"}
            </Badge>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-premium">
          <CardContent className="p-5 text-center">
            <p className="text-sm text-gray-500">GPU moyen</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{avgGPU}€</p>
            <p className="text-sm text-gray-400 mt-1">par véhicule</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-premium">
          <CardContent className="p-5 text-center">
            <p className="text-sm text-gray-500">Financement moyen</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{avgFinancing}%</p>
            <Badge className={`mt-2 ${avgFinancing >= 75 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
              Cible: 75%
            </Badge>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-premium">
          <CardContent className="p-5 text-center">
            <p className="text-sm text-gray-500">NPS moyen</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{avgSatisfaction}</p>
            <Badge className={`mt-2 ${avgSatisfaction >= 85 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
              Cible: 85
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Main Comparison */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Metric Comparison */}
        <Card className="border-0 shadow-premium lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  Comparaison par métrique
                </CardTitle>
                <CardDescription>Classement des concessions</CardDescription>
              </div>
              <Select value={selectedMetric} onValueChange={(v) => setSelectedMetric(v as MetricType)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {metrics.map(m => (
                    <SelectItem key={m.key} value={m.key}>
                      <span className="flex items-center gap-2">
                        <m.icon className="w-4 h-4" />
                        {m.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <MetricComparisonChart metric={currentMetric} />
          </CardContent>
        </Card>

        {/* Dealership Profile */}
        <Card className="border-0 shadow-premium">
          <CardHeader>
            <CardTitle className="text-lg">Profil concession</CardTitle>
            <Select value={selectedDealership} onValueChange={setSelectedDealership}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dealerships.map(d => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <RadarChartMock dealershipId={selectedDealership} />
          </CardContent>
        </Card>
      </div>

      {/* Evolution & Ranking */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Evolution */}
        <Card className="border-0 shadow-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Évolution du volume réseau
            </CardTitle>
            <CardDescription>6 derniers mois</CardDescription>
          </CardHeader>
          <CardContent>
            <EvolutionChart />
          </CardContent>
        </Card>

        {/* Ranking Table */}
        <Card className="border-0 shadow-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Classement général
            </CardTitle>
            <CardDescription>Par taux d&apos;atteinte des objectifs</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {rankedDealerships.map((d, index) => (
                <div key={d.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                    index === 0 ? "bg-amber-100 text-amber-700" :
                    index === 1 ? "bg-gray-100 text-gray-700" :
                    index === 2 ? "bg-orange-100 text-orange-700" :
                    "bg-gray-50 text-gray-500"
                  }`}>
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{d.name}</p>
                    <p className="text-sm text-gray-500">{d.location}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      d.stats.objectiveRate >= 100 ? "text-emerald-600" :
                      d.stats.objectiveRate >= 90 ? "text-blue-600" :
                      "text-amber-600"
                    }`}>
                      {d.stats.objectiveRate}%
                    </p>
                    <div className={`flex items-center gap-1 text-xs ${
                      d.trend === "up" ? "text-emerald-600" :
                      d.trend === "down" ? "text-red-600" :
                      "text-gray-400"
                    }`}>
                      {d.trend === "up" ? <TrendingUp className="w-3 h-3" /> :
                       d.trend === "down" ? <TrendingDown className="w-3 h-3" /> :
                       <Minus className="w-3 h-3" />}
                      {d.trend === "up" ? "En hausse" :
                       d.trend === "down" ? "En baisse" : "Stable"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
