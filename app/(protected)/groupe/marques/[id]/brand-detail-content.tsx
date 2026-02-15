"use client"

import { useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  Building,
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
  MapPin,
  Calendar,
  Zap,
  CheckCircle,
  AlertTriangle,
  Plus,
  FileText,
  PieChart,
  ExternalLink
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  brands,
  getBrandById,
  groupChallenges,
  groupPerformanceHistory
} from "@/lib/mock-dir-plaque-data"

// Mock dealerships data for this brand
const mockBrandDealerships = [
  { id: "d1", name: "Paris Est", city: "Paris 12e", objectiveRate: 112, sales: 52, margin: 78000, trend: "up" as const },
  { id: "d2", name: "Paris Ouest", city: "Paris 16e", objectiveRate: 98, sales: 45, margin: 67500, trend: "stable" as const },
  { id: "d3", name: "Versailles", city: "Versailles", objectiveRate: 105, sales: 48, margin: 72000, trend: "up" as const },
  { id: "d4", name: "Créteil", city: "Créteil", objectiveRate: 89, sales: 38, margin: 57000, trend: "down" as const },
  { id: "d5", name: "Saint-Denis", city: "Saint-Denis", objectiveRate: 95, sales: 42, margin: 63000, trend: "stable" as const },
  { id: "d6", name: "Évry", city: "Évry", objectiveRate: 102, sales: 46, margin: 69000, trend: "up" as const }
]

