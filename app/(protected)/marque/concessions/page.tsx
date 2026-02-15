"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Building2,
  ChevronRight,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  ArrowUpDown,
  Filter,
  AlertTriangle,
  CheckCircle,
  Users,
  Car,
  Euro,
  Percent,
  Star
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { dealerships, getDealershipRanking } from "@/lib/mock-dir-marque-data"

type SortField = "rank" | "sales" | "margin" | "financing" | "satisfaction" | "stock"
type FilterStatus = "all" | "above" | "on_track" | "at_risk"

export default function ConcessionListPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortField>("rank")
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")

  const filteredDealerships = useMemo(() => {
    let result = getDealershipRanking()

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(d =>
        d.name.toLowerCase().includes(query) ||
        d.location.toLowerCase().includes(query) ||
        d.directorName.toLowerCase().includes(query)
      )
    }

    // Filter by status
    if (filterStatus !== "all") {
      result = result.filter(d => {
        const rate = d.stats.objectiveRate
        if (filterStatus === "above") return rate >= 100
        if (filterStatus === "on_track") return rate >= 90 && rate < 100
        if (filterStatus === "at_risk") return rate < 90
        return true
      })
    }

    // Sort
    if (sortBy !== "rank") {
      result = [...result].sort((a, b) => {
        switch (sortBy) {
          case "sales": return b.stats.totalSales - a.stats.totalSales
          case "margin": return b.stats.totalMargin - a.stats.totalMargin
          case "financing": return b.stats.financingRate - a.stats.financingRate
          case "satisfaction": return b.stats.satisfaction - a.stats.satisfaction
          case "stock": return a.stats.stockDays - b.stats.stockDays
          default: return 0
        }
      })
    }

    return result
  }, [searchQuery, sortBy, filterStatus])

  const stats = {
    total: dealerships.length,
    above: dealerships.filter(d => d.stats.objectiveRate >= 100).length,
    onTrack: dealerships.filter(d => d.stats.objectiveRate >= 90 && d.stats.objectiveRate < 100).length,
    atRisk: dealerships.filter(d => d.stats.objectiveRate < 90).length
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link href="/marque" className="hover:text-indigo-600 transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Concessions</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Concessions Ford Île-de-France
        </h1>
        <p className="text-gray-500 mt-1">
          {dealerships.length} concessions sous votre responsabilité
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-0 shadow-premium">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-500">Total</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-premium bg-emerald-50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-emerald-600">{stats.above}</p>
            <p className="text-sm text-emerald-600">Objectif atteint</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-premium bg-blue-50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.onTrack}</p>
            <p className="text-sm text-blue-600">En bonne voie</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-premium bg-red-50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-red-600">{stats.atRisk}</p>
            <p className="text-sm text-red-600">À risque</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Rechercher une concession..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as FilterStatus)}>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="above">Objectif atteint</SelectItem>
            <SelectItem value="on_track">En bonne voie</SelectItem>
            <SelectItem value="at_risk">À risque</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortField)}>
          <SelectTrigger className="w-[180px]">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rank">Classement</SelectItem>
            <SelectItem value="sales">Ventes</SelectItem>
            <SelectItem value="margin">Marge</SelectItem>
            <SelectItem value="financing">Financement</SelectItem>
            <SelectItem value="satisfaction">Satisfaction</SelectItem>
            <SelectItem value="stock">Stock (jours)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dealership List */}
      <div className="space-y-4">
        {filteredDealerships.map((dealership, index) => {
          const globalRank = getDealershipRanking().findIndex(d => d.id === dealership.id) + 1
          const objectiveRate = dealership.stats.objectiveRate

          return (
            <Link key={dealership.id} href={`/marque/concessions/${dealership.id}`}>
              <Card className={`border-0 shadow-premium hover:shadow-xl transition-all cursor-pointer ${
                dealership.alerts.some(a => a.type === "critical") ? "ring-2 ring-red-200" : ""
              }`}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Rank & Name */}
                    <div className="flex items-center gap-4 lg:w-1/4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white ${
                        globalRank === 1 ? "bg-amber-500" :
                        globalRank === 2 ? "bg-gray-400" :
                        globalRank === 3 ? "bg-orange-500" :
                        "bg-gray-300"
                      }`}>
                        #{globalRank}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{dealership.name}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {dealership.location}
                        </p>
                        <p className="text-xs text-gray-400">{dealership.directorName}</p>
                      </div>
                    </div>

                    {/* Objective Progress */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">Objectif mensuel</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${
                            objectiveRate >= 100 ? "text-emerald-600" :
                            objectiveRate >= 90 ? "text-blue-600" :
                            "text-red-600"
                          }`}>
                            {objectiveRate}%
                          </span>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            dealership.trend === "up" ? "bg-emerald-100" :
                            dealership.trend === "down" ? "bg-red-100" :
                            "bg-gray-100"
                          }`}>
                            {dealership.trend === "up" ? <TrendingUp className="w-3 h-3 text-emerald-600" /> :
                             dealership.trend === "down" ? <TrendingDown className="w-3 h-3 text-red-600" /> :
                             <Minus className="w-3 h-3 text-gray-400" />}
                          </div>
                        </div>
                      </div>
                      <Progress value={Math.min(objectiveRate, 100)} className={`h-3 ${
                        objectiveRate >= 100 ? "[&>div]:bg-emerald-500" :
                        objectiveRate >= 90 ? "[&>div]:bg-blue-500" :
                        "[&>div]:bg-red-500"
                      }`} />
                      <p className="text-xs text-gray-500 mt-1">
                        {dealership.stats.totalSales} / {dealership.stats.salesTarget} ventes
                      </p>
                    </div>

                    {/* KPIs */}
                    <div className="grid grid-cols-4 gap-4 lg:w-2/5">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                          <Car className="w-3 h-3" />
                          <span className="text-xs">Ventes</span>
                        </div>
                        <p className="font-bold text-gray-900">{dealership.stats.totalSales}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                          <Euro className="w-3 h-3" />
                          <span className="text-xs">GPU</span>
                        </div>
                        <p className="font-bold text-gray-900">{dealership.stats.avgGPU}€</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                          <Percent className="w-3 h-3" />
                          <span className="text-xs">Financ.</span>
                        </div>
                        <p className={`font-bold ${
                          dealership.stats.financingRate >= 75 ? "text-emerald-600" : "text-amber-600"
                        }`}>
                          {dealership.stats.financingRate}%
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                          <Star className="w-3 h-3" />
                          <span className="text-xs">NPS</span>
                        </div>
                        <p className={`font-bold ${
                          dealership.stats.satisfaction >= 85 ? "text-emerald-600" : "text-amber-600"
                        }`}>
                          {dealership.stats.satisfaction}
                        </p>
                      </div>
                    </div>

                    {/* Alerts */}
                    <div className="lg:w-40 flex flex-wrap gap-2 justify-end">
                      {dealership.alerts.length > 0 ? (
                        dealership.alerts.slice(0, 2).map((alert, i) => (
                          <Badge
                            key={i}
                            className={`${
                              alert.type === "critical" ? "bg-red-100 text-red-700" :
                              alert.type === "warning" ? "bg-amber-100 text-amber-700" :
                              "bg-blue-100 text-blue-700"
                            } text-xs`}
                          >
                            {alert.type === "critical" && <AlertTriangle className="w-3 h-3 mr-1" />}
                            {alert.message.slice(0, 20)}...
                          </Badge>
                        ))
                      ) : (
                        <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          OK
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {filteredDealerships.length === 0 && (
        <Card className="border-0 shadow-premium">
          <CardContent className="p-12 text-center">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune concession trouvée</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("")
                setFilterStatus("all")
              }}
            >
              Réinitialiser les filtres
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
