"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Users,
  TrendingUp,
  TrendingDown,
  Euro,
  Car,
  Target,
  ChevronRight,
  Trophy,
  AlertCircle,
  Clock,
  Plus,
  BarChart3,
  Percent,
  Award,
  Calendar,
  Bell,
  MessageSquare,
  CheckCircle,
  XCircle,
  Minus,
  Eye,
  Zap,
  Crown
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  currentChefVentes,
  teamMembers,
  chefVentesKPIs,
  teamChallenges,
  managerAlerts,
  performanceHistory,
  otherTeams,
  getTeamMembersAtObjective,
  getTeamMembersBelowObjective,
  getUnreadAlerts,
  TeamMember
} from "@/lib/mock-chef-ventes-data"

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
    blue: { gradient: "from-blue-500 to-blue-600", bg: "bg-blue-50", text: "text-blue-600" },
    green: { gradient: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50", text: "text-emerald-600" },
    purple: { gradient: "from-purple-500 to-purple-600", bg: "bg-purple-50", text: "text-purple-600" },
    amber: { gradient: "from-amber-500 to-orange-500", bg: "bg-amber-50", text: "text-amber-600" },
    red: { gradient: "from-red-500 to-red-600", bg: "bg-red-50", text: "text-red-600" }
  }

  const theme = colors[color]

  return (
    <Card className="border-0 shadow-premium hover:shadow-premium-lg transition-all duration-300 overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            {trend && trendValue && (
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                trend === "up" ? "bg-emerald-100 text-emerald-700" :
                trend === "down" ? "bg-red-100 text-red-700" :
                "bg-gray-100 text-gray-700"
              }`}>
                {trend === "up" ? <TrendingUp className="w-3 h-3" /> :
                 trend === "down" ? <TrendingDown className="w-3 h-3" /> :
                 <Minus className="w-3 h-3" />}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TeamMemberRow({ member, rank }: { member: TeamMember; rank: number }) {
  const objectiveRate = Math.round((member.kpis.sales / member.kpis.salesTarget) * 100)
  const hasAlerts = member.alerts.length > 0

  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl transition-colors group ${
      hasAlerts ? "bg-red-50 hover:bg-red-100" : "hover:bg-gray-50"
    }`}>
      {/* Rank */}
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
        rank === 1 ? "bg-gradient-to-br from-amber-400 to-amber-500 text-white" :
        rank === 2 ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white" :
        rank === 3 ? "bg-gradient-to-br from-orange-400 to-orange-500 text-white" :
        "bg-gray-100 text-gray-500"
      }`}>
        {rank}
      </div>

      {/* Avatar */}
      <Avatar className="h-10 w-10">
        <AvatarImage src={member.avatar} />
        <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 font-semibold text-sm">
          {member.name.split(" ").map(n => n[0]).join("")}
        </AvatarFallback>
      </Avatar>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-gray-900">{member.name}</p>
          {member.trend === "up" && <TrendingUp className="w-4 h-4 text-emerald-500" />}
          {member.trend === "down" && <TrendingDown className="w-4 h-4 text-red-500" />}
          {hasAlerts && (
            <Badge className="bg-red-500 text-white text-xs px-1.5 py-0">
              {member.alerts.length}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1">
          <Progress
            value={objectiveRate}
            className={`h-1.5 w-24 ${objectiveRate >= 100 ? "[&>div]:bg-emerald-500" : objectiveRate >= 70 ? "[&>div]:bg-blue-500" : "[&>div]:bg-red-500"}`}
          />
          <span className="text-xs text-gray-500">
            {member.kpis.sales}/{member.kpis.salesTarget} ventes ({objectiveRate}%)
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-6">
        <div className="text-center">
          <p className="text-xs text-gray-500">Marge</p>
          <p className="font-semibold text-gray-900">{member.kpis.margin.toLocaleString()}€</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Financement</p>
          <p className={`font-semibold ${member.kpis.financingRate >= 75 ? "text-emerald-600" : "text-red-600"}`}>
            {member.kpis.financingRate}%
          </p>
        </div>
      </div>

      {/* Actions */}
      <Link href={`/chef-ventes/equipe/${member.id}`}>
        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Eye className="w-4 h-4 mr-1" />
          Détails
        </Button>
      </Link>
    </div>
  )
}

function AlertCard({ alert }: { alert: typeof managerAlerts[0] }) {
  const severityStyles = {
    critical: "border-red-200 bg-red-50",
    warning: "border-amber-200 bg-amber-50",
    info: "border-blue-200 bg-blue-50"
  }

  const severityIcons = {
    critical: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-500" />,
    info: <CheckCircle className="w-5 h-5 text-blue-500" />
  }

  return (
    <div className={`p-4 rounded-xl border ${severityStyles[alert.severity]} ${!alert.isRead ? "ring-2 ring-offset-2 ring-gray-200" : ""}`}>
      <div className="flex items-start gap-3">
        {severityIcons[alert.severity]}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900">{alert.title}</p>
          <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
          <p className="text-xs text-gray-400 mt-2">
            {new Date(alert.createdAt).toLocaleString("fr-FR", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </p>
        </div>
        {alert.targetUserId && (
          <Link href={`/chef-ventes/equipe/${alert.targetUserId}`}>
            <Button variant="outline" size="sm">
              Voir
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}

function ChallengeCard({ challenge }: { challenge: typeof teamChallenges[0] }) {
  const progress = Math.round(
    (challenge.participants.reduce((sum, p) => sum + p.currentScore, 0) / challenge.target) * 100
  )

  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{challenge.title}</h4>
          <p className="text-sm text-gray-500 mt-1">{challenge.description}</p>
        </div>
        <Badge className="bg-indigo-100 text-indigo-700">
          {challenge.reward.type === "bonus" ? `${challenge.reward.value}€` :
           challenge.reward.type === "points" ? `${challenge.reward.value} pts` :
           challenge.reward.badgeName}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Progression</span>
          <span className="font-semibold text-gray-900">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="flex items-center justify-between mt-3">
        <p className="text-xs text-gray-500">
          <Calendar className="w-3 h-3 inline mr-1" />
          Fin le {new Date(challenge.endDate).toLocaleDateString("fr-FR")}
        </p>
        <Link href="/chef-ventes/challenges">
          <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">
            Détails
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function ChefVentesDashboard() {
  const [tab, setTab] = useState<"overview" | "alerts" | "challenges">("overview")

  const membersAtObjective = getTeamMembersAtObjective()
  const membersBelowObjective = getTeamMembersBelowObjective()
  const unreadAlerts = getUnreadAlerts()
  const activeChallenges = teamChallenges.filter(c => c.status === "active")

  const teamObjectiveRate = chefVentesKPIs.objectiveRate
  const daysRemaining = 9 // Mock - jours restants dans le mois

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* ============================================
          HEADER
          ============================================ */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Crown className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Bonjour, {currentChefVentes.fullName.split(" ")[0]} !
            </h1>
            <p className="text-gray-500">
              Chef des Ventes {currentChefVentes.teamType} • Ford Paris Est
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/chef-ventes/rapports">
            <Button variant="outline" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Rapports
            </Button>
          </Link>
          <Link href="/chef-ventes/challenges/new">
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25 gap-2">
              <Plus className="w-4 h-4" />
              Nouveau challenge
            </Button>
          </Link>
        </div>
      </div>

      {/* ============================================
          ALERT BANNER (si objectif en danger)
          ============================================ */}
      {teamObjectiveRate < 80 && (
        <Card className="border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-1">
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-white">
                    <p className="font-bold text-lg">Objectif mensuel en danger !</p>
                    <p className="text-white/80">
                      {chefVentesKPIs.teamSales}/{chefVentesKPIs.teamSalesTarget} ventes ({teamObjectiveRate}%) •
                      {" "}{chefVentesKPIs.teamSalesTarget - chefVentesKPIs.teamSales} ventes restantes •
                      {" "}{daysRemaining} jours
                    </p>
                  </div>
                </div>
                <Link href="/chef-ventes/equipe">
                  <Button className="bg-white text-orange-600 hover:bg-white/90 font-semibold">
                    Voir l&apos;équipe
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* ============================================
          STATS GRID
          ============================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Ventes équipe"
          value={`${chefVentesKPIs.teamSales}/${chefVentesKPIs.teamSalesTarget}`}
          subtitle={`${teamObjectiveRate}% de l'objectif`}
          icon={Car}
          trend={teamObjectiveRate >= 100 ? "up" : teamObjectiveRate >= 80 ? "stable" : "down"}
          trendValue={teamObjectiveRate >= 100 ? "Objectif atteint !" : `${chefVentesKPIs.teamSalesTarget - chefVentesKPIs.teamSales} restantes`}
          color={teamObjectiveRate >= 100 ? "green" : teamObjectiveRate >= 80 ? "blue" : "amber"}
        />
        <StatCard
          title="Marge totale"
          value={`${(chefVentesKPIs.teamMargin / 1000).toFixed(1)}k€`}
          subtitle={`GPU moyen: ${chefVentesKPIs.teamGPU}€`}
          icon={Euro}
          trend="up"
          trendValue="+8% vs M-1"
          color="green"
        />
        <StatCard
          title="Taux financement"
          value={`${chefVentesKPIs.teamFinancingRate}%`}
          subtitle="Cible: 75%"
          icon={Percent}
          trend={chefVentesKPIs.teamFinancingRate >= 75 ? "up" : "down"}
          trendValue={chefVentesKPIs.teamFinancingRate >= 75 ? "Au-dessus cible" : "Sous cible"}
          color={chefVentesKPIs.teamFinancingRate >= 75 ? "green" : "amber"}
        />
        <StatCard
          title="Équipe"
          value={`${membersAtObjective.length}/${chefVentesKPIs.teamSize}`}
          subtitle="Commerciaux à objectif"
          icon={Users}
          trend={membersAtObjective.length >= chefVentesKPIs.teamSize * 0.7 ? "up" : "down"}
          trendValue={membersBelowObjective.length > 0 ? `${membersBelowObjective.length} en difficulté` : "Tous OK !"}
          color={membersAtObjective.length >= chefVentesKPIs.teamSize * 0.7 ? "green" : "red"}
        />
      </div>

      {/* ============================================
          OBJECTIF PROGRESS
          ============================================ */}
      <Card className="border-0 shadow-premium">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                Progression vers l&apos;objectif mensuel
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Février 2024 • {daysRemaining} jours restants
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={`h-8 px-4 text-base ${
                teamObjectiveRate >= 100
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}>
                {teamObjectiveRate >= 100 ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1.5" />
                    Objectif atteint !
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 mr-1.5" />
                    {chefVentesKPIs.teamSalesTarget - chefVentesKPIs.teamSales} ventes restantes
                  </>
                )}
              </Badge>
              {chefVentesKPIs.constructorBonusEstimate > 0 && (
                <Badge className="bg-amber-100 text-amber-700 h-8 px-4">
                  <Trophy className="w-4 h-4 mr-1.5" />
                  Prime estimée: {chefVentesKPIs.constructorBonusEstimate.toLocaleString()}€
                </Badge>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  teamObjectiveRate >= 100 ? "bg-gradient-to-r from-emerald-500 to-emerald-600" :
                  teamObjectiveRate >= 80 ? "bg-gradient-to-r from-blue-500 to-indigo-500" :
                  "bg-gradient-to-r from-amber-500 to-orange-500"
                }`}
                style={{ width: `${Math.min(teamObjectiveRate, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-gray-500">0 ventes</span>
              <span className="font-semibold text-gray-900">{teamObjectiveRate}%</span>
              <span className="text-gray-500">{chefVentesKPIs.teamSalesTarget} ventes</span>
            </div>
          </div>

          {/* Comparison with other teams */}
          <div className="mt-6 pt-4 border-t">
            <p className="text-sm font-medium text-gray-500 mb-3">Comparaison avec les autres équipes</p>
            <div className="flex items-center gap-4">
              {[
                { type: "VN", rate: teamObjectiveRate, isCurrentTeam: true },
                ...otherTeams.map(t => ({ type: t.type, rate: t.objectiveRate, isCurrentTeam: false }))
              ].sort((a, b) => b.rate - a.rate).map((team, i) => (
                <div
                  key={team.type}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    team.isCurrentTeam ? "bg-indigo-100 ring-2 ring-indigo-500" : "bg-gray-100"
                  }`}
                >
                  <span className={`font-bold text-sm ${i === 0 ? "text-amber-600" : "text-gray-600"}`}>
                    #{i + 1}
                  </span>
                  <span className={`font-semibold ${team.isCurrentTeam ? "text-indigo-700" : "text-gray-700"}`}>
                    {team.type}
                  </span>
                  <span className="text-sm text-gray-500">{team.rate}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============================================
          TABS: ÉQUIPE / ALERTES / CHALLENGES
          ============================================ */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="bg-gray-100 p-1">
          <TabsTrigger value="overview" className="gap-2">
            <Users className="w-4 h-4" />
            Équipe
          </TabsTrigger>
          <TabsTrigger value="alerts" className="gap-2 relative">
            <Bell className="w-4 h-4" />
            Alertes
            {unreadAlerts.length > 0 && (
              <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs h-5 w-5 p-0 flex items-center justify-center">
                {unreadAlerts.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="challenges" className="gap-2">
            <Zap className="w-4 h-4" />
            Challenges ({activeChallenges.length})
          </TabsTrigger>
        </TabsList>

        {/* ÉQUIPE TAB */}
        <TabsContent value="overview" className="mt-6">
          <Card className="border-0 shadow-premium">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  Performance de l&apos;équipe
                </CardTitle>
                <CardDescription>
                  {chefVentesKPIs.teamSize} commerciaux • Classés par ventes
                </CardDescription>
              </div>
              <Link href="/chef-ventes/equipe">
                <Button variant="ghost" className="gap-1">
                  Voir tout
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {teamMembers
                  .sort((a, b) => a.kpis.ranking - b.kpis.ranking)
                  .map((member, index) => (
                    <TeamMemberRow key={member.id} member={member} rank={index + 1} />
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ALERTES TAB */}
        <TabsContent value="alerts" className="mt-6">
          <Card className="border-0 shadow-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                Alertes et notifications
              </CardTitle>
              <CardDescription>
                {unreadAlerts.length} non lue{unreadAlerts.length > 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {managerAlerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CHALLENGES TAB */}
        <TabsContent value="challenges" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {activeChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
          {activeChallenges.length === 0 && (
            <Card className="p-12 text-center">
              <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucun challenge actif</p>
              <p className="text-gray-400 mt-1 mb-4">
                Créez un challenge pour motiver votre équipe !
              </p>
              <Link href="/chef-ventes/challenges/new">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 gap-2">
                  <Plus className="w-4 h-4" />
                  Créer un challenge
                </Button>
              </Link>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* ============================================
          QUICK ACTIONS
          ============================================ */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/chef-ventes/equipe">
          <Card className="border-0 shadow-premium hover:shadow-premium-lg transition-all duration-300 cursor-pointer group h-full">
            <CardContent className="p-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Voir l&apos;équipe</h3>
              <p className="text-sm text-gray-500 mt-1">Performance détaillée par commercial</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/chef-ventes/challenges/new">
          <Card className="border-0 shadow-premium hover:shadow-premium-lg transition-all duration-300 cursor-pointer group h-full">
            <CardContent className="p-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Créer un challenge</h3>
              <p className="text-sm text-gray-500 mt-1">Motivez votre équipe avec un défi</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/chef-ventes/rapports">
          <Card className="border-0 shadow-premium hover:shadow-premium-lg transition-all duration-300 cursor-pointer group h-full">
            <CardContent className="p-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Rapports</h3>
              <p className="text-sm text-gray-500 mt-1">Analysez les performances</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/chef-ventes/coaching">
          <Card className="border-0 shadow-premium hover:shadow-premium-lg transition-all duration-300 cursor-pointer group h-full">
            <CardContent className="p-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Coaching</h3>
              <p className="text-sm text-gray-500 mt-1">Notes et feedback équipe</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
