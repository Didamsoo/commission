"use client"

import { useApi } from "./use-api"

export interface LeaderboardEntry {
  user_id: string
  full_name: string
  avatar_url: string | null
  role: string
  total_sales: number
  total_margin: number
  total_commission: number
  total_revenue: number
  financing_count: number
  rank: number
}

export function useLeaderboard(period?: string, metric?: string, limit?: number) {
  const params = new URLSearchParams()
  if (period) params.set("period", period)
  if (metric) params.set("metric", metric)
  if (limit) params.set("limit", String(limit))
  const qs = params.toString()
  return useApi<LeaderboardEntry[]>(`/api/leaderboard${qs ? `?${qs}` : ""}`)
}
