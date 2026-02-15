"use client"

import { useState } from "react"
import {
  Swords,
  Check,
  X,
  MessageSquare,
  Clock,
  Trophy,
  AlertCircle
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
import { NegotiationPanel } from "./NegotiationPanel"
import {
  P2PChallenge,
  P2PStake,
  P2P_METRIC_CONFIG,
  P2P_DURATION_OPTIONS
} from "@/types/p2p-challenges"
import { CURRENT_USER_ID } from "@/lib/mock-p2p-data"

interface ChallengeResponseDialogProps {
  challenge: P2PChallenge
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
  onDecline: () => void
  onNegotiate: (offer: { stake: P2PStake; durationDays?: number; message?: string }) => void
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

type ViewMode = "details" | "negotiation"

export function ChallengeResponseDialog({
  challenge,
  isOpen,
  onClose,
  onAccept,
  onDecline,
  onNegotiate
}: ChallengeResponseDialogProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("details")
  const [isAccepting, setIsAccepting] = useState(false)
  const [isDeclining, setIsDeclining] = useState(false)

  const { challenger, metric, durationDays, challengerStake } = challenge
  const metricConfig = P2P_METRIC_CONFIG[metric]

  const handleAccept = async () => {
    setIsAccepting(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    onAccept()
    setIsAccepting(false)
    onClose()
  }

  const handleDecline = async () => {
    setIsDeclining(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    onDecline()
    setIsDeclining(false)
    onClose()
  }

  const handleNegotiate = (offer: { stake: P2PStake; durationDays?: number; message?: string }) => {
    onNegotiate(offer)
  }

  const handleClose = () => {
    setViewMode("details")
    onClose()
  }

  if (viewMode === "negotiation") {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px] p-0 h-[600px] flex flex-col">
          <NegotiationPanel
            challenge={challenge}
            onSendCounterOffer={handleNegotiate}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden">
        {/* Header avec gradient */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-6 text-white">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center animate-pulse">
                <Swords className="w-8 h-8" />
              </div>
            </div>
            <DialogTitle className="text-2xl text-white text-center">
              Nouveau défi !
            </DialogTitle>
            <DialogDescription className="text-white/90 text-center">
              {challenger.name} vous défie
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          {/* Challenger info */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <Avatar className="w-14 h-14 border-2 border-orange-200">
                <AvatarImage src={challenger.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold">
                  {getInitials(challenger.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-gray-900">{challenger.name}</p>
                <p className="text-sm text-gray-500">vous défie en duel !</p>
              </div>
            </div>
          </div>

          {/* Détails du défi */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-xl text-center">
              <Trophy className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-xs font-medium text-blue-600 mb-1">Type de défi</p>
              <p className="font-semibold text-blue-900">{metricConfig.labelShort}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <p className="text-xs font-medium text-purple-600 mb-1">Durée</p>
              <p className="font-semibold text-purple-900">
                {P2P_DURATION_OPTIONS.find(d => d.value === durationDays)?.label || `${durationDays} jours`}
              </p>
            </div>
          </div>

          {/* Mise en jeu */}
          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
            <p className="text-xs font-medium text-amber-700 mb-3 text-center">Mise en jeu</p>
            <div className="flex items-center justify-center gap-3">
              <Badge className="bg-amber-100 text-amber-700 text-lg px-4 py-2">
                {challengerStake.points} points
              </Badge>
              {challengerStake.customReward && (
                <>
                  <span className="text-amber-600 font-bold">+</span>
                  <Badge className="bg-orange-100 text-orange-700 text-lg px-4 py-2">
                    {challengerStake.customRewardEmoji} {challengerStake.customReward}
                  </Badge>
                </>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              Si vous acceptez, vous devrez mettre la même mise. Vous pouvez aussi négocier les termes du défi.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleAccept}
              disabled={isAccepting || isDeclining}
              className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-lg"
            >
              {isAccepting ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Acceptation...
                </div>
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Accepter le défi
                </>
              )}
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => setViewMode("negotiation")}
                disabled={isAccepting || isDeclining}
                variant="outline"
                className="h-11 border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Négocier
              </Button>
              <Button
                onClick={handleDecline}
                disabled={isAccepting || isDeclining}
                variant="outline"
                className="h-11 border-red-300 text-red-600 hover:bg-red-50"
              >
                {isDeclining ? (
                  <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                ) : (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Refuser
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ChallengeResponseDialog
