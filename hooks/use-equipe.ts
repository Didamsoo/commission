"use client"

import { useApi } from "./use-api"

export interface EquipeMember {
  user_id: string
  id: string
  full_name: string
  first_name: string | null
  last_name: string | null
  email: string
  phone: string | null
  avatar_url: string | null
  role: string
  level: number
  concession_id: string | null
  equipe_id: string | null
  marque_id: string | null
  groupe_id: string | null
  manager_id: string | null
  is_active: boolean
  equipes?: { id: string; name: string; type: string } | null
  // KPI fields (may be populated by enriched endpoints)
  total_sales?: number
  sales_target?: number
  total_margin?: number
  total_commission?: number
  total_revenue?: number
  financing_rate?: number
  conversion_rate?: number
  total_points?: number
  streak?: number
  trend?: string
  joined_at?: string
}

export function useEquipe(equipeId?: string, concessionId?: string) {
  const params = new URLSearchParams()
  if (equipeId) params.set("equipe_id", equipeId)
  if (concessionId) params.set("concession_id", concessionId)
  const qs = params.toString()
  return useApi<EquipeMember[]>(`/api/equipe${qs ? `?${qs}` : ""}`)
}
