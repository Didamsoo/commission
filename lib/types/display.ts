// Shared display types for groupe/marque pages
// Maps API data to UI-friendly structures

/** Format a value for display, returning "N/A" when no data is available (value is 0) */
export function displayValue(value: number, formatter?: (v: number) => string): string {
  if (value === 0) return 'N/A'
  return formatter ? formatter(value) : String(value)
}

export interface BrandDisplayData {
  id: string
  name: string
  logo: string
  color: string
  directorId: string
  directorName: string
  dealershipCount: number
  employeeCount: number
  stats: {
    totalSales: number
    salesTarget: number
    objectiveRate: number
    totalRevenue: number
    totalMargin: number
    avgGPU: number
    financingRate: number
    satisfaction: number
    marketShare: number
  }
  trend: "up" | "down" | "stable"
  quarterlyGrowth: number
}

export interface DealershipDisplayData {
  id: string
  name: string
  code: string
  location: string
  address: string
  directorId: string
  directorName: string
  directorAvatar?: string
  coordinates: { lat: number; lng: number }
  stats: {
    totalSales: number
    salesTarget: number
    objectiveRate: number
    totalMargin: number
    avgGPU: number
    financingRate: number
    satisfaction: number
    stockDays: number
  }
  departments: {
    vn: { sales: number; target: number; margin: number }
    vo: { sales: number; target: number; margin: number }
    vu: { sales: number; target: number; margin: number }
  }
  trend: "up" | "down" | "stable"
  alerts: Array<{
    type: "warning" | "critical" | "info"
    message: string
  }>
}

// Default brand colors by name (fallback)
const BRAND_COLORS: Record<string, string> = {
  ford: "from-blue-600 to-blue-700",
  nissan: "from-red-600 to-red-700",
  suzuki: "from-yellow-500 to-yellow-600",
  toyota: "from-red-500 to-red-600",
  renault: "from-yellow-400 to-yellow-500",
  peugeot: "from-blue-500 to-blue-600",
  citroen: "from-red-500 to-red-700",
}

const BRAND_LOGOS: Record<string, string> = {
  ford: "\u{1F699}",
  nissan: "\u{1F697}",
  suzuki: "\u{1F690}",
  toyota: "\u{1F698}",
  renault: "\u{1F697}",
  peugeot: "\u{1F699}",
  citroen: "\u{1F690}",
}

function computeTrend(growth: number): "up" | "down" | "stable" {
  if (growth > 5) return "up"
  if (growth < -5) return "down"
  return "stable"
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapMarqueToBrand(m: any): BrandDisplayData {
  const name = (m.name || m.nom || "").toLowerCase()
  const settings = m.settings || {}
  const totalSales = m.totalSales ?? m.total_sales ?? 0
  const salesTarget = m.salesTarget ?? m.sales_target ?? 0
  const objectiveRate = salesTarget > 0 ? Math.round((totalSales / salesTarget) * 1000) / 10 : 0
  const totalRevenue = m.totalRevenue ?? m.total_revenue ?? 0
  const totalMargin = m.totalMargin ?? m.total_margin ?? 0
  const avgGPU = totalSales > 0 ? Math.round(totalMargin / totalSales) : 0
  const financingRate = m.financingRate ?? m.financing_rate ?? 0
  const quarterlyGrowth = m.quarterlyGrowth ?? m.quarterly_growth ?? 0

  return {
    id: m.id,
    name: m.name || m.nom || "",
    logo: settings.logo || BRAND_LOGOS[name] || "\u{1F697}",
    color: settings.color || BRAND_COLORS[name] || "from-gray-500 to-gray-600",
    directorId: m.directorId ?? m.director_id ?? "",
    directorName: m.directorName ?? m.director_name ?? "",
    dealershipCount: m.dealershipCount ?? m.dealership_count ?? 0,
    employeeCount: m.employeeCount ?? m.employee_count ?? 0,
    stats: {
      totalSales,
      salesTarget,
      objectiveRate,
      totalRevenue,
      totalMargin,
      avgGPU,
      financingRate,
      satisfaction: m.satisfaction ?? 0,
      marketShare: m.marketShare ?? m.market_share ?? 0,
    },
    trend: computeTrend(quarterlyGrowth),
    quarterlyGrowth,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapConcessionToDealership(c: any): DealershipDisplayData {
  const totalSales = c.totalSales ?? c.total_sales ?? 0
  const salesTarget = c.salesTarget ?? c.sales_target ?? 0
  const objectiveRate = salesTarget > 0 ? Math.round((totalSales / salesTarget) * 1000) / 10 : 0
  const totalMargin = c.totalMargin ?? c.total_margin ?? 0
  const avgGPU = totalSales > 0 ? Math.round(totalMargin / totalSales) : 0

  const depts = c.departments || {}
  const vnDept = depts.vn || {}
  const voDept = depts.vo || {}
  const vuDept = depts.vu || {}

  const alerts: DealershipDisplayData["alerts"] = []
  const stockDays = c.stockDays ?? c.stock_days ?? 0
  const financingRate = c.financingRate ?? c.financing_rate ?? 0

  if (objectiveRate < 90) {
    alerts.push({ type: "critical", message: "Objectif VN \u00e0 risque" })
  }
  if (stockDays > 50) {
    alerts.push({ type: "warning", message: `Stock > ${stockDays} jours` })
  }
  if (financingRate < 70) {
    alerts.push({ type: "warning", message: `Taux financement bas (${financingRate}%)` })
  }

  const growth = c.growth ?? 0

  return {
    id: c.id,
    name: c.name || c.nom || "",
    code: c.code || "",
    location: c.city || c.location || "",
    address: c.address || c.adresse || "",
    directorId: c.directorId ?? c.director_id ?? "",
    directorName: c.directorName ?? c.director_name ?? "",
    directorAvatar: c.directorAvatar ?? c.director_avatar,
    coordinates: c.coordinates || { lat: 0, lng: 0 },
    stats: {
      totalSales,
      salesTarget,
      objectiveRate,
      totalMargin,
      avgGPU,
      financingRate,
      satisfaction: c.satisfaction ?? 0,
      stockDays,
    },
    departments: {
      vn: { sales: vnDept.sales ?? 0, target: vnDept.target ?? 0, margin: vnDept.margin ?? 0 },
      vo: { sales: voDept.sales ?? 0, target: voDept.target ?? 0, margin: voDept.margin ?? 0 },
      vu: { sales: vuDept.sales ?? 0, target: vuDept.target ?? 0, margin: vuDept.margin ?? 0 },
    },
    trend: computeTrend(growth),
    alerts: c.alerts || alerts,
  }
}
