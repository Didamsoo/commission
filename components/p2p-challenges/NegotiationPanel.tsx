"use client"

import { useState, useRef, useEffect } from "react"
import {
  MessageSquare,
  Send,
  Check,
  X,
  ArrowRight,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { P2PStakeInput } from "./P2PStakeInput"
import {
  P2PChallenge,
  P2PStake,
  NegotiationMessage,
  P2P_DURATION_OPTIONS
} from "@/types/p2p-challenges"
import { CURRENT_USER_ID } from "@/lib/mock-p2p-data"

interface NegotiationPanelProps {
  challenge: P2PChallenge
  currentUserId?: string
  onSendCounterOffer: (offer: { stake: P2PStake; durationDays?: number; message?: string }) => void
  onAccept: () => void
  onDecline: () => void
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

function formatTime(timestamp: string) {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)

  if (days > 0) return `Il y a ${days}j`
  if (hours > 0) return `Il y a ${hours}h`
  return "À l'instant"
}

export function NegotiationPanel({
  challenge,
  currentUserId = CURRENT_USER_ID,
  onSendCounterOffer,
  onAccept,
  onDecline
}: NegotiationPanelProps) {
  const [showCounterOfferForm, setShowCounterOfferForm] = useState(false)
  const [counterStake, setCounterStake] = useState<P2PStake>(
    challenge.negotiation?.currentOffer.stake || challenge.challengerStake
  )
  const [counterDuration, setCounterDuration] = useState<number | null>(null)
  const [message, setMessage] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  const messages = challenge.negotiation?.messages || []
  const currentOffer = challenge.negotiation?.currentOffer || {
    stake: challenge.challengerStake,
    durationDays: challenge.durationDays
  }

  const isChallenger = challenge.challenger.id === currentUserId
  const otherParticipant = isChallenger ? challenge.challenged : challenge.challenger

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSendCounterOffer = () => {
    onSendCounterOffer({
      stake: counterStake,
      durationDays: counterDuration || undefined,
      message: message || undefined
    })
    setShowCounterOfferForm(false)
    setMessage("")
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header avec offre actuelle */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Négociation en cours
          </h3>
          <Badge className="bg-blue-100 text-blue-700">
            avec {otherParticipant.name}
          </Badge>
        </div>

        {/* Offre actuelle */}
        <div className="p-3 bg-white rounded-lg border border-blue-200">
          <p className="text-xs font-medium text-gray-500 mb-2">Offre actuelle</p>
          <div className="flex items-center gap-3">
            <Badge className="bg-amber-100 text-amber-700">
              {currentOffer.stake.points} points
            </Badge>
            {currentOffer.stake.customReward && (
              <Badge className="bg-purple-100 text-purple-700">
                {currentOffer.stake.customRewardEmoji} {currentOffer.stake.customReward}
              </Badge>
            )}
            <Badge variant="outline" className="text-gray-600">
              <Clock className="w-3 h-3 mr-1" />
              {currentOffer.durationDays} jours
            </Badge>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Aucun message pour le moment.</p>
              <p className="text-sm">Envoyez une contre-offre pour démarrer la négociation.</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isFromMe = msg.senderId === currentUserId
              return (
                <div
                  key={msg.id}
                  className={`flex ${isFromMe ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] ${isFromMe ? "order-2" : "order-1"}`}>
                    {!isFromMe && (
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-[10px] bg-purple-100 text-purple-700">
                            {getInitials(msg.senderName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-500">{msg.senderName}</span>
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-2xl ${
                        isFromMe
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-tr-sm"
                          : "bg-gray-100 text-gray-900 rounded-tl-sm"
                      }`}
                    >
                      {msg.type === "counter_offer" && msg.proposedStake && (
                        <div className={`mb-2 p-2 rounded-lg ${isFromMe ? "bg-white/20" : "bg-white"}`}>
                          <p className={`text-xs font-medium mb-1 ${isFromMe ? "text-white/80" : "text-gray-500"}`}>
                            Nouvelle proposition :
                          </p>
                          <div className="flex flex-wrap gap-1">
                            <Badge className={isFromMe ? "bg-white/30 text-white" : "bg-amber-100 text-amber-700"}>
                              {msg.proposedStake.points} pts
                            </Badge>
                            {msg.proposedStake.customReward && (
                              <Badge className={isFromMe ? "bg-white/30 text-white" : "bg-purple-100 text-purple-700"}>
                                {msg.proposedStake.customRewardEmoji} {msg.proposedStake.customReward}
                              </Badge>
                            )}
                            {msg.proposedDuration && (
                              <Badge className={isFromMe ? "bg-white/30 text-white" : "bg-gray-200 text-gray-700"}>
                                {msg.proposedDuration}j
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      {msg.message && <p className="text-sm">{msg.message}</p>}
                    </div>
                    <p className={`text-[10px] text-gray-400 mt-1 ${isFromMe ? "text-right" : "text-left"}`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </ScrollArea>

      <Separator />

      {/* Actions */}
      <div className="p-4 space-y-4">
        {showCounterOfferForm ? (
          <div className="space-y-4 animate-fade-in">
            <P2PStakeInput
              value={counterStake}
              onChange={setCounterStake}
              label="Votre contre-offre"
              showSuggestions={false}
            />

            <div>
              <label className="text-xs font-medium text-gray-600 mb-2 block">
                Message (optionnel)
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ajoutez un message..."
                className="min-h-[60px] resize-none"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCounterOfferForm(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={handleSendCounterOffer}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500"
              >
                <Send className="w-4 h-4 mr-2" />
                Envoyer
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={onAccept}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              <Check className="w-4 h-4 mr-2" />
              Accepter l'offre
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowCounterOfferForm(true)}
              className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Contre-offre
            </Button>
            <Button
              variant="outline"
              onClick={onDecline}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default NegotiationPanel
