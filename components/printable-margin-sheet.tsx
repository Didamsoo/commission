// printable-margin-sheet.tsx
"use client"

import type { CalculatedResults } from "@/lib/margin-utils"

interface PrintableMarginSheetProps {
  calculatedResults: CalculatedResults
  vehicleNumber: string
  sellerName: string
  clientName: string
  vehicleSoldName: string
  vehicleType: "VO" | "VP" | "VU"
  vpModel: string
  purchasePriceTTC: number | string
  sellingPriceTTC: number | string
  purchaseDate: string
  orderDate: string
  isOtherStockCession: boolean
  hasFinancing: boolean
  isElectricVehicle: boolean
  deliveryPackSold: "none" | "pack1" | "pack2" | "pack3"
  cldFordDuration: "none" | "3-4" | "5+"
  hasMaintenanceContract: boolean
  hasCoyote: boolean
  hasAccessories: boolean
  warranty12Months: number | string
  workshopTransfer: number | string
  preparationHT: number | string
}

export function PrintableMarginSheet({
  calculatedResults,
  vehicleNumber,
  sellerName,
  clientName,
  vehicleSoldName,
  vehicleType,
  vpModel,
  purchasePriceTTC,
  sellingPriceTTC,
  purchaseDate,
  orderDate,
  isOtherStockCession,
  hasFinancing,
  isElectricVehicle,
  deliveryPackSold,
  cldFordDuration,
  hasMaintenanceContract,
  hasCoyote,
  hasAccessories,
  warranty12Months,
  workshopTransfer,
  preparationHT,
}: PrintableMarginSheetProps) {
  const formatCurrency = (value: number | null | undefined | string) => {
    if (value === null || typeof value === "undefined" || value === "") return "0,00 €"
    const numValue = typeof value === "string" ? parseFloat(value) : value
    if (isNaN(numValue)) return "0,00 €"
    return numValue.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR")
  }

  const getVehicleTypeLabel = (type: string) => {
    switch (type) {
      case "VO": return "Véhicule d'Occasion (VO)"
      case "VP": return "Véhicule Particulier (VP)"
      case "VU": return "Véhicule Utilitaire (VU)"
      default: return type
    }
  }

  const getDeliveryPackLabel = (pack: string) => {
    switch (pack) {
      case "pack1": return "Pack 1 (199€)"
      case "pack2": return "Pack 2 (699€)"
      case "pack3": return "Pack 3 (899€)"
      default: return "Aucun Pack"
    }
  }

  const getCldDurationLabel = (duration: string) => {
    switch (duration) {
      case "3-4": return "3 ou 4 ans"
      case "5+": return "5 ans et +"
      default: return "Aucun CLD"
    }
  }

  return (
    <div className="print-only" style={{ display: "none" }}>
      <style jsx>{`
        @media print {
          @page { size: A4; margin: 8mm; }
          .print-only { display: block !important; font-family: Arial, sans-serif; font-size: 10px; }
        
          .section { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; margin-bottom: 6px; }
          .section-title { background: #0ea5e9; color: #fff; padding: 3px 6px; border-radius: 4px 4px 0 0; font-weight: bold; }
          .row { display: grid; gap: 6px; padding: 6px; }
          .grid-2 { grid-template-columns: 1fr 1fr; }
          .grid-3 { grid-template-columns: 1fr 1fr 1fr; }
          .label { color: #475569; }
          .value { font-weight: 700; color: #111827; }
          .hl { color: #059669; font-weight: 800; }
          .total { background: #fee2e2; color: #b91c1c; font-weight: 800; text-align: center; padding: 4px; border-radius: 4px; }

          /* Styles signatures */
          .sig-wrapper { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 8px; }
          .sig-card { border: 1px solid #cbd5e1; border-radius: 6px; background: #e2e8f0; }
          .sig-title { background: #64748b; color: #fff; font-weight: 800; padding: 6px 10px; border-radius: 6px 6px 0 0; }
          .sig-box { background: #f8fafc; border: 2px solid #cbd5e1; border-radius: 4px; margin: 8px; padding: 10px; min-height: 70px; display: grid; gap: 10px; }
          .sig-role { text-align: center; color: #475569; font-weight: 700; }
          .sig-line { height: 0; border-top: 3px solid #94a3b8; margin: 10px 40px 0 40px; }
          .sig-date { text-align: right; color: #475569; font-weight: 600; margin: 6px 40px 4px 0; }
        }
      `}</style>

    

      {/* Informations générales */}
      <div className="section">
        <div className="section-title">📋 INFORMATIONS GÉNÉRALES</div>
        <div className="row grid-2">
          <div><span className="label">Date :</span> <span className="value">{new Date().toLocaleDateString("fr-FR")}</span></div>
          <div><span className="label">N° Véhicule :</span> <span className="value">{vehicleNumber || "N/A"}</span></div>
          <div><span className="label">Vendeur :</span> <span className="value">{sellerName || "N/A"}</span></div>
          <div><span className="label">Client :</span> <span className="value">{clientName || "N/A"}</span></div>
          <div style={{ gridColumn: "1 / -1" }}><span className="label">Véhicule :</span> <span className="value">{vehicleSoldName || "N/A"}</span></div>
        </div>
      </div>

      {/* Détails véhicule */}
      <div className="section">
        <div className="section-title">🚗 DÉTAILS VÉHICULE</div>
        <div className="row grid-3">
          <div><span className="label">Type :</span> <span className="value">{getVehicleTypeLabel(vehicleType)}</span></div>
          {vehicleType === "VP" && vpModel && <div><span className="label">Modèle :</span> <span className="value">{vpModel}</span></div>}
          <div><span className="label">Électrique :</span> <span className="value">{isElectricVehicle ? "✅ Oui" : "❌ Non"}</span></div>
          <div><span className="label">Financement :</span> <span className="value">{hasFinancing ? "✅ Oui" : "❌ Non"}</span></div>
        </div>
      </div>

      {/* PRIX & DATES */}
      <div className="section">
        <div className="section-title">💶 PRIX & DATES</div>
        <div className="row grid-3">
          <div><span className="label">Prix achat TTC :</span> <span className="value">{formatCurrency(purchasePriceTTC)}</span></div>
          <div><span className="label">Prix vente TTC :</span> <span className="value">{formatCurrency(sellingPriceTTC)}</span></div>
          <div><span className="label">Date achat VO :</span> <span className="value">{formatDate(purchaseDate)}</span></div>
          <div><span className="label">Date commande :</span> <span className="value">{formatDate(orderDate)}</span></div>
        </div>
      </div>

      {/* Calcul marge */}
      <div className="section">
        <div className="section-title">📊 CALCUL MARGE</div>
        <div className="row grid-3">
          {isOtherStockCession ? (
            <>
              <div><span className="label">Prix cession TTC :</span> <span className="value">{formatCurrency(1800)}</span></div>
              <div><span className="label">Prix cession HT :</span> <span className="value">{formatCurrency(1800 / 1.2)}</span></div>
            </>
          ) : (
            <>
              <div><span className="label">Prix Achat HT :</span> <span className="value">{formatCurrency(calculatedResults.purchasePriceHT)}</span></div>
              <div><span className="label">Prix Vente HT :</span> <span className="value">{formatCurrency(calculatedResults.sellingPriceHT)}</span></div>
            </>
          )}
          <div><span className="label">Marge HT Initiale :</span> <span className="value">{formatCurrency(calculatedResults.initialMarginHT)}</span></div>
          <div><span className="label">Marge Restante HT :</span> <span className="value hl">{formatCurrency(calculatedResults.remainingMarginHT)}</span></div>
          <div><span className="label">Marge Finale (Concess.) :</span> <span className="value hl">{formatCurrency(calculatedResults.finalMargin)}</span></div>
        </div>
      </div>

      {/* Services & options */}
      <div className="section">
        <div className="section-title">🎁 SERVICES & OPTIONS</div>
        <div className="row grid-3">
          <div><span className="label">Pack Livraison :</span> <span className="value">{getDeliveryPackLabel(deliveryPackSold)}</span></div>
          <div><span className="label">CLD Ford :</span> <span className="value">{getCldDurationLabel(cldFordDuration)}</span></div>
          <div><span className="label">Contrat Entretien :</span> <span className="value">{hasMaintenanceContract ? "✅ Oui" : "❌ Non"}</span></div>
          <div><span className="label">Coyote Tracker :</span> <span className="value">{hasCoyote ? "✅ Oui" : "❌ Non"}</span></div>
          <div><span className="label">Accessoires :</span> <span className="value">{hasAccessories ? "✅ Oui" : "❌ Non"}</span></div>
        </div>
      </div>

      {/* DÉTAIL COMMISSION VENDEUR */}
      <div className="section">
        <div className="section-title">💼 DÉTAIL COMMISSION VENDEUR</div>
        <div className="row grid-3">
          {vehicleType === "VO" && (
            <>
              <div><span className="label">Commission VO (Base) :</span> <span className="value">{formatCurrency(calculatedResults.commissionDetails.voBaseCommission)}</span></div>
              <div><span className="label">Bonus -60 jours :</span> <span className="value">{formatCurrency(calculatedResults.commissionDetails.voBonus60Days)}</span></div>
              <div><span className="label">Bonus Prix Affiché :</span> <span className="value">{formatCurrency(calculatedResults.commissionDetails.voBonusListedPrice)}</span></div>
              <div><span className="label">Bonus Financement VO :</span> <span className="value">{formatCurrency(calculatedResults.commissionDetails.voBonusFinancing)}</span></div>
              <div><span className="label">Bonus Véhicule Électrique :</span> <span className="value">{formatCurrency(calculatedResults.commissionDetails.voBonusElectricVehicle)}</span></div>
            </>
          )}
          {vehicleType === "VP" && (
            <div><span className="label">Commission VP :</span> <span className="value">{formatCurrency(calculatedResults.commissionDetails.vpCommission)}</span></div>
          )}
          {vehicleType === "VU" && (
            <div><span className="label">Commission VU :</span> <span className="value">{formatCurrency(calculatedResults.commissionDetails.vuCommission)}</span></div>
          )}
          <div><span className="label">Bonus Financement :</span> <span className="value">{formatCurrency(calculatedResults.commissionDetails.financingBonus)}</span></div>
          <div><span className="label">Bonus Pack Livraison :</span> <span className="value">{formatCurrency(calculatedResults.commissionDetails.deliveryPackBonus)}</span></div>
          <div><span className="label">Bonus CLD Ford :</span> <span className="value">{formatCurrency(calculatedResults.commissionDetails.cldBonus)}</span></div>
          <div><span className="label">Bonus Contrat Entretien :</span> <span className="value">{formatCurrency(calculatedResults.commissionDetails.maintenanceContractBonus)}</span></div>
          <div><span className="label">Bonus Coyote :</span> <span className="value">{formatCurrency(calculatedResults.commissionDetails.coyoteBonus)}</span></div>
          <div><span className="label">Bonus Accessoires :</span> <span className="value">{formatCurrency(calculatedResults.commissionDetails.accessoryBonus)}</span></div>
        </div>
      </div>

      {/* RÉSUMÉ FINAL */}
      <div className="section">
        <div className="section-title">✅ RÉSUMÉ FINAL</div>
        <div className="row grid-3">
          <div><span className="label">Marge Restante HT :</span> <span className="value hl">{formatCurrency(calculatedResults.remainingMarginHT)}</span></div>
          <div><span className="label">Commission Vendeur :</span> <span className="value hl">{formatCurrency(calculatedResults.sellerCommission)}</span></div>
          <div><span className="label">Marge Finale (Concess.) :</span> <span className="value hl">{formatCurrency(calculatedResults.finalMargin)}</span></div>
          <div style={{ gridColumn: "1 / -1" }} className="total">💰 COMMISSION TOTALE VENDEUR : {formatCurrency(calculatedResults.sellerCommission)}</div>
        </div>
      </div>

      {/* SIGNATURES */}
      <div className="sig-wrapper">
        {/* Signature vendeur */}
        <div className="sig-card">
          <div className="sig-title">✏️ SIGNATURE VENDEUR</div>
          <div className="sig-box">
            <div className="sig-role">Nom, Prénom &amp; Signature</div>
            <div style={{ height: "40px" }} /> {/* espace pour signature */}
            <div className="sig-date">Date : ___/___/_____</div>
          </div>
        </div>

        {/* Signature direction */}
        <div className="sig-card">
          <div className="sig-title">✏️ SIGNATURE DIRECTION</div>
          <div className="sig-box">
            <div className="sig-role">Chef/Directeur de Vente</div>
            <div style={{ height: "40px" }} /> {/* espace pour signature */}
            <div className="sig-date">Date : ___/___/_____</div>
          </div>
        </div>
      </div>
    </div>
  )
}
