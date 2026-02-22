"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Building2,
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
  Clock,
  MapPin,
  Users,
  ArrowRight,
  Plus,
  Bell,
  Zap,
  Package,
  Award,
  BarChart3,
  FileText,
  Settings,
  RefreshCw,
  Leaf,
  ChevronRight,
  Loader2
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProfil } from "@/hooks/use-profil"
import { useDashboard } from "@/hooks/use-dashboard"
import { useDefis } from "@/hooks/use-defis"
import { useNotifications } from "@/hooks/use-notifications"
import { SalesTrendChart } from "@/components/charts/sales-trend-chart"
import { FinancingChart } from "@/components/charts/financing-chart"

// ============================================
// STATIC DATA (TODO: replace with API when available)
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
  alerts: Array<{ type: "warning" | "critical" | "info"; message: string }>
}

interface BrandKPIs {
  volume: { current: number; target: number; objectiveRate: number; trend: number }
  margin: { total: number; target: number; avgGPU: number; trend: number }
  financing: { rate: number; target: number; trend: number }
  satisfaction: { nps: number; target: number; trend: number }
  stock: { avgDays: number; target: number; totalUnits: number }
  constructorBonus: { estimated: number; volumeAchieved: boolean; financingAchieved: boolean; satisfactionAchieved: boolean }
}

interface ConstructorTarget {
  category: string
  description: string
  target: number
  current: number
  unit: string
  weight: number
  status: "achieved" | "on_track" | "at_risk" | "missed"
  bonus: number
}

interface BrandChallenge {
  id: string
  title: string
  description: string
  type: string
  targetValue: number
  targetUnit: string
  startDate: string
  endDate: string
  reward: { type: string; value: string; description: string }
  participants: Array<{
    dealershipId: string
    dealershipName: string
    currentValue: number
    progressRate: number
    isCompleted: boolean
  }>
  status: "active" | "completed" | "upcoming"
}

interface NetworkAlert {
  id: string
  type: "critical" | "warning" | "info" | "success"
  title: string
  message: string
  dealershipId?: string
  dealershipName?: string
  createdAt: string
  isRead: boolean
  actionUrl?: string
  actionLabel?: string
}

interface PerformanceHistory {
  month: string
  volume: number
  volumeTarget: number
  margin: number
  financingRate: number
  satisfaction: number
}

