"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Building2,
  Euro,
  Target,
  Percent,
  Star,
  Leaf,
  Trophy,
  Calendar,
  Users,
  Zap,
  Gift,
  Award
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { dealerships } from "@/lib/mock-dir-marque-data"

// ============================================
// TYPES
// ============================================

type ChallengeType = "volume" | "margin" | "financing" | "satisfaction" | "electric" | "specific_model"
type RewardType = "bonus" | "trophy" | "recognition" | "points"
type ParticipantSelection = "all" | "manual"

interface ChallengeFormData {
  title: string
  description: string
  type: ChallengeType
  targetValue: number
  targetUnit: string
  startDate: string
  endDate: string
  participantSelection: ParticipantSelection
  selectedDealerships: string[]
  rewardType: RewardType
  rewardValue: string
  rewardDescription: string
}

// ============================================
// CONSTANTS
// ============================================

const challengeTypes: Array<{
  value: ChallengeType
  label: string
  description: string
  icon: React.ElementType
  unit: string
  color: string
}> = [
  { value: "volume", label: "Volume de ventes", description: "Objectif de nombre de ventes", icon: Target, unit: "ventes", color: "from-blue-500 to-blue-600" },
  { value: "margin", label: "Marge totale", description: "Objectif de marge cumulée", icon: Euro, unit: "€", color: "from-emerald-500 to-emerald-600" },
  { value: "financing", label: "Taux de financement", description: "Pourcentage de ventes financées", icon: Percent, unit: "%", color: "from-purple-500 to-purple-600" },
  { value: "satisfaction", label: "Satisfaction client", description: "Score NPS à atteindre", icon: Star, unit: "NPS", color: "from-amber-500 to-orange-500" },
  { value: "electric", label: "Véhicules électriques", description: "Part de ventes VE", icon: Leaf, unit: "%", color: "from-green-500 to-green-600" },
  { value: "specific_model", label: "Modèle spécifique", description: "Ventes d'un modèle particulier", icon: Building2, unit: "unités", color: "from-indigo-500 to-indigo-600" }
]

const rewardTypes: Array<{
  value: RewardType
  label: string
  description: string
  icon: React.ElementType
}> = [
  { value: "bonus", label: "Bonus €", description: "Prime financière pour la direction", icon: Euro },
  { value: "trophy", label: "Trophée", description: "Trophée physique ou virtuel", icon: Trophy },
  { value: "recognition", label: "Reconnaissance", description: "Badge ou distinction honorifique", icon: Award },
  { value: "points", label: "Points bonus", description: "Points supplémentaires au classement", icon: Gift }
]

const defaultFormData: ChallengeFormData = {
  title: "",
  description: "",
  type: "volume",
  targetValue: 0,
  targetUnit: "ventes",
  startDate: "",
  endDate: "",
  participantSelection: "all",
  selectedDealerships: [],
  rewardType: "bonus",
  rewardValue: "",
  rewardDescription: ""
}

// ============================================
// STEP COMPONENTS
// ============================================

