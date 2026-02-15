"use client"

import { useState } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import {
  User,
  ChevronRight,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  Euro,
  Car,
  Target,
  Trophy,
  Award,
  Percent,
  Star,
  Flame,
  Calendar,
  Mail,
  Clock,
  MessageSquare,
  Zap,
  CheckCircle,
  AlertCircle,
  BarChart3,
  ThumbsUp,
  Plus
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  teamMembers,
  coachingNotes,
  teamChallenges,
  getTeamMemberById
} from "@/lib/mock-chef-ventes-data"

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
    blue: { gradient: "from-blue-500 to-blue-600", bg: "bg-blue-50", text: "text-blue-600" },
    green: { gradient: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50", text: "text-emerald-600" },
    purple: { gradient: "from-purple-500 to-purple-600", bg: "bg-purple-50", text: "text-purple-600" },
    amber: { gradient: "from-amber-500 to-orange-500", bg: "bg-amber-50", text: "text-amber-600" },
    red: { gradient: "from-red-500 to-red-600", bg: "bg-red-50", text: "text-red-600" }
  }

  const theme = colors[color]

  return (
    <Card className="border-0 shadow-premium">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-lg`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        {progress !== undefined && (
          <div className="space-y-1">
            <Progress value={Math.min(progress, 100)} className={`h-2 ${
              progress >= 100 ? "[&>div]:bg-emerald-500" :
              progress >= 80 ? "[&>div]:bg-blue-500" :
              progress >= 60 ? "[&>div]:bg-amber-500" :
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

function PerformanceHistoryMock() {
  const months = ["Sep", "Oct", "Nov", "Déc", "Jan", "Fév"]
  const sales = [6, 8, 7, 10, 9, 8]
  const targets = [8, 8, 8, 10, 10, 10]
  const maxValue = Math.max(...sales, ...targets)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-500" />
          <span className="text-sm text-gray-600">Réalisé</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-300" />
          <span className="text-sm text-gray-600">Objectif</span>
        </div>
      </div>

      <div className="flex items-end gap-3 h-32">
        {months.map((month, index) => {
          const salesHeight = (sales[index] / maxValue) * 100
          const targetHeight = (targets[index] / maxValue) * 100
          const achieved = sales[index] >= targets[index]

          return (
            <div key={month} className="flex-1 flex flex-col items-center gap-1">
              <div className="relative w-full h-24 flex items-end justify-center gap-1">
                <div
                  className="w-4 bg-gray-200 rounded-t-sm"
                  style={{ height: `${targetHeight}%` }}
                />
                <div
                  className={`w-4 rounded-t-sm ${
                    achieved ? "bg-emerald-500" : "bg-indigo-500"
                  }`}
                  style={{ height: `${salesHeight}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">{month}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CoachingNoteCard({ note }: { note: typeof coachingNotes[0] }) {
  const typeConfig = {
    feedback: { icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-100" },
    objective: { icon: Target, color: "text-purple-600", bg: "bg-purple-100" },
    action: { icon: Zap, color: "text-amber-600", bg: "bg-amber-100" },
    meeting: { icon: Calendar, color: "text-emerald-600", bg: "bg-emerald-100" }
  }

  const config = typeConfig[note.type]
  const Icon = config.icon

  return (
    <div className="flex gap-4 p-4 rounded-xl bg-gray-50 border">
      <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${config.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge className={`${config.bg} ${config.color} text-xs`}>
            {note.type === "feedback" ? "Feedback" :
             note.type === "objective" ? "Objectif" :
             note.type === "action" ? "Action" : "Réunion"}
          </Badge>
          <span className="text-xs text-gray-500">
            {new Date(note.createdAt).toLocaleDateString("fr-FR")}
          </span>
        </div>
        <p className="text-sm text-gray-700">{note.content}</p>
      </div>
    </div>
  )
}

function ChallengeCard({ challenge, memberId }: { challenge: typeof teamChallenges[0], memberId: string }) {
  const participant = challenge.participants.find(p => p.id === memberId)
  if (!participant) return null

  const progress = Math.min(Math.round(participant.progressRate), 100)

  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{challenge.title}</h4>
          <p className="text-sm text-gray-500 mt-1">{challenge.description}</p>
        </div>
        {participant.isCompleted ? (
          <Badge className="bg-emerald-100 text-emerald-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            Complété
          </Badge>
        ) : (
          <Badge className="bg-indigo-100 text-indigo-700">
            En cours
          </Badge>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            {participant.currentScore}/{participant.targetScore} {challenge.targetUnit}
          </span>
          <span className="font-semibold text-gray-900">{progress}%</span>
        </div>
        <Progress value={progress} className={`h-2 ${
          participant.isCompleted ? "[&>div]:bg-emerald-500" : "[&>div]:bg-indigo-500"
        }`} />
      </div>

      <p className="text-xs text-gray-500 mt-3">
        <Calendar className="w-3 h-3 inline mr-1" />
        Fin le {new Date(challenge.endDate).toLocaleDateString("fr-FR")}
      </p>
    </div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

export function CommercialDetailContent({ id }: { id: string }) {
  const memberId = id
  const member = getTeamMemberById(memberId)

  if (!member) {
    notFound()
  }

  const [tab, setTab] = useState<"performance" | "coaching" | "challenges">("performance")

  const memberNotes = coachingNotes.filter(n => n.commercialId === memberId)
  const memberChallenges = teamChallenges.filter(c =>
    c.participants.some(p => p.id === memberId)
  )
  const completedChallenges = memberChallenges.filter(c =>
    c.participants.find(p => p.id === memberId)?.isCompleted
  )

  const objectiveRate = Math.round((member.kpis.sales / member.kpis.salesTarget) * 100)
  const joinedDate = new Date(member.joinedAt)
  const monthsSinceJoined = Math.floor((new Date().getTime() - joinedDate.getTime()) / (1000 * 60 * 60 * 24 * 30))

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* ============================================
          HEADER
          ============================================ */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/chef-ventes" className="hover:text-indigo-600 transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/chef-ventes/equipe" className="hover:text-indigo-600 transition-colors">
              Équipe
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{member.name}</span>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative">
              <Avatar className="h-20 w-20 ring-4 ring-white shadow-xl">
                <AvatarImage src={member.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-2xl">
                  {member.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center ${
                member.trend === "up" ? "bg-emerald-500" :
                member.trend === "down" ? "bg-red-500" :
                "bg-gray-400"
              }`}>
                {member.trend === "up" ? <TrendingUp className="w-4 h-4 text-white" /> :
                 member.trend === "down" ? <TrendingDown className="w-4 h-4 text-white" /> :
                 <Minus className="w-4 h-4 text-white" />}
              </div>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                {member.name}
                {member.kpis.ranking <= 3 && (
                  <Badge className={`${
                    member.kpis.ranking === 1 ? "bg-amber-500" :
                    member.kpis.ranking === 2 ? "bg-gray-400" :
                    "bg-orange-500"
                  } text-white`}>
                    <Trophy className="w-3 h-3 mr-1" />
                    #{member.kpis.ranking}
                  </Badge>
                )}
              </h1>
              <p className="text-gray-500 mt-1">
                Commercial VN • Depuis {joinedDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                {monthsSinceJoined < 6 && (
                  <Badge className="ml-2 bg-purple-100 text-purple-700 text-xs">Nouveau</Badge>
                )}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {member.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/chef-ventes/equipe">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
          </Link>
          <Link href={`/chef-ventes/coaching?user=${memberId}`}>
            <Button variant="outline" className="gap-2 border-amber-200 text-amber-700 hover:bg-amber-50">
              <MessageSquare className="w-4 h-4" />
              Note coaching
            </Button>
          </Link>
          <Link href={`/chef-ventes/challenges/new?target=${memberId}`}>
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
      {member.alerts.length > 0 && (
        <Card className="border-0 overflow-hidden">
          <div className={`${
            member.alerts.some(a => a.severity === "critical")
              ? "bg-gradient-to-r from-red-500 to-red-600"
              : "bg-gradient-to-r from-amber-500 to-orange-500"
          } p-4`}>
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-white flex-shrink-0" />
              <div className="text-white">
                <p className="font-bold">{member.alerts[0].title}</p>
                <p className="text-white/80 text-sm mt-1">{member.alerts[0].message}</p>
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
                  {member.kpis.salesTarget - member.kpis.sales} ventes restantes
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
                    objectiveRate >= 80 ? "bg-gradient-to-r from-blue-500 to-indigo-500" :
                    objectiveRate >= 60 ? "bg-gradient-to-r from-amber-500 to-orange-500" :
                    "bg-gradient-to-r from-red-500 to-red-600"
                  }`}
                  style={{ width: `${Math.min(objectiveRate, 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-gray-500">0 ventes</span>
                <span className="font-semibold text-gray-900">
                  {member.kpis.sales}/{member.kpis.salesTarget} ({objectiveRate}%)
                </span>
                <span className="text-gray-500">{member.kpis.salesTarget} ventes</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============================================
          KPI GRID
          ============================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Ventes"
          value={`${member.kpis.sales}/${member.kpis.salesTarget}`}
          subtitle={`${objectiveRate}% de l'objectif`}
          icon={Car}
          color={objectiveRate >= 100 ? "green" : objectiveRate >= 80 ? "blue" : "amber"}
          progress={objectiveRate}
          target={member.kpis.salesTarget}
        />
        <StatCard
          title="Marge totale"
          value={`${(member.kpis.margin / 1000).toFixed(1)}k€`}
          subtitle={`GPU: ${member.kpis.gpu}€`}
          icon={Euro}
          color="green"
        />
        <StatCard
          title="Financement"
          value={`${member.kpis.financingRate}%`}
          subtitle="Cible: 75%"
          icon={Percent}
          color={member.kpis.financingRate >= 75 ? "green" : "amber"}
          progress={Math.round((member.kpis.financingRate / 75) * 100)}
          target={75}
        />
        <StatCard
          title="Conversion"
          value={`${member.kpis.conversionRate}%`}
          subtitle={`Satisfaction: ${member.kpis.satisfaction}%`}
          icon={ThumbsUp}
          color={member.kpis.conversionRate >= 25 ? "green" : "amber"}
        />
      </div>

      {/* ============================================
          GAMIFICATION
          ============================================ */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-premium">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg">
                <Star className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Points totaux</p>
                <p className="text-2xl font-bold text-gray-900">{member.kpis.points.toLocaleString()}</p>
                <p className="text-xs text-amber-600">
                  #{member.kpis.ranking}/{member.kpis.rankingTotal} du classement
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-premium">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Flame className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Série actuelle</p>
                <p className="text-2xl font-bold text-gray-900">{member.kpis.streak} jours</p>
                <p className="text-xs text-orange-600">
                  Ventes consécutives
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-premium">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center shadow-lg">
                <Award className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Challenges</p>
                <p className="text-2xl font-bold text-gray-900">{completedChallenges.length}/{memberChallenges.length}</p>
                <p className="text-xs text-purple-600">
                  Complétés
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ============================================
          TABS
          ============================================ */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="bg-gray-100 p-1">
          <TabsTrigger value="performance" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="coaching" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            Coaching ({memberNotes.length})
          </TabsTrigger>
          <TabsTrigger value="challenges" className="gap-2">
            <Zap className="w-4 h-4" />
            Challenges ({memberChallenges.length})
          </TabsTrigger>
        </TabsList>

        {/* PERFORMANCE TAB */}
        <TabsContent value="performance" className="mt-6">
          <Card className="border-0 shadow-premium">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                Historique des ventes
              </CardTitle>
              <CardDescription>Évolution sur les 6 derniers mois</CardDescription>
            </CardHeader>
            <CardContent>
              <PerformanceHistoryMock />
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <Card className="border-0 shadow-premium">
              <CardHeader>
                <CardTitle className="text-lg">Détail des KPIs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-500">Chiffre d&apos;affaires</span>
                  <span className="font-semibold">{member.kpis.revenue.toLocaleString()}€</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-500">Marge totale</span>
                  <span className="font-semibold">{member.kpis.margin.toLocaleString()}€</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-500">GPU moyen</span>
                  <span className="font-semibold">{member.kpis.gpu}€</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-500">Taux de financement</span>
                  <span className={`font-semibold ${member.kpis.financingRate >= 75 ? "text-emerald-600" : "text-amber-600"}`}>
                    {member.kpis.financingRate}%
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-500">Taux de conversion</span>
                  <span className="font-semibold">{member.kpis.conversionRate}%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-500">Satisfaction client</span>
                  <span className={`font-semibold ${member.kpis.satisfaction >= 85 ? "text-emerald-600" : "text-amber-600"}`}>
                    {member.kpis.satisfaction}%
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500">Accessoires/vente</span>
                  <span className="font-semibold">{member.kpis.accessories}€</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-premium">
              <CardHeader>
                <CardTitle className="text-lg">Comparaison équipe</CardTitle>
                <CardDescription>Position par rapport aux collègues</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {teamMembers
                  .sort((a, b) => b.kpis.sales - a.kpis.sales)
                  .map((m, index) => (
                    <div
                      key={m.id}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        m.id === memberId ? "bg-indigo-50 ring-2 ring-indigo-500" : "bg-gray-50"
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
                      <span className={`flex-1 font-medium ${m.id === memberId ? "text-indigo-700" : "text-gray-700"}`}>
                        {m.name}
                      </span>
                      <span className="font-semibold">{m.kpis.sales} ventes</span>
                    </div>
                  ))
                }
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* COACHING TAB */}
        <TabsContent value="coaching" className="mt-6">
          <Card className="border-0 shadow-premium">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-500" />
                  Notes de coaching
                </CardTitle>
                <CardDescription>{memberNotes.length} note{memberNotes.length > 1 ? "s" : ""}</CardDescription>
              </div>
              <Link href={`/chef-ventes/coaching?user=${memberId}`}>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Ajouter une note
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {memberNotes.length > 0 ? (
                memberNotes.map(note => (
                  <CoachingNoteCard key={note.id} note={note} />
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Aucune note de coaching</p>
                  <Link href={`/chef-ventes/coaching?user=${memberId}`}>
                    <Button variant="outline" className="mt-3 gap-2">
                      <Plus className="w-4 h-4" />
                      Ajouter une note
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* CHALLENGES TAB */}
        <TabsContent value="challenges" className="mt-6">
          <Card className="border-0 shadow-premium">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-500" />
                  Challenges en cours
                </CardTitle>
                <CardDescription>
                  {completedChallenges.length}/{memberChallenges.length} complétés
                </CardDescription>
              </div>
              <Link href={`/chef-ventes/challenges/new?target=${memberId}`}>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Créer un challenge
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {memberChallenges.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {memberChallenges.map(challenge => (
                    <ChallengeCard key={challenge.id} challenge={challenge} memberId={memberId} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Zap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Aucun challenge actif</p>
                  <Link href={`/chef-ventes/challenges/new?target=${memberId}`}>
                    <Button variant="outline" className="mt-3 gap-2">
                      <Plus className="w-4 h-4" />
                      Créer un challenge
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
