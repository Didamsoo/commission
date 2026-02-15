import {
  P2PChallenge,
  P2PChallengeNotification,
  P2PParticipant
} from "@/types/p2p-challenges"

// ============================================
// DONNÉES MOCKÉES POUR LES DÉFIS P2P
// ============================================

/** Utilisateur courant simulé (Jean Dupont) */
export const CURRENT_USER_ID = "user-1"

/** Liste des commerciaux disponibles */
export const mockCommercials: P2PParticipant[] = [
  {
    id: "user-1",
    name: "Jean Dupont",
    avatar: "",
    email: "jean@ford-paris.fr",
    currentScore: 0
  },
  {
    id: "user-2",
    name: "Marie Martin",
    avatar: "",
    email: "marie@ford-paris.fr",
    currentScore: 0
  },
  {
    id: "user-3",
    name: "Pierre Durand",
    avatar: "",
    email: "pierre@ford-paris.fr",
    currentScore: 0
  },
  {
    id: "user-4",
    name: "Sophie Bernard",
    avatar: "",
    email: "sophie@ford-paris.fr",
    currentScore: 0
  },
  {
    id: "user-5",
    name: "Lucas Petit",
    avatar: "",
    email: "lucas@ford-paris.fr",
    currentScore: 0
  },
  {
    id: "user-6",
    name: "Emma Leroy",
    avatar: "",
    email: "emma@ford-paris.fr",
    currentScore: 0
  }
]

