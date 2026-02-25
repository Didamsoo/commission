"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  Target,
  ArrowLeft,
  Calendar,
  Users,
  Trophy,
  Award,
  Euro,
  Star,
  Clock,
  CheckCircle,
  Loader2,
  Medal
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useDefis } from "@/hooks/use-defis"

const typeLabels: Record<string, string> = {
  sales_count: "Nombre de ventes",
  revenue_target: "Objectif CA",
  margin_target: "Objectif marge",
  financing_rate: "Taux financement",
  specific_model: "Modèle spécifique",
}

const rewardIcons: Record<string, typeof Euro> = {
  bonus: Euro,
  badge: Award,
  points: Star,
}

export default function ChallengeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: defisRaw, loading } = useDefis()

  const defi = useMemo(() => {
    if (!defisRaw || !id) return null
    return (defisRaw as Record<string, unknown>[]).find(
      (d) => d.id === id
    ) as Record<string, unknown> | undefined
  }, [defisRaw, id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!defi) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Target className="w-16 h-16 text-gray-300" />
        <p className="text-lg font-medium text-gray-500">Défi introuvable</p>
        <Link href="/challenges">
          <Button variant="outline">Retour aux défis</Button>
        </Link>
      </div>
    )
  }

  const title = defi.title as string || "Défi"
  const description = defi.description as string || ""
  const type = defi.type as string || "sales_count"
  const targetValue = defi.target_value as number || 0
  const startDate = defi.start_date as string || ""
  const endDate = defi.end_date as string || ""
  const rewardType = defi.reward_type as string || "bonus"
  const rewardValue = defi.reward_value as string || ""
  const rewardDescription = defi.reward_description as string || ""
  const status = defi.status as string || "active"
  const participants = (defi.defis_plateforme_participants || []) as Array<{
    user_id: string
    name: string
    current_score: number
    target_score: number
    progress_rate: number
    is_completed: boolean
    ranking: number | null
  }>

  const sortedParticipants = [...participants].sort((a, b) => (b.progress_rate || 0) - (a.progress_rate || 0))
  const totalParticipants = participants.length
  const completedCount = participants.filter(p => p.is_completed).length
  const avgProgress = totalParticipants > 0
    ? Math.round(participants.reduce((s, p) => s + (p.progress_rate || 0), 0) / totalParticipants)
    : 0

  const RewardIcon = rewardIcons[rewardType] || Star
  const daysLeft = endDate ? Math.max(0, Math.ceil((new Date(endDate).getTime() - Date.now()) / 86400000)) : 0

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/challenges">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <Badge className={
                status === "active" ? "bg-emerald-100 text-emerald-700" :
                status === "completed" ? "bg-blue-100 text-blue-700" :
                "bg-gray-100 text-gray-700"
              }>
                {status === "active" ? "En cours" : status === "completed" ? "Terminé" : "À venir"}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-premium">
          <CardContent className="p-5 text-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-2">
              <Users className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalParticipants}</p>
            <p className="text-xs text-gray-500">Participants</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-premium">
          <CardContent className="p-5 text-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
            <p className="text-xs text-gray-500">Objectif atteint</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-premium">
          <CardContent className="p-5 text-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mx-auto mb-2">
              <Target className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{avgProgress}%</p>
            <p className="text-xs text-gray-500">Progression moy.</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-premium">
          <CardContent className="p-5 text-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-2">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{daysLeft}</p>
            <p className="text-xs text-gray-500">Jours restants</p>
          </CardContent>
        </Card>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info Card */}
        <Card className="border-0 shadow-premium">
          <CardHeader>
            <CardTitle className="text-base">Détails du défi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Type</p>
              <Badge variant="secondary">{typeLabels[type] || type}</Badge>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Objectif</p>
              <p className="font-semibold text-gray-900">{targetValue}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Période</p>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Calendar className="w-4 h-4 text-gray-400" />
                {startDate ? new Date(startDate).toLocaleDateString("fr-FR") : "—"} → {endDate ? new Date(endDate).toLocaleDateString("fr-FR") : "—"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reward Card */}
        <Card className="border-0 shadow-premium">
          <CardHeader>
            <CardTitle className="text-base">Récompense</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
              <RewardIcon className="w-8 h-8 text-white" />
            </div>
            <p className="font-bold text-xl text-gray-900">{rewardValue}</p>
            <p className="text-sm text-gray-500">{rewardDescription}</p>
            <Badge className="bg-amber-100 text-amber-700">
              {rewardType === "bonus" ? "Bonus" : rewardType === "badge" ? "Badge" : "Points"}
            </Badge>
          </CardContent>
        </Card>

        {/* Global Progress */}
        <Card className="border-0 shadow-premium">
          <CardHeader>
            <CardTitle className="text-base">Progression globale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="url(#gradient)" strokeWidth="3" strokeDasharray={`${avgProgress}, 100`} strokeLinecap="round" />
                  <defs>
                    <linearGradient id="gradient">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-900">{avgProgress}%</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">{completedCount}/{totalParticipants} terminés</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard */}
      <Card className="border-0 shadow-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Classement des participants
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedParticipants.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Aucun participant</p>
          ) : (
            <div className="space-y-3">
              {sortedParticipants.map((p, idx) => {
                const rankColors = ["bg-amber-500", "bg-gray-400", "bg-amber-700"]
                return (
                  <div key={p.user_id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className={`w-8 h-8 rounded-full ${idx < 3 ? rankColors[idx] : "bg-gray-200"} flex items-center justify-center text-white text-sm font-bold`}>
                      {idx < 3 ? <Medal className="w-4 h-4" /> : idx + 1}
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold">
                        {(p.name || "?").split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 truncate">{p.name || "Participant"}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">{p.current_score || 0}/{p.target_score || targetValue}</span>
                          {p.is_completed && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                        </div>
                      </div>
                      <Progress value={p.progress_rate || 0} className="h-2 mt-2" />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
