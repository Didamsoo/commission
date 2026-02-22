"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BarChart3,
  ChevronRight,
  ArrowLeft,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Car,
  Euro,
  Percent,
  Target,
  Trophy,
  FileText,
  Filter,
  Printer,
  Share2,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SalesTrendChart } from "@/components/charts/sales-trend-chart"
import { MarginChart } from "@/components/charts/margin-chart"
import { FinancingChart } from "@/components/charts/financing-chart"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { useProfil } from "@/hooks/use-profil"
import { useDashboard } from "@/hooks/use-dashboard"
import { useEquipe, type EquipeMember } from "@/hooks/use-equipe"
import { useRapports } from "@/hooks/use-rapports"
import { exportToExcel, exportToCSV, type ExportTeamMember } from "@/lib/excel/rapports"
import { DateRangePicker } from "@/components/ui/date-range-picker"

// ============================================
// TYPES
// ============================================

type Period = "week" | "month" | "quarter" | "year"

// ============================================
// COMPONENTS
// ============================================

function KPICard({
  title,
  value,
  previousValue,
  unit = "",
  icon: Icon,
  color = "blue"
}: {
  title: string
  value: number
  previousValue: number
  unit?: string
  icon: React.ElementType
  color?: "blue" | "green" | "purple" | "amber"
}) {
  const change = previousValue > 0 ? ((value - previousValue) / previousValue) * 100 : 0
  const isPositive = change >= 0

  const colors = {
    blue: "from-blue-500 to-blue-600",
    green: "from-emerald-500 to-emerald-600",
    purple: "from-purple-500 to-purple-600",
    amber: "from-amber-500 to-orange-500"
  }

  return (
    <Card className="border-0 shadow-premium">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">
              {value.toLocaleString()}{unit}
            </p>
            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
              isPositive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
            }`}>
              {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              <span>{Math.abs(change).toFixed(1)}% vs période précédente</span>
            </div>
          </div>
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


function TeamPerformanceTable({ teamMembers }: { teamMembers: { id: string; name: string; kpis: { sales: number; salesTarget: number; margin: number; gpu: number; financingRate: number }; trend: "up" | "down" | "stable" }[] }) {
  const sortedMembers = [...teamMembers].sort((a, b) => b.kpis.sales - a.kpis.sales)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>Commercial</TableHead>
          <TableHead className="text-right">Ventes</TableHead>
          <TableHead className="text-right">Objectif</TableHead>
          <TableHead className="text-right">Taux</TableHead>
          <TableHead className="text-right">Marge</TableHead>
          <TableHead className="text-right">GPU</TableHead>
          <TableHead className="text-right">Financement</TableHead>
          <TableHead className="text-center">Tendance</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedMembers.map((member, index) => {
          const rate = Math.round((member.kpis.sales / member.kpis.salesTarget) * 100)
          return (
            <TableRow key={member.id}>
              <TableCell className="font-medium">
                <Badge className={`${
                  index === 0 ? "bg-amber-100 text-amber-700" :
                  index === 1 ? "bg-gray-200 text-gray-700" :
                  index === 2 ? "bg-orange-100 text-orange-700" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {index + 1}
                </Badge>
              </TableCell>
              <TableCell>
                <Link href={`/chef-ventes/equipe/${member.id}`} className="font-medium text-gray-900 hover:text-indigo-600">
                  {member.name}
                </Link>
              </TableCell>
              <TableCell className="text-right font-medium">{member.kpis.sales}</TableCell>
              <TableCell className="text-right text-gray-500">{member.kpis.salesTarget}</TableCell>
              <TableCell className="text-right">
                <Badge className={`${
                  rate >= 100 ? "bg-emerald-100 text-emerald-700" :
                  rate >= 80 ? "bg-blue-100 text-blue-700" :
                  rate >= 60 ? "bg-amber-100 text-amber-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {rate}%
                </Badge>
              </TableCell>
              <TableCell className="text-right">{member.kpis.margin.toLocaleString()}€</TableCell>
              <TableCell className="text-right">{member.kpis.gpu}€</TableCell>
              <TableCell className="text-right">
                <span className={member.kpis.financingRate >= 75 ? "text-emerald-600" : "text-amber-600"}>
                  {member.kpis.financingRate}%
                </span>
              </TableCell>
              <TableCell className="text-center">
                {member.trend === "up" && <TrendingUp className="w-4 h-4 text-emerald-500 mx-auto" />}
                {member.trend === "down" && <TrendingDown className="w-4 h-4 text-red-500 mx-auto" />}
                {member.trend === "stable" && <Minus className="w-4 h-4 text-gray-400 mx-auto" />}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

function TeamComparisonCard({ chefVentesKPIs, otherTeams }: { chefVentesKPIs: { objectiveRate: number }; otherTeams: { type: string; name: string; rate: number; isCurrentTeam: boolean }[] }) {
  const allTeams = [
    { type: "VN", name: "Équipe VN", rate: chefVentesKPIs.objectiveRate, isCurrentTeam: true },
    ...otherTeams.map(t => ({ type: t.type, name: t.name, rate: t.rate, isCurrentTeam: t.isCurrentTeam }))
  ].sort((a, b) => b.rate - a.rate)

  return (
    <Card className="border-0 shadow-premium">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Classement des équipes
        </CardTitle>
        <CardDescription>Performance comparative ce mois</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {allTeams.map((team, index) => (
          <div key={team.type} className={`p-4 rounded-xl ${team.isCurrentTeam ? "bg-indigo-50 ring-2 ring-indigo-500" : "bg-gray-50"}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Badge className={`${
                  index === 0 ? "bg-amber-500 text-white" :
                  index === 1 ? "bg-gray-400 text-white" :
                  "bg-orange-400 text-white"
                }`}>
                  #{index + 1}
                </Badge>
                <span className={`font-semibold ${team.isCurrentTeam ? "text-indigo-700" : "text-gray-900"}`}>
                  {team.name}
                </span>
                {team.isCurrentTeam && (
                  <Badge className="bg-indigo-100 text-indigo-700 text-xs">Votre équipe</Badge>
                )}
              </div>
              <span className="font-bold text-lg">{team.rate}%</span>
            </div>
            <Progress
              value={team.rate}
              className={`h-2 ${team.isCurrentTeam ? "[&>div]:bg-indigo-500" : "[&>div]:bg-gray-400"}`}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function RapportsPage() {
  const [period, setPeriod] = useState<Period>("month")
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

  const dateRangeParams = dateRange?.from && dateRange?.to ? {
    startDate: format(dateRange.from, 'yyyy-MM-dd'),
    endDate: format(dateRange.to, 'yyyy-MM-dd'),
  } : undefined

  const { data: profil } = useProfil()
  const { data: dashboardRaw, loading: dashLoading } = useDashboard<Record<string, unknown>>("chef_ventes", undefined, dateRangeParams)
  const { data: equipeData, loading: equipeLoading } = useEquipe()

  const teamMembers = (equipeData || []).map((m, i) => ({
    id: m.user_id || m.id,
    name: m.full_name,
    kpis: { sales: m.total_sales || 0, salesTarget: m.sales_target || 10, margin: m.total_margin || 0, gpu: m.total_sales ? Math.round((m.total_margin || 0) / m.total_sales) : 0, financingRate: m.financing_rate || 0 },
    trend: (m.trend || "stable") as "up" | "down" | "stable",
  }))

  const kpis = ((dashboardRaw as any)?.kpis || {}) as Record<string, number>
  const chefVentesKPIs = {
    teamSales: kpis.total_sales ?? teamMembers.reduce((s, m) => s + m.kpis.sales, 0),
    teamSalesTarget: kpis.total_sales_target ?? teamMembers.reduce((s, m) => s + m.kpis.salesTarget, 0),
    teamMargin: kpis.total_margin ?? teamMembers.reduce((s, m) => s + m.kpis.margin, 0),
    teamGPU: 0,
    teamFinancingRate: kpis.financing_rate ?? 0,
    objectiveRate: 0,
    membersAtObjective: teamMembers.filter(m => m.kpis.sales >= m.kpis.salesTarget).length,
    teamSize: teamMembers.length,
    constructorBonusEstimate: kpis.constructor_bonus_estimate ?? 0,
  }
  chefVentesKPIs.teamGPU = chefVentesKPIs.teamSales > 0 ? Math.round(chefVentesKPIs.teamMargin / chefVentesKPIs.teamSales) : 0
  chefVentesKPIs.objectiveRate = chefVentesKPIs.teamSalesTarget > 0 ? Math.round((chefVentesKPIs.teamSales / chefVentesKPIs.teamSalesTarget) * 100) : 0

  // TODO: replace with API data
  const performanceHistory = [
    { period: "2024-02", label: "Fév", sales: 45, target: 60, margin: 67500, financingRate: 78 },
    { period: "2024-01", label: "Jan", sales: 52, target: 55, margin: 78000, financingRate: 76 },
    { period: "2023-12", label: "Déc", sales: 68, target: 65, margin: 102000, financingRate: 82 },
    { period: "2023-11", label: "Nov", sales: 48, target: 55, margin: 72000, financingRate: 74 },
    { period: "2023-10", label: "Oct", sales: 55, target: 55, margin: 82500, financingRate: 77 },
    { period: "2023-09", label: "Sep", sales: 50, target: 55, margin: 75000, financingRate: 75 },
  ]
  // TODO: replace with API data
  const otherTeams = [
    { type: "VO", name: "Équipe VO", rate: 80, isCurrentTeam: false },
    { type: "VU", name: "Équipe VU", rate: 67, isCurrentTeam: false },
  ]

  // Calculate previous period values (mock)
  const previousPeriodData = {
    sales: 52,
    margin: 78000,
    financingRate: 76,
    gpu: 1500
  }

  const buildExportMembers = (): ExportTeamMember[] => {
    return [...teamMembers]
      .sort((a, b) => b.kpis.sales - a.kpis.sales)
      .map((m, i) => ({
        rang: i + 1,
        nom: m.name,
        ventes: m.kpis.sales,
        objectif: m.kpis.salesTarget,
        taux: `${m.kpis.salesTarget > 0 ? Math.round((m.kpis.sales / m.kpis.salesTarget) * 100) : 0}%`,
        marge: `${m.kpis.margin.toLocaleString("fr-FR")} \u20ac`,
        gpu: `${m.kpis.gpu} \u20ac`,
        financement: `${m.kpis.financingRate}%`,
      }))
  }

  const handleExportExcel = () => {
    exportToExcel({
      title: "Rapport d'equipe",
      period,
      teamMembers: buildExportMembers(),
      kpis: {
        totalSales: chefVentesKPIs.teamSales,
        totalMargin: chefVentesKPIs.teamMargin,
        avgGPU: chefVentesKPIs.teamGPU,
        financingRate: chefVentesKPIs.teamFinancingRate,
        objectiveRate: chefVentesKPIs.objectiveRate,
      },
    })
  }

  const handleExportCSV = () => {
    exportToCSV(buildExportMembers(), period)
  }

  if ((dashLoading || equipeLoading) && !equipeData && !dashboardRaw) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* ============================================
          HEADER
          ============================================ */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/chef-ventes" className="hover:text-indigo-600 transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Rapports</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            Rapports d&apos;équipe
          </h1>
          <p className="text-gray-500 mt-1">
            Analyse des performances de l&apos;équipe {profil?.role || ""}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select value={period} onValueChange={(v) => { setPeriod(v as Period); setDateRange(undefined) }}>
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>

          <DateRangePicker value={dateRange} onChange={setDateRange} />

          <Link href="/chef-ventes">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
          </Link>

          <Button onClick={handleExportExcel} className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 gap-2">
            <Download className="w-4 h-4" />
            Exporter Excel
          </Button>
        </div>
      </div>

      {/* ============================================
          KPI CARDS
          ============================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Ventes totales"
          value={chefVentesKPIs.teamSales}
          previousValue={previousPeriodData.sales}
          icon={Car}
          color="blue"
        />
        <KPICard
          title="Marge totale"
          value={chefVentesKPIs.teamMargin}
          previousValue={previousPeriodData.margin}
          unit="€"
          icon={Euro}
          color="green"
        />
        <KPICard
          title="Taux financement"
          value={chefVentesKPIs.teamFinancingRate}
          previousValue={previousPeriodData.financingRate}
          unit="%"
          icon={Percent}
          color="purple"
        />
        <KPICard
          title="GPU moyen"
          value={chefVentesKPIs.teamGPU}
          previousValue={previousPeriodData.gpu}
          unit="€"
          icon={Target}
          color="amber"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ============================================
            PERFORMANCE CHART
            ============================================ */}
        <Card className="border-0 shadow-premium lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Évolution des ventes
            </CardTitle>
            <CardDescription>Ventes vs objectifs sur les 6 derniers mois</CardDescription>
          </CardHeader>
          <CardContent>
            <SalesTrendChart data={performanceHistory} />
          </CardContent>
        </Card>

        {/* ============================================
            TEAM COMPARISON
            ============================================ */}
        <TeamComparisonCard chefVentesKPIs={chefVentesKPIs} otherTeams={otherTeams} />
      </div>

      {/* ============================================
          MARGIN & FINANCING CHARTS
          ============================================ */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-premium">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Euro className="w-5 h-5 text-emerald-600" />
              Évolution de la marge
            </CardTitle>
            <CardDescription>Marge totale sur les 6 derniers mois</CardDescription>
          </CardHeader>
          <CardContent>
            <MarginChart data={performanceHistory} />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-premium">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Percent className="w-5 h-5 text-purple-600" />
              Taux de financement
            </CardTitle>
            <CardDescription>Évolution du taux de financement</CardDescription>
          </CardHeader>
          <CardContent>
            <FinancingChart data={performanceHistory} />
          </CardContent>
        </Card>
      </div>

      {/* ============================================
          TEAM PERFORMANCE TABLE
          ============================================ */}
      <Card className="border-0 shadow-premium">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Performance individuelle
            </CardTitle>
            <CardDescription>Détail par commercial pour la période sélectionnée</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Printer className="w-4 h-4" />
              Imprimer
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="w-4 h-4" />
              Partager
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <TeamPerformanceTable teamMembers={teamMembers} />
        </CardContent>
      </Card>

      {/* ============================================
          SUMMARY STATS
          ============================================ */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-premium">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Meilleur commercial</p>
                <p className="font-bold text-gray-900">
                  {[...teamMembers].sort((a, b) => b.kpis.sales - a.kpis.sales)[0]?.name || "-"}
                </p>
                <p className="text-sm text-emerald-600">
                  {[...teamMembers].sort((a, b) => b.kpis.sales - a.kpis.sales)[0]?.kpis.sales ?? 0} ventes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-premium">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Taux d&apos;atteinte objectif</p>
                <p className="font-bold text-gray-900">{chefVentesKPIs.objectiveRate}%</p>
                <p className="text-sm text-blue-600">
                  {chefVentesKPIs.membersAtObjective}/{chefVentesKPIs.teamSize} à objectif
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-premium">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Prime constructeur estimée</p>
                <p className="font-bold text-gray-900">
                  {chefVentesKPIs.constructorBonusEstimate.toLocaleString()}€
                </p>
                <p className="text-sm text-amber-600">
                  Si objectif atteint
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ============================================
          EXPORT OPTIONS
          ============================================ */}
      <Card className="border-0 shadow-premium">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-semibold text-gray-900">Exporter les données</p>
                <p className="text-sm text-gray-500">Téléchargez le rapport complet</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2" onClick={handleExportExcel}>
                <Download className="w-4 h-4" />
                Excel
              </Button>
              <Button variant="outline" className="gap-2" onClick={handleExportCSV}>
                <Download className="w-4 h-4" />
                CSV
              </Button>
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 gap-2" onClick={handleExportExcel}>
                <Download className="w-4 h-4" />
                PDF complet
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
