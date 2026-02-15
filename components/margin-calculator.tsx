// components/margin-calculator.tsx

"use client"

import { useState, useRef } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { v4 as uuidv4 } from "uuid"
import { CheckCircle, DollarSign, Car, Info, CalendarDays, Printer, Plus, Trash2, Calculator, Eye, Download, X } from "lucide-react"
import {
  calculateMarginSheet,
  type Payplan,
  type CalculatedResults,
  type MarginSheet,
  type VNOption,
  type VNDiscount,
  type VNFordRecovery,
  convertHTToTTC,
  convertTTCToHT,
  VAT_RATE,
} from "@/lib/margin-utils"
import { PrintableMarginSheet } from "./printable-margin-sheet"
import { MarginSheetPreview } from "./margin-sheet-preview"

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

  // Nouveaux champs VN (simplifiés)
  const [vnClientKeyInHandPriceHT, setVnClientKeyInHandPriceHT] = useState<number | string>("")
  const [vnClientDeparturePriceHT, setVnClientDeparturePriceHT] = useState<number | string>("")
  const [vnOptions, setVnOptions] = useState<VNOption[]>([])
  const [vnDiscounts, setVnDiscounts] = useState<VNDiscount[]>([])
  const [vnFordRecovery, setVnFordRecovery] = useState<VNFordRecovery>({
    attaque: 0,
    renforcementStock: 0,
    aideReprise: 0,
    plusValueTarif: 0
  })

  // Cession autre stock
  const [isOtherStockCession, setIsOtherStockCession] = useState(false)

  // VO spécifiques
  const [purchaseDate, setPurchaseDate] = useState("")
  const [orderDate, setOrderDate] = useState("")
  const [listedPriceTTC, setListedPriceTTC] = useState<number | string>("")
  const [isElectricVehicle, setIsElectricVehicle] = useState(false)

  // VP (VN/VD) spécifiques
  const [vpSalesType, setVpSalesType] = useState<"PART/VD/Prof Lib/Société" | "Vente Captive Ford Lease" | "GC/Loueurs LLD ou LCD">("PART/VD/Prof Lib/Société")
  const [vpModel, setVpModel] = useState<string>("")

  // VU spécifiques
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
  const [numberOfServicesSold, setNumberOfServicesSold] = useState<"0" | "1" | "2" | "3">("0")
  const [isCreditBailVN, setIsCreditBailVN] = useState(false)
  const [isLOAVO, setIsLOAVO] = useState(false)
  const [isIDFord25Months, setIsIDFord25Months] = useState(false)
  const [isLLDProFordLease, setIsLLDProFordLease] = useState(false)

  // Packs / périphériques
  const [deliveryPackSold, setDeliveryPackSold] = useState<"none" | "pack1" | "pack2" | "pack3">("none")
  const [isHighPenetrationRate, setIsHighPenetrationRate] = useState(false)
  const [cldFordDuration, setCldFordDuration] = useState<"none" | "3-4" | "5+">("none")
  const [hasMaintenanceContract, setHasMaintenanceContract] = useState(false)

  // Coyote
  const [hasCoyote, setHasCoyote] = useState(false)
  const [coyoteDuration, setCoyoteDuration] = useState<"none" | "24" | "36" | "48">("none")

  // Accessoires
  const [hasAccessories, setHasAccessories] = useState(false)
  const [accessoryAmountTTC, setAccessoryAmountTTC] = useState<number | string>("")

  // Frais fixes
  const [warranty12Months, setWarranty12Months] = useState<number | string>(219)
  const [workshopTransfer, setWorkshopTransfer] = useState<number | string>("")
  const [preparationHT, setPreparationHT] = useState<number | string>(45)

  // Résultats
  const [calculatedResults, setCalculatedResults] = useState<CalculatedResults | null>(null)

  // Dialog aperçu
  const [showPreview, setShowPreview] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  // Fonctions pour gérer les options VN
  const addVnOption = () => {
    setVnOptions([...vnOptions, { id: uuidv4(), name: "", priceHT: 0, priceTTC: 0 }])
  }

  const updateVnOption = (id: string, field: keyof VNOption, value: string | number) => {
    setVnOptions(vnOptions.map(option => {
      if (option.id === id) {
        const updatedOption = { ...option, [field]: value }
        
        // Conversion automatique HT/TTC pour les options
        if (field === 'priceHT' && typeof value === 'number' && value > 0) {
          updatedOption.priceTTC = Number(convertHTToTTC(value).toFixed(2))
        } else if (field === 'priceTTC' && typeof value === 'number' && value > 0) {
          updatedOption.priceHT = Number(convertTTCToHT(value).toFixed(2))
        }
        
        return updatedOption
      }
      return option
    }))
  }

  const removeVnOption = (id: string) => {
    setVnOptions(vnOptions.filter(option => option.id !== id))
  }

  // Fonctions pour gérer les remises VN avec conversion automatique
  const addVnDiscount = () => {
    setVnDiscounts([...vnDiscounts, { id: uuidv4(), name: "", amountHT: 0, amountTTC: 0 }])
  }

  const updateVnDiscount = (id: string, field: keyof VNDiscount, value: string | number) => {
    setVnDiscounts(vnDiscounts.map(discount => {
      if (discount.id === id) {
        const updatedDiscount = { ...discount, [field]: value }
        
        // Conversion automatique HT/TTC pour les remises
        if (field === 'amountHT' && typeof value === 'number' && value > 0) {
          updatedDiscount.amountTTC = Number(convertHTToTTC(value).toFixed(2))
        } else if (field === 'amountTTC' && typeof value === 'number' && value > 0) {
          updatedDiscount.amountHT = Number(convertTTCToHT(value).toFixed(2))
        }
        
        return updatedDiscount
      }
      return discount
    }))
  }

  const removeVnDiscount = (id: string) => {
    setVnDiscounts(vnDiscounts.filter(discount => discount.id !== id))
  }

  const handleCalculate = () => {
    const inputs = {
      vehicleType,
      isOtherStockCession,
      purchasePriceTTC: Number(purchasePriceTTC || 0),
      sellingPriceTTC: Number(sellingPriceTTC || 0),
      tradeInValueHT: Number(tradeInValueHT || 0),
      vnClientKeyInHandPriceHT: Number(vnClientKeyInHandPriceHT || 0),
      vnClientDeparturePriceHT: Number(vnClientDeparturePriceHT || 0),
      vnOptions,
      vnDiscounts,
      vnFordRecovery,
      warranty12Months: Number(warranty12Months || 0),
      workshopTransfer: Number(workshopTransfer || 0),
      preparationHT: Number(preparationHT || 0),
      purchaseDate,
      orderDate,
      listedPriceTTC: Number(listedPriceTTC || 0),
      isElectricVehicle,
      vpSalesType,
      vpModel,
      margeFixeVehiculeOptions: Number(margeFixeVehiculeOptions || 0),
      margeFordPro: Number(margeFordPro || 0),
      margeRepresentationMarque: Number(margeRepresentationMarque || 0),
      margeAccessoiresAmenagesVU: Number(margeAccessoiresAmenagesVU || 0),
      assistanceConstructeur: Number(assistanceConstructeur || 0),
      remiseConsentie: Number(remiseConsentie || 0),
      hasFinancing,
      financedAmountHT: Number(financedAmountHT || 0),
      financingType,
      numberOfServicesSold: Number(numberOfServicesSold),
      isCreditBailVN,
      isLOAVO,
      isIDFord25Months,
      isLLDProFordLease,
      deliveryPackSold,
      isHighPenetrationRate,
      cldFordDuration,
      hasMaintenanceContract,
      hasCoyote,
      coyoteDuration,
      hasAccessories,
      accessoryAmountTTC: Number(accessoryAmountTTC || 0),
      accessoryAmountHT: 0,
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
      purchaseDate,
      orderDate,
      listedPriceTTC: Number(listedPriceTTC || 0),
      isElectricVehicle,
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
      margeFixeVehiculeOptions: Number(margeFixeVehiculeOptions || 0),
      margeFordPro: Number(margeFordPro || 0),
      margeRepresentationMarque: Number(margeRepresentationMarque || 0),
      margeAccessoiresAmenagesVU: Number(margeAccessoiresAmenagesVU || 0),
      assistanceConstructeur: Number(assistanceConstructeur || 0),
      remiseConsentie: Number(remiseConsentie || 0),
      hasCoyote,
      coyoteDuration,
      hasAccessories,
      accessoryAmountHT: 0,
      accessoryAmountTTC: Number(accessoryAmountTTC || 0),
      isOtherStockCession,
      vnClientKeyInHandPriceHT: Number(vnClientKeyInHandPriceHT || 0),
      vnClientDeparturePriceHT: Number(vnClientDeparturePriceHT || 0),
      vnOptions,
      vnDiscounts,
      vnFordRecovery,
      remainingMarginHT: calculatedResults.remainingMarginHT,
      finalMargin: calculatedResults.finalMargin,
      sellerCommission: calculatedResults.sellerCommission,
      commissionDetails: calculatedResults.commissionDetails,
      financingType,
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
    setVnClientKeyInHandPriceHT("")
    setVnClientDeparturePriceHT("")
    setVnOptions([])
    setVnDiscounts([])
    setVnFordRecovery({
      attaque: 0,
      renforcementStock: 0,
      aideReprise: 0,
      plusValueTarif: 0
    })
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

  const isVNMode = vehicleType === "VP"

  return (
    <Card className="bg-white border-gray-200 text-gray-900 shadow-xl animate-fade-in margin-calculator-card">
      <CardHeader className="border-b border-gray-200">
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
              <Input value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} placeholder="Ex: VN2025001" />
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
              <Input value={vehicleSoldName} onChange={(e) => setVehicleSoldName(e.target.value)} placeholder="Ex: Ford Puma Gen-E" />
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
              <SelectItem value="VP">Véhicule Neuf (VN) - Particulier</SelectItem>
              <SelectItem value="VU">Véhicule Utilitaire (VU) VN/VD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* DÉTAILS ACHAT/VENTE */}
        <div className="no-print grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 border-t border-gray-200 pt-4 sm:pt-6">
          <SectionTitle>Détails Achat/Vente</SectionTitle>

          {vehicleType === "VO" && (
            <div className="flex items-center space-x-2 sm:col-span-2">
              <Checkbox id="isOtherStockCession" checked={isOtherStockCession} onCheckedChange={(c) => setIsOtherStockCession(!!c)} />
              <Label htmlFor="isOtherStockCession" className="text-sm">
                Cession autre stock (Achat = Affiché − 1 800 € ; Cession = 1 800 € TTC)
              </Label>
            </div>
          )}

          {isVNMode ? (
            <>
              <div className="grid gap-2">
                <Label className="text-sm font-medium text-green-600">Prix client clé en main HT (€)</Label>
                <Input 
                  type="number" 
                  value={vnClientKeyInHandPriceHT} 
                  onChange={(e) => setVnClientKeyInHandPriceHT(e.target.value)} 
                  placeholder="28325.00"
                  className="border-green-300 focus:border-green-500"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium text-green-600">Prix départ client HT (€)</Label>
                <Input 
                  type="number" 
                  value={vnClientDeparturePriceHT} 
                  onChange={(e) => setVnClientDeparturePriceHT(e.target.value)} 
                  placeholder="27620.00"
                  className="border-green-300 focus:border-green-500"
                />
              </div>
              {vnClientDeparturePriceHT && (
                <div className="grid gap-2 sm:col-span-2">
                  <Label className="text-sm font-medium text-green-600">Marge calculée (5% du prix départ client HT)</Label>
                  <Input 
                    disabled 
                    value={`${(Number(vnClientDeparturePriceHT) * 0.05).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}`}
                    className="bg-green-50 text-green-700 font-semibold"
                  />
                </div>
              )}
              <div className="grid gap-2 sm:col-span-2">
                <Label className="text-sm font-medium">Reprise (ccvo ht €)</Label>
                <Input type="number" value={tradeInValueHT} onChange={(e) => setTradeInValueHT(e.target.value)} placeholder="0.00" />
              </div>
            </>
          ) : isOtherStockCession && vehicleType === "VO" ? (
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
              <div className="grid gap-2 sm:col-span-2">
                <Label className="text-sm font-medium">Reprise (ccvo ht €)</Label>
                <Input type="number" value={tradeInValueHT} onChange={(e) => setTradeInValueHT(e.target.value)} placeholder="0.00" />
              </div>
            </>
          )}
        </div>

        {/* OPTIONS VN */}
        {isVNMode && (
          <div className="no-print border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between mb-4">
              <SectionTitle>Tarif Options</SectionTitle>
              <Button onClick={addVnOption} size="sm" className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-1" />
                Ajouter Option
              </Button>
            </div>
            
            {vnOptions.length > 0 && (
              <div className="space-y-3">
                {vnOptions.map((option) => (
                  <div key={option.id} className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <Label className="text-xs text-gray-600">Nom de l'option</Label>
                      <Input
                        value={option.name}
                        onChange={(e) => updateVnOption(option.id, "name", e.target.value)}
                        placeholder="Ex: noir agate"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Prix HT (€) *</Label>
                      <Input
                        type="number"
                        value={option.priceHT}
                        onChange={(e) => updateVnOption(option.id, "priceHT", Number(e.target.value))}
                        placeholder="75.00"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Prix TTC (€) *</Label>
                      <Input
                        type="number"
                        value={option.priceTTC}
                        onChange={(e) => updateVnOption(option.id, "priceTTC", Number(e.target.value))}
                        placeholder="90.00"
                        className="text-sm"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={() => removeVnOption(option.id)} size="sm" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-end p-3 bg-green-100 rounded-lg">
                  <div className="text-sm">
                    <span className="font-medium">Total Options HT: </span>
                    <span className="font-bold text-green-700">
                      {formatCurrency(vnOptions.reduce((sum, opt) => sum + opt.priceHT, 0))}
                    </span>
                    <span className="mx-2">|</span>
                    <span className="font-medium">Total Options TTC: </span>
                    <span className="font-bold text-green-700">
                      {formatCurrency(vnOptions.reduce((sum, opt) => sum + opt.priceTTC, 0))}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 italic">* Remplissez HT ou TTC, l'autre se calcule automatiquement</p>
              </div>
            )}
          </div>
        )}

        {/* REMISES VN */}
        {isVNMode && (
          <div className="no-print border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between mb-4">
              <SectionTitle>Remises</SectionTitle>
              <Button onClick={addVnDiscount} size="sm" className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-1" />
                Ajouter Remise
              </Button>
            </div>
            
            {vnDiscounts.length > 0 && (
              <div className="space-y-3">
                {vnDiscounts.map((discount) => (
                  <div key={discount.id} className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <Label className="text-xs text-gray-600">Type de remise</Label>
                      <Input
                        value={discount.name}
                        onChange={(e) => updateVnDiscount(discount.id, "name", e.target.value)}
                        placeholder="Ex: REMISE, CCVN"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Montant HT (€) *</Label>
                      <Input
                        type="number"
                        value={discount.amountHT}
                        onChange={(e) => updateVnDiscount(discount.id, "amountHT", Number(e.target.value))}
                        placeholder="1250.00"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Montant TTC (€) *</Label>
                      <Input
                        type="number"
                        value={discount.amountTTC}
                        onChange={(e) => updateVnDiscount(discount.id, "amountTTC", Number(e.target.value))}
                        placeholder="1500.00"
                        className="text-sm"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={() => removeVnDiscount(discount.id)} size="sm" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-end p-3 bg-red-100 rounded-lg">
                  <div className="text-sm">
                    <span className="font-medium">Total Remises HT: </span>
                    <span className="font-bold text-red-700">
                      {formatCurrency(vnDiscounts.reduce((sum, disc) => sum + disc.amountHT, 0))}
                    </span>
                    <span className="mx-2">|</span>
                    <span className="font-medium">Total Remises TTC: </span>
                    <span className="font-bold text-red-700">
                      {formatCurrency(vnDiscounts.reduce((sum, disc) => sum + disc.amountTTC, 0))}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 italic">* Remplissez HT ou TTC, l'autre se calcule automatiquement</p>
              </div>
            )}
          </div>
        )}

        {/* RÉCUPÉRATION FORD - VERSION SIMPLIFIÉE */}
        {isVNMode && (
          <div className="no-print border-t border-gray-200 pt-4">
            <SectionTitle>Récupération FORD (Optionnel)</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Label className="text-sm font-medium text-blue-800">ATTAQUE (€)</Label>
                  <Input
                    type="number"
                    value={vnFordRecovery.attaque}
                    onChange={(e) => setVnFordRecovery({
                      ...vnFordRecovery,
                      attaque: Number(e.target.value)
                    })}
                    placeholder="673.78"
                    className="text-sm mt-2"
                  />
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Label className="text-sm font-medium text-blue-800">RENFORT STOCK (€)</Label>
                  <Input
                    type="number"
                    value={vnFordRecovery.renforcementStock}
                    onChange={(e) => setVnFordRecovery({
                      ...vnFordRecovery,
                      renforcementStock: Number(e.target.value)
                    })}
                    placeholder="0.00"
                    className="text-sm mt-2"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Label className="text-sm font-medium text-blue-800">AIDE À LA REPRISE (€)</Label>
                  <Input
                    type="number"
                    value={vnFordRecovery.aideReprise}
                    onChange={(e) => setVnFordRecovery({
                      ...vnFordRecovery,
                      aideReprise: Number(e.target.value)
                    })}
                    placeholder="733.15"
                    className="text-sm mt-2"
                  />
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Label className="text-sm font-medium text-blue-800">PLUS VALUE TARIF (€)</Label>
                  <Input
                    type="number"
                    value={vnFordRecovery.plusValueTarif}
                    onChange={(e) => setVnFordRecovery({
                      ...vnFordRecovery,
                      plusValueTarif: Number(e.target.value)
                    })}
                    placeholder="1612.92"
                    className="text-sm mt-2"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-100 rounded-lg">
              <div className="text-sm">
                <span className="font-medium">Total Récupération FORD: </span>
                <span className="font-bold text-blue-700">
                  {formatCurrency(
                    vnFordRecovery.attaque +
                    vnFordRecovery.renforcementStock +
                    vnFordRecovery.aideReprise +
                    vnFordRecovery.plusValueTarif
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* VP/VN - Type de vente et modèle */}
        {vehicleType === "VP" && (
          <div className="no-print grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-gray-200 pt-4">
            <SectionTitle>Détails Véhicule Neuf (VN) - Commission selon Payplan</SectionTitle>
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
            
            {vpSalesType && vpModel && (
              <div className="sm:col-span-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Commission selon payplan:</strong> {formatCurrency(payplan.vpCommissions[vpSalesType][vpModel] || 0)}
                  {" "}({vpSalesType} - {vpModel})
                </p>
              </div>
            )}

            {/* Flags spécifiques finance payplan VP */}
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

        {/* RESTE DES SECTIONS EXISTANTES POUR VO/VU */}
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

        {/* FINANCEMENT */}
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

        {/* FRAIS */}
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
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
        >
          <Calculator className="h-4 w-4 mr-2" />
          Calculer les Marges & Commissions {isVNMode ? "VN" : vehicleType}
        </Button>

        {/* RÉSULTATS */}
        {calculatedResults && (
          <>
            <div className="mt-4 sm:mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 animate-fade-in-up no-print">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" /> 
                Résultats du Calcul {isVNMode ? "VN (Véhicule Neuf)" : vehicleType}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700">
                {isVNMode && (
                  <>
                    <div>
                      <p className="text-xs text-gray-600">Prix clé en main HT:</p>
                      <p className="text-base font-bold text-green-600">
                        {formatCurrency(calculatedResults.purchasePriceHT)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Prix départ client HT:</p>
                      <p className="text-base font-bold text-green-600">
                        {formatCurrency(calculatedResults.sellingPriceHT)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Marge VN (5%):</p>
                      <p className="text-base font-bold text-green-600">
                        {formatCurrency(calculatedResults.vnCalculatedMargin || 0)}
                      </p>
                    </div>
                    {calculatedResults.vnTotalOptionsHT !== undefined && (
                      <div>
                        <p className="text-xs text-gray-600">Total Options HT:</p>
                        <p className="text-base font-bold text-blue-600">
                          {formatCurrency(calculatedResults.vnTotalOptionsHT)}
                        </p>
                      </div>
                    )}
                    {calculatedResults.vnTotalDiscountsHT !== undefined && (
                      <div>
                        <p className="text-xs text-gray-600">Total Remises HT:</p>
                        <p className="text-base font-bold text-red-600">
                          -{formatCurrency(calculatedResults.vnTotalDiscountsHT)}
                        </p>
                      </div>
                    )}
                    {calculatedResults.vnFordRecoveryTotal !== undefined && (
                      <div>
                        <p className="text-xs text-gray-600">Récupération FORD:</p>
                        <p className="text-base font-bold text-blue-600">
                          {formatCurrency(calculatedResults.vnFordRecoveryTotal)}
                        </p>
                      </div>
                    )}
                  </>
                )}
                
                <div>
                  <p className="text-xs text-gray-600">Marge Restante HT:</p>
                  <p className="text-base font-bold text-green-600">
                    {formatCurrency(calculatedResults.remainingMarginHT)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Commission Vendeur:</p>
                  <p className="text-base font-bold text-blue-600">
                    {formatCurrency(calculatedResults.sellerCommission)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Marge Finale (Concessionnaire):</p>
                  <p className="text-base font-bold text-green-600">
                    {formatCurrency(calculatedResults.finalMargin)}
                  </p>
                </div>
              </div>

              {/* Détail Commission */}
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
                    <Line label={`Commission VN (${vpSalesType} - ${vpModel})`} value={calculatedResults.commissionDetails.vpCommission} />
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
                    {formatCurrency(calculatedResults.sellerCommission)}
                  </span>
                </div>
              </div>
            </div>

            {/* Version imprimable - rendu directement sans wrapper */}
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
              vnClientKeyInHandPriceHT={vnClientKeyInHandPriceHT}
              vnClientDeparturePriceHT={vnClientDeparturePriceHT}
            />
          </>
        )}
      </CardContent>

      <CardFooter className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row justify-end gap-2 bg-gray-50 no-print">
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto" disabled={!calculatedResults}>
              <Eye className="h-4 w-4 mr-1" />
              Aperçu
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
            <DialogHeader className="px-6 pt-6 pb-4 border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-xl">Aperçu de la Feuille de Marge</DialogTitle>
                  <DialogDescription>
                    Vérifiez les informations avant d'imprimer ou d'enregistrer
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <ScrollArea className="max-h-[calc(90vh-180px)]">
              <div className="p-6">
                {calculatedResults && (
                  <MarginSheetPreview
                    ref={previewRef}
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
                    financedAmountHT={financedAmountHT}
                    isElectricVehicle={isElectricVehicle}
                    deliveryPackSold={deliveryPackSold}
                    cldFordDuration={cldFordDuration}
                    hasMaintenanceContract={hasMaintenanceContract}
                    hasCoyote={hasCoyote}
                    hasAccessories={hasAccessories}
                    accessoryAmountTTC={accessoryAmountTTC}
                    warranty12Months={warranty12Months}
                    workshopTransfer={workshopTransfer}
                    preparationHT={preparationHT}
                    vnClientKeyInHandPriceHT={vnClientKeyInHandPriceHT}
                    vnClientDeparturePriceHT={vnClientDeparturePriceHT}
                    vnOptions={vnOptions}
                    vnDiscounts={vnDiscounts}
                    vnFordRecovery={vnFordRecovery}
                  />
                )}
              </div>
            </ScrollArea>
            <DialogFooter className="px-6 py-4 border-t bg-gray-50">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Fermer
              </Button>
              <Button onClick={handlePrint} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Printer className="h-4 w-4 mr-2" />
                Imprimer / PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button onClick={handlePrint} variant="outline" className="w-full sm:w-auto" disabled={!calculatedResults}>
          <Printer className="h-4 w-4 mr-1" />
          Imprimer
        </Button>
        <Button onClick={resetForm} variant="outline" className="w-full sm:w-auto">Réinitialiser</Button>
        <Button
          onClick={handleSave}
          disabled={!calculatedResults || !vehicleSoldName || !clientName || !sellerName}
          className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
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