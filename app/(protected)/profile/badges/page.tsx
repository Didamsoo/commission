"use client"

import Link from "next/link"
import {
  Award,
  Star,
  Flame,
  Euro,
  Zap,
  Target,
  Car,
  TrendingUp,
  Crown,
  Medal,
  ArrowLeft,
  Lock,
  Calendar,
  Sparkles,
  Loader2
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useBadges, type BadgeData } from "@/hooks/use-badges"

const colorGradients: Record<string, string> = {
  blue: "from-blue-500 to-blue-600",
  orange: "from-orange-500 to-amber-500",
  green: "from-emerald-500 to-green-600",
  cyan: "from-cyan-500 to-teal-500",
  purple: "from-purple-500 to-violet-600",
  amber: "from-amber-500 to-yellow-500",
  pink: "from-pink-500 to-rose-500",
  emerald: "from-emerald-500 to-teal-600",
  indigo: "from-indigo-500 to-blue-600",
  red: "from-red-500 to-rose-600",
  gray: "from-gray-300 to-gray-400",
}

const BADGE_ICON_MAP: Record<string, React.ElementType> = {
  star: Star, flame: Flame, euro: Euro, zap: Zap, trending_up: TrendingUp,
  crown: Crown, car: Car, target: Target, award: Award, medal: Medal,
  sparkles: Sparkles,
}

function getBadgeIcon(icon: string | null): React.ElementType {
  return (icon && BADGE_ICON_MAP[icon]) || Award
}

export default function BadgesPage() {
  const { data: badgesData, loading } = useBadges()

  const allBadges: BadgeData[] = badgesData || []
  const earnedBadges = allBadges.filter(b => b.earned)
  const lockedBadges = allBadges.filter(b => !b.earned)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/profile">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mes Badges</h1>
            <p className="text-sm text-gray-500">{earnedBadges.length} obtenu{earnedBadges.length > 1 ? "s" : ""} sur {allBadges.length}</p>
          </div>
        </div>
      </div>

      {/* Progress */}
      {allBadges.length > 0 && (
        <Card className="border-0 shadow-premium">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-700">Progression globale</p>
              <p className="text-sm font-bold text-gray-900">{Math.round((earnedBadges.length / allBadges.length) * 100)}%</p>
            </div>
            <Progress value={(earnedBadges.length / allBadges.length) * 100} className="h-3" />
          </CardContent>
        </Card>
      )}

      {/* Earned Badges */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-bold text-gray-900">Badges obtenus</h2>
          <Badge className="bg-amber-100 text-amber-700">{earnedBadges.length}</Badge>
        </div>
        {earnedBadges.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {earnedBadges.map((badge) => {
              const Icon = getBadgeIcon(badge.icon)
              const gradient = colorGradients[badge.category || "blue"] || colorGradients.blue
              return (
                <Card key={badge.id} className="border-0 shadow-premium hover:shadow-xl transition-all group">
                  <CardContent className="p-5 flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">{badge.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {badge.earnedAt ? new Date(badge.earnedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) : ""}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="border-0 shadow-premium">
            <CardContent className="p-12 text-center">
              <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Aucun badge obtenu pour le moment</p>
              <p className="text-sm text-gray-400 mt-1">Continuez vos ventes pour débloquer des badges !</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-bold text-gray-900">À débloquer</h2>
            <Badge variant="secondary">{lockedBadges.length}</Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {lockedBadges.map((badge) => {
              const Icon = getBadgeIcon(badge.icon)
              return (
                <Card key={badge.id} className="border-0 shadow-premium opacity-75">
                  <CardContent className="p-5 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center mb-3 relative">
                      <Icon className="w-8 h-8 text-gray-400" />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow flex items-center justify-center">
                        <Lock className="w-3 h-3 text-gray-400" />
                      </div>
                    </div>
                    <p className="font-semibold text-gray-600 text-sm">{badge.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{badge.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
