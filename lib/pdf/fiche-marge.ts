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

export function generateFicheMargePDF(data: FicheMargePDFData): void {
  const doc = new jsPDF()

  // Header
  doc.setFontSize(20)
  doc.setTextColor(37, 99, 235)
  doc.text("Feuille de Marge", 105, 20, { align: "center" })

  doc.setFontSize(10)
  doc.setTextColor(107, 114, 128)
  doc.text("AutoPerf Pro", 105, 28, { align: "center" })

  // Document info
  doc.setFontSize(10)
  doc.setTextColor(55, 65, 81)
  doc.text(`Date: ${data.date}`, 15, 45)
  doc.text(`Type: ${data.vehicleType}`, 15, 52)

  // Vehicle & Client Info
  doc.setFontSize(12)
  doc.setTextColor(17, 24, 39)
  doc.text("Informations", 15, 65)

  autoTable(doc, {
    startY: 70,
    head: [["Champ", "Valeur"]],
    body: [
      ["Modèle", data.vehicleName],
      ["N° Véhicule", data.vehicleNumber],
      ["Vendeur", data.sellerName],
      ["Client", data.clientName],
    ],
    theme: "grid",
    headStyles: { fillColor: [37, 99, 235] },
  })

  // Pricing Details
  const finalY1 = (doc as any).lastAutoTable.finalY || 110
  doc.setFontSize(12)
  doc.text("Détails Financiers", 15, finalY1 + 10)

  const pricingBody: (string | number)[][] = [
    ["Prix d'achat TTC", `${data.purchasePrice.toLocaleString("fr-FR")} €`],
    ["Prix de vente TTC", `${data.sellingPrice.toLocaleString("fr-FR")} €`],
    ["Valeur de reprise HT", `${data.tradeInValue.toLocaleString("fr-FR")} €`],
    ["Préparation HT", `${data.preparationCost.toLocaleString("fr-FR")} €`],
  ]
  if (data.hasWarranty) pricingBody.push(["Garantie", `${data.warrantyAmount.toLocaleString("fr-FR")} €`])
  if (data.hasAccessories) pricingBody.push(["Accessoires TTC", `${data.accessoryAmount.toLocaleString("fr-FR")} €`])

  autoTable(doc, {
    startY: finalY1 + 15,
    head: [["Description", "Montant"]],
    body: pricingBody,
    theme: "grid",
    headStyles: { fillColor: [37, 99, 235] },
  })

  // Options
  const finalY2 = (doc as any).lastAutoTable.finalY || 160
  doc.text("Options & Services", 15, finalY2 + 10)

  autoTable(doc, {
    startY: finalY2 + 15,
    head: [["Service", "Détails"]],
    body: [
      ["Financement", data.hasFinancing ? `Oui - ${data.financedAmount.toLocaleString("fr-FR")} € HT` : "Non"],
      ["Accessoires", data.hasAccessories ? `Oui - ${data.accessoryAmount.toLocaleString("fr-FR")} € TTC` : "Non"],
      ["Garantie", data.hasWarranty ? `Oui - ${data.warrantyAmount.toLocaleString("fr-FR")} €` : "Non"],
      ["Pack livraison", data.deliveryPack === "none" ? "Aucun" : data.deliveryPack.toUpperCase()],
    ],
    theme: "grid",
    headStyles: { fillColor: [37, 99, 235] },
  })

  // Results Summary
  const finalY3 = (doc as any).lastAutoTable.finalY || 200
  doc.setFontSize(14)
  doc.text("Résultats", 15, finalY3 + 10)

  autoTable(doc, {
    startY: finalY3 + 15,
    head: [["Indicateur", "Valeur"]],
    body: [
      ["Chiffre d'affaires total", `${data.totalRevenue.toLocaleString("fr-FR")} €`],
      ["Coûts totaux", `${data.totalCosts.toLocaleString("fr-FR")} €`],
      ["Marge brute", `${data.grossMargin.toLocaleString("fr-FR")} € (${data.marginRate.toFixed(1)}%)`],
      ["Commission vendeur", `${data.commission.toLocaleString("fr-FR")} €`],
      ["Marge nette concession", `${data.netMargin.toLocaleString("fr-FR")} €`],
    ],
    theme: "striped",
    headStyles: { fillColor: [16, 185, 129] },
    bodyStyles: { fontSize: 11 },
  })

  // Footer
  doc.setFontSize(8)
  doc.setTextColor(156, 163, 175)
  doc.text(
    `Généré le ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}`,
    105, 285, { align: "center" }
  )

  doc.save(`fiche-marge-${data.vehicleNumber || Date.now()}.pdf`)
}
