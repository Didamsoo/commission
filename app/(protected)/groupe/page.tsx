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
  Calendar
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  currentDirPlaque,
  brands,
  groupKPIs,
  groupPL,
  groupChallenges,
  trendsData,
  groupPerformanceHistory,
  groupAlerts,
  getBrandRanking,
  getUnreadGroupAlerts,
  getTotalEmployees,
  getTotalDealerships
} from "@/lib/mock-dir-plaque-data"

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

function BrandCard({ brand, rank }: { brand: typeof brands[0], rank: number }) {
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

function TrendCard({ trend }: { trend: typeof trendsData[0] }) {
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

  const rankedBrands = getBrandRanking()
  const unreadAlerts = getUnreadGroupAlerts()
  const totalEmployees = getTotalEmployees()
  const totalDealerships = getTotalDealerships()

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
            Bonjour, {currentDirPlaque.fullName.split(" ")[0]} 👋
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
                Évolution du volume par marque
              </CardTitle>
              <CardDescription>6 derniers mois - Ventes consolidées</CardDescription>
            </CardHeader>
            <CardContent>
              <GroupPerformanceChart />
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
            {groupChallenges.map(challenge => (
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
              {groupAlerts.map(alert => (
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
