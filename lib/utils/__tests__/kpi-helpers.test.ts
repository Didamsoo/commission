import { describe, it, expect } from 'vitest'
import { computeTrend, deriveBrandKPIs } from '../kpi-helpers'
import type { DealershipDisplayData } from '@/lib/types/display'

// ---------------------------------------------------------------------------
// Helper to build a minimal DealershipDisplayData for tests
// ---------------------------------------------------------------------------
function makeDealership(overrides: Partial<DealershipDisplayData['stats']> = {}): DealershipDisplayData {
  return {
    id: 'test-id',
    name: 'Test Dealership',
    code: 'TST01',
    location: 'Test City',
    address: '1 Test Street',
    directorId: 'dir-test',
    directorName: 'Test Director',
    coordinates: { lat: 0, lng: 0 },
    stats: {
      totalSales: 100,
      salesTarget: 120,
      objectiveRate: 83.3,
      totalMargin: 250000,
      avgGPU: 2500,
      financingRate: 80,
      satisfaction: 90,
      stockDays: 30,
      ...overrides,
    },
    departments: {
      vn: { sales: 60, target: 70, margin: 150000 },
      vo: { sales: 30, target: 35, margin: 70000 },
      vu: { sales: 10, target: 15, margin: 30000 },
    },
    trend: 'stable',
    alerts: [],
  }
}

// ---------------------------------------------------------------------------
// computeTrend
// ---------------------------------------------------------------------------
describe('computeTrend', () => {
  it('returns 0 when previous is 0', () => {
    expect(computeTrend(100, 0)).toBe(0)
  })

  it('returns 0 when both values are 0', () => {
    expect(computeTrend(0, 0)).toBe(0)
  })

  it('returns positive percentage when current > previous', () => {
    // ((150 - 100) / 100) * 100 = 50%
    expect(computeTrend(150, 100)).toBe(50)
  })

  it('returns negative percentage when current < previous', () => {
    // ((80 - 100) / 100) * 100 = -20%
    expect(computeTrend(80, 100)).toBe(-20)
  })

  it('returns 0 when values are equal', () => {
    expect(computeTrend(100, 100)).toBe(0)
  })

  it('rounds the result to the nearest integer', () => {
    // ((110 - 300) / 300) * 100 = -63.333... → -63
    expect(computeTrend(110, 300)).toBe(-63)
    // ((200 - 300) / 300) * 100 = -33.333... → -33
    expect(computeTrend(200, 300)).toBe(-33)
  })

  it('handles large percentage increases', () => {
    // ((1000 - 10) / 10) * 100 = 9900%
    expect(computeTrend(1000, 10)).toBe(9900)
  })

  it('returns -100 when current is 0 and previous is non-zero', () => {
    expect(computeTrend(0, 50)).toBe(-100)
  })
})

