"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BarChart3,
  ArrowLeft,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Car,
  Euro,
  Users,
  Target,
  Filter,
  ChevronDown,
  FileText,
  PieChart,
  LineChart,
  Activity,
  Printer,
  Share2,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  BadgeCheck,
  Clock
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// ============================================
// REPORTS PAGE PREMIUM - AutoPerf Pro
// ============================================

const monthlyData = [
  { month: "Jan", sales: 65, margin: 72000, commission: 21000 },
  { month: "Fév", sales: 78, margin: 85600, commission: 24500 },
  { month: "Mar", sales: 82, margin: 91000, commission: 26800 },
  { month: "Avr", sales: 74, margin: 82000, commission: 23800 },
  { month: "Mai", sales: 88, margin: 98000, commission: 28500 },
  { month: "Juin", sales: 92, margin: 102000, commission: 29800 }
]

const topPerformers = [
  { name: "Marie Martin", sales: 12, margin: 18500, commission: 5200, trend: "up" },
  { name: "Pierre Durand", sales: 11, margin: 16200, commission: 4800, trend: "up" },
  { name: "Jean Dupont", sales: 8, margin: 12400, commission: 3450, trend: "down" },
  { name: "Sophie Bernard", sales: 7, margin: 11800, commission: 3200, trend: "up" },
  { name: "Lucas Petit", sales: 7, margin: 10500, commission: 2900, trend: "same" }
]

const vehicleTypeData = [
  { type: "VN", label: "Véhicules Neufs", sales: 42, margin: 52000, color: "bg-emerald-500" },
  { type: "VO", label: "Occasions", sales: 28, margin: 28000, color: "bg-blue-500" },
  { type: "VU", label: "Utilitaires", sales: 8, margin: 5600, color: "bg-purple-500" }
]

const financingData = [
  { label: "Avec financement", value: 56, amount: 48000 },
  { label: "Sans financement", value: 22, amount: 37600 }
]

