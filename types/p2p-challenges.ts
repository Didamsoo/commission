// ============================================
// TYPES POUR LES DÉFIS P2P ENTRE COMMERCIAUX
// ============================================

/** Statut du défi P2P */
export type P2PChallengeStatus =
  | "pending"      // En attente de réponse
  | "negotiating"  // En cours de négociation
  | "active"       // Le défi est en cours
  | "completed"    // Terminé
  | "declined"     // Refusé
  | "cancelled"    // Annulé
  | "expired"      // Expiré (pas de réponse)

/** Type de métrique pour le défi */
export type P2PChallengeMetric =
  | "sales_count"      // Nombre de ventes
  | "revenue"          // Chiffre d'affaires
  | "margin"           // Marge totale
  | "financing_count"  // Nombre de financements

/** Participant au défi */
export interface P2PParticipant {
  id: string
  name: string
  avatar: string
  email?: string
  currentScore: number  // Score actuel dans le défi
}

/** Mise/Récompense du défi */
export interface P2PStake {
  points: number              // Points mis en jeu (ex: 200)
  customReward: string        // Récompense personnalisée (ex: "une bière")
  customRewardEmoji?: string  // Emoji optionnel (ex: "beer")
}

/** Type de message de négociation */
export type NegotiationMessageType = "message" | "counter_offer" | "accept" | "decline"

/** Message de négociation */
export interface NegotiationMessage {
  id: string
  senderId: string
  senderName: string
  message?: string
  proposedStake?: P2PStake     // Nouvelle proposition de mise
  proposedDuration?: number    // Nouvelle proposition de durée (jours)
  timestamp: string
  type: NegotiationMessageType
}

/** Historique de négociation */
export interface NegotiationHistory {
  messages: NegotiationMessage[]
  currentOffer: {
    stake: P2PStake
    durationDays: number
  }
  lastUpdated: string
}

/** Résultat du défi */
export interface P2PChallengeResult {
  winnerId: string
  winnerName: string
  challengerFinalScore: number
  challengedFinalScore: number
  completedAt: string
  isDraw?: boolean
}

/** Défi P2P principal */
export interface P2PChallenge {
  id: string

  // Participants
  challenger: P2PParticipant    // Celui qui crée le défi
  challenged: P2PParticipant    // Celui qui est défié

  // Configuration du défi
  metric: P2PChallengeMetric
  durationDays: number          // Durée en jours
  startDate?: string            // Date de début (après acceptation)
  endDate?: string              // Date de fin calculée

  // Mises
  challengerStake: P2PStake     // Mise du challenger
  challengedStake: P2PStake     // Mise du challenged (peut différer après négociation)

  // Statut et progression
  status: P2PChallengeStatus
  createdAt: string
  updatedAt: string

  // Négociation (si applicable)
  negotiation?: NegotiationHistory

  // Résultats (une fois terminé)
  result?: P2PChallengeResult
}

/** Notification de défi P2P */
export type P2PChallengeNotificationType =
  | "challenge_received"     // Nouveau défi reçu
  | "challenge_accepted"     // Défi accepté
  | "challenge_declined"     // Défi refusé
  | "counter_offer"          // Contre-offre reçue
  | "challenge_started"      // Défi démarré
  | "challenge_won"          // Victoire
  | "challenge_lost"         // Défaite
  | "challenge_reminder"     // Rappel (fin proche)
  | "challenge_draw"         // Égalité

export interface P2PChallengeNotification {
  id: string
  type: P2PChallengeNotificationType
  challengeId: string
  fromUserId: string
  fromUserName: string
  fromUserAvatar?: string
  message: string
  isRead: boolean
  createdAt: string
}

/** Données pour créer un nouveau défi */
export interface CreateP2PChallengeData {
  challengedUserId: string
  metric: P2PChallengeMetric
  durationDays: number
  stake: P2PStake
}

// ============================================
// CONSTANTES ET LABELS
// ============================================

