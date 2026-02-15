"use client"

import { useState, useRef } from "react"
import {
  Calculator,
  Car,
  User,
  Calendar,
  DollarSign,
  Percent,
  Package,
  CreditCard,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Printer,
  Eye,
  Save,
  ChevronRight,
  Info,
  TrendingUp,
  Trophy,
  Zap,
  Shield
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// ============================================
// PREMIUM CALCULATOR PAGE - AutoPerf Pro
// ============================================

type VehicleType = "VO" | "VN" | "VU"
type FinancingType = "principal" | "promo"

interface CalculationResult {
  totalRevenue: number
  totalCosts: number
  grossMargin: number
  commission: number
  netMargin: number
  marginRate: number
}

// Step indicators
const steps = [
  { id: "info", label: "Informations", icon: User },
  { id: "vehicle", label: "Véhicule", icon: Car },
  { id: "pricing", label: "Prix & Marge", icon: DollarSign },
  { id: "options", label: "Options & Financement", icon: Package },
  { id: "result", label: "Résultats", icon: Trophy }
]

export default function CalculatorPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [vehicleType, setVehicleType] = useState<VehicleType>("VO")
  const [showResults, setShowResults] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  
  // Form states
  const [formData, setFormData] = useState({
    sellerName: "",
    clientName: "",
    vehicleName: "",
    vehicleNumber: "",
    purchasePrice: "",
    sellingPrice: "",
    tradeInValue: "",
    hasFinancing: false,
    financedAmount: "",
    hasAccessories: false,
    accessoryAmount: "",
    hasWarranty: false,
    warrantyAmount: "219",
    preparationCost: "45",
    deliveryPack: "none"
  })

  const [result, setResult] = useState<CalculationResult | null>(null)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const calculate = () => {
    const purchase = parseFloat(formData.purchasePrice) || 0
    const selling = parseFloat(formData.sellingPrice) || 0
    const tradeIn = parseFloat(formData.tradeInValue) || 0
    const warranty = formData.hasWarranty ? parseFloat(formData.warrantyAmount) || 0 : 0
    const prep = parseFloat(formData.preparationCost) || 0
    const accessories = formData.hasAccessories ? parseFloat(formData.accessoryAmount) || 0 : 0
    
    const totalRevenue = selling + tradeIn
    const totalCosts = purchase + warranty + prep + (accessories * 0.7) // 70% cost on accessories
    const grossMargin = totalRevenue - totalCosts
    
    // Commission calculation (simplified)
    const baseCommission = grossMargin * 0.15
    const financingBonus = formData.hasFinancing ? 150 : 0
    const accessoryBonus = accessories > 0 ? (accessories <= 250 ? 10 : accessories <= 800 ? 50 : 75) : 0
    const packBonus = formData.deliveryPack === "pack2" ? 20 : formData.deliveryPack === "pack3" ? 35 : 0
    
    const commission = baseCommission + financingBonus + accessoryBonus + packBonus
    const netMargin = grossMargin - commission
    const marginRate = selling > 0 ? (grossMargin / selling) * 100 : 0

    setResult({
      totalRevenue,
      totalCosts,
      grossMargin,
      commission,
      netMargin,
      marginRate
    })
    setShowResults(true)
    setCurrentStep(4)
  }

  const resetForm = () => {
    setFormData({
      sellerName: "",
      clientName: "",
      vehicleName: "",
      vehicleNumber: "",
      purchasePrice: "",
      sellingPrice: "",
      tradeInValue: "",
      hasFinancing: false,
      financedAmount: "",
      hasAccessories: false,
      accessoryAmount: "",
      hasWarranty: true,
      warrantyAmount: "219",
      preparationCost: "45",
      deliveryPack: "none"
    })
    setResult(null)
    setShowResults(false)
    setCurrentStep(0)
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })
  }

  const isStepValid = (step: number) => {
    switch (step) {
      case 0:
        return formData.sellerName && formData.clientName
      case 1:
        return formData.vehicleName && formData.vehicleNumber
      case 2:
        return formData.purchasePrice && formData.sellingPrice
      case 3:
        return true
      default:
        return true
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1 && isStepValid(currentStep)) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in-up opacity-0-initial" style={{ animationFillMode: "forwards" }}>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Calculateur de Marge</h1>
              <p className="text-gray-600">Calculez vos marges et commissions en temps réel</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={resetForm} className="group">
            <RotateCcw className="w-4 h-4 mr-2 group-hover:-rotate-180 transition-transform duration-500" />
            Réinitialiser
          </Button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8 animate-fade-in-up opacity-0-initial" style={{ animationFillMode: "forwards", animationDelay: "100ms" }}>
        <div className="flex items-center justify-between max-w-4xl">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1 last:flex-initial">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => index <= currentStep && setCurrentStep(index)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    index === currentStep
                      ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 scale-110"
                      : index < currentStep
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                  disabled={index > currentStep}
                >
                  {index < currentStep ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </button>
                <span className={`text-xs font-medium mt-2 transition-colors ${
                  index === currentStep ? "text-blue-600" : index < currentStep ? "text-green-600" : "text-gray-400"
                }`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-4 rounded-full transition-all duration-500 ${
                  index < currentStep ? "bg-green-500" : "bg-gray-200"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-premium overflow-hidden animate-fade-in-up opacity-0-initial" style={{ animationFillMode: "forwards", animationDelay: "200ms" }}>
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm">
                      {currentStep + 1}
                    </span>
                    {steps[currentStep].label}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {currentStep === 0 && "Informations générales de la vente"}
                    {currentStep === 1 && "Sélectionnez le type et les détails du véhicule"}
                    {currentStep === 2 && "Entrez les prix d'achat et de vente"}
                    {currentStep === 3 && "Options, financement et accessoires"}
                    {currentStep === 4 && "Vos résultats de calcul"}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs">
                  Étape {currentStep + 1} sur {steps.length}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {/* Step 0: Informations */}
              {currentStep === 0 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="sellerName" className="text-sm font-semibold">
                        Nom du vendeur <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="sellerName"
                        value={formData.sellerName}
                        onChange={(e) => handleInputChange("sellerName", e.target.value)}
                        placeholder="Jean Dupont"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientName" className="text-sm font-semibold">
                        Nom du client <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="clientName"
                        value={formData.clientName}
                        onChange={(e) => handleInputChange("clientName", e.target.value)}
                        placeholder="Marie Martin"
                        className="h-12"
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Informations requises</p>
                        <p className="text-sm text-blue-700 mt-1">
                          Ces informations sont nécessaires pour l'enregistrement de la feuille de marge et le calcul des commissions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Vehicle */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Type de véhicule</Label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: "VO", label: "Occasion", desc: "Véhicule d'occasion", color: "blue" },
                        { id: "VN", label: "Neuf", desc: "Véhicule neuf", color: "green" },
                        { id: "VU", label: "Utilitaire", desc: "Véhicule utilitaire", color: "purple" }
                      ].map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setVehicleType(type.id as VehicleType)}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                            vehicleType === type.id
                              ? `border-${type.color}-500 bg-${type.color}-50 shadow-lg`
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <Car className={`w-6 h-6 mb-2 ${vehicleType === type.id ? `text-${type.color}-600` : "text-gray-400"}`} />
                          <p className={`font-semibold ${vehicleType === type.id ? "text-gray-900" : "text-gray-600"}`}>{type.label}</p>
                          <p className="text-xs text-gray-500 mt-1">{type.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="vehicleName" className="text-sm font-semibold">
                        Modèle du véhicule <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="vehicleName"
                        value={formData.vehicleName}
                        onChange={(e) => handleInputChange("vehicleName", e.target.value)}
                        placeholder="Ford Puma ST-Line"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vehicleNumber" className="text-sm font-semibold">
                        N° de véhicule <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="vehicleNumber"
                        value={formData.vehicleNumber}
                        onChange={(e) => handleInputChange("vehicleNumber", e.target.value)}
                        placeholder="VN2024001"
                        className="h-12"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Pricing */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="purchasePrice" className="text-sm font-semibold">
                        Prix d'achat TTC
                      </Label>
                      <div className="relative">
                        <Input
                          id="purchasePrice"
                          type="number"
                          value={formData.purchasePrice}
                          onChange={(e) => handleInputChange("purchasePrice", e.target.value)}
                          placeholder="25000"
                          className="h-12 pl-10"
                        />
                        <EuroIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sellingPrice" className="text-sm font-semibold">
                        Prix de vente TTC
                      </Label>
                      <div className="relative">
                        <Input
                          id="sellingPrice"
                          type="number"
                          value={formData.sellingPrice}
                          onChange={(e) => handleInputChange("sellingPrice", e.target.value)}
                          placeholder="28500"
                          className="h-12 pl-10"
                        />
                        <EuroIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tradeInValue" className="text-sm font-semibold">
                      Valeur de reprise (HT)
                    </Label>
                    <div className="relative">
                      <Input
                        id="tradeInValue"
                        type="number"
                        value={formData.tradeInValue}
                        onChange={(e) => handleInputChange("tradeInValue", e.target.value)}
                        placeholder="5000"
                        className="h-12 pl-10"
                      />
                      <EuroIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  
                  {/* Quick Costs */}
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 mb-4">Frais annexes</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id="hasWarranty"
                          checked={formData.hasWarranty}
                          onCheckedChange={(checked) => handleInputChange("hasWarranty", checked as boolean)}
                        />
                        <div className="flex-1">
                          <Label htmlFor="hasWarranty" className="text-sm font-medium">Garantie 12 mois</Label>
                          {formData.hasWarranty && (
                            <Input
                              type="number"
                              value={formData.warrantyAmount}
                              onChange={(e) => handleInputChange("warrantyAmount", e.target.value)}
                              className="mt-2 h-10"
                              placeholder="219"
                            />
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="preparationCost" className="text-sm font-medium">Préparation (HT)</Label>
                        <Input
                          id="preparationCost"
                          type="number"
                          value={formData.preparationCost}
                          onChange={(e) => handleInputChange("preparationCost", e.target.value)}
                          className="h-10"
                          placeholder="45"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Options */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  {/* Financing */}
                  <div className="p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-semibold text-gray-900">Financement</p>
                            <p className="text-sm text-gray-500">Bonus de 150€ si financement accordé</p>
                          </div>
                          <Checkbox
                            checked={formData.hasFinancing}
                            onCheckedChange={(checked) => handleInputChange("hasFinancing", checked as boolean)}
                          />
                        </div>
                        {formData.hasFinancing && (
                          <div className="space-y-2">
                            <Label className="text-sm">Montant financé (HT)</Label>
                            <div className="relative">
                              <Input
                                type="number"
                                value={formData.financedAmount}
                                onChange={(e) => handleInputChange("financedAmount", e.target.value)}
                                placeholder="20000"
                                className="h-10 pl-10"
                              />
                              <EuroIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Accessories */}
                  <div className="p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-semibold text-gray-900">Accessoires</p>
                            <p className="text-sm text-gray-500">Commission selon montant TTC</p>
                          </div>
                          <Checkbox
                            checked={formData.hasAccessories}
                            onCheckedChange={(checked) => handleInputChange("hasAccessories", checked as boolean)}
                          />
                        </div>
                        {formData.hasAccessories && (
                          <div className="space-y-2">
                            <Label className="text-sm">Montant accessoires TTC</Label>
                            <div className="relative">
                              <Input
                                type="number"
                                value={formData.accessoryAmount}
                                onChange={(e) => handleInputChange("accessoryAmount", e.target.value)}
                                placeholder="500"
                                className="h-10 pl-10"
                              />
                              <EuroIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                            <p className="text-xs text-gray-500">
                              50-250€ = 10€ • 251-800€ = 50€ • 801€+ = 75€
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Delivery Pack */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Pack livraison</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: "none", label: "Aucun", desc: "0€", bonus: "" },
                        { id: "pack2", label: "Pack 2", desc: "20€", bonus: "+20€" },
                        { id: "pack3", label: "Pack 3", desc: "35€", bonus: "+35€" }
                      ].map((pack) => (
                        <button
                          key={pack.id}
                          onClick={() => handleInputChange("deliveryPack", pack.id)}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            formData.deliveryPack === pack.id
                              ? "border-emerald-500 bg-emerald-50 shadow-lg"
                              : "border-gray-200 hover:border-gray-300"
                          } ${pack.id === "none" ? "col-span-2" : ""}`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">{pack.label}</p>
                              <p className="text-sm text-gray-500">{pack.desc}</p>
                            </div>
                            {pack.bonus && (
                              <Badge className="bg-emerald-100 text-emerald-700">{pack.bonus}</Badge>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Results */}
              {currentStep === 4 && result && (
                <div className="space-y-6 animate-fade-in">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                      <p className="text-blue-100 text-sm mb-1">Marge brute</p>
                      <p className="text-3xl font-bold">{formatCurrency(result.grossMargin)}</p>
                      <p className="text-blue-100 text-sm mt-1">{result.marginRate.toFixed(1)}% de marge</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                      <p className="text-emerald-100 text-sm mb-1">Votre commission</p>
                      <p className="text-3xl font-bold">{formatCurrency(result.commission)}</p>
                      <p className="text-emerald-100 text-sm mt-1">Sur cette vente</p>
                    </div>
                  </div>

                  {/* Detailed Results */}
                  <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
                    <ResultLine label="Chiffre d'affaires total" value={result.totalRevenue} />
                    <ResultLine label="Coûts totaux" value={result.totalCosts} isNegative />
                    <Separator />
                    <ResultLine label="Marge brute" value={result.grossMargin} highlight />
                    <ResultLine label="Commission vendeur" value={result.commission} isNegative />
                    <Separator />
                    <ResultLine label="Marge nette concession" value={result.netMargin} highlight success />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => setShowPreview(true)}>
                      <Eye className="w-4 h-4 mr-2" />
                      Aperçu
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Printer className="w-4 h-4 mr-2" />
                      Imprimer
                    </Button>
                    <Button className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                      <Save className="w-4 h-4 mr-2" />
                      Enregistrer
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>

            {/* Navigation Footer */}
            <CardFooter className="bg-gray-50 border-t border-gray-100 p-6">
              <div className="flex items-center justify-between w-full">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="min-w-[120px]"
                >
                  Précédent
                </Button>
                
                {currentStep < steps.length - 1 ? (
                  <Button
                    onClick={nextStep}
                    disabled={!isStepValid(currentStep)}
                    className="min-w-[120px] bg-gradient-to-r from-blue-600 to-indigo-600"
                  >
                    Suivant
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    onClick={calculate}
                    className="min-w-[120px] bg-gradient-to-r from-emerald-600 to-teal-600"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculer
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Help Card */}
          <Card className="border-0 shadow-premium bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 animate-fade-in-up opacity-0-initial" style={{ animationFillMode: "forwards", animationDelay: "300ms" }}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Astuce du jour
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 leading-relaxed">
                Proposez systématiquement le financement à vos clients. Cela augmente votre commission de 150€ et améliore le taux de pénétration de votre concession.
              </p>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-0 shadow-premium animate-fade-in-up opacity-0-initial" style={{ animationFillMode: "forwards", animationDelay: "400ms" }}>
            <CardHeader>
              <CardTitle className="text-lg">Vos statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Ventes ce mois</span>
                <span className="font-bold text-gray-900">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Commission totale</span>
                <span className="font-bold text-emerald-600">3 450 €</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Taux de financement</span>
                <span className="font-bold text-blue-600">75%</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Classement</span>
                <Badge className="bg-amber-100 text-amber-700">
                  <Trophy className="w-3 h-3 mr-1" />
                  #3
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Recent Calculations */}
          <Card className="border-0 shadow-premium animate-fade-in-up opacity-0-initial" style={{ animationFillMode: "forwards", animationDelay: "500ms" }}>
            <CardHeader>
              <CardTitle className="text-lg">Calculs récents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { vehicle: "Ford Puma ST-Line", date: "Aujourd'hui", commission: 350 },
                  { vehicle: "Ford Kuga Titanium", date: "Hier", commission: 420 },
                  { vehicle: "Ford Fiesta Active", date: "Il y a 2 jours", commission: 280 }
                ].map((calc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{calc.vehicle}</p>
                      <p className="text-xs text-gray-500">{calc.date}</p>
                    </div>
                    <span className="font-bold text-emerald-600 text-sm">+{calc.commission}€</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Aperçu de la feuille de marge</DialogTitle>
            <DialogDescription>
              Vérifiez les informations avant d'enregistrer
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="p-6 space-y-6">
              {/* Preview content would go here */}
              <div className="p-8 border-2 border-dashed border-gray-200 rounded-xl text-center">
                <p className="text-gray-500">Aperçu de la feuille de marge</p>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Fermer
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
              <Printer className="w-4 h-4 mr-2" />
              Imprimer / PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Helper Components
function EuroIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10h12M4 14h9M19 6a7.7 7.7 0 0 0-5.2-2 7.9 7.9 0 0 0-8 8 7.9 7.9 0 0 0 8 8 7.7 7.7 0 0 0 5.2-2" />
    </svg>
  )
}

function ResultLine({ label, value, isNegative, highlight, success }: { 
  label: string
  value: number
  isNegative?: boolean
  highlight?: boolean
  success?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-600">{label}</span>
      <span className={`font-semibold ${
        success ? "text-emerald-600 text-lg" :
        highlight ? "text-gray-900 font-bold" :
        isNegative ? "text-red-600" :
        "text-gray-900"
      }`}>
        {isNegative ? "-" : ""}{value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
      </span>
    </div>
  )
}
