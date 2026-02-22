"use client"

import { useApi } from "./use-api"
import { apiFetch } from "@/lib/api/client"

export function useDefisP2P(status?: string) {
  const params = new URLSearchParams()
  if (status) params.set("status", status)
  const qs = params.toString()
  return useApi<unknown[]>(`/api/defis-p2p${qs ? `?${qs}` : ""}`)
}

export async function createDefiP2P(data: Record<string, unknown>) {
  return apiFetch("/api/defis-p2p", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateDefiP2P(id: string, data: Record<string, unknown>) {
  return apiFetch(`/api/defis-p2p/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}