/** Labels et configurations des métriques */
export const P2P_METRIC_CONFIG: Record<P2PChallengeMetric, {
  label: string
  labelShort: string
  unit: string
  unitPlural: string
  icon: string
  color: string
}> = {
  sales_count: {
    label: "Nombre de ventes",
    labelShort: "Ventes",
    unit: "vente",
    unitPlural: "ventes",
    icon: "Car",
    color: "blue"
  },
  revenue: {
    label: "Chiffre d'affaires",
    labelShort: "CA",
    unit: "€",
    unitPlural: "€",
    icon: "Euro",
    color: "emerald"
  },
  margin: {
    label: "Marge totale",
    labelShort: "Marge",
    unit: "€",
    unitPlural: "€",
    icon: "TrendingUp",
    color: "purple"
  },
  financing_count: {
    label: "Financements",
    labelShort: "Financements",
    unit: "financement",
    unitPlural: "financements",
    icon: "Percent",
    color: "amber"
  }
}

/** Labels et couleurs des statuts */
export const P2P_STATUS_CONFIG: Record<P2PChallengeStatus, {
  label: string
  color: string
  bgColor: string
  textColor: string
}> = {
  pending: {
    label: "En attente",
    color: "amber",
    bgColor: "bg-amber-100",
    textColor: "text-amber-700"
  },
  negotiating: {
    label: "Négociation",
    color: "blue",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700"
  },
  active: {
    label: "En cours",
    color: "indigo",
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-700"
  },
  completed: {
    label: "Terminé",
    color: "gray",
    bgColor: "bg-gray-100",
    textColor: "text-gray-700"
  },
  declined: {
    label: "Refusé",
    color: "red",
    bgColor: "bg-red-100",
    textColor: "text-red-700"
  },
  cancelled: {
    label: "Annulé",
    color: "gray",
    bgColor: "bg-gray-100",
    textColor: "text-gray-500"
  },
  expired: {
    label: "Expiré",
    color: "gray",
    bgColor: "bg-gray-100",
    textColor: "text-gray-500"
  }
}

/** Durées disponibles pour les défis */
export const P2P_DURATION_OPTIONS = [
  { value: 3, label: "3 jours" },
  { value: 5, label: "5 jours" },
  { value: 7, label: "1 semaine" },
  { value: 14, label: "2 semaines" },
  { value: 30, label: "1 mois" }
]

/** Suggestions de récompenses personnalisées */
export const P2P_REWARD_SUGGESTIONS = [
  { emoji: "☕", label: "Un café" },
  { emoji: "🍺", label: "Une bière" },
  { emoji: "🍽️", label: "Un déjeuner" },
  { emoji: "🎁", label: "Un cadeau" },
  { emoji: "🏆", label: "Gloire éternelle" },
  { emoji: "🍫", label: "Une boîte de chocolats" },
  { emoji: "🎬", label: "Une place de ciné" }
]

/** Points par défaut pour un défi */
export const P2P_DEFAULT_STAKE: P2PStake = {
  points: 100,
  customReward: "",
  customRewardEmoji: undefined
}

// ============================================
// HELPERS
// ============================================

/** Calcule le temps restant pour un défi actif */
export function getTimeRemaining(endDate: string): {
  days: number
  hours: number
  isExpired: boolean
} {
  const end = new Date(endDate)
  const now = new Date()
  const diff = end.getTime() - now.getTime()

  if (diff <= 0) {
    return { days: 0, hours: 0, isExpired: true }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  return { days, hours, isExpired: false }
}

/** Formate le score selon la métrique */
export function formatScore(score: number, metric: P2PChallengeMetric): string {
  if (metric === "revenue" || metric === "margin") {
    return score.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })
  }
  return score.toString()
}

/** Détermine le gagnant d'un défi */
export function determineWinner(challenge: P2PChallenge): P2PChallengeResult | null {
  if (challenge.status !== "active") return null

  const { challenger, challenged } = challenge

  if (challenger.currentScore > challenged.currentScore) {
    return {
      winnerId: challenger.id,
      winnerName: challenger.name,
      challengerFinalScore: challenger.currentScore,
      challengedFinalScore: challenged.currentScore,
      completedAt: new Date().toISOString()
    }
  } else if (challenged.currentScore > challenger.currentScore) {
    return {
      winnerId: challenged.id,
      winnerName: challenged.name,
      challengerFinalScore: challenger.currentScore,
      challengedFinalScore: challenged.currentScore,
      completedAt: new Date().toISOString()
    }
  } else {
    return {
      winnerId: "",
      winnerName: "",
      challengerFinalScore: challenger.currentScore,
      challengedFinalScore: challenged.currentScore,
      completedAt: new Date().toISOString(),
      isDraw: true
    }
  }
}