// TODO: replace with API data
const dealerships: DealershipData[] = [
  {
    id: "dealership-paris-est", name: "Ford Paris Est", code: "FPE-001", location: "Paris Est",
    address: "125 Avenue de la République, 75011 Paris", directorId: "dir-concession-1", directorName: "Marie Dubois",
    coordinates: { lat: 48.8634, lng: 2.3815 },
    stats: { totalSales: 58, salesTarget: 52, objectiveRate: 112, totalMargin: 87000, avgGPU: 1500, financingRate: 82, satisfaction: 89, stockDays: 35 },
    departments: { vn: { sales: 32, target: 28, margin: 48000 }, vo: { sales: 18, target: 16, margin: 27000 }, vu: { sales: 8, target: 8, margin: 12000 } },
    trend: "up", alerts: []
  },
  {
    id: "dealership-paris-ouest", name: "Ford Paris Ouest", code: "FPO-002", location: "Paris Ouest",
    address: "45 Boulevard Exelmans, 75016 Paris", directorId: "dir-concession-2", directorName: "Pierre Martin",
    coordinates: { lat: 48.8424, lng: 2.2635 },
    stats: { totalSales: 49, salesTarget: 50, objectiveRate: 98, totalMargin: 71050, avgGPU: 1450, financingRate: 75, satisfaction: 86, stockDays: 42 },
    departments: { vn: { sales: 26, target: 28, margin: 37700 }, vo: { sales: 16, target: 15, margin: 23200 }, vu: { sales: 7, target: 7, margin: 10150 } },
    trend: "stable", alerts: [{ type: "warning", message: "Stock VN > 40 jours" }]
  },
  {
    id: "dealership-versailles", name: "Ford Versailles", code: "FVS-003", location: "Versailles",
    address: "8 Rue des Chantiers, 78000 Versailles", directorId: "dir-concession-3", directorName: "Sophie Bernard",
    coordinates: { lat: 48.8014, lng: 2.1301 },
    stats: { totalSales: 52, salesTarget: 50, objectiveRate: 104, totalMargin: 78000, avgGPU: 1500, financingRate: 78, satisfaction: 91, stockDays: 38 },
    departments: { vn: { sales: 28, target: 26, margin: 42000 }, vo: { sales: 17, target: 17, margin: 25500 }, vu: { sales: 7, target: 7, margin: 10500 } },
    trend: "up", alerts: []
  },
  {
    id: "dealership-creteil", name: "Ford Créteil", code: "FCR-004", location: "Créteil",
    address: "Centre Commercial Créteil Soleil, 94000 Créteil", directorId: "dir-concession-4", directorName: "Lucas Petit",
    coordinates: { lat: 48.7905, lng: 2.4595 },
    stats: { totalSales: 40, salesTarget: 45, objectiveRate: 89, totalMargin: 56000, avgGPU: 1400, financingRate: 68, satisfaction: 82, stockDays: 52 },
    departments: { vn: { sales: 20, target: 24, margin: 28000 }, vo: { sales: 14, target: 15, margin: 19600 }, vu: { sales: 6, target: 6, margin: 8400 } },
    trend: "down", alerts: [{ type: "critical", message: "Objectif VN à risque" }, { type: "warning", message: "Taux financement bas (68%)" }, { type: "warning", message: "Stock > 50 jours" }]
  },
  {
    id: "dealership-saint-denis", name: "Ford Saint-Denis", code: "FSD-005", location: "Saint-Denis",
    address: "52 Boulevard Marcel Sembat, 93200 Saint-Denis", directorId: "dir-concession-5", directorName: "Emma Leroy",
    coordinates: { lat: 48.9362, lng: 2.3574 },
    stats: { totalSales: 45, salesTarget: 48, objectiveRate: 94, totalMargin: 63000, avgGPU: 1400, financingRate: 72, satisfaction: 84, stockDays: 44 },
    departments: { vn: { sales: 24, target: 26, margin: 33600 }, vo: { sales: 15, target: 15, margin: 21000 }, vu: { sales: 6, target: 7, margin: 8400 } },
    trend: "stable", alerts: [{ type: "info", message: "Nouveau directeur depuis 3 mois" }]
  },
  {
    id: "dealership-evry", name: "Ford Évry", code: "FEV-006", location: "Évry",
    address: "15 Avenue du Lac, 91000 Évry", directorId: "dir-concession-6", directorName: "Thomas Garcia",
    coordinates: { lat: 48.6249, lng: 2.4295 },
    stats: { totalSales: 43, salesTarget: 42, objectiveRate: 102, totalMargin: 64500, avgGPU: 1500, financingRate: 80, satisfaction: 88, stockDays: 36 },
    departments: { vn: { sales: 22, target: 22, margin: 33000 }, vo: { sales: 15, target: 14, margin: 22500 }, vu: { sales: 6, target: 6, margin: 9000 } },
    trend: "up", alerts: []
  }
]

// TODO: replace with API data
const brandKPIs: BrandKPIs = {
  volume: { current: 287, target: 300, objectiveRate: 95.7, trend: 8 },
  margin: { total: 430500, target: 450000, avgGPU: 1500, trend: 5 },
  financing: { rate: 76, target: 75, trend: 2 },
  satisfaction: { nps: 86, target: 85, trend: 1 },
  stock: { avgDays: 41, target: 45, totalUnits: 485 },
  constructorBonus: { estimated: 125000, volumeAchieved: false, financingAchieved: true, satisfactionAchieved: true }
}

// TODO: replace with API data
const constructorTargets: ConstructorTarget[] = [
  { category: "Volume", description: "Objectif de ventes mensuelles", target: 300, current: 287, unit: "véhicules", weight: 40, status: "on_track", bonus: 50000 },
  { category: "Financement", description: "Taux de pénétration financement", target: 75, current: 76, unit: "%", weight: 25, status: "achieved", bonus: 31250 },
  { category: "Satisfaction", description: "Score NPS clients", target: 85, current: 86, unit: "NPS", weight: 20, status: "achieved", bonus: 25000 },
  { category: "Électrique", description: "Part de véhicules électriques", target: 15, current: 17, unit: "%", weight: 10, status: "achieved", bonus: 12500 },
  { category: "Formation", description: "Commerciaux certifiés", target: 100, current: 95, unit: "%", weight: 5, status: "on_track", bonus: 6250 }
]

