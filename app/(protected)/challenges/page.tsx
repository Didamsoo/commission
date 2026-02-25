"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Target,
  Trophy,
  Clock,
  Users,
  ChevronRight,
  Flame,
  Euro,
  Car,
  Percent,
  Award,
  Calendar,
  CheckCircle2,
  Lock,
  Sparkles,
  Swords,
  Plus,
  MessageSquare,
  AlertCircle,
  Loader2
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  P2PChallengeCard,
  CreateChallengeDialog,
  ChallengeResponseDialog
} from "@/components/p2p-challenges"
import { useDefisP2P } from "@/hooks/use-defis-p2p"
import { useDefis } from "@/hooks/use-defis"
import { useProfil } from "@/hooks/use-profil"
import { useEquipe } from "@/hooks/use-equipe"
import { P2PChallenge, P2PStake, P2PParticipant } from "@/types/p2p-challenges"

type ChallengeStatus = "active" | "completed" | "upcoming"
type ChallengeType = "sales_count" | "revenue_target" | "margin_target" | "financing_rate" | "specific_model"

interface Challenge {
  id: string
  title: string
  description: string
  type: ChallengeType
  target: number
  current: number
  unit: string
  startDate: string
  endDate: string
  reward: {
    type: "bonus" | "badge" | "points"
    value: string
    description: string
  }
  participants: number
  topPerformers: { name: string; avatar: string; progress: number }[]
  status: ChallengeStatus
  isCompleted?: boolean
  completedAt?: string
}

/* ------------------------------------------------------------------ */
/* Helpers to map API defis_plateforme rows to the Challenge interface */
/* ------------------------------------------------------------------ */

interface DefiParticipant {
  id: string
  user_id: string
  current_score: number
  target_score: number
  progress_rate: number
  is_completed: boolean
  ranking: number | null
}

interface DefiReward {
  type: "bonus" | "badge" | "points" | "recognition"
  value: number
  description: string
  badgeName?: string
}

interface DefiRow {
  id: string
  title: string
  description: string | null
  challenge_type: string
  target_value: number
  target_unit: string | null
  target_model_name: string | null
  start_date: string
  end_date: string
  reward: DefiReward
  status: string
  created_at: string
  creator: { full_name: string; email: string; avatar_url: string | null } | null
  defis_plateforme_participants: DefiParticipant[]
}

/** Map challenge_type from the DB to the ChallengeType union used in UI */
function mapChallengeType(dbType: string): ChallengeType {
  const mapping: Record<string, ChallengeType> = {
    sales_count: "sales_count",
    revenue: "revenue_target",
    revenue_target: "revenue_target",
    margin: "margin_target",
    margin_target: "margin_target",
    financing_rate: "financing_rate",
    financing_count: "financing_rate",
    specific_model: "specific_model",
  }
  return mapping[dbType] ?? "sales_count"
}

/** Map DB status to the ChallengeStatus union used in UI */
function mapChallengeStatus(dbStatus: string): ChallengeStatus {
  if (dbStatus === "completed" || dbStatus === "cancelled") return "completed"
  if (dbStatus === "upcoming" || dbStatus === "draft") return "upcoming"
  return "active"
}

/** Format reward value for display */
function formatRewardValue(reward: DefiReward): string {
  if (reward.type === "bonus") return `${reward.value}\u202F\u20AC`
  if (reward.type === "points") return String(reward.value)
  // badge / recognition
  return reward.badgeName ?? reward.description ?? "Badge"
}

/** Convert a DefiRow into the Challenge shape consumed by ChallengeCard */
function mapDefiToChallenge(defi: DefiRow, currentUserId: string): Challenge {
  const participants = defi.defis_plateforme_participants ?? []
  const myParticipation = participants.find((p) => p.user_id === currentUserId)

  const currentScore = myParticipation ? Number(myParticipation.current_score) : 0
  const targetScore = myParticipation ? Number(myParticipation.target_score) : Number(defi.target_value)

  const status = mapChallengeStatus(defi.status)

  // Build top performers sorted by progress descending (top 3)
  const topPerformers = [...participants]
    .sort((a, b) => Number(b.progress_rate) - Number(a.progress_rate))
    .slice(0, 3)
    .map((p) => ({
      name: p.user_id.slice(0, 8), // fallback short id; we don't have full names in participant rows
      avatar: "",
      progress: Math.round(Number(p.progress_rate)),
    }))

  const isCompleted = myParticipation?.is_completed ?? false

  return {
    id: defi.id,
    title: defi.title,
    description: defi.description ?? "",
    type: mapChallengeType(defi.challenge_type),
    target: targetScore,
    current: currentScore,
    unit: defi.target_unit ?? "",
    startDate: defi.start_date,
    endDate: defi.end_date,
    reward: {
      type: (defi.reward?.type === "recognition" ? "badge" : defi.reward?.type) ?? "bonus",
      value: formatRewardValue(defi.reward ?? { type: "bonus", value: 0, description: "" }),
      description: defi.reward?.description ?? "",
    },
    participants: participants.length,
    topPerformers,
    status,
    isCompleted,
    completedAt: isCompleted && myParticipation ? undefined : undefined,
  }
}

