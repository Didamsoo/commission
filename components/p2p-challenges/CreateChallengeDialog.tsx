"use client"

import { useState } from "react"
import {
  Swords,
  User,
  Target,
  Clock,
  Gift,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Car,
  Euro,
  TrendingUp,
  Percent,
  Send
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { P2PStakeInput } from "./P2PStakeInput"
import {
  P2PChallenge,
  P2PChallengeMetric,
  P2PStake,
  P2PParticipant,
  P2P_METRIC_CONFIG,
  P2P_DURATION_OPTIONS,
  P2P_DEFAULT_STAKE
} from "@/types/p2p-challenges"
import { getAvailableOpponents, CURRENT_USER_ID, mockCommercials } from "@/lib/mock-p2p-data"

interface CreateChallengeDialogProps {
  isOpen: boolean
  onClose: () => void
  preselectedUser?: P2PParticipant
  onChallengeCreated?: (challenge: P2PChallenge) => void
}

const STEPS = [
  { id: "opponent", label: "Adversaire", icon: User },
  { id: "metric", label: "Type", icon: Target },
  { id: "duration", label: "Durée", icon: Clock },
  { id: "stake", label: "Mise", icon: Gift },
  { id: "confirm", label: "Confirmation", icon: CheckCircle2 }
]

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

export function CreateChallengeDialog({
  isOpen,
  onClose,
  preselectedUser,
  onChallengeCreated
}: CreateChallengeDialogProps) {
  const [currentStep, setCurrentStep] = useState(preselectedUser ? 1 : 0)
  const [selectedOpponent, setSelectedOpponent] = useState<P2PParticipant | null>(preselectedUser || null)
  const [selectedMetric, setSelectedMetric] = useState<P2PChallengeMetric | null>(null)
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null)
  const [stake, setStake] = useState<P2PStake>(P2P_DEFAULT_STAKE)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const opponents = getAvailableOpponents()
  const currentUser = mockCommercials.find(c => c.id === CURRENT_USER_ID)

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!selectedOpponent || !selectedMetric || !selectedDuration || !currentUser) return

    setIsSubmitting(true)

    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newChallenge: P2PChallenge = {
      id: `p2p-${Date.now()}`,
      challenger: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar || "",
        currentScore: 0
      },
      challenged: {
        id: selectedOpponent.id,
        name: selectedOpponent.name,
        avatar: selectedOpponent.avatar || "",
        currentScore: 0
      },
      metric: selectedMetric,
      durationDays: selectedDuration,
      challengerStake: stake,
      challengedStake: stake,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    onChallengeCreated?.(newChallenge)
    setIsSubmitting(false)
    handleClose()
  }

  const handleClose = () => {
    setCurrentStep(preselectedUser ? 1 : 0)
    setSelectedOpponent(preselectedUser || null)
    setSelectedMetric(null)
    setSelectedDuration(null)
    setStake(P2P_DEFAULT_STAKE)
    onClose()
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!selectedOpponent
      case 1: return !!selectedMetric
      case 2: return !!selectedDuration
      case 3: return stake.points > 0
      case 4: return true
      default: return false
    }
  }

  const MetricIcon = ({ metric }: { metric: P2PChallengeMetric }) => {
    const icons = {
      sales_count: Car,
      revenue: Euro,
      margin: TrendingUp,
      financing_count: Percent
    }
    const Icon = icons[metric]
    return <Icon className="w-5 h-5" />
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        {/* Header avec gradient */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Swords className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-xl text-white">Lancer un défi</DialogTitle>
                <DialogDescription className="text-white/80">
                  Défiez un collègue et prouvez votre valeur !
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Progress steps */}
          <div className="flex items-center justify-between mt-6">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    index < currentStep
                      ? "bg-white text-indigo-600"
                      : index === currentStep
                      ? "bg-white/30 text-white ring-2 ring-white"
                      : "bg-white/10 text-white/50"
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-4 h-4" />
                  )}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-8 h-0.5 mx-1 ${
                      index < currentStep ? "bg-white" : "bg-white/20"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {/* Étape 0: Sélection adversaire */}
          {currentStep === 0 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-semibold text-gray-900">Choisissez votre adversaire</h3>
              <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                {opponents.map((opponent) => (
                  <button
                    key={opponent.id}
                    onClick={() => setSelectedOpponent(opponent)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      selectedOpponent?.id === opponent.id
                        ? "border-indigo-500 bg-indigo-50 shadow-md"
                        : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={opponent.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-sm">
                          {getInitials(opponent.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{opponent.name}</p>
                        <p className="text-xs text-gray-500">Commercial</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Étape 1: Type de défi */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-semibold text-gray-900">Type de défi</h3>
              <div className="space-y-3">
                {(Object.keys(P2P_METRIC_CONFIG) as P2PChallengeMetric[]).map((metric) => {
                  const config = P2P_METRIC_CONFIG[metric]
                  return (
                    <button
                      key={metric}
                      onClick={() => setSelectedMetric(metric)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                        selectedMetric === metric
                          ? `border-${config.color}-500 bg-${config.color}-50 shadow-md`
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl bg-${config.color}-100 flex items-center justify-center`}>
                        <MetricIcon metric={metric} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{config.label}</p>
                        <p className="text-sm text-gray-500">
                          Qui fera le plus de {config.unitPlural}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Étape 2: Durée */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-semibold text-gray-900">Durée du défi</h3>
              <div className="grid grid-cols-2 gap-3">
                {P2P_DURATION_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedDuration(option.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedDuration === option.value
                        ? "border-indigo-500 bg-indigo-50 shadow-md"
                        : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Clock className={`w-5 h-5 ${selectedDuration === option.value ? "text-indigo-600" : "text-gray-400"}`} />
                      <span className={`font-semibold ${selectedDuration === option.value ? "text-indigo-700" : "text-gray-700"}`}>
                        {option.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Étape 3: Mise */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-semibold text-gray-900">Votre mise</h3>
              <P2PStakeInput
                value={stake}
                onChange={setStake}
                label=""
                showSuggestions={true}
              />
            </div>
          )}

          {/* Étape 4: Confirmation */}
          {currentStep === 4 && selectedOpponent && selectedMetric && selectedDuration && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="font-semibold text-gray-900">Récapitulatif du défi</h3>

              {/* Adversaire */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs font-medium text-gray-500 mb-2">Adversaire</p>
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={selectedOpponent.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      {getInitials(selectedOpponent.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900">{selectedOpponent.name}</p>
                    <p className="text-sm text-gray-500">Commercial</p>
                  </div>
                </div>
              </div>

              {/* Détails */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-xs font-medium text-blue-600 mb-1">Type de défi</p>
                  <p className="font-semibold text-blue-900">{P2P_METRIC_CONFIG[selectedMetric].label}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <p className="text-xs font-medium text-purple-600 mb-1">Durée</p>
                  <p className="font-semibold text-purple-900">
                    {P2P_DURATION_OPTIONS.find(d => d.value === selectedDuration)?.label}
                  </p>
                </div>
              </div>

              {/* Mise */}
              <div className="p-4 bg-gradient-to-r from-amber-50 to-purple-50 rounded-xl border border-amber-200">
                <p className="text-xs font-medium text-gray-600 mb-2">Mise en jeu</p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-100 text-amber-700 text-lg px-3 py-1">
                    {stake.points} points
                  </Badge>
                  {stake.customReward && (
                    <Badge className="bg-purple-100 text-purple-700 text-lg px-3 py-1">
                      {stake.customRewardEmoji} {stake.customReward}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Note */}
              <p className="text-sm text-gray-500 text-center">
                {selectedOpponent.name} recevra une notification et pourra accepter, refuser ou négocier ce défi.
              </p>
            </div>
          )}
        </div>

        {/* Footer avec boutons */}
        <div className="border-t border-gray-100 p-4 bg-gray-50 flex justify-between">
          <Button
            variant="outline"
            onClick={currentStep === 0 ? handleClose : handlePrev}
            disabled={isSubmitting}
          >
            {currentStep === 0 ? (
              "Annuler"
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Précédent
              </>
            )}
          </Button>

          {currentStep < STEPS.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            >
              Suivant
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Envoi...
                </div>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer le défi
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateChallengeDialog
