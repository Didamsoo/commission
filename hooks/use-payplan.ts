"use client"

import { useApi } from "./use-api"

export function usePayplan(concessionId?: string) {
  const params = new URLSearchParams()
  if (concessionId) params.set("concession_id", concessionId)
  const qs = params.toString()
  return useApi<unknown[]>(`/api/payplan${qs ? `?${qs}` : ""}`)
}
