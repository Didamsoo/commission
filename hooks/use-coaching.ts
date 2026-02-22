"use client"

import { useApi } from "./use-api"
import { apiFetch } from "@/lib/api/client"

export function useCoaching(commercialId?: string, type?: string) {
  const params = new URLSearchParams()
  if (commercialId) params.set("commercial_id", commercialId)
  if (type) params.set("type", type)
  const qs = params.toString()
  return useApi<unknown[]>(`/api/coaching${qs ? `?${qs}` : ""}`)
}

export async function createNote(data: Record<string, unknown>) {
  return apiFetch("/api/coaching", {
    method: "POST",
    body: JSON.stringify(data),
  })
}