// TODO: replace with API data
const performanceHistory: PerformanceHistory[] = [
  { month: "Sep 2023", volume: 265, volumeTarget: 280, margin: 397500, financingRate: 72, satisfaction: 83 },
  { month: "Oct 2023", volume: 278, volumeTarget: 290, margin: 417000, financingRate: 74, satisfaction: 84 },
  { month: "Nov 2023", volume: 290, volumeTarget: 295, margin: 435000, financingRate: 75, satisfaction: 85 },
  { month: "Déc 2023", volume: 312, volumeTarget: 310, margin: 468000, financingRate: 77, satisfaction: 86 },
  { month: "Jan 2024", volume: 275, volumeTarget: 290, margin: 412500, financingRate: 74, satisfaction: 85 },
  { month: "Fév 2024", volume: 287, volumeTarget: 300, margin: 430500, financingRate: 76, satisfaction: 86 }
]

function getDealershipRanking(): DealershipData[] {
  return [...dealerships].sort((a, b) => b.stats.objectiveRate - a.stats.objectiveRate)
}

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
  color?: "blue" | "green" | "purple" | "amber" | "red"
}) {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    green: "from-emerald-500 to-emerald-600",
    purple: "from-purple-500 to-purple-600",
    amber: "from-amber-500 to-orange-500",
    red: "from-red-500 to-red-600"
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

function DealershipCard({ dealership, rank }: { dealership: DealershipData, rank: number }) {
  const objectiveRate = dealership.stats.objectiveRate

  return (
    <Link href={`/marque/concessions/${dealership.id}`}>
      <Card className={`border-0 shadow-premium hover:shadow-xl transition-all cursor-pointer ${
        dealership.alerts.some(a => a.type === "critical") ? "ring-2 ring-red-200" : ""
      }`}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white ${
                rank === 1 ? "bg-amber-500" :
                rank === 2 ? "bg-gray-400" :
                rank === 3 ? "bg-orange-500" :
                "bg-gray-300"
              }`}>
                #{rank}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{dealership.name}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {dealership.location}
                </p>
              </div>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              dealership.trend === "up" ? "bg-emerald-100" :
              dealership.trend === "down" ? "bg-red-100" :
              "bg-gray-100"
            }`}>
              {dealership.trend === "up" ? <TrendingUp className="w-4 h-4 text-emerald-600" /> :
               dealership.trend === "down" ? <TrendingDown className="w-4 h-4 text-red-600" /> :
               <Minus className="w-4 h-4 text-gray-400" />}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Objectif</span>
                <span className={`font-semibold ${
                  objectiveRate >= 100 ? "text-emerald-600" :
                  objectiveRate >= 90 ? "text-blue-600" :
                  objectiveRate >= 80 ? "text-amber-600" :
                  "text-red-600"
                }`}>
                  {objectiveRate}%
                </span>
              </div>
              <Progress value={Math.min(objectiveRate, 100)} className={`h-2 ${
                objectiveRate >= 100 ? "[&>div]:bg-emerald-500" :
                objectiveRate >= 90 ? "[&>div]:bg-blue-500" :
                objectiveRate >= 80 ? "[&>div]:bg-amber-500" :
                "[&>div]:bg-red-500"
              }`} />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{dealership.stats.totalSales}</p>
                <p className="text-xs text-gray-500">Ventes</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{dealership.stats.avgGPU}€</p>
                <p className="text-xs text-gray-500">GPU</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{dealership.stats.financingRate}%</p>
                <p className="text-xs text-gray-500">Financ.</p>
              </div>
            </div>

            {dealership.alerts.length > 0 && (
              <div className="pt-2 border-t">
                {dealership.alerts.slice(0, 1).map((alert, i) => (
                  <Badge
                    key={i}
                    className={`${
                      alert.type === "critical" ? "bg-red-100 text-red-700" :
                      alert.type === "warning" ? "bg-amber-100 text-amber-700" :
                      "bg-blue-100 text-blue-700"
                    } text-xs`}
                  >
                    {alert.type === "critical" ? <AlertTriangle className="w-3 h-3 mr-1" /> : null}
                    {alert.message}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function ConstructorTargetCard({ target }: { target: ConstructorTarget }) {
  const progressRate = Math.round((target.current / target.target) * 100)

  return (
    <div className={`p-4 rounded-xl border ${
      target.status === "achieved" ? "bg-emerald-50 border-emerald-200" :
      target.status === "on_track" ? "bg-blue-50 border-blue-200" :
      target.status === "at_risk" ? "bg-amber-50 border-amber-200" :
      "bg-red-50 border-red-200"
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-gray-900">{target.category}</span>
        <Badge className={`${
          target.status === "achieved" ? "bg-emerald-500 text-white" :
          target.status === "on_track" ? "bg-blue-500 text-white" :
          target.status === "at_risk" ? "bg-amber-500 text-white" :
          "bg-red-500 text-white"
        }`}>
          {target.status === "achieved" ? <CheckCircle className="w-3 h-3 mr-1" /> :
           target.status === "on_track" ? <Clock className="w-3 h-3 mr-1" /> :
           <AlertTriangle className="w-3 h-3 mr-1" />}
          {target.status === "achieved" ? "Atteint" :
           target.status === "on_track" ? "En cours" :
           target.status === "at_risk" ? "À risque" : "Manqué"}
        </Badge>
      </div>
      <p className="text-sm text-gray-500 mb-2">{target.description}</p>
      <div className="flex items-center justify-between text-sm mb-1">
        <span>{target.current} / {target.target} {target.unit}</span>
        <span className="font-semibold">{progressRate}%</span>
      </div>
      <Progress value={Math.min(progressRate, 100)} className={`h-2 ${
        target.status === "achieved" ? "[&>div]:bg-emerald-500" :
        target.status === "on_track" ? "[&>div]:bg-blue-500" :
        target.status === "at_risk" ? "[&>div]:bg-amber-500" :
        "[&>div]:bg-red-500"
      }`} />
      <p className="text-xs text-gray-500 mt-2">
        Prime: <span className="font-semibold">{target.bonus.toLocaleString()}€</span> (poids: {target.weight}%)
      </p>
    </div>
  )
}

function AlertCard({ alert }: { alert: NetworkAlert }) {
  return (
    <div className={`p-4 rounded-xl border ${
      alert.type === "critical" ? "bg-red-50 border-red-200" :
      alert.type === "warning" ? "bg-amber-50 border-amber-200" :
      alert.type === "success" ? "bg-emerald-50 border-emerald-200" :
      "bg-blue-50 border-blue-200"
    } ${!alert.isRead ? "ring-2 ring-offset-2 ring-blue-300" : ""}`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
          alert.type === "critical" ? "bg-red-100" :
          alert.type === "warning" ? "bg-amber-100" :
          alert.type === "success" ? "bg-emerald-100" :
          "bg-blue-100"
        }`}>
          {alert.type === "critical" ? <AlertTriangle className="w-4 h-4 text-red-600" /> :
           alert.type === "warning" ? <AlertTriangle className="w-4 h-4 text-amber-600" /> :
           alert.type === "success" ? <CheckCircle className="w-4 h-4 text-emerald-600" /> :
           <Bell className="w-4 h-4 text-blue-600" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-gray-900">{alert.title}</h4>
            {!alert.isRead && (
              <span className="w-2 h-2 rounded-full bg-blue-500" />
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
          {alert.dealershipName && (
            <p className="text-xs text-gray-500 mt-1">
              <MapPin className="w-3 h-3 inline mr-1" />
              {alert.dealershipName}
            </p>
          )}
          {alert.actionUrl && (
            <Link href={alert.actionUrl}>
              <Button variant="link" className="p-0 h-auto text-sm mt-2">
                {alert.actionLabel}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          )}
        </div>
        <span className="text-xs text-gray-400">
          {new Date(alert.createdAt).toLocaleDateString("fr-FR")}
        </span>
      </div>
    </div>
  )
}

function PerformanceChart() {
  const maxVolume = Math.max(...performanceHistory.map(p => Math.max(p.volume, p.volumeTarget)))

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

      <div className="flex items-end gap-3 h-40">
        {performanceHistory.map((month, index) => {
          const volumeHeight = (month.volume / maxVolume) * 100
          const targetHeight = (month.volumeTarget / maxVolume) * 100
          const achieved = month.volume >= month.volumeTarget

          return (
            <div key={month.month} className="flex-1 flex flex-col items-center gap-1">
              <div className="text-xs font-semibold text-gray-700 mb-1">{month.volume}</div>
              <div className="relative w-full h-32 flex items-end justify-center gap-1">
                <div
                  className="w-5 bg-gray-200 rounded-t"
                  style={{ height: `${targetHeight}%` }}
                />
                <div
                  className={`w-5 rounded-t ${
                    achieved ? "bg-emerald-500" : "bg-indigo-500"
                  }`}
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

export default function DirecteurMarqueDashboard() {
  const [tab, setTab] = useState<"overview" | "challenges" | "constructor" | "alerts">("overview")
  const { data: profil } = useProfil()
  const { data: dashboardRaw } = useDashboard<Record<string, unknown>>("dir_marque")
  const { data: defisData } = useDefis("active")
  const { data: notifData } = useNotifications(false)

  const perfHistory = (dashboardRaw as Record<string, unknown>)?.performanceHistory as { period: string; label: string; sales: number; target: number; margin: number; financingRate: number }[] | undefined
  const rankedDealerships = getDealershipRanking()

  // Build alerts from notifications API
  const allAlerts: NetworkAlert[] = (notifData || []).map((n: any) => ({
    id: n.id || "",
    type: n.type === "critical" ? "critical" : n.type === "warning" ? "warning" : n.type === "success" ? "success" : "info",
    title: n.title || "",
    message: n.message || n.body || "",
    dealershipName: n.dealership_name,
    dealershipId: n.dealership_id,
    createdAt: n.created_at || "",
    isRead: n.is_read || false,
    actionUrl: n.action_url,
    actionLabel: n.action_label
  }))

  const unreadAlerts = allAlerts.filter(a => !a.isRead)
  const criticalAlerts = allAlerts.filter(a => a.type === "critical")

  // Build challenges from defis API
  const brandChallenges: BrandChallenge[] = ((defisData || []) as any[]).map(d => ({
    id: d.id || "",
    title: d.title || "",
    description: d.description || "",
    type: d.type || "volume",
    targetValue: d.target || 0,
    targetUnit: d.target_unit || "%",
    startDate: d.start_date || "",
    endDate: d.end_date || "",
    reward: {
      type: d.reward_type || "bonus",
      value: d.reward_value != null ? `${d.reward_value}€` : "",
      description: d.reward_description || ""
    },
    participants: (d.participants || []).map((p: any) => ({
      dealershipId: p.dealership_id || p.id || "",
      dealershipName: p.dealership_name || p.name || "",
      currentValue: p.current_value || p.current_score || 0,
      progressRate: p.progress_rate || 0,
      isCompleted: p.is_completed || false
    })),
    status: d.status || "active"
  }))

  const totalBonus = constructorTargets
    .filter(t => t.status === "achieved")
    .reduce((sum, t) => sum + t.bonus, 0)

  const firstName = profil?.full_name?.split(" ")[0] || profil?.first_name || "Directeur"

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* ============================================
          HEADER
          ============================================ */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Building2 className="w-4 h-4" />
            <span>Directeur de Marque</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Ford Île-de-France</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Bonjour, {firstName} 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Gérez vos {dealerships.length} concessions Ford en Île-de-France
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
          <Link href="/marque/challenges/new">
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 gap-2">
              <Plus className="w-4 h-4" />
              Nouveau challenge
            </Button>
          </Link>
        </div>
      </div>

      {/* ============================================
          CRITICAL ALERTS BANNER
          ============================================ */}
      {criticalAlerts.length > 0 && (
        <Card className="border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-4">
            <div className="flex items-center gap-4">
              <AlertTriangle className="w-6 h-6 text-white flex-shrink-0" />
              <div className="flex-1 text-white">
                <p className="font-bold">{criticalAlerts.length} alerte{criticalAlerts.length > 1 ? "s" : ""} critique{criticalAlerts.length > 1 ? "s" : ""}</p>
                <p className="text-white/80 text-sm">{criticalAlerts[0].message}</p>
              </div>
              {criticalAlerts[0].actionUrl && (
                <Link href={criticalAlerts[0].actionUrl}>
                  <Button variant="secondary" size="sm" className="gap-1">
                    {criticalAlerts[0].actionLabel}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* ============================================
          KPI OVERVIEW
          ============================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Volume total"
          value={`${brandKPIs.volume.current}/${brandKPIs.volume.target}`}
          subtitle={`${brandKPIs.volume.objectiveRate}% de l'objectif`}
          icon={Car}
          color={brandKPIs.volume.objectiveRate >= 100 ? "green" : "blue"}
          trend={brandKPIs.volume.trend > 0 ? "up" : brandKPIs.volume.trend < 0 ? "down" : "stable"}
          trendValue={`${brandKPIs.volume.trend > 0 ? "+" : ""}${brandKPIs.volume.trend}% vs M-1`}
        />
        <StatCard
          title="Marge totale"
          value={`${(brandKPIs.margin.total / 1000).toFixed(0)}k€`}
          subtitle={`GPU: ${brandKPIs.margin.avgGPU}€`}
          icon={Euro}
          color="green"
          trend={brandKPIs.margin.trend > 0 ? "up" : brandKPIs.margin.trend < 0 ? "down" : "stable"}
          trendValue={`${brandKPIs.margin.trend > 0 ? "+" : ""}${brandKPIs.margin.trend}%`}
        />
        <StatCard
          title="Financement"
          value={`${brandKPIs.financing.rate}%`}
          subtitle={`Cible: ${brandKPIs.financing.target}%`}
          icon={Percent}
          color={brandKPIs.financing.rate >= brandKPIs.financing.target ? "green" : "amber"}
          trend={brandKPIs.financing.trend > 0 ? "up" : brandKPIs.financing.trend < 0 ? "down" : "stable"}
          trendValue={`${brandKPIs.financing.trend > 0 ? "+" : ""}${brandKPIs.financing.trend} pts`}
        />
        <StatCard
          title="Satisfaction"
          value={brandKPIs.satisfaction.nps}
          subtitle={`NPS (cible: ${brandKPIs.satisfaction.target})`}
          icon={Star}
          color={brandKPIs.satisfaction.nps >= brandKPIs.satisfaction.target ? "green" : "amber"}
          trend={brandKPIs.satisfaction.trend > 0 ? "up" : brandKPIs.satisfaction.trend < 0 ? "down" : "stable"}
          trendValue={`${brandKPIs.satisfaction.trend > 0 ? "+" : ""}${brandKPIs.satisfaction.trend} pts`}
        />
        <StatCard
          title="Prime constructeur"
          value={`${(brandKPIs.constructorBonus.estimated / 1000).toFixed(0)}k€`}
          subtitle="Estimée ce mois"
          icon={Trophy}
          color="purple"
        />
      </div>

      {/* ============================================
          MAIN CONTENT
          ============================================ */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="bg-gray-100 p-1">
          <TabsTrigger value="overview" className="gap-2">
            <Building2 className="w-4 h-4" />
            Concessions
          </TabsTrigger>
          <TabsTrigger value="challenges" className="gap-2">
            <Zap className="w-4 h-4" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="constructor" className="gap-2">
            <Target className="w-4 h-4" />
            Constructeur
          </TabsTrigger>
          <TabsTrigger value="alerts" className="gap-2 relative">
            <Bell className="w-4 h-4" />
            Alertes
            {unreadAlerts.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {unreadAlerts.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Dealership Grid */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Classement des concessions
            </h2>
            <Link href="/marque/concessions">
              <Button variant="outline" className="gap-2">
                Voir tout
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rankedDealerships.map((dealership, index) => (
              <DealershipCard
                key={dealership.id}
                dealership={dealership}
                rank={index + 1}
              />
            ))}
          </div>

          {/* Performance Charts */}
          {perfHistory && perfHistory.length > 0 && (
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-premium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                    Évolution du volume
                  </CardTitle>
                  <CardDescription>6 derniers mois - Toutes concessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <SalesTrendChart data={perfHistory} />
                </CardContent>
              </Card>
              <Card className="border-0 shadow-premium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Percent className="w-5 h-5 text-purple-600" />
                    Taux de financement
                  </CardTitle>
                  <CardDescription>6 derniers mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <FinancingChart data={perfHistory} />
                </CardContent>
              </Card>
            </div>
          )}
          {(!perfHistory || perfHistory.length === 0) && (
            <Card className="border-0 shadow-premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  Évolution du volume
                </CardTitle>
                <CardDescription>6 derniers mois - Toutes concessions confondues</CardDescription>
              </CardHeader>
              <CardContent>
                <PerformanceChart />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* CHALLENGES TAB */}
        <TabsContent value="challenges" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Challenges inter-concessions
            </h2>
            <Link href="/marque/challenges/new">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nouveau challenge
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {brandChallenges.map(challenge => (
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
                      </div>
                      <p className="text-gray-500">{challenge.description}</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-purple-100 text-purple-700">
                        <Trophy className="w-3 h-3 mr-1" />
                        {challenge.reward.value}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {challenge.participants.slice(0, 4).map((participant, index) => (
                      <div key={participant.dealershipId} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                          index === 0 ? "bg-amber-100 text-amber-700" :
                          index === 1 ? "bg-gray-100 text-gray-700" :
                          index === 2 ? "bg-orange-100 text-orange-700" :
                          "bg-gray-50 text-gray-500"
                        }`}>
                          #{index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-900">{participant.dealershipName}</span>
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
                    ))}
                  </div>

                  <p className="text-xs text-gray-500 mt-4">
                    <Clock className="w-3 h-3 inline mr-1" />
                    Du {new Date(challenge.startDate).toLocaleDateString("fr-FR")} au {new Date(challenge.endDate).toLocaleDateString("fr-FR")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* CONSTRUCTOR TAB */}
        <TabsContent value="constructor" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Objectifs Constructeur
              </h2>
              <p className="text-gray-500">Suivi des primes Ford - Février 2024</p>
            </div>
            <Card className="border-0 shadow-premium bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-4">
                <p className="text-purple-100 text-sm">Prime estimée</p>
                <p className="text-2xl font-bold">{totalBonus.toLocaleString()}€</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {constructorTargets.map(target => (
              <ConstructorTargetCard key={target.category} target={target} />
            ))}
          </div>

          <Card className="border-0 shadow-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                Récapitulatif des primes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Catégorie</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Poids</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Statut</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Prime</th>
                    </tr>
                  </thead>
                  <tbody>
                    {constructorTargets.map(target => (
                      <tr key={target.category} className="border-b last:border-0">
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-900">{target.category}</span>
                        </td>
                        <td className="py-3 px-4 text-center text-gray-600">{target.weight}%</td>
                        <td className="py-3 px-4 text-center">
                          <Badge className={`${
                            target.status === "achieved" ? "bg-emerald-100 text-emerald-700" :
                            target.status === "on_track" ? "bg-blue-100 text-blue-700" :
                            "bg-amber-100 text-amber-700"
                          }`}>
                            {target.status === "achieved" ? "Atteint" :
                             target.status === "on_track" ? "En cours" : "À risque"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`font-semibold ${
                            target.status === "achieved" ? "text-emerald-600" : "text-gray-400"
                          }`}>
                            {target.status === "achieved" ? `${target.bonus.toLocaleString()}€` : "-"}
                          </span>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td colSpan={3} className="py-3 px-4 font-bold text-gray-900">Total acquis</td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-600">{totalBonus.toLocaleString()}€</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ALERTS TAB */}
        <TabsContent value="alerts" className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Centre de notifications
            </h2>
            <Button variant="outline" size="sm">
              Tout marquer comme lu
            </Button>
          </div>

          {allAlerts.map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </TabsContent>
      </Tabs>

      {/* ============================================
          QUICK ACTIONS
          ============================================ */}
      <div className="grid md:grid-cols-4 gap-4">
        <Link href="/marque/concessions">
          <Card className="border-0 shadow-premium hover:shadow-xl transition-all cursor-pointer group">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Concessions</p>
                <p className="text-sm text-gray-500">{dealerships.length} sites</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/marque/benchmark">
          <Card className="border-0 shadow-premium hover:shadow-xl transition-all cursor-pointer group">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Benchmark</p>
                <p className="text-sm text-gray-500">Comparatif</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/marque/stocks">
          <Card className="border-0 shadow-premium hover:shadow-xl transition-all cursor-pointer group">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Stocks</p>
                <p className="text-sm text-gray-500">{brandKPIs.stock.totalUnits} véhicules</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/marque/reports">
          <Card className="border-0 shadow-premium hover:shadow-xl transition-all cursor-pointer group">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Rapports</p>
                <p className="text-sm text-gray-500">Exports</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
