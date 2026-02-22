"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { apiFetch } from "@/lib/api/client"

export interface UserConcession {
  id: string
  concession_id: string
  concession_name: string
  concession_city?: string
  is_active: boolean
  role: string
}

interface ConcessionContextType {
  concessions: UserConcession[]
  activeConcession: UserConcession | null
  loading: boolean
  switchConcession: (concessionId: string) => Promise<void>
  refetch: () => void
}

const ConcessionContext = createContext<ConcessionContextType>({
  concessions: [],
  activeConcession: null,
  loading: true,
  switchConcession: async () => {},
  refetch: () => {},
})

export function useConcessionContext() {
  return useContext(ConcessionContext)
}

export function ConcessionContextProvider({ children }: { children: ReactNode }) {
  const [concessions, setConcessions] = useState<UserConcession[]>([])
  const [loading, setLoading] = useState(true)
  const [trigger, setTrigger] = useState(0)

  const refetch = useCallback(() => setTrigger(t => t + 1), [])

  useEffect(() => {
    setLoading(true)
    apiFetch<UserConcession[]>("/api/concessions/user-concessions")
      .then(res => {
        setConcessions(res.data || [])
      })
      .catch(() => {
        setConcessions([])
      })
      .finally(() => setLoading(false))
  }, [trigger])

  const activeConcession = concessions.find(c => c.is_active) || concessions[0] || null

  const switchConcession = useCallback(async (concessionId: string) => {
    await apiFetch("/api/concessions/switch", {
      method: "POST",
      body: JSON.stringify({ concession_id: concessionId }),
    })
    refetch()
    // Reload the page to refresh all data with new concession
    window.location.reload()
  }, [refetch])

  return (
    <ConcessionContext.Provider value={{ concessions, activeConcession, loading, switchConcession, refetch }}>
      {children}
    </ConcessionContext.Provider>
  )
}
