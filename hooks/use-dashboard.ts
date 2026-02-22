"use client"

import { useApi } from "./use-api"

export function useDashboard<T = Record<string, unknown>>(
  role: string,
  period?: string,
  dateRange?: { startDate?: string; endDate?: string }
) {
  const params = new URLSearchParams()
  if (dateRange?.startDate && dateRange?.endDate) {
    params.set("startDate", dateRange.startDate)
    params.set("endDate", dateRange.endDate)
  } else if (period) {
    params.set("period", period)
  }
  const qs = params.toString()
  const url = `/api/dashboard/${role}${qs ? `?${qs}` : ""}`
  return useApi<T>(url)
}
