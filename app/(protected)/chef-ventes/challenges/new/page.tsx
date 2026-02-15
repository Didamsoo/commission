"use client"

import { useState, useMemo, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  Check,
  ShoppingCart,
  Euro,
  TrendingUp,
  Percent,
  Car,
  Trophy,
  Award,
  Star,
  Calendar,
  Users,
  Target,
  Sparkles,
  Clock,
  AlertCircle,
  User,
  CheckCircle,
  Crown
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  DirectionChallengeType,
  RewardType,
  ChallengeFormData,
  DEFAULT_FORM_DATA,
  CHALLENGE_TYPE_CONFIG,
  REWARD_TYPE_CONFIG,
  BADGE_ICONS,
  VEHICLE_MODELS,
  validateStep1,
  validateStep2,
  validateStep3,
  formatChallengeDuration,
  formatChallengeTarget
} from "@/types/direction-challenges"
import {
  teamMembers,
  currentChefVentes
} from "@/lib/mock-chef-ventes-data"

// ============================================
// ICONS MAPPING
// ============================================
const CHALLENGE_TYPE_ICONS: Record<DirectionChallengeType, React.ElementType> = {
  sales_count: ShoppingCart,
  revenue_target: Euro,
  margin_target: TrendingUp,
  financing_rate: Percent,
  specific_model: Car
}

const REWARD_TYPE_ICONS: Record<RewardType, React.ElementType> = {
  bonus: Euro,
  badge: Award,
  points: Star
}

