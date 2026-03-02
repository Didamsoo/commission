// Shared KPI derivation helpers
import type { DealershipDisplayData } from '@/lib/types/display'

export interface BrandKPIs {
  volume: {
    current: number
    target: number
    objectiveRate: number
    trend: number
  }
  margin: {
    total: number
    target: number
    avgGPU: number
    trend: number
    isEstimated: boolean
  }
  financing: {
    rate: number
    target: number
    trend: number
  }
  satisfaction: {
    nps: number
    target: number
    trend: number
    hasData: boolean
  }
  stock: {
    avgDays: number
    target: number
    totalUnits: number
    hasData: boolean
  }
  constructorBonus: {
    estimated: number
    isEstimated: boolean
    volumeAchieved: boolean
    financingAchieved: boolean
    satisfactionAchieved: boolean
  }
}

/**
 * Compute trend % change between two consecutive values.
 * Returns 0 if previous is 0.
 */
export function computeTrend(current: number, previous: number): number {
  if (previous === 0) return 0
  return Math.round(((current - previous) / previous) * 100)
}

/**
 * Derive brand-level KPIs from an array of dealership display data.
 * Optionally receives performance history for trend computation.
 */
export function deriveBrandKPIs(
  dealerships: DealershipDisplayData[],
  perfHistory?: { sales?: number; margin?: number; financingRate?: number }[]
): BrandKPIs {
  const count = dealerships.length || 1

  const totalSales = dealerships.reduce((sum, d) => sum + d.stats.totalSales, 0)
  const totalTarget = dealerships.reduce((sum, d) => sum + d.stats.salesTarget, 0)
  const totalMargin = dealerships.reduce((sum, d) => sum + d.stats.totalMargin, 0)
  const avgGPU = Math.round(dealerships.reduce((sum, d) => sum + d.stats.avgGPU, 0) / count)
  const avgFinancing = Math.round(dealerships.reduce((sum, d) => sum + d.stats.financingRate, 0) / count)
  const avgSatisfaction = Math.round(dealerships.reduce((sum, d) => sum + d.stats.satisfaction, 0) / count)
  const avgStock = Math.round(dealerships.reduce((sum, d) => sum + d.stats.stockDays, 0) / count)
  const objectiveRate = totalTarget > 0 ? Math.round((totalSales / totalTarget) * 1000) / 10 : 0

  // Compute trends from performance history if available
  let volumeTrend = 0
  let marginTrend = 0
  let financingTrend = 0
  if (perfHistory && perfHistory.length >= 2) {
    const last = perfHistory[perfHistory.length - 1]
    const prev = perfHistory[perfHistory.length - 2]
    volumeTrend = computeTrend(last.sales ?? 0, prev.sales ?? 0)
    marginTrend = computeTrend(last.margin ?? 0, prev.margin ?? 0)
    financingTrend = (last.financingRate ?? 0) - (prev.financingRate ?? 0)
  }

  // M11: margin target — use totalTarget margin if from team objectives, fallback to +5% estimate
  const marginTarget = totalTarget > 0 ? Math.round(totalTarget * (totalMargin / totalSales || 0)) : Math.round(totalMargin * 1.05)
  const marginIsEstimated = totalTarget === 0

  // M9, M10: satisfaction and stock have no real data source
  const hasSatisfactionData = avgSatisfaction > 0
  const hasStockData = avgStock > 0

  // M8: constructor bonus — estimate based on volume achieved
  const bonusEstimate = totalTarget > 0 ? Math.round(totalTarget * 10) : 0

  return {
    volume: {
      current: totalSales,
      target: totalTarget,
      objectiveRate,
      trend: volumeTrend,
    },
    margin: {
      total: totalMargin,
      target: marginTarget,
      avgGPU,
      trend: marginTrend,
      isEstimated: marginIsEstimated,
    },
    financing: {
      rate: avgFinancing,
      target: 75, // M12: default business target for financing
      trend: financingTrend,
    },
    satisfaction: {
      nps: avgSatisfaction,
      target: 85, // M13: default business target for NPS
      trend: 0, // M9: no historical satisfaction data
      hasData: hasSatisfactionData,
    },
    stock: {
      avgDays: avgStock,
      target: 45, // M14: default business target for stock rotation
      totalUnits: 0, // M10: no real stock data — will be populated when stocks table exists
      hasData: hasStockData,
    },
    constructorBonus: {
      estimated: bonusEstimate, // M8: estimate from targets, not hardcoded
      isEstimated: true,
      volumeAchieved: objectiveRate >= 100,
      financingAchieved: avgFinancing >= 75,
      satisfactionAchieved: avgSatisfaction >= 85,
    },
  }
}
