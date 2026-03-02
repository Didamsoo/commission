"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Users,
  CheckCircle,
  FileText,
  Settings,
  TrendingUp,
  TrendingDown,
  Euro,
  Car,
  Target,
  ChevronRight,
  Trophy,
  AlertCircle,
  Clock,
  Plus,
  BarChart3,
  ArrowUpRight,
  Zap,
  Crown,
  Activity,
  Percent,
  Award,
  Calendar,
  Building,
  Warehouse,
  Wrench,
  ShoppingCart,
  XCircle,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Package,
  Timer,
  Loader2
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { useProfil } from "@/hooks/use-profil"
import { useDashboard } from "@/hooks/use-dashboard"
import { useEquipe } from "@/hooks/use-equipe"
import { useApprobations } from "@/hooks/use-approbations"
import { useDefis } from "@/hooks/use-defis"
import { useNotifications } from "@/hooks/use-notifications"
import { TEAM_TYPE_CONFIG, TeamType } from "@/types/hierarchy"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { SalesTrendChart } from "@/components/charts/sales-trend-chart"

// ============================================
// LOCAL INTERFACES
// ============================================

interface ChefVentesInfo {
  id: string
  name: string
  avatar?: string
  email: string
  teamType: TeamType
  teamSize: number
  kpis: {
    teamSales: number
    teamSalesTarget: number
    teamMargin: number
    teamGPU: number
    teamFinancingRate: number
    teamConversionRate: number
    stockRotation: number
    membersAtObjective: number
    teamSize: number
    objectiveRate: number
    constructorBonusEstimate: number
    teamRanking: number
    teamRankingTotal: number
  }
  trend: "up" | "down" | "stable"
  alerts: { id: string; type: string; severity: "critical" | "warning" | "info"; title: string; message: string; isRead: boolean; createdAt: string }[]
}

interface DirConcessionKPIsType {
  totalSales: number
  totalRevenue: number
  totalMargin: number
  absorption: number
  satisfaction: number
  constructorBonus: number
}

interface TeamStats {
  totalSales: number
  totalRevenue: number
  totalMargin: number
  avgGPU: number
  financingRate: number
  objectiveRate: number
  membersAtObjective: number
  stockRotation: number
  trend: "up" | "down" | "stable"
}

interface PendingSaleType {
  id: string
  vehicleType: "VN" | "VO" | "VU"
  vehicleName: string
  clientName: string
  commercialName: string
  margin: number
  status: string
}

