"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  Euro,
  Car,
  Target,
  ChevronRight,
  Trophy,
  AlertCircle,
  Percent,
  Award,
  Eye,
  MessageSquare,
  Zap,
  Crown,
  ArrowLeft,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Star,
  Flame,
  ThumbsUp,
  Clock,
  Calendar,
  Mail,
  Phone,
  BarChart3,
  CheckCircle,
  XCircle
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  currentChefVentes,
  teamMembers,
  chefVentesKPIs,
  coachingNotes,
  getTeamMembersAtObjective,
  getTeamMembersBelowObjective,
  TeamMember
} from "@/lib/mock-chef-ventes-data"

// ============================================
// TYPES
// ============================================

type SortField = "ranking" | "sales" | "margin" | "financing" | "name"
type SortOrder = "asc" | "desc"
type FilterStatus = "all" | "at_objective" | "below_objective" | "in_danger"

// ============================================
// COMPONENTS
// ============================================

function KPIBadge({
  label,
  value,
  target,
  unit = "",
  isPercentage = false,
  inverseColor = false
}: {
  label: string
  value: number
  target?: number
  unit?: string
  isPercentage?: boolean
  inverseColor?: boolean
}) {
  let color = "bg-gray-100 text-gray-700"

  if (target !== undefined) {
    const rate = (value / target) * 100
    if (rate >= 100) color = "bg-emerald-100 text-emerald-700"
    else if (rate >= 80) color = "bg-blue-100 text-blue-700"
    else if (rate >= 60) color = "bg-amber-100 text-amber-700"
    else color = "bg-red-100 text-red-700"

    if (inverseColor) {
      if (rate >= 100) color = "bg-red-100 text-red-700"
      else if (rate >= 80) color = "bg-amber-100 text-amber-700"
      else color = "bg-emerald-100 text-emerald-700"
    }
  } else if (isPercentage) {
    if (value >= 80) color = "bg-emerald-100 text-emerald-700"
    else if (value >= 70) color = "bg-blue-100 text-blue-700"
    else if (value >= 60) color = "bg-amber-100 text-amber-700"
    else color = "bg-red-100 text-red-700"
  }

  return (
    <div className="text-center">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <Badge className={`${color} font-semibold`}>
        {value.toLocaleString()}{unit}{isPercentage ? "%" : ""}
        {target !== undefined && <span className="opacity-70">/{target}</span>}
      </Badge>
    </div>
  )
}

