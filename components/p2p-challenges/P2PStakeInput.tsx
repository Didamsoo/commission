"use client"

import { useState } from "react"
import { Coins, Gift, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { P2PStake, P2P_REWARD_SUGGESTIONS, P2P_DEFAULT_STAKE } from "@/types/p2p-challenges"

interface P2PStakeInputProps {
  value: P2PStake
  onChange: (stake: P2PStake) => void
  label?: string
  showSuggestions?: boolean
  disabled?: boolean
}

export function P2PStakeInput({
  value,
  onChange,
  label = "Mise en jeu",
  showSuggestions = true,
  disabled = false
}: P2PStakeInputProps) {
  const [showAllSuggestions, setShowAllSuggestions] = useState(false)

  const handlePointsChange = (points: string) => {
    const numPoints = parseInt(points) || 0
    onChange({ ...value, points: Math.max(0, numPoints) })
  }

  const handleRewardChange = (customReward: string) => {
    onChange({ ...value, customReward })
  }

  const handleSuggestionClick = (emoji: string, label: string) => {
    onChange({
      ...value,
      customReward: label,
      customRewardEmoji: emoji
    })
  }

  const displayedSuggestions = showAllSuggestions
    ? P2P_REWARD_SUGGESTIONS
    : P2P_REWARD_SUGGESTIONS.slice(0, 4)

  return (
    <div className="space-y-4">
      {label && (
        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Gift className="w-4 h-4 text-purple-500" />
          {label}
        </Label>
      )}

      <div className="grid grid-cols-2 gap-4">
        {/* Points */}
        <div className="space-y-2">
          <Label htmlFor="stake-points" className="text-xs font-medium text-gray-600">
            Points
          </Label>
          <div className="relative">
            <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
            <Input
              id="stake-points"
              type="number"
              min={0}
              step={50}
              value={value.points || ""}
              onChange={(e) => handlePointsChange(e.target.value)}
              placeholder="100"
              className="pl-10 h-11"
              disabled={disabled}
            />
          </div>
        </div>

        {/* Récompense personnalisée */}
        <div className="space-y-2">
          <Label htmlFor="stake-reward" className="text-xs font-medium text-gray-600">
            Récompense perso
          </Label>
          <div className="relative">
            {value.customRewardEmoji ? (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">
                {value.customRewardEmoji}
              </span>
            ) : (
              <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-500" />
            )}
            <Input
              id="stake-reward"
              type="text"
              value={value.customReward}
              onChange={(e) => handleRewardChange(e.target.value)}
              placeholder="une bière..."
              className="pl-10 h-11"
              disabled={disabled}
            />
          </div>
        </div>
      </div>

      {/* Suggestions rapides */}
      {showSuggestions && !disabled && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">Suggestions :</p>
          <div className="flex flex-wrap gap-2">
            {displayedSuggestions.map((suggestion) => (
              <Button
                key={suggestion.label}
                type="button"
                variant="outline"
                size="sm"
                className={`h-8 text-xs transition-all ${
                  value.customReward === suggestion.label
                    ? "border-purple-500 bg-purple-50 text-purple-700"
                    : "hover:border-purple-300 hover:bg-purple-50"
                }`}
                onClick={() => handleSuggestionClick(suggestion.emoji, suggestion.label)}
              >
                <span className="mr-1">{suggestion.emoji}</span>
                {suggestion.label}
              </Button>
            ))}
            {!showAllSuggestions && P2P_REWARD_SUGGESTIONS.length > 4 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-gray-500 hover:text-gray-700"
                onClick={() => setShowAllSuggestions(true)}
              >
                +{P2P_REWARD_SUGGESTIONS.length - 4} autres
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Résumé de la mise */}
      {(value.points > 0 || value.customReward) && (
        <div className="p-3 bg-gradient-to-r from-amber-50 to-purple-50 rounded-lg border border-amber-200/50">
          <p className="text-sm font-medium text-gray-700">
            Mise totale :{" "}
            <span className="text-amber-600 font-bold">{value.points} points</span>
            {value.customReward && (
              <>
                {" "}+{" "}
                <span className="text-purple-600 font-bold">
                  {value.customRewardEmoji && `${value.customRewardEmoji} `}
                  {value.customReward}
                </span>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  )
}

export default P2PStakeInput
