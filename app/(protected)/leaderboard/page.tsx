"use client"

import { useState } from "react"
import {
  Trophy,
  Medal,
  Crown,
  TrendingUp,
  TrendingDown,
  Minus,
  Filter,
  Calendar,
  Euro,
  Car,
  Zap,
  Flame
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChallengeButton } from "@/components/p2p-challenges"

type Period = "day" | "week" | "month" | "quarter" | "year"
type MetricType = "commission" | "sales" | "points"

// Mock data
const mockLeaderboardData = [
  {
    id: "user-2",
    rank: 1,
    previousRank: 2,
    name: "Marie Martin",
    avatar: "",
    commission: 5200,
    sales: 12,
    points: 1850,
    streak: 8,
    badges: ["Vendeur du Mois", "Roi du Financement"]
  },
  {
    id: "user-3",
    rank: 2,
    previousRank: 1,
    name: "Pierre Durand",
    avatar: "",
    commission: 4800,
    sales: 11,
    points: 1720,
    streak: 5,
    badges: ["Semaine Parfaite"]
  },
  {
    id: "user-1",
    rank: 3,
    previousRank: 4,
    name: "Jean Dupont",
    avatar: "",
    commission: 3450,
    sales: 8,
    points: 1450,
    streak: 5,
    isCurrentUser: true,
    badges: ["Premier Pas", "5 Ventes"]
  },
  {
    id: "user-4",
    rank: 4,
    previousRank: 3,
    name: "Sophie Bernard",
    avatar: "",
    commission: 3200,
    sales: 7,
    points: 1280,
    streak: 3,
    badges: []
  },
  {
    id: "user-5",
    rank: 5,
    previousRank: 6,
    name: "Lucas Petit",
    avatar: "",
    commission: 2900,
    sales: 7,
    points: 1150,
    streak: 2,
    badges: ["Champion Électrique"]
  },
  {
    id: "user-6",
    rank: 6,
    previousRank: 5,
    name: "Emma Leroy",
    avatar: "",
    commission: 2700,
    sales: 6,
    points: 980,
    streak: 0,
    badges: []
  },
  {
    id: "user-7",
    rank: 7,
    previousRank: 7,
    name: "Hugo Moreau",
    avatar: "",
    commission: 2400,
    sales: 5,
    points: 850,
    streak: 1,
    badges: []
  },
  {
    id: "user-8",
    rank: 8,
    previousRank: 9,
    name: "Léa Simon",
    avatar: "",
    commission: 2100,
    sales: 5,
    points: 720,
    streak: 0,
    badges: []
  },
  {
    id: "user-9",
    rank: 9,
    previousRank: 8,
    name: "Nathan Garcia",
    avatar: "",
    commission: 1800,
    sales: 4,
    points: 580,
    streak: 0,
    badges: []
  },
  {
    id: "user-10",
    rank: 10,
    previousRank: 10,
    name: "Chloé Martinez",
    avatar: "",
    commission: 1500,
    sales: 3,
    points: 420,
    streak: 0,
    badges: []
  }
]

function getRankChange(current: number, previous: number) {
  if (current < previous) return { direction: "up" as const, value: previous - current }
  if (current > previous) return { direction: "down" as const, value: current - previous }
  return { direction: "same" as const, value: 0 }
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
        <Crown className="w-6 h-6 text-white" />
      </div>
    )
  }
  if (rank === 2) {
    return (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center shadow-lg shadow-gray-400/30">
        <Medal className="w-6 h-6 text-white" />
      </div>
    )
  }
  if (rank === 3) {
    return (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
        <Medal className="w-6 h-6 text-white" />
      </div>
    )
  }
  return (
    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
      <span className="text-lg font-bold text-gray-600">{rank}</span>
    </div>
  )
}

