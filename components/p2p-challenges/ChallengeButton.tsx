"use client"

import { useState } from "react"
import { Swords } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CreateChallengeDialog } from "./CreateChallengeDialog"
import { P2PParticipant, P2PChallenge } from "@/types/p2p-challenges"

interface ChallengeButtonProps {
  targetUser: {
    id: string
    name: string
    avatar?: string
  }
  variant?: "default" | "compact" | "icon"
  onChallengeCreated?: (challenge: P2PChallenge) => void
}

export function ChallengeButton({
  targetUser,
  variant = "default",
  onChallengeCreated
}: ChallengeButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const preselectedUser: P2PParticipant = {
    id: targetUser.id,
    name: targetUser.name,
    avatar: targetUser.avatar || "",
    currentScore: 0
  }

  const handleChallengeCreated = (challenge: P2PChallenge) => {
    onChallengeCreated?.(challenge)
  }

  if (variant === "icon") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDialogOpen(true)}
              className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
            >
              <Swords className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Défier {targetUser.name}</p>
          </TooltipContent>
        </Tooltip>

        <CreateChallengeDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          preselectedUser={preselectedUser}
          onChallengeCreated={handleChallengeCreated}
        />
      </TooltipProvider>
    )
  }

  if (variant === "compact") {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsDialogOpen(true)}
          className="h-8 px-3 text-xs border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
        >
          <Swords className="w-3.5 h-3.5 mr-1.5" />
          Défier
        </Button>

        <CreateChallengeDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          preselectedUser={preselectedUser}
          onChallengeCreated={handleChallengeCreated}
        />
      </>
    )
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsDialogOpen(true)}
        className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 group"
      >
        <Swords className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
        Défier {targetUser.name}
      </Button>

      <CreateChallengeDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        preselectedUser={preselectedUser}
        onChallengeCreated={handleChallengeCreated}
      />
    </>
  )
}

export default ChallengeButton