export default function ReportsPage() {
  const [period, setPeriod] = useState("month")
  const currentMonth = monthlyData[monthlyData.length - 1]
  const previousMonth = monthlyData[monthlyData.length - 2]
  
  const salesGrowth = ((currentMonth.sales - previousMonth.sales) / previousMonth.sales * 100).toFixed(1)
  const marginGrowth = ((currentMonth.margin - previousMonth.margin) / previousMonth.margin * 100).toFixed(1)
  const commissionGrowth = ((currentMonth.commission - previousMonth.commission) / previousMonth.commission * 100).toFixed(1)

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* ============================================
          HEADER
          ============================================ */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 animate-fade-in-up opacity-0-initial" style={{ animationFillMode: "forwards" }}>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link href="/direction">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                Rapports & Analyses
              </h1>
              <p className="text-gray-600">Analysez les performances de votre concession</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
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
          <Button variant="outline" className="gap-2">
            <Printer className="w-4 h-4" />
            Imprimer
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* ============================================
          KEY METRICS
          ============================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up opacity-0-initial" style={{ animationFillMode: "forwards", animationDelay: "100ms" }}>
        <Card className="border-0 shadow-premium overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Ventes totales</p>
                <p className="text-3xl font-bold text-gray-900">{currentMonth.sales}</p>
                <div className={`flex items-center gap-1 mt-1 text-sm ${Number(salesGrowth) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {Number(salesGrowth) >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{Number(salesGrowth) > 0 ? '+' : ''}{salesGrowth}% vs mois dernier</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center shadow-lg">
                <Car className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-premium overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Marge totale</p>
                <p className="text-3xl font-bold text-gray-900">{(currentMonth.margin / 1000).toFixed(1)}k€</p>
                <div className={`flex items-center gap-1 mt-1 text-sm ${Number(marginGrowth) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {Number(marginGrowth) >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{Number(marginGrowth) > 0 ? '+' : ''}{marginGrowth}% vs mois dernier</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-lg">
                <Euro className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-premium overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Commissions</p>
                <p className="text-3xl font-bold text-gray-900">{(currentMonth.commission / 1000).toFixed(1)}k€</p>
                <div className={`flex items-center gap-1 mt-1 text-sm ${Number(commissionGrowth) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {Number(commissionGrowth) >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{Number(commissionGrowth) > 0 ? '+' : ''}{commissionGrowth}% vs mois dernier</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-premium overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Taux de financement</p>
                <p className="text-3xl font-bold text-gray-900">72%</p>
                <div className="flex items-center gap-1 mt-1 text-sm text-emerald-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>+5% vs mois dernier</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg">
                <Target className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ============================================
          MAIN CONTENT TABS
          ============================================ */}
      <Tabs defaultValue="overview" className="animate-fade-in-up opacity-0-initial" style={{ animationFillMode: "forwards", animationDelay: "200ms" }}>
        <TabsList className="bg-gray-100 p-1">
          <TabsTrigger value="overview" className="gap-2">
            <PieChart className="w-4 h-4" />
            Vue d&apos;ensemble
          </TabsTrigger>
          <TabsTrigger value="performance" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Performance équipe
          </TabsTrigger>
          <TabsTrigger value="vehicles" className="gap-2">
            <Car className="w-4 h-4" />
            Par type de véhicule
          </TabsTrigger>
          <TabsTrigger value="financing" className="gap-2">
            <Activity className="w-4 h-4" />
            Financement
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Monthly Evolution */}
          <Card className="border-0 shadow-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="w-5 h-5 text-blue-600" />
                Évolution mensuelle
              </CardTitle>
              <CardDescription>Comparaison des 6 derniers mois</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end gap-4">
                {monthlyData.map((data, index) => (
                  <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex gap-1 items-end h-48">
                      <div 
                        className="flex-1 bg-blue-500 rounded-t-lg transition-all duration-500 hover:bg-blue-600 relative group"
                        style={{ height: `${(data.sales / 100) * 100}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {data.sales} ventes
                        </div>
                      </div>
                      <div 
                        className="flex-1 bg-emerald-500 rounded-t-lg transition-all duration-500 hover:bg-emerald-600 relative group"
                        style={{ height: `${(data.margin / 120000) * 100}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {(data.margin / 1000).toFixed(0)}k€ marge
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 font-medium">{data.month}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded" />
                  <span className="text-sm text-gray-600">Ventes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-emerald-500 rounded" />
                  <span className="text-sm text-gray-600">Marge</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid sm:grid-cols-3 gap-6">
            <Card className="border-0 shadow-premium bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                    <Car className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm text-gray-600">Moyenne / vendeur</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">6.5 ventes</p>
                <p className="text-sm text-emerald-600 mt-1">+0.8 vs mois dernier</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-premium bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                    <Euro className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm text-gray-600">Marge moyenne / vente</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">1 097€</p>
                <p className="text-sm text-emerald-600 mt-1">+124€ vs mois dernier</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-premium bg-gradient-to-br from-purple-50 to-violet-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm text-gray-600">Objectif atteint</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">78%</p>
                <p className="text-sm text-emerald-600 mt-1">+12% vs mois dernier</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="mt-6">
          <Card className="border-0 shadow-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Classement des commerciaux
              </CardTitle>
              <CardDescription>Performance du mois en cours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.map((performer, index) => (
                  <div key={performer.name} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      index === 0 ? "bg-amber-100 text-amber-700" :
                      index === 1 ? "bg-gray-100 text-gray-700" :
                      index === 2 ? "bg-orange-100 text-orange-700" :
                      "bg-gray-50 text-gray-500"
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{performer.name}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span>{performer.sales} ventes</span>
                        <span>{performer.margin.toLocaleString()}€ marge</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600">{performer.commission.toLocaleString()}€</p>
                      <p className="text-xs text-gray-500">Commission</p>
                    </div>
                    <Badge className={performer.trend === "up" ? "bg-emerald-100 text-emerald-700" : performer.trend === "down" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}>
                      {performer.trend === "up" ? <ArrowUpRight className="w-3 h-3 mr-1" /> : performer.trend === "down" ? <ArrowDownRight className="w-3 h-3 mr-1" /> : null}
                      {performer.trend === "up" ? "En hausse" : performer.trend === "down" ? "En baisse" : "Stable"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vehicles Tab */}
        <TabsContent value="vehicles" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-blue-600" />
                  Ventes par type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vehicleTypeData.map((type) => (
                    <div key={type.type} className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded ${type.color}`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">{type.label}</span>
                          <span className="font-semibold text-gray-900">{type.sales} ventes</span>
                        </div>
                        <Progress value={(type.sales / 78) * 100} className="h-2" />
                      </div>
                      <span className="text-sm text-gray-500 w-20 text-right">{type.margin.toLocaleString()}€</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Euro className="w-5 h-5 text-emerald-600" />
                  Marge par type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vehicleTypeData.map((type) => (
                    <div key={type.type} className="p-4 rounded-xl bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{type.label}</span>
                        <Badge className={type.color.replace('bg-', 'bg-opacity-20 text-').replace('500', '700')}>
                          {((type.margin / 85600) * 100).toFixed(0)}%
                        </Badge>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{type.margin.toLocaleString()}€</p>
                      <p className="text-sm text-gray-500">Marge totale</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Financing Tab */}
        <TabsContent value="financing" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Taux de financement
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="16"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="16"
                      strokeDasharray={`${72 * 5.53} 553`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-gray-900">72%</span>
                    <span className="text-sm text-gray-500">financé</span>
                  </div>
                </div>
                <div className="flex gap-6 mt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">56</p>
                    <p className="text-sm text-gray-500">Avec financement</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-400">22</p>
                    <p className="text-sm text-gray-500">Sans financement</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  Impact sur la marge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-emerald-800">Avec financement</span>
                      <Badge className="bg-emerald-100 text-emerald-700">+150€/vente</Badge>
                    </div>
                    <p className="text-3xl font-bold text-emerald-700">48 000€</p>
                    <p className="text-sm text-emerald-600">Bonus financement total</p>
                  </div>
                  <div className="p-5 rounded-xl bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">Sans financement</span>
                      <Badge variant="secondary">Base</Badge>
                    </div>
                    <p className="text-3xl font-bold text-gray-700">37 600€</p>
                    <p className="text-sm text-gray-500">Marge standard</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