/** Défis P2P mockés */
export const mockP2PChallenges: P2PChallenge[] = [
  // Défi actif - Marie vs Jean (Jean est le challenged)
  {
    id: "p2p-1",
    challenger: {
      id: "user-2",
      name: "Marie Martin",
      avatar: "",
      currentScore: 4
    },
    challenged: {
      id: "user-1",
      name: "Jean Dupont",
      avatar: "",
      currentScore: 3
    },
    metric: "sales_count",
    durationDays: 7,
    startDate: "2024-02-01T08:00:00Z",
    endDate: "2024-02-08T23:59:59Z",
    challengerStake: {
      points: 200,
      customReward: "une bière",
      customRewardEmoji: "🍺"
    },
    challengedStake: {
      points: 200,
      customReward: "un café",
      customRewardEmoji: "☕"
    },
    status: "active",
    createdAt: "2024-01-31T10:00:00Z",
    updatedAt: "2024-02-01T08:00:00Z"
  },

  // Défi en attente - Pierre défie Jean
  {
    id: "p2p-2",
    challenger: {
      id: "user-3",
      name: "Pierre Durand",
      avatar: "",
      currentScore: 0
    },
    challenged: {
      id: "user-1",
      name: "Jean Dupont",
      avatar: "",
      currentScore: 0
    },
    metric: "margin",
    durationDays: 14,
    challengerStake: {
      points: 500,
      customReward: "un déjeuner",
      customRewardEmoji: "🍽️"
    },
    challengedStake: {
      points: 500,
      customReward: "un déjeuner",
      customRewardEmoji: "🍽️"
    },
    status: "pending",
    createdAt: "2024-02-03T09:00:00Z",
    updatedAt: "2024-02-03T09:00:00Z"
  },

  // Défi en négociation - Jean défie Sophie
  {
    id: "p2p-3",
    challenger: {
      id: "user-1",
      name: "Jean Dupont",
      avatar: "",
      currentScore: 0
    },
    challenged: {
      id: "user-4",
      name: "Sophie Bernard",
      avatar: "",
      currentScore: 0
    },
    metric: "financing_count",
    durationDays: 7,
    challengerStake: {
      points: 300,
      customReward: "une boîte de chocolats",
      customRewardEmoji: "🍫"
    },
    challengedStake: {
      points: 300,
      customReward: "une boîte de chocolats",
      customRewardEmoji: "🍫"
    },
    status: "negotiating",
    createdAt: "2024-02-02T14:00:00Z",
    updatedAt: "2024-02-03T11:30:00Z",
    negotiation: {
      messages: [
        {
          id: "msg-1",
          senderId: "user-4",
          senderName: "Sophie Bernard",
          message: "300 points c'est un peu élevé, je propose 150 points chacun ?",
          proposedStake: {
            points: 150,
            customReward: "une boîte de chocolats",
            customRewardEmoji: "🍫"
          },
          timestamp: "2024-02-02T16:00:00Z",
          type: "counter_offer"
        },
        {
          id: "msg-2",
          senderId: "user-1",
          senderName: "Jean Dupont",
          message: "Ok pour 200 points, c'est mon dernier mot !",
          proposedStake: {
            points: 200,
            customReward: "une boîte de chocolats",
            customRewardEmoji: "🍫"
          },
          timestamp: "2024-02-03T09:00:00Z",
          type: "counter_offer"
        },
        {
          id: "msg-3",
          senderId: "user-4",
          senderName: "Sophie Bernard",
          message: "Hmm, laisse-moi réfléchir...",
          timestamp: "2024-02-03T11:30:00Z",
          type: "message"
        }
      ],
      currentOffer: {
        stake: {
          points: 200,
          customReward: "une boîte de chocolats",
          customRewardEmoji: "🍫"
        },
        durationDays: 7
      },
      lastUpdated: "2024-02-03T11:30:00Z"
    }
  },

  // Défi terminé - Jean a gagné contre Lucas
  {
    id: "p2p-4",
    challenger: {
      id: "user-1",
      name: "Jean Dupont",
      avatar: "",
      currentScore: 6
    },
    challenged: {
      id: "user-5",
      name: "Lucas Petit",
      avatar: "",
      currentScore: 4
    },
    metric: "sales_count",
    durationDays: 7,
    startDate: "2024-01-20T08:00:00Z",
    endDate: "2024-01-27T23:59:59Z",
    challengerStake: {
      points: 150,
      customReward: "gloire éternelle",
      customRewardEmoji: "🏆"
    },
    challengedStake: {
      points: 150,
      customReward: "gloire éternelle",
      customRewardEmoji: "🏆"
    },
    status: "completed",
    createdAt: "2024-01-19T15:00:00Z",
    updatedAt: "2024-01-28T00:00:00Z",
    result: {
      winnerId: "user-1",
      winnerName: "Jean Dupont",
      challengerFinalScore: 6,
      challengedFinalScore: 4,
      completedAt: "2024-01-28T00:00:00Z"
    }
  },

  // Défi terminé - Jean a perdu contre Emma
  {
    id: "p2p-5",
    challenger: {
      id: "user-6",
      name: "Emma Leroy",
      avatar: "",
      currentScore: 8500
    },
    challenged: {
      id: "user-1",
      name: "Jean Dupont",
      avatar: "",
      currentScore: 7200
    },
    metric: "margin",
    durationDays: 14,
    startDate: "2024-01-08T08:00:00Z",
    endDate: "2024-01-22T23:59:59Z",
    challengerStake: {
      points: 250,
      customReward: "une place de ciné",
      customRewardEmoji: "🎬"
    },
    challengedStake: {
      points: 250,
      customReward: "une place de ciné",
      customRewardEmoji: "🎬"
    },
    status: "completed",
    createdAt: "2024-01-07T10:00:00Z",
    updatedAt: "2024-01-23T00:00:00Z",
    result: {
      winnerId: "user-6",
      winnerName: "Emma Leroy",
      challengerFinalScore: 8500,
      challengedFinalScore: 7200,
      completedAt: "2024-01-23T00:00:00Z"
    }
  },

  // Défi refusé
  {
    id: "p2p-6",
    challenger: {
      id: "user-1",
      name: "Jean Dupont",
      avatar: "",
      currentScore: 0
    },
    challenged: {
      id: "user-2",
      name: "Marie Martin",
      avatar: "",
      currentScore: 0
    },
    metric: "revenue",
    durationDays: 30,
    challengerStake: {
      points: 1000,
      customReward: "un restaurant gastronomique",
      customRewardEmoji: "🍽️"
    },
    challengedStake: {
      points: 1000,
      customReward: "un restaurant gastronomique",
      customRewardEmoji: "🍽️"
    },
    status: "declined",
    createdAt: "2024-01-25T09:00:00Z",
    updatedAt: "2024-01-25T14:00:00Z"
  }
]

