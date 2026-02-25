"use client"

import { useApi } from "./use-api"

export function useMarques() {
  return useApi<unknown[]>("/api/marques")
}

export function useMarqueDetail(id: string | null) {
  return useApi<unknown>(id ? `/api/marques/${id}` : null)
}
