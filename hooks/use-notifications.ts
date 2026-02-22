"use client"

import { useApi } from "./use-api"
import { apiFetch } from "@/lib/api/client"

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  is_read: boolean
  created_at: string
  data?: Record<string, unknown>
}

export function useNotifications(isRead?: boolean) {
  const params = new URLSearchParams()
  if (isRead !== undefined) params.set("is_read", String(isRead))
  const qs = params.toString()
  return useApi<Notification[]>(`/api/notifications${qs ? `?${qs}` : ""}`)
}

export async function markRead(id: string) {
  return apiFetch(`/api/notifications/${id}`, {
    method: "PUT",
    body: JSON.stringify({ is_read: true }),
  })
}

export async function markAllRead() {
  return apiFetch("/api/notifications/read-all", {
    method: "PUT",
  })
}
