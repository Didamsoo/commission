// app/static-print-sheet/page.tsx

import { VAT_RATE } from "@/lib/margin-utils"

export default function StaticPrintSheet() {
  // Pre-filled static values - Exemple avec un véhicule neuf (VN)
  const date = "10/08/2025"
  const vehicleNumber = "VN2025001"
  const sellerName = "Adam ELM"
  const clientName = "M. Dupont"
  const vehicleSoldName = "Ford Puma Gen-E"
  const vehicleType = "VN" // Véhicule Neuf
  const isElectricVehicle = true
  const hasFinancing = true
  
  // Nouveaux champs pour VN
  const vnClientKeyInHandPriceHT = 28325 // Prix client clé en main HT
  const vnClientDeparturePriceHT = 27620 // Prix départ client HT
  const vnMarginPercentage = 0.05 // 5%
  const vnCalculatedMargin = vnClientDeparturePriceHT * vnMarginPercentage // 1381€
  
  const totalCommission = 210

  // Derived calculations pour VN
  const calculatedInitialMarginHT = vnCalculatedMargin
  const remainingMarginHT = calculatedInitialMarginHT // No other deductions specified for static
  const finalMargin = remainingMarginHT - totalCommission

  // Commission details for display (distributed to sum to totalCommission)
  const vnBaseCommission = 150 // Commission VN de base
  const financingBonus = 30
  const packBonus = 30 // Pack livraison

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
              Véhicule Neuf (VN)
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
          <div className="section-title-print">💰 PRIX VN & DATES</div>
          <div className="field-print">
            <span className="field-label-print">Prix client clé en main HT :</span>
            <span className="field-value-print">{formatCurrency(vnClientKeyInHandPriceHT)}</span>
          </div>
          <div className="field-print">
            <span className="field-label-print">Prix départ client HT :</span>
            <span className="field-value-print">{formatCurrency(vnClientDeparturePriceHT)}</span>
          </div>
          <div className="field-print">
            <span className="field-label-print">Date commande :</span>
            <span className="field-value-print">15/07/2025</span>
          </div>
          <div className="field-print">
            <span className="field-label-print">Date livraison prévue :</span>
            <span className="field-value-print">20/08/2025</span>
          </div>
        </div>
      </div>

      {/* 3. LIGNE 2 - 2 colonnes égales */}
      <div className="row-print">
        <div className="col-2-print section-print">
          <div className="section-title-print">📊 CALCUL MARGE VN (5%)</div>
          <div className="field-print">
            <span className="field-label-print">Base de calcul :</span>
            <span className="field-value-print">{formatCurrency(vnClientDeparturePriceHT)}</span>
          </div>
          <div className="field-print">
            <span className="field-label-print">Pourcentage marge :</span>
            <span className="field-value-print">5,0%</span>
          </div>
          <div className="field-print">
            <span className="field-label-print">Marge HT Calculée :</span>
            <span className="field-value-print highlight-print">{formatCurrency(vnCalculatedMargin)}</span>
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
            <span className="field-value-print">Pack 2 (20€)</span>
          </div>
          <div className="field-print">
            <span className="field-label-print">CLD Ford :</span>
            <span className="field-value-print">5 ans et + (20€)</span>
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
              <span className="field-label-print">Commission VN (Base) :</span>
              <span className="field-value-print">{formatCurrency(vnBaseCommission)}</span>
            </div>
            <div className="field-print small-text-print">
              <span className="field-label-print">Bonus Financement :</span>
              <span className="field-value-print">{formatCurrency(financingBonus)}</span>
            </div>
          </div>
          <div className="col-2-print">
            <div className="field-print small-text-print">
              <span className="field-label-print">Bonus Pack Livraison :</span>
              <span className="field-value-print">{formatCurrency(packBonus)}</span>
            </div>
            <div className="field-print small-text-print">
              <span className="field-label-print">Bonus CLD Ford :</span>
              <span className="field-value-print">0,00 €</span>
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
              <span className="field-label-print">Marge VN (5%) :</span>
              <span className="field-value-print">{formatCurrency(vnCalculatedMargin)}</span>
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
          <div className="section-title-print">✏️ SIGNATURE VENDEUR</div>
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
          <div className="section-title-print">✏️ SIGNATURE DIRECTION</div>
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