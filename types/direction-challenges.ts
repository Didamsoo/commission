// Types pour les challenges créés par la direction

export type DirectionChallengeStatus = "draft" | "upcoming" | "active" | "completed" | "cancelled"

export type DirectionChallengeType =
  | "sales_count"      // Nombre de ventes
  | "revenue_target"   // Objectif de CA
  | "margin_target"    // Objectif de marge
  | "financing_rate"   // Taux de financement
  | "specific_model"   // Modèle spécifique

export type RewardType = "bonus" | "badge" | "points"

export interface ChallengeReward {
  type: RewardType
  value: number        // Montant € ou nombre de points
  description: string  // Description personnalisée
  badgeName?: string   // Si type = badge
  badgeIcon?: string   // Icône du badge
}

export interface ChallengeParticipant {
  id: string
  name: string
  avatar?: string
  currentScore: number
  isCompleted: boolean
  completedAt?: string
}

export interface DirectionChallenge {
  id: string
  title: string
  description: string
  type: DirectionChallengeType
  target: number
  targetUnit: string
  targetModelName?: string  // Si type = specific_model
  startDate: string
  endDate: string
  reward: ChallengeReward
  participantIds: string[]  // Vide = tous les commerciaux
  allParticipants: boolean
  status: DirectionChallengeStatus
  createdBy: string
  createdAt: string
  participants: ChallengeParticipant[]
  topPerformers: ChallengeParticipant[]
}

// Configuration des types de challenge
export const CHALLENGE_TYPE_CONFIG: Record<DirectionChallengeType, {
  label: string
  labelShort: string
  unit: string
  unitPlural: string
  icon: string
  description: string
  placeholder: string
}> = {
  sales_count: {
    label: "Nombre de ventes",
    labelShort: "Ventes",
    unit: "vente",
    unitPlural: "ventes",
    icon: "ShoppingCart",
    description: "Atteindre un nombre de ventes",
    placeholder: "Ex: 15"
  },
  revenue_target: {
    label: "Chiffre d'affaires",
    labelShort: "CA",
    unit: "€",
    unitPlural: "€",
    icon: "Euro",
    description: "Atteindre un objectif de chiffre d'affaires",
    placeholder: "Ex: 50000"
  },
  margin_target: {
    label: "Marge totale",
    labelShort: "Marge",
    unit: "€",
    unitPlural: "€",
    icon: "TrendingUp",
    description: "Atteindre un objectif de marge",
    placeholder: "Ex: 5000"
  },
  financing_rate: {
    label: "Taux de financement",
    labelShort: "Financement",
    unit: "%",
    unitPlural: "%",
    icon: "Percent",
    description: "Atteindre un taux de financement",
    placeholder: "Ex: 80"
  },
  specific_model: {
    label: "Modèle spécifique",
    labelShort: "Modèle",
    unit: "unité",
    unitPlural: "unités",
    icon: "Car",
    description: "Vendre un nombre spécifique d'un modèle",
    placeholder: "Ex: 5"
  }
}

// Configuration des types de récompense
export const REWARD_TYPE_CONFIG: Record<RewardType, {
  label: string
  labelShort: string
  icon: string
  format: (value: number) => string
  placeholder: string
}> = {
  bonus: {
    label: "Bonus commission",
    labelShort: "Bonus",
    icon: "Euro",
    format: (value) => `${value}€`,
    placeholder: "Ex: 500"
  },
  badge: {
    label: "Badge exclusif",
    labelShort: "Badge",
    icon: "Award",
    format: (value) => `Badge`,
    placeholder: "Points associés au badge"
  },
  points: {
    label: "Points bonus",
    labelShort: "Points",
    icon: "Star",
    format: (value) => `${value} pts`,
    placeholder: "Ex: 1000"
  }
}

// Icônes disponibles pour les badges
export const BADGE_ICONS = [
  { value: "trophy", label: "Trophée", emoji: "🏆" },
  { value: "star", label: "Étoile", emoji: "⭐" },
  { value: "crown", label: "Couronne", emoji: "👑" },
  { value: "medal", label: "Médaille", emoji: "🥇" },
  { value: "rocket", label: "Fusée", emoji: "🚀" },
  { value: "fire", label: "Flamme", emoji: "🔥" },
  { value: "diamond", label: "Diamant", emoji: "💎" },
  { value: "lightning", label: "Éclair", emoji: "⚡" },
  { value: "target", label: "Cible", emoji: "🎯" },
  { value: "car", label: "Voiture", emoji: "🚗" }
]