// ============================================
// STEP INDICATOR
// ============================================
function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const steps = [
    { number: 1, label: "Informations" },
    { number: 2, label: "Objectif" },
    { number: 3, label: "Récompense" },
    { number: 4, label: "Confirmation" }
  ]

  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-all duration-300 ${
              currentStep === step.number
                ? "bg-white text-indigo-600 shadow-lg scale-110"
                : currentStep > step.number
                ? "bg-white/80 text-indigo-600"
                : "bg-white/30 text-white"
            }`}
          >
            {currentStep > step.number ? (
              <Check className="w-5 h-5" />
            ) : (
              step.number
            )}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-12 h-1 mx-2 rounded-full transition-all duration-300 ${
                currentStep > step.number ? "bg-white/80" : "bg-white/30"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// ============================================
// STEP 1: BASIC INFO
// ============================================
function Step1BasicInfo({
  data,
  onChange,
  errors
}: {
  data: ChallengeFormData
  onChange: (updates: Partial<ChallengeFormData>) => void
  errors: Record<string, string>
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-base font-semibold">
          Titre du challenge *
        </Label>
        <Input
          id="title"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Ex: Sprint de la semaine, Défi financement..."
          className={`h-12 text-base ${errors.title ? "border-red-500" : ""}`}
        />
        {errors.title && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.title}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-base font-semibold">
          Description *
        </Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Décrivez le challenge, ses règles et conditions..."
          className={`min-h-[100px] text-base resize-none ${errors.description ? "border-red-500" : ""}`}
        />
        {errors.description && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.description}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <Label className="text-base font-semibold">Type de challenge *</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(Object.keys(CHALLENGE_TYPE_CONFIG) as DirectionChallengeType[]).map((type) => {
            const config = CHALLENGE_TYPE_CONFIG[type]
            const Icon = CHALLENGE_TYPE_ICONS[type]
            const isSelected = data.type === type

            return (
              <button
                key={type}
                type="button"
                onClick={() => onChange({ type })}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isSelected ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`font-semibold ${isSelected ? "text-indigo-700" : "text-gray-900"}`}>
                      {config.label}
                    </p>
                    <p className="text-xs text-gray-500">{config.description}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
        {errors.type && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.type}
          </p>
        )}
      </div>
    </div>
  )
}

// ============================================
// STEP 2: OBJECTIVE & DURATION & PARTICIPANTS
// ============================================
function Step2Objective({
  data,
  onChange,
  errors,
  preselectedUserId
}: {
  data: ChallengeFormData
  onChange: (updates: Partial<ChallengeFormData>) => void
  errors: Record<string, string>
  preselectedUserId?: string
}) {
  const typeConfig = CHALLENGE_TYPE_CONFIG[data.type]
  const today = new Date().toISOString().split("T")[0]

  const toggleParticipant = (userId: string) => {
    const newIds = data.participantIds.includes(userId)
      ? data.participantIds.filter(id => id !== userId)
      : [...data.participantIds, userId]
    onChange({ participantIds: newIds })
  }

  return (
    <div className="space-y-6">
      {/* Specific model selector */}
      {data.type === "specific_model" && (
        <div className="space-y-2">
          <Label className="text-base font-semibold">Modèle de véhicule *</Label>
          <Select
            value={data.targetModelName || ""}
            onValueChange={(value) => onChange({ targetModelName: value })}
          >
            <SelectTrigger className={`h-12 ${errors.targetModelName ? "border-red-500" : ""}`}>
              <SelectValue placeholder="Sélectionnez un modèle" />
            </SelectTrigger>
            <SelectContent>
              {VEHICLE_MODELS.map((model) => (
                <SelectItem key={model} value={model}>
                  Ford {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.targetModelName && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.targetModelName}
            </p>
          )}
        </div>
      )}

      {/* Target */}
      <div className="space-y-2">
        <Label htmlFor="target" className="text-base font-semibold">
          Objectif à atteindre *
        </Label>
        <div className="relative">
          <Input
            id="target"
            type="number"
            min="1"
            value={data.target || ""}
            onChange={(e) => onChange({ target: parseInt(e.target.value) || 0 })}
            placeholder={typeConfig.placeholder}
            className={`h-12 text-base pr-16 ${errors.target ? "border-red-500" : ""}`}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
            {typeConfig.unitPlural}
          </div>
        </div>
        {errors.target && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.target}
          </p>
        )}
        <p className="text-sm text-gray-500">
          {data.target > 0 && (
            <>
              Objectif:{" "}
              <span className="font-semibold text-gray-700">
                {formatChallengeTarget(data.type, data.target, data.targetModelName)}
              </span>
            </>
          )}
        </p>
      </div>

      {/* Date range */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-base font-semibold">
            Date de début *
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="startDate"
              type="date"
              min={today}
              value={data.startDate}
              onChange={(e) => onChange({ startDate: e.target.value })}
              className={`h-12 pl-10 ${errors.startDate ? "border-red-500" : ""}`}
            />
          </div>
          {errors.startDate && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.startDate}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate" className="text-base font-semibold">
            Date de fin *
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="endDate"
              type="date"
              min={data.startDate || today}
              value={data.endDate}
              onChange={(e) => onChange({ endDate: e.target.value })}
              className={`h-12 pl-10 ${errors.endDate ? "border-red-500" : ""}`}
            />
          </div>
          {errors.endDate && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.endDate}
            </p>
          )}
        </div>
      </div>

      {data.startDate && data.endDate && (
        <div className="p-4 bg-indigo-50 rounded-xl">
          <p className="text-sm text-indigo-700">
            <Clock className="w-4 h-4 inline mr-2" />
            Durée du challenge:{" "}
            <span className="font-semibold">{formatChallengeDuration(data.startDate, data.endDate)}</span>
          </p>
        </div>
      )}

      {/* Participants selection */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Participants *</Label>

        {/* Toggle all/selection */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onChange({ allParticipants: true, participantIds: [] })}
            className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
              data.allParticipants
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className={`w-5 h-5 ${data.allParticipants ? "text-indigo-600" : "text-gray-500"}`} />
              <div>
                <p className={`font-semibold ${data.allParticipants ? "text-indigo-700" : "text-gray-900"}`}>
                  Toute l&apos;équipe
                </p>
                <p className="text-xs text-gray-500">{teamMembers.length} commerciaux</p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onChange({ allParticipants: false })}
            className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
              !data.allParticipants
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <User className={`w-5 h-5 ${!data.allParticipants ? "text-indigo-600" : "text-gray-500"}`} />
              <div>
                <p className={`font-semibold ${!data.allParticipants ? "text-indigo-700" : "text-gray-900"}`}>
                  Sélection manuelle
                </p>
                <p className="text-xs text-gray-500">Choisir les participants</p>
              </div>
            </div>
          </button>
        </div>

        {/* Team member selection */}
        {!data.allParticipants && (
          <div className="space-y-2 mt-4">
            <p className="text-sm text-gray-500 mb-3">
              Sélectionnez les commerciaux qui participent à ce challenge :
            </p>
            <div className="grid gap-2">
              {teamMembers.map((member) => {
                const isSelected = data.participantIds.includes(member.id)
                const isPreselected = member.id === preselectedUserId

                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => toggleParticipant(member.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      className="pointer-events-none"
                    />
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 font-semibold text-sm">
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className={`font-semibold ${isSelected ? "text-indigo-700" : "text-gray-900"}`}>
                        {member.name}
                        {isPreselected && (
                          <Badge className="ml-2 bg-amber-100 text-amber-700 text-xs">
                            Présélectionné
                          </Badge>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        {member.kpis.sales} ventes • {member.kpis.financingRate}% financement
                      </p>
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-5 h-5 text-indigo-600" />
                    )}
                  </button>
                )
              })}
            </div>
            {data.participantIds.length === 0 && !data.allParticipants && (
              <p className="text-sm text-amber-600 flex items-center gap-1 mt-2">
                <AlertCircle className="w-4 h-4" />
                Sélectionnez au moins un participant
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// STEP 3: REWARD
// ============================================
function Step3Reward({
  data,
  onChange,
  errors
}: {
  data: ChallengeFormData
  onChange: (updates: Partial<ChallengeFormData>) => void
  errors: Record<string, string>
}) {
  return (
    <div className="space-y-6">
      {/* Reward type */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Type de récompense *</Label>
        <div className="grid grid-cols-3 gap-3">
          {(Object.keys(REWARD_TYPE_CONFIG) as RewardType[]).map((type) => {
            const config = REWARD_TYPE_CONFIG[type]
            const Icon = REWARD_TYPE_ICONS[type]
            const isSelected = data.rewardType === type

            return (
              <button
                key={type}
                type="button"
                onClick={() => onChange({ rewardType: type })}
                className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-2 ${
                    isSelected ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <p className={`font-semibold ${isSelected ? "text-indigo-700" : "text-gray-900"}`}>
                  {config.label}
                </p>
              </button>
            )
          })}
        </div>
        {errors.rewardType && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.rewardType}
          </p>
        )}
      </div>

      {/* Reward value */}
      <div className="space-y-2">
        <Label htmlFor="rewardValue" className="text-base font-semibold">
          {data.rewardType === "bonus"
            ? "Montant du bonus *"
            : data.rewardType === "points"
            ? "Nombre de points *"
            : "Points associés au badge *"}
        </Label>
        <div className="relative">
          <Input
            id="rewardValue"
            type="number"
            min="1"
            value={data.rewardValue || ""}
            onChange={(e) => onChange({ rewardValue: parseInt(e.target.value) || 0 })}
            placeholder={REWARD_TYPE_CONFIG[data.rewardType].placeholder}
            className={`h-12 text-base pr-12 ${errors.rewardValue ? "border-red-500" : ""}`}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
            {data.rewardType === "bonus" ? "€" : "pts"}
          </div>
        </div>
        {errors.rewardValue && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.rewardValue}
          </p>
        )}
      </div>

      {/* Badge specific fields */}
      {data.rewardType === "badge" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="badgeName" className="text-base font-semibold">
              Nom du badge *
            </Label>
            <Input
              id="badgeName"
              value={data.badgeName || ""}
              onChange={(e) => onChange({ badgeName: e.target.value })}
              placeholder="Ex: Champion de la semaine, As du closing..."
              className={`h-12 text-base ${errors.badgeName ? "border-red-500" : ""}`}
            />
            {errors.badgeName && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.badgeName}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Icône du badge *</Label>
            <div className="grid grid-cols-5 gap-2">
              {BADGE_ICONS.map((icon) => (
                <button
                  key={icon.value}
                  type="button"
                  onClick={() => onChange({ badgeIcon: icon.value })}
                  className={`p-3 rounded-xl border-2 text-center text-2xl transition-all duration-200 ${
                    data.badgeIcon === icon.value
                      ? "border-indigo-500 bg-indigo-50 scale-110"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  title={icon.label}
                >
                  {icon.emoji}
                </button>
              ))}
            </div>
            {errors.badgeIcon && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.badgeIcon}
              </p>
            )}
          </div>
        </>
      )}

      {/* Reward description */}
      <div className="space-y-2">
        <Label htmlFor="rewardDescription" className="text-base font-semibold">
          Description de la récompense *
        </Label>
        <Textarea
          id="rewardDescription"
          value={data.rewardDescription}
          onChange={(e) => onChange({ rewardDescription: e.target.value })}
          placeholder={
            data.rewardType === "bonus"
              ? "Ex: Bonus de 100€ ajouté à la commission du mois"
              : data.rewardType === "badge"
              ? "Ex: Badge exclusif affiché sur votre profil"
              : "Ex: 500 points bonus pour le classement"
          }
          className={`min-h-[80px] text-base resize-none ${errors.rewardDescription ? "border-red-500" : ""}`}
        />
        {errors.rewardDescription && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.rewardDescription}
          </p>
        )}
      </div>
    </div>
  )
}

