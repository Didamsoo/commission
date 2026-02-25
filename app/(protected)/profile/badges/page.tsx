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
  Sparkles
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const allBadges = [
  { id: "1", name: "Premier Pas", description: "Première vente réalisée", icon: Star, color: "blue", earned: true, earnedAt: "2023-06-20" },
  { id: "2", name: "Semaine Parfaite", description: "5+ ventes en une semaine", icon: Flame, color: "orange", earned: true, earnedAt: "2024-01-15" },
  { id: "3", name: "Roi du Financement", description: "10 ventes financées", icon: Euro, color: "green", earned: true, earnedAt: "2023-11-10" },
  { id: "4", name: "Champion Électrique", description: "5 véhicules électriques", icon: Zap, color: "cyan", earned: true, earnedAt: "2023-12-05" },
  { id: "5", name: "Marge Maximale", description: "Vente avec 2000€+ marge", icon: TrendingUp, color: "purple", earned: true, earnedAt: "2024-01-08" },
  { id: "6", name: "Vendeur du Mois", description: "Top commission mensuelle", icon: Crown, color: "amber", earned: true, earnedAt: "2023-10-31" },
  { id: "7", name: "5 Ventes", description: "5 ventes totales", icon: Car, color: "blue", earned: true, earnedAt: "2023-07-01" },
  { id: "8", name: "10 Ventes", description: "10 ventes totales", icon: Car, color: "blue", earned: true, earnedAt: "2023-08-15" },
  { id: "9", name: "Fidélisateur", description: "Client récurrent", icon: Star, color: "pink", earned: true, earnedAt: "2023-09-20" },
  { id: "10", name: "Objectif Atteint", description: "100% de l'objectif mensuel", icon: Target, color: "emerald", earned: true, earnedAt: "2023-11-30" },
  { id: "11", name: "Spécialiste Puma", description: "5 Ford Puma vendues", icon: Award, color: "indigo", earned: true, earnedAt: "2023-12-28" },
  { id: "12", name: "En Feu", description: "10 jours de série", icon: Flame, color: "red", earned: true, earnedAt: "2024-01-10" },
  { id: "13", name: "Légende", description: "50 ventes totales", icon: Medal, color: "gray", earned: false, progress: 45, total: 50 },
  { id: "14", name: "Marathonien", description: "30 jours de série", icon: Flame, color: "gray", earned: false, progress: 5, total: 30 },
  { id: "15", name: "Master Financement", description: "50 ventes financées", icon: Euro, color: "gray", earned: false, progress: 28, total: 50 }
]

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

export default function BadgesPage() {
  const earnedBadges = allBadges.filter(b => b.earned)
  const lockedBadges = allBadges.filter(b => !b.earned) as (typeof allBadges[0] & { progress: number; total: number })[]

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
      <Card className="border-0 shadow-premium">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-700">Progression globale</p>
            <p className="text-sm font-bold text-gray-900">{Math.round((earnedBadges.length / allBadges.length) * 100)}%</p>
          </div>
          <Progress value={(earnedBadges.length / allBadges.length) * 100} className="h-3" />
        </CardContent>
      </Card>

      {/* Earned Badges */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-bold text-gray-900">Badges obtenus</h2>
          <Badge className="bg-amber-100 text-amber-700">{earnedBadges.length}</Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {earnedBadges.map((badge) => {
            const Icon = badge.icon
            const gradient = colorGradients[badge.color] || colorGradients.blue
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
              const Icon = badge.icon
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
                    <div className="w-full mt-3">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>{badge.progress}/{badge.total}</span>
                        <span>{Math.round((badge.progress / badge.total) * 100)}%</span>
                      </div>
                      <Progress value={(badge.progress / badge.total) * 100} className="h-2" />
                    </div>
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
