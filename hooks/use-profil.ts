"use client"

import { useApi } from "./use-api"
import { apiFetch } from "@/lib/api/client"

export interface ProfilData {
  id: string
  email: string
  full_name: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  avatar_url: string | null
  role: string
  level: number
  concession_id: string | null
  concession_name: string | null
  equipe_id: string | null
  marque_id: string | null
  groupe_id: string | null
  manager_id: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  settings: {
    email_notifications?: boolean
    defi_notifications?: boolean
    vente_notifications?: boolean
    badge_notifications?: boolean
  } | null
}

export function useProfil() {
  return useApi<ProfilData>("/api/profil")
}

export async function updateProfil(data: Partial<ProfilData>) {
  return apiFetch<ProfilData>("/api/profil", {
    method: "PUT",
    body: JSON.stringify(data),
  })
}
