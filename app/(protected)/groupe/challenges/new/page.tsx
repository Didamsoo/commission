"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Trophy,
  Target,
  Calendar,
  Users,
  Gift,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Globe,
  Zap,
  Star,
  Euro,
  Percent,
  Building,
  Car,
  BarChart3
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { brands } from "@/lib/mock-dir-plaque-data"

type ChallengeType = "volume" | "revenue" | "margin" | "satisfaction" | "market_share"
type RewardType = "bonus" | "trophy" | "recognition" | "prize"

interface ChallengeFormData {
  title: string
  description: string
  type: ChallengeType
  targetValue: number
  targetUnit: string
  startDate: string
  endDate: string
  participants: string[]
  rewardType: RewardType
  rewardValue: string
  rewardDescription: string
}

const challengeTypes = [
  { value: "volume", label: "Volume de ventes", icon: Car, unit: "véhicules", description: "Objectif de nombre de ventes" },
  { value: "revenue", label: "Chiffre d'affaires", icon: Euro, unit: "€", description: "Objectif de CA total" },
  { value: "margin", label: "Marge", icon: Target, unit: "€", description: "Objectif de marge totale" },
  { value: "satisfaction", label: "Satisfaction client", icon: Star, unit: "NPS", description: "Objectif de score NPS" },
  { value: "market_share", label: "Part de marché", icon: BarChart3, unit: "%", description: "Objectif de PDM régionale" }
]

const rewardTypes = [
  { value: "trophy", label: "Trophée", icon: Trophy, description: "Trophée et reconnaissance officielle" },
  { value: "bonus", label: "Bonus financier", icon: Euro, description: "Prime ou bonus pour les gagnants" },
  { value: "recognition", label: "Reconnaissance", icon: Star, description: "Mise en avant et communication" },
  { value: "prize", label: "Récompense", icon: Gift, description: "Cadeau ou avantage en nature" }
]

function ChallengeNewContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<ChallengeFormData>({
    title: "",
    description: "",
    type: "volume",
    targetValue: 0,
    targetUnit: "véhicules",
    startDate: "",
    endDate: "",
    participants: [],
    rewardType: "trophy",
    rewardValue: "",
    rewardDescription: ""
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

  const toggleParticipant = (brandId: string) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.includes(brandId)
        ? prev.participants.filter(id => id !== brandId)
        : [...prev.participants, brandId]
    }))
  }

  const selectAllParticipants = () => {
    setFormData(prev => ({
      ...prev,
      participants: brands.map(b => b.id)
    }))
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.title.length >= 5 && formData.description.length >= 10
      case 2:
        return formData.targetValue > 0 && formData.startDate && formData.endDate
      case 3:
        return formData.participants.length > 0
      case 4:
        return formData.rewardValue.length > 0
      default:
        return false
    }
  }

  const handleSubmit = () => {
    console.log("Challenge créé:", formData)
    router.push("/groupe")
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link href="/groupe" className="hover:text-gray-700 flex items-center gap-1">
            <Globe className="w-4 h-4" />
            Groupe AutoPerf
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Nouveau challenge</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          Créer un challenge inter-marques
        </h1>
        <p className="text-gray-500 mt-1">
          Lancez un défi pour motiver vos directeurs de marque
        </p>
      </div>

      {/* Progress */}
      <Card className="border-0 shadow-premium">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Étape {step} sur {totalSteps}</span>
            <span className="text-sm text-gray-400">{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <Progress value={(step / totalSteps) * 100} className="h-2 [&>div]:bg-indigo-500" />
          <div className="flex justify-between mt-3">
            {["Informations", "Objectif", "Participants", "Récompense"].map((label, index) => (
              <div
                key={label}
                className={`text-xs font-medium ${
                  index + 1 <= step ? "text-indigo-600" : "text-gray-400"
                }`}
              >
                {label}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card className="border-0 shadow-premium">
        <CardContent className="p-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Informations du challenge</h2>
                <p className="text-gray-500">Définissez le titre et la description</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre du challenge *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Meilleure marque Q1 2024"
                    value={formData.title}
                    onChange={(e) => updateFormData({ title: e.target.value })}
                    className="text-lg"
                  />
                  <p className="text-xs text-gray-400">Minimum 5 caractères</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez l'objectif et les règles du challenge..."
                    value={formData.description}
                    onChange={(e) => updateFormData({ description: e.target.value })}
                    rows={4}
                  />
                  <p className="text-xs text-gray-400">Minimum 10 caractères</p>
                </div>

                <div className="space-y-2">
                  <Label>Type de challenge *</Label>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {challengeTypes.map(type => {
                      const Icon = type.icon
                      const isSelected = formData.type === type.value
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => handleTypeChange(type.value as ChallengeType)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            isSelected
                              ? "border-indigo-500 bg-indigo-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <Icon className={`w-6 h-6 mb-2 ${isSelected ? "text-indigo-600" : "text-gray-400"}`} />
                          <p className={`font-medium ${isSelected ? "text-indigo-900" : "text-gray-900"}`}>
                            {type.label}
                          </p>
                          <p className="text-xs text-gray-500">{type.description}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Objective & Duration */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Objectif et durée</h2>
                <p className="text-gray-500">Définissez la cible et la période du challenge</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="target">Objectif à atteindre *</Label>
                  <div className="flex gap-3">
                    <Input
                      id="target"
                      type="number"
                      placeholder="100"
                      value={formData.targetValue || ""}
                      onChange={(e) => updateFormData({ targetValue: Number(e.target.value) })}
                      className="flex-1 text-lg"
                    />
                    <div className="flex items-center px-4 bg-gray-100 rounded-lg text-gray-600 font-medium">
                      {formData.targetUnit}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    {formData.type === "volume" && "Nombre de véhicules à vendre"}
                    {formData.type === "revenue" && "Chiffre d'affaires à atteindre"}
                    {formData.type === "margin" && "Marge totale à générer"}
                    {formData.type === "satisfaction" && "Score NPS minimum à atteindre"}
                    {formData.type === "market_share" && "Part de marché cible"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Date de début *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => updateFormData({ startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Date de fin *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => updateFormData({ endDate: e.target.value })}
                    />
                  </div>
                </div>

                {formData.startDate && formData.endDate && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Durée du challenge:{" "}
                      <span className="font-semibold">
                        {Math.ceil(
                          (new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        jours
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Participants */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Marques participantes</h2>
                <p className="text-gray-500">Sélectionnez les marques qui participeront</p>
              </div>

              <div className="flex justify-end mb-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={selectAllParticipants}
                >
                  Sélectionner toutes
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {brands.map(brand => {
                  const isSelected = formData.participants.includes(brand.id)
                  return (
                    <button
                      key={brand.id}
                      type="button"
                      onClick={() => toggleParticipant(brand.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${brand.color} flex items-center justify-center text-xl`}>
                          {brand.logo}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{brand.name}</p>
                          <p className="text-xs text-gray-500">
                            {brand.dealershipCount} concessions • {brand.stats.objectiveRate}% obj.
                          </p>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="p-4 bg-gray-50 rounded-xl text-center">
                <p className="text-sm text-gray-600">
                  <Users className="w-4 h-4 inline mr-2" />
                  <span className="font-semibold">{formData.participants.length}</span> marque(s) sélectionnée(s)
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Reward */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-amber-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Récompense</h2>
                <p className="text-gray-500">Définissez la récompense pour les gagnants</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Type de récompense *</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {rewardTypes.map(type => {
                      const Icon = type.icon
                      const isSelected = formData.rewardType === type.value
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => updateFormData({ rewardType: type.value as RewardType })}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            isSelected
                              ? "border-amber-500 bg-amber-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <Icon className={`w-6 h-6 mb-2 ${isSelected ? "text-amber-600" : "text-gray-400"}`} />
                          <p className={`font-medium ${isSelected ? "text-amber-900" : "text-gray-900"}`}>
                            {type.label}
                          </p>
                          <p className="text-xs text-gray-500">{type.description}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rewardValue">Valeur / Titre de la récompense *</Label>
                  <Input
                    id="rewardValue"
                    placeholder={
                      formData.rewardType === "bonus" ? "Ex: 5000€" :
                      formData.rewardType === "trophy" ? "Ex: Trophée Excellence Q1" :
                      formData.rewardType === "prize" ? "Ex: Week-end spa" :
                      "Ex: Label Best Brand"
                    }
                    value={formData.rewardValue}
                    onChange={(e) => updateFormData({ rewardValue: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rewardDesc">Description de la récompense</Label>
                  <Textarea
                    id="rewardDesc"
                    placeholder="Décrivez plus en détail la récompense..."
                    value={formData.rewardDescription}
                    onChange={(e) => updateFormData({ rewardDescription: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              {/* Summary */}
              <Card className="border-2 border-indigo-100 bg-indigo-50/50">
                <CardHeader>
                  <CardTitle className="text-lg">Récapitulatif du challenge</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Titre</span>
                    <span className="font-medium text-gray-900">{formData.title || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type</span>
                    <span className="font-medium text-gray-900">
                      {challengeTypes.find(t => t.value === formData.type)?.label || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Objectif</span>
                    <span className="font-medium text-gray-900">
                      {formData.targetValue} {formData.targetUnit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Période</span>
                    <span className="font-medium text-gray-900">
                      {formData.startDate && formData.endDate
                        ? `${new Date(formData.startDate).toLocaleDateString("fr-FR")} - ${new Date(formData.endDate).toLocaleDateString("fr-FR")}`
                        : "-"
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Participants</span>
                    <span className="font-medium text-gray-900">{formData.participants.length} marques</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Récompense</span>
                    <Badge className="bg-amber-100 text-amber-700">
                      <Trophy className="w-3 h-3 mr-1" />
                      {formData.rewardValue || "-"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => step > 1 ? setStep(step - 1) : router.push("/groupe")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {step > 1 ? "Précédent" : "Annuler"}
        </Button>

        {step < totalSteps ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            Suivant
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!canProceed()}
            className="gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
          >
            <Check className="w-4 h-4" />
            Créer le challenge
          </Button>
        )}
      </div>
    </div>
  )
}

export default function GroupeChallengeNewPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Chargement...</div>}>
      <ChallengeNewContent />
    </Suspense>
  )
}
