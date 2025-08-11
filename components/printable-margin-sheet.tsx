import { type CalculatedResults, VAT_RATE } from "@/lib/margin-utils"

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
  // New props for costs
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
  // Destructure new props
  warranty12Months,
  workshopTransfer,
  preparationHT,
}: PrintableMarginSheetProps) {
  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || typeof value === "undefined") return "N/A"
    return value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })
  }

  const fixedCessionTTC = 1800
  const fixedCessionHT = fixedCessionTTC / (1 + VAT_RATE)

  return (
    <div className="print-only container-print">
      {/* Header */}
      <div className="header-print">💰 FEUILLE DE MARGE RENTA VO/VN/VU</div>

      {/* LIGNE 1 - Informations Générales, Détails Véhicule, Prix & Dates */}
      <div className="row-print">
        <div className="col-4-print section-print">
          <div className="section-title-print">📋 INFORMATIONS GÉNÉRALES</div>
          <div className="field-print">
            <span className="field-label-print">Date :</span>
            <span className="field-value-print">{new Date().toLocaleDateString("fr-FR")}</span>
          </div>
          <div className="field-print">
            <span className="field-label-print">N° Véhicule :</span>
            <span className="field-value-print">{vehicleNumber || "N/A"}</span>
          </div>
          <div className="field-print">
            <span className="field-label-print">Vendeur :</span>
            <span className="field-value-print">{sellerName || "N/A"}</span>
          </div>
          <div className="field-print">
            <span className="field-label-print">Client :</span>
            <span className="field-value-print">{clientName || "N/A"}</span>
          </div>
        </div>

        <div className="col-4-print section-print">
          <div className="section-title-print">🚗 DÉTAILS VÉHICULE</div>
          <div className="field-print">
            <span className="field-label-print">Type :</span>
            <span className="field-value-print highlight-print">
              {vehicleType === "VO" && "Véhicule d'Occasion (VO)"}
              {vehicleType === "VP" && "Véhicule Particulier (VP) VN/VD"}
              {vehicleType === "VU" && "Véhicule Utilitaire (VU) VN/VD"}
            </span>
          </div>
          <div className="field-print">
            <span className="field-label-print">Modèle :</span>
            <span className="field-value-print">
              {vehicleType === "VP" ? vpModel || "N/A" : vehicleSoldName || "N/A"}
            </span>
          </div>
          <div className="field-print">
            <span className="field-label-print">Électrique :</span>
            <span className="field-value-print">{isElectricVehicle ? "✅ Oui" : "❌ Non"}</span>
          </div>
          <div className="field-print">
            <span className="field-label-print">Financement :</span>
            <span className="field-value-print">{hasFinancing ? "✅ Oui" : "❌ Non"}</span>
          </div>
        </div>

        <div className="col-4-print section-print">
          <div className="section-title-print">💰 PRIX & DATES</div>
          <div className="field-print">
            <span className="field-label-print">Prix achat TTC :</span>
            <span className="field-value-print">{formatCurrency(Number(purchasePriceTTC || 0))}</span>
          </div>
          <div className="field-print">
            <span className="field-label-print">Prix vente TTC :</span>
            <span className="field-value-print">{formatCurrency(Number(sellingPriceTTC || 0))}</span>
          </div>
          <div className="field-print">
            <span className="field-label-print">Date achat VO :</span>
            <span className="field-value-print">{purchaseDate || "N/A"}</span>
          </div>
          <div className="field-print">
            <span className="field-label-print">Date commande :</span>
            <span className="field-value-print">{orderDate || "N/A"}</span>
          </div>
        </div>
      </div>

      {/* LIGNE 2 - Calcul Marge, Services & Options */}
      <div className="row-print">
        <div className="col-2-print section-print">
          <div className="section-title-print">📊 CALCUL MARGE</div>
          <div className="field-print">
            <span className="field-label-print">{isOtherStockCession ? "Prix Cession TTC:" : "Prix Achat HT:"}</span>
            <span className="field-value-print">
              {isOtherStockCession
                ? formatCurrency(fixedCessionTTC)
                : formatCurrency(calculatedResults.purchasePriceHT)}
            </span>
          </div>
          <div className="field-print">
            <span className="field-label-print">{isOtherStockCession ? "Prix Cession HT:" : "Prix Vente HT:"}</span>
            <span className="field-value-print">
              {isOtherStockCession ? formatCurrency(fixedCessionHT) : formatCurrency(calculatedResults.sellingPriceHT)}
            </span>
          </div>
          <div className="field-print">
            <span className="field-label-print">Marge HT Initiale :</span>
            <span className="field-value-print">{formatCurrency(calculatedResults.initialMarginHT)}</span>
          </div>

          {/* Conditional display of costs */}
          {Number(warranty12Months) > 0 && (
            <div className="field-print">
              <span className="field-label-print">Garantie 12 Mois :</span>
              <span className="field-value-print">{formatCurrency(Number(warranty12Months))}</span>
            </div>
          )}
          {Number(workshopTransfer) > 0 && (
            <div className="field-print">
              <span className="field-label-print">Cession Atelier :</span>
              <span className="field-value-print">{formatCurrency(Number(workshopTransfer))}</span>
            </div>
          )}
          {Number(preparationHT) > 0 && (
            <div className="field-print">
              <span className="field-label-print">Préparation HT :</span>
              <span className="field-value-print">{formatCurrency(Number(preparationHT))}</span>
            </div>
          )}

          <div className="field-print">
            <span className="field-label-print">Marge Restante HT :</span>
            <span className="field-value-print highlight-print">
              {formatCurrency(calculatedResults.remainingMarginHT)}
            </span>
          </div>
          <div className="field-print">
            <span className="field-label-print">Marge Finale (Concess.) :</span>
            <span className="field-value-print">{formatCurrency(calculatedResults.finalMargin)}</span>
          </div>
        </div>

        <div className="col-2-print section-print">
          <div className="section-title-print">🎁 SERVICES & OPTIONS</div>
          <div className="field-print">
            <span className="field-label-print">Pack Livraison :</span>
            <span className="field-value-print">
              {deliveryPackSold === "none"
                ? "Aucun Pack"
                : deliveryPackSold === "pack1"
                  ? "Pack 1 (199€)"
                  : deliveryPackSold === "pack2"
                    ? "Pack 2 (699€)"
                    : "Pack 3 (899€)"}
            </span>
          </div>
          <div className="field-print">
            <span className="field-label-print">CLD Ford :</span>
            <span className="field-value-print">
              {cldFordDuration === "none" ? "Aucun CLD" : cldFordDuration === "3-4" ? "3 ou 4 ans" : "5 ans et +"}
            </span>
          </div>
          <div className="field-print">
            <span className="field-label-print">Contrat Entretien :</span>
            <span className="field-value-print">{hasMaintenanceContract ? "✅ Oui" : "❌ Non"}</span>
          </div>
          <div className="field-print">
            <span className="field-label-print">Coyote Tracker :</span>
            <span className="field-value-print">{hasCoyote ? "✅ Oui" : "❌ Non"}</span>
          </div>
          <div className="field-print">
            <span className="field-label-print">Accessoires :</span>
            <span className="field-value-print">{hasAccessories ? "✅ Oui" : "❌ Non"}</span>
          </div>
        </div>
      </div>

      {/* DÉTAIL COMMISSION VENDEUR */}
      <div className="commission-detail-print">
        <div className="commission-title-print">💼 DÉTAIL COMMISSION VENDEUR</div>
        <div className="row-print">
          <div className="col-2-print">
            {vehicleType === "VO" && (
              <div className="field-print small-text-print">
                <span className="field-label-print">Commission VO (Base) :</span>
                <span className="field-value-print">
                  {formatCurrency(calculatedResults.commissionDetails.voBaseCommission)}
                </span>
              </div>
            )}
            {vehicleType === "VP" && (
              <div className="field-print small-text-print">
                <span className="field-label-print">Commission VP :</span>
                <span className="field-value-print">
                  {formatCurrency(calculatedResults.commissionDetails.vpCommission)}
                </span>
              </div>
            )}
            {vehicleType === "VU" && (
              <div className="field-print small-text-print">
                <span className="field-label-print">Commission VU :</span>
                <span className="field-value-print">
                  {formatCurrency(calculatedResults.commissionDetails.vuCommission)}
                </span>
              </div>
            )}
          </div>
          <div className="col-2-print">
            {/* As per screenshot, only base commission is shown here. Other bonuses are not detailed in this section for print. */}
          </div>
        </div>
      </div>

      {/* RÉSUMÉ FINAL */}
      <div className="total-section-print">
        <div className="total-title-print">🎯 RÉSUMÉ FINAL</div>
        <div className="row-print">
          <div className="col-3-print">
            <div className="field-print">
              <span className="field-label-print">Marge Restante HT :</span>
              <span className="field-value-print">{formatCurrency(calculatedResults.remainingMarginHT)}</span>
            </div>
          </div>
          <div className="col-3-print">
            <div className="field-print">
              <span className="field-label-print">Commission Vendeur :</span>
              <span className="field-value-print">{formatCurrency(calculatedResults.sellerCommission)}</span>
            </div>
          </div>
          <div className="col-3-print">
            <div className="field-print">
              <span className="field-label-print">Marge Finale (Concess.) :</span>
              <span className="field-value-print">{formatCurrency(calculatedResults.finalMargin)}</span>
            </div>
          </div>
        </div>
        <div className="final-total-print">
          💰 COMMISSION TOTALE VENDEUR : {formatCurrency(calculatedResults.sellerCommission)}
        </div>
      </div>

      {/* Signatures */}
      <div className="row-print" style={{ marginTop: "8px" }}>
        <div className="col-2-print section-print">
          <div className="section-title-print">✍️ SIGNATURE VENDEUR</div>
          <div style={{ textAlign: "center", padding: "15px 10px" }}>
            <div style={{ borderBottom: "1px solid #94a3b8", marginBottom: "5px", height: "40px" }}></div>
            <div className="small-text-print" style={{ color: "#64748b" }}>
              Nom, Prénom & Signature
            </div>
            <div className="small-text-print" style={{ color: "#64748b", marginTop: "2px" }}>
              Date : ___/___/______
            </div>
          </div>
        </div>

        <div className="col-2-print section-print">
          <div className="section-title-print">✍️ SIGNATURE DIRECTION</div>
          <div style={{ textAlign: "center", padding: "15px 10px" }}>
            <div style={{ borderBottom: "1px solid #94a3b8", marginBottom: "5px", height: "40px" }}></div>
            <div className="small-text-print" style={{ color: "#64748b" }}>
              Chef/Directeur de Vente
            </div>
            <div className="small-text-print" style={{ color: "#64748b", marginTop: "2px" }}>
              Date : ___/___/______
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
