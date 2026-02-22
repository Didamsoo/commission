import { describe, it, expect } from 'vitest'
import { isChallenger, isChallenged, didUserWin } from '../p2p-utils'
import type { P2PChallenge } from '@/types/p2p-challenges'

function createChallenge(overrides: Partial<P2PChallenge> = {}): P2PChallenge {
  return {
    id: 'challenge-1',
    challenger: { id: 'user-a', name: 'Alice', avatar: '', currentScore: 5 },
    challenged: { id: 'user-b', name: 'Bob', avatar: '', currentScore: 3 },
    metric: 'sales_count',
    durationDays: 7,
    challengerStake: { points: 100, customReward: '' },
    challengedStake: { points: 100, customReward: '' },
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    ...overrides,
  }
}

describe('isChallenger', () => {
  it('retourne true pour le challenger', () => {
    const challenge = createChallenge()
    expect(isChallenger(challenge, 'user-a')).toBe(true)
  })

  it('retourne false pour le challenged', () => {
    const challenge = createChallenge()
    expect(isChallenger(challenge, 'user-b')).toBe(false)
  })
})

describe('isChallenged', () => {
  it('retourne true pour le challenged', () => {
    const challenge = createChallenge()
    expect(isChallenged(challenge, 'user-b')).toBe(true)
  })

  it('retourne false pour un inconnu', () => {
    const challenge = createChallenge()
    expect(isChallenged(challenge, 'user-c')).toBe(false)
  })
})

describe('didUserWin', () => {
  it('retourne true si le user est le gagnant', () => {
    const challenge = createChallenge({
      result: {
        winnerId: 'user-a',
        winnerName: 'Alice',
        challengerFinalScore: 5,
        challengedFinalScore: 3,
        completedAt: '2024-01-08',
      },
    })
    expect(didUserWin(challenge, 'user-a')).toBe(true)
  })

  it('retourne false si le user a perdu', () => {
    const challenge = createChallenge({
      result: {
        winnerId: 'user-a',
        winnerName: 'Alice',
        challengerFinalScore: 5,
        challengedFinalScore: 3,
        completedAt: '2024-01-08',
      },
    })
    expect(didUserWin(challenge, 'user-b')).toBe(false)
  })
})
