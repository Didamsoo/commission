import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export interface FicheMargePDFData {
  vehicleName: string
  vehicleNumber: string
  sellerName: string
  clientName: string
  date: string
  vehicleType: "VO" | "VN" | "VU"
  purchasePrice: number
  sellingPrice: number
  tradeInValue: number
  hasFinancing: boolean
  financedAmount: number
  hasAccessories: boolean
  accessoryAmount: number
  hasWarranty: boolean
  warrantyAmount: number
  preparationCost: number
  deliveryPack: string
  totalRevenue: number
  totalCosts: number
  grossMargin: number
  commission: number
  netMargin: number
  marginRate: number
}

// Safe number formatter that avoids Unicode thin spaces (U+202F)
// which jsPDF cannot render (shows as "/")
function fmt(value: number): string {
  const parts = value.toFixed(2).split(".")
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  const dec = parts[1]
  return dec === "00" ? `${intPart} EUR` : `${intPart},${dec} EUR`
}

export function generateFicheMargePDF(data: FicheMargePDFData): void {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()

  // Header bar
  doc.setFillColor(37, 99, 235)
  doc.rect(0, 0, pageWidth, 28, "F")
  doc.setFontSize(18)
  doc.setTextColor(255, 255, 255)
  doc.text("Feuille de Marge", pageWidth / 2, 13, { align: "center" })
  doc.setFontSize(9)
  doc.text("AutoPerf Pro", pageWidth / 2, 21, { align: "center" })

  // Date & type line
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  doc.text(`Date : ${data.date}`, 15, 36)
  doc.text(`Type : ${data.vehicleType}`, pageWidth - 15, 36, { align: "right" })

  // Info table
  autoTable(doc, {
    startY: 40,
    head: [["Modele", "N. Vehicule", "Vendeur", "Client"]],
    body: [[data.vehicleName, data.vehicleNumber, data.sellerName, data.clientName]],
    theme: "grid",
    headStyles: { fillColor: [37, 99, 235], fontSize: 8, cellPadding: 2 },
    bodyStyles: { fontSize: 8, cellPadding: 2 },
    margin: { left: 15, right: 15 },
  })

  const y1 = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 4

  // Financial details
  doc.setFontSize(10)
  doc.setTextColor(17, 24, 39)
  doc.text("Details Financiers", 15, y1)

  const pricingBody: string[][] = [
    ["Prix d'achat TTC", fmt(data.purchasePrice)],
    ["Prix de vente TTC", fmt(data.sellingPrice)],
    ["Valeur de reprise HT", fmt(data.tradeInValue)],
    ["Preparation HT", fmt(data.preparationCost)],
  ]
  if (data.hasWarranty) pricingBody.push(["Garantie", fmt(data.warrantyAmount)])
  if (data.hasAccessories) pricingBody.push(["Accessoires TTC", fmt(data.accessoryAmount)])

  autoTable(doc, {
    startY: y1 + 2,
    head: [["Description", "Montant"]],
    body: pricingBody,
    theme: "grid",
    headStyles: { fillColor: [37, 99, 235], fontSize: 8, cellPadding: 2 },
    bodyStyles: { fontSize: 8, cellPadding: 2 },
    margin: { left: 15, right: 15 },
  })

  const y2 = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 4

  // Options & services
  doc.setFontSize(10)
  doc.text("Options & Services", 15, y2)

  autoTable(doc, {
    startY: y2 + 2,
    head: [["Service", "Details"]],
    body: [
      ["Financement", data.hasFinancing ? `Oui - ${fmt(data.financedAmount)}` : "Non"],
      ["Accessoires", data.hasAccessories ? `Oui - ${fmt(data.accessoryAmount)}` : "Non"],
      ["Garantie", data.hasWarranty ? `Oui - ${fmt(data.warrantyAmount)}` : "Non"],
      ["Pack livraison", data.deliveryPack === "none" ? "Aucun" : data.deliveryPack.toUpperCase()],
    ],
    theme: "grid",
    headStyles: { fillColor: [37, 99, 235], fontSize: 8, cellPadding: 2 },
    bodyStyles: { fontSize: 8, cellPadding: 2 },
    margin: { left: 15, right: 15 },
  })

  const y3 = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 4

  // Results
  doc.setFontSize(11)
  doc.setTextColor(17, 24, 39)
  doc.text("Resultats", 15, y3)

  autoTable(doc, {
    startY: y3 + 2,
    head: [["Indicateur", "Valeur"]],
    body: [
      ["Chiffre d'affaires total", fmt(data.totalRevenue)],
      ["Couts totaux", fmt(data.totalCosts)],
      ["Marge brute", `${fmt(data.grossMargin)} (${data.marginRate.toFixed(1)}%)`],
      ["Commission vendeur", fmt(data.commission)],
      ["Marge nette concession", fmt(data.netMargin)],
    ],
    theme: "striped",
    headStyles: { fillColor: [16, 185, 129], fontSize: 9, cellPadding: 2.5 },
    bodyStyles: { fontSize: 9, cellPadding: 2.5 },
    margin: { left: 15, right: 15 },
  })

  // Footer
  doc.setFontSize(7)
  doc.setTextColor(156, 163, 175)
  doc.text(
    `Genere le ${data.date}`,
    pageWidth / 2, 287, { align: "center" }
  )

  doc.save(`fiche-marge-${data.vehicleNumber || Date.now()}.pdf`)
}
