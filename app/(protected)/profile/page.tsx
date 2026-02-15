"use client"

import { useState } from "react"
import Link from "next/link"
import {
  User,
  Mail,
  Building2,
  Calendar,
  Trophy,
  Award,
  Star,
  Flame,
  Zap,
  Target,
  Car,
  Euro,
  TrendingUp,
  Edit2,
  Camera,
  ChevronRight,
  Lock,
  Crown,
  Medal,
  Sparkles
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock user data
const mockUser = {
  id: "1",
  fullName: "Jean Dupont",
  email: "jean.dupont@ford-paris.fr",
  role: "commercial",
  avatarUrl: "",
  dealership: "Ford Paris Est",
  joinedAt: "2023-06-15",
  stats: {
    totalSales: 45,
    totalCommission: 18500,
    totalPoints: 4850,
    currentRank: 3,
    bestRank: 1,
    currentStreak: 5,
    longestStreak: 12,
    challengesWon: 8,
    badgesEarned: 12
  },
  level: {
    current: 5,
    name: "Expert",
    progress: 65,
    pointsToNext: 350
  }
}

// Mock badges
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
  // Locked badges
  { id: "13", name: "Légende", description: "50 ventes totales", icon: Medal, color: "gray", earned: false, progress: 45, total: 50 },
  { id: "14", name: "Marathonien", description: "30 jours de série", icon: Flame, color: "gray", earned: false, progress: 5, total: 30 },
  { id: "15", name: "Master Financement", description: "50 ventes financées", icon: Euro, color: "gray", earned: false, progress: 28, total: 50 }
]

const levelColors: Record<string, string> = {
  "Débutant": "from-gray-400 to-gray-500",
  "Apprenti": "from-emerald-400 to-emerald-500",
  "Confirmé": "from-blue-400 to-blue-500",
  "Avancé": "from-purple-400 to-purple-500",
  "Expert": "from-amber-400 to-orange-500",
  "Maître": "from-rose-400 to-pink-500",
  "Légende": "from-yellow-400 to-amber-500"
}

const badgeColors: Record<string, { bg: string; text: string; gradient: string }> = {
  blue: { bg: "bg-blue-100", text: "text-blue-600", gradient: "from-blue-400 to-blue-600" },
  orange: { bg: "bg-orange-100", text: "text-orange-600", gradient: "from-orange-400 to-orange-600" },
  green: { bg: "bg-emerald-100", text: "text-emerald-600", gradient: "from-emerald-400 to-emerald-600" },
  cyan: { bg: "bg-cyan-100", text: "text-cyan-600", gradient: "from-cyan-400 to-cyan-600" },
  purple: { bg: "bg-purple-100", text: "text-purple-600", gradient: "from-purple-400 to-purple-600" },
  amber: { bg: "bg-amber-100", text: "text-amber-600", gradient: "from-amber-400 to-amber-600" },
  pink: { bg: "bg-pink-100", text: "text-pink-600", gradient: "from-pink-400 to-pink-600" },
  emerald: { bg: "bg-emerald-100", text: "text-emerald-600", gradient: "from-emerald-400 to-emerald-600" },
  indigo: { bg: "bg-indigo-100", text: "text-indigo-600", gradient: "from-indigo-400 to-indigo-600" },
  red: { bg: "bg-red-100", text: "text-red-600", gradient: "from-red-400 to-red-600" },
  gray: { bg: "bg-gray-100", text: "text-gray-400", gradient: "from-gray-300 to-gray-400" }
}

