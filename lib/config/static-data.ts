// Static configuration data for direction/page.tsx
// Stock and cost data require DMS/accounting integration (not in Supabase)

import type { TeamType } from '@/types/hierarchy'

export interface StockInfoType {
  teamType: TeamType
  totalVehicles: number
  under30Days: number
  between30And60Days: number
  over60Days: number
  avgDaysInStock: number
}

export interface PLCostLine {
  label: string
  category: "cost"
  actual: number
  budget: number
}

export const stockInfo: StockInfoType[] = [
  { teamType: "VN", totalVehicles: 45, under30Days: 32, between30And60Days: 10, over60Days: 3, avgDaysInStock: 28 },
  { teamType: "VO", totalVehicles: 38, under30Days: 18, between30And60Days: 8, over60Days: 12, avgDaysInStock: 35 },
  { teamType: "VU", totalVehicles: 15, under30Days: 12, between30And60Days: 2, over60Days: 1, avgDaysInStock: 22 },
]

// Cost lines for P&L — these come from accounting/DMS, not sales data
export const plCostLines: PLCostLine[] = [
  { label: "Frais de personnel", category: "cost", actual: -45000, budget: -46000 },
  { label: "Loyers et charges", category: "cost", actual: -12000, budget: -12000 },
  { label: "Marketing", category: "cost", actual: -3500, budget: -4000 },
  { label: "Autres charges", category: "cost", actual: -5300, budget: -5000 },
]
