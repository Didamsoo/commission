import { describe, it, expect } from 'vitest'
import { displayValue, mapMarqueToBrand, mapConcessionToDealership } from '../display'

// ---------------------------------------------------------------------------
// displayValue
// ---------------------------------------------------------------------------
describe('displayValue', () => {
  it('returns "N/A" when value is 0', () => {
    expect(displayValue(0)).toBe('N/A')
  })

  it('returns the stringified value when non-zero and no formatter is provided', () => {
    expect(displayValue(42)).toBe('42')
    expect(displayValue(-7)).toBe('-7')
    expect(displayValue(3.14)).toBe('3.14')
  })

  it('uses the formatter when provided', () => {
    expect(displayValue(100, (v) => `${v}€`)).toBe('100€')
    expect(displayValue(50, (v) => `${v}%`)).toBe('50%')
  })

  it('still returns "N/A" when value is 0 even if a formatter is provided', () => {
    expect(displayValue(0, (v) => `${v}€`)).toBe('N/A')
  })
})

// ---------------------------------------------------------------------------
// mapMarqueToBrand
// ---------------------------------------------------------------------------
describe('mapMarqueToBrand', () => {
  const baseBrand = {
    id: 'brand-1',
    name: 'TestBrand',
    total_sales: 120,
    sales_target: 150,
    total_revenue: 5000000,
    total_margin: 360000,
    financing_rate: 72,
    quarterly_growth: 8,
    satisfaction: 88,
    market_share: 12.5,
    director_id: 'dir-1',
    director_name: 'Alice Dupont',
    dealership_count: 5,
    employee_count: 80,
  }

  it('maps snake_case fields to camelCase stats', () => {
    const result = mapMarqueToBrand(baseBrand)
    expect(result.stats.totalSales).toBe(120)
    expect(result.stats.salesTarget).toBe(150)
    expect(result.stats.totalRevenue).toBe(5000000)
    expect(result.stats.totalMargin).toBe(360000)
    expect(result.stats.financingRate).toBe(72)
    expect(result.directorId).toBe('dir-1')
    expect(result.directorName).toBe('Alice Dupont')
    expect(result.dealershipCount).toBe(5)
    expect(result.employeeCount).toBe(80)
  })

  it('computes objectiveRate = round((totalSales / salesTarget) * 1000) / 10', () => {
    const result = mapMarqueToBrand(baseBrand)
    // (120 / 150) * 1000 = 800  → round(800) = 800 → 800 / 10 = 80
    expect(result.stats.objectiveRate).toBe(80)
  })

  it('returns objectiveRate 0 when salesTarget is 0', () => {
    const result = mapMarqueToBrand({ ...baseBrand, sales_target: 0 })
    expect(result.stats.objectiveRate).toBe(0)
  })

  it('computes avgGPU = round(totalMargin / totalSales)', () => {
    const result = mapMarqueToBrand(baseBrand)
    // 360000 / 120 = 3000
    expect(result.stats.avgGPU).toBe(3000)
  })

  it('returns avgGPU 0 when totalSales is 0', () => {
    const result = mapMarqueToBrand({ ...baseBrand, total_sales: 0 })
    expect(result.stats.avgGPU).toBe(0)
  })

  it('falls back to defaults for missing fields', () => {
    const result = mapMarqueToBrand({ id: 'x' })
    expect(result.name).toBe('')
    expect(result.stats.totalSales).toBe(0)
    expect(result.stats.salesTarget).toBe(0)
    expect(result.stats.totalMargin).toBe(0)
    expect(result.stats.avgGPU).toBe(0)
    expect(result.stats.objectiveRate).toBe(0)
    expect(result.directorId).toBe('')
    expect(result.directorName).toBe('')
    expect(result.dealershipCount).toBe(0)
    expect(result.employeeCount).toBe(0)
  })

  it('uses "nom" field when "name" is absent', () => {
    const result = mapMarqueToBrand({ id: 'x', nom: 'Renault' })
    expect(result.name).toBe('Renault')
  })

  it('returns Ford emoji and color for brand name "Ford"', () => {
    const result = mapMarqueToBrand({ ...baseBrand, name: 'Ford' })
    expect(result.logo).toBe('🚙')
    expect(result.color).toBe('from-blue-600 to-blue-700')
  })

  it('falls back to default emoji/color for unknown brand', () => {
    const result = mapMarqueToBrand({ ...baseBrand, name: 'UnknownBrand' })
    expect(result.logo).toBe('🚗')
    expect(result.color).toBe('from-gray-500 to-gray-600')
  })

  it('uses settings.logo and settings.color when provided', () => {
    const result = mapMarqueToBrand({
      ...baseBrand,
      settings: { logo: '🏎️', color: 'from-green-500 to-green-600' },
    })
    expect(result.logo).toBe('🏎️')
    expect(result.color).toBe('from-green-500 to-green-600')
  })

  describe('computeTrend via quarterlyGrowth', () => {
    it('returns "up" when quarterly growth > 5', () => {
      const result = mapMarqueToBrand({ ...baseBrand, quarterly_growth: 10 })
      expect(result.trend).toBe('up')
    })

    it('returns "down" when quarterly growth < -5', () => {
      const result = mapMarqueToBrand({ ...baseBrand, quarterly_growth: -10 })
      expect(result.trend).toBe('down')
    })

    it('returns "stable" when quarterly growth is between -5 and 5', () => {
      expect(mapMarqueToBrand({ ...baseBrand, quarterly_growth: 0 }).trend).toBe('stable')
      expect(mapMarqueToBrand({ ...baseBrand, quarterly_growth: 5 }).trend).toBe('stable')
      expect(mapMarqueToBrand({ ...baseBrand, quarterly_growth: -5 }).trend).toBe('stable')
      expect(mapMarqueToBrand({ ...baseBrand, quarterly_growth: 3 }).trend).toBe('stable')
    })

    it('returns "up" for growth exactly 5.1 (boundary)', () => {
      const result = mapMarqueToBrand({ ...baseBrand, quarterly_growth: 5.1 })
      expect(result.trend).toBe('up')
    })

    it('returns "down" for growth exactly -5.1 (boundary)', () => {
      const result = mapMarqueToBrand({ ...baseBrand, quarterly_growth: -5.1 })
      expect(result.trend).toBe('down')
    })
  })

  it('also accepts camelCase input fields', () => {
    const camelInput = {
      id: 'brand-2',
      name: 'CamelBrand',
      totalSales: 200,
      salesTarget: 250,
      totalRevenue: 8000000,
      totalMargin: 500000,
      financingRate: 80,
      quarterlyGrowth: -8,
      satisfaction: 90,
      marketShare: 15,
      directorId: 'dir-2',
      directorName: 'Bob Martin',
      dealershipCount: 3,
      employeeCount: 45,
    }
    const result = mapMarqueToBrand(camelInput)
    expect(result.stats.totalSales).toBe(200)
    expect(result.stats.salesTarget).toBe(250)
    expect(result.stats.objectiveRate).toBe(80)
    expect(result.stats.avgGPU).toBe(2500)
    expect(result.trend).toBe('down')
  })
})

