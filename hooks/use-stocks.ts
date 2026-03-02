"use client"

import { useApi } from "./use-api"
import { apiFetch } from "@/lib/api/client"

export interface StockItem {
  id: string
  model: string
  variant: string | null
  vin: string
  concession_id: string
  category: "VN" | "VO" | "VU"
  price: number
  status: "available" | "reserved" | "in_transit" | "sold"
  arrival_date: string
  dealershipName: string
  daysInStock: number
  created_at: string
  updated_at: string
}

export interface StockTransfer {
  id: string
  stock_id: string | null
  vehicle_model: string
  vehicle_vin: string
  from_concession_id: string
  to_concession_id: string
  requested_by: string
  status: "pending" | "approved" | "in_transit" | "completed" | "rejected"
  reason: string | null
  fromDealershipName: string
  toDealershipName: string
  requestedByName: string
  created_at: string
  updated_at: string
}

export function useStocks(concessionId?: string) {
  const params = new URLSearchParams()
  if (concessionId) params.set("concession_id", concessionId)
  const qs = params.toString()
  return useApi<StockItem[]>(`/api/stocks${qs ? `?${qs}` : ""}`)
}

export function useStockTransfers() {
  return useApi<StockTransfer[]>("/api/stock-transfers")
}

export async function updateTransferStatus(id: string, status: string) {
  return apiFetch(`/api/stock-transfers/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  })
}