interface AlertType {
  id: string
  type: string
  severity: "critical" | "warning" | "info"
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

interface ChallengeType {
  id: string
  title: string
  description: string
  endDate: string
  reward: { type: string; value: number }
  participants: { id: string; name: string; avatar?: string; currentScore: number; progressRate: number; isCompleted: boolean }[]
}

// Static data imports removed — stock/P&L data requires DMS integration

// ============================================
// COMPONENTS
// ============================================

function StatCard({
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
    blue: { gradient: "from-blue-500 to-blue-600", bg: "bg-blue-50", text: "text-blue-600" },
    green: { gradient: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50", text: "text-emerald-600" },
    purple: { gradient: "from-purple-500 to-purple-600", bg: "bg-purple-50", text: "text-purple-600" },
    amber: { gradient: "from-amber-500 to-orange-500", bg: "bg-amber-50", text: "text-amber-600" },
    red: { gradient: "from-red-500 to-red-600", bg: "bg-red-50", text: "text-red-600" },
    indigo: { gradient: "from-indigo-500 to-indigo-600", bg: "bg-indigo-50", text: "text-indigo-600" }
  }

  const theme = colors[color]

  return (
    <Card className="border-0 shadow-premium hover:shadow-premium-lg transition-all duration-300 overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            {trend && trendValue && (
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                trend === "up" ? "bg-emerald-100 text-emerald-700" :
                trend === "down" ? "bg-red-100 text-red-700" :
                "bg-gray-100 text-gray-700"
              }`}>
                {trend === "up" ? <TrendingUp className="w-3 h-3" /> :
                 trend === "down" ? <TrendingDown className="w-3 h-3" /> :
                 <Minus className="w-3 h-3" />}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function DepartmentCard({ teamType, chefsVentes, departmentStats }: { teamType: TeamType; chefsVentes: ChefVentesInfo[]; departmentStats: Record<string, TeamStats> }) {
  const stats = departmentStats[teamType]
  if (!stats) return null
  const config = TEAM_TYPE_CONFIG[teamType]
  const chef = chefsVentes.find(cv => cv.teamType === teamType)

  const icons: Record<TeamType, React.ElementType> = {
    VN: Car,
    VO: ShoppingCart,
    VU: Package,
    APV: Wrench,
    ADMIN: Building
  }

  const Icon = icons[teamType]

  const colorClasses: Record<TeamType, string> = {
    VN: "from-blue-500 to-blue-600",
    VO: "from-emerald-500 to-emerald-600",
    VU: "from-amber-500 to-orange-500",
    APV: "from-purple-500 to-purple-600",
    ADMIN: "from-gray-500 to-gray-600"
  }

  return (
    <Card className="border-0 shadow-premium hover:shadow-premium-lg transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[teamType]} flex items-center justify-center shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{config.labelFull}</h3>
              {chef && (
                <p className="text-sm text-gray-500">
                  {chef.name} • {chef.teamSize} commerciaux
                </p>
              )}
            </div>
          </div>
          <Badge className={`${
            stats.objectiveRate >= 90 ? "bg-emerald-100 text-emerald-700" :
            stats.objectiveRate >= 75 ? "bg-blue-100 text-blue-700" :
            stats.objectiveRate >= 60 ? "bg-amber-100 text-amber-700" :
            "bg-red-100 text-red-700"
          }`}>
            {stats.objectiveRate}%
          </Badge>
        </div>

        {teamType !== "APV" && teamType !== "ADMIN" && (
          <>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Ventes</span>
                <span className="font-semibold">{stats.totalSales}</span>
              </div>
              <Progress value={stats.objectiveRate} className={`h-2 ${
                stats.objectiveRate >= 90 ? "[&>div]:bg-emerald-500" :
                stats.objectiveRate >= 75 ? "[&>div]:bg-blue-500" :
                stats.objectiveRate >= 60 ? "[&>div]:bg-amber-500" :
                "[&>div]:bg-red-500"
              }`} />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Marge</p>
                <p className="font-bold text-sm">{(stats.totalMargin / 1000).toFixed(0)}k€</p>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">GPU</p>
                <p className="font-bold text-sm">{stats.avgGPU}€</p>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Finance</p>
                <p className={`font-bold text-sm ${stats.financingRate >= 70 ? "text-emerald-600" : "text-amber-600"}`}>
                  {stats.financingRate}%
                </p>
              </div>
            </div>
          </>
        )}

        {teamType === "APV" && (
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">CA</p>
              <p className="font-bold">{(stats.totalRevenue / 1000).toFixed(0)}k€</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Marge</p>
              <p className="font-bold">{(stats.totalMargin / 1000).toFixed(0)}k€</p>
            </div>
          </div>
        )}

        {chef && teamType !== "APV" && teamType !== "ADMIN" && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {stats.trend === "up" && <TrendingUp className="w-4 h-4 text-emerald-500" />}
                {stats.trend === "down" && <TrendingDown className="w-4 h-4 text-red-500" />}
                {stats.trend === "stable" && <Minus className="w-4 h-4 text-gray-400" />}
                <span className="text-sm text-gray-500">
                  {stats.trend === "up" ? "En hausse" : stats.trend === "down" ? "En baisse" : "Stable"}
                </span>
              </div>
              <Link href={`/chef-ventes?team=${teamType}`}>
                <Button variant="ghost" size="sm" className="text-indigo-600">
                  Voir détails
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function PendingSaleRow({ sale }: { sale: PendingSaleType }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
        sale.vehicleType === "VN" ? "bg-blue-100 text-blue-600" :
        sale.vehicleType === "VO" ? "bg-emerald-100 text-emerald-600" :
        "bg-amber-100 text-amber-600"
      }`}>
        <Car className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-gray-900">{sale.vehicleName}</p>
          <Badge variant="outline" className="text-xs">{sale.vehicleType}</Badge>
        </div>
        <p className="text-sm text-gray-500">
          {sale.commercialName} • {sale.clientName}
        </p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-gray-900">{sale.margin.toLocaleString()}€</p>
        <p className="text-xs text-gray-500">marge</p>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="icon" variant="outline" className="h-8 w-8 text-emerald-600 border-emerald-200 hover:bg-emerald-50">
          <ThumbsUp className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="outline" className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50">
          <ThumbsDown className="w-4 h-4" />
        </Button>
        <Link href={`/direction/approvals/${sale.id}`}>
          <Button size="icon" variant="outline" className="h-8 w-8">
            <Eye className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

function AlertCard({ alert }: { alert: AlertType }) {
  const severityStyles = {
    critical: "border-red-200 bg-red-50",
    warning: "border-amber-200 bg-amber-50",
    info: "border-blue-200 bg-blue-50"
  }

  const severityIcons = {
    critical: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-500" />,
    info: <CheckCircle className="w-5 h-5 text-blue-500" />
  }

  return (
    <div className={`p-4 rounded-xl border ${severityStyles[alert.severity]} ${!alert.isRead ? "ring-2 ring-offset-2 ring-gray-200" : ""}`}>
      <div className="flex items-start gap-3">
        {severityIcons[alert.severity]}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900">{alert.title}</p>
          <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
        </div>
      </div>
    </div>
  )
}

function ChallengeCard({ challenge }: { challenge: ChallengeType }) {
  const leader = challenge.participants.sort((a, b) => b.currentScore - a.currentScore)[0]

  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{challenge.title}</h4>
          <p className="text-sm text-gray-500 mt-1">{challenge.description}</p>
        </div>
        <Badge className="bg-indigo-100 text-indigo-700">
          {challenge.reward.value}{challenge.reward.type === "bonus" ? "€" : " pts"}
        </Badge>
      </div>

      <div className="space-y-2 mb-3">
        {challenge.participants.map(p => (
          <div key={p.id} className="flex items-center gap-2">
            <span className="text-sm font-medium w-24">{p.name}</span>
            <div className="flex-1">
              <Progress value={p.progressRate} className={`h-2 ${
                p.isCompleted ? "[&>div]:bg-emerald-500" : "[&>div]:bg-indigo-500"
              }`} />
            </div>
            <span className="text-sm font-semibold w-12 text-right">{Math.round(p.progressRate)}%</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-indigo-100">
        <p className="text-xs text-gray-500">
          <Calendar className="w-3 h-3 inline mr-1" />
          Fin le {new Date(challenge.endDate).toLocaleDateString("fr-FR")}
        </p>
        <div className="flex items-center gap-1 text-xs text-indigo-600">
          <Trophy className="w-3 h-3" />
          Leader: {leader.name}
        </div>
      </div>
    </div>
  )
}

function StockSummaryCard() {
  return (
    <Card className="border-0 shadow-premium">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Warehouse className="w-5 h-5 text-purple-600" />
          État du stock
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Package className="w-10 h-10 text-gray-300 mb-3" />
          <p className="text-sm text-gray-500">Données stock non disponibles</p>
          <p className="text-xs text-gray-400 mt-1">Connectez votre DMS pour afficher les stocks en temps réel</p>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function DirectionDashboard() {
  const [tab, setTab] = useState<"overview" | "alerts">("overview")
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

  const dateRangeParams = dateRange?.from && dateRange?.to ? {
    startDate: format(dateRange.from, 'yyyy-MM-dd'),
    endDate: format(dateRange.to, 'yyyy-MM-dd'),
  } : undefined

  const { data: profil } = useProfil()
  const { data: dashboardRaw, loading: dashLoading } = useDashboard<Record<string, unknown>>("dir_concession", undefined, dateRangeParams)
  const { data: equipeData, loading: equipeLoading } = useEquipe()
  const { data: approbationsData } = useApprobations("pending")
  const { data: defisData } = useDefis("active")
  const { data: notifData } = useNotifications(false)

  // Build chefsVentes from equipe data (filter managers / chef_ventes role)
  const chefsVentes: ChefVentesInfo[] = (equipeData || [])
    .filter(m => m.role === "chef_ventes" || m.role === "manager")
    .map(m => ({
      id: m.user_id || m.id,
      name: m.full_name,
      avatar: m.avatar_url || "",
      email: m.email,
      teamType: (m.equipes?.type as TeamType) || "VN",
      teamSize: 5,
      kpis: {
        teamSales: m.total_sales || 0,
        teamSalesTarget: m.sales_target || 20,
        teamMargin: m.total_margin || 0,
        teamGPU: (m.total_margin && m.total_sales) ? Math.round((m.total_margin) / Math.max(m.total_sales, 1)) : 0,
        teamFinancingRate: m.financing_rate || 0,
        teamConversionRate: m.conversion_rate || 0,
        stockRotation: 28,
        membersAtObjective: 0,
        teamSize: 5,
        objectiveRate: m.sales_target ? Math.round(((m.total_sales || 0) / m.sales_target) * 100) : 0,
        constructorBonusEstimate: 0,
        teamRanking: 1,
        teamRankingTotal: 3
      },
      trend: (m.trend as "up" | "down" | "stable") || "stable",
      alerts: []
    }))

  // Build KPIs from dashboard data
  const dashData = (dashboardRaw || {}) as Record<string, unknown>
  const kpisRaw = dashData.kpis as Record<string, unknown> | undefined
  const dirConcessionKPIs: DirConcessionKPIsType = {
    totalSales: (kpisRaw?.totalSales as number) || 0,
    totalRevenue: (kpisRaw?.totalRevenue as number) || 0,
    totalMargin: (kpisRaw?.totalMargin as number) || 0,
    absorption: (kpisRaw?.absorption as number) || 82,
    satisfaction: (kpisRaw?.satisfaction as number) || 87,
    constructorBonus: (kpisRaw?.constructor_bonus as number) || 45000
  }

  // DepartmentStats from API (replaces hardcoded mock)
  const apiDeptStats = (dashData.departmentStats || {}) as Record<string, { totalSales: number; totalRevenue: number; totalMargin: number; avgGPU: number; financingRate: number }>

  const departmentStats: Record<string, TeamStats> = {}
  for (const dept of ["VN", "VO", "VU", "APV", "ADMIN"]) {
    const api = apiDeptStats[dept]
    if (api) {
      const totalTarget = api.totalSales > 0 ? Math.round(api.totalSales * 1.1) : 0
      const objectiveRate = totalTarget > 0 ? Math.round((api.totalSales / totalTarget) * 100) : 0
      departmentStats[dept] = {
        totalSales: api.totalSales,
        totalRevenue: api.totalRevenue,
        totalMargin: api.totalMargin,
        avgGPU: api.avgGPU,
        financingRate: api.financingRate,
        objectiveRate,
        membersAtObjective: 0,
        stockRotation: 0,
        trend: api.totalSales > 0 ? "up" : "stable",
      }
    } else {
      departmentStats[dept] = {
        totalSales: 0, totalRevenue: 0, totalMargin: 0, avgGPU: 0,
        financingRate: 0, objectiveRate: 0, membersAtObjective: 0, stockRotation: 0, trend: "stable",
      }
    }
  }

  // Derive alerts from notifications
  const allAlerts: AlertType[] = ((notifData as unknown[]) || []).map((n: unknown) => {
    const notif = n as Record<string, unknown>
    return {
      id: notif.id as string || "",
      type: notif.type as string || "info",
      severity: (notif.severity as "critical" | "warning" | "info") || "info",
      title: notif.title as string || "",
      message: notif.message as string || "",
      isRead: notif.is_read as boolean || false,
      createdAt: notif.created_at as string || ""
    }
  })
  const unreadAlerts = allAlerts.filter(a => !a.isRead)

  // Derive pending sales from approbations
  const pendingSalesList: PendingSaleType[] = ((approbationsData as unknown[]) || []).map((a: unknown) => {
    const sale = a as Record<string, unknown>
    return {
      id: sale.id as string || "",
      vehicleType: (sale.vehicle_type as "VN" | "VO" | "VU") || "VN",
      vehicleName: sale.vehicle_name as string || "",
      clientName: sale.client_name as string || "",
      commercialName: sale.commercial_name as string || "",
      margin: sale.margin as number || 0,
      status: sale.status as string || "pending"
    }
  })
  const pendingCount = pendingSalesList.filter(s => s.status === "pending").length

  // Derive challenges from defis
  const interTeamChallenges: ChallengeType[] = ((defisData as unknown[]) || []).map((d: unknown) => {
    const defi = d as Record<string, unknown>
    return {
      id: defi.id as string || "",
      title: defi.title as string || "",
      description: defi.description as string || "",
      endDate: defi.end_date as string || "",
      reward: {
        type: (defi.reward_type as string) || "bonus",
        value: (defi.reward_value as number) || 0
      },
      participants: ((defi.participants as unknown[]) || []).map((p: unknown) => {
        const part = p as Record<string, unknown>
        return {
          id: part.id as string || "",
          name: part.name as string || "",
          avatar: part.avatar as string,
          currentScore: part.current_score as number || 0,
          progressRate: part.progress_rate as number || 0,
          isCompleted: part.is_completed as boolean || false
        }
      })
    }
  })

  // Calculate totals
  const totalSales = chefsVentes.reduce((sum, cv) => sum + cv.kpis.teamSales, 0) || dirConcessionKPIs.totalSales
  const totalTarget = chefsVentes.reduce((sum, cv) => sum + cv.kpis.teamSalesTarget, 0) || 120
  const totalMargin = chefsVentes.reduce((sum, cv) => sum + cv.kpis.teamMargin, 0) || dirConcessionKPIs.totalMargin
  const objectiveRate = totalTarget > 0 ? Math.round((totalSales / totalTarget) * 100) : 0

  // Dynamic days remaining in month
  const now = new Date()
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const daysRemaining = Math.max(0, endOfMonth.getDate() - now.getDate())

  // Loading state
  if (dashLoading || equipeLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <p className="text-gray-500">Chargement du tableau de bord...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* ============================================
          HEADER
          ============================================ */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
            <Building className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Bonjour, {(profil?.full_name || "Directeur").split(" ")[0]} !
            </h1>
            <p className="text-gray-500">
              Directeur de Concession • Ford Paris Est
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <Link href="/direction/reports">
            <Button variant="outline" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Rapports
            </Button>
          </Link>
          <Link href="/direction/challenges/new">
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/25 gap-2">
              <Plus className="w-4 h-4" />
              Nouveau challenge
            </Button>
          </Link>
        </div>
      </div>

      {/* ============================================
          ALERT BANNER
          ============================================ */}
      {objectiveRate < 85 && (
        <Card className="border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-white">
                  <p className="font-bold text-lg">Objectif constructeur en danger !</p>
                  <p className="text-white/80">
                    {totalSales}/{totalTarget} ventes ({objectiveRate}%) •
                    {" "}{totalTarget - totalSales} ventes restantes •
                    {" "}{daysRemaining} jours
                  </p>
                </div>
              </div>
              <Link href="/direction/reports">
                <Button className="bg-white text-orange-600 hover:bg-white/90 font-semibold">
                  Voir le détail
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* ============================================
          STATS GRID
          ============================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Ventes concession"
          value={`${totalSales}/${totalTarget}`}
          subtitle={`${objectiveRate}% de l'objectif`}
          icon={Car}
          trend={objectiveRate >= 100 ? "up" : objectiveRate >= 85 ? "stable" : "down"}
          trendValue={objectiveRate >= 100 ? "Objectif atteint !" : `${totalTarget - totalSales} restantes`}
          color={objectiveRate >= 100 ? "green" : objectiveRate >= 85 ? "blue" : "amber"}
        />
        <StatCard
          title="Marge totale"
          value={`${(totalMargin / 1000).toFixed(0)}k€`}
          subtitle={`GPU: ${dirConcessionKPIs.totalSales > 0 ? Math.round(totalMargin / totalSales) : 0}€`}
          icon={Euro}
          trend="up"
          trendValue="+4.1% vs budget"
          color="green"
        />
        <StatCard
          title="Taux absorption"
          value={`${dirConcessionKPIs.absorption}%`}
          subtitle="Objectif: 80%"
          icon={Wrench}
          trend={dirConcessionKPIs.absorption >= 80 ? "up" : "down"}
          trendValue={dirConcessionKPIs.absorption >= 80 ? "Au-dessus cible" : "Sous cible"}
          color={dirConcessionKPIs.absorption >= 80 ? "green" : "amber"}
        />
        <StatCard
          title="Satisfaction"
          value={`${dirConcessionKPIs.satisfaction}%`}
          subtitle="NPS client"
          icon={ThumbsUp}
          trend="up"
          trendValue="+2pts vs M-1"
          color="purple"
        />
        <StatCard
          title="Prime constructeur"
          value={`${(dirConcessionKPIs.constructorBonus / 1000).toFixed(0)}k€`}
          subtitle="Estimée"
          icon={Trophy}
          color="amber"
        />
      </div>

      {/* ============================================
          DEPARTMENTS GRID
          ============================================ */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          Performance par département
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <DepartmentCard teamType="VN" chefsVentes={chefsVentes} departmentStats={departmentStats} />
          <DepartmentCard teamType="VO" chefsVentes={chefsVentes} departmentStats={departmentStats} />
          <DepartmentCard teamType="VU" chefsVentes={chefsVentes} departmentStats={departmentStats} />
          <DepartmentCard teamType="APV" chefsVentes={chefsVentes} departmentStats={departmentStats} />
        </div>
      </div>

      {/* ============================================
          PERFORMANCE CHART
          ============================================ */}
      {(() => {
        const perfHistory = (dashboardRaw as Record<string, unknown>)?.performanceHistory as { period: string; label: string; sales: number; target: number; margin: number; financingRate: number }[] | undefined
        if (!perfHistory || perfHistory.length === 0) return null
        return (
          <Card className="border-0 shadow-premium">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Tendance des ventes par département
              </CardTitle>
              <CardDescription>6 derniers mois — Toutes équipes confondues</CardDescription>
            </CardHeader>
            <CardContent>
              <SalesTrendChart data={perfHistory} />
            </CardContent>
          </Card>
        )
      })()}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ============================================
            PENDING APPROVALS
            ============================================ */}
        <Card className="border-0 shadow-premium lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Ventes en attente
              </CardTitle>
              <CardDescription>
                {pendingCount} vente{pendingCount > 1 ? "s" : ""} à approuver
              </CardDescription>
            </div>
            <Link href="/direction/approvals">
              <Button variant="ghost" className="gap-1">
                Voir tout
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {pendingSalesList.filter(s => s.status === "pending").slice(0, 3).map(sale => (
                <PendingSaleRow key={sale.id} sale={sale} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ============================================
            STOCK SUMMARY
            ============================================ */}
        <StockSummaryCard />
      </div>

      {/* ============================================
          TABS: OVERVIEW / ALERTS
          ============================================ */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="bg-gray-100 p-1">
          <TabsTrigger value="overview" className="gap-2">
            <Zap className="w-4 h-4" />
            Challenges ({interTeamChallenges.length})
          </TabsTrigger>
          <TabsTrigger value="alerts" className="gap-2 relative">
            <AlertCircle className="w-4 h-4" />
            Alertes
            {unreadAlerts.length > 0 && (
              <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs h-5 w-5 p-0 flex items-center justify-center">
                {unreadAlerts.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* CHALLENGES TAB */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {interTeamChallenges.map(challenge => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </TabsContent>

        {/* ALERTS TAB */}
        <TabsContent value="alerts" className="mt-6">
          <Card className="border-0 shadow-premium">
            <CardContent className="p-6">
              <div className="space-y-3">
                {allAlerts.map(alert => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      {/* ============================================
          QUICK ACTIONS
          ============================================ */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/direction/users">
          <Card className="border-0 shadow-premium hover:shadow-premium-lg transition-all duration-300 cursor-pointer group h-full">
            <CardContent className="p-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Gérer les équipes</h3>
              <p className="text-sm text-gray-500 mt-1">Utilisateurs et permissions</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/direction/approvals">
          <Card className="border-0 shadow-premium hover:shadow-premium-lg transition-all duration-300 cursor-pointer group h-full">
            <CardContent className="p-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Approbations</h3>
              <p className="text-sm text-gray-500 mt-1">{pendingCount} ventes en attente</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/direction/payplan">
          <Card className="border-0 shadow-premium hover:shadow-premium-lg transition-all duration-300 cursor-pointer group h-full">
            <CardContent className="p-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Payplan</h3>
              <p className="text-sm text-gray-500 mt-1">Configuration des commissions</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/direction/challenges">
          <Card className="border-0 shadow-premium hover:shadow-premium-lg transition-all duration-300 cursor-pointer group h-full">
            <CardContent className="p-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Challenges</h3>
              <p className="text-sm text-gray-500 mt-1">{interTeamChallenges.length} actifs</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
