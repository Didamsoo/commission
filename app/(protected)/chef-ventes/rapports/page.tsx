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
  ArrowDownRight
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
import {
  teamMembers,
  chefVentesKPIs,
  performanceHistory,
  otherTeams,
  currentChefVentes
} from "@/lib/mock-chef-ventes-data"

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

function PerformanceChart({ data }: { data: typeof performanceHistory }) {
  const maxSales = Math.max(...data.map(d => Math.max(d.sales, d.target)))

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-500" />
          <span className="text-sm text-gray-600">Ventes réalisées</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-300" />
          <span className="text-sm text-gray-600">Objectif</span>
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-end gap-2 h-48">
        {data.slice().reverse().map((month, index) => {
          const salesHeight = (month.sales / maxSales) * 100
          const targetHeight = (month.target / maxSales) * 100
          const achieved = month.sales >= month.target

          return (
            <div key={month.period} className="flex-1 flex flex-col items-center gap-2">
              <div className="relative w-full h-40 flex items-end justify-center gap-1">
                {/* Target bar */}
                <div
                  className="w-5 bg-gray-200 rounded-t-sm transition-all duration-500"
                  style={{ height: `${targetHeight}%` }}
                />
                {/* Sales bar */}
                <div
                  className={`w-5 rounded-t-sm transition-all duration-500 ${
                    achieved ? "bg-gradient-to-t from-emerald-500 to-emerald-400" : "bg-gradient-to-t from-indigo-500 to-indigo-400"
                  }`}
                  style={{ height: `${salesHeight}%` }}
                />
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-gray-900">{month.sales}</p>
                <p className="text-xs text-gray-500">{month.label}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TeamPerformanceTable() {
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

function TeamComparisonCard() {
  const allTeams = [
    { type: "VN", name: "Équipe VN", rate: chefVentesKPIs.objectiveRate, isCurrentTeam: true },
    ...otherTeams.map(t => ({ type: t.type, name: `Équipe ${t.type}`, rate: t.objectiveRate, isCurrentTeam: false }))
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

  // Calculate previous period values (mock)
  const previousPeriodData = {
    sales: 52,
    margin: 78000,
    financingRate: 76,
    gpu: 1500
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
            Analyse des performances de l&apos;équipe {currentChefVentes.teamType}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
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

          <Link href="/chef-ventes">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
          </Link>

          <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 gap-2">
            <Download className="w-4 h-4" />
            Exporter PDF
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
            <PerformanceChart data={performanceHistory} />
          </CardContent>
        </Card>

        {/* ============================================
            TEAM COMPARISON
            ============================================ */}
        <TeamComparisonCard />
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
          <TeamPerformanceTable />
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
                  {teamMembers.sort((a, b) => b.kpis.sales - a.kpis.sales)[0].name}
                </p>
                <p className="text-sm text-emerald-600">
                  {teamMembers.sort((a, b) => b.kpis.sales - a.kpis.sales)[0].kpis.sales} ventes
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
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Excel
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                CSV
              </Button>
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 gap-2">
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
