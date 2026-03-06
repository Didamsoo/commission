"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { apiFetch, ApiError, type ApiResponse } from "@/lib/api/client"

interface UseApiResult<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
  response: ApiResponse<T> | null
  refetch: () => void
}

function isAbortError(err: unknown): boolean {
  if (err instanceof DOMException && err.name === "AbortError") return true
  if (err instanceof Error && err.name === "AbortError") return true
  if (err instanceof Error && err.message.includes("aborted")) return true
  return false
}

export function useApi<T>(url: string | null): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(url !== null)
  const [error, setError] = useState<ApiError | null>(null)
  const [response, setResponse] = useState<ApiResponse<T> | null>(null)
  const [trigger, setTrigger] = useState(0)
  const abortRef = useRef<AbortController | null>(null)

  const refetch = useCallback(() => {
    setTrigger((t) => t + 1)
  }, [])

  useEffect(() => {
    if (url === null) {
      setData(null)
      setLoading(false)
      setError(null)
      setResponse(null)
      return
    }

    abortRef.current?.abort("cancelled")
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(null)

    apiFetch<T>(url, { signal: controller.signal })
      .then((res) => {
        if (!controller.signal.aborted) {
          setResponse(res)
          setData(res.data ?? null)
          setLoading(false)
        }
      })
      .catch((err) => {
        // Always ignore aborted requests — never update state
        if (controller.signal.aborted || isAbortError(err)) return
        if (err instanceof ApiError) {
          setError(err)
        } else {
          setError(new ApiError(0, err?.message || "Erreur réseau"))
        }
        setLoading(false)
      })

    return () => {
      controller.abort("cleanup")
    }
  }, [url, trigger])

  return { data, loading, error, response, refetch }
}