/** Notifications P2P mockées */
export const mockP2PNotifications: P2PChallengeNotification[] = [
  {
    id: "notif-1",
    type: "challenge_received",
    challengeId: "p2p-2",
    fromUserId: "user-3",
    fromUserName: "Pierre Durand",
    fromUserAvatar: "",
    message: "Pierre Durand vous défie sur la marge pendant 14 jours ! Mise: 500 points + un déjeuner",
    isRead: false,
    createdAt: "2024-02-03T09:00:00Z"
  },
  {
    id: "notif-2",
    type: "counter_offer",
    challengeId: "p2p-3",
    fromUserId: "user-4",
    fromUserName: "Sophie Bernard",
    fromUserAvatar: "",
    message: "Sophie Bernard hésite encore sur votre contre-offre de 200 points",
    isRead: false,
    createdAt: "2024-02-03T11:30:00Z"
  },
  {
    id: "notif-3",
    type: "challenge_won",
    challengeId: "p2p-4",
    fromUserId: "user-5",
    fromUserName: "Lucas Petit",
    fromUserAvatar: "",
    message: "Félicitations ! Vous avez remporté le défi contre Lucas Petit (6 vs 4 ventes) ! +150 points",
    isRead: true,
    createdAt: "2024-01-28T00:00:00Z"
  },
  {
    id: "notif-4",
    type: "challenge_lost",
    challengeId: "p2p-5",
    fromUserId: "user-6",
    fromUserName: "Emma Leroy",
    fromUserAvatar: "",
    message: "Emma Leroy a remporté le défi marge (8 500€ vs 7 200€). Vous lui devez une place de ciné !",
    isRead: true,
    createdAt: "2024-01-23T00:00:00Z"
  }
]

// ============================================
// HELPERS POUR LA GESTION DES DONNÉES MOCK
// ============================================

/** Récupère les défis où l'utilisateur courant est impliqué */
export function getUserChallenges(userId: string = CURRENT_USER_ID): P2PChallenge[] {
  return mockP2PChallenges.filter(
    c => c.challenger.id === userId || c.challenged.id === userId
  )
}

/** Récupère les défis en attente de réponse pour l'utilisateur */
export function getPendingChallengesForUser(userId: string = CURRENT_USER_ID): P2PChallenge[] {
  return mockP2PChallenges.filter(
    c => c.challenged.id === userId && c.status === "pending"
  )
}

/** Récupère les défis actifs de l'utilisateur */
export function getActiveChallenges(userId: string = CURRENT_USER_ID): P2PChallenge[] {
  return mockP2PChallenges.filter(
    c => (c.challenger.id === userId || c.challenged.id === userId) && c.status === "active"
  )
}

/** Récupère les défis en négociation de l'utilisateur */
export function getNegotiatingChallenges(userId: string = CURRENT_USER_ID): P2PChallenge[] {
  return mockP2PChallenges.filter(
    c => (c.challenger.id === userId || c.challenged.id === userId) && c.status === "negotiating"
  )
}

/** Récupère les défis terminés de l'utilisateur */
export function getCompletedChallenges(userId: string = CURRENT_USER_ID): P2PChallenge[] {
  return mockP2PChallenges.filter(
    c => (c.challenger.id === userId || c.challenged.id === userId) &&
      (c.status === "completed" || c.status === "declined" || c.status === "cancelled")
  )
}

/** Récupère les notifications non lues */
export function getUnreadNotifications(userId: string = CURRENT_USER_ID): P2PChallengeNotification[] {
  return mockP2PNotifications.filter(n => !n.isRead)
}

/** Récupère un commercial par son ID */
export function getCommercialById(id: string): P2PParticipant | undefined {
  return mockCommercials.find(c => c.id === id)
}

/** Récupère les commerciaux disponibles pour un défi (exclut l'utilisateur courant) */
export function getAvailableOpponents(userId: string = CURRENT_USER_ID): P2PParticipant[] {
  return mockCommercials.filter(c => c.id !== userId)
}

/** Vérifie si l'utilisateur est le challenger du défi */
export function isChallenger(challenge: P2PChallenge, userId: string = CURRENT_USER_ID): boolean {
  return challenge.challenger.id === userId
}

/** Vérifie si l'utilisateur est le challenged du défi */
export function isChallenged(challenge: P2PChallenge, userId: string = CURRENT_USER_ID): boolean {
  return challenge.challenged.id === userId
}

/** Vérifie si l'utilisateur a gagné le défi */
export function didUserWin(challenge: P2PChallenge, userId: string = CURRENT_USER_ID): boolean {
  return challenge.result?.winnerId === userId
}
