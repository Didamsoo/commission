import type { P2PChallenge } from "@/types/p2p-challenges"

export function isChallenger(challenge: P2PChallenge, userId: string): boolean {
  return challenge.challenger.id === userId
}

export function isChallenged(challenge: P2PChallenge, userId: string): boolean {
  return challenge.challenged.id === userId
}

export function didUserWin(challenge: P2PChallenge, userId: string): boolean {
  return challenge.result?.winnerId === userId
}
