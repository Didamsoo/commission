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
  vnClientKeyInHandPriceHT?: number | string
  vnClientDeparturePriceHT?: number | string
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
  vnClientKeyInHandPriceHT,
  vnClientDeparturePriceHT,
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

  const getDeliveryPackLabel = (pack: string) => {
    switch (pack) {
      case "pack1": return "Pack 1"
      case "pack2": return "Pack 2"
      case "pack3": return "Pack 3"
      default: return "-"
    }
  }

  const getCldDurationLabel = (duration: string) => {
    switch (duration) {
      case "3-4": return "3-4 ans"
      case "5+": return "5+ ans"
      default: return "-"
    }
  }

  const isVNMode = vehicleType === "VP" && vnClientKeyInHandPriceHT && vnClientDeparturePriceHT
  const displayType = isVNMode ? "VN" : vehicleType

  // Couleurs selon le type
  const getColors = () => {
    if (isVNMode) return { primary: "#059669", light: "#d1fae5", text: "#047857" }
    switch (vehicleType) {
      case "VO": return { primary: "#2563eb", light: "#dbeafe", text: "#1d4ed8" }
      case "VU": return { primary: "#7c3aed", light: "#ede9fe", text: "#6d28d9" }
      default: return { primary: "#2563eb", light: "#dbeafe", text: "#1d4ed8" }
    }
  }

  const colors = getColors()

  // Styles de base
  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      fontSize: "9pt",
      color: "#1f2937",
      lineHeight: 1.4,
      padding: "8mm",
      background: "white",
      maxWidth: "210mm",
      margin: "0 auto",
    } as React.CSSProperties,
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: "8px",
      marginBottom: "12px",
      borderBottom: `2px solid ${colors.primary}`,
    } as React.CSSProperties,
    title: {
      fontSize: "16pt",
      fontWeight: "bold",
      color: colors.primary,
      margin: 0,
    } as React.CSSProperties,
    subtitle: {
      fontSize: "8pt",
      color: "#6b7280",
      margin: 0,
    } as React.CSSProperties,
    badge: {
      display: "inline-block",
      background: colors.primary,
      color: "white",
      padding: "4px 12px",
      borderRadius: "12px",
      fontSize: "10pt",
      fontWeight: "bold",
    } as React.CSSProperties,
    dateInfo: {
      fontSize: "8pt",
      color: "#6b7280",
      marginTop: "4px",
      textAlign: "right" as const,
    } as React.CSSProperties,
    section: {
      border: "1px solid #e5e7eb",
      borderRadius: "6px",
      marginBottom: "8px",
      overflow: "hidden",
    } as React.CSSProperties,
    sectionHeader: {
      background: colors.primary,
      color: "white",
      padding: "4px 10px",
      fontWeight: "bold",
      fontSize: "9pt",
    } as React.CSSProperties,
    sectionBody: {
      padding: "8px 10px",
    } as React.CSSProperties,
    grid: {
      display: "grid",
      gap: "6px 12px",
    } as React.CSSProperties,
    grid4: {
      gridTemplateColumns: "repeat(4, 1fr)",
    } as React.CSSProperties,
    grid3: {
      gridTemplateColumns: "repeat(3, 1fr)",
    } as React.CSSProperties,
    label: {
      fontSize: "7pt",
      color: "#6b7280",
      textTransform: "uppercase" as const,
      letterSpacing: "0.3px",
      marginBottom: "1px",
    } as React.CSSProperties,
    value: {
      fontSize: "9pt",
      fontWeight: "bold",
      color: "#111827",
    } as React.CSSProperties,
    valueHighlight: {
      fontSize: "9pt",
      fontWeight: "bold",
      color: colors.primary,
    } as React.CSSProperties,
    optionsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)",
      gap: "6px",
    } as React.CSSProperties,
    optionActive: {
      textAlign: "center" as const,
      padding: "6px 4px",
      borderRadius: "6px",
      fontSize: "7pt",
      background: colors.light,
      border: `1px solid ${colors.primary}`,
      color: colors.text,
    } as React.CSSProperties,
    optionInactive: {
      textAlign: "center" as const,
      padding: "6px 4px",
      borderRadius: "6px",
      fontSize: "7pt",
      background: "#f3f4f6",
      border: "1px solid #e5e7eb",
      color: "#9ca3af",
    } as React.CSSProperties,
    optionLabel: {
      fontWeight: "bold",
      display: "block",
    } as React.CSSProperties,
    commissionTable: {
      width: "100%",
      borderCollapse: "collapse" as const,
      fontSize: "8pt",
    } as React.CSSProperties,
    commissionTd: {
      padding: "3px 6px",
      borderBottom: "1px solid #f3f4f6",
    } as React.CSSProperties,
    commissionValue: {
      textAlign: "right" as const,
      fontWeight: "bold",
    } as React.CSSProperties,
    commissionZero: {
      color: "#9ca3af",
    } as React.CSSProperties,
    summaryBox: {
      background: colors.light,
      border: `2px solid ${colors.primary}`,
      borderRadius: "8px",
      padding: "10px",
      marginTop: "10px",
    } as React.CSSProperties,
    summaryGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "10px",
      textAlign: "center" as const,
      marginBottom: "8px",
    } as React.CSSProperties,
    summaryLabel: {
      fontSize: "7pt",
      color: "#6b7280",
      textTransform: "uppercase" as const,
    } as React.CSSProperties,
    summaryValue: {
      fontSize: "12pt",
      fontWeight: "bold",
      color: colors.primary,
    } as React.CSSProperties,
    summaryTotal: {
      background: colors.primary,
      color: "white",
      padding: "8px",
      borderRadius: "6px",
      textAlign: "center" as const,
    } as React.CSSProperties,
    summaryTotalLabel: {
      fontSize: "8pt",
    } as React.CSSProperties,
    summaryTotalValue: {
      fontSize: "14pt",
      fontWeight: "bold",
    } as React.CSSProperties,
    signatures: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
      marginTop: "12px",
    } as React.CSSProperties,
    signatureBox: {
      border: "1px solid #e5e7eb",
      borderRadius: "6px",
      overflow: "hidden",
    } as React.CSSProperties,
    signatureHeader: {
      background: "#f3f4f6",
      padding: "4px 10px",
      fontWeight: "bold",
      fontSize: "8pt",
      borderBottom: "1px solid #e5e7eb",
    } as React.CSSProperties,
    signatureContent: {
      padding: "8px 10px",
      minHeight: "50px",
    } as React.CSSProperties,
    signatureRole: {
      fontSize: "7pt",
      color: "#6b7280",
      textAlign: "center" as const,
    } as React.CSSProperties,
    signatureLine: {
      borderTop: "1px solid #9ca3af",
      margin: "25px 20px 0",
    } as React.CSSProperties,
    signatureDate: {
      fontSize: "7pt",
      color: "#6b7280",
      textAlign: "right" as const,
      marginTop: "6px",
    } as React.CSSProperties,
    footer: {
      marginTop: "8px",
      paddingTop: "6px",
      borderTop: "1px solid #e5e7eb",
      display: "flex",
      justifyContent: "space-between",
      fontSize: "7pt",
      color: "#9ca3af",
    } as React.CSSProperties,
  }

  return (
    <>
      <style>{`
        @media screen {
          .print-sheet-container {
            display: none !important;
          }
        }
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          body * {
            visibility: hidden;
          }
          .print-sheet-container,
          .print-sheet-container * {
            visibility: visible !important;
          }
          .print-sheet-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            display: block !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      <div className="print-sheet-container" style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Feuille de Marge</h1>
            <p style={styles.subtitle}>Ford Paris Est</p>
          </div>
          <div>
            <span style={styles.badge}>{displayType}</span>
            <div style={styles.dateInfo}>{new Date().toLocaleDateString("fr-FR")}</div>
          </div>
        </div>

        {/* Informations générales */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>INFORMATIONS GÉNÉRALES</div>
          <div style={styles.sectionBody}>
            <div style={{ ...styles.grid, ...styles.grid4 }}>
              <div>
                <div style={styles.label}>N° Véhicule</div>
                <div style={styles.value}>{vehicleNumber || "N/A"}</div>
              </div>
              <div>
                <div style={styles.label}>Vendeur</div>
                <div style={styles.value}>{sellerName || "N/A"}</div>
              </div>
              <div>
                <div style={styles.label}>Client</div>
                <div style={styles.value}>{clientName || "N/A"}</div>
              </div>
              <div>
                <div style={styles.label}>Date commande</div>
                <div style={styles.value}>{formatDate(orderDate)}</div>
              </div>
            </div>
            <div style={{ ...styles.grid, gridTemplateColumns: "2fr 1fr 1fr", marginTop: "6px" }}>
              <div>
                <div style={styles.label}>Véhicule</div>
                <div style={styles.value}>{vehicleSoldName || "N/A"}</div>
              </div>
              <div>
                <div style={styles.label}>Électrique</div>
                <div style={styles.value}>{isElectricVehicle ? "Oui" : "Non"}</div>
              </div>
              <div>
                <div style={styles.label}>Financement</div>
                <div style={styles.value}>{hasFinancing ? "Oui" : "Non"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Prix & Marge */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>{isVNMode ? "PRIX VN & CALCUL MARGE (5%)" : "PRIX & CALCUL MARGE"}</div>
          <div style={styles.sectionBody}>
            <div style={{ ...styles.grid, ...styles.grid4 }}>
              {isVNMode ? (
                <>
                  <div>
                    <div style={styles.label}>Prix clé en main HT</div>
                    <div style={styles.valueHighlight}>{formatCurrency(vnClientKeyInHandPriceHT)}</div>
                  </div>
                  <div>
                    <div style={styles.label}>Prix départ client HT</div>
                    <div style={styles.valueHighlight}>{formatCurrency(vnClientDeparturePriceHT)}</div>
                  </div>
                  <div>
                    <div style={styles.label}>Marge calculée (5%)</div>
                    <div style={styles.valueHighlight}>{formatCurrency(calculatedResults.vnCalculatedMargin)}</div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div style={styles.label}>Prix achat TTC</div>
                    <div style={styles.value}>{formatCurrency(purchasePriceTTC)}</div>
                  </div>
                  <div>
                    <div style={styles.label}>Prix vente TTC</div>
                    <div style={styles.value}>{formatCurrency(sellingPriceTTC)}</div>
                  </div>
                  <div>
                    <div style={styles.label}>Marge HT initiale</div>
                    <div style={styles.valueHighlight}>{formatCurrency(calculatedResults.initialMarginHT)}</div>
                  </div>
                </>
              )}
              <div>
                <div style={styles.label}>Marge restante HT</div>
                <div style={styles.valueHighlight}>{formatCurrency(calculatedResults.remainingMarginHT)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Services & Options */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>SERVICES & OPTIONS</div>
          <div style={styles.sectionBody}>
            <div style={styles.optionsGrid}>
              <div style={deliveryPackSold !== "none" ? styles.optionActive : styles.optionInactive}>
                <span style={styles.optionLabel}>Pack Livraison</span>
                <span>{getDeliveryPackLabel(deliveryPackSold)}</span>
              </div>
              <div style={cldFordDuration !== "none" ? styles.optionActive : styles.optionInactive}>
                <span style={styles.optionLabel}>CLD Ford</span>
                <span>{getCldDurationLabel(cldFordDuration)}</span>
              </div>
              <div style={hasMaintenanceContract ? styles.optionActive : styles.optionInactive}>
                <span style={styles.optionLabel}>Contrat Entretien</span>
                <span>{hasMaintenanceContract ? "Oui" : "Non"}</span>
              </div>
              <div style={hasCoyote ? styles.optionActive : styles.optionInactive}>
                <span style={styles.optionLabel}>Coyote</span>
                <span>{hasCoyote ? "Oui" : "Non"}</span>
              </div>
              <div style={hasAccessories ? styles.optionActive : styles.optionInactive}>
                <span style={styles.optionLabel}>Accessoires</span>
                <span>{hasAccessories ? "Oui" : "Non"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Détail Commission */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>DÉTAIL COMMISSION VENDEUR</div>
          <div style={styles.sectionBody}>
            <table style={styles.commissionTable}>
              <tbody>
                {vehicleType === "VO" && (
                  <>
                    <tr>
                      <td style={styles.commissionTd}>Commission VO (Base)</td>
                      <td style={{ ...styles.commissionTd, ...styles.commissionValue, ...(calculatedResults.commissionDetails.voBaseCommission === 0 ? styles.commissionZero : {}) }}>
                        {formatCurrency(calculatedResults.commissionDetails.voBaseCommission)}
                      </td>
                      <td style={styles.commissionTd}>Bonus -60 jours</td>
                      <td style={{ ...styles.commissionTd, ...styles.commissionValue, ...(calculatedResults.commissionDetails.voBonus60Days === 0 ? styles.commissionZero : {}) }}>
                        {formatCurrency(calculatedResults.commissionDetails.voBonus60Days)}
                      </td>
                      <td style={styles.commissionTd}>Bonus Prix Affiché</td>
                      <td style={{ ...styles.commissionTd, ...styles.commissionValue, ...(calculatedResults.commissionDetails.voBonusListedPrice === 0 ? styles.commissionZero : {}) }}>
                        {formatCurrency(calculatedResults.commissionDetails.voBonusListedPrice)}
                      </td>
                    </tr>
                    <tr>
                      <td style={styles.commissionTd}>Bonus Financement VO</td>
                      <td style={{ ...styles.commissionTd, ...styles.commissionValue, ...(calculatedResults.commissionDetails.voBonusFinancing === 0 ? styles.commissionZero : {}) }}>
                        {formatCurrency(calculatedResults.commissionDetails.voBonusFinancing)}
                      </td>
                      <td style={styles.commissionTd}>Bonus Électrique</td>
                      <td style={{ ...styles.commissionTd, ...styles.commissionValue, ...(calculatedResults.commissionDetails.voBonusElectricVehicle === 0 ? styles.commissionZero : {}) }}>
                        {formatCurrency(calculatedResults.commissionDetails.voBonusElectricVehicle)}
                      </td>
                      <td style={styles.commissionTd}></td>
                      <td style={styles.commissionTd}></td>
                    </tr>
                  </>
                )}
                {vehicleType === "VP" && (
                  <tr>
                    <td style={styles.commissionTd}>Commission {isVNMode ? "VN" : "VP"}</td>
                    <td style={{ ...styles.commissionTd, ...styles.commissionValue, ...(calculatedResults.commissionDetails.vpCommission === 0 ? styles.commissionZero : {}) }}>
                      {formatCurrency(calculatedResults.commissionDetails.vpCommission)}
                    </td>
                    <td style={styles.commissionTd}></td>
                    <td style={styles.commissionTd}></td>
                    <td style={styles.commissionTd}></td>
                    <td style={styles.commissionTd}></td>
                  </tr>
                )}
                {vehicleType === "VU" && (
                  <tr>
                    <td style={styles.commissionTd}>Commission VU</td>
                    <td style={{ ...styles.commissionTd, ...styles.commissionValue, ...(calculatedResults.commissionDetails.vuCommission === 0 ? styles.commissionZero : {}) }}>
                      {formatCurrency(calculatedResults.commissionDetails.vuCommission)}
                    </td>
                    <td style={styles.commissionTd}></td>
                    <td style={styles.commissionTd}></td>
                    <td style={styles.commissionTd}></td>
                    <td style={styles.commissionTd}></td>
                  </tr>
                )}
                <tr>
                  <td style={styles.commissionTd}>Bonus Financement</td>
                  <td style={{ ...styles.commissionTd, ...styles.commissionValue, ...(calculatedResults.commissionDetails.financingBonus === 0 ? styles.commissionZero : {}) }}>
                    {formatCurrency(calculatedResults.commissionDetails.financingBonus)}
                  </td>
                  <td style={styles.commissionTd}>Bonus Pack Livraison</td>
                  <td style={{ ...styles.commissionTd, ...styles.commissionValue, ...(calculatedResults.commissionDetails.deliveryPackBonus === 0 ? styles.commissionZero : {}) }}>
                    {formatCurrency(calculatedResults.commissionDetails.deliveryPackBonus)}
                  </td>
                  <td style={styles.commissionTd}>Bonus CLD</td>
                  <td style={{ ...styles.commissionTd, ...styles.commissionValue, ...(calculatedResults.commissionDetails.cldBonus === 0 ? styles.commissionZero : {}) }}>
                    {formatCurrency(calculatedResults.commissionDetails.cldBonus)}
                  </td>
                </tr>
                <tr>
                  <td style={styles.commissionTd}>Bonus Entretien</td>
                  <td style={{ ...styles.commissionTd, ...styles.commissionValue, ...(calculatedResults.commissionDetails.maintenanceContractBonus === 0 ? styles.commissionZero : {}) }}>
                    {formatCurrency(calculatedResults.commissionDetails.maintenanceContractBonus)}
                  </td>
                  <td style={styles.commissionTd}>Bonus Coyote</td>
                  <td style={{ ...styles.commissionTd, ...styles.commissionValue, ...(calculatedResults.commissionDetails.coyoteBonus === 0 ? styles.commissionZero : {}) }}>
                    {formatCurrency(calculatedResults.commissionDetails.coyoteBonus)}
                  </td>
                  <td style={styles.commissionTd}>Bonus Accessoires</td>
                  <td style={{ ...styles.commissionTd, ...styles.commissionValue, ...(calculatedResults.commissionDetails.accessoryBonus === 0 ? styles.commissionZero : {}) }}>
                    {formatCurrency(calculatedResults.commissionDetails.accessoryBonus)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Résumé Final */}
        <div style={styles.summaryBox}>
          <div style={styles.summaryGrid}>
            <div>
              <div style={styles.summaryLabel}>Marge Restante HT</div>
              <div style={styles.summaryValue}>{formatCurrency(calculatedResults.remainingMarginHT)}</div>
            </div>
            <div>
              <div style={styles.summaryLabel}>Commission Vendeur</div>
              <div style={styles.summaryValue}>{formatCurrency(calculatedResults.sellerCommission)}</div>
            </div>
            <div>
              <div style={styles.summaryLabel}>Marge Finale (Concess.)</div>
              <div style={styles.summaryValue}>{formatCurrency(calculatedResults.finalMargin)}</div>
            </div>
          </div>
          <div style={styles.summaryTotal}>
            <div style={styles.summaryTotalLabel}>COMMISSION TOTALE VENDEUR</div>
            <div style={styles.summaryTotalValue}>{formatCurrency(calculatedResults.sellerCommission)}</div>
          </div>
        </div>

        {/* Signatures */}
        <div style={styles.signatures}>
          <div style={styles.signatureBox}>
            <div style={styles.signatureHeader}>SIGNATURE VENDEUR</div>
            <div style={styles.signatureContent}>
              <div style={styles.signatureRole}>Nom, Prénom & Signature</div>
              <div style={styles.signatureLine}></div>
              <div style={styles.signatureDate}>Date : ___/___/_____</div>
            </div>
          </div>
          <div style={styles.signatureBox}>
            <div style={styles.signatureHeader}>SIGNATURE DIRECTION</div>
            <div style={styles.signatureContent}>
              <div style={styles.signatureRole}>Chef/Directeur de Vente</div>
              <div style={styles.signatureLine}></div>
              <div style={styles.signatureDate}>Date : ___/___/_____</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <span>Document généré automatiquement - Commission Marge</span>
          <span>N° {vehicleNumber || "N/A"} - {new Date().toLocaleDateString("fr-FR")}</span>
        </div>
      </div>
    </>
  )
}
