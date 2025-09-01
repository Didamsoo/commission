// components/margin-calculator.tsx

"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { v4 as uuidv4 } from "uuid"
import { CheckCircle, DollarSign, Car, Info, CalendarDays, Printer } from "lucide-react"
import {
  calculateMarginSheet,
  type Payplan,
  type CalculatedResults,
  type MarginSheet,
  VAT_RATE,
} from "@/lib/margin-utils"
import { PrintableMarginSheet } from "./printable-margin-sheet"

interface MarginCalculatorProps {
  onSave: (sheet: MarginSheet) => void
  payplan: Payplan
}

export function MarginCalculator({ onSave, payplan }: MarginCalculatorProps) {
  // Infos générales
  const [vehicleNumber, setVehicleNumber] = useState("")
  const [sellerName, setSellerName] = useState("")
  const [clientName, setClientName] = useState("")
  const [vehicleSoldName, setVehicleSoldName] = useState("")

  // Type véhicule
  const [vehicleType, setVehicleType] = useState<"VO" | "VP" | "VU">("VO")

  // Achat/vente communs
  const [purchasePriceTTC, setPurchasePriceTTC] = useState<number | string>("")
  const [sellingPriceTTC, setSellingPriceTTC] = useState<number | string>("")
  const [tradeInValueHT, setTradeInValueHT] = useState<number | string>("")

  // Cession autre stock
  const [isOtherStockCession, setIsOtherStockCession] = useState(false)

  // VO spécifiques
  const [purchaseDate, setPurchaseDate] = useState("")
  const [orderDate, setOrderDate] = useState("")
  const [listedPriceTTC, setListedPriceTTC] = useState<number | string>("")
  const [isElectricVehicle, setIsElectricVehicle] = useState(false)

  // VP (VN/VD) spécifiques - Updated with new sales types
  const [vpSalesType, setVpSalesType] =
    useState<"PART/VD/Prof Lib/Société" | "Vente Captive Ford Lease" | "GC/Loueurs LLD ou LCD">(
      "PART/VD/Prof Lib/Société",
    )
  const [vpModel, setVpModel] = useState<string>("")

  // VU spécifiques (issus du payplan / placeholders calculés dans margin-utils)
  const [margeFixeVehiculeOptions, setMargeFixeVehiculeOptions] = useState<number | string>("")
  const [margeFordPro, setMargeFordPro] = useState<number | string>("")
  const [margeRepresentationMarque, setMargeRepresentationMarque] = useState<number | string>("")
  const [margeAccessoiresAmenagesVU, setMargeAccessoiresAmenagesVU] = useState<number | string>("")
  const [assistanceConstructeur, setAssistanceConstructeur] = useState<number | string>("")
  const [remiseConsentie, setRemiseConsentie] = useState<number | string>("")

  // Financement
  const [hasFinancing, setHasFinancing] = useState(false)
  const [financedAmountHT, setFinancedAmountHT] = useState<number | string>("")
  const [financingType, setFinancingType] = useState<"principal" | "specific">("principal")
  const [numberOfServicesSold, setNumberOfServicesSold] = useState<"0" | "1" | "2" | "3">("0") // Updated to include "3"
  // Cases spécifiques payplan
  const [isCreditBailVN, setIsCreditBailVN] = useState(false) // VP/VU VN
  const [isLOAVO, setIsLOAVO] = useState(false) // VO
  const [isIDFord25Months, setIsIDFord25Months] = useState(false) // VP/VU
  const [isLLDProFordLease, setIsLLDProFordLease] = useState(false) // VP/VU pro

  // Packs / périphériques
  const [deliveryPackSold, setDeliveryPackSold] =
    useState<"none" | "pack1" | "pack2" | "pack3">("none")
  const [isHighPenetrationRate, setIsHighPenetrationRate] = useState(false)
  const [cldFordDuration, setCldFordDuration] = useState<"none" | "3-4" | "5+">("none")
  const [hasMaintenanceContract, setHasMaintenanceContract] = useState(false)

  // Coyote
  const [hasCoyote, setHasCoyote] = useState(false)
  const [coyoteDuration, setCoyoteDuration] = useState<"none" | "24" | "36" | "48">("none")

  // Accessoires
  const [hasAccessories, setHasAccessories] = useState(false)
  const [accessoryAmountTTC, setAccessoryAmountTTC] = useState<number | string>("")

  // Frais fixes (par défaut alignés avec tes exemples)
  const [warranty12Months, setWarranty12Months] = useState<number | string>(219)
  const [workshopTransfer, setWorkshopTransfer] = useState<number | string>("")
  const [preparationHT, setPreparationHT] = useState<number | string>(45)

  // Résultats
  const [calculatedResults, setCalculatedResults] = useState<CalculatedResults | null>(null)

  const handleCalculate = () => {
    const inputs = {
      // Contexte
      vehicleType,
      isOtherStockCession,

      // Prix
      purchasePriceTTC: Number(purchasePriceTTC || 0),
      sellingPriceTTC: Number(sellingPriceTTC || 0),
      tradeInValueHT: Number(tradeInValueHT || 0),

      // Frais
      warranty12Months: Number(warranty12Months || 0),
      workshopTransfer: Number(workshopTransfer || 0),
      preparationHT: Number(preparationHT || 0),

      // VO
      purchaseDate,
      orderDate,
      listedPriceTTC: Number(listedPriceTTC || 0),
      isElectricVehicle,

      // VP
      vpSalesType,
      vpModel,

      // VU
      margeFixeVehiculeOptions: Number(margeFixeVehiculeOptions || 0),
      margeFordPro: Number(margeFordPro || 0),
      margeRepresentationMarque: Number(margeRepresentationMarque || 0),
      margeAccessoiresAmenagesVU: Number(margeAccessoiresAmenagesVU || 0),
      assistanceConstructeur: Number(assistanceConstructeur || 0),
      remiseConsentie: Number(remiseConsentie || 0),

      // Financement
      hasFinancing,
      financedAmountHT: Number(financedAmountHT || 0),
      financingType,
      numberOfServicesSold: Number(numberOfServicesSold),
      isCreditBailVN,
      isLOAVO,
      isIDFord25Months,
      isLLDProFordLease,

      // Packs / périphériques
      deliveryPackSold,
      isHighPenetrationRate,
      cldFordDuration,
      hasMaintenanceContract,

      // Coyote / accessoires
      hasCoyote,
      coyoteDuration,
      hasAccessories,
      accessoryAmountTTC: Number(accessoryAmountTTC || 0),
      accessoryAmountHT: 0, // Legacy field
    }

    const results = calculateMarginSheet(inputs, payplan)
    setCalculatedResults(results)
  }

  const handleSave = () => {
    if (!calculatedResults) {
      alert("Veuillez d'abord calculer la marge.")
      return
    }
    if (!vehicleSoldName || !clientName || !sellerName) {
      alert("Veuillez remplir les informations générales.")
      return
    }

    const newSheet: MarginSheet = {
      id: uuidv4(),
      date: new Date().toLocaleDateString("fr-FR"),
      vehicleNumber: vehicleNumber || "N/A",
      sellerName,
      clientName,
      vehicleSoldName,
      vehicleType,

      purchasePriceTTC: Number(purchasePriceTTC || 0),
      sellingPriceTTC: Number(sellingPriceTTC || 0),
      tradeInValueHT: Number(tradeInValueHT || 0),

      warranty12Months: Number(warranty12Months || 0),
      workshopTransfer: Number(workshopTransfer || 0),
      preparationHT: Number(preparationHT || 0),

      // VO
      purchaseDate,
      orderDate,
      listedPriceTTC: Number(listedPriceTTC || 0),
      isElectricVehicle,

      // VP/VU/financement
      hasFinancing,
      financedAmountHT: Number(financedAmountHT || 0),
      numberOfServicesSold: Number(numberOfServicesSold),
      deliveryPackSold,
      isHighPenetrationRate,
      vpSalesType,
      vpModel,
      cldFordDuration,
      hasMaintenanceContract,
      isCreditBailVN,
      isLOAVO,
      isIDFord25Months,
      isLLDProFordLease,

      // VU
      margeFixeVehiculeOptions: Number(margeFixeVehiculeOptions || 0),
      margeFordPro: Number(margeFordPro || 0),
      margeRepresentationMarque: Number(margeRepresentationMarque || 0),
      margeAccessoiresAmenagesVU: Number(margeAccessoiresAmenagesVU || 0),
      assistanceConstructeur: Number(assistanceConstructeur || 0),
      remiseConsentie: Number(remiseConsentie || 0),

      // Coyote/Accessoires
      hasCoyote,
      coyoteDuration,
      hasAccessories,
      accessoryAmountHT: 0,
      accessoryAmountTTC: Number(accessoryAmountTTC || 0),

      isOtherStockCession,

      // Résultats
      remainingMarginHT: calculatedResults.remainingMarginHT,
      finalMargin: calculatedResults.finalMargin,
      sellerCommission: calculatedResults.sellerCommission,
      commissionDetails: calculatedResults.commissionDetails,
      financingType,

      // Additional fields required by MarginSheet interface
      purchasePriceHT: calculatedResults.purchasePriceHT,
      sellingPriceHT: calculatedResults.sellingPriceHT,
      initialMarginHT: calculatedResults.initialMarginHT,
    }

    onSave(newSheet)
    resetForm()
  }

  const resetForm = () => {
    setVehicleNumber("")
    setSellerName("")
    setClientName("")
    setVehicleSoldName("")
    setVehicleType("VO")

    setPurchasePriceTTC("")
    setSellingPriceTTC("")
    setTradeInValueHT("")
    setIsOtherStockCession(false)

    setPurchaseDate("")
    setOrderDate("")
    setListedPriceTTC("")
    setIsElectricVehicle(false)

    setVpSalesType("PART/VD/Prof Lib/Société")
    setVpModel("")

    setMargeFixeVehiculeOptions("")
    setMargeFordPro("")
    setMargeRepresentationMarque("")
    setMargeAccessoiresAmenagesVU("")
    setAssistanceConstructeur("")
    setRemiseConsentie("")

    setHasFinancing(false)
    setFinancedAmountHT("")
    setFinancingType("principal")
    setNumberOfServicesSold("0")
    setIsCreditBailVN(false)
    setIsLOAVO(false)
    setIsIDFord25Months(false)
    setIsLLDProFordLease(false)

    setDeliveryPackSold("none")
    setIsHighPenetrationRate(false)
    setCldFordDuration("none")
    setHasMaintenanceContract(false)

    setHasCoyote(false)
    setCoyoteDuration("none")
    setHasAccessories(false)
    setAccessoryAmountTTC("")

    setWarranty12Months(219)
    setWorkshopTransfer("")
    setPreparationHT(45)

    setCalculatedResults(null)
  }

  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || typeof value === "undefined") return "N/A"
    return value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })
  }

  const handlePrint = () => window.print()

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 sm:col-span-2">{children}</h3>
  )

  return (
    <Card className="bg-white border-gray-200 text-gray-900 shadow-xl animate-fade-in margin-calculator-card">
      <CardHeader className="border-b border-gray-200 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 no-print">
        <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2">
          <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
          <span className="truncate">Feuille de Marge RENTA VO/VN/VU</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 sm:gap-6 py-4 sm:py-6">
        {/* INFORMATIONS GÉNÉRALES */}
        <div className="no-print">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            <div className="grid gap-2">
              <Label className="text-gray-700 flex items-center gap-1 text-sm font-medium">
                <Info className="h-4 w-4" /> Date
              </Label>
              <Input value={new Date().toLocaleDateString("fr-FR")} disabled className="bg-gray-50 text-sm" />
            </div>
            <div className="grid gap-2">
              <Label className="text-gray-700 text-sm font-medium">N° de VO/VN/VU</Label>
              <Input value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} placeholder="Ex: VO12345" />
            </div>
            <div className="grid gap-2">
              <Label className="text-gray-700 text-sm font-medium">Vendeur</Label>
              <Input value={sellerName} onChange={(e) => setSellerName(e.target.value)} placeholder="Votre Nom" />
            </div>
            <div className="grid gap-2">
              <Label className="text-gray-700 text-sm font-medium">Client</Label>
              <Input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Nom du Client" />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label className="text-gray-700 flex items-center gap-1 text-sm font-medium">
                <Car className="h-4 w-4" /> Véhicule Vendu
              </Label>
              <Input value={vehicleSoldName} onChange={(e) => setVehicleSoldName(e.target.value)} placeholder="Ex: Renault Clio V" />
            </div>
          </div>
        </div>

        {/* TYPE DE VÉHICULE */}
        <div className="no-print grid gap-2 border-t border-gray-200 pt-4 sm:pt-6">
          <SectionTitle>Type de Véhicule</SectionTitle>
          <Select value={vehicleType} onValueChange={(v: "VO" | "VP" | "VU") => setVehicleType(v)}>
            <SelectTrigger><SelectValue placeholder="Sélectionner le type de véhicule" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="VO">Véhicule d'Occasion (VO)</SelectItem>
              <SelectItem value="VP">Véhicule Particulier (VP) VN/VD</SelectItem>
              <SelectItem value="VU">Véhicule Utilitaire (VU) VN/VD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* DÉTAILS ACHAT/VENTE — logiques différentes pour cession */}
        <div className="no-print grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 border-t border-gray-200 pt-4 sm:pt-6">
          <SectionTitle>Détails Achat/Vente</SectionTitle>

          {/* Cession visible pour VO uniquement (selon ton process) */}
          {vehicleType === "VO" && (
            <div className="flex items-center space-x-2 sm:col-span-2">
              <Checkbox id="isOtherStockCession" checked={isOtherStockCession} onCheckedChange={(c) => setIsOtherStockCession(!!c)} />
              <Label htmlFor="isOtherStockCession" className="text-sm">
                Cession autre stock (Achat = Affiché − 1 800 € ; Cession = 1 800 € TTC)
              </Label>
            </div>
          )}

          {isOtherStockCession && vehicleType === "VO" ? (
            <>
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Prix affiché TTC (€)</Label>
                <Input type="number" value={sellingPriceTTC} onChange={(e) => setSellingPriceTTC(e.target.value)} placeholder="0.00" />
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Prix d'achat calculé TTC (€)</Label>
                <Input disabled value={Number(sellingPriceTTC) > 1800 ? String(Number(sellingPriceTTC) - 1800) : "0"} />
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Prix cession TTC (€)</Label>
                <Input disabled value="1800" />
              </div>
            </>
          ) : (
            <>
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Prix d'achat TTC (€)</Label>
                <Input type="number" value={purchasePriceTTC} onChange={(e) => setPurchasePriceTTC(e.target.value)} placeholder="0.00" />
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Prix de vente TTC (€)</Label>
                <Input type="number" value={sellingPriceTTC} onChange={(e) => setSellingPriceTTC(e.target.value)} placeholder="0.00" />
              </div>
              {/* Reprise (plutôt VO/VP – en VU souvent non, mais on laisse disponible) */}
              <div className="grid gap-2 sm:col-span-2">
                <Label className="text-sm font-medium">Reprise (ccvo ht €)</Label>
                <Input type="number" value={tradeInValueHT} onChange={(e) => setTradeInValueHT(e.target.value)} placeholder="0.00" />
              </div>
            </>
          )}
        </div>

        {/* BLOCS SPÉCIFIQUES SELON TYPE */}

        {/* VO — règles payplan (dates, prix affiché, VE) */}
        {vehicleType === "VO" && (
          <div className="no-print grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-gray-200 pt-4">
            <SectionTitle>Paramètres VO pour Payplan</SectionTitle>
            <div className="grid gap-2">
              <Label className="text-sm font-medium flex items-center gap-1">
                <CalendarDays className="h-4 w-4" /> Date d'achat VO
              </Label>
              <Input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-medium flex items-center gap-1">
                <CalendarDays className="h-4 w-4" /> Date Bon de Commande
              </Label>
              <Input type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-medium">Prix affiché TTC (€)</Label>
              <Input type="number" value={listedPriceTTC} onChange={(e) => setListedPriceTTC(e.target.value)} placeholder="0.00" />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="isElectricVehicle" checked={isElectricVehicle} onCheckedChange={(c) => setIsElectricVehicle(!!c)} />
              <Label htmlFor="isElectricVehicle" className="text-sm">Véhicule Électrique (VO)</Label>
            </div>
          </div>
        )}

        {/* VP — champs différents (type de vente, modèle, flags payplan spé VP) */}
        {vehicleType === "VP" && (
          <div className="no-print grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-gray-200 pt-4">
            <SectionTitle>Détails Véhicule Particulier (VP)</SectionTitle>
            <div className="grid gap-2">
              <Label className="text-sm font-medium">Type de Vente</Label>
              <Select value={vpSalesType} onValueChange={(v: typeof vpSalesType) => setVpSalesType(v)}>
                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PART/VD/Prof Lib/Société">PART/VD/Prof Lib/Société</SelectItem>
                  <SelectItem value="Vente Captive Ford Lease">Vente Captive Ford Lease</SelectItem>
                  <SelectItem value="GC/Loueurs LLD ou LCD">GC / Loueurs LLD ou LCD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-medium">Modèle VP</Label>
              <Select value={vpModel} onValueChange={(v) => setVpModel(v)}>
                <SelectTrigger><SelectValue placeholder="Sélectionner le modèle" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Carline">Carline</SelectItem>
                  <SelectItem value="Tourneo Courier">Tourneo Courier</SelectItem>
                  <SelectItem value="Puma">Puma</SelectItem>
                  <SelectItem value="Puma Gen-E">Puma Gen-E</SelectItem>
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

            {/* Spécifiques finance payplan VP */}
            <div className="flex items-center space-x-2 sm:col-span-2">
              <Checkbox id="isCreditBailVN" checked={isCreditBailVN} onCheckedChange={(c) => setIsCreditBailVN(!!c)} />
              <Label htmlFor="isCreditBailVN" className="text-sm">Crédit-Bail sur un VN</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="isIDFord25Months" checked={isIDFord25Months} onCheckedChange={(c) => setIsIDFord25Months(!!c)} />
              <Label htmlFor="isIDFord25Months" className="text-sm">ID Ford 25 mois</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="isLLDProFordLease" checked={isLLDProFordLease} onCheckedChange={(c) => setIsLLDProFordLease(!!c)} />
              <Label htmlFor="isLLDProFordLease" className="text-sm">LLD Professionnel FORDLease</Label>
            </div>
          </div>
        )}

        {/* VU — champs différents (marges & aménagements) */}
        {vehicleType === "VU" && (
          <div className="no-print grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-gray-200 pt-4">
            <SectionTitle>Détails Véhicule Utilitaire (VU)</SectionTitle>
            <div className="grid gap-2">
              <Label className="text-sm font-medium">Marge Fixe Véhicule + Options (€)</Label>
              <Input type="number" value={margeFixeVehiculeOptions} onChange={(e) => setMargeFixeVehiculeOptions(e.target.value)} placeholder="0.00" />
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-medium">Marge Ford Pro (€)</Label>
              <Input type="number" value={margeFordPro} onChange={(e) => setMargeFordPro(e.target.value)} placeholder="0.00" />
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-medium">Marge Représentation Marque (€)</Label>
              <Input type="number" value={margeRepresentationMarque} onChange={(e) => setMargeRepresentationMarque(e.target.value)} placeholder="0.00" />
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-medium">Marge Accessoires / Aménagements (€)</Label>
              <Input type="number" value={margeAccessoiresAmenagesVU} onChange={(e) => setMargeAccessoiresAmenagesVU(e.target.value)} placeholder="0.00" />
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-medium">Assistance Constructeur (€)</Label>
              <Input type="number" value={assistanceConstructeur} onChange={(e) => setAssistanceConstructeur(e.target.value)} placeholder="0.00" />
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-medium">Remise Consentie (€)</Label>
              <Input type="number" value={remiseConsentie} onChange={(e) => setRemiseConsentie(e.target.value)} placeholder="0.00" />
            </div>
          </div>
        )}

        {/* FINANCEMENT (commun mais options affichées seulement si coché) */}
        <div className="no-print grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-gray-200 pt-4">
          <SectionTitle>Détails Financement</SectionTitle>
          <div className="flex items-center space-x-2 sm:col-span-2">
            <Checkbox id="hasFinancing" checked={hasFinancing} onCheckedChange={(c) => setHasFinancing(!!c)} />
            <Label htmlFor="hasFinancing" className="text-sm">Vente avec Financement</Label>
          </div>

          {hasFinancing && (
            <>
              <div className="grid gap-2 sm:col-span-2">
                <Label className="text-sm font-medium">Montant financé HT (€) (CA HT)</Label>
                <Input type="number" value={financedAmountHT} onChange={(e) => setFinancedAmountHT(e.target.value)} placeholder="0.00" />
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Barème Financement</Label>
                <Select value={financingType} onValueChange={(v: typeof financingType) => setFinancingType(v)}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="principal">Principal (VN/VD/VO)</SelectItem>
                    <SelectItem value="specific">Promo (CC Ford/LOA/LLD/CGI)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Prestations (Assurances)</Label>
                <Select value={numberOfServicesSold} onValueChange={(v: "0" | "1" | "2" | "3") => setNumberOfServicesSold(v)}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Flags spécifiques se montrent selon type */}
              {vehicleType === "VP" && (
                <>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="cb-vn" checked={isCreditBailVN} onCheckedChange={(c) => setIsCreditBailVN(!!c)} />
                    <Label htmlFor="cb-vn" className="text-sm">Crédit-Bail VN</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="id25" checked={isIDFord25Months} onCheckedChange={(c) => setIsIDFord25Months(!!c)} />
                    <Label htmlFor="id25" className="text-sm">ID Ford 25 mois</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="lldpro" checked={isLLDProFordLease} onCheckedChange={(c) => setIsLLDProFordLease(!!c)} />
                    <Label htmlFor="lldpro" className="text-sm">LLD Pro FORDLease</Label>
                  </div>
                </>
              )}

              {vehicleType === "VO" && (
                <div className="flex items-center space-x-2">
                  <Checkbox id="loavo" checked={isLOAVO} onCheckedChange={(c) => setIsLOAVO(!!c)} />
                  <Label htmlFor="loavo" className="text-sm">LOA sur VO (CGI Finance)</Label>
                </div>
              )}
            </>
          )}
        </div>

        {/* PACKS / CLD / ENTRETIEN */}
        <div className="no-print grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-gray-200 pt-4">
          <SectionTitle>Packs Livraison & Autres Périphériques</SectionTitle>
          <div className="grid gap-2">
            <Label className="text-sm font-medium">Pack Livraison Vendu</Label>
            <Select value={deliveryPackSold} onValueChange={(v: "none" | "pack1" | "pack2" | "pack3") => setDeliveryPackSold(v)}>
              <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucun Pack</SelectItem>
                <SelectItem value="pack1">Pack 1 (Non commissionné)</SelectItem>
                <SelectItem value="pack2">Pack 2 (20€)</SelectItem>
                <SelectItem value="pack3">Pack 3 (35€)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="pen65" checked={isHighPenetrationRate} onCheckedChange={(c) => setIsHighPenetrationRate(!!c)} />
            <Label htmlFor="pen65" className="text-sm">Pénétration Pack &gt; 65% (Bonus)</Label>
          </div>
          <div className="grid gap-2">
            <Label className="text-sm font-medium">CLD Ford</Label>
            <Select value={cldFordDuration} onValueChange={(v: typeof cldFordDuration) => setCldFordDuration(v)}>
              <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucun CLD</SelectItem>
                <SelectItem value="3-4">3 ou 4 ans</SelectItem>
                <SelectItem value="5+">5 ans et +</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="entretien" checked={hasMaintenanceContract} onCheckedChange={(c) => setHasMaintenanceContract(!!c)} />
            <Label htmlFor="entretien" className="text-sm">Contrat d'entretien</Label>
          </div>
        </div>

        {/* COYOTE & ACCESSOIRES */}
        <div className="no-print grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-gray-200 pt-4">
          <SectionTitle>Coyote & Accessoires</SectionTitle>
          <div className="flex items-center space-x-2">
            <Checkbox id="coyote" checked={hasCoyote} onCheckedChange={(c) => setHasCoyote(!!c)} />
            <Label htmlFor="coyote" className="text-sm">Coyote Secure Tracker vendu</Label>
          </div>
          {hasCoyote && (
            <div className="grid gap-2">
              <Label className="text-sm font-medium">Durée Coyote</Label>
              <Select value={coyoteDuration} onValueChange={(v: typeof coyoteDuration) => setCoyoteDuration(v)}>
                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Non sélectionné</SelectItem>
                  <SelectItem value="24">24 mois</SelectItem>
                  <SelectItem value="36">36 mois</SelectItem>
                  <SelectItem value="48">48 mois</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex items-center space-x-2 sm:col-span-2">
            <Checkbox id="hasAccessories" checked={hasAccessories} onCheckedChange={(c) => setHasAccessories(!!c)} />
            <Label htmlFor="hasAccessories" className="text-sm">Véhicule vendu avec Accessoire</Label>
          </div>
          {hasAccessories && (
            <div className="grid gap-2 sm:col-span-2">
              <Label className="text-sm font-medium">Montant des accessoires TTC (€)</Label>
              <Input type="number" value={accessoryAmountTTC} onChange={(e) => setAccessoryAmountTTC(e.target.value)} placeholder="0.00" />
              <p className="text-xs text-gray-600">
                Nouveau barème: 50-250€ TTC = 10€, 251-800€ TTC = 50€, 801€+ TTC = 75€
              </p>
            </div>
          )}
        </div>

        {/* FRAIS (plutôt VO/VP). On laisse disponibles sauf cession auto où ils sont exclus du calcul achat TTC/cession. */}
        {!isOtherStockCession && (
          <div className="no-print grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-gray-200 pt-4">
            <SectionTitle>Frais & Bonus (Manuels)</SectionTitle>
            <div className="grid gap-2">
              <Label className="text-sm font-medium">Garantie 12 Mois (€)</Label>
              <Input type="number" value={warranty12Months} onChange={(e) => setWarranty12Months(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-medium">Cession Atelier (€)</Label>
              <Input type="number" value={workshopTransfer} onChange={(e) => setWorkshopTransfer(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-medium">Préparation HT (€)</Label>
              <Input type="number" value={preparationHT} onChange={(e) => setPreparationHT(e.target.value)} />
            </div>
          </div>
        )}

        {/* ACTION CALCUL */}
        <Button
          onClick={handleCalculate}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 py-2 sm:py-3 text-sm sm:text-base lg:text-lg font-semibold no-print shadow-lg"
        >
          Calculer les Marges & Commissions
        </Button>

        {/* RÉSULTATS & DÉTAIL COMMISSION */}
        {calculatedResults && (
          <>
            <div className="mt-4 sm:mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 animate-fade-in-up no-print">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" /> Résultats du Calcul
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700">
                <div>
                  <p className="text-xs text-gray-600">{isOtherStockCession && vehicleType === "VO" ? "Prix d'achat calculé TTC:" : "Prix Achat HT:"}</p>
                  <p className="text-base font-bold">
                    {isOtherStockCession && vehicleType === "VO"
                      ? (Number(sellingPriceTTC) - 1800).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })
                      : (calculatedResults.purchasePriceHT).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">{isOtherStockCession && vehicleType === "VO" ? "Prix cession TTC:" : "Prix Vente HT:"}</p>
                  <p className="text-base font-bold">
                    {isOtherStockCession && vehicleType === "VO"
                      ? (1800).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })
                      : (calculatedResults.sellingPriceHT).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Marge HT (Initiale):</p>
                  <p className="text-base font-bold text-green-600">
                    {calculatedResults.initialMarginHT.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Marge Restante HT:</p>
                  <p className="text-base font-bold text-green-600">
                    {calculatedResults.remainingMarginHT.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Commission Vendeur:</p>
                  <p className="text-base font-bold text-blue-600">
                    {calculatedResults.sellerCommission.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Marge Finale (Concessionnaire):</p>
                  <p className="text-base font-bold text-green-600">
                    {calculatedResults.finalMargin.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                  </p>
                </div>
              </div>

              {/* Détail Commission — toutes lignes payplan (affichées selon type) */}
              <div className="mt-6 bg-white border border-gray-200 rounded-md p-4">
                <h4 className="text-base font-semibold text-gray-800 mb-3">💲 Détail Commission Vendeur</h4>

                {vehicleType === "VO" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Line label="Commission VO (Base)" value={calculatedResults.commissionDetails.voBaseCommission} />
                    <Line label="Bonus -60 Jours (VO)" value={calculatedResults.commissionDetails.voBonus60Days} />
                    <Line label="Bonus Prix Affiché (VO)" value={calculatedResults.commissionDetails.voBonusListedPrice} />
                    <Line label="Bonus Véhicule Électrique (VO)" value={calculatedResults.commissionDetails.voBonusElectricVehicle} />
                    <Line label="Bonus Financement VO" value={calculatedResults.commissionDetails.voBonusFinancing} />
                  </div>
                )}

                {vehicleType === "VP" && (
                  <div className="grid gap-2">
                    <Line label="Commission VP" value={calculatedResults.commissionDetails.vpCommission} />
                  </div>
                )}

                {vehicleType === "VU" && (
                  <div className="grid gap-2">
                    <Line label="Commission VU" value={calculatedResults.commissionDetails.vuCommission} />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                  <Line label="Bonus Financement" value={calculatedResults.commissionDetails.financingBonus} />
                  <Line label="Bonus Pack Livraison" value={calculatedResults.commissionDetails.deliveryPackBonus} />
                  <Line label="Bonus Pénétration Pack" value={calculatedResults.commissionDetails.packPenetrationBonus} />
                  <Line label="Bonus CLD Ford" value={calculatedResults.commissionDetails.cldBonus} />
                  <Line label="Bonus Contrat Entretien" value={calculatedResults.commissionDetails.maintenanceContractBonus} />
                  <Line label="Bonus Coyote" value={calculatedResults.commissionDetails.coyoteBonus} />
                  <Line label="Bonus Accessoires" value={calculatedResults.commissionDetails.accessoryBonus} />
                </div>

                <div className="border-t border-gray-200 mt-4 pt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-800">Commission Totale Vendeur</span>
                  <span className="text-lg font-bold text-blue-600">
                    {calculatedResults.sellerCommission.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                  </span>
                </div>
              </div>
            </div>

            {/* Version imprimable */}
            <div className="print-only" style={{ display: "none" }}>
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
                warranty12Months={warranty12Months}
                workshopTransfer={workshopTransfer}
                preparationHT={preparationHT}
              />
            </div>
          </>
        )}
      </CardContent>

      <CardFooter className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row justify-end gap-2 bg-gray-50 no-print">
        <Button onClick={handlePrint} variant="outline" className="w-full sm:w-auto" disabled={!calculatedResults}>
          <Printer className="h-4 w-4 mr-1" />
          Imprimer / Télécharger PDF
        </Button>
        <Button onClick={resetForm} variant="outline" className="w-full sm:w-auto">Réinitialiser</Button>
        <Button
          onClick={handleSave}
          disabled={!calculatedResults || !vehicleSoldName || !clientName || !sellerName}
          className="w-full sm:w-auto bg-green-600 text-white hover:bg-green-700"
        >
          Enregistrer la Fiche
        </Button>
      </CardFooter>
    </Card>
  )
}

function Line({ label, value }: { label: string; value: number }) {
  const formatCurrency = (v: number) =>
    (v || 0).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-bold text-blue-600">{formatCurrency(value)}</span>
    </div>
  )
}