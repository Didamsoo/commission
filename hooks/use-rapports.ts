"use client"

import { useApi } from "./use-api"

export interface RapportFilters {
  type?: string
  date_from?: string
  date_to?: string
  vehicle_type?: string
  group_by?: string
}

export function useRapports(filters?: RapportFilters) {
  const params = new URLSearchParams()
  if (filters?.type) params.set("type", filters.type)
  if (filters?.date_from) params.set("date_from", filters.date_from)
  if (filters?.date_to) params.set("date_to", filters.date_to)
  if (filters?.vehicle_type) params.set("vehicle_type", filters.vehicle_type)
  if (filters?.group_by) params.set("group_by", filters.group_by)
  const qs = params.toString()
  return useApi<unknown>(`/api/rapports${qs ? `?${qs}` : ""}`)
}
