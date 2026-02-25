"use client"

import { useApi } from "./use-api"

export function useConcessionsList(marqueId?: string) {
  const params = new URLSearchParams()
  if (marqueId) params.set("marque_id", marqueId)
  const qs = params.toString()
  return useApi<unknown[]>(`/api/concessions/list${qs ? `?${qs}` : ""}`)
}

export function useConcessionDetail(id: string | null) {
  return useApi<unknown>(id ? `/api/concessions/${id}/stats` : null)
}
