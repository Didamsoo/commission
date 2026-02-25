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
  Flame,
  Loader2
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
import { useLeaderboard, type LeaderboardEntry } from "@/hooks/use-leaderboard"
import { useProfil } from "@/hooks/use-profil"

type Period = "day" | "week" | "month" | "quarter" | "year"
type MetricType = "commission" | "sales" | "points"

// Period to API param mapping
function periodToApiParam(period: Period): string | undefined {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  switch (period) {
    case "month": return `${year}-${month}`
    default: return undefined
  }
}

function metricToApiParam(metric: MetricType): string {
  switch (metric) {
    case "commission": return "seller_commission"
    case "sales": return "sales_count"
    case "points": return "final_margin"
  }
}

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

function Podium({ entries, currentUserId }: { entries: LeaderboardEntry[]; currentUserId?: string }) {
  if (entries.length < 3) return null
  const [first, second, third] = entries

  return (
    <div className="flex items-end justify-center gap-4 py-8">
      {/* Second Place */}
      <div className="flex flex-col items-center">
        <Avatar className="w-16 h-16 border-4 border-gray-300 shadow-lg">
          <AvatarImage src={second.avatar_url || ""} />
          <AvatarFallback className="bg-gray-200 text-xl font-bold">
            {second.full_name.split(" ").map(n => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <p className="font-semibold mt-2 text-gray-900">{second.full_name}</p>
        <p className="text-sm text-gray-500">{second.total_commission.toLocaleString()}€</p>
        <div className="w-24 h-24 bg-gradient-to-t from-gray-300 to-gray-200 rounded-t-lg mt-4 flex items-center justify-center">
          <span className="text-3xl font-bold text-gray-600">2</span>
        </div>
      </div>

      {/* First Place */}
      <div className="flex flex-col items-center -mt-8">
        <div className="relative">
          <Avatar className="w-20 h-20 border-4 border-amber-400 shadow-lg">
            <AvatarImage src={first.avatar_url || ""} />
            <AvatarFallback className="bg-amber-100 text-2xl font-bold text-amber-700">
              {first.full_name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -top-3 -right-1">
            <Crown className="w-8 h-8 text-amber-500 drop-shadow-lg" />
          </div>
        </div>
        <p className="font-bold text-lg mt-2 text-gray-900">{first.full_name}</p>
        <p className="text-sm text-amber-600 font-semibold">{first.total_commission.toLocaleString()}€</p>
        <div className="w-28 h-32 bg-gradient-to-t from-amber-400 to-amber-300 rounded-t-lg mt-4 flex items-center justify-center">
          <span className="text-4xl font-bold text-white drop-shadow">1</span>
        </div>
      </div>

      {/* Third Place */}
      <div className="flex flex-col items-center">
        <Avatar className="w-16 h-16 border-4 border-orange-300 shadow-lg">
          <AvatarImage src={third.avatar_url || ""} />
          <AvatarFallback className={`text-xl font-bold ${third.user_id === currentUserId ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>
            {third.full_name.split(" ").map(n => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <p className={`font-semibold mt-2 ${third.user_id === currentUserId ? "text-blue-700" : "text-gray-900"}`}>
          {third.full_name}
          {third.user_id === currentUserId && <span className="text-xs text-blue-500 ml-1">(vous)</span>}
        </p>
        <p className="text-sm text-gray-500">{third.total_commission.toLocaleString()}€</p>
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
  const { data: profil } = useProfil()
  const { data: leaderboardData, loading } = useLeaderboard(
    periodToApiParam(period),
    metricToApiParam(metricType)
  )

  const entries = leaderboardData || []

  const periodLabels: Record<Period, string> = {
    day: "Aujourd'hui",
    week: "Cette semaine",
    month: "Ce mois",
    quarter: "Ce trimestre",
    year: "Cette année"
  }

  const getMetricValue = (entry: LeaderboardEntry) => {
    switch (metricType) {
      case "commission":
        return `${entry.total_commission.toLocaleString()}€`
      case "sales":
        return `${entry.total_sales} ventes`
      case "points":
        return `${entry.total_margin.toLocaleString()}€`
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
          {loading ? (
            <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
          ) : entries.length >= 3 ? (
            <Podium entries={entries} currentUserId={profil?.id} />
          ) : (
            <div className="py-12 text-center text-gray-500">Pas assez de données pour le podium</div>
          )}
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
                {loading ? (
                  <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
                ) : entries.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="font-medium">Aucune donnée pour cette période</p>
                  </div>
                ) : entries.map((entry) => {
                  const isCurrentUser = entry.user_id === profil?.id
                  return (
                    <div
                      key={entry.rank}
                      className={`flex items-center gap-4 p-4 sm:p-5 transition-colors ${
                        isCurrentUser
                          ? "bg-blue-50 border-l-4 border-l-blue-500"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <RankBadge rank={entry.rank} />
                      <div className="w-8 flex justify-center">
                        <Minus className="w-4 h-4 text-gray-400" />
                      </div>
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={entry.avatar_url || ""} />
                        <AvatarFallback className={isCurrentUser ? "bg-blue-600 text-white" : "bg-gray-200"}>
                          {entry.full_name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold ${isCurrentUser ? "text-blue-700" : "text-gray-900"}`}>
                          {entry.full_name}
                          {isCurrentUser && <span className="text-xs text-blue-500 ml-2">(vous)</span>}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{entry.total_sales} ventes</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{getMetricValue(entry)}</p>
                        <p className="text-sm text-gray-500">
                          {metricType === "commission" && `${entry.total_sales} ventes`}
                          {metricType === "sales" && `${entry.total_commission.toLocaleString()}€`}
                          {metricType === "points" && `${entry.total_sales} ventes`}
                        </p>
                      </div>
                      {!isCurrentUser && (
                        <div className="hidden sm:block">
                          <ChallengeButton
                            targetUser={{
                              id: entry.user_id,
                              name: entry.full_name,
                              avatar: entry.avatar_url || ""
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
      {(() => {
        const myEntry = entries.find(e => e.user_id === profil?.id)
        if (!myEntry) return null
        return (
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-blue-100 font-medium">Votre position</p>
                  <p className="text-3xl font-bold mt-1">
                    #{myEntry.rank}
                    <span className="text-lg font-normal text-blue-200 ml-2">
                      sur {entries.length} commerciaux
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{myEntry.total_commission.toLocaleString()}€</p>
                    <p className="text-sm text-blue-200">Commission</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{myEntry.total_sales}</p>
                    <p className="text-sm text-blue-200">Ventes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{myEntry.total_margin.toLocaleString()}</p>
                    <p className="text-sm text-blue-200">Marge</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })()}
    </div>
  )
}
