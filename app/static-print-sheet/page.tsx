import { VAT_RATE } from "@/lib/margin-utils"

export default function StaticPrintSheet() {
  // Pre-filled static values
  const date = "10/08/2025"
  const vehicleNumber = "66sq"
  const sellerName = "66"
  const clientName = "66sq"
  const vehicleSoldName = "Véhicule d'Occasion (VO)"
  const vehicleType = "VO"
  const isElectricVehicle = true
  const hasFinancing = false // Assuming no financing as not specified
  const purchasePriceTTC = 2002
  const sellingPriceTTC = 10000
  const totalCommission = 210

  // Derived calculations
  const purchasePriceHT = purchasePriceTTC / (1 + VAT_RATE)
  const sellingPriceHT = sellingPriceTTC / (1 + VAT_RATE)
  const initialMarginHT = sellingPriceHT - purchasePriceHT
  const remainingMarginHT = initialMarginHT // No other deductions specified for static
  const finalMargin = remainingMarginHT - totalCommission

  // Commission details for display (distributed to sum to totalCommission)
  const voBaseCommission = 80
  const voBonus60Days = 30
  const voBonusListedPrice = 30
  const voBonusElectricVehicle = 70 // To make it sum up: 80 + 30 + 30 + 70 = 210

  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || typeof value === "undefined") return "N/A"
    return value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })
  }

  return (
    <div className="container-print">
      {/* 1. HEADER */}
      <div className="header-print">💰 FEUILLE DE MARGE RENTA VO/VN/VU</div>

      {/* 2. LIGNE 1 - 3 colonnes égales */}
      <div className="row-print">
        <div className="col-4-print section-print">
          <div className="section-title-print">📋 INFORMATIONS GÉNÉRALES</div>
          <div className="field-print">
            <span className="field-label-print">Date :</span>
            <span className="field-value-print">{date}</span>
          </div>
          <div className="field-print">
            <span className="field-label-print">N° Véhicule :</span>
            <span className="field-value-print">{vehicleNumber}</span>
          </div>
          <div className="field-print">
            <span className="field-label-print">Vendeur :</span>
            <span className="field-value-print">{sellerName}</span>
          </div>
          <div className="field-print">
            <span className="field-label-print">Client :</span>
            <span className="field-value-print">{clientName}</span>
          </div>
        </div>

        <div className="col-4-print section-print">
          <div className="section-title-print">🚗 DÉTAILS VÉHICULE</div>
          <div className="field-print">
            <span className="field-label-print">Type :</span>
            <span className="field-value-print highlight-print">
              {vehicleType === "VO" && "Véhicule d'Occasion (VO)"}
            </span>
          </div>
          <div className="field-print">
            <span className="field-label-print">Modèle :</span>
            <span className="field-value-print">{vehicleSoldName}</span>
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
            <span className="field-value-print">{formatCurrency(purchasePriceTTC)}</span>
          </div>
          <div className="field-print">
            <span className="field-label-print">Prix vente TTC :</span>
            <span className="field-value-print">{formatCurrency(sellingPriceTTC)}</span>
          </div>
          <div className="field-print">
            <span className="field-label-print">Date achat VO :</span>
            <span className="field-value-print">N/A</span>
          </div>
          <div className="field-print">
            <span className="field-label-print">Date commande :</span>
            <span className="field-value-print">N/A</span>
          </div>
        </div>
      </div>

      {/* 3. LIGNE 2 - 2 colonnes égales */}
      <div className="row-print">
        <div className="col-2-print section-print">
          <div className="section-title-print">📊 CALCUL MARGE</div>
          <div className="field-print">
            <span className="field-label-print">Prix Achat HT :</span>
            <span className="field-value-print">{formatCurrency(purchasePriceHT)}</span>
          </div>
          <div className="field-print">
            <span className="field-label-print">Prix Vente HT :</span>
            <span className="field-value-print">{formatCurrency(sellingPriceHT)}</span>
          </div>
          <div className="field-print">
            <span className="field-label-print">Marge HT Initiale :</span>
            <span className="field-value-print">{formatCurrency(initialMarginHT)}</span>
          </div>
          <div className="field-print">
            <span className="field-label-print">Marge Restante HT :</span>
            <span className="field-value-print highlight-print">{formatCurrency(remainingMarginHT)}</span>
          </div>
          <div className="field-print">
            <span className="field-label-print">Marge Finale (Concess.) :</span>
            <span className="field-value-print">{formatCurrency(finalMargin)}</span>
          </div>
        </div>

        <div className="col-2-print section-print">
          <div className="section-title-print">🎁 SERVICES & OPTIONS</div>
          <div className="field-print">
            <span className="field-label-print">Pack Livraison :</span>
            <span className="field-value-print">Aucun Pack</span>
          </div>
          <div className="field-print">
            <span className="field-label-print">CLD Ford :</span>
            <span className="field-value-print">Aucun CLD</span>
          </div>
          <div className="field-print">
            <span className="field-label-print">Contrat Entretien :</span>
            <span className="field-value-print">❌ Non</span>
          </div>
          <div className="field-print">
            <span className="field-label-print">Coyote Tracker :</span>
            <span className="field-value-print">❌ Non</span>
          </div>
          <div className="field-print">
            <span className="field-label-print">Accessoires :</span>
            <span className="field-value-print">❌ Non</span>
          </div>
        </div>
      </div>

      {/* 4. DÉTAIL COMMISSION VENDEUR */}
      <div className="commission-detail-print">
        <div className="commission-title-print">💼 DÉTAIL COMMISSION VENDEUR</div>
        <div className="row-print">
          <div className="col-2-print">
            <div className="field-print small-text-print">
              <span className="field-label-print">Commission VO (Base) :</span>
              <span className="field-value-print">{formatCurrency(voBaseCommission)}</span>
            </div>
            <div className="field-print small-text-print">
              <span className="field-label-print">Bonus {"<"} 60 jours :</span>
              <span className="field-value-print">{formatCurrency(voBonus60Days)}</span>
            </div>
          </div>
          <div className="col-2-print">
            <div className="field-print small-text-print">
              <span className="field-label-print">Bonus Prix Affiché :</span>
              <span className="field-value-print">{formatCurrency(voBonusListedPrice)}</span>
            </div>
            <div className="field-print small-text-print">
              <span className="field-label-print">Bonus Véhicule Électrique :</span>
              <span className="field-value-print">{formatCurrency(voBonusElectricVehicle)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. RÉSUMÉ FINAL */}
      <div className="total-section-print">
        <div className="total-title-print">🎯 RÉSUMÉ FINAL</div>
        <div className="row-print">
          <div className="col-3-print">
            <div className="field-print">
              <span className="field-label-print">Marge Restante HT :</span>
              <span className="field-value-print">{formatCurrency(remainingMarginHT)}</span>
            </div>
          </div>
          <div className="col-3-print">
            <div className="field-print">
              <span className="field-label-print">Commission Vendeur :</span>
              <span className="field-value-print">{formatCurrency(totalCommission)}</span>
            </div>
          </div>
          <div className="col-3-print">
            <div className="field-print">
              <span className="field-label-print">Marge Finale (Concess.) :</span>
              <span className="field-value-print">{formatCurrency(finalMargin)}</span>
            </div>
          </div>
        </div>
        <div className="final-total-print">💰 COMMISSION TOTALE VENDEUR : {formatCurrency(totalCommission)}</div>
      </div>

      {/* 6. SIGNATURES */}
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
