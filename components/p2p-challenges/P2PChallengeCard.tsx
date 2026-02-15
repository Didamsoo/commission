"use client"

import {
  Car,
  Euro,
  TrendingUp,
  Percent,
  Clock,
  Swords,
  Trophy,
  Crown,
  Check,
  X,
  MessageSquare,
  ChevronRight,
  Flame
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  P2PChallenge,
  P2PChallengeMetric,
  P2P_METRIC_CONFIG,
  P2P_STATUS_CONFIG,
  getTimeRemaining,
  formatScore
} from "@/types/p2p-challenges"
import { CURRENT_USER_ID, isChallenger, isChallenged, didUserWin } from "@/lib/mock-p2p-data"

interface P2PChallengeCardProps {
  challenge: P2PChallenge
  currentUserId?: string
  onAccept?: () => void
  onDecline?: () => void
  onNegotiate?: () => void
  onViewDetails?: () => void
  compact?: boolean
}

function getMetricIcon(metric: P2PChallengeMetric) {
  const icons = {
    sales_count: Car,
    revenue: Euro,
    margin: TrendingUp,
    financing_count: Percent
  }
  return icons[metric]
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function P2PChallengeCard({
  challenge,
  currentUserId = CURRENT_USER_ID,
  onAccept,
  onDecline,
  onNegotiate,
  onViewDetails,
  compact = false
}: P2PChallengeCardProps) {
  const { challenger, challenged, metric, status, durationDays, challengerStake, challengedStake } = challenge
  const metricConfig = P2P_METRIC_CONFIG[metric]
  const statusConfig = P2P_STATUS_CONFIG[status]
  const MetricIcon = getMetricIcon(metric)

  const isUserChallenger = isChallenger(challenge, currentUserId)
  const isUserChallenged = isChallenged(challenge, currentUserId)
  const userWon = didUserWin(challenge, currentUserId)

  const timeRemaining = challenge.endDate ? getTimeRemaining(challenge.endDate) : null

  // Calcul du pourcentage de progression
  const getProgressPercent = (score: number, otherScore: number) => {
    const total = score + otherScore
    if (total === 0) return 50
    return (score / total) * 100
  }

  const challengerProgress = getProgressPercent(challenger.currentScore, challenged.currentScore)

  if (compact) {
    return (
      <Card
        className="border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
        onClick={onViewDetails}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center -space-x-2">
                <Avatar className="w-8 h-8 border-2 border-white">
                  <AvatarImage src={challenger.avatar} />
                  <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                    {getInitials(challenger.name)}
                  </AvatarFallback>
                </Avatar>
                <Avatar className="w-8 h-8 border-2 border-white">
                  <AvatarImage src={challenged.avatar} />
                  <AvatarFallback className="text-xs bg-purple-100 text-purple-700">
                    {getInitials(challenged.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {isUserChallenger ? `vs ${challenged.name}` : `vs ${challenger.name}`}
                </p>
                <p className="text-xs text-gray-500">{metricConfig.labelShort} • {durationDays}j</p>
              </div>
            </div>
            <Badge className={`${statusConfig.bgColor} ${statusConfig.textColor} text-xs`}>
              {statusConfig.label}
            </Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-premium overflow-hidden hover:shadow-premium-lg transition-shadow">
      {/* Header avec VS */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
        <div className="flex items-center justify-between">
          {/* Challenger */}
          <div className="flex flex-col items-center">
            <Avatar className="w-14 h-14 border-3 border-white shadow-lg">
              <AvatarImage src={challenger.avatar} />
              <AvatarFallback className="bg-white text-indigo-600 font-bold">
                {getInitials(challenger.name)}
              </AvatarFallback>
            </Avatar>
            <p className="text-white text-sm font-semibold mt-2 text-center">
              {challenger.name.split(" ")[0]}
            </p>
            {status === "completed" && challenge.result?.winnerId === challenger.id && (
              <Crown className="w-5 h-5 text-amber-300 mt-1" />
            )}
          </div>

          {/* VS Badge */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <Swords className="w-6 h-6 text-white" />
            </div>
            <Badge className={`mt-2 ${statusConfig.bgColor} ${statusConfig.textColor}`}>
              {statusConfig.label}
            </Badge>
          </div>

          {/* Challenged */}
          <div className="flex flex-col items-center">
            <Avatar className="w-14 h-14 border-3 border-white shadow-lg">
              <AvatarImage src={challenged.avatar} />
              <AvatarFallback className="bg-white text-purple-600 font-bold">
                {getInitials(challenged.name)}
              </AvatarFallback>
            </Avatar>
            <p className="text-white text-sm font-semibold mt-2 text-center">
              {challenged.name.split(" ")[0]}
            </p>
            {status === "completed" && challenge.result?.winnerId === challenged.id && (
              <Crown className="w-5 h-5 text-amber-300 mt-1" />
            )}
          </div>
        </div>
      </div>

      <CardContent className="p-5 space-y-4">
        {/* Type de défi et durée */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg bg-${metricConfig.color}-100 flex items-center justify-center`}>
              <MetricIcon className={`w-4 h-4 text-${metricConfig.color}-600`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{metricConfig.label}</p>
              <p className="text-xs text-gray-500">{durationDays} jours</p>
            </div>
          </div>

          {/* Temps restant (si actif) */}
          {status === "active" && timeRemaining && !timeRemaining.isExpired && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-full">
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-700">
                {timeRemaining.days > 0 ? `${timeRemaining.days}j ${timeRemaining.hours}h` : `${timeRemaining.hours}h`}
              </span>
            </div>
          )}
        </div>

        {/* Mise en jeu */}
        <div className="p-3 bg-gradient-to-r from-amber-50 to-purple-50 rounded-xl border border-amber-100">
          <p className="text-xs font-medium text-gray-500 mb-1">Mise en jeu</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-amber-600">
                {challengerStake.points} pts
              </span>
              {challengerStake.customReward && (
                <span className="text-gray-600">
                  + {challengerStake.customRewardEmoji} {challengerStake.customReward}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Progression (si actif) */}
        {status === "active" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-indigo-600">
                  {formatScore(challenger.currentScore, metric)}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{challenger.name.split(" ")[0]}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">{challenged.name.split(" ")[0]}</span>
                <span className="text-gray-400">•</span>
                <span className="font-semibold text-purple-600">
                  {formatScore(challenged.currentScore, metric)}
                </span>
              </div>
            </div>
            <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-500"
                style={{ width: `${challengerProgress}%` }}
              />
              <div
                className="absolute right-0 top-0 h-full bg-gradient-to-l from-purple-500 to-purple-400 transition-all duration-500"
                style={{ width: `${100 - challengerProgress}%` }}
              />
              <div className="absolute left-1/2 top-0 w-0.5 h-full bg-white" />
            </div>
          </div>
        )}

        {/* Résultat (si terminé) */}
        {status === "completed" && challenge.result && (
          <div className={`p-4 rounded-xl ${userWon ? "bg-emerald-50 border border-emerald-200" : "bg-gray-50 border border-gray-200"}`}>
            {challenge.result.isDraw ? (
              <div className="text-center">
                <p className="text-lg font-bold text-gray-700">Égalité !</p>
                <p className="text-sm text-gray-500">Les mises sont remboursées</p>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                {userWon ? (
                  <>
                    <Trophy className="w-6 h-6 text-amber-500" />
                    <div className="text-center">
                      <p className="text-lg font-bold text-emerald-700">Victoire !</p>
                      <p className="text-sm text-emerald-600">
                        +{challengerStake.points + challengedStake.points} points
                        {challengerStake.customReward && ` + ${challengerStake.customReward}`}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-700">Défaite</p>
                    <p className="text-sm text-gray-500">
                      {challenge.result.winnerName} l'emporte
                    </p>
                  </div>
                )}
              </div>
            )}
            <div className="flex items-center justify-center gap-4 mt-3 text-sm text-gray-600">
              <span>{challenger.name.split(" ")[0]}: {formatScore(challenge.result.challengerFinalScore, metric)}</span>
              <span className="text-gray-400">vs</span>
              <span>{challenged.name.split(" ")[0]}: {formatScore(challenge.result.challengedFinalScore, metric)}</span>
            </div>
          </div>
        )}

        {/* Actions (si en attente et user est le challenged) */}
        {status === "pending" && isUserChallenged && (
          <div className="flex gap-2">
            <Button
              onClick={onAccept}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              <Check className="w-4 h-4 mr-2" />
              Accepter
            </Button>
            <Button
              onClick={onNegotiate}
              variant="outline"
              className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Négocier
            </Button>
            <Button
              onClick={onDecline}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Bouton voir détails (autres cas) */}
        {(status !== "pending" || !isUserChallenged) && onViewDetails && (
          <Button
            onClick={onViewDetails}
            variant="outline"
            className="w-full group"
          >
            Voir les détails
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        )}

        {/* Indicateur négociation en cours */}
        {status === "negotiating" && (
          <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 rounded-lg">
            <MessageSquare className="w-4 h-4 text-blue-600 animate-pulse" />
            <span className="text-sm font-medium text-blue-700">Négociation en cours...</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default P2PChallengeCard
