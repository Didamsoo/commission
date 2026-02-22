"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Building,
  TrendingUp,
  TrendingDown,
  Minus,
  Euro,
  Car,
  Target,
  Trophy,
  Percent,
  Star,
  AlertTriangle,
  CheckCircle,
  Users,
  ArrowRight,
  Plus,
  Bell,
  Zap,
  BarChart3,
  FileText,
  PieChart,
  DollarSign,
  Briefcase,
  Globe,
  ChevronRight,
  Calendar,
  Loader2
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProfil } from "@/hooks/use-profil"
import { useDashboard } from "@/hooks/use-dashboard"
import { useDefis } from "@/hooks/use-defis"
import { useNotifications } from "@/hooks/use-notifications"
import { SalesTrendChart } from "@/components/charts/sales-trend-chart"

// ============================================
// INTERFACES
// ============================================

interface BrandData {
  id: string
  name: string
  logo: string
  color: string
  directorId: string
  directorName: string
  dealershipCount: number
  employeeCount: number
  stats: {
    totalSales: number
    salesTarget: number
    objectiveRate: number
    totalRevenue: number
    totalMargin: number
    avgGPU: number
    financingRate: number
    satisfaction: number
    marketShare: number
  }
  trend: "up" | "down" | "stable"
  quarterlyGrowth: number
}

interface GroupKPIs {
  revenue: { current: number; target: number; growth: number }
  ebitda: { current: number; margin: number; target: number }
  volume: { current: number; target: number; objectiveRate: number }
  marketShare: { current: number; evolution: number }
  satisfaction: { nps: number; target: number }
  workforce: { total: number; turnover: number }
}

interface GroupPL {
  category: string
  ford: number
  nissan: number
  suzuki: number
  total: number
  budget: number
  variance: number
}

interface GroupChallenge {
  id: string
  title: string
  description: string
  type: string
  period: "monthly" | "quarterly" | "yearly"
  targetValue: number
  targetUnit: string
  startDate: string
  endDate: string
  reward: { type: string; value: string; description: string }
  participants: Array<{
    brandId: string
    brandName: string
    currentValue: number
    progressRate: number
    isCompleted: boolean
  }>
  status: "active" | "completed" | "upcoming"
}

interface TrendData {
  category: string
  currentValue: number
  previousValue: number
  unit: string
  trend: "up" | "down" | "stable"
  insight: string
}

interface GroupPerformanceHistory {
  month: string
  ford: { sales: number; margin: number }
  nissan: { sales: number; margin: number }
  suzuki: { sales: number; margin: number }
  total: { sales: number; margin: number }
}

interface GroupAlert {
  id: string
  type: "critical" | "warning" | "info" | "success"
  title: string
  message: string
  brandId?: string
  brandName?: string
  createdAt: string
  isRead: boolean
}

// ============================================
// STATIC DATA (TODO: replace with API data)
// ============================================

// TODO: replace with API data
const brands: BrandData[] = [
  {
    id: "brand-ford",
    name: "Ford",
    logo: "🚙",
    color: "from-blue-600 to-blue-700",
    directorId: "dir-marque-1",
    directorName: "Jean Legrand",
    dealershipCount: 6,
    employeeCount: 420,
    stats: {
      totalSales: 287,
      salesTarget: 300,
      objectiveRate: 95.7,
      totalRevenue: 8610000,
      totalMargin: 430500,
      avgGPU: 1500,
      financingRate: 76,
      satisfaction: 86,
      marketShare: 4.2
    },
    trend: "up",
    quarterlyGrowth: 8
  },
  {
    id: "brand-nissan",
    name: "Nissan",
    logo: "🚗",
    color: "from-red-600 to-red-700",
    directorId: "dir-marque-2",
    directorName: "Marie Dupont",
    dealershipCount: 5,
    employeeCount: 350,
    stats: {
      totalSales: 312,
      salesTarget: 320,
      objectiveRate: 97.5,
      totalRevenue: 9360000,
      totalMargin: 468000,
      avgGPU: 1500,
      financingRate: 72,
      satisfaction: 84,
      marketShare: 3.8
    },
    trend: "stable",
    quarterlyGrowth: 3
  },
  {
    id: "brand-suzuki",
    name: "Suzuki",
    logo: "🚐",
    color: "from-yellow-500 to-yellow-600",
    directorId: "dir-marque-3",
    directorName: "Thomas Petit",
    dealershipCount: 4,
    employeeCount: 280,
    stats: {
      totalSales: 293,
      salesTarget: 320,
      objectiveRate: 91.6,
      totalRevenue: 8790000,
      totalMargin: 439500,
      avgGPU: 1500,
      financingRate: 74,
      satisfaction: 88,
      marketShare: 2.9
    },
    trend: "up",
    quarterlyGrowth: 12
  }
]