function BadgeCard({ badge }: { badge: typeof allBadges[0] }) {
  const colors = badgeColors[badge.color]
  const Icon = badge.icon

  return (
    <div className={`relative p-4 rounded-xl border-2 transition-all ${
      badge.earned
        ? "bg-white border-gray-100 hover:border-gray-200 hover:shadow-lg"
        : "bg-gray-50 border-dashed border-gray-200"
    }`}>
      {!badge.earned && (
        <div className="absolute top-2 right-2">
          <Lock className="w-4 h-4 text-gray-400" />
        </div>
      )}
      <div className="flex flex-col items-center text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-lg ${
          badge.earned
            ? `bg-gradient-to-br ${colors.gradient} shadow-${badge.color}-500/25`
            : "bg-gray-200"
        }`}>
          <Icon className={`w-8 h-8 ${badge.earned ? "text-white" : "text-gray-400"}`} />
        </div>
        <h3 className={`font-semibold ${badge.earned ? "text-gray-900" : "text-gray-400"}`}>
          {badge.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
        {badge.earned && badge.earnedAt && (
          <p className="text-xs text-gray-400 mt-2">
            {new Date(badge.earnedAt).toLocaleDateString("fr-FR")}
          </p>
        )}
        {!badge.earned && badge.progress !== undefined && (
          <div className="w-full mt-3">
            <Progress value={(badge.progress / badge.total!) * 100} className="h-1.5" />
            <p className="text-xs text-gray-400 mt-1">
              {badge.progress}/{badge.total}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")

  const earnedBadges = allBadges.filter(b => b.earned)
  const lockedBadges = allBadges.filter(b => !b.earned)

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Profile Header */}
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600" />
        <CardContent className="relative pt-0 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12 sm:-mt-16">
            <div className="relative">
              <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white shadow-xl">
                <AvatarImage src={mockUser.avatarUrl} />
                <AvatarFallback className="bg-blue-600 text-white text-3xl">
                  {mockUser.fullName.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {mockUser.fullName}
                  </h1>
                  <div className="flex items-center gap-4 mt-2 text-gray-600">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {mockUser.dealership}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {mockUser.email}
                    </span>
                  </div>
                </div>
                <Button variant="outline" className="gap-2">
                  <Edit2 className="w-4 h-4" />
                  Modifier le profil
                </Button>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${levelColors[mockUser.level.name]} flex items-center justify-center text-white font-bold shadow-lg`}>
                  {mockUser.level.current}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Niveau {mockUser.level.current} - {mockUser.level.name}</p>
                  <p className="text-sm text-gray-500">{mockUser.level.pointsToNext} points jusqu'au niveau suivant</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{mockUser.stats.totalPoints.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Points totaux</p>
              </div>
            </div>
            <Progress value={mockUser.level.progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{mockUser.stats.totalSales}</p>
              <p className="text-sm text-gray-500">Ventes totales</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Euro className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{mockUser.stats.totalCommission.toLocaleString()}€</p>
              <p className="text-sm text-gray-500">Commission totale</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">#{mockUser.stats.bestRank}</p>
              <p className="text-sm text-gray-500">Meilleur classement</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{mockUser.stats.longestStreak}j</p>
              <p className="text-sm text-gray-500">Plus longue série</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="overview" className="gap-2">
            <User className="w-4 h-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="badges" className="gap-2">
            <Award className="w-4 h-4" />
            Badges ({earnedBadges.length}/{allBadges.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Badges récents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {earnedBadges.slice(0, 5).map((badge) => {
                  const colors = badgeColors[badge.color]
                  const Icon = badge.icon
                  return (
                    <div key={badge.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{badge.name}</p>
                        <p className="text-xs text-gray-500">
                          {badge.earnedAt && new Date(badge.earnedAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
              <Link href="/profile?tab=badges">
                <Button variant="link" className="mt-4 p-0">
                  Voir tous les badges
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Stats Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques de performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ventes totales</span>
                  <span className="font-semibold">{mockUser.stats.totalSales}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Commission totale</span>
                  <span className="font-semibold">{mockUser.stats.totalCommission.toLocaleString()}€</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Classement actuel</span>
                  <span className="font-semibold">#{mockUser.stats.currentRank}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Meilleur classement</span>
                  <span className="font-semibold">#{mockUser.stats.bestRank}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accomplissements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Challenges gagnés</span>
                  <span className="font-semibold">{mockUser.stats.challengesWon}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Badges obtenus</span>
                  <span className="font-semibold">{mockUser.stats.badgesEarned}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Série actuelle</span>
                  <span className="font-semibold">{mockUser.stats.currentStreak} jours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Plus longue série</span>
                  <span className="font-semibold">{mockUser.stats.longestStreak} jours</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="badges" className="mt-6">
          <div className="space-y-8">
            {/* Earned Badges */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Badges obtenus ({earnedBadges.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {earnedBadges.map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </div>
            </div>

            {/* Locked Badges */}
            <div>
              <h3 className="text-lg font-semibold text-gray-500 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Badges à débloquer ({lockedBadges.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {lockedBadges.map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
