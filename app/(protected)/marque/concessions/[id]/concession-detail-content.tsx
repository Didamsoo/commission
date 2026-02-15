"use client"

import { useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  Building2,
  ChevronRight,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  Euro,
  Car,
  Target,
  Percent,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Users,
  Phone,
  Mail,
  Zap,
  Package,
  Wrench,
  BarChart3,
  Calendar
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getDealershipById, getDealershipRanking, brandChallenges } from "@/lib/mock-dir-marque-data"

// ============================================
// COMPONENTS
// ============================================

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "blue",
  progress,
  target
}: {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ElementType
  color?: "blue" | "green" | "purple" | "amber" | "red"
  progress?: number
  target?: number
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
        <div className="flex items-start justify-between mb-3">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center shadow-lg`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        {progress !== undefined && (
          <div className="space-y-1">
            <Progress value={Math.min(progress, 100)} className={`h-2 ${
              progress >= 100 ? "[&>div]:bg-emerald-500" :
              progress >= 90 ? "[&>div]:bg-blue-500" :
              progress >= 80 ? "[&>div]:bg-amber-500" :
              "[&>div]:bg-red-500"
            }`} />
            {target && (
              <p className="text-xs text-gray-500 text-right">{progress}% de l&apos;objectif</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function DepartmentCard({
  name,
  icon: Icon,
  sales,
  target,
  margin,
  color
}: {
  name: string
  icon: React.ElementType
  sales: number
  target: number
  margin: number
  color: string
}) {
  const rate = Math.round((sales / target) * 100)

  return (
    <Card className="border-0 shadow-premium">
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500">{sales}/{target} ventes</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Objectif</span>
              <span className={`font-semibold ${
                rate >= 100 ? "text-emerald-600" :
                rate >= 90 ? "text-blue-600" :
                "text-amber-600"
              }`}>
                {rate}%
              </span>
            </div>
            <Progress value={Math.min(rate, 100)} className={`h-2 ${
              rate >= 100 ? "[&>div]:bg-emerald-500" :
              rate >= 90 ? "[&>div]:bg-blue-500" :
              "[&>div]:bg-amber-500"
            }`} />
          </div>

          <div className="flex justify-between pt-2 border-t">
            <span className="text-sm text-gray-500">Marge</span>
            <span className="font-semibold text-gray-900">{margin.toLocaleString()}€</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

export function ConcessionDetailContent({ id }: { id: string }) {
  const dealership = getDealershipById(id)

  if (!dealership) {
    notFound()
  }

  const [tab, setTab] = useState<"overview" | "departments" | "challenges">("overview")

  const globalRank = getDealershipRanking().findIndex(d => d.id === id) + 1
  const objectiveRate = dealership.stats.objectiveRate

  // Get challenges where this dealership participates
  const dealershipChallenges = brandChallenges.filter(c =>
    c.participants.some(p => p.dealershipId === id)
  )

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* ============================================
          HEADER
          ============================================ */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/marque" className="hover:text-indigo-600 transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/marque/concessions" className="hover:text-indigo-600 transition-colors">
              Concessions
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{dealership.name}</span>
          </div>

          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center font-bold text-xl text-white ${
              globalRank === 1 ? "bg-amber-500" :
              globalRank === 2 ? "bg-gray-400" :
              globalRank === 3 ? "bg-orange-500" :
              "bg-gray-300"
            }`}>
              #{globalRank}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                {dealership.name}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  dealership.trend === "up" ? "bg-emerald-100" :
                  dealership.trend === "down" ? "bg-red-100" :
                  "bg-gray-100"
                }`}>
                  {dealership.trend === "up" ? <TrendingUp className="w-4 h-4 text-emerald-600" /> :
                   dealership.trend === "down" ? <TrendingDown className="w-4 h-4 text-red-600" /> :
                   <Minus className="w-4 h-4 text-gray-400" />}
                </div>
              </h1>
              <p className="text-gray-500 mt-1 flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {dealership.address}
                </span>
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xs">
                      {dealership.directorName.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-600">Dir: {dealership.directorName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/marque/concessions">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
          </Link>
          <Button variant="outline" className="gap-2">
            <Phone className="w-4 h-4" />
            Contacter
          </Button>
          <Link href={`/marque/challenges/new?target=${id}`}>
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 gap-2">
              <Zap className="w-4 h-4" />
              Créer challenge
            </Button>
          </Link>
        </div>
      </div>

      {/* ============================================
          ALERTS
          ============================================ */}
      {dealership.alerts.length > 0 && (
        <Card className="border-0 overflow-hidden">
          <div className={`${
            dealership.alerts.some(a => a.type === "critical")
              ? "bg-gradient-to-r from-red-500 to-red-600"
              : "bg-gradient-to-r from-amber-500 to-orange-500"
          } p-4`}>
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-white flex-shrink-0" />
              <div className="text-white">
                <p className="font-bold">{dealership.alerts.length} alerte{dealership.alerts.length > 1 ? "s" : ""}</p>
                <ul className="text-white/80 text-sm mt-1 space-y-1">
                  {dealership.alerts.map((alert, i) => (
                    <li key={i}>• {alert.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* ============================================
          OBJECTIVE PROGRESS
          ============================================ */}
      <Card className="border-0 shadow-premium">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                Objectif mensuel
              </h3>
              <p className="text-sm text-gray-500 mt-1">Février 2024</p>
            </div>
            <div className="flex items-center gap-3">
              {objectiveRate >= 100 ? (
                <Badge className="bg-emerald-500 text-white h-8 px-4">
                  <CheckCircle className="w-4 h-4 mr-1.5" />
                  Objectif atteint !
                </Badge>
              ) : (
                <Badge className="bg-gray-100 text-gray-700 h-8 px-4">
                  <Clock className="w-4 h-4 mr-1.5" />
                  {dealership.stats.salesTarget - dealership.stats.totalSales} ventes restantes
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex-1">
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    objectiveRate >= 100 ? "bg-gradient-to-r from-emerald-500 to-emerald-600" :
                    objectiveRate >= 90 ? "bg-gradient-to-r from-blue-500 to-indigo-500" :
                    objectiveRate >= 80 ? "bg-gradient-to-r from-amber-500 to-orange-500" :
                    "bg-gradient-to-r from-red-500 to-red-600"
                  }`}
                  style={{ width: `${Math.min(objectiveRate, 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-gray-500">0 ventes</span>
                <span className="font-semibold text-gray-900">
                  {dealership.stats.totalSales}/{dealership.stats.salesTarget} ({objectiveRate}%)
                </span>
                <span className="text-gray-500">{dealership.stats.salesTarget} ventes</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============================================
          KPI GRID
          ============================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Ventes"
          value={dealership.stats.totalSales}
          subtitle={`/${dealership.stats.salesTarget} objectif`}
          icon={Car}
          color={objectiveRate >= 100 ? "green" : "blue"}
          progress={objectiveRate}
          target={dealership.stats.salesTarget}
        />
        <StatCard
          title="Marge totale"
          value={`${(dealership.stats.totalMargin / 1000).toFixed(1)}k€`}
          subtitle={`GPU: ${dealership.stats.avgGPU}€`}
          icon={Euro}
          color="green"
        />
        <StatCard
          title="Financement"
          value={`${dealership.stats.financingRate}%`}
          subtitle="Cible: 75%"
          icon={Percent}
          color={dealership.stats.financingRate >= 75 ? "green" : "amber"}
        />
        <StatCard
          title="Satisfaction"
          value={dealership.stats.satisfaction}
          subtitle="NPS (cible: 85)"
          icon={Star}
          color={dealership.stats.satisfaction >= 85 ? "green" : "amber"}
        />
        <StatCard
          title="Stock"
          value={`${dealership.stats.stockDays}j`}
          subtitle="Rotation moyenne"
          icon={Package}
          color={dealership.stats.stockDays <= 45 ? "green" : "amber"}
        />
      </div>

      {/* ============================================
          TABS
          ============================================ */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="bg-gray-100 p-1">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Vue d&apos;ensemble
          </TabsTrigger>
          <TabsTrigger value="departments" className="gap-2">
            <Building2 className="w-4 h-4" />
            Départements
          </TabsTrigger>
          <TabsTrigger value="challenges" className="gap-2">
            <Zap className="w-4 h-4" />
            Challenges ({dealershipChallenges.length})
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Comparison with network */}
            <Card className="border-0 shadow-premium">
              <CardHeader>
                <CardTitle className="text-lg">Comparaison réseau</CardTitle>
                <CardDescription>Position par rapport aux autres concessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {getDealershipRanking().map((d, index) => (
                  <div
                    key={d.id}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      d.id === id ? "bg-indigo-50 ring-2 ring-indigo-500" : "bg-gray-50"
                    }`}
                  >
                    <Badge className={`${
                      index === 0 ? "bg-amber-500 text-white" :
                      index === 1 ? "bg-gray-400 text-white" :
                      index === 2 ? "bg-orange-500 text-white" :
                      "bg-gray-200 text-gray-700"
                    }`}>
                      #{index + 1}
                    </Badge>
                    <span className={`flex-1 font-medium ${d.id === id ? "text-indigo-700" : "text-gray-700"}`}>
                      {d.name}
                    </span>
                    <span className="font-semibold">{d.stats.objectiveRate}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Information */}
            <Card className="border-0 shadow-premium">
              <CardHeader>
                <CardTitle className="text-lg">Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-500">Code</span>
                  <span className="font-mono font-semibold">{dealership.code}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-500">Directeur</span>
                  <span className="font-semibold">{dealership.directorName}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-500">Adresse</span>
                  <span className="font-semibold text-right text-sm">{dealership.address}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-500">Marge totale</span>
                  <span className="font-semibold text-emerald-600">{dealership.stats.totalMargin.toLocaleString()}€</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500">GPU moyen</span>
                  <span className="font-semibold">{dealership.stats.avgGPU}€</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* DEPARTMENTS TAB */}
        <TabsContent value="departments" className="mt-6">
          <div className="grid md:grid-cols-3 gap-4">
            <DepartmentCard
              name="Véhicules Neufs (VN)"
              icon={Car}
              sales={dealership.departments.vn.sales}
              target={dealership.departments.vn.target}
              margin={dealership.departments.vn.margin}
              color="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <DepartmentCard
              name="Véhicules d'Occasion (VO)"
              icon={Car}
              sales={dealership.departments.vo.sales}
              target={dealership.departments.vo.target}
              margin={dealership.departments.vo.margin}
              color="bg-gradient-to-br from-emerald-500 to-emerald-600"
            />
            <DepartmentCard
              name="Véhicules Utilitaires (VU)"
              icon={Car}
              sales={dealership.departments.vu.sales}
              target={dealership.departments.vu.target}
              margin={dealership.departments.vu.margin}
              color="bg-gradient-to-br from-amber-500 to-orange-500"
            />
          </div>
        </TabsContent>

        {/* CHALLENGES TAB */}
        <TabsContent value="challenges" className="mt-6">
          <div className="space-y-4">
            {dealershipChallenges.length > 0 ? (
              dealershipChallenges.map(challenge => {
                const participant = challenge.participants.find(p => p.dealershipId === id)!
                const progress = Math.min(participant.progressRate, 100)

                return (
                  <Card key={challenge.id} className="border-0 shadow-premium">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg text-gray-900">{challenge.title}</h3>
                            {participant.isCompleted ? (
                              <Badge className="bg-emerald-100 text-emerald-700">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Complété
                              </Badge>
                            ) : (
                              <Badge className="bg-blue-100 text-blue-700">
                                En cours
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-500">{challenge.description}</p>
                        </div>
                        <Badge className="bg-purple-100 text-purple-700">
                          {challenge.reward.value}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">
                            {participant.currentValue}{challenge.targetUnit} / {challenge.targetValue}{challenge.targetUnit}
                          </span>
                          <span className="font-semibold">{Math.round(participant.progressRate)}%</span>
                        </div>
                        <Progress value={progress} className={`h-2 ${
                          participant.isCompleted ? "[&>div]:bg-emerald-500" : "[&>div]:bg-indigo-500"
                        }`} />
                      </div>

                      <p className="text-xs text-gray-500 mt-3">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        Fin le {new Date(challenge.endDate).toLocaleDateString("fr-FR")}
                      </p>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <Card className="border-0 shadow-premium">
                <CardContent className="p-12 text-center">
                  <Zap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Aucun challenge en cours</p>
                  <Link href={`/marque/challenges/new?target=${id}`}>
                    <Button className="mt-4 gap-2">
                      <Zap className="w-4 h-4" />
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
