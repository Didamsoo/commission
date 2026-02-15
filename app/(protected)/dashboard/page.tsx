"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  TrendingUp,
  TrendingDown,
  Car,
  Euro,
  Target,
  Trophy,
  Award,
  ChevronRight,
  Flame,
  Zap,
  Clock,
  Calendar,
  ArrowUpRight,
  Medal,
  Star,
  ArrowRight,
  Sparkles,
  Percent,
  BarChart3,
  Users,
  Wallet,
  Gift,
  ChevronUp,
  BadgeCheck,
  Activity
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// ============================================
// PREMIUM DASHBOARD - AutoPerf Pro
// ============================================

// Mock data - À remplacer par les données Firestore
const mockStats = {
  currentMonth: {
    sales: 8,
    salesTarget: 12,
    commission: 3450,
    margin: 12800,
    financingRate: 75,
    points: 850
  },
  previousMonth: {
    sales: 6,
    commission: 2800,
    margin: 10500
  },
  streak: 5,
  rank: 3,
  totalSellers: 12
}

const mockActiveChallenges = [
  {
    id: "1",
    title: "Sprint de Février",
    description: "Vendez 15 véhicules ce mois-ci",
    type: "sales_count",
    progress: 8,
    target: 15,
    endDate: "2024-02-29",
    reward: "500€ bonus",
    icon: Trophy,
    color: "from-amber-500 to-orange-500"
  },
  {
    id: "2",
    title: "Roi du Financement",
    description: "Atteignez 80% de taux de financement",
    type: "financing_rate",
    progress: 75,
    target: 80,
    endDate: "2024-02-29",
    reward: "Badge spécial",
    icon: Target,
    color: "from-blue-500 to-indigo-500"
  }
]

const mockRecentBadges = [
  { id: "1", name: "Semaine Parfaite", icon: "flame", color: "orange", earnedAt: "2024-02-15", rarity: "rare" },
  { id: "2", name: "5 Ventes", icon: "star", color: "blue", earnedAt: "2024-02-10", rarity: "common" },
  { id: "3", name: "Finance Master", icon: "zap", color: "purple", earnedAt: "2024-02-05", rarity: "epic" }
]

const mockLeaderboard = [
  { rank: 1, name: "Marie Martin", commission: 5200, avatar: "", trend: "up", points: 3200 },
  { rank: 2, name: "Pierre Durand", commission: 4800, avatar: "", trend: "same", points: 2900 },
  { rank: 3, name: "Jean Dupont", commission: 3450, avatar: "", trend: "up", isCurrentUser: true, points: 2450 },
  { rank: 4, name: "Sophie Bernard", commission: 3200, avatar: "", trend: "down", points: 2100 },
  { rank: 5, name: "Lucas Petit", commission: 2900, avatar: "", trend: "up", points: 1950 }
]

const mockRecentSales = [
  { id: "1", vehicle: "Ford Puma ST-Line", client: "M. Leroy", commission: 350, date: "Aujourd'hui", status: "approved", type: "VN" },
  { id: "2", vehicle: "Ford Kuga Titanium", client: "Mme Moreau", commission: 420, date: "Hier", status: "pending", type: "VO" },
  { id: "3", vehicle: "Ford Fiesta Active", client: "M. Simon", commission: 280, date: "Il y a 2 jours", status: "approved", type: "VP" },
  { id: "4", vehicle: "Ford Explorer", client: "M. Dubois", commission: 650, date: "Il y a 3 jours", status: "approved", type: "VN" }
]

