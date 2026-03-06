"use client"

import { useApi } from "./use-api"
import { apiFetch } from "@/lib/api/client"

export function useDefis(status?: string) {
  const params = new URLSearchParams()
  if (status) params.set("status", status)
  const qs = params.toString()
  return useApi<unknown[]>(`/api/defis${qs ? `?${qs}` : ""}`)
}

export async function createDefi(data: Record<string, unknown>) {
  return apiFetch("/api/defis", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function deleteDefi(id: string) {
  return apiFetch(`/api/defis/${id}`, {
    method: "DELETE",
  })
}