function ChallengeIcon({ type }: { type: ChallengeType }) {
  const icons = {
    sales_count: Car,
    revenue_target: Euro,
    margin_target: Euro,
    financing_rate: Percent,
    specific_model: Car
  }
  const Icon = icons[type]
  return <Icon className="w-6 h-6" />
}

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const progressPercent = (challenge.current / challenge.target) * 100
  const daysLeft = Math.ceil(
    (new Date(challenge.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  const rewardColors = {
    bonus: "from-emerald-500 to-emerald-600",
    badge: "from-purple-500 to-purple-600",
    points: "from-amber-500 to-orange-500"
  }

  const rewardIcons = {
    bonus: Euro,
    badge: Award,
    points: Sparkles
  }
  const RewardIcon = rewardIcons[challenge.reward.type]

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-lg ${
      challenge.status === "completed" ? "opacity-90" : ""
    } ${challenge.status === "upcoming" ? "border-dashed" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              challenge.status === "active"
                ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white"
                : challenge.status === "completed"
                ? "bg-emerald-100 text-emerald-600"
                : "bg-gray-100 text-gray-400"
            }`}>
              <ChallengeIcon type={challenge.type} />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {challenge.title}
                {challenge.isCompleted && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                )}
              </CardTitle>
              <CardDescription className="mt-1">
                {challenge.description}
              </CardDescription>
            </div>
          </div>
          {challenge.status === "active" && daysLeft <= 7 && (
            <Badge variant="destructive" className="animate-pulse">
              <Clock className="w-3 h-3 mr-1" />
              {daysLeft}j restants
            </Badge>
          )}
          {challenge.status === "upcoming" && (
            <Badge variant="secondary">
              <Lock className="w-3 h-3 mr-1" />
              Bientôt
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress */}
        {challenge.status !== "upcoming" && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Votre progression</span>
              <span className="font-semibold">
                {challenge.current}{challenge.unit === "%" ? "%" : ""} / {challenge.target}{challenge.unit === "%" ? "%" : ` ${challenge.unit}`}
              </span>
            </div>
            <Progress
              value={Math.min(progressPercent, 100)}
              className={`h-3 ${challenge.isCompleted ? "[&>div]:bg-emerald-500" : ""}`}
            />
          </div>
        )}

        {/* Dates */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(challenge.startDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
              {" - "}
              {new Date(challenge.endDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{challenge.participants} participants</span>
          </div>
        </div>

        {/* Top Performers */}
        {challenge.status === "active" && challenge.topPerformers.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-2">Top performers</p>
            <div className="flex items-center gap-2">
              {challenge.topPerformers.map((performer, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-[10px] bg-gray-200">
                      {performer.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-gray-600">{performer.progress}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reward */}
        <div className={`flex items-center justify-between p-3 rounded-lg ${
          challenge.status === "completed"
            ? "bg-emerald-50 border border-emerald-200"
            : "bg-gradient-to-r " + rewardColors[challenge.reward.type] + " bg-opacity-10"
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              challenge.status === "completed"
                ? "bg-emerald-500 text-white"
                : `bg-gradient-to-br ${rewardColors[challenge.reward.type]} text-white`
            }`}>
              <RewardIcon className="w-4 h-4" />
            </div>
            <div>
              <p className={`font-semibold text-sm ${
                challenge.status === "completed" ? "text-emerald-700" : "text-gray-900"
              }`}>
                {challenge.reward.value}
              </p>
              <p className="text-xs text-gray-500">{challenge.reward.description}</p>
            </div>
          </div>
          {challenge.status === "completed" && challenge.isCompleted && (
            <Badge className="bg-emerald-500">Gagné !</Badge>
          )}
        </div>

        {/* Action Button */}
        {challenge.status === "active" && (
          <Link href={`/challenges/${challenge.id}`}>
            <Button variant="outline" className="w-full">
              Voir les détails
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  )
}

type TabType = ChallengeStatus | "p2p"

export default function ChallengesPage() {
  const [tab, setTab] = useState<TabType>("active")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedP2PChallenge, setSelectedP2PChallenge] = useState<P2PChallenge | null>(null)
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false)

  const { data: profil } = useProfil()
  const { data: defisRaw, loading: defisLoading } = useDefis()
  const { data: p2pChallengesRaw } = useDefisP2P()
  const { data: equipeData } = useEquipe()
  const currentUserId = profil?.id || ""

  // Map API defis_plateforme rows to Challenge UI type
  const challenges: Challenge[] = useMemo(() => {
    if (!defisRaw || !Array.isArray(defisRaw)) return []
    return (defisRaw as unknown as DefiRow[]).map((d) => mapDefiToChallenge(d, currentUserId))
  }, [defisRaw, currentUserId])

  // Map API data to P2PChallenge type
  const allP2P = ((p2pChallengesRaw || []) as Array<Record<string, unknown>>).map(d => d as unknown as P2PChallenge)

  const activeChallenges = challenges.filter(c => c.status === "active")
  const completedChallenges = challenges.filter(c => c.status === "completed")
  const upcomingChallenges = challenges.filter(c => c.status === "upcoming")

  const completedByUser = completedChallenges.filter(c => c.isCompleted)

  // Compute dynamic stats from real data
  const totalBonusWon = useMemo(() => {
    return completedByUser
      .filter(c => c.reward.type === "bonus")
      .reduce((sum, c) => {
        const num = parseFloat(c.reward.value.replace(/[^\d.,]/g, "").replace(",", "."))
        return sum + (isNaN(num) ? 0 : num)
      }, 0)
  }, [completedByUser])

  const totalPointsWon = useMemo(() => {
    return completedByUser
      .filter(c => c.reward.type === "points")
      .reduce((sum, c) => {
        const num = parseFloat(c.reward.value.replace(/[^\d.,]/g, "").replace(",", "."))
        return sum + (isNaN(num) ? 0 : num)
      }, 0)
  }, [completedByUser])

  // P2P Challenges from real API
  const pendingP2PChallenges = allP2P.filter(c => c.challenged?.id === currentUserId && c.status === "pending")
  const activeP2PChallenges = allP2P.filter(c => (c.challenger?.id === currentUserId || c.challenged?.id === currentUserId) && c.status === "active")
  const negotiatingP2PChallenges = allP2P.filter(c => (c.challenger?.id === currentUserId || c.challenged?.id === currentUserId) && c.status === "negotiating")
  const completedP2PChallenges = allP2P.filter(c => (c.challenger?.id === currentUserId || c.challenged?.id === currentUserId) && (c.status === "completed" || c.status === "declined"))

  // Build opponents list from equipe for the create dialog
  const opponents: P2PParticipant[] = (equipeData || [])
    .filter(m => m.id !== currentUserId && m.role === "commercial")
    .map(m => ({ id: m.id, name: m.full_name, avatar: m.avatar_url || "", currentScore: 0 }))

  const handleAcceptChallenge = () => {
    setIsResponseDialogOpen(false)
    setSelectedP2PChallenge(null)
  }

  const handleDeclineChallenge = () => {
    setIsResponseDialogOpen(false)
    setSelectedP2PChallenge(null)
  }

  const handleNegotiateChallenge = (offer: { stake: P2PStake; durationDays?: number; message?: string }) => {
    void offer
  }

  const handleChallengeCreated = (challenge: P2PChallenge) => {
    void challenge
    setIsCreateDialogOpen(false)
  }

  const openResponseDialog = (challenge: P2PChallenge) => {
    setSelectedP2PChallenge(challenge)
    setIsResponseDialogOpen(true)
  }

  if (defisLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
        <p className="text-gray-500">Chargement des challenges...</p>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Target className="w-8 h-8 text-purple-500" />
            Challenges
          </h1>
          <p className="text-gray-600 mt-1">
            Relevez des défis et gagnez des récompenses
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-0">
          <CardContent className="p-4">
            <Target className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-2xl font-bold">{activeChallenges.length}</p>
            <p className="text-sm text-purple-100">Challenges actifs</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0">
          <CardContent className="p-4">
            <Trophy className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-2xl font-bold">{completedByUser.length}</p>
            <p className="text-sm text-emerald-100">Challenges gagnés</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0">
          <CardContent className="p-4">
            <Euro className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-2xl font-bold">{totalBonusWon.toLocaleString("fr-FR")}{"\u202F"}\u20AC</p>
            <p className="text-sm text-amber-100">Bonus gagnés</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-pink-500 to-rose-600 text-white border-0">
          <CardContent className="p-4">
            <Flame className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-2xl font-bold">{totalPointsWon.toLocaleString("fr-FR")}</p>
            <p className="text-sm text-pink-100">Points bonus</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as TabType)}>
        <TabsList className="grid w-full max-w-xl grid-cols-4">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">Actifs</span> ({activeChallenges.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            <span className="hidden sm:inline">Terminés</span> ({completedChallenges.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline">À venir</span> ({upcomingChallenges.length})
          </TabsTrigger>
          <TabsTrigger value="p2p" className="flex items-center gap-2 relative">
            <Swords className="w-4 h-4" />
            <span className="hidden sm:inline">Défis P2P</span>
            {pendingP2PChallenges.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold animate-pulse">
                {pendingP2PChallenges.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {activeChallenges.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {activeChallenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucun challenge actif</p>
              <p className="text-gray-400 mt-1">
                De nouveaux challenges seront bientôt disponibles !
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {completedChallenges.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {completedChallenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucun challenge terminé</p>
              <p className="text-gray-400 mt-1">
                Participez aux challenges actifs pour les compléter !
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          {upcomingChallenges.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {upcomingChallenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucun challenge à venir</p>
              <p className="text-gray-400 mt-1">
                Restez connecté pour découvrir les prochains défis !
              </p>
            </Card>
          )}
        </TabsContent>

        {/* Onglet Défis P2P */}
        <TabsContent value="p2p" className="mt-6 space-y-8">
          {/* Header avec bouton créer */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Swords className="w-6 h-6 text-indigo-500" />
                Défis entre commerciaux
              </h2>
              <p className="text-gray-500 mt-1">
                Défiez vos collègues et prouvez que vous êtes le meilleur !
              </p>
            </div>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Lancer un défi
            </Button>
          </div>

          {/* Défis en attente de réponse */}
          {pendingP2PChallenges.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-gray-900">
                  Défis en attente de votre réponse ({pendingP2PChallenges.length})
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {pendingP2PChallenges.map((challenge) => (
                  <P2PChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    currentUserId={currentUserId}
                    onAccept={() => openResponseDialog(challenge)}
                    onDecline={() => {
                      setSelectedP2PChallenge(challenge)
                      handleDeclineChallenge()
                    }}
                    onNegotiate={() => openResponseDialog(challenge)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Défis en négociation */}
          {negotiatingP2PChallenges.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-gray-900">
                  Négociations en cours ({negotiatingP2PChallenges.length})
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {negotiatingP2PChallenges.map((challenge) => (
                  <P2PChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    currentUserId={currentUserId}
                    onViewDetails={() => openResponseDialog(challenge)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Défis actifs */}
          {activeP2PChallenges.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-gray-900">
                  Défis en cours ({activeP2PChallenges.length})
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {activeP2PChallenges.map((challenge) => (
                  <P2PChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    currentUserId={currentUserId}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Défis terminés */}
          {completedP2PChallenges.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-gray-900">
                  Historique ({completedP2PChallenges.length})
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {completedP2PChallenges.map((challenge) => (
                  <P2PChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    currentUserId={currentUserId}
                  />
                ))}
              </div>
            </div>
          )}

          {/* État vide */}
          {pendingP2PChallenges.length === 0 &&
           activeP2PChallenges.length === 0 &&
           negotiatingP2PChallenges.length === 0 &&
           completedP2PChallenges.length === 0 && (
            <Card className="p-12 text-center">
              <Swords className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucun défi P2P</p>
              <p className="text-gray-400 mt-1 mb-4">
                Lancez votre premier défi et montrez de quoi vous êtes capable !
              </p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-indigo-500 to-purple-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Lancer un défi
              </Button>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <CreateChallengeDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onChallengeCreated={handleChallengeCreated}
        currentUser={profil ? { id: profil.id, name: profil.full_name, avatar: profil.avatar_url || "" } : undefined}
        opponents={opponents}
      />

      {selectedP2PChallenge && (
        <ChallengeResponseDialog
          challenge={selectedP2PChallenge}
          isOpen={isResponseDialogOpen}
          onClose={() => {
            setIsResponseDialogOpen(false)
            setSelectedP2PChallenge(null)
          }}
          onAccept={handleAcceptChallenge}
          onDecline={handleDeclineChallenge}
          onNegotiate={handleNegotiateChallenge}
        />
      )}
    </div>
  )
}
