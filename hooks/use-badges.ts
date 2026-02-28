"use client"

import { useApi } from "./use-api"

export interface BadgeData {
  id: string
  name: string
  description: string | null
  icon: string | null
  category: string | null
  criteria: Record<string, unknown> | null
  earned: boolean
  earnedAt: string | null
}

export function useBadges() {
  return useApi<BadgeData[]>("/api/badges")
}