// TODO: replace with API data
const groupKPIs: GroupKPIs = {
  revenue: {
    current: 485000000,
    target: 500000000,
    growth: 8
  },
  ebitda: {
    current: 14550000,
    margin: 3.0,
    target: 15000000
  },
  volume: {
    current: 892,
    target: 940,
    objectiveRate: 94.8
  },
  marketShare: {
    current: 10.9,
    evolution: 0.8
  },
  satisfaction: {
    nps: 86,
    target: 85
  },
  workforce: {
    total: 1400,
    turnover: 8.5
  }
}

// TODO: replace with API data
const groupPL: GroupPL[] = [
  { category: "Chiffre d'affaires VN", ford: 145000000, nissan: 165000000, suzuki: 120000000, total: 430000000, budget: 440000000, variance: -2.3 },
  { category: "Chiffre d'affaires VO", ford: 32000000, nissan: 28000000, suzuki: 25000000, total: 85000000, budget: 80000000, variance: 6.3 },
  { category: "Chiffre d'affaires APV", ford: 18000000, nissan: 15000000, suzuki: 12000000, total: 45000000, budget: 48000000, variance: -6.3 },
  { category: "Marge brute", ford: 8700000, nissan: 9400000, suzuki: 7100000, total: 25200000, budget: 25500000, variance: -1.2 },
  { category: "Frais de personnel", ford: -4200000, nissan: -3500000, suzuki: -2800000, total: -10500000, budget: -10200000, variance: -2.9 },
  { category: "Autres charges", ford: -2100000, nissan: -1800000, suzuki: -1500000, total: -5400000, budget: -5500000, variance: 1.8 },
  { category: "EBITDA", ford: 5200000, nissan: 5400000, suzuki: 3950000, total: 14550000, budget: 15000000, variance: -3.0 }
]

// TODO: replace with API data
const groupAlerts: GroupAlert[] = [
  {
    id: "ga-1",
    type: "warning",
    title: "Stock VN élevé",
    message: "Le stock VN groupe atteint 52 jours (cible: 45 jours). Actions correctives recommandées.",
    createdAt: "2024-02-20T08:00:00Z",
    isRead: false
  },
  {
    id: "ga-2",
    type: "success",
    title: "Objectif satisfaction atteint",
    message: "2 marques sur 3 dépassent l'objectif NPS de 85",
    createdAt: "2024-02-19T16:00:00Z",
    isRead: false
  },
  {
    id: "ga-3",
    type: "info",
    title: "Rapport trimestriel",
    message: "Le rapport Q1 2024 est disponible pour validation",
    createdAt: "2024-02-19T10:00:00Z",
    isRead: true
  },
  {
    id: "ga-4",
    type: "warning",
    title: "Nissan sous objectif NPS",
    message: "Nissan affiche un NPS de 84 (cible: 85). Plan d'action en cours.",
    brandId: "brand-nissan",
    brandName: "Nissan",
    createdAt: "2024-02-18T14:00:00Z",
    isRead: true
  }
]