function Podium() {
  const top3 = mockLeaderboardData.slice(0, 3)
  const [first, second, third] = top3

  return (
    <div className="flex items-end justify-center gap-4 py-8">
      {/* Second Place */}
      <div className="flex flex-col items-center">
        <Avatar className="w-16 h-16 border-4 border-gray-300 shadow-lg">
          <AvatarImage src={second.avatar} />
          <AvatarFallback className="bg-gray-200 text-xl font-bold">
            {second.name.split(" ").map(n => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <p className="font-semibold mt-2 text-gray-900">{second.name}</p>
        <p className="text-sm text-gray-500">{second.commission.toLocaleString()}€</p>
        <div className="w-24 h-24 bg-gradient-to-t from-gray-300 to-gray-200 rounded-t-lg mt-4 flex items-center justify-center">
          <span className="text-3xl font-bold text-gray-600">2</span>
        </div>
      </div>

      {/* First Place */}
      <div className="flex flex-col items-center -mt-8">
        <div className="relative">
          <Avatar className="w-20 h-20 border-4 border-amber-400 shadow-lg">
            <AvatarImage src={first.avatar} />
            <AvatarFallback className="bg-amber-100 text-2xl font-bold text-amber-700">
              {first.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -top-3 -right-1">
            <Crown className="w-8 h-8 text-amber-500 drop-shadow-lg" />
          </div>
        </div>
        <p className="font-bold text-lg mt-2 text-gray-900">{first.name}</p>
        <p className="text-sm text-amber-600 font-semibold">{first.commission.toLocaleString()}€</p>
        <div className="w-28 h-32 bg-gradient-to-t from-amber-400 to-amber-300 rounded-t-lg mt-4 flex items-center justify-center">
          <span className="text-4xl font-bold text-white drop-shadow">1</span>
        </div>
      </div>

      {/* Third Place */}
      <div className="flex flex-col items-center">
        <Avatar className="w-16 h-16 border-4 border-orange-300 shadow-lg">
          <AvatarImage src={third.avatar} />
          <AvatarFallback className={`text-xl font-bold ${third.isCurrentUser ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>
            {third.name.split(" ").map(n => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <p className={`font-semibold mt-2 ${third.isCurrentUser ? "text-blue-700" : "text-gray-900"}`}>
          {third.name}
          {third.isCurrentUser && <span className="text-xs text-blue-500 ml-1">(vous)</span>}
        </p>
        <p className="text-sm text-gray-500">{third.commission.toLocaleString()}€</p>
        <div className="w-24 h-20 bg-gradient-to-t from-orange-400 to-orange-300 rounded-t-lg mt-4 flex items-center justify-center">
          <span className="text-3xl font-bold text-white">3</span>
        </div>
      </div>
    </div>
  )
}

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>("month")
  const [metricType, setMetricType] = useState<MetricType>("commission")

  const periodLabels: Record<Period, string> = {
    day: "Aujourd'hui",
    week: "Cette semaine",
    month: "Ce mois",
    quarter: "Ce trimestre",
    year: "Cette année"
  }

  const metricLabels: Record<MetricType, string> = {
    commission: "Commission",
    sales: "Ventes",
    points: "Points"
  }

  const getMetricValue = (seller: typeof mockLeaderboardData[0]) => {
    switch (metricType) {
      case "commission":
        return `${seller.commission.toLocaleString()}€`
      case "sales":
        return `${seller.sales} ventes`
      case "points":
        return `${seller.points.toLocaleString()} pts`
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-500" />
            Classement
          </h1>
          <p className="text-gray-600 mt-1">
            Comparez vos performances avec celles de votre équipe
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
            <SelectTrigger className="w-[160px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Aujourd'hui</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Podium Card */}
      <Card className="overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
        <CardHeader className="text-center pb-0">
          <CardTitle className="text-xl text-gray-800">
            Top 3 - {periodLabels[period]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Podium />
        </CardContent>
      </Card>

      {/* Metric Tabs */}
      <Tabs value={metricType} onValueChange={(v) => setMetricType(v as MetricType)}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="commission" className="flex items-center gap-2">
            <Euro className="w-4 h-4" />
            Commission
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <Car className="w-4 h-4" />
            Ventes
          </TabsTrigger>
          <TabsTrigger value="points" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Points
          </TabsTrigger>
        </TabsList>

        <TabsContent value={metricType} className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {mockLeaderboardData.map((seller) => {
                  const rankChange = getRankChange(seller.rank, seller.previousRank)

                  return (
                    <div
                      key={seller.rank}
                      className={`flex items-center gap-4 p-4 sm:p-5 transition-colors ${
                        seller.isCurrentUser
                          ? "bg-blue-50 border-l-4 border-l-blue-500"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {/* Rank */}
                      <RankBadge rank={seller.rank} />

                      {/* Rank Change */}
                      <div className="w-8 flex justify-center">
                        {rankChange.direction === "up" && (
                          <div className="flex items-center text-emerald-600">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-xs font-medium">{rankChange.value}</span>
                          </div>
                        )}
                        {rankChange.direction === "down" && (
                          <div className="flex items-center text-red-500">
                            <TrendingDown className="w-4 h-4" />
                            <span className="text-xs font-medium">{rankChange.value}</span>
                          </div>
                        )}
                        {rankChange.direction === "same" && (
                          <Minus className="w-4 h-4 text-gray-400" />
                        )}
                      </div>

                      {/* Avatar & Name */}
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={seller.avatar} />
                        <AvatarFallback className={seller.isCurrentUser ? "bg-blue-600 text-white" : "bg-gray-200"}>
                          {seller.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold ${seller.isCurrentUser ? "text-blue-700" : "text-gray-900"}`}>
                          {seller.name}
                          {seller.isCurrentUser && (
                            <span className="text-xs text-blue-500 ml-2">(vous)</span>
                          )}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {seller.streak >= 3 && (
                            <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                              <Flame className="w-3 h-3 mr-1" />
                              {seller.streak}j
                            </Badge>
                          )}
                          {seller.badges.slice(0, 2).map((badge, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                          {seller.badges.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{seller.badges.length - 2}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Metric Value */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {getMetricValue(seller)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {metricType === "commission" && `${seller.sales} ventes`}
                          {metricType === "sales" && `${seller.commission.toLocaleString()}€`}
                          {metricType === "points" && `${seller.sales} ventes`}
                        </p>
                      </div>

                      {/* Challenge Button */}
                      {!seller.isCurrentUser && (
                        <div className="hidden sm:block">
                          <ChallengeButton
                            targetUser={{
                              id: seller.id,
                              name: seller.name,
                              avatar: seller.avatar
                            }}
                            variant="compact"
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Your Position Highlight */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-blue-100 font-medium">Votre position</p>
              <p className="text-3xl font-bold mt-1">
                #{mockLeaderboardData.find(s => s.isCurrentUser)?.rank || "-"}
                <span className="text-lg font-normal text-blue-200 ml-2">
                  sur {mockLeaderboardData.length} commerciaux
                </span>
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold">3 450€</p>
                <p className="text-sm text-blue-200">Commission</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-blue-200">Ventes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">1 450</p>
                <p className="text-sm text-blue-200">Points</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
