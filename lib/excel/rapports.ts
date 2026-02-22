import * as XLSX from "xlsx"

export interface ExportTeamMember {
  rang: number
  nom: string
  ventes: number
  objectif: number
  taux: string
  marge: string
  gpu: string
  financement: string
}

export interface ExportRapportData {
  title: string
  period: string
  teamMembers: ExportTeamMember[]
  kpis?: {
    totalSales: number
    totalMargin: number
    avgGPU: number
    financingRate: number
    objectiveRate: number
  }
}

export function exportToExcel(data: ExportRapportData): void {
  const wb = XLSX.utils.book_new()

  // KPIs Sheet
  if (data.kpis) {
    const kpisData = [
      ["Indicateur", "Valeur"],
      ["Ventes totales", data.kpis.totalSales],
      ["Marge totale", `${data.kpis.totalMargin.toLocaleString("fr-FR")} \u20ac`],
      ["GPU moyen", `${data.kpis.avgGPU.toLocaleString("fr-FR")} \u20ac`],
      ["Taux de financement", `${data.kpis.financingRate}%`],
      ["Taux d'objectif", `${data.kpis.objectiveRate}%`],
    ]
    const kpisSheet = XLSX.utils.aoa_to_sheet(kpisData)
    XLSX.utils.book_append_sheet(wb, kpisSheet, "Indicateurs")
  }

  // Team Performance Sheet
  const teamData = [
    ["Rang", "Commercial", "Ventes", "Objectif", "Taux", "Marge", "GPU", "Financement"],
    ...data.teamMembers.map(m => [m.rang, m.nom, m.ventes, m.objectif, m.taux, m.marge, m.gpu, m.financement]),
  ]
  const teamSheet = XLSX.utils.aoa_to_sheet(teamData)
  XLSX.utils.book_append_sheet(wb, teamSheet, "Performance Equipe")

  const safePeriod = data.period.replace(/[^a-zA-Z0-9-]/g, "_")
  XLSX.writeFile(wb, `rapport-${safePeriod}-${Date.now()}.xlsx`)
}

export function exportToCSV(data: ExportTeamMember[], period?: string): void {
  const headers = ["Rang", "Commercial", "Ventes", "Objectif", "Taux", "Marge", "GPU", "Financement"]
  const rows = data.map(m => [m.rang, m.nom, m.ventes, m.objectif, m.taux, m.marge, m.gpu, m.financement])

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Performance")

  const safePeriod = (period || "rapport").replace(/[^a-zA-Z0-9-]/g, "_")
  XLSX.writeFile(wb, `${safePeriod}-${Date.now()}.csv`, { bookType: "csv" })
}
