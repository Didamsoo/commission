"use client"

import { forwardRef } from "react"
import {
  Car,
  User,
  Calendar,
  Euro,
  CheckCircle,
  XCircle,
  Zap,
  FileText,
  CreditCard,
  Package,
  Wrench,
  Shield,
  Award
} from "lucide-react"
import type { CalculatedResults, VNOption, VNDiscount, VNFordRecovery } from "@/lib/margin-utils"
import { Badge } from "@/components/ui/badge"

interface MarginSheetPreviewProps {
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
  financedAmountHT?: number | string
  isElectricVehicle: boolean
  deliveryPackSold: "none" | "pack1" | "pack2" | "pack3"
  cldFordDuration: "none" | "3-4" | "5+"
  hasMaintenanceContract: boolean
  hasCoyote: boolean
  hasAccessories: boolean
  accessoryAmountTTC?: number | string
  warranty12Months: number | string
  workshopTransfer: number | string
  preparationHT: number | string
  vnClientKeyInHandPriceHT?: number | string
  vnClientDeparturePriceHT?: number | string
  vnOptions?: VNOption[]
  vnDiscounts?: VNDiscount[]
  vnFordRecovery?: VNFordRecovery
}

export const MarginSheetPreview = forwardRef<HTMLDivElement, MarginSheetPreviewProps>(({
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
  financedAmountHT,
  isElectricVehicle,
  deliveryPackSold,
  cldFordDuration,
  hasMaintenanceContract,
  hasCoyote,
  hasAccessories,
  accessoryAmountTTC,
  warranty12Months,
  workshopTransfer,
  preparationHT,
  vnClientKeyInHandPriceHT,
  vnClientDeparturePriceHT,
  vnOptions,
  vnDiscounts,
  vnFordRecovery,
}, ref) => {
  const formatCurrency = (value: number | null | undefined | string) => {
    if (value === null || typeof value === "undefined" || value === "") return "0,00 €"
    const numValue = typeof value === "string" ? parseFloat(value) : value
    if (isNaN(numValue)) return "0,00 €"
    return numValue.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Non renseigné"
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
  }

  const isVNMode = vehicleType === "VP" && vnClientKeyInHandPriceHT && vnClientDeparturePriceHT

  const vehicleTypeConfig = {
    VO: { label: "Véhicule d'Occasion", color: "bg-blue-500", bgLight: "bg-blue-50", textColor: "text-blue-700" },
    VP: { label: isVNMode ? "Véhicule Neuf" : "Véhicule Particulier", color: "bg-emerald-500", bgLight: "bg-emerald-50", textColor: "text-emerald-700" },
    VU: { label: "Véhicule Utilitaire", color: "bg-purple-500", bgLight: "bg-purple-50", textColor: "text-purple-700" }
  }

  const config = vehicleTypeConfig[vehicleType]

  const packLabels: Record<string, string> = {
    none: "Aucun",
    pack1: "Pack 1 (199€)",
    pack2: "Pack 2 (699€)",
    pack3: "Pack 3 (899€)"
  }

  const cldLabels: Record<string, string> = {
    none: "Non souscrit",
    "3-4": "3 ou 4 ans",
    "5+": "5 ans et plus"
  }

  return (
    <div ref={ref} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className={`${config.color} text-white p-6`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{vehicleSoldName || "Véhicule"}</h2>
                <p className="text-white/80 text-sm">N° {vehicleNumber || "Non renseigné"}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <Badge className="bg-white/20 text-white hover:bg-white/30 mb-2">
              {isVNMode ? "VN" : vehicleType}
            </Badge>
            <p className="text-sm text-white/80">
              {formatDate(new Date().toISOString())}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Informations générales */}
        <div className="grid grid-cols-2 gap-6">
          <div className={`p-4 rounded-xl ${config.bgLight}`}>
            <div className="flex items-center gap-2 mb-3">
              <User className={`w-5 h-5 ${config.textColor}`} />
              <h3 className={`font-semibold ${config.textColor}`}>Vendeur</h3>
            </div>
            <p className="text-lg font-bold text-gray-900">{sellerName || "Non renseigné"}</p>
          </div>
          <div className={`p-4 rounded-xl ${config.bgLight}`}>
            <div className="flex items-center gap-2 mb-3">
              <User className={`w-5 h-5 ${config.textColor}`} />
              <h3 className={`font-semibold ${config.textColor}`}>Client</h3>
            </div>
            <p className="text-lg font-bold text-gray-900">{clientName || "Non renseigné"}</p>
          </div>
        </div>

        {/* Type et caractéristiques */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 rounded-lg bg-gray-50 text-center">
            <p className="text-xs text-gray-500 mb-1">Type</p>
            <p className="font-semibold text-gray-900">{config.label}</p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 text-center">
            <p className="text-xs text-gray-500 mb-1">Modèle</p>
            <p className="font-semibold text-gray-900">{vpModel || "-"}</p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 text-center">
            <p className="text-xs text-gray-500 mb-1">Électrique</p>
            <div className="flex justify-center">
              {isElectricVehicle ? (
                <Badge className="bg-emerald-100 text-emerald-700">
                  <Zap className="w-3 h-3 mr-1" />
                  Oui
                </Badge>
              ) : (
                <Badge variant="secondary">Non</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Prix et Marge */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Euro className="w-5 h-5 text-gray-600" />
              {isVNMode ? "Prix VN & Marge" : "Prix & Marge"}
            </h3>
          </div>
          <div className="p-4">
            {isVNMode ? (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Prix clé en main HT</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(vnClientKeyInHandPriceHT)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Prix départ client HT</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(vnClientDeparturePriceHT)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Marge VN (5%)</p>
                  <p className="text-lg font-bold text-emerald-600">{formatCurrency(calculatedResults.vnCalculatedMargin)}</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Prix achat TTC</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(purchasePriceTTC)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Prix vente TTC</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(sellingPriceTTC)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Marge initiale HT</p>
                  <p className="text-lg font-bold text-emerald-600">{formatCurrency(calculatedResults.initialMarginHT)}</p>
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Date achat VO</p>
                  <p className="font-medium text-gray-900">{formatDate(purchaseDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Date commande</p>
                  <p className="font-medium text-gray-900">{formatDate(orderDate)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Options VN */}
        {isVNMode && vnOptions && vnOptions.length > 0 && (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-emerald-50 px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-emerald-700 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Options ({vnOptions.length})
              </h3>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {vnOptions.map((option, index) => (
                  <div key={option.id || index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-700">{option.name || `Option ${index + 1}`}</span>
                    <span className="font-semibold">{formatCurrency(option.priceHT)} HT</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2 font-bold">
                  <span>Total Options HT</span>
                  <span className="text-emerald-600">{formatCurrency(calculatedResults.vnTotalOptionsHT)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Services et périphériques */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-gray-600" />
              Services & Options
            </h3>
          </div>
          <div className="p-4 grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Financement</span>
              {hasFinancing ? (
                <Badge className="bg-emerald-100 text-emerald-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {formatCurrency(financedAmountHT)} HT
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <XCircle className="w-3 h-3 mr-1" />
                  Non
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Pack Livraison</span>
              <Badge variant={deliveryPackSold !== "none" ? "default" : "secondary"} className={deliveryPackSold !== "none" ? "bg-blue-100 text-blue-700" : ""}>
                {packLabels[deliveryPackSold]}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">CLD Ford</span>
              <Badge variant={cldFordDuration !== "none" ? "default" : "secondary"} className={cldFordDuration !== "none" ? "bg-purple-100 text-purple-700" : ""}>
                {cldLabels[cldFordDuration]}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Contrat Entretien</span>
              {hasMaintenanceContract ? (
                <Badge className="bg-emerald-100 text-emerald-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Oui
                </Badge>
              ) : (
                <Badge variant="secondary">Non</Badge>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Coyote</span>
              {hasCoyote ? (
                <Badge className="bg-emerald-100 text-emerald-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Oui
                </Badge>
              ) : (
                <Badge variant="secondary">Non</Badge>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Accessoires</span>
              {hasAccessories ? (
                <Badge className="bg-emerald-100 text-emerald-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {formatCurrency(accessoryAmountTTC)} TTC
                </Badge>
              ) : (
                <Badge variant="secondary">Non</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Détail Commission */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Award className="w-5 h-5" />
              Détail Commission Vendeur
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {vehicleType === "VO" && (
                <>
                  <CommissionLine label="Commission VO (Base)" value={calculatedResults.commissionDetails.voBaseCommission} />
                  <CommissionLine label="Bonus -60 jours" value={calculatedResults.commissionDetails.voBonus60Days} />
                  <CommissionLine label="Bonus Prix Affiché" value={calculatedResults.commissionDetails.voBonusListedPrice} />
                  <CommissionLine label="Bonus Véhicule Électrique" value={calculatedResults.commissionDetails.voBonusElectricVehicle} />
                  <CommissionLine label="Bonus Financement VO" value={calculatedResults.commissionDetails.voBonusFinancing} />
                </>
              )}
              {vehicleType === "VP" && (
                <CommissionLine label={`Commission ${isVNMode ? "VN" : "VP"} (${vpModel})`} value={calculatedResults.commissionDetails.vpCommission} />
              )}
              {vehicleType === "VU" && (
                <CommissionLine label="Commission VU" value={calculatedResults.commissionDetails.vuCommission} />
              )}
              <CommissionLine label="Bonus Financement" value={calculatedResults.commissionDetails.financingBonus} />
              <CommissionLine label="Bonus Pack Livraison" value={calculatedResults.commissionDetails.deliveryPackBonus} />
              <CommissionLine label="Bonus Pénétration Pack" value={calculatedResults.commissionDetails.packPenetrationBonus} />
              <CommissionLine label="Bonus CLD Ford" value={calculatedResults.commissionDetails.cldBonus} />
              <CommissionLine label="Bonus Contrat Entretien" value={calculatedResults.commissionDetails.maintenanceContractBonus} />
              <CommissionLine label="Bonus Coyote" value={calculatedResults.commissionDetails.coyoteBonus} />
              <CommissionLine label="Bonus Accessoires" value={calculatedResults.commissionDetails.accessoryBonus} />
            </div>
          </div>
        </div>

        {/* Résumé Final */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-6 text-white">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Résumé Final
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <p className="text-emerald-100 text-sm">Marge Restante HT</p>
              <p className="text-2xl font-bold">{formatCurrency(calculatedResults.remainingMarginHT)}</p>
            </div>
            <div className="text-center p-3 bg-white/20 rounded-lg">
              <p className="text-emerald-100 text-sm">Commission Vendeur</p>
              <p className="text-2xl font-bold">{formatCurrency(calculatedResults.sellerCommission)}</p>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <p className="text-emerald-100 text-sm">Marge Concessionnaire</p>
              <p className="text-2xl font-bold">{formatCurrency(calculatedResults.finalMargin)}</p>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-600 mb-3">Signature Vendeur</p>
            <div className="h-20 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-400 text-sm">Nom, Prénom & Signature</p>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-right">Date : ___/___/_____</p>
          </div>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-600 mb-3">Signature Direction</p>
            <div className="h-20 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-400 text-sm">Chef/Directeur de Vente</p>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-right">Date : ___/___/_____</p>
          </div>
        </div>
      </div>
    </div>
  )
})

MarginSheetPreview.displayName = "MarginSheetPreview"

function CommissionLine({ label, value }: { label: string; value: number }) {
  const formatCurrency = (v: number) =>
    (v || 0).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })

  if (value === 0) return null

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold text-blue-600">{formatCurrency(value)}</span>
    </div>
  )
}
