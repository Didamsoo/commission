"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Building,
  ChevronRight,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpDown,
  Filter,
  AlertTriangle,
  CheckCircle,
  Users,
  Car,
  Euro,
  Percent,
  Star,
  Trophy,
  Globe,
  BarChart3,
  Target,
  ArrowRight,
  Crown,
  BadgeCheck,
  Briefcase,
  MapPin
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { brands, groupKPIs, getBrandRanking, currentDirPlaque } from "@/lib/mock-dir-plaque-data"

type SortField = "rank" | "revenue" | "margin" | "volume" | "satisfaction" | "growth"
type FilterStatus = "all" | "above" | "on_track" | "at_risk"

// ============================================
// COMPONENTS
// ============================================

function BrandCard({ brand, rank }: { brand: typeof brands[0]; rank: number }) {
  const objectiveRate = brand.stats.objectiveRate
  
  return (
    <Link href={`/groupe/marques/${brand.id}`}>
      <Card className="border-0 shadow-premium hover:shadow-premium-lg transition-all duration-300 cursor-pointer overflow-hidden group h-full">
        {/* Header with gradient */}
        <div className={`h-24 bg-gradient-to-br ${brand.color} relative`}>
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute top-4 left-4">
            <div className="w-16 h-16 rounded-2xl bg-white/90 backdrop-blur flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform">
              {brand.logo}
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <Badge className={`${
              rank === 1 ? "bg-amber-400 text-white" :
              rank === 2 ? "bg-gray-300 text-gray-800" :
              rank === 3 ? "bg-orange-400 text-white" :
              "bg-white/80 text-gray-700"
            } font-bold shadow-lg`}>
              <Trophy className="w-3 h-3 mr-1" />
              #{rank}
            </Badge>
          </div>
        </div>

        <CardContent className="p-5">
          {/* Brand Info */}
          <div className="mb-4">
            <h3 className="font-bold text-xl text-gray-900">{brand.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{brand.dealershipCount} concessions</span>
              <span>•</span>
              <Users className="w-3.5 h-3.5" />
              <span>{brand.employeeCount} employés</span>
            </div>
          </div>

          {/* Director */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-600 text-white font-semibold text-sm">
                {brand.directorName.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900 text-sm">{brand.directorName}</p>
              <p className="text-xs text-gray-500">Directeur de marque</p>
            </div>
          </div>

          {/* Objective Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Objectif volume</span>
              <span className={`font-bold ${
                objectiveRate >= 100 ? "text-emerald-600" :
                objectiveRate >= 95 ? "text-blue-600" :
                "text-amber-600"
              }`}>
                {objectiveRate}%
              </span>
            </div>
            <Progress value={Math.min(objectiveRate, 100)} className={`h-2 ${
              objectiveRate >= 100 ? "[&>div]:bg-emerald-500" :
              objectiveRate >= 95 ? "[&>div]:bg-blue-500" :
              "[&>div]:bg-amber-500"
            }`} />
          </div>

          {/* KPIs Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <p className="text-xs text-blue-600 mb-1">Chiffre d&apos;affaires</p>
              <p className="font-bold text-gray-900">{(brand.stats.totalRevenue / 1000000).toFixed(1)}M€</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl">
              <p className="text-xs text-emerald-600 mb-1">Marge totale</p>
              <p className="font-bold text-emerald-600">{(brand.stats.totalMargin / 1000).toFixed(0)}k€</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <p className="text-xs text-purple-600 mb-1">Volume</p>
              <p className="font-bold text-gray-900">{brand.stats.totalSales} véh.</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl">
              <p className="text-xs text-amber-600 mb-1">Croissance</p>
              <div className="flex items-center gap-1">
                {brand.quarterlyGrowth > 0 ? (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                ) : brand.quarterlyGrowth < 0 ? (
                  <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                ) : (
                  <Minus className="w-3.5 h-3.5 text-gray-400" />
                )}
                <p className={`font-bold ${
                  brand.quarterlyGrowth > 0 ? "text-emerald-600" :
                  brand.quarterlyGrowth < 0 ? "text-red-600" :
                  "text-gray-600"
                }`}>
                  {brand.quarterlyGrowth > 0 ? "+" : ""}{brand.quarterlyGrowth}%
                </p>
              </div>
            </div>
          </div>

          {/* Additional KPIs */}
          <div className="flex items-center justify-between pt-3 border-t text-sm">
            <div className="flex items-center gap-1 text-gray-500">
              <Percent className="w-3.5 h-3.5" />
              <span>Financ. {brand.stats.financingRate}%</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <Star className="w-3.5 h-3.5" />
              <span>NPS {brand.stats.satisfaction}</span>
            </div>
          </div>

          {/* Trend indicator */}
          <div className={`mt-4 flex items-center justify-center gap-1 text-sm ${
            brand.trend === "up" ? "text-emerald-600" :
            brand.trend === "down" ? "text-red-600" :
            "text-gray-500"
          }`}>
            {brand.trend === "up" && <TrendingUp className="w-4 h-4" />}
            {brand.trend === "down" && <TrendingDown className="w-4 h-4" />}
            {brand.trend === "stable" && <Minus className="w-4 h-4" />}
            <span className="font-medium">
              {brand.trend === "up" ? "En progression" : brand.trend === "down" ? "En baisse" : "Stable"}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function BrandRow({ brand, rank }: { brand: typeof brands[0]; rank: number }) {
  const objectiveRate = brand.stats.objectiveRate

  return (
    <Link href={`/groupe/marques/${brand.id}`}>
      <Card className="border-0 shadow-premium hover:shadow-premium-lg transition-all duration-300 cursor-pointer overflow-hidden">
        <CardContent className="p-5">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            {/* Rank & Logo */}
            <div className="flex items-center gap-4 lg:w-48">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white ${
                rank === 1 ? "bg-amber-500" :
                rank === 2 ? "bg-gray-400" :
                rank === 3 ? "bg-orange-500" :
                "bg-gray-300"
              }`}>
                #{rank}
              </div>
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${brand.color} flex items-center justify-center text-2xl shadow-lg`}>
                {brand.logo}
              </div>
              <div className="lg:hidden">
                <h3 className="font-bold text-gray-900">{brand.name}</h3>
                <p className="text-sm text-gray-500">{brand.dealershipCount} sites</p>
              </div>
            </div>

            {/* Brand Info */}
            <div className="hidden lg:block lg:w-48">
              <h3 className="font-bold text-gray-900">{brand.name}</h3>
              <p className="text-sm text-gray-500">{brand.dealershipCount} concessions</p>
              <p className="text-xs text-gray-400">{brand.employeeCount} employés</p>
            </div>

            {/* Objective Progress */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Objectif volume</span>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${
                    objectiveRate >= 100 ? "text-emerald-600" :
                    objectiveRate >= 95 ? "text-blue-600" :
                    "text-amber-600"
                  }`}>
                    {objectiveRate}%
                  </span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    brand.trend === "up" ? "bg-emerald-100" :
                    brand.trend === "down" ? "bg-red-100" :
                    "bg-gray-100"
                  }`}>
                    {brand.trend === "up" ? <TrendingUp className="w-3 h-3 text-emerald-600" /> :
                     brand.trend === "down" ? <TrendingDown className="w-3 h-3 text-red-600" /> :
                     <Minus className="w-3 h-3 text-gray-400" />}
                  </div>
                </div>
              </div>
              <Progress value={Math.min(objectiveRate, 100)} className={`h-2 ${
                objectiveRate >= 100 ? "[&>div]:bg-emerald-500" :
                objectiveRate >= 95 ? "[&>div]:bg-blue-500" :
                "[&>div]:bg-amber-500"
              }`} />
              <p className="text-xs text-gray-500 mt-1">
                Dir: {brand.directorName}
              </p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-4 gap-4 lg:w-96">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">CA</p>
                <p className="font-bold text-gray-900">{(brand.stats.totalRevenue / 1000000).toFixed(1)}M€</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Marge</p>
                <p className="font-bold text-emerald-600">{(brand.stats.totalMargin / 1000).toFixed(0)}k€</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Volume</p>
                <p className="font-bold text-gray-900">{brand.stats.totalSales}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">NPS</p>
                <p className={`font-bold ${brand.stats.satisfaction >= 85 ? "text-emerald-600" : "text-amber-600"}`}>
                  {brand.stats.satisfaction}
                </p>
              </div>
            </div>

            {/* Growth */}
            <div className="lg:w-24 text-right">
              <Badge className={`${
                brand.quarterlyGrowth > 0 ? "bg-emerald-100 text-emerald-700" :
                brand.quarterlyGrowth < 0 ? "bg-red-100 text-red-700" :
                "bg-gray-100 text-gray-700"
              }`}>
                {brand.quarterlyGrowth > 0 ? "+" : ""}{brand.quarterlyGrowth}% Q/Q
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = "blue",
  trend
}: { 
  title: string
  value: string | number
  subtitle?: string
  icon: React.ElementType
  color?: "blue" | "green" | "purple" | "amber" | "red" | "indigo"
  trend?: { value: number; label: string }
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
    <Card className="border-0 shadow-premium overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            {trend && (
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                trend.value >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
              }`}>
                {trend.value >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{trend.value >= 0 ? "+" : ""}{trend.value}% {trend.label}</span>
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

// ============================================
// MAIN PAGE
// ============================================

export default function MarquesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortField>("rank")
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const rankedBrands = useMemo(() => {
    let result = getBrandRanking()

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(b =>
        b.name.toLowerCase().includes(query) ||
        b.directorName.toLowerCase().includes(query)
      )
    }

    // Filter by status
    if (filterStatus !== "all") {
      result = result.filter(b => {
        const rate = b.stats.objectiveRate
        if (filterStatus === "above") return rate >= 100
        if (filterStatus === "on_track") return rate >= 95 && rate < 100
        if (filterStatus === "at_risk") return rate < 95
        return true
      })
    }

    // Sort
    if (sortBy !== "rank") {
      result = [...result].sort((a, b) => {
        switch (sortBy) {
          case "revenue": return b.stats.totalRevenue - a.stats.totalRevenue
          case "margin": return b.stats.totalMargin - a.stats.totalMargin
          case "volume": return b.stats.totalSales - a.stats.totalSales
          case "satisfaction": return b.stats.satisfaction - a.stats.satisfaction
          case "growth": return b.quarterlyGrowth - a.quarterlyGrowth
          default: return 0
        }
      })
    }

    return result
  }, [searchQuery, sortBy, filterStatus])

  const stats = {
    total: brands.length,
    above: brands.filter(b => b.stats.objectiveRate >= 100).length,
    onTrack: brands.filter(b => b.stats.objectiveRate >= 95 && b.stats.objectiveRate < 100).length,
    atRisk: brands.filter(b => b.stats.objectiveRate < 95).length,
    totalRevenue: brands.reduce((sum, b) => sum + b.stats.totalRevenue, 0),
    totalMargin: brands.reduce((sum, b) => sum + b.stats.totalMargin, 0),
    totalEmployees: brands.reduce((sum, b) => sum + b.employeeCount, 0),
    totalDealerships: brands.reduce((sum, b) => sum + b.dealershipCount, 0)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* ============================================
          HEADER
          ============================================ */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/groupe" className="hover:text-indigo-600 transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Marques</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Building className="w-6 h-6 text-white" />
            </div>
            Performance par marque
          </h1>
          <p className="text-gray-500 mt-1">
            {stats.total} marques • {stats.totalDealerships} concessions • {stats.totalEmployees} collaborateurs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/groupe">
            <Button variant="outline" className="gap-2">
              <ArrowRight className="w-4 h-4 rotate-180" />
              Retour
            </Button>
          </Link>
        </div>
      </div>

      {/* ============================================
          STATS CARDS
          ============================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Chiffre d'affaires"
          value={`${(stats.totalRevenue / 1000000).toFixed(1)}M€`}
          subtitle="Consolidé groupe"
          icon={Euro}
          color="blue"
          trend={{ value: 8.5, label: "vs Y-1" }}
        />
        <StatCard
          title="Marge totale"
          value={`${(stats.totalMargin / 1000).toFixed(0)}k€`}
          subtitle={`${((stats.totalMargin / stats.totalRevenue) * 100).toFixed(1)}% de marge`}
          icon={TrendingUp}
          color="green"
          trend={{ value: 12.3, label: "vs Y-1" }}
        />
        <StatCard
          title="Objectifs atteints"
          value={stats.above}
          subtitle={`sur ${stats.total} marques`}
          icon={BadgeCheck}
          color="purple"
        />
        <StatCard
          title="Marques à risque"
          value={stats.atRisk}
          subtitle="<95% objectif"
          icon={AlertTriangle}
          color={stats.atRisk > 0 ? "red" : "green"}
        />
      </div>

      {/* ============================================
          STATUS SUMMARY
          ============================================ */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-0 shadow-premium">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-500">Total marques</p>
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

      {/* ============================================
          FILTERS & CONTROLS
          ============================================ */}
      <Card className="border-0 shadow-premium">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Rechercher une marque..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
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
                  <SelectItem value="revenue">CA</SelectItem>
                  <SelectItem value="margin">Marge</SelectItem>
                  <SelectItem value="volume">Volume</SelectItem>
                  <SelectItem value="satisfaction">Satisfaction</SelectItem>
                  <SelectItem value="growth">Croissance</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  Grille
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  Liste
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============================================
          BRANDS DISPLAY
          ============================================ */}
      {viewMode === "grid" ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rankedBrands.map((brand, index) => (
            <BrandCard 
              key={brand.id} 
              brand={brand} 
              rank={sortBy === "rank" ? index + 1 : getBrandRanking().findIndex(b => b.id === brand.id) + 1} 
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {rankedBrands.map((brand, index) => (
            <BrandRow 
              key={brand.id} 
              brand={brand} 
              rank={sortBy === "rank" ? index + 1 : getBrandRanking().findIndex(b => b.id === brand.id) + 1} 
            />
          ))}
        </div>
      )}

      {rankedBrands.length === 0 && (
        <Card className="border-0 shadow-premium">
          <CardContent className="p-12 text-center">
            <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune marque trouvée</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Essayez de modifier vos filtres de recherche
            </p>
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
