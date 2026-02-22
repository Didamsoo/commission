"use client"

import { useApi } from "./use-api"
import { apiFetch } from "@/lib/api/client"

export function useApprobations(status?: string) {
  const params = new URLSearchParams()
  if (status) params.set("status", status)
  const qs = params.toString()
  return useApi<unknown[]>(`/api/approbations${qs ? `?${qs}` : ""}`)
}

export async function submitApproval(ficheMargeId: string) {
  return apiFetch("/api/approbations", {
    method: "POST",
    body: JSON.stringify({ fiche_marge_id: ficheMargeId }),
  })
}

export async function reviewApproval(id: string, data: { status: string; comment?: string }) {
  return apiFetch(`/api/approbations/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}