// ============================================
// PREMIUM STAT CARD COMPONENT
// ============================================

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color = "blue",
  delay = 0
}: {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ElementType
  trend?: "up" | "down"
  trendValue?: string
  color?: "blue" | "green" | "purple" | "amber" | "pink"
  delay?: number
}) {
  const colors = {
    blue: { gradient: "from-blue-500 to-blue-600", bg: "bg-blue-50", text: "text-blue-700" },
    green: { gradient: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50", text: "text-emerald-700" },
    purple: { gradient: "from-purple-500 to-purple-600", bg: "bg-purple-50", text: "text-purple-700" },
    amber: { gradient: "from-amber-500 to-orange-500", bg: "bg-amber-50", text: "text-amber-700" },
    pink: { gradient: "from-pink-500 to-rose-500", bg: "bg-pink-50", text: "text-pink-700" }
  }

  const theme = colors[color]

  return (
    <Card 
      className="group border-0 shadow-premium hover:shadow-premium-lg transition-all duration-500 hover:-translate-y-1 overflow-hidden animate-fade-in-up opacity-0-initial"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            {trend && trendValue && (
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                trend === "up" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
              }`}>
                {trend === "up" ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================
// CHALLENGE CARD COMPONENT
// ============================================

function ChallengeCard({ challenge, delay = 0 }: { challenge: typeof mockActiveChallenges[0], delay?: number }) {
  const progress = (challenge.progress / challenge.target) * 100
  const daysLeft = Math.ceil((new Date(challenge.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Card 
      className="group border-0 shadow-premium hover:shadow-premium-lg transition-all duration-500 hover:-translate-y-1 overflow-hidden animate-fade-in-up opacity-0-initial"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border-amber-200">
                <Flame className="w-3 h-3 mr-1" />
                Actif
              </Badge>
              <span className="text-xs text-gray-500">{daysLeft} jours restants</span>
            </div>
            <CardTitle className="text-lg">{challenge.title}</CardTitle>
            <CardDescription className="text-sm mt-1">
              {challenge.description}
            </CardDescription>
          </div>
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${challenge.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
            <challenge.icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Progression</span>
              <span className="font-semibold text-gray-900">
                {challenge.progress}/{challenge.target}
                {challenge.type === "financing_rate" && "%"}
              </span>
            </div>
            <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`absolute inset-y-0 left-0 bg-gradient-to-r ${challenge.color} rounded-full transition-all duration-1000`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Gift className="w-4 h-4" />
              <span>Récompense:</span>
              <span className="font-semibold text-gray-900">{challenge.reward}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  const salesProgress = (mockStats.currentMonth.sales / mockStats.currentMonth.salesTarget) * 100

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* ============================================
          HEADER
          ============================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up opacity-0-initial" style={{ animationFillMode: "forwards" }}>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-gray-900">
              Bonjour, Jean !
            </h1>
            <span className="text-3xl">👋</span>
          </div>
          <p className="text-gray-600">
            Voici votre tableau de bord pour <span className="font-semibold text-gray-900">février 2024</span>
          </p>
        </div>
        <Link href="/calculator">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 group"
          >
            <Car className="w-5 h-5 mr-2" />
            Nouvelle vente
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      {/* ============================================
          STREAK BANNER
          ============================================ */}
      {mockStats.streak >= 3 && (
        <Card className="border-0 overflow-hidden animate-fade-in-up opacity-0-initial" style={{ animationFillMode: "forwards", animationDelay: "100ms" }}>
          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-1">
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-lg p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                    <Flame className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-white">
                    <p className="font-bold text-2xl">Série de {mockStats.streak} jours ! 🔥</p>
                    <p className="text-white/80">Continuez ainsi pour débloquer le badge "En Feu"</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1">
                  {[...Array(mockStats.streak)].map((_, i) => (
                    <Flame key={i} className="w-6 h-6 text-yellow-300 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* ============================================
          STATS GRID
          ============================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Ventes du mois"
          value={mockStats.currentMonth.sales}
          subtitle={`Objectif: ${mockStats.currentMonth.salesTarget}`}
          icon={Car}
          trend="up"
          trendValue="+33% vs mois dernier"
          color="blue"
          delay={200}
        />
        <StatCard
          title="Commission"
          value={`${mockStats.currentMonth.commission.toLocaleString()}€`}
          icon={Wallet}
          trend="up"
          trendValue="+23% vs mois dernier"
          color="green"
          delay={300}
        />
        <StatCard
          title="Taux financement"
          value={`${mockStats.currentMonth.financingRate}%`}
          subtitle="Sur ventes éligibles"
          icon={Percent}
          color="purple"
          delay={400}
        />
        <StatCard
          title="Points du mois"
          value={mockStats.currentMonth.points}
          subtitle={`Classement: #${mockStats.rank}`}
          icon={Trophy}
          color="amber"
          delay={500}
        />
      </div>

      {/* ============================================
          PROGRESS TOWARD GOAL
          ============================================ */}
      <Card className="border-0 shadow-premium animate-fade-in-up opacity-0-initial" style={{ animationFillMode: "forwards", animationDelay: "600ms" }}>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h3 className="font-bold text-lg text-gray-900">Progression vers l&apos;objectif mensuel</h3>
              <p className="text-sm text-gray-500 mt-1">
                {mockStats.currentMonth.sales} / {mockStats.currentMonth.salesTarget} ventes réalisées
              </p>
            </div>
            <Badge 
              variant={salesProgress >= 100 ? "default" : "secondary"} 
              className={`h-8 px-4 ${
                salesProgress >= 100 
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white" 
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {salesProgress >= 100 ? (
                <>
                  <BadgeCheck className="w-4 h-4 mr-1.5" />
                  Objectif atteint !
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 mr-1.5" />
                  {mockStats.currentMonth.salesTarget - mockStats.currentMonth.sales} restantes
                </>
              )}
            </Badge>
          </div>
          <div className="relative">
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 rounded-full transition-all duration-1000 relative"
                style={{ width: `${Math.min(salesProgress, 100)}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-shimmer" />
              </div>
            </div>
            <div className="flex justify-between mt-3 text-sm font-medium">
              <span className="text-gray-500">0 ventes</span>
              <span className="text-gray-900">{Math.round(salesProgress)}% complété</span>
              <span className="text-gray-500">{mockStats.currentMonth.salesTarget} ventes</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============================================
          MAIN CONTENT GRID
          ============================================ */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Active Challenges */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Challenges Actifs</h2>
            </div>
            <Link href="/challenges" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
              Voir tous
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {mockActiveChallenges.map((challenge, index) => (
              <ChallengeCard key={challenge.id} challenge={challenge} delay={700 + index * 100} />
            ))}
          </div>
        </div>

        {/* Mini Leaderboard */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center shadow-lg">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Classement</h2>
            </div>
            <Link href="/leaderboard" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
              Voir tout
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <Card className="border-0 shadow-premium overflow-hidden animate-fade-in-up opacity-0-initial" style={{ animationFillMode: "forwards", animationDelay: "900ms" }}>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {mockLeaderboard.map((seller, index) => (
                  <div
                    key={seller.rank}
                    className={`flex items-center gap-4 p-4 transition-colors ${
                      seller.isCurrentUser ? "bg-blue-50/50" : "hover:bg-gray-50/50"
                    }`}
                  >
                    {/* Rank */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      seller.rank === 1
                        ? "bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-lg"
                        : seller.rank === 2
                        ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white"
                        : seller.rank === 3
                        ? "bg-gradient-to-br from-orange-400 to-orange-500 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {seller.rank <= 3 ? (
                        <Medal className="w-5 h-5" />
                      ) : (
                        seller.rank
                      )}
                    </div>
                    
                    {/* Avatar */}
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className={seller.isCurrentUser ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold" : "bg-gray-200 text-gray-600 font-semibold"}>
                        {seller.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold truncate ${seller.isCurrentUser ? "text-blue-700" : "text-gray-900"}`}>
                        {seller.name}
                        {seller.isCurrentUser && (
                          <Badge className="ml-2 bg-blue-100 text-blue-700 text-xs">Vous</Badge>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">{seller.points.toLocaleString()} pts</p>
                    </div>
                    
                    {/* Commission */}
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{seller.commission.toLocaleString()}€</p>
                      {seller.trend === "up" && (
                        <span className="text-xs text-emerald-600 flex items-center justify-end gap-0.5 font-medium">
                          <ChevronUp className="w-3 h-3" /> +2
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ============================================
          RECENT ACTIVITY & BADGES
          ============================================ */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Sales */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Ventes Récentes</h2>
            </div>
            <Link href="/calculator" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
              Historique
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <Card className="border-0 shadow-premium overflow-hidden animate-fade-in-up opacity-0-initial" style={{ animationFillMode: "forwards", animationDelay: "1000ms" }}>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {mockRecentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        sale.type === "VN" ? "bg-blue-100" : 
                        sale.type === "VO" ? "bg-emerald-100" : "bg-purple-100"
                      }`}>
                        <Car className={`w-6 h-6 ${
                          sale.type === "VN" ? "text-blue-600" : 
                          sale.type === "VO" ? "text-emerald-600" : "text-purple-600"
                        }`} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{sale.vehicle}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{sale.client}</span>
                          <span>•</span>
                          <span>{sale.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">+{sale.commission}€</p>
                      <Badge 
                        variant={sale.status === "approved" ? "default" : "secondary"} 
                        className={`text-xs mt-1 ${
                          sale.status === "approved" 
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" 
                            : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                        }`}
                      >
                        {sale.status === "approved" ? "Validée" : "En attente"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Badges */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
                <Award className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Badges Récents</h2>
            </div>
            <Link href="/profile/badges" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
              Tous les badges
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <Card className="border-0 shadow-premium animate-fade-in-up opacity-0-initial" style={{ animationFillMode: "forwards", animationDelay: "1100ms" }}>
            <CardContent className="p-6">
              {mockRecentBadges.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {mockRecentBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className="group flex flex-col items-center p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
                    >
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg mb-3 ${
                        badge.rarity === "epic" 
                          ? "bg-gradient-to-br from-purple-500 to-violet-600" 
                          : badge.rarity === "rare"
                          ? "bg-gradient-to-br from-amber-400 to-orange-500"
                          : "bg-gradient-to-br from-blue-400 to-cyan-500"
                      }`}>
                        {badge.icon === "flame" ? (
                          <Flame className="w-8 h-8 text-white" />
                        ) : badge.icon === "star" ? (
                          <Star className="w-8 h-8 text-white" />
                        ) : (
                          <Zap className="w-8 h-8 text-white" />
                        )}
                      </div>
                      <p className="font-semibold text-gray-900 text-center text-sm">{badge.name}</p>
                      <Badge className={`mt-2 text-xs ${
                        badge.rarity === "epic" 
                          ? "bg-purple-100 text-purple-700" 
                          : badge.rarity === "rare"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {badge.rarity === "epic" ? "Épique" : badge.rarity === "rare" ? "Rare" : "Commun"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Award className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Aucun badge récent</p>
                  <p className="text-sm text-gray-400 mt-1">Continuez à vendre pour débloquer des badges !</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