function KPICard({
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

function DealershipCard({ dealership }: { dealership: typeof mockBrandDealerships[0] }) {
  return (
    <Card className="border-0 shadow-premium hover:shadow-xl transition-all cursor-pointer">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">{dealership.name}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {dealership.city}
            </p>
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
                dealership.objectiveRate >= 100 ? "text-emerald-600" :
                dealership.objectiveRate >= 95 ? "text-blue-600" :
                "text-amber-600"
              }`}>
                {dealership.objectiveRate}%
              </span>
            </div>
            <Progress value={Math.min(dealership.objectiveRate, 100)} className={`h-2 ${
              dealership.objectiveRate >= 100 ? "[&>div]:bg-emerald-500" :
              dealership.objectiveRate >= 95 ? "[&>div]:bg-blue-500" :
              "[&>div]:bg-amber-500"
            }`} />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t">
            <div>
              <p className="text-xs text-gray-500">Ventes</p>
              <p className="font-semibold text-gray-900">{dealership.sales}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Marge</p>
              <p className="font-semibold text-emerald-600">{(dealership.margin / 1000).toFixed(0)}k€</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function BrandPerformanceChart({ brandName }: { brandName: string }) {
  const brandKey = brandName.toLowerCase() as "ford" | "nissan" | "suzuki"
  const maxSales = Math.max(...groupPerformanceHistory.map(h => h[brandKey]?.sales || 0))

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3 h-48">
        {groupPerformanceHistory.map((month) => {
          const sales = month[brandKey]?.sales || 0
          const height = (sales / maxSales) * 100

          return (
            <div key={month.month} className="flex-1 flex flex-col items-center gap-1">
              <div className="text-xs font-semibold text-gray-700">{sales}</div>
              <div className="relative w-full h-40 flex items-end justify-center">
                <div
                  className="w-8 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                  style={{ height: `${height}%` }}
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

export function BrandDetailContent({ id }: { id: string }) {
  const [tab, setTab] = useState<"overview" | "dealerships" | "challenges">("overview")

  const brand = getBrandById(id)

  if (!brand) {
    notFound()
  }

  // Get challenges for this brand
  const brandChallenges = groupChallenges.filter(c =>
    c.participants.some(p => p.brandId === id)
  )

  // Calculate dealership stats
  const aboveTarget = mockBrandDealerships.filter(d => d.objectiveRate >= 100).length
  const onTrack = mockBrandDealerships.filter(d => d.objectiveRate >= 90 && d.objectiveRate < 100).length
  const atRisk = mockBrandDealerships.filter(d => d.objectiveRate < 90).length

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/groupe" className="hover:text-gray-700">
              Groupe AutoPerf
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/groupe/marques" className="hover:text-gray-700">
              Marques
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{brand.name}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${brand.color} flex items-center justify-center text-3xl shadow-lg`}>
              {brand.logo}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {brand.name}
              </h1>
              <p className="text-gray-500 mt-1">
                {brand.dealershipCount} concessions • {brand.employeeCount} collaborateurs
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <FileText className="w-4 h-4" />
            Rapport
          </Button>
          <Link href="/groupe/marques">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
          </Link>
        </div>
      </div>

      {/* Director Info */}
      <Card className="border-0 shadow-premium">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarFallback className={`bg-gradient-to-br ${brand.color} text-white font-semibold text-lg`}>
                  {brand.directorName.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900">{brand.directorName}</h3>
                <p className="text-sm text-gray-500">Directeur de marque</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{brand.stats.objectiveRate}%</p>
                <p className="text-xs text-gray-500">Objectif</p>
              </div>
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                brand.trend === "up" ? "bg-emerald-100 text-emerald-700" :
                brand.trend === "down" ? "bg-red-100 text-red-700" :
                "bg-gray-100 text-gray-600"
              }`}>
                {brand.trend === "up" ? <TrendingUp className="w-4 h-4" /> :
                 brand.trend === "down" ? <TrendingDown className="w-4 h-4" /> :
                 <Minus className="w-4 h-4" />}
                <span className="font-medium">
                  {brand.quarterlyGrowth > 0 ? "+" : ""}{brand.quarterlyGrowth}% Q/Q
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <KPICard
          title="Ventes"
          value={brand.stats.totalSales}
          subtitle={`Obj: ${brand.stats.salesTarget}`}
          icon={Car}
          color="blue"
        />
        <KPICard
          title="Chiffre d'affaires"
          value={`${(brand.stats.totalRevenue / 1000000).toFixed(1)}M€`}
          icon={Euro}
          color="green"
          trend="up"
          trendValue="+8% YoY"
        />
        <KPICard
          title="Marge"
          value={`${(brand.stats.totalMargin / 1000).toFixed(0)}k€`}
          icon={Target}
          color="purple"
        />
        <KPICard
          title="GPU"
          value={`${brand.stats.avgGPU}€`}
          icon={BarChart3}
          color="amber"
        />
        <KPICard
          title="Financement"
          value={`${brand.stats.financingRate}%`}
          subtitle="Cible: 75%"
          icon={Percent}
          color={brand.stats.financingRate >= 75 ? "green" : "amber"}
        />
        <KPICard
          title="NPS"
          value={brand.stats.satisfaction}
          subtitle="Cible: 85"
          icon={Star}
          color={brand.stats.satisfaction >= 85 ? "green" : "amber"}
        />
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="bg-gray-100 p-1">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Vue d&apos;ensemble
          </TabsTrigger>
          <TabsTrigger value="dealerships" className="gap-2">
            <Building className="w-4 h-4" />
            Concessions
          </TabsTrigger>
          <TabsTrigger value="challenges" className="gap-2">
            <Zap className="w-4 h-4" />
            Challenges
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Performance Chart */}
          <Card className="border-0 shadow-premium">
            <CardHeader>
              <CardTitle>Performance mensuelle</CardTitle>
              <CardDescription>Évolution des ventes sur 6 mois</CardDescription>
            </CardHeader>
            <CardContent>
              <BrandPerformanceChart brandName={brand.name} />
            </CardContent>
          </Card>

          {/* Dealership Status */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-0 shadow-premium bg-emerald-50">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-emerald-600">{aboveTarget}</p>
                <p className="text-sm text-emerald-700">Objectif atteint</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-premium bg-blue-50">
              <CardContent className="p-6 text-center">
                <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-blue-600">{onTrack}</p>
                <p className="text-sm text-blue-700">En bonne voie</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-premium bg-red-50">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-red-600">{atRisk}</p>
                <p className="text-sm text-red-700">À risque</p>
              </CardContent>
            </Card>
          </div>

          {/* Market Share */}
          <Card className="border-0 shadow-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-indigo-600" />
                Part de marché
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                <div className="w-32 h-32 rounded-full border-8 border-indigo-500 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">{brand.stats.marketShare}%</span>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600">Part de marché régionale</p>
                  <Badge className="bg-emerald-100 text-emerald-700">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +0.5 pts vs N-1
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dealerships Tab */}
        <TabsContent value="dealerships" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Réseau de concessions
            </h2>
            <Badge className="bg-gray-100 text-gray-700">
              {mockBrandDealerships.length} sites
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockBrandDealerships.map(dealership => (
              <DealershipCard key={dealership.id} dealership={dealership} />
            ))}
          </div>
        </TabsContent>

        {/* Challenges Tab */}
        <TabsContent value="challenges" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Challenges en cours
            </h2>
            <Link href="/groupe/challenges/new">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nouveau challenge
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {brandChallenges.map(challenge => {
              const brandProgress = challenge.participants.find(p => p.brandId === id)

              return (
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
                      <Badge className="bg-purple-100 text-purple-700">
                        <Trophy className="w-3 h-3 mr-1" />
                        {challenge.reward.value}
                      </Badge>
                    </div>

                    {brandProgress && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">Votre progression</span>
                          <span className="font-bold">
                            {brandProgress.currentValue}{challenge.targetUnit}
                          </span>
                        </div>
                        <Progress
                          value={Math.min(brandProgress.progressRate, 100)}
                          className={`h-2 ${
                            brandProgress.isCompleted ? "[&>div]:bg-emerald-500" : "[&>div]:bg-indigo-500"
                          }`}
                        />
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {brandProgress.progressRate.toFixed(0)}% complété
                          </span>
                          {brandProgress.isCompleted && (
                            <Badge className="bg-emerald-100 text-emerald-700">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Objectif atteint
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-gray-500 mt-4">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      Du {new Date(challenge.startDate).toLocaleDateString("fr-FR")} au {new Date(challenge.endDate).toLocaleDateString("fr-FR")}
                    </p>
                  </CardContent>
                </Card>
              )
            })}

            {brandChallenges.length === 0 && (
              <Card className="border-0 shadow-premium">
                <CardContent className="p-12 text-center">
                  <Zap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Aucun challenge actif</h3>
                  <p className="text-gray-500 mb-4">
                    Cette marque ne participe à aucun challenge pour le moment.
                  </p>
                  <Link href="/groupe/challenges/new">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Créer un challenge
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
