"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  calculateMarginSheet,
  type MarginSheet,
  type CalculatedResults,
  type Payplan,
  VAT_RATE,
} from "@/lib/margin-utils"
import { v4 as uuidv4 } from "uuid"
import { CheckCircle, DollarSign, Car, Info, CalendarDays, Printer } from "lucide-react"
import { PrintableMarginSheet } from "./printable-margin-sheet"

interface MarginCalculatorProps {
  onSave: (sheet: MarginSheet) => void
  payplan: Payplan
}

export function MarginCalculator({ onSave, payplan }: MarginCalculatorProps) {
  // General Info
  const [vehicleNumber, setVehicleNumber] = useState("")
  const [sellerName, setSellerName] = useState("")
  const [clientName, setClientName] = useState("")
  const [vehicleSoldName, setVehicleSoldName] = useState("")

  // Vehicle Type Selection
  const [vehicleType, setVehicleType] = useState<"VO" | "VP" | "VU">("VO")

  // Purchase/Sale Details (always visible for VO, VP, VU)
  const [purchasePriceTTC, setPurchasePriceTTC] = useState<number | string>("")
  const [sellingPriceTTC, setSellingPriceTTC] = useState<number | string>("")
  const [tradeInValueHT, setTradeInValueHT] = useState<number | string>("")
  const [isOtherStockCession, setIsOtherStockCession] = useState(false)

  // VP Specific Inputs
  const [vpSalesType, setVpSalesType] = useState<"PART/VD/Prof Lib/Société" | "GC/Loueurs LLD ou LCD">(
    "PART/VD/Prof Lib/Société",
  )
  const [vpModel, setVpModel] = useState<
    | "Carline"
    | "Tourneo Courrier"
    | "Focus"
    | "Kuga"
    | "Explorer"
    | "Capri"
    | "Mach-E"
    | "Tourneo Connect"
    | "Mustang"
    | "Ranger"
    | ""
  >("")

  // VU Specific Inputs
  const [margeFixeVehiculeOptions, setMargeFixeVehiculeOptions] = useState<number | string>("")
  const [margeFordPro, setMargeFordPro] = useState<number | string>("")
  const [margeRepresentationMarque, setMargeRepresentationMarque] = useState<number | string>("")
  const [margeAccessoiresAmenagesVU, setMargeAccessoiresAmenagesVU] = useState<number | string>("")
  const [assistanceConstructeur, setAssistanceConstructeur] = useState<number | string>("")
  const [remiseConsentie, setRemiseConsentie] = useState<number | string>("")

  // Commission-related Inputs (common for all types, but some conditions apply)
  const [purchaseDate, setPurchaseDate] = useState("") // YYYY-MM-DD
  const [orderDate, setOrderDate] = useState("") // YYYY-MM-DD
  const [listedPriceTTC, setListedPriceTTC] = useState<number | string>("")
  const [hasFinancing, setHasFinancing] = useState(false)
  const [financedAmountHT, setFinancedAmountHT] = useState<number | string>("")
  const [financingType, setFinancingType] = useState<"principal" | "specific">("principal") // New for financing
  const [isCreditBailVN, setIsCreditBailVN] = useState(false) // New for financing bonus
  const [isLOAVO, setIsLOAVO] = useState(false) // New for financing bonus
  const [isIDFord25Months, setIsIDFord25Months] = useState(false) // New for financing bonus
  const [isLLDProFordLease, setIsLLDProFordLease] = useState(false) // New for financing bonus

  const [numberOfServicesSold, setNumberOfServicesSold] = useState<"0" | "1" | "2">("0")
  const [deliveryPackSold, setDeliveryPackSold] = useState<"none" | "pack1" | "pack2" | "pack3">("none")
  const [isHighPenetrationRate, setIsHighPenetrationRate] = useState(false)
  const [cldFordDuration, setCldFordDuration] = useState<"none" | "3-4" | "5+">("none") // New for packs
  const [hasMaintenanceContract, setHasMaintenanceContract] = useState(false) // New for packs

  const [isElectricVehicle, setIsElectricVehicle] = useState(false) // Only for VO
  const [hasAccessories, setHasAccessories] = useState(false)
  const [accessoryAmountTTC, setAccessoryAmountTTC] = useState<number | string>("") // Changed to TTC for new rule

  const [hasCoyote, setHasCoyote] = useState(false) // New for Coyote
  const [coyoteDuration, setCoyoteDuration] = useState<"none" | "24" | "36" | "48">("none") // New for Coyote

  // Cost/Deduction/Addition Items (manual inputs that are still needed)
  const [warranty12Months, setWarranty12Months] = useState<number | string>("")
  const [workshopTransfer, setWorkshopTransfer] = useState<number | string>("")
  const [preparationHT, setPreparationHT] = useState<number | string>("")

  // Calculated Results
  const [calculatedResults, setCalculatedResults] = useState<CalculatedResults | null>(null)

  const handleCalculate = () => {
    const inputs = {
      vehicleType,
      purchasePriceTTC: Number(purchasePriceTTC || 0),
      sellingPriceTTC: Number(sellingPriceTTC || 0),
      tradeInValueHT: Number(tradeInValueHT || 0),
      warranty12Months: Number(warranty12Months || 0),
      workshopTransfer: Number(workshopTransfer || 0),
      preparationHT: Number(preparationHT || 0),
      purchaseDate: purchaseDate,
      orderDate: orderDate,
      listedPriceTTC: Number(listedPriceTTC || 0),
      hasFinancing: hasFinancing,
      financedAmountHT: Number(financedAmountHT || 0),
      numberOfServicesSold: Number(numberOfServicesSold),
      deliveryPackSold: deliveryPackSold,
      isHighPenetrationRate: isHighPenetrationRate,
      isElectricVehicle: isElectricVehicle,
      hasAccessories: hasAccessories,
      accessoryAmountHT: 0, // No longer used for calculation, but kept for interface compatibility
      accessoryAmountTTC: Number(accessoryAmountTTC || 0), // New
      isOtherStockCession: isOtherStockCession,
      // New inputs for Payplan
      vpSalesType: vpSalesType,
      vpModel: vpModel,
      margeFixeVehiculeOptions: Number(margeFixeVehiculeOptions || 0),
      margeFordPro: Number(margeFordPro || 0),
      margeRepresentationMarque: Number(margeRepresentationMarque || 0),
      margeAccessoiresAmenagesVU: Number(margeAccessoiresAmenagesVU || 0),
      assistanceConstructeur: Number(assistanceConstructeur || 0),
      remiseConsentie: Number(remiseConsentie || 0),
      financingType: financingType,
      isCreditBailVN: isCreditBailVN,
      isLOAVO: isLOAVO,
      isIDFord25Months: isIDFord25Months,
      isLLDProFordLease: isLLDProFordLease,
      cldFordDuration: cldFordDuration,
      hasMaintenanceContract: hasMaintenanceContract,
      hasCoyote: hasCoyote,
      coyoteDuration: coyoteDuration,
    }

    // Basic validation for numbers
    const numericInputs = [
      purchasePriceTTC,
      sellingPriceTTC,
      tradeInValueHT,
      warranty12Months,
      workshopTransfer,
      preparationHT,
      listedPriceTTC,
      financedAmountHT,
      accessoryAmountTTC,
      margeFixeVehiculeOptions,
      margeFordPro,
      margeRepresentationMarque,
      margeAccessoiresAmenagesVU,
      assistanceConstructeur,
      remiseConsentie,
    ]
    const allNumbersValid = numericInputs.every(
      (val) => typeof val === "number" || (typeof val === "string" && !isNaN(Number(val))),
    )
    if (!allNumbersValid) {
      alert("Veuillez entrer des nombres valides pour tous les champs numériques.")
      return
    }

    const results = calculateMarginSheet(inputs, payplan)
    setCalculatedResults(results)
  }

  const handleSave = () => {
    if (!calculatedResults || calculatedResults.finalMargin === null) {
      alert("Veuillez d'abord calculer la marge.")
      return
    }

    if (!vehicleSoldName || !clientName || !sellerName) {
      alert("Veuillez remplir les informations générales (Véhicule, Client, Vendeur).")
      return
    }

    const newSheet: MarginSheet = {
      id: uuidv4(),
      date: new Date().toLocaleDateString("fr-FR"),
      vehicleNumber: vehicleNumber || "N/A",
      sellerName: sellerName,
      clientName: clientName,
      vehicleSoldName: vehicleSoldName,
      purchasePriceTTC: Number(purchasePriceTTC || 0),
      sellingPriceTTC: Number(sellingPriceTTC || 0),
      tradeInValueHT: Number(tradeInValueHT || 0),
      warranty12Months: Number(warranty12Months || 0),
      workshopTransfer: Number(workshopTransfer || 0),
      preparationHT: Number(preparationHT || 0),
      purchaseDate: purchaseDate,
      orderDate: orderDate,
      listedPriceTTC: Number(listedPriceTTC || 0),
      hasFinancing: hasFinancing,
      financedAmountHT: Number(financedAmountHT || 0),
      numberOfServicesSold: Number(numberOfServicesSold),
      deliveryPackSold: deliveryPackSold,
      isHighPenetrationRate: isHighPenetrationRate,
      isElectricVehicle: isElectricVehicle,
      hasAccessories: hasAccessories,
      accessoryAmountHT: 0, // No longer used for calculation, but kept for interface compatibility
      accessoryAmountTTC: Number(accessoryAmountTTC || 0), // New
      isOtherStockCession: isOtherStockCession,
      // New inputs for Payplan
      vehicleType: vehicleType,
      vpSalesType: vpSalesType,
      vpModel: vpModel,
      margeFixeVehiculeOptions: Number(margeFixeVehiculeOptions || 0),
      margeFordPro: Number(margeFordPro || 0),
      margeRepresentationMarque: Number(margeRepresentationMarque || 0),
      margeAccessoiresAmenagesVU: Number(margeAccessoiresAmenagesVU || 0),
      assistanceConstructeur: Number(assistanceConstructeur || 0),
      remiseConsentie: Number(remiseConsentie || 0),
      financingType: financingType,
      isCreditBailVN: isCreditBailVN,
      isLOAVO: isLOAVO,
      isIDFord25Months: isIDFord25Months,
      isLLDProFordLease: isLLDProFordLease,
      cldFordDuration: cldFordDuration,
      hasMaintenanceContract: hasMaintenanceContract,
      hasCoyote: hasCoyote,
      coyoteDuration: coyoteDuration,
      ...calculatedResults, // Spread all calculated results
    }
    onSave(newSheet)
    resetForm()
  }

  const resetForm = () => {
    setVehicleNumber("")
    setSellerName("")
    setClientName("")
    setVehicleSoldName("")
    setVehicleType("VO") // Reset to default
    setPurchasePriceTTC("")
    setSellingPriceTTC("")
    setTradeInValueHT("")
    setIsOtherStockCession(false)
    setVpSalesType("PART/VD/Prof Lib/Société")
    setVpModel("")
    setMargeFixeVehiculeOptions("")
    setMargeFordPro("")
    setMargeRepresentationMarque("")
    setMargeAccessoiresAmenagesVU("")
    setAssistanceConstructeur("")
    setRemiseConsentie("")
    setPurchaseDate("")
    setOrderDate("")
    setListedPriceTTC("")
    setHasFinancing(false)
    setFinancedAmountHT("")
    setFinancingType("principal")
    setIsCreditBailVN(false)
    setIsLOAVO(false)
    setIsIDFord25Months(false)
    setIsLLDProFordLease(false)
    setNumberOfServicesSold("0")
    setDeliveryPackSold("none")
    setIsHighPenetrationRate(false)
    setCldFordDuration("none")
    setHasMaintenanceContract(false)
    setIsElectricVehicle(false)
    setHasAccessories(false)
    setAccessoryAmountTTC("")
    setHasCoyote(false)
    setCoyoteDuration("none")
    setWarranty12Months("")
    setWorkshopTransfer("")
    setPreparationHT("")
    setCalculatedResults(null)
  }

  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || typeof value === "undefined") return "N/A"
    return value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })
  }

  const getCommissionSummary = (results: CalculatedResults) => {
    const details = results.commissionDetails
    let summary = "La commission du vendeur est calculée comme suit :\n\n"

    if (vehicleType === "VO") {
      summary += `- Forfait de base VO : ${formatCurrency(details.voBaseCommission)}\n`
      if (details.voBonus60Days > 0) {
        summary += `- Bonus VO < 60 jours : ${formatCurrency(details.voBonus60Days)}\n`
      }
      if (details.voBonusListedPrice > 0) {
        summary += `- Bonus Prix Affiché VO : ${formatCurrency(details.voBonusListedPrice)}\n`
      }
      if (details.voBonusFinancing > 0) {
        summary += `- Bonus Financement VO : ${formatCurrency(details.voBonusFinancing)}\n`
      }
      if (details.voBonusElectricVehicle > 0) {
        summary += `- Bonus Véhicule Électrique VO : ${formatCurrency(details.voBonusElectricVehicle)} (multiplicateur)\n`
      }
    } else if (vehicleType === "VP") {
      summary += `- Commission VP : ${formatCurrency(details.vpCommission)}\n`
    } else if (vehicleType === "VU") {
      summary += `- Commission VU : ${formatCurrency(details.vuCommission)}\n`
    }

    if (details.financingBonus > 0) {
      summary += `- Bonus Financement (variable) : ${formatCurrency(details.financingBonus)}\n`
    }
    if (details.deliveryPackBonus > 0) {
      summary += `- Bonus Pack Livraison : ${formatCurrency(details.deliveryPackBonus)}\n`
    }
    if (details.cldBonus > 0) {
      summary += `- Bonus CLD Ford : ${formatCurrency(details.cldBonus)}\n`
    }
    if (details.maintenanceContractBonus > 0) {
      summary += `- Bonus Contrat Entretien : ${formatCurrency(details.maintenanceContractBonus)}\n`
    }
    if (details.coyoteBonus > 0) {
      summary += `- Bonus Coyote : ${formatCurrency(details.coyoteBonus)}\n`
    }
    if (details.accessoryBonus > 0) {
      summary += `- Bonus Accessoires : ${formatCurrency(details.accessoryBonus)}\n`
    }

    summary += `\nTotal Commission Vendeur : ${formatCurrency(results.sellerCommission)}`
    return summary
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <Card className="bg-white border-gray-200 text-gray-900 shadow-xl animate-fade-in margin-calculator-card">
      <CardHeader className="border-b border-gray-200 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2">
          <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
          <span className="truncate">Feuille de Marge RENTA VO/VN/VU</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:gap-6 py-4 sm:py-6">
        {/* General Information (always visible) */}
        <div className="no-print">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            <div className="grid gap-2">
              <Label htmlFor="date" className="text-gray-700 flex items-center gap-1 text-sm font-medium">
                <Info className="h-4 w-4" /> Date
              </Label>
              <Input
                id="date"
                type="text"
                value={new Date().toLocaleDateString("fr-FR")}
                disabled
                className="bg-gray-50 border-gray-300 text-gray-900 text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="vehicleNumber" className="text-gray-700 text-sm font-medium">
                N° de VO/VN/VU
              </Label>
              <Input
                id="vehicleNumber"
                type="text"
                placeholder="Ex: VO12345"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sellerName" className="text-gray-700 text-sm font-medium">
                Vendeur
              </Label>
              <Input
                id="sellerName"
                type="text"
                placeholder="Votre Nom"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="clientName" className="text-gray-700 text-sm font-medium">
                Client
              </Label>
              <Input
                id="clientName"
                type="text"
                placeholder="Nom du Client"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="vehicleSoldName" className="text-gray-700 flex items-center gap-1 text-sm font-medium">
                <Car className="h-4 w-4" /> Véhicule Vendu
              </Label>
              <Input
                id="vehicleSoldName"
                type="text"
                placeholder="Ex: Renault Clio V"
                value={vehicleSoldName}
                onChange={(e) => setVehicleSoldName(e.target.value)}
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* --- Input sections (hidden in print) --- */}
        <div className="no-print space-y-4 sm:space-y-6">
          {/* Vehicle Type Selection */}
          <div className="grid gap-2 border-t border-gray-200 pt-4 sm:pt-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Type de Véhicule</h3>
            <Select value={vehicleType} onValueChange={(value: "VO" | "VP" | "VU") => setVehicleType(value)}>
              <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:ring-blue-500 text-sm">
                <SelectValue placeholder="Sélectionner le type de véhicule" />
              </SelectTrigger>
              <SelectContent className="bg-white text-gray-900 border-gray-300">
                <SelectItem value="VO">Véhicule d'Occasion (VO)</SelectItem>
                <SelectItem value="VP">Véhicule Particulier (VP) VN/VD</SelectItem>
                <SelectItem value="VU">Véhicule Utilitaire (VU) VN/VD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Purchase/Sale Details (always visible for base prices) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 border-t border-gray-200 pt-4 sm:pt-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 sm:col-span-2">Détails Achat/Vente</h3>
            <div className="flex items-center space-x-2 sm:col-span-2">
              <Checkbox
                id="isOtherStockCession"
                checked={isOtherStockCession}
                onCheckedChange={(checked) => setIsOtherStockCession(!!checked)}
              />
              <Label htmlFor="isOtherStockCession" className="text-gray-700 text-sm">
                Cession autre stock (Marge fixe 1800€ TTC)
              </Label>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="purchasePriceTTC" className="text-gray-700 text-sm font-medium">
                Prix d'achat TTC (€)
              </Label>
              <Input
                id="purchasePriceTTC"
                type="number"
                placeholder="0.00"
                value={purchasePriceTTC}
                onChange={(e) => setPurchasePriceTTC(e.target.value)}
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sellingPriceTTC" className="text-gray-700 text-sm font-medium">
                Prix de vente TTC (€)
              </Label>
              <Input
                id="sellingPriceTTC"
                type="number"
                placeholder="0.00"
                value={sellingPriceTTC}
                onChange={(e) => setSellingPriceTTC(e.target.value)}
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 text-sm"
              />
            </div>
            {!isOtherStockCession && (
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="tradeInValueHT" className="text-gray-700 text-sm font-medium">
                  Reprise (ccvo ht €)
                </Label>
                <Input
                  id="tradeInValueHT"
                  type="number"
                  placeholder="0.00"
                  value={tradeInValueHT}
                  onChange={(e) => setTradeInValueHT(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
              </div>
            )}
          </div>

          {/* VP Specific Inputs */}
          {vehicleType === "VP" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 border-t border-gray-200 pt-4 sm:pt-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 sm:col-span-2">
                Détails Véhicule Particulier (VP)
              </h3>
              <div className="grid gap-2">
                <Label htmlFor="vpSalesType" className="text-gray-700 text-sm font-medium">
                  Type de Vente
                </Label>
                <Select value={vpSalesType} onValueChange={(value: typeof vpSalesType) => setVpSalesType(value)}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:ring-blue-500 text-sm">
                    <SelectValue placeholder="Sélectionner le type de vente" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-gray-900 border-gray-300">
                    <SelectItem value="PART/VD/Prof Lib/Société">
                      PART/VD/Prof Lib/Société (hors Loueur et GC)
                    </SelectItem>
                    <SelectItem value="GC/Loueurs LLD ou LCD">GC/Loueurs LLD ou LCD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vpModel" className="text-gray-700 text-sm font-medium">
                  Modèle VP
                </Label>
                <Select value={vpModel} onValueChange={(value: typeof vpModel) => setVpModel(value)}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:ring-blue-500 text-sm">
                    <SelectValue placeholder="Sélectionner le modèle" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-gray-900 border-gray-300">
                    <SelectItem value="Carline">Carline</SelectItem>
                    <SelectItem value="Tourneo Courrier">Tourneo Courrier</SelectItem>
                    <SelectItem value="Focus">Focus</SelectItem>
                    <SelectItem value="Kuga">Kuga</SelectItem>
                    <SelectItem value="Explorer">Explorer</SelectItem>
                    <SelectItem value="Capri">Capri</SelectItem>
                    <SelectItem value="Mach-E">Mach-E</SelectItem>
                    <SelectItem value="Tourneo Connect">Tourneo Connect</SelectItem>
                    <SelectItem value="Mustang">Mustang</SelectItem>
                    <SelectItem value="Ranger">Ranger</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* VU Specific Inputs */}
          {vehicleType === "VU" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 border-t border-gray-200 pt-4 sm:pt-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 sm:col-span-2">
                Détails Véhicule Utilitaire (VU)
              </h3>
              <div className="grid gap-2">
                <Label htmlFor="margeFixeVehiculeOptions" className="text-gray-700 text-sm font-medium">
                  Marge fixe sur véhicule et options (€)
                </Label>
                <Input
                  id="margeFixeVehiculeOptions"
                  type="number"
                  placeholder="0.00"
                  value={margeFixeVehiculeOptions}
                  onChange={(e) => setMargeFixeVehiculeOptions(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="margeFordPro" className="text-gray-700 text-sm font-medium">
                  Marge FORD Pro (€)
                </Label>
                <Input
                  id="margeFordPro"
                  type="number"
                  placeholder="0.00"
                  value={margeFordPro}
                  onChange={(e) => setMargeFordPro(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="margeRepresentationMarque" className="text-gray-700 text-sm font-medium">
                  Marge représentation de la marque (€)
                </Label>
                <Input
                  id="margeRepresentationMarque"
                  type="number"
                  placeholder="0.00"
                  value={margeRepresentationMarque}
                  onChange={(e) => setMargeRepresentationMarque(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="margeAccessoiresAmenagesVU" className="text-gray-700 text-sm font-medium">
                  Marge sur les accessoires aménagés VU (€)
                </Label>
                <Input
                  id="margeAccessoiresAmenagesVU"
                  type="number"
                  placeholder="0.00"
                  value={margeAccessoiresAmenagesVU}
                  onChange={(e) => setMargeAccessoiresAmenagesVU(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="assistanceConstructeur" className="text-gray-700 text-sm font-medium">
                  Assistance constructeur (€)
                </Label>
                <Input
                  id="assistanceConstructeur"
                  type="number"
                  placeholder="0.00"
                  value={assistanceConstructeur}
                  onChange={(e) => setAssistanceConstructeur(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="remiseConsentie" className="text-gray-700 text-sm font-medium">
                  Remise consentie (€)
                </Label>
                <Input
                  id="remiseConsentie"
                  type="number"
                  placeholder="0.00"
                  value={remiseConsentie}
                  onChange={(e) => setRemiseConsentie(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          )}

          {/* Commission Automation Inputs (VO specific) */}
          {vehicleType === "VO" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 border-t border-gray-200 pt-4 sm:pt-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 sm:col-span-2">
                Automatisation Commission VO
              </h3>
              <div className="grid gap-2">
                <Label htmlFor="purchaseDate" className="text-gray-700 flex items-center gap-1 text-sm font-medium">
                  <CalendarDays className="h-4 w-4" /> Date d'achat VO
                </Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="orderDate" className="text-gray-700 flex items-center gap-1 text-sm font-medium">
                  <CalendarDays className="h-4 w-4" /> Date Bon de Commande
                </Label>
                <Input
                  id="orderDate"
                  type="date"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="listedPriceTTC" className="text-gray-700 text-sm font-medium">
                  Prix affiché TTC (€)
                </Label>
                <Input
                  id="listedPriceTTC"
                  type="number"
                  placeholder="0.00"
                  value={listedPriceTTC}
                  onChange={(e) => setListedPriceTTC(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="flex items-center space-x-2 sm:col-span-2">
                <Checkbox
                  id="isElectricVehicle"
                  checked={isElectricVehicle}
                  onCheckedChange={(checked) => setIsElectricVehicle(!!checked)}
                />
                <Label htmlFor="isElectricVehicle" className="text-gray-700 text-sm">
                  Véhicule Électrique (VO)
                </Label>
              </div>
            </div>
          )}

          {/* Financing Commission Inputs (common for all types) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 border-t border-gray-200 pt-4 sm:pt-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 sm:col-span-2">Détails Financement</h3>
            <div className="flex items-center space-x-2 sm:col-span-2">
              <Checkbox
                id="hasFinancing"
                checked={hasFinancing}
                onCheckedChange={(checked) => setHasFinancing(!!checked)}
              />
              <Label htmlFor="hasFinancing" className="text-gray-700 text-sm">
                Vente avec Financement
              </Label>
            </div>
            {hasFinancing && (
              <>
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="financedAmountHT" className="text-gray-700 text-sm font-medium">
                    Montant financé HT (€) (CA HT)
                  </Label>
                  <Input
                    id="financedAmountHT"
                    type="number"
                    placeholder="0.00"
                    value={financedAmountHT}
                    onChange={(e) => setFinancedAmountHT(e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="financingType" className="text-gray-700 text-sm font-medium">
                    Barème Financement
                  </Label>
                  <Select
                    value={financingType}
                    onValueChange={(value: typeof financingType) => setFinancingType(value)}
                  >
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:ring-blue-500 text-sm">
                      <SelectValue placeholder="Sélectionner le barème" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-gray-900 border-gray-300">
                      <SelectItem value="principal">Barème Principal (VN/VD/VO)</SelectItem>
                      <SelectItem value="specific">
                        Barème Spécifique (CC Ford / LOA Ford 48 mois / LLD FordLease / Crédit-Bail Ford / CGI)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="numberOfServicesSold" className="text-gray-700 text-sm font-medium">
                    Nombre de Prestations (Assurances)
                  </Label>
                  <Select
                    value={numberOfServicesSold}
                    onValueChange={(value: "0" | "1" | "2") => setNumberOfServicesSold(value)}
                  >
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:ring-blue-500 text-sm">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-gray-900 border-gray-300">
                      <SelectItem value="0">0 Prestation</SelectItem>
                      <SelectItem value="1">1 Prestation</SelectItem>
                      <SelectItem value="2">2 Prestations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isCreditBailVN"
                    checked={isCreditBailVN}
                    onCheckedChange={(checked) => setIsCreditBailVN(!!checked)}
                  />
                  <Label htmlFor="isCreditBailVN" className="text-gray-700 text-sm">
                    Crédit-Bail sur un VN
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="isLOAVO" checked={isLOAVO} onCheckedChange={(checked) => setIsLOAVO(!!checked)} />
                  <Label htmlFor="isLOAVO" className="text-gray-700 text-sm">
                    LOA sur un VO
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isIDFord25Months"
                    checked={isIDFord25Months}
                    onCheckedChange={(checked) => setIsIDFord25Months(!!checked)}
                  />
                  <Label htmlFor="isIDFord25Months" className="text-gray-700 text-sm">
                    ID Ford 25 mois
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isLLDProFordLease"
                    checked={isLLDProFordLease}
                    onCheckedChange={(checked) => setIsLLDProFordLease(!!checked)}
                  />
                  <Label htmlFor="isLLDProFordLease" className="text-gray-700 text-sm">
                    LLD à professionnel FORDLease
                  </Label>
                </div>
              </>
            )}
          </div>

          {/* Packs & Peripherals Commission Inputs (common for all types) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 border-t border-gray-200 pt-4 sm:pt-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 sm:col-span-2">
              Packs Livraison & Autres Périphériques
            </h3>
            <div className="grid gap-2">
              <Label htmlFor="deliveryPackSold" className="text-gray-700 text-sm font-medium">
                Pack Livraison Vendu
              </Label>
              <Select
                value={deliveryPackSold}
                onValueChange={(value: "none" | "pack1" | "pack2" | "pack3") => setDeliveryPackSold(value)}
              >
                <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:ring-blue-500 text-sm">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-900 border-gray-300">
                  <SelectItem value="none">Aucun Pack</SelectItem>
                  <SelectItem value="pack1">Pack 1 (199€)</SelectItem>
                  <SelectItem value="pack2">Pack 2 (699€)</SelectItem>
                  <SelectItem value="pack3">Pack 3 (899€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isHighPenetrationRate"
                checked={isHighPenetrationRate}
                onCheckedChange={(checked) => setIsHighPenetrationRate(!!checked)}
              />
              <Label htmlFor="isHighPenetrationRate" className="text-gray-700 text-sm">
                Pénétration Pack {">"} 65% (Bonus)
              </Label>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cldFordDuration" className="text-gray-700 text-sm font-medium">
                CLD Ford
              </Label>
              <Select
                value={cldFordDuration}
                onValueChange={(value: typeof cldFordDuration) => setCldFordDuration(value)}
              >
                <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:ring-blue-500 text-sm">
                  <SelectValue placeholder="Sélectionner la durée" />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-900 border-gray-300">
                  <SelectItem value="none">Aucun CLD</SelectItem>
                  <SelectItem value="3-4">3 ou 4 ans</SelectItem>
                  <SelectItem value="5+">5 ans et +</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasMaintenanceContract"
                checked={hasMaintenanceContract}
                onCheckedChange={(checked) => setHasMaintenanceContract(!!checked)}
              />
              <Label htmlFor="hasMaintenanceContract" className="text-gray-700 text-sm">
                Contrat d'entretien
              </Label>
            </div>
          </div>

          {/* Coyote Commission Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 border-t border-gray-200 pt-4 sm:pt-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 sm:col-span-2">Rémunération Coyote</h3>
            <div className="flex items-center space-x-2">
              <Checkbox id="hasCoyote" checked={hasCoyote} onCheckedChange={(checked) => setHasCoyote(!!checked)} />
              <Label htmlFor="hasCoyote" className="text-gray-700 text-sm">
                Coyote Secure Tracker vendu
              </Label>
            </div>
            {hasCoyote && (
              <div className="grid gap-2">
                <Label htmlFor="coyoteDuration" className="text-gray-700 text-sm font-medium">
                  Durée Coyote
                </Label>
                <Select
                  value={coyoteDuration}
                  onValueChange={(value: typeof coyoteDuration) => setCoyoteDuration(value)}
                >
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:ring-blue-500 text-sm">
                    <SelectValue placeholder="Sélectionner la durée" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-gray-900 border-gray-300">
                    <SelectItem value="none">Non sélectionné</SelectItem>
                    <SelectItem value="24">24 mois</SelectItem>
                    <SelectItem value="36">36 mois</SelectItem>
                    <SelectItem value="48">48 mois</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Accessories Commission Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 border-t border-gray-200 pt-4 sm:pt-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 sm:col-span-2">
              Accessoires d'Origine Constructeur
            </h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasAccessories"
                checked={hasAccessories}
                onCheckedChange={(checked) => setHasAccessories(!!checked)}
              />
              <Label htmlFor="hasAccessories" className="text-gray-700 text-sm">
                Véhicule vendu avec Accessoire
              </Label>
            </div>
            {hasAccessories && (
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="accessoryAmountTTC" className="text-gray-700 text-sm font-medium">
                  Montant des accessoires vendus TTC (€)
                </Label>
                <Input
                  id="accessoryAmountTTC"
                  type="number"
                  placeholder="0.00"
                  value={accessoryAmountTTC}
                  onChange={(e) => setAccessoryAmountTTC(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
              </div>
            )}
          </div>

          {/* Cost/Deduction/Addition Items (manual inputs that are still needed) */}
          {!isOtherStockCession && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 border-t border-gray-200 pt-4 sm:pt-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 sm:col-span-2">Frais & Bonus (Manuels)</h3>
              <div className="grid gap-2">
                <Label htmlFor="warranty12Months" className="text-gray-700 text-sm font-medium">
                  Garantie 12 Mois (€)
                </Label>
                <Input
                  id="warranty12Months"
                  type="number"
                  placeholder="0.00"
                  value={warranty12Months}
                  onChange={(e) => setWarranty12Months(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="workshopTransfer" className="text-gray-700 text-sm font-medium">
                  Cession Atelier (€)
                </Label>
                <Input
                  id="workshopTransfer"
                  type="number"
                  placeholder="0.00"
                  value={workshopTransfer}
                  onChange={(e) => setWorkshopTransfer(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="preparationHT" className="text-gray-700 text-sm font-medium">
                  Préparation HT (€)
                </Label>
                <Input
                  id="preparationHT"
                  type="number"
                  placeholder="0.00"
                  value={preparationHT}
                  onChange={(e) => setPreparationHT(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          )}
        </div>

        <Button
          onClick={handleCalculate}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 ease-in-out py-2 sm:py-3 text-sm sm:text-base lg:text-lg font-semibold no-print shadow-lg"
        >
          Calculer les Marges & Commissions
        </Button>

        {calculatedResults && (
          <>
            {/* On-screen results (existing display) */}
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200 animate-fade-in-up print-hide-layout">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" /> Résultats du Calcul
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-gray-700">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {isOtherStockCession ? "Prix Cession TTC:" : "Prix Achat HT:"}
                  </p>
                  <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-800">
                    {isOtherStockCession
                      ? formatCurrency(1800) // Fixed TTC value for display
                      : formatCurrency(calculatedResults.purchasePriceHT)}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {isOtherStockCession ? "Prix Cession HT:" : "Prix Vente HT:"}
                  </p>
                  <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-800">
                    {isOtherStockCession
                      ? formatCurrency(1800 / (1 + VAT_RATE)) // Fixed HT value for display
                      : formatCurrency(calculatedResults.sellingPriceHT)}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Marge HT (Initiale):</p>
                  <p className="text-sm sm:text-base lg:text-lg font-bold text-green-600">
                    {formatCurrency(calculatedResults.initialMarginHT)}
                  </p>
                </div>
                {/* Display costs on screen if > 0 */}
                {Number(warranty12Months) > 0 && (
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Garantie 12 Mois:</p>
                    <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-800">
                      {formatCurrency(Number(warranty12Months))}
                    </p>
                  </div>
                )}
                {Number(workshopTransfer) > 0 && (
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Cession Atelier:</p>
                    <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-800">
                      {formatCurrency(Number(workshopTransfer))}
                    </p>
                  </div>
                )}
                {Number(preparationHT) > 0 && (
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Préparation HT:</p>
                    <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-800">
                      {formatCurrency(Number(preparationHT))}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Marge Restante HT:</p>
                  <p className="text-sm sm:text-base lg:text-lg font-bold text-green-600">
                    {formatCurrency(calculatedResults.remainingMarginHT)}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Marge Finale (Concessionnaire):</p>
                  <p className="text-sm sm:text-base lg:text-lg font-bold text-green-600">
                    {formatCurrency(calculatedResults.finalMargin)}
                  </p>
                </div>
              </div>

              <h4 className="text-lg sm:text-xl font-semibold mt-4 sm:mt-6 mb-3 text-gray-800 flex items-center gap-2">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" /> Détail Commission Vendeur
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-gray-700">
                {vehicleType === "VO" && (
                  <>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Commission VO (Base):</p>
                      <p className="text-sm sm:text-base lg:text-lg font-bold text-blue-600">
                        {formatCurrency(calculatedResults.commissionDetails.voBaseCommission)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Bonus -60 Jours (VO):</p>
                      <p className="text-sm sm:text-base lg:text-lg font-bold text-blue-600">
                        {formatCurrency(calculatedResults.commissionDetails.voBonus60Days)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Bonus Prix Affiché (VO):</p>
                      <p className="text-sm sm:text-base lg:text-lg font-bold text-blue-600">
                        {formatCurrency(calculatedResults.commissionDetails.voBonusListedPrice)}
                      </p>
                    </div>
                    {hasFinancing && (
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">Bonus Financement VO:</p>
                        <p className="text-sm sm:text-base lg:text-lg font-bold text-blue-600">
                          {formatCurrency(calculatedResults.commissionDetails.voBonusFinancing)}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Bonus Véhicule Électrique (VO):</p>
                      <p className="text-sm sm:text-base lg:text-lg font-bold text-blue-600">
                        {formatCurrency(calculatedResults.commissionDetails.voBonusElectricVehicle)}
                      </p>
                    </div>
                  </>
                )}

                {vehicleType === "VP" && (
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Commission VP:</p>
                    <p className="text-sm sm:text-base lg:text-lg font-bold text-blue-600">
                      {formatCurrency(calculatedResults.commissionDetails.vpCommission)}
                    </p>
                  </div>
                )}

                {vehicleType === "VU" && (
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Commission VU:</p>
                    <p className="text-sm sm:text-base lg:text-lg font-bold text-blue-600">
                      {formatCurrency(calculatedResults.commissionDetails.vuCommission)}
                    </p>
                  </div>
                )}

                {hasFinancing && calculatedResults.commissionDetails.financingBonus > 0 && (
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Bonus Financement (Variable):</p>
                    <p className="text-sm sm:text-base lg:text-lg font-bold text-blue-600">
                      {formatCurrency(calculatedResults.commissionDetails.financingBonus)}
                    </p>
                  </div>
                )}

                {calculatedResults.commissionDetails.deliveryPackBonus > 0 && (
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Bonus Pack Livraison:</p>
                    <p className="text-sm sm:text-base lg:text-lg font-bold text-blue-600">
                      {formatCurrency(calculatedResults.commissionDetails.deliveryPackBonus)}
                    </p>
                  </div>
                )}

                {calculatedResults.commissionDetails.cldBonus > 0 && (
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Bonus CLD Ford:</p>
                    <p className="text-sm sm:text-base lg:text-lg font-bold text-blue-600">
                      {formatCurrency(calculatedResults.commissionDetails.cldBonus)}
                    </p>
                  </div>
                )}

                {calculatedResults.commissionDetails.maintenanceContractBonus > 0 && (
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Bonus Contrat Entretien:</p>
                    <p className="text-sm sm:text-base lg:text-lg font-bold text-blue-600">
                      {formatCurrency(calculatedResults.commissionDetails.maintenanceContractBonus)}
                    </p>
                  </div>
                )}

                {calculatedResults.commissionDetails.coyoteBonus > 0 && (
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Bonus Coyote:</p>
                    <p className="text-sm sm:text-base lg:text-lg font-bold text-blue-600">
                      {formatCurrency(calculatedResults.commissionDetails.coyoteBonus)}
                    </p>
                  </div>
                )}

                {calculatedResults.commissionDetails.accessoryBonus > 0 && (
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Bonus Accessoires:</p>
                    <p className="text-sm sm:text-base lg:text-lg font-bold text-blue-600">
                      {formatCurrency(calculatedResults.commissionDetails.accessoryBonus)}
                    </p>
                  </div>
                )}

                <div className="sm:col-span-2 border-t border-blue-200 pt-3 sm:pt-4 mt-3 sm:mt-4">
                  <p className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800">
                    Commission Totale Vendeur:
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">
                    {formatCurrency(calculatedResults.sellerCommission)}
                  </p>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-800 whitespace-pre-wrap">
                <h4 className="text-sm sm:text-base lg:text-lg font-semibold mb-2">Résumé du Calcul de Commission :</h4>
                <p className="text-xs sm:text-sm">{getCommissionSummary(calculatedResults)}</p>
              </div>
            </div>

            {/* Print-only results (new structured display using PrintableMarginSheet) */}
            <PrintableMarginSheet
              calculatedResults={calculatedResults}
              vehicleNumber={vehicleNumber}
              sellerName={sellerName}
              clientName={clientName}
              vehicleSoldName={vehicleSoldName}
              vehicleType={vehicleType}
              vpModel={vpModel}
              purchasePriceTTC={purchasePriceTTC}
              sellingPriceTTC={sellingPriceTTC}
              purchaseDate={purchaseDate}
              orderDate={orderDate}
              isOtherStockCession={isOtherStockCession}
              hasFinancing={hasFinancing}
              isElectricVehicle={isElectricVehicle}
              deliveryPackSold={deliveryPackSold}
              cldFordDuration={cldFordDuration}
              hasMaintenanceContract={hasMaintenanceContract}
              hasCoyote={hasCoyote}
              hasAccessories={hasAccessories}
              // Pass new props
              warranty12Months={warranty12Months}
              workshopTransfer={workshopTransfer}
              preparationHT={preparationHT}
            />
          </>
        )}
      </CardContent>
      <CardFooter className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row justify-end gap-2 bg-gray-50">
        <Button
          onClick={handlePrint}
          variant="outline"
          className="w-full sm:w-auto bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center gap-1 text-sm"
          disabled={!calculatedResults}
        >
          <Printer className="h-4 w-4" />
          <span className="hidden sm:inline">Imprimer / Télécharger PDF</span>
          <span className="sm:hidden">Imprimer PDF</span>
        </Button>
        <Button
          onClick={resetForm}
          variant="outline"
          className="w-full sm:w-auto bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm"
        >
          Réinitialiser
        </Button>
        <Button
          onClick={handleSave}
          disabled={
            !calculatedResults ||
            calculatedResults.finalMargin === null ||
            !vehicleSoldName ||
            !clientName ||
            !sellerName
          }
          className="w-full sm:w-auto bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          Enregistrer la Fiche
        </Button>
      </CardFooter>
    </Card>
  )
}
