"use client"

import { useState, useEffect, useRef } from "react"
import { apiFetch } from "@/lib/api/client"

export interface SearchResult {
  id: string
  type: "fiche" | "profile" | "defi" | "concession"
  title: string
  subtitle: string
  href: string
}

interface SearchResults {
  fiches: SearchResult[]
  profiles: SearchResult[]
  defis: SearchResult[]
  concessions: SearchResult[]
}

export function useSearch(query: string) {
  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed.length < 2) {
      setResults(null)
      setLoading(false)
      return
    }

    const timeout = setTimeout(async () => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      setLoading(true)
      try {
        const res = await apiFetch<SearchResults>(
          `/api/search?q=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal }
        )
        if (!controller.signal.aborted) {
          setResults(res.data ?? null)
        }
      } catch {
        // Ignore abort errors
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }, 300) // 300ms debounce

    return () => {
      clearTimeout(timeout)
      abortRef.current?.abort()
    }
  }, [query])

  const allResults: SearchResult[] = results
    ? [...results.fiches, ...results.profiles, ...results.defis, ...results.concessions]
    : []

  return { results, allResults, loading, hasResults: allResults.length > 0 }
}