// TODO: replace with API data
const groupChallenges: GroupChallenge[] = [
  {
    id: "gc-1",
    title: "Meilleure marque Q1",
    description: "Plus haut taux d'atteinte des objectifs du trimestre",
    type: "volume",
    period: "quarterly",
    targetValue: 100,
    targetUnit: "%",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    reward: {
      type: "trophy",
      value: "Trophée Excellence",
      description: "Meilleure marque du groupe"
    },
    participants: [
      { brandId: "brand-nissan", brandName: "Nissan", currentValue: 97.5, progressRate: 97.5, isCompleted: false },
      { brandId: "brand-ford", brandName: "Ford", currentValue: 95.7, progressRate: 95.7, isCompleted: false },
      { brandId: "brand-suzuki", brandName: "Suzuki", currentValue: 91.6, progressRate: 91.6, isCompleted: false }
    ],
    status: "active"
  },
  {
    id: "gc-2",
    title: "Challenge Rentabilité",
    description: "Atteindre une marge EBITDA de 3.2%",
    type: "margin",
    period: "quarterly",
    targetValue: 3.2,
    targetUnit: "%",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    reward: {
      type: "bonus",
      value: "Bonus direction",
      description: "Prime de performance"
    },
    participants: [
      { brandId: "brand-ford", brandName: "Ford", currentValue: 3.1, progressRate: 97, isCompleted: false },
      { brandId: "brand-nissan", brandName: "Nissan", currentValue: 3.0, progressRate: 94, isCompleted: false },
      { brandId: "brand-suzuki", brandName: "Suzuki", currentValue: 2.8, progressRate: 88, isCompleted: false }
    ],
    status: "active"
  },
  {
    id: "gc-3",
    title: "Excellence Client",
    description: "Toutes les marques au-dessus de 85 NPS",
    type: "satisfaction",
    period: "monthly",
    targetValue: 85,
    targetUnit: "NPS",
    startDate: "2024-02-01",
    endDate: "2024-02-29",
    reward: {
      type: "recognition",
      value: "Star Service",
      description: "Label Excellence Client"
    },
    participants: [
      { brandId: "brand-suzuki", brandName: "Suzuki", currentValue: 88, progressRate: 103.5, isCompleted: true },
      { brandId: "brand-ford", brandName: "Ford", currentValue: 86, progressRate: 101.2, isCompleted: true },
      { brandId: "brand-nissan", brandName: "Nissan", currentValue: 84, progressRate: 98.8, isCompleted: false }
    ],
    status: "active"
  }
]

// TODO: replace with API data
const trendsData: TrendData[] = [
  {
    category: "Électrique",
    currentValue: 22,
    previousValue: 17,
    unit: "%",
    trend: "up",
    insight: "+5 pts vs N-1 - Forte progression sur tous les segments"
  },
  {
    category: "VO",
    currentValue: 3.2,
    previousValue: 2.9,
    unit: "% marge",
    trend: "up",
    insight: "Marges en hausse grâce à la tension du marché"
  },
  {
    category: "Atelier",
    currentValue: 82,
    previousValue: 78,
    unit: "% absorption",
    trend: "up",
    insight: "Bonne performance APV, objectif 85%"
  },
  {
    category: "Financement",
    currentValue: 74,
    previousValue: 72,
    unit: "%",
    trend: "up",
    insight: "+2 pts - Effort commercial récompensé"
  },
  {
    category: "Stock VN",
    currentValue: 52,
    previousValue: 45,
    unit: "jours",
    trend: "down",
    insight: "Attention: augmentation du stock, actions requises"
  }
]