function TeamMemberCard({ member, rank }: { member: TeamMember; rank: number }) {
  const objectiveRate = Math.round((member.kpis.sales / member.kpis.salesTarget) * 100)
  const hasAlerts = member.alerts.length > 0
  const hasCriticalAlert = member.alerts.some(a => a.severity === "critical")
  const memberNotes = coachingNotes.filter(n => n.commercialId === member.id)

  // Calculate days since joined
  const joinedDate = new Date(member.joinedAt)
  const now = new Date()
  const monthsSinceJoined = Math.floor((now.getTime() - joinedDate.getTime()) / (1000 * 60 * 60 * 24 * 30))

  return (
    <Card className={`border-0 shadow-premium hover:shadow-premium-lg transition-all duration-300 overflow-hidden ${
      hasCriticalAlert ? "ring-2 ring-red-400" : hasAlerts ? "ring-1 ring-amber-300" : ""
    }`}>
      {/* Rank ribbon */}
      {rank <= 3 && (
        <div className={`absolute top-0 right-0 w-16 h-16 ${
          rank === 1 ? "bg-gradient-to-bl from-amber-400 to-amber-500" :
          rank === 2 ? "bg-gradient-to-bl from-gray-300 to-gray-400" :
          "bg-gradient-to-bl from-orange-400 to-orange-500"
        } flex items-start justify-end p-2 rounded-bl-3xl`}>
          <span className="text-white font-bold text-lg">#{rank}</span>
        </div>
      )}

      <CardContent className="p-6">
        {/* Header: Avatar + Info */}
        <div className="flex items-start gap-4 mb-5">
          <div className="relative">
            <Avatar className="h-16 w-16 ring-4 ring-white shadow-lg">
              <AvatarImage src={member.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-lg">
                {member.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            {/* Trend indicator */}
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
              member.trend === "up" ? "bg-emerald-500" :
              member.trend === "down" ? "bg-red-500" :
              "bg-gray-400"
            }`}>
              {member.trend === "up" ? <TrendingUp className="w-3 h-3 text-white" /> :
               member.trend === "down" ? <TrendingDown className="w-3 h-3 text-white" /> :
               <Minus className="w-3 h-3 text-white" />}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-lg text-gray-900">{member.name}</h3>
              {rank > 3 && (
                <Badge variant="outline" className="text-xs">#{rank}</Badge>
              )}
              {member.kpis.streak >= 5 && (
                <Badge className="bg-orange-100 text-orange-700">
                  <Flame className="w-3 h-3 mr-1" />
                  {member.kpis.streak} jours
                </Badge>
              )}
              {hasAlerts && (
                <Badge className={hasCriticalAlert ? "bg-red-500 text-white" : "bg-amber-500 text-white"}>
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {member.alerts.length}
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Commercial VN • Depuis {joinedDate.toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}
              {monthsSinceJoined < 6 && (
                <Badge className="ml-2 bg-purple-100 text-purple-700 text-xs">Nouveau</Badge>
              )}
            </p>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
              <Mail className="w-3 h-3" />
              {member.email}
            </p>
          </div>
        </div>

        {/* Objective progress */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Target className="w-4 h-4" />
              Objectif mensuel
            </span>
            <span className={`text-sm font-bold ${
              objectiveRate >= 100 ? "text-emerald-600" :
              objectiveRate >= 80 ? "text-blue-600" :
              objectiveRate >= 60 ? "text-amber-600" :
              "text-red-600"
            }`}>
              {member.kpis.sales}/{member.kpis.salesTarget} ventes ({objectiveRate}%)
            </span>
          </div>
          <div className="relative">
            <Progress
              value={Math.min(objectiveRate, 100)}
              className={`h-3 ${
                objectiveRate >= 100 ? "[&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-emerald-600" :
                objectiveRate >= 80 ? "[&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-indigo-500" :
                objectiveRate >= 60 ? "[&>div]:bg-gradient-to-r [&>div]:from-amber-500 [&>div]:to-orange-500" :
                "[&>div]:bg-gradient-to-r [&>div]:from-red-500 [&>div]:to-red-600"
              }`}
            />
            {objectiveRate >= 100 && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              </div>
            )}
          </div>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-4 gap-3 mb-5 p-3 bg-gray-50 rounded-xl">
          <KPIBadge label="Marge" value={member.kpis.margin} unit="€" />
          <KPIBadge label="GPU" value={member.kpis.gpu} unit="€" />
          <KPIBadge label="Financement" value={member.kpis.financingRate} isPercentage />
          <KPIBadge label="Conversion" value={member.kpis.conversionRate} isPercentage />
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-500">CA</p>
            <p className="font-bold text-blue-700">{(member.kpis.revenue / 1000).toFixed(0)}k€</p>
          </div>
          <div className="text-center p-2 bg-purple-50 rounded-lg">
            <p className="text-xs text-gray-500">Accessoires</p>
            <p className="font-bold text-purple-700">{member.kpis.accessories}€</p>
          </div>
          <div className="text-center p-2 bg-emerald-50 rounded-lg">
            <p className="text-xs text-gray-500">Satisfaction</p>
            <p className="font-bold text-emerald-700">{member.kpis.satisfaction}%</p>
          </div>
        </div>

        {/* Points & Ranking */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl mb-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-gray-900">{member.kpis.points.toLocaleString()} pts</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-indigo-600" />
            <span className="text-sm text-gray-600">
              #{member.kpis.ranking}/{member.kpis.rankingTotal} équipe
            </span>
          </div>
        </div>

        {/* Alerts preview */}
        {hasAlerts && (
          <div className={`p-3 rounded-xl mb-4 ${hasCriticalAlert ? "bg-red-50 border border-red-200" : "bg-amber-50 border border-amber-200"}`}>
            <p className={`text-sm font-semibold ${hasCriticalAlert ? "text-red-700" : "text-amber-700"}`}>
              {member.alerts[0].title}
            </p>
            <p className="text-xs text-gray-600 mt-1">{member.alerts[0].message}</p>
          </div>
        )}

        {/* Coaching notes preview */}
        {memberNotes.length > 0 && (
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">
                {memberNotes.length} note{memberNotes.length > 1 ? "s" : ""} de coaching
              </span>
            </div>
            <p className="text-xs text-gray-600 line-clamp-2">{memberNotes[0].content}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link href={`/chef-ventes/equipe/${member.id}`} className="flex-1">
            <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              <Eye className="w-4 h-4 mr-2" />
              Voir détails
            </Button>
          </Link>
          <Link href={`/chef-ventes/coaching?user=${member.id}`}>
            <Button variant="outline" size="icon" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
              <MessageSquare className="w-4 h-4" />
            </Button>
          </Link>
          <Link href={`/chef-ventes/challenges/new?target=${member.id}`}>
            <Button variant="outline" size="icon" className="border-purple-200 text-purple-600 hover:bg-purple-50">
              <Zap className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

function TeamSummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "blue"
}: {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ElementType
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
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{title}</p>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
    </div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function EquipePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<SortField>("ranking")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")

  const membersAtObjective = getTeamMembersAtObjective()
  const membersBelowObjective = getTeamMembersBelowObjective()
  const membersInDanger = teamMembers.filter(m => (m.kpis.sales / m.kpis.salesTarget) < 0.6)

  // Filter and sort members
  const filteredAndSortedMembers = useMemo(() => {
    let result = [...teamMembers]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(m =>
        m.name.toLowerCase().includes(query) ||
        m.email.toLowerCase().includes(query)
      )
    }

    // Apply status filter
    if (filterStatus === "at_objective") {
      result = result.filter(m => m.kpis.sales >= m.kpis.salesTarget)
    } else if (filterStatus === "below_objective") {
      result = result.filter(m => m.kpis.sales < m.kpis.salesTarget)
    } else if (filterStatus === "in_danger") {
      result = result.filter(m => (m.kpis.sales / m.kpis.salesTarget) < 0.6)
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case "ranking":
          comparison = a.kpis.ranking - b.kpis.ranking
          break
        case "sales":
          comparison = b.kpis.sales - a.kpis.sales
          break
        case "margin":
          comparison = b.kpis.margin - a.kpis.margin
          break
        case "financing":
          comparison = b.kpis.financingRate - a.kpis.financingRate
          break
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

    return result
  }, [searchQuery, sortField, sortOrder, filterStatus])

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
            <span className="text-gray-900 font-medium">Mon équipe</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Users className="w-6 h-6 text-white" />
            </div>
            Mon équipe VN
          </h1>
          <p className="text-gray-500 mt-1">
            {chefVentesKPIs.teamSize} commerciaux • Ford Paris Est
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/chef-ventes">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
          </Link>
          <Link href="/chef-ventes/challenges/new">
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25 gap-2">
              <Zap className="w-4 h-4" />
              Nouveau challenge
            </Button>
          </Link>
        </div>
      </div>

      {/* ============================================
          TEAM SUMMARY
          ============================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <TeamSummaryCard
          title="Total commerciaux"
          value={chefVentesKPIs.teamSize}
          icon={Users}
          color="blue"
        />
        <TeamSummaryCard
          title="À objectif"
          value={membersAtObjective.length}
          subtitle={`${Math.round((membersAtObjective.length / chefVentesKPIs.teamSize) * 100)}%`}
          icon={CheckCircle}
          color="green"
        />
        <TeamSummaryCard
          title="Sous objectif"
          value={membersBelowObjective.length}
          subtitle={`${Math.round((membersBelowObjective.length / chefVentesKPIs.teamSize) * 100)}%`}
          icon={AlertCircle}
          color="amber"
        />
        <TeamSummaryCard
          title="En danger"
          value={membersInDanger.length}
          subtitle="<60% objectif"
          icon={XCircle}
          color="red"
        />
        <TeamSummaryCard
          title="Ventes équipe"
          value={`${chefVentesKPIs.teamSales}/${chefVentesKPIs.teamSalesTarget}`}
          subtitle={`${chefVentesKPIs.objectiveRate}%`}
          icon={Car}
          color="purple"
        />
      </div>

      {/* ============================================
          FILTERS & SEARCH
          ============================================ */}
      <Card className="border-0 shadow-premium">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher un commercial..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter by status */}
            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as FilterStatus)}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrer par..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous ({teamMembers.length})</SelectItem>
                <SelectItem value="at_objective">À objectif ({membersAtObjective.length})</SelectItem>
                <SelectItem value="below_objective">Sous objectif ({membersBelowObjective.length})</SelectItem>
                <SelectItem value="in_danger">En danger ({membersInDanger.length})</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortField} onValueChange={(v) => setSortField(v as SortField)}>
              <SelectTrigger className="w-full sm:w-48">
                {sortOrder === "asc" ? <SortAsc className="w-4 h-4 mr-2" /> : <SortDesc className="w-4 h-4 mr-2" />}
                <SelectValue placeholder="Trier par..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ranking">Classement</SelectItem>
                <SelectItem value="sales">Ventes</SelectItem>
                <SelectItem value="margin">Marge</SelectItem>
                <SelectItem value="financing">Financement</SelectItem>
                <SelectItem value="name">Nom</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ============================================
          TEAM MEMBERS GRID
          ============================================ */}
      {filteredAndSortedMembers.length > 0 ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAndSortedMembers.map((member, index) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              rank={sortField === "ranking" ? member.kpis.ranking : index + 1}
            />
          ))}
        </div>
      ) : (
        <Card className="border-0 shadow-premium">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aucun commercial trouvé</p>
            <p className="text-gray-400 mt-1">
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

      {/* ============================================
          BULK ACTIONS
          ============================================ */}
      <Card className="border-0 shadow-premium sticky bottom-4">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-indigo-100 text-indigo-700">
                {filteredAndSortedMembers.length} commercial{filteredAndSortedMembers.length > 1 ? "s" : ""}
              </Badge>
              <span className="text-sm text-gray-500">affichés</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/chef-ventes/coaching">
                <Button variant="outline" className="gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Notes de coaching
                </Button>
              </Link>
              <Link href="/chef-ventes/rapports">
                <Button variant="outline" className="gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Rapport d&apos;équipe
                </Button>
              </Link>
              <Link href="/chef-ventes/challenges/new">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 gap-2">
                  <Zap className="w-4 h-4" />
                  Challenge équipe
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