// ---------------------------------------------------------------------------
// mapConcessionToDealership
// ---------------------------------------------------------------------------
describe('mapConcessionToDealership', () => {
  const baseConcession = {
    id: 'conc-1',
    name: 'Concession Paris',
    code: 'PAR01',
    city: 'Paris',
    address: '10 rue de Rivoli',
    director_id: 'dir-3',
    director_name: 'Claire Leroy',
    coordinates: { lat: 48.856, lng: 2.352 },
    total_sales: 100,
    sales_target: 120,
    total_margin: 250000,
    financing_rate: 80,
    satisfaction: 90,
    stock_days: 30,
    growth: 3,
    departments: {
      vn: { sales: 60, target: 70, margin: 150000 },
      vo: { sales: 30, target: 35, margin: 70000 },
      vu: { sales: 10, target: 15, margin: 30000 },
    },
  }

  it('maps fields correctly', () => {
    const result = mapConcessionToDealership(baseConcession)
    expect(result.id).toBe('conc-1')
    expect(result.name).toBe('Concession Paris')
    expect(result.code).toBe('PAR01')
    expect(result.location).toBe('Paris')
    expect(result.address).toBe('10 rue de Rivoli')
    expect(result.directorId).toBe('dir-3')
    expect(result.directorName).toBe('Claire Leroy')
    expect(result.coordinates).toEqual({ lat: 48.856, lng: 2.352 })
  })

  it('computes objectiveRate correctly', () => {
    const result = mapConcessionToDealership(baseConcession)
    // (100 / 120) * 1000 = 833.33... → round = 833 → 833 / 10 = 83.3
    expect(result.stats.objectiveRate).toBe(83.3)
  })

  it('computes avgGPU = round(totalMargin / totalSales)', () => {
    const result = mapConcessionToDealership(baseConcession)
    // 250000 / 100 = 2500
    expect(result.stats.avgGPU).toBe(2500)
  })

  it('maps department data from nested object', () => {
    const result = mapConcessionToDealership(baseConcession)
    expect(result.departments.vn).toEqual({ sales: 60, target: 70, margin: 150000 })
    expect(result.departments.vo).toEqual({ sales: 30, target: 35, margin: 70000 })
    expect(result.departments.vu).toEqual({ sales: 10, target: 15, margin: 30000 })
  })

  it('defaults departments to zeros when not provided', () => {
    const noDepts = { ...baseConcession, departments: undefined }
    const result = mapConcessionToDealership(noDepts)
    expect(result.departments.vn).toEqual({ sales: 0, target: 0, margin: 0 })
    expect(result.departments.vo).toEqual({ sales: 0, target: 0, margin: 0 })
    expect(result.departments.vu).toEqual({ sales: 0, target: 0, margin: 0 })
  })

  it('computes trend via computeTrend on growth', () => {
    expect(mapConcessionToDealership({ ...baseConcession, growth: 10 }).trend).toBe('up')
    expect(mapConcessionToDealership({ ...baseConcession, growth: -10 }).trend).toBe('down')
    expect(mapConcessionToDealership({ ...baseConcession, growth: 0 }).trend).toBe('stable')
  })

  describe('alert generation', () => {
    it('adds critical alert when objectiveRate < 90', () => {
      // baseConcession has objectiveRate = 83.3 which is < 90
      const result = mapConcessionToDealership(baseConcession)
      expect(result.alerts).toContainEqual({
        type: 'critical',
        message: 'Objectif VN à risque',
      })
    })

    it('does NOT add critical alert when objectiveRate >= 90', () => {
      const highTarget = { ...baseConcession, total_sales: 100, sales_target: 100 }
      const result = mapConcessionToDealership(highTarget)
      expect(result.alerts.find((a) => a.type === 'critical')).toBeUndefined()
    })

    it('adds warning alert when stockDays > 50', () => {
      const highStock = { ...baseConcession, stock_days: 60, total_sales: 100, sales_target: 100 }
      const result = mapConcessionToDealership(highStock)
      expect(result.alerts).toContainEqual({
        type: 'warning',
        message: 'Stock > 60 jours',
      })
    })

    it('does NOT add stock warning when stockDays <= 50', () => {
      const result = mapConcessionToDealership(baseConcession)
      const stockAlert = result.alerts.find((a) => a.message.includes('Stock'))
      expect(stockAlert).toBeUndefined()
    })

    it('adds warning alert when financingRate < 70', () => {
      const lowFinancing = {
        ...baseConcession,
        financing_rate: 60,
        total_sales: 100,
        sales_target: 100,
      }
      const result = mapConcessionToDealership(lowFinancing)
      expect(result.alerts).toContainEqual({
        type: 'warning',
        message: 'Taux financement bas (60%)',
      })
    })

    it('does NOT add financing warning when financingRate >= 70', () => {
      const highFinancing = { ...baseConcession, total_sales: 100, sales_target: 100 }
      const result = mapConcessionToDealership(highFinancing)
      const finAlert = result.alerts.find((a) => a.message.includes('financement'))
      expect(finAlert).toBeUndefined()
    })

    it('can generate multiple alerts simultaneously', () => {
      const badConcession = {
        ...baseConcession,
        total_sales: 80,
        sales_target: 100,
        stock_days: 60,
        financing_rate: 50,
      }
      const result = mapConcessionToDealership(badConcession)
      expect(result.alerts.length).toBe(3)
      expect(result.alerts[0].type).toBe('critical')
      expect(result.alerts[1].type).toBe('warning')
      expect(result.alerts[2].type).toBe('warning')
    })

    it('uses pre-existing alerts from input when provided', () => {
      const customAlerts = [{ type: 'info' as const, message: 'Custom alert' }]
      const withAlerts = { ...baseConcession, alerts: customAlerts }
      const result = mapConcessionToDealership(withAlerts)
      expect(result.alerts).toEqual(customAlerts)
    })
  })

  it('falls back to "nom" and "adresse" fields', () => {
    const frenchFields = {
      id: 'conc-2',
      nom: 'Concession Lyon',
      adresse: '5 place Bellecour',
      location: 'Lyon',
    }
    const result = mapConcessionToDealership(frenchFields)
    expect(result.name).toBe('Concession Lyon')
    expect(result.address).toBe('5 place Bellecour')
  })

  it('defaults coordinates to {lat: 0, lng: 0} when missing', () => {
    const noCoords = { id: 'conc-3' }
    const result = mapConcessionToDealership(noCoords)
    expect(result.coordinates).toEqual({ lat: 0, lng: 0 })
  })
})