// TODO: replace with API data
const groupPerformanceHistory: GroupPerformanceHistory[] = [
  { month: "Sep", ford: { sales: 265, margin: 397500 }, nissan: { sales: 280, margin: 420000 }, suzuki: { sales: 255, margin: 382500 }, total: { sales: 800, margin: 1200000 } },
  { month: "Oct", ford: { sales: 278, margin: 417000 }, nissan: { sales: 295, margin: 442500 }, suzuki: { sales: 268, margin: 402000 }, total: { sales: 841, margin: 1261500 } },
  { month: "Nov", ford: { sales: 290, margin: 435000 }, nissan: { sales: 305, margin: 457500 }, suzuki: { sales: 280, margin: 420000 }, total: { sales: 875, margin: 1312500 } },
  { month: "Déc", ford: { sales: 312, margin: 468000 }, nissan: { sales: 328, margin: 492000 }, suzuki: { sales: 305, margin: 457500 }, total: { sales: 945, margin: 1417500 } },
  { month: "Jan", ford: { sales: 275, margin: 412500 }, nissan: { sales: 298, margin: 447000 }, suzuki: { sales: 278, margin: 417000 }, total: { sales: 851, margin: 1276500 } },
  { month: "Fév", ford: { sales: 287, margin: 430500 }, nissan: { sales: 312, margin: 468000 }, suzuki: { sales: 293, margin: 439500 }, total: { sales: 892, margin: 1338000 } }
]

// ============================================
// HELPER FUNCTIONS
// ============================================

function getBrandRanking(): BrandData[] {
  return [...brands].sort((a, b) => b.stats.objectiveRate - a.stats.objectiveRate)
}

function getTotalEmployees(): number {
  return brands.reduce((sum, b) => sum + b.employeeCount, 0)
}

function getTotalDealerships(): number {
  return brands.reduce((sum, b) => sum + b.dealershipCount, 0)
}

// ============================================
// COMPONENTS
// ============================================

function ExecutiveStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color = "blue"
}: {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ElementType
  trend?: "up" | "down" | "stable"
  trendValue?: string
  color?: "blue" | "green" | "purple" | "amber" | "red" | "indigo"
}) {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    green: "from-emerald-500 to-emerald-600",
    purple: "from-purple-500 to-purple-600",
    amber: "from-amber-500 to-orange-500",
    red: "from-red-500 to-red-600",
    indigo: "from-indigo-500 to-indigo-600"
  }

  return (
    <Card className="border-0 shadow-premium">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            {trend && trendValue && (
              <div className={`flex items-center gap-1 text-sm ${
                trend === "up" ? "text-emerald-600" :
                trend === "down" ? "text-red-600" :
                "text-gray-500"
              }`}>
                {trend === "up" ? <TrendingUp className="w-4 h-4" /> :
                 trend === "down" ? <TrendingDown className="w-4 h-4" /> :
                 <Minus className="w-4 h-4" />}
                {trendValue}
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function BrandCard({ brand, rank }: { brand: BrandData, rank: number }) {
  return (
    <Link href={`/groupe/marques/${brand.id}`}>
      <Card className="border-0 shadow-premium hover:shadow-xl transition-all cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${brand.color} flex items-center justify-center text-2xl shadow-lg`}>
                {brand.logo}
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-900">{brand.name}</h3>
                <p className="text-sm text-gray-500">
                  {brand.dealershipCount} concessions • {brand.employeeCount} employés
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${
                rank === 1 ? "bg-amber-100 text-amber-700" :
                rank === 2 ? "bg-gray-100 text-gray-700" :
                "bg-orange-100 text-orange-700"
              }`}>
                <Trophy className="w-3 h-3 mr-1" />
                #{rank}
              </Badge>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                brand.trend === "up" ? "bg-emerald-100" :
                brand.trend === "down" ? "bg-red-100" :
                "bg-gray-100"
              }`}>
                {brand.trend === "up" ? <TrendingUp className="w-4 h-4 text-emerald-600" /> :
                 brand.trend === "down" ? <TrendingDown className="w-4 h-4 text-red-600" /> :
                 <Minus className="w-4 h-4 text-gray-400" />}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">CA</p>
              <p className="text-lg font-bold text-gray-900">
                {(brand.stats.totalRevenue / 1000000).toFixed(1)}M€
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Marge</p>
              <p className="text-lg font-bold text-emerald-600">
                {(brand.stats.totalMargin / 1000).toFixed(0)}k€
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Objectif volume</span>
                <span className={`font-semibold ${
                  brand.stats.objectiveRate >= 100 ? "text-emerald-600" :
                  brand.stats.objectiveRate >= 95 ? "text-blue-600" :
                  "text-amber-600"
                }`}>
                  {brand.stats.objectiveRate}%
                </span>
              </div>
              <Progress value={Math.min(brand.stats.objectiveRate, 100)} className={`h-2 ${
                brand.stats.objectiveRate >= 100 ? "[&>div]:bg-emerald-500" :
                brand.stats.objectiveRate >= 95 ? "[&>div]:bg-blue-500" :
                "[&>div]:bg-amber-500"
              }`} />
            </div>

            <div className="grid grid-cols-4 gap-2 pt-2 border-t">
              <div className="text-center">
                <p className="text-xs text-gray-500">Ventes</p>
                <p className="font-semibold">{brand.stats.totalSales}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">GPU</p>
                <p className="font-semibold">{brand.stats.avgGPU}€</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Financ.</p>
                <p className={`font-semibold ${brand.stats.financingRate >= 75 ? "text-emerald-600" : "text-amber-600"}`}>
                  {brand.stats.financingRate}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">NPS</p>
                <p className={`font-semibold ${brand.stats.satisfaction >= 85 ? "text-emerald-600" : "text-amber-600"}`}>
                  {brand.stats.satisfaction}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Dir: {brand.directorName}
            </span>
            <Badge className={`${
              brand.quarterlyGrowth > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
            }`}>
              {brand.quarterlyGrowth > 0 ? "+" : ""}{brand.quarterlyGrowth}% Q/Q
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function TrendCard({ trend }: { trend: TrendData }) {
  return (
    <div className={`p-4 rounded-xl border ${
      trend.trend === "up" ? "bg-emerald-50 border-emerald-200" :
      trend.trend === "down" ? "bg-red-50 border-red-200" :
      "bg-gray-50 border-gray-200"
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
      <p className="text-xs text-gray-400 mt-1">
        vs {trend.previousValue}{trend.unit} précédemment
      </p>
    </div>
  )
}

function GroupPerformanceChart() {
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
      </div>

      <div className="flex items-end gap-3 h-48">
        {groupPerformanceHistory.map((month) => {
          const fordHeight = (month.ford.sales / maxTotal) * 100
          const nissanHeight = (month.nissan.sales / maxTotal) * 100
          const suzukiHeight = (month.suzuki.sales / maxTotal) * 100

          return (
            <div key={month.month} className="flex-1 flex flex-col items-center gap-1">
              <div className="text-xs font-semibold text-gray-700 mb-1">{month.total.sales}</div>
              <div className="relative w-full h-40 flex items-end justify-center gap-0.5">
                <div
                  className="w-3 bg-blue-500 rounded-t"
                  style={{ height: `${fordHeight}%` }}
                />
                <div
                  className="w-3 bg-red-500 rounded-t"
                  style={{ height: `${nissanHeight}%` }}
                />
                <div
                  className="w-3 bg-yellow-500 rounded-t"
                  style={{ height: `${suzukiHeight}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">{month.month}</span>
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

export default function DirecteurPlaqueDashboard() {
  const [tab, setTab] = useState<"overview" | "challenges" | "pl" | "trends">("overview")

  const { data: profil } = useProfil()
  const { data: dashboardRaw } = useDashboard<Record<string, unknown>>("dir_plaque")
  const { data: defisData } = useDefis("active")
  const { data: notifData } = useNotifications(false)

  const perfHistory = (dashboardRaw as Record<string, unknown>)?.performanceHistory as { period: string; label: string; sales: number; target: number; margin: number; financingRate: number }[] | undefined

  // Build alerts from notifications API
  const allAlerts: GroupAlert[] = (notifData || []).map((n: any) => ({
    id: n.id,
    type: n.type === "alert" ? "warning" : n.type === "success" ? "success" : "info",
    title: n.title || "Notification",
    message: n.message || "",
    createdAt: n.created_at || new Date().toISOString(),
    isRead: n.is_read ?? true,
  }))

  // Build challenges from defis API
  const allChallenges: GroupChallenge[] = (defisData || []).map((d: any) => ({
    id: d.id,
    title: d.title || d.name || "Challenge",
    description: d.description || "",
    type: d.type || "volume",
    period: "monthly" as const,
    targetValue: d.target_value || 0,
    targetUnit: d.target_unit || "",
    startDate: d.start_date || "",
    endDate: d.end_date || "",
    reward: { type: "trophy", value: d.reward || "Prix", description: "" },
    participants: d.participants || [],
    status: (d.status as "active" | "completed" | "upcoming") || "active",
  }))

  const displayAlerts = allAlerts.length > 0 ? allAlerts : groupAlerts
  const displayChallenges = allChallenges.length > 0 ? allChallenges : groupChallenges

  const rankedBrands = getBrandRanking()
  const unreadAlerts = displayAlerts.filter(a => !a.isRead)
  const totalEmployees = getTotalEmployees()
  const totalDealerships = getTotalDealerships()
  const firstName = profil?.full_name?.split(" ")[0] || profil?.first_name || "Directeur"

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* ============================================
          HEADER
          ============================================ */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Globe className="w-4 h-4" />
            <span>Directeur de Plaque</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Groupe AutoPerf</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Bonjour, {firstName} 👋
          </h1>
          <p className="text-gray-500 mt-1">
            {brands.length} marques • {totalDealerships} concessions • {totalEmployees} collaborateurs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 relative">
            <Bell className="w-4 h-4" />
            Alertes
            {unreadAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadAlerts.length}
              </span>
            )}
          </Button>
          <Link href="/groupe/reports">
            <Button variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              Rapport Board
            </Button>
          </Link>
          <Link href="/groupe/challenges/new">
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 gap-2">
              <Plus className="w-4 h-4" />
              Nouveau challenge
            </Button>
          </Link>
        </div>
      </div>

      {/* ============================================
          EXECUTIVE KPIs
          ============================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <ExecutiveStatCard
          title="Chiffre d'affaires"
          value={`${(groupKPIs.revenue.current / 1000000).toFixed(0)}M€`}
          subtitle={`Objectif: ${(groupKPIs.revenue.target / 1000000).toFixed(0)}M€`}
          icon={DollarSign}
          color="blue"
          trend={groupKPIs.revenue.growth > 0 ? "up" : "down"}
          trendValue={`${groupKPIs.revenue.growth > 0 ? "+" : ""}${groupKPIs.revenue.growth}% YoY`}
        />
        <ExecutiveStatCard
          title="EBITDA"
          value={`${(groupKPIs.ebitda.current / 1000000).toFixed(1)}M€`}
          subtitle={`Marge: ${groupKPIs.ebitda.margin}%`}
          icon={Euro}
          color="green"
        />
        <ExecutiveStatCard
          title="Volume"
          value={groupKPIs.volume.current}
          subtitle={`${groupKPIs.volume.objectiveRate}% objectif`}
          icon={Car}
          color="purple"
        />
        <ExecutiveStatCard
          title="Part de marché"
          value={`${groupKPIs.marketShare.current}%`}
          subtitle="Région IdF"
          icon={PieChart}
          color="amber"
          trend={groupKPIs.marketShare.evolution > 0 ? "up" : "down"}
          trendValue={`${groupKPIs.marketShare.evolution > 0 ? "+" : ""}${groupKPIs.marketShare.evolution} pts`}
        />
        <ExecutiveStatCard
          title="NPS Groupe"
          value={groupKPIs.satisfaction.nps}
          subtitle={`Cible: ${groupKPIs.satisfaction.target}`}
          icon={Star}
          color={groupKPIs.satisfaction.nps >= groupKPIs.satisfaction.target ? "green" : "amber"}
        />
        <ExecutiveStatCard
          title="Effectifs"
          value={groupKPIs.workforce.total}
          subtitle={`Turnover: ${groupKPIs.workforce.turnover}%`}
          icon={Users}
          color="indigo"
        />
      </div>

      {/* ============================================
          MAIN CONTENT
          ============================================ */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="bg-gray-100 p-1">
          <TabsTrigger value="overview" className="gap-2">
            <Building className="w-4 h-4" />
            Marques
          </TabsTrigger>
          <TabsTrigger value="challenges" className="gap-2">
            <Zap className="w-4 h-4" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="pl" className="gap-2">
            <Euro className="w-4 h-4" />
            P&L
          </TabsTrigger>
          <TabsTrigger value="trends" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Tendances
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Performance par marque
            </h2>
            <Link href="/groupe/marques">
              <Button variant="outline" className="gap-2">
                Vue détaillée
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {rankedBrands.map((brand, index) => (
              <BrandCard key={brand.id} brand={brand} rank={index + 1} />
            ))}
          </div>

          {/* Performance Chart */}
          <Card className="border-0 shadow-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                Évolution du volume multi-marques
              </CardTitle>
              <CardDescription>6 derniers mois - Ventes consolidées</CardDescription>
            </CardHeader>
            <CardContent>
              {perfHistory && perfHistory.length > 0 ? (
                <SalesTrendChart data={perfHistory} />
              ) : (
                <GroupPerformanceChart />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* CHALLENGES TAB */}
        <TabsContent value="challenges" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Challenges inter-marques
            </h2>
            <Link href="/groupe/challenges/new">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nouveau challenge
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {displayChallenges.map(challenge => (
              <Card key={challenge.id} className="border-0 shadow-premium">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-gray-900">{challenge.title}</h3>
                        <Badge className={`${
                          challenge.status === "active" ? "bg-emerald-100 text-emerald-700" :
                          challenge.status === "completed" ? "bg-gray-100 text-gray-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {challenge.status === "active" ? "En cours" :
                           challenge.status === "completed" ? "Terminé" : "À venir"}
                        </Badge>
                        <Badge className="bg-gray-100 text-gray-600">
                          {challenge.period === "monthly" ? "Mensuel" :
                           challenge.period === "quarterly" ? "Trimestriel" : "Annuel"}
                        </Badge>
                      </div>
                      <p className="text-gray-500">{challenge.description}</p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-700">
                      <Trophy className="w-3 h-3 mr-1" />
                      {challenge.reward.value}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {challenge.participants.map((participant, index) => {
                      const brand = brands.find(b => b.id === participant.brandId)
                      return (
                        <div key={participant.brandId} className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${brand?.color || "from-gray-400 to-gray-500"} flex items-center justify-center text-lg`}>
                            {brand?.logo}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-gray-900">{participant.brandName}</span>
                              <span className="text-sm font-semibold">
                                {participant.currentValue}{challenge.targetUnit}
                              </span>
                            </div>
                            <Progress
                              value={Math.min(participant.progressRate, 100)}
                              className={`h-1.5 ${
                                participant.isCompleted ? "[&>div]:bg-emerald-500" : "[&>div]:bg-indigo-500"
                              }`}
                            />
                          </div>
                          {participant.isCompleted && (
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                          )}
                        </div>
                      )
                    })}
                  </div>

                  <p className="text-xs text-gray-500 mt-4">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    Du {new Date(challenge.startDate).toLocaleDateString("fr-FR")} au {new Date(challenge.endDate).toLocaleDateString("fr-FR")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* P&L TAB */}
        <TabsContent value="pl" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Compte de Résultat Consolidé
              </h2>
              <p className="text-gray-500">Février 2024 - Données YTD</p>
            </div>
            <Button variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              Exporter
            </Button>
          </div>

          <Card className="border-0 shadow-premium">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Catégorie</th>
                      <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Ford</th>
                      <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Nissan</th>
                      <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Suzuki</th>
                      <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600 bg-gray-100">Total</th>
                      <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Budget</th>
                      <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Écart</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupPL.map((row, index) => {
                      const isSubtotal = row.category === "EBITDA" || row.category === "Marge brute"
                      return (
                        <tr key={row.category} className={`border-b ${isSubtotal ? "bg-gray-50 font-semibold" : ""}`}>
                          <td className="py-3 px-6 text-gray-900">{row.category}</td>
                          <td className={`py-3 px-6 text-right ${row.ford < 0 ? "text-red-600" : ""}`}>
                            {(row.ford / 1000000).toFixed(1)}M€
                          </td>
                          <td className={`py-3 px-6 text-right ${row.nissan < 0 ? "text-red-600" : ""}`}>
                            {(row.nissan / 1000000).toFixed(1)}M€
                          </td>
                          <td className={`py-3 px-6 text-right ${row.suzuki < 0 ? "text-red-600" : ""}`}>
                            {(row.suzuki / 1000000).toFixed(1)}M€
                          </td>
                          <td className={`py-3 px-6 text-right bg-gray-50 font-semibold ${row.total < 0 ? "text-red-600" : ""}`}>
                            {(row.total / 1000000).toFixed(1)}M€
                          </td>
                          <td className={`py-3 px-6 text-right text-gray-500 ${row.budget < 0 ? "text-red-400" : ""}`}>
                            {(row.budget / 1000000).toFixed(1)}M€
                          </td>
                          <td className={`py-3 px-6 text-right font-medium ${
                            row.variance >= 0 ? "text-emerald-600" : "text-red-600"
                          }`}>
                            {row.variance >= 0 ? "+" : ""}{row.variance}%
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TRENDS TAB */}
        <TabsContent value="trends" className="mt-6 space-y-6">
          <h2 className="text-xl font-bold text-gray-900">
            Tendances & Analyses
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendsData.map(trend => (
              <TrendCard key={trend.category} trend={trend} />
            ))}
          </div>

          {/* Alerts */}
          <Card className="border-0 shadow-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-600" />
                Alertes Groupe
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {displayAlerts.map(alert => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${
                    alert.type === "critical" ? "bg-red-50 border-red-200" :
                    alert.type === "warning" ? "bg-amber-50 border-amber-200" :
                    alert.type === "success" ? "bg-emerald-50 border-emerald-200" :
                    "bg-blue-50 border-blue-200"
                  } ${!alert.isRead ? "ring-2 ring-offset-1 ring-blue-200" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    {alert.type === "critical" ? <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" /> :
                     alert.type === "warning" ? <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" /> :
                     alert.type === "success" ? <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" /> :
                     <Bell className="w-5 h-5 text-blue-600 flex-shrink-0" />}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                        {!alert.isRead && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(alert.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ============================================
          QUICK ACTIONS
          ============================================ */}
      <div className="grid md:grid-cols-4 gap-4">
        <Link href="/groupe/marques">
          <Card className="border-0 shadow-premium hover:shadow-xl transition-all cursor-pointer group">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Marques</p>
                <p className="text-sm text-gray-500">{brands.length} marques</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/groupe/performance">
          <Card className="border-0 shadow-premium hover:shadow-xl transition-all cursor-pointer group">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Performance</p>
                <p className="text-sm text-gray-500">Analyses</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/groupe/finances">
          <Card className="border-0 shadow-premium hover:shadow-xl transition-all cursor-pointer group">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Euro className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Finances</p>
                <p className="text-sm text-gray-500">P&L détaillé</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/groupe/reports">
          <Card className="border-0 shadow-premium hover:shadow-xl transition-all cursor-pointer group">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Rapports</p>
                <p className="text-sm text-gray-500">Board & Exports</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