// ============================================
// STEP 4: CONFIRMATION
// ============================================
function Step4Confirmation({ data }: { data: ChallengeFormData }) {
  const typeConfig = CHALLENGE_TYPE_CONFIG[data.type]
  const rewardConfig = REWARD_TYPE_CONFIG[data.rewardType]
  const TypeIcon = CHALLENGE_TYPE_ICONS[data.type]
  const badgeEmoji = BADGE_ICONS.find((b) => b.value === data.badgeIcon)?.emoji

  const selectedMembers = data.allParticipants
    ? teamMembers
    : teamMembers.filter(m => data.participantIds.includes(m.id))

  return (
    <div className="space-y-6">
      {/* Preview card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <TypeIcon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{data.title || "Titre du challenge"}</h3>
              <Badge className="bg-white/20 text-white mt-1">
                {typeConfig.labelShort}
              </Badge>
            </div>
          </div>
          <Badge className="bg-emerald-400/20 text-emerald-100 border border-emerald-400/30">
            Nouveau
          </Badge>
        </div>

        <p className="text-white/80 text-sm mb-4 line-clamp-2">
          {data.description || "Description du challenge..."}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 rounded-lg bg-white/10">
            <p className="text-white/60 text-xs mb-1">Objectif</p>
            <p className="font-bold text-lg">
              {formatChallengeTarget(data.type, data.target, data.targetModelName) || "-"}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-white/10">
            <p className="text-white/60 text-xs mb-1">Durée</p>
            <p className="font-bold text-lg">
              {data.startDate && data.endDate
                ? formatChallengeDuration(data.startDate, data.endDate)
                : "-"}
            </p>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-amber-400/20 border border-amber-400/30">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-300" />
            <span className="text-amber-200 text-sm font-medium">Récompense</span>
          </div>
          <p className="font-bold text-lg mt-1">
            {data.rewardType === "badge" && badgeEmoji && `${badgeEmoji} `}
            {data.rewardType === "badge" && data.badgeName
              ? data.badgeName
              : rewardConfig.format(data.rewardValue)}
          </p>
        </div>
      </div>

      {/* Participants preview */}
      <div className="p-4 rounded-xl bg-gray-50 border">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-indigo-600" />
          <span className="font-semibold text-gray-900">
            {selectedMembers.length} participant{selectedMembers.length > 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedMembers.map(member => (
            <div key={member.id} className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border shadow-sm">
              <Avatar className="h-6 w-6">
                <AvatarImage src={member.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 text-xs">
                  {member.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700">{member.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <Check className="w-5 h-5 text-emerald-500" />
          Récapitulatif
        </h4>

        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Titre</span>
            <span className="font-medium text-gray-900">{data.title}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Type</span>
            <span className="font-medium text-gray-900">{typeConfig.label}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Objectif</span>
            <span className="font-medium text-gray-900">
              {formatChallengeTarget(data.type, data.target, data.targetModelName)}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Période</span>
            <span className="font-medium text-gray-900">
              {data.startDate && data.endDate ? (
                <>
                  {new Date(data.startDate).toLocaleDateString("fr-FR")} -{" "}
                  {new Date(data.endDate).toLocaleDateString("fr-FR")}
                </>
              ) : (
                "-"
              )}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Participants</span>
            <span className="font-medium text-gray-900">
              {data.allParticipants ? "Toute l'équipe" : `${data.participantIds.length} sélectionnés`}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Récompense</span>
            <span className="font-medium text-gray-900">
              {rewardConfig.label} -{" "}
              {data.rewardType === "badge" && data.badgeName
                ? data.badgeName
                : rewardConfig.format(data.rewardValue)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================
function NewTeamChallengePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedUserId = searchParams.get("target") || undefined

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<ChallengeFormData>(() => {
    // If a user is preselected, start with them in the selection
    if (preselectedUserId) {
      return {
        ...DEFAULT_FORM_DATA,
        allParticipants: false,
        participantIds: [preselectedUserId]
      }
    }
    return DEFAULT_FORM_DATA
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalSteps = 4

  const updateFormData = (updates: Partial<ChallengeFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
    const updatedFields = Object.keys(updates)
    setErrors((prev) => {
      const newErrors = { ...prev }
      updatedFields.forEach((field) => delete newErrors[field])
      return newErrors
    })
  }

  const validateCurrentStep = (): boolean => {
    let validation
    switch (currentStep) {
      case 1:
        validation = validateStep1(formData)
        break
      case 2:
        validation = validateStep2(formData)
        // Additional validation for participants
        if (!formData.allParticipants && formData.participantIds.length === 0) {
          validation.isValid = false
          validation.errors.participants = "Sélectionnez au moins un participant"
        }
        break
      case 3:
        validation = validateStep3(formData)
        break
      default:
        return true
    }

    setErrors(validation.errors)
    return validation.isValid
  }

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In real app, would call Firebase to create the challenge
    console.log("Team challenge created:", {
      ...formData,
      createdBy: currentChefVentes.id,
      creatorRole: "chef_ventes"
    })

    setIsSubmitting(false)
    router.push("/chef-ventes")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-indigo-200 text-sm mb-6">
            <Link href="/chef-ventes" className="hover:text-white transition-colors">
              Chef des Ventes
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/chef-ventes" className="hover:text-white transition-colors">
              Challenges
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Nouveau</span>
          </div>

          {/* Title */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Créer un challenge équipe</h1>
              <p className="text-indigo-200">Motivez vos commerciaux avec un nouveau défi</p>
            </div>
          </div>

          {/* Step indicator */}
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        </div>
      </div>

      {/* Form content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Card className="border-0 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">
              {currentStep === 1 && "Informations de base"}
              {currentStep === 2 && "Objectif, durée et participants"}
              {currentStep === 3 && "Récompense"}
              {currentStep === 4 && "Confirmation"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Définissez le nom et le type de votre challenge"}
              {currentStep === 2 && "Configurez l'objectif, la période et sélectionnez les participants"}
              {currentStep === 3 && "Choisissez la récompense pour les gagnants"}
              {currentStep === 4 && "Vérifiez les détails avant de créer le challenge"}
            </CardDescription>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            {currentStep === 1 && (
              <Step1BasicInfo data={formData} onChange={updateFormData} errors={errors} />
            )}
            {currentStep === 2 && (
              <Step2Objective
                data={formData}
                onChange={updateFormData}
                errors={errors}
                preselectedUserId={preselectedUserId}
              />
            )}
            {currentStep === 3 && (
              <Step3Reward data={formData} onChange={updateFormData} errors={errors} />
            )}
            {currentStep === 4 && <Step4Confirmation data={formData} />}
          </CardContent>

          <Separator />

          {/* Navigation */}
          <div className="p-6 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={currentStep === 1 ? () => router.back() : handlePrevious}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              {currentStep === 1 ? "Annuler" : "Précédent"}
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 gap-2"
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 gap-2 min-w-[160px]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Créer le challenge
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

// Loading fallback
function NewTeamChallengePageFallback() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-white/30 rounded w-1/4 mb-6" />
            <div className="h-10 bg-white/30 rounded w-1/2 mb-2" />
            <div className="h-4 bg-white/30 rounded w-1/3 mb-8" />
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 bg-white/30 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-xl p-8 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
          <div className="space-y-6">
            <div className="h-12 bg-gray-100 rounded" />
            <div className="h-24 bg-gray-100 rounded" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 bg-gray-100 rounded" />
              <div className="h-24 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Export wrapper with Suspense
export default function NewTeamChallengePage() {
  return (
    <Suspense fallback={<NewTeamChallengePageFallback />}>
      <NewTeamChallengePageContent />
    </Suspense>
  )
}