// ---------------------------------------------------------------------------
// deriveBrandKPIs
// ---------------------------------------------------------------------------
describe('deriveBrandKPIs', () => {
  it('sums totalSales, totalTarget, totalMargin across dealerships', () => {
    const d1 = makeDealership({ totalSales: 100, salesTarget: 120, totalMargin: 200000 })
    const d2 = makeDealership({ totalSales: 150, salesTarget: 180, totalMargin: 300000 })
    const kpis = deriveBrandKPIs([d1, d2])

    expect(kpis.volume.current).toBe(250)
    expect(kpis.volume.target).toBe(300)
    expect(kpis.margin.total).toBe(500000)
  })

  it('averages avgGPU, financingRate, satisfaction, stockDays across dealerships', () => {
    const d1 = makeDealership({ avgGPU: 2000, financingRate: 70, satisfaction: 80, stockDays: 40 })
    const d2 = makeDealership({ avgGPU: 3000, financingRate: 90, satisfaction: 100, stockDays: 50 })
    const kpis = deriveBrandKPIs([d1, d2])

    // (2000 + 3000) / 2 = 2500
    expect(kpis.margin.avgGPU).toBe(2500)
    // (70 + 90) / 2 = 80
    expect(kpis.financing.rate).toBe(80)
    // (80 + 100) / 2 = 90
    expect(kpis.satisfaction.nps).toBe(90)
    // (40 + 50) / 2 = 45
    expect(kpis.stock.avgDays).toBe(45)
  })

  it('computes objectiveRate = round((totalSales / totalTarget) * 1000) / 10', () => {
    const d1 = makeDealership({ totalSales: 90, salesTarget: 100 })
    const d2 = makeDealership({ totalSales: 110, salesTarget: 100 })
    const kpis = deriveBrandKPIs([d1, d2])
    // totalSales = 200, totalTarget = 200 → (200/200)*1000 = 1000 → round(1000) = 1000 → 1000/10 = 100
    expect(kpis.volume.objectiveRate).toBe(100)
  })

  it('returns objectiveRate 0 when totalTarget is 0', () => {
    const d1 = makeDealership({ totalSales: 100, salesTarget: 0 })
    const kpis = deriveBrandKPIs([d1])
    expect(kpis.volume.objectiveRate).toBe(0)
  })

  it('sets volume trends to 0 when no perfHistory is provided', () => {
    const d = makeDealership()
    const kpis = deriveBrandKPIs([d])
    expect(kpis.volume.trend).toBe(0)
    expect(kpis.margin.trend).toBe(0)
    expect(kpis.financing.trend).toBe(0)
  })

  it('computes trends from perfHistory when 2+ entries are provided', () => {
    const d = makeDealership()
    const history = [
      { sales: 100, margin: 200000, financingRate: 70 },
      { sales: 120, margin: 250000, financingRate: 75 },
    ]
    const kpis = deriveBrandKPIs([d], history)
    // volume: ((120 - 100) / 100) * 100 = 20%
    expect(kpis.volume.trend).toBe(20)
    // margin: ((250000 - 200000) / 200000) * 100 = 25%
    expect(kpis.margin.trend).toBe(25)
    // financing: 75 - 70 = 5 (raw diff, not percentage)
    expect(kpis.financing.trend).toBe(5)
  })

  it('uses the last two entries of perfHistory for trends', () => {
    const d = makeDealership()
    const history = [
      { sales: 50, margin: 100000, financingRate: 60 },
      { sales: 80, margin: 150000, financingRate: 65 },
      { sales: 100, margin: 200000, financingRate: 72 },
    ]
    const kpis = deriveBrandKPIs([d], history)
    // volume: ((100 - 80) / 80) * 100 = 25%
    expect(kpis.volume.trend).toBe(25)
    // margin: ((200000 - 150000) / 150000) * 100 = 33.33 → 33
    expect(kpis.margin.trend).toBe(33)
    // financing: 72 - 65 = 7
    expect(kpis.financing.trend).toBe(7)
  })

  it('ignores perfHistory with fewer than 2 entries', () => {
    const d = makeDealership()
    const kpis = deriveBrandKPIs([d], [{ sales: 100, margin: 200000, financingRate: 70 }])
    expect(kpis.volume.trend).toBe(0)
    expect(kpis.margin.trend).toBe(0)
    expect(kpis.financing.trend).toBe(0)
  })

  describe('constructorBonus', () => {
    it('sets volumeAchieved = true when objectiveRate >= 100', () => {
      const d = makeDealership({ totalSales: 120, salesTarget: 100 })
      const kpis = deriveBrandKPIs([d])
      expect(kpis.constructorBonus.volumeAchieved).toBe(true)
    })

    it('sets volumeAchieved = false when objectiveRate < 100', () => {
      const d = makeDealership({ totalSales: 90, salesTarget: 100 })
      const kpis = deriveBrandKPIs([d])
      expect(kpis.constructorBonus.volumeAchieved).toBe(false)
    })

    it('sets financingAchieved = true when avgFinancing >= 75', () => {
      const d = makeDealership({ financingRate: 80 })
      const kpis = deriveBrandKPIs([d])
      expect(kpis.constructorBonus.financingAchieved).toBe(true)
    })

    it('sets financingAchieved = false when avgFinancing < 75', () => {
      const d = makeDealership({ financingRate: 60 })
      const kpis = deriveBrandKPIs([d])
      expect(kpis.constructorBonus.financingAchieved).toBe(false)
    })

    it('sets satisfactionAchieved = true when avgSatisfaction >= 85', () => {
      const d = makeDealership({ satisfaction: 90 })
      const kpis = deriveBrandKPIs([d])
      expect(kpis.constructorBonus.satisfactionAchieved).toBe(true)
    })

    it('sets satisfactionAchieved = false when avgSatisfaction < 85', () => {
      const d = makeDealership({ satisfaction: 70 })
      const kpis = deriveBrandKPIs([d])
      expect(kpis.constructorBonus.satisfactionAchieved).toBe(false)
    })

    it('always sets estimated to 125000', () => {
      const d = makeDealership()
      const kpis = deriveBrandKPIs([d])
      expect(kpis.constructorBonus.estimated).toBe(125000)
    })
  })

  it('returns zeros / sensible defaults for an empty dealerships array', () => {
    const kpis = deriveBrandKPIs([])

    expect(kpis.volume.current).toBe(0)
    expect(kpis.volume.target).toBe(0)
    expect(kpis.volume.objectiveRate).toBe(0)
    expect(kpis.margin.total).toBe(0)
    expect(kpis.margin.avgGPU).toBe(0)
    expect(kpis.financing.rate).toBe(0)
    expect(kpis.satisfaction.nps).toBe(0)
    expect(kpis.stock.avgDays).toBe(0)
    expect(kpis.stock.totalUnits).toBe(0)
  })

  it('sets fixed targets for financing, satisfaction, and stock', () => {
    const d = makeDealership()
    const kpis = deriveBrandKPIs([d])
    expect(kpis.financing.target).toBe(75)
    expect(kpis.satisfaction.target).toBe(85)
    expect(kpis.stock.target).toBe(45)
  })

  it('computes margin.target as totalMargin * 1.05 (rounded)', () => {
    const d = makeDealership({ totalMargin: 200000 })
    const kpis = deriveBrandKPIs([d])
    // 200000 * 1.05 = 210000
    expect(kpis.margin.target).toBe(210000)
  })

  it('computes stock.totalUnits as totalSales * 2', () => {
    const d1 = makeDealership({ totalSales: 50 })
    const d2 = makeDealership({ totalSales: 75 })
    const kpis = deriveBrandKPIs([d1, d2])
    // totalSales = 125, totalUnits = 250
    expect(kpis.stock.totalUnits).toBe(250)
  })

  it('satisfaction trend is always 0 (hardcoded)', () => {
    const d = makeDealership()
    const history = [
      { sales: 100, margin: 200000, financingRate: 70 },
      { sales: 120, margin: 250000, financingRate: 75 },
    ]
    const kpis = deriveBrandKPIs([d], history)
    expect(kpis.satisfaction.trend).toBe(0)
  })
})