function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div key={i} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
            i + 1 < currentStep
              ? "bg-emerald-500 text-white"
              : i + 1 === currentStep
              ? "bg-white text-indigo-600 ring-4 ring-indigo-200"
              : "bg-white/20 text-white/60"
          }`}>
            {i + 1 < currentStep ? <Check className="w-5 h-5" /> : i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div className={`w-12 h-1 mx-2 rounded ${
              i + 1 < currentStep ? "bg-emerald-500" : "bg-white/20"
            }`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

function NewBrandChallengePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedDealershipId = searchParams.get("target") || undefined

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<ChallengeFormData>(() => {
    if (preselectedDealershipId) {
      return {
        ...defaultFormData,
        participantSelection: "manual",
        selectedDealerships: [preselectedDealershipId]
      }
    }
    return defaultFormData
  })

  const totalSteps = 4

  const updateFormData = (updates: Partial<ChallengeFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const handleTypeChange = (type: ChallengeType) => {
    const typeConfig = challengeTypes.find(t => t.value === type)
    updateFormData({
      type,
      targetUnit: typeConfig?.unit || ""
    })
  }

  const toggleDealership = (dealershipId: string) => {
    const current = formData.selectedDealerships
    if (current.includes(dealershipId)) {
      updateFormData({ selectedDealerships: current.filter(id => id !== dealershipId) })
    } else {
      updateFormData({ selectedDealerships: [...current, dealershipId] })
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.title.length >= 5 && formData.description.length >= 10 && formData.type
      case 2:
        return formData.targetValue > 0 && formData.startDate && formData.endDate
      case 3:
        return formData.participantSelection === "all" || formData.selectedDealerships.length > 0
      case 4:
        return formData.rewardType && formData.rewardValue
      default:
        return false
    }
  }

  const handleSubmit = () => {
    console.log("Challenge créé:", formData)
    router.push("/marque")
  }

  const selectedType = challengeTypes.find(t => t.value === formData.type)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-indigo-200 text-sm mb-6">
            <Link href="/marque" className="hover:text-white transition-colors">
              Dashboard Marque
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Nouveau challenge</span>
          </div>

          <h1 className="text-3xl font-bold mb-2">Créer un challenge inter-concessions</h1>
          <p className="text-indigo-100">
            Motivez vos concessions avec un challenge stimulant
          </p>

          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8 -mt-4">
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Informations de base</h2>
                  <p className="text-gray-500">Définissez le titre et le type de challenge</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Titre du challenge *</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Course au 100%"
                      value={formData.title}
                      onChange={(e) => updateFormData({ title: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Décrivez l'objectif et les règles du challenge..."
                      value={formData.description}
                      onChange={(e) => updateFormData({ description: e.target.value })}
                      className="mt-1.5"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Type de challenge *</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {challengeTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => handleTypeChange(type.value)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            formData.type === type.value
                              ? "border-indigo-500 bg-indigo-50"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center`}>
                              <type.icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{type.label}</p>
                              <p className="text-xs text-gray-500">{type.description}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Objective & Duration */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Objectif et durée</h2>
                  <p className="text-gray-500">Définissez l&apos;objectif à atteindre et la période</p>
                </div>

                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                  <div className="flex items-center gap-3">
                    {selectedType && (
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedType.color} flex items-center justify-center`}>
                        <selectedType.icon className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">{selectedType?.label}</p>
                      <p className="text-sm text-gray-500">{selectedType?.description}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="targetValue">Objectif à atteindre *</Label>
                    <div className="flex gap-2 mt-1.5">
                      <Input
                        id="targetValue"
                        type="number"
                        placeholder="Ex: 100"
                        value={formData.targetValue || ""}
                        onChange={(e) => updateFormData({ targetValue: Number(e.target.value) })}
                        className="flex-1"
                      />
                      <div className="w-24 flex items-center justify-center bg-gray-100 rounded-lg px-3 text-gray-600 font-medium">
                        {formData.targetUnit}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Date de début *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => updateFormData({ startDate: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">Date de fin *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => updateFormData({ endDate: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Participants */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Concessions participantes</h2>
                  <p className="text-gray-500">Sélectionnez les concessions qui participeront</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => updateFormData({ participantSelection: "all", selectedDealerships: [] })}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        formData.participantSelection === "all"
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Users className="w-6 h-6 text-indigo-600 mb-2" />
                      <p className="font-semibold text-gray-900">Toutes les concessions</p>
                      <p className="text-sm text-gray-500">{dealerships.length} concessions</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateFormData({ participantSelection: "manual" })}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        formData.participantSelection === "manual"
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Building2 className="w-6 h-6 text-indigo-600 mb-2" />
                      <p className="font-semibold text-gray-900">Sélection manuelle</p>
                      <p className="text-sm text-gray-500">Choisir les concessions</p>
                    </button>
                  </div>

                  {formData.participantSelection === "manual" && (
                    <div className="space-y-2 max-h-64 overflow-y-auto p-1">
                      {dealerships.map((dealership) => (
                        <div
                          key={dealership.id}
                          onClick={() => toggleDealership(dealership.id)}
                          className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            formData.selectedDealerships.includes(dealership.id)
                              ? "border-indigo-500 bg-indigo-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <Checkbox
                            checked={formData.selectedDealerships.includes(dealership.id)}
                            className="pointer-events-none"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{dealership.name}</p>
                            <p className="text-sm text-gray-500">{dealership.location} • {dealership.directorName}</p>
                          </div>
                          <Badge className={`${
                            dealership.stats.objectiveRate >= 100 ? "bg-emerald-100 text-emerald-700" :
                            dealership.stats.objectiveRate >= 90 ? "bg-blue-100 text-blue-700" :
                            "bg-amber-100 text-amber-700"
                          }`}>
                            {dealership.stats.objectiveRate}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}

                  {formData.participantSelection === "manual" && formData.selectedDealerships.length > 0 && (
                    <p className="text-sm text-indigo-600 font-medium">
                      {formData.selectedDealerships.length} concession{formData.selectedDealerships.length > 1 ? "s" : ""} sélectionnée{formData.selectedDealerships.length > 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Reward & Confirmation */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Récompense</h2>
                  <p className="text-gray-500">Définissez la récompense pour le vainqueur</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Type de récompense *</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {rewardTypes.map((reward) => (
                        <button
                          key={reward.value}
                          type="button"
                          onClick={() => updateFormData({ rewardType: reward.value })}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            formData.rewardType === reward.value
                              ? "border-indigo-500 bg-indigo-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <reward.icon className={`w-6 h-6 mb-2 ${
                            formData.rewardType === reward.value ? "text-indigo-600" : "text-gray-400"
                          }`} />
                          <p className="font-semibold text-gray-900">{reward.label}</p>
                          <p className="text-xs text-gray-500">{reward.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="rewardValue">Valeur de la récompense *</Label>
                    <Input
                      id="rewardValue"
                      placeholder={formData.rewardType === "bonus" ? "Ex: 5000€" : formData.rewardType === "points" ? "Ex: 1000 points" : "Ex: Trophée Excellence"}
                      value={formData.rewardValue}
                      onChange={(e) => updateFormData({ rewardValue: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="rewardDescription">Description (optionnel)</Label>
                    <Input
                      id="rewardDescription"
                      placeholder="Ex: Bonus direction pour l'équipe gagnante"
                      value={formData.rewardDescription}
                      onChange={(e) => updateFormData({ rewardDescription: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
                  <h3 className="font-bold text-gray-900 mb-4">Récapitulatif</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Titre</span>
                      <span className="font-medium text-gray-900">{formData.title || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type</span>
                      <span className="font-medium text-gray-900">{selectedType?.label || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Objectif</span>
                      <span className="font-medium text-gray-900">{formData.targetValue} {formData.targetUnit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Période</span>
                      <span className="font-medium text-gray-900">
                        {formData.startDate && formData.endDate
                          ? `${new Date(formData.startDate).toLocaleDateString("fr-FR")} - ${new Date(formData.endDate).toLocaleDateString("fr-FR")}`
                          : "-"
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Participants</span>
                      <span className="font-medium text-gray-900">
                        {formData.participantSelection === "all"
                          ? `${dealerships.length} concessions`
                          : `${formData.selectedDealerships.length} concession${formData.selectedDealerships.length > 1 ? "s" : ""}`
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Récompense</span>
                      <span className="font-medium text-indigo-600">{formData.rewardValue || "-"}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              {currentStep > 1 ? (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Précédent
                </Button>
              ) : (
                <Link href="/marque">
                  <Button variant="outline" className="gap-2">
                    <ChevronLeft className="w-4 h-4" />
                    Annuler
                  </Button>
                </Link>
              )}

              {currentStep < totalSteps ? (
                <Button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  disabled={!canProceed()}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 gap-2"
                >
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed()}
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Créer le challenge
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Loading fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-white/30 rounded w-1/4 mb-6" />
            <div className="h-10 bg-white/30 rounded w-1/2 mb-2" />
            <div className="h-4 bg-white/30 rounded w-1/3" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NewBrandChallengePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NewBrandChallengePageContent />
    </Suspense>
  )
}
