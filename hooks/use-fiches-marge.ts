"use client"

import { useApi } from "./use-api"
import { apiFetch } from "@/lib/api/client"

export interface FicheMargeFilters {
  status?: string
  vehicle_type?: string
  date_from?: string
  date_to?: string
  user_id?: string
  limit?: number
  page?: number
}

export function useFichesMarge(filters?: FicheMargeFilters) {
  const params = new URLSearchParams()
  if (filters?.status) params.set("status", filters.status)
  if (filters?.vehicle_type) params.set("vehicle_type", filters.vehicle_type)
  if (filters?.date_from) params.set("date_from", filters.date_from)
  if (filters?.date_to) params.set("date_to", filters.date_to)
  if (filters?.user_id) params.set("user_id", filters.user_id)
  if (filters?.limit) params.set("limit", String(filters.limit))
  if (filters?.page) params.set("page", String(filters.page))
  const qs = params.toString()
  return useApi<unknown[]>(`/api/fiches-marge${qs ? `?${qs}` : ""}`)
}

export async function saveFicheMarge(data: Record<string, unknown>) {
  return apiFetch("/api/fiches-marge", {
    method: "POST",
    body: JSON.stringify(data),
  })
}