// Modèles de véhicules disponibles (Ford)
export const VEHICLE_MODELS = [
  "Fiesta",
  "Focus",
  "Puma",
  "Kuga",
  "Explorer",
  "Mustang",
  "Mustang Mach-E",
  "Bronco",
  "Ranger",
  "Transit",
  "Transit Custom",
  "Transit Connect",
  "Tourneo",
  "E-Transit"
]

// Formulaire de création
export interface ChallengeFormData {
  // Étape 1: Infos de base
  title: string
  description: string
  type: DirectionChallengeType

  // Étape 2: Objectif & durée
  target: number
  targetModelName?: string
  startDate: string
  endDate: string
  allParticipants: boolean
  participantIds: string[]

  // Étape 3: Récompense
  rewardType: RewardType
  rewardValue: number
  rewardDescription: string
  badgeName?: string
  badgeIcon?: string
}

// Valeurs par défaut du formulaire
export const DEFAULT_FORM_DATA: ChallengeFormData = {
  title: "",
  description: "",
  type: "sales_count",
  target: 0,
  targetModelName: undefined,
  startDate: "",
  endDate: "",
  allParticipants: true,
  participantIds: [],
  rewardType: "bonus",
  rewardValue: 0,
  rewardDescription: "",
  badgeName: undefined,
  badgeIcon: undefined
}

// Validation du formulaire
export interface FormValidation {
  isValid: boolean
  errors: Record<string, string>
}

export function validateStep1(data: ChallengeFormData): FormValidation {
  const errors: Record<string, string> = {}

  if (!data.title || data.title.length < 5) {
    errors.title = "Le titre doit contenir au moins 5 caractères"
  }
  if (!data.description || data.description.length < 20) {
    errors.description = "La description doit contenir au moins 20 caractères"
  }
  if (!data.type) {
    errors.type = "Veuillez sélectionner un type de challenge"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export function validateStep2(data: ChallengeFormData): FormValidation {
  const errors: Record<string, string> = {}

  if (!data.target || data.target <= 0) {
    errors.target = "L'objectif doit être supérieur à 0"
  }
  if (data.type === "specific_model" && !data.targetModelName) {
    errors.targetModelName = "Veuillez sélectionner un modèle"
  }
  if (!data.startDate) {
    errors.startDate = "La date de début est requise"
  }
  if (!data.endDate) {
    errors.endDate = "La date de fin est requise"
  }
  if (data.startDate && data.endDate) {
    const start = new Date(data.startDate)
    const end = new Date(data.endDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (start < today) {
      errors.startDate = "La date de début doit être aujourd'hui ou plus tard"
    }
    if (end <= start) {
      errors.endDate = "La date de fin doit être après la date de début"
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export function validateStep3(data: ChallengeFormData): FormValidation {
  const errors: Record<string, string> = {}

  if (!data.rewardType) {
    errors.rewardType = "Veuillez sélectionner un type de récompense"
  }
  if (!data.rewardValue || data.rewardValue <= 0) {
    errors.rewardValue = "La valeur de la récompense doit être supérieure à 0"
  }
  if (!data.rewardDescription || data.rewardDescription.length < 5) {
    errors.rewardDescription = "Veuillez décrire la récompense"
  }
  if (data.rewardType === "badge") {
    if (!data.badgeName || data.badgeName.length < 3) {
      errors.badgeName = "Le nom du badge doit contenir au moins 3 caractères"
    }
    if (!data.badgeIcon) {
      errors.badgeIcon = "Veuillez sélectionner une icône pour le badge"
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Helper pour formater la durée
export function formatChallengeDuration(startDate: string, endDate: string): string {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return "1 jour"
  if (diffDays < 7) return `${diffDays} jours`
  if (diffDays === 7) return "1 semaine"
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} semaines`
  if (diffDays === 30 || diffDays === 31) return "1 mois"
  return `${Math.floor(diffDays / 30)} mois`
}

// Helper pour formater l'objectif
export function formatChallengeTarget(type: DirectionChallengeType, target: number, modelName?: string): string {
  const config = CHALLENGE_TYPE_CONFIG[type]

  if (type === "specific_model" && modelName) {
    return `${target} ${modelName}${target > 1 ? 's' : ''}`
  }

  if (type === "financing_rate") {
    return `${target}%`
  }

  if (type === "revenue_target" || type === "margin_target") {
    return `${target.toLocaleString('fr-FR')}€`
  }

  return `${target} ${target > 1 ? config.unitPlural : config.unit}`
}
