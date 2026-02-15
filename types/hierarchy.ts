// Types pour la hiérarchie multi-niveaux de l'industrie automobile

// ============================================
// NIVEAUX HIÉRARCHIQUES
// ============================================

export type HierarchyLevel = 1 | 2 | 3 | 4 | 5

export type UserRole =
  | "commercial"       // N1 - Vendeur terrain
  | "chef_ventes"      // N2 - Chef des ventes (équipe VN, VO ou VU)
  | "dir_concession"   // N3 - Directeur de concession
  | "dir_marque"       // N4 - Directeur de marque (multi-concessions)
  | "dir_plaque"       // N5 - Directeur de plaque (multi-marques)
  | "admin"            // Admin système

export const ROLE_CONFIG: Record<UserRole, {
  level: HierarchyLevel | 0
  label: string
  labelShort: string
  description: string
  canChallenge: UserRole | null
  color: string
}> = {
  commercial: {
    level: 1,
    label: "Commercial",
    labelShort: "Commercial",
    description: "Vendeur terrain - Vente directe de véhicules",
    canChallenge: null,
    color: "blue"
  },
  chef_ventes: {
    level: 2,
    label: "Chef des Ventes",
    labelShort: "Chef Ventes",
    description: "Manager d'équipe commerciale (VN, VO ou VU)",
    canChallenge: "commercial",
    color: "indigo"
  },
  dir_concession: {
    level: 3,
    label: "Directeur de Concession",
    labelShort: "Dir. Concession",
    description: "Direction d'un site complet (ventes + APV)",
    canChallenge: "chef_ventes",
    color: "purple"
  },
  dir_marque: {
    level: 4,
    label: "Directeur de Marque",
    labelShort: "Dir. Marque",
    description: "Supervision de plusieurs concessions d'une marque",
    canChallenge: "dir_concession",
    color: "violet"
  },
  dir_plaque: {
    level: 5,
    label: "Directeur de Plaque",
    labelShort: "Dir. Plaque",
    description: "Direction d'un groupe multi-marques",
    canChallenge: "dir_marque",
    color: "fuchsia"
  },
  admin: {
    level: 0,
    label: "Administrateur",
    labelShort: "Admin",
    description: "Administrateur système",
    canChallenge: null,
    color: "gray"
  }
}

// ============================================
// PERMISSIONS
// ============================================

export interface UserPermissions {
  canCreateChallenges: boolean
  canApproveSales: boolean
  canManageUsers: boolean
  canViewPL: boolean
  canEditPayplan: boolean
  canViewTeam: boolean
  canViewAllTeams: boolean
  canViewMultiSites: boolean
  canViewMultiBrands: boolean
  canExportReports: boolean
  canManageStock: boolean
}

export const DEFAULT_PERMISSIONS: Record<UserRole, UserPermissions> = {
  commercial: {
    canCreateChallenges: false,
    canApproveSales: false,
    canManageUsers: false,
    canViewPL: false,
    canEditPayplan: false,
    canViewTeam: false,
    canViewAllTeams: false,
    canViewMultiSites: false,
    canViewMultiBrands: false,
    canExportReports: false,
    canManageStock: false
  },
  chef_ventes: {
    canCreateChallenges: true,
    canApproveSales: true,
    canManageUsers: false,
    canViewPL: false,
    canEditPayplan: false,
    canViewTeam: true,
    canViewAllTeams: false,
    canViewMultiSites: false,
    canViewMultiBrands: false,
    canExportReports: true,
    canManageStock: false
  },
  dir_concession: {
    canCreateChallenges: true,
    canApproveSales: true,
    canManageUsers: true,
    canViewPL: true,
    canEditPayplan: true,
    canViewTeam: true,
    canViewAllTeams: true,
    canViewMultiSites: false,
    canViewMultiBrands: false,
    canExportReports: true,
    canManageStock: true
  },
  dir_marque: {
    canCreateChallenges: true,
    canApproveSales: true,
    canManageUsers: true,
    canViewPL: true,
    canEditPayplan: true,
    canViewTeam: true,
    canViewAllTeams: true,
    canViewMultiSites: true,
    canViewMultiBrands: false,
    canExportReports: true,
    canManageStock: true
  },
  dir_plaque: {
    canCreateChallenges: true,
    canApproveSales: true,
    canManageUsers: true,
    canViewPL: true,
    canEditPayplan: true,
    canViewTeam: true,
    canViewAllTeams: true,
    canViewMultiSites: true,
    canViewMultiBrands: true,
    canExportReports: true,
    canManageStock: true
  },
  admin: {
    canCreateChallenges: true,
    canApproveSales: true,
    canManageUsers: true,
    canViewPL: true,
    canEditPayplan: true,
    canViewTeam: true,
    canViewAllTeams: true,
    canViewMultiSites: true,
    canViewMultiBrands: true,
    canExportReports: true,
    canManageStock: true
  }
}

// ============================================
// TYPES D'ÉQUIPES
// ============================================

export type TeamType = "VN" | "VO" | "VU" | "APV" | "ADMIN"

export const TEAM_TYPE_CONFIG: Record<TeamType, {
  label: string
  labelFull: string
  color: string
  icon: string
}> = {
  VN: {
    label: "VN",
    labelFull: "Véhicules Neufs",
    color: "blue",
    icon: "Car"
  },
  VO: {
    label: "VO",
    labelFull: "Véhicules d'Occasion",
    color: "emerald",
    icon: "CarFront"
  },
  VU: {
    label: "VU",
    labelFull: "Véhicules Utilitaires",
    color: "amber",
    icon: "Truck"
  },
  APV: {
    label: "APV",
    labelFull: "Après-Vente",
    color: "purple",
    icon: "Wrench"
  },
  ADMIN: {
    label: "Admin",
    labelFull: "Administration",
    color: "gray",
    icon: "Building"
  }
}

// ============================================
// UTILISATEUR ÉTENDU
// ============================================

export interface HierarchyUser {
  id: string
  email: string
  fullName: string
  avatarUrl?: string
  role: UserRole
  level: HierarchyLevel

  // Références hiérarchiques
  dealershipId?: string
  teamType?: TeamType         // Pour N1, N2
  brandId?: string            // Pour N4
  groupId?: string            // Pour N5
  managerId?: string          // Supérieur direct

  // Stats personnelles
  stats: UserStats

  // Permissions
  permissions: UserPermissions

  // Métadonnées
  isActive: boolean
  createdAt: string
  lastLoginAt?: string
}

export interface UserStats {
  // Stats de vente (N1, N2)
  totalSales: number
  totalRevenue: number
  totalMargin: number
  totalCommission: number
  totalPoints: number
  currentStreak: number
  avgGPU: number
  financingRate: number
  conversionRate: number

  // Stats d'équipe (N2+)
  teamSize?: number
  teamSales?: number
  teamMargin?: number
  teamObjectiveRate?: number
  teamRanking?: number

  // Stats multi-sites (N4, N5)
  sitesCount?: number
  brandsCount?: number
}

// ============================================
// STRUCTURES ORGANISATIONNELLES
// ============================================

export interface Group {
  id: string
  name: string
  logo?: string
  brandIds: string[]
  settings: {
    fiscalYearStart: string
    reportingCurrency: string
  }
  stats?: GroupStats
  createdAt: string
}

export interface Brand {
  id: string
  name: string
  logo?: string
  groupId: string
  dealershipIds: string[]
  constructorTargets: ConstructorTargets
  stats?: BrandStats
  createdAt: string
}

export interface Dealership {
  id: string
  name: string
  code: string
  address: string
  logo?: string
  brandId: string
  groupId: string
  teams: TeamType[]
  settings: {
    payplanConfig: object
    brandColors?: { primary: string; secondary: string }
  }
  stats?: DealershipStats
  createdAt: string
}

export interface Team {
  id: string
  type: TeamType
  dealershipId: string
  managerId: string          // Chef des ventes
  memberIds: string[]
  objective: number          // Objectif mensuel
  stats?: TeamStats
}

// ============================================
// STATISTIQUES PAR NIVEAU
// ============================================

export interface TeamStats {
  totalSales: number
  totalRevenue: number
  totalMargin: number
  avgGPU: number
  financingRate: number
  objectiveRate: number      // % de l'objectif atteint
  membersAtObjective: number // Nb de commerciaux à objectif
  stockRotation: number      // Jours moyens en stock
  trend: "up" | "down" | "stable"
  period: string             // "2024-02"
}

export interface DealershipStats {
  totalSales: number
  totalRevenue: number
  totalMargin: number
  netResult: number
  absorption: number         // % frais fixes couverts par APV
  marketShare: number
  satisfaction: number       // NPS/CSAT
  stockRotation: number
  constructorBonus: number   // Prime estimée
  byTeam: Record<TeamType, TeamStats>
  trend: "up" | "down" | "stable"
  period: string
}

export interface BrandStats {
  totalSales: number
  totalRevenue: number
  totalMargin: number
  netResult: number
  marketShare: number
  satisfaction: number
  constructorBonus: number
  sitesAtObjective: number
  byDealership: Record<string, DealershipStats>
  trend: "up" | "down" | "stable"
  period: string
}

export interface GroupStats {
  totalSales: number
  totalRevenue: number
  totalMargin: number
  ebitda: number
  marketShare: number
  evShare: number            // Part véhicules électriques
  byBrand: Record<string, BrandStats>
  trend: "up" | "down" | "stable"
  period: string
}

// ============================================
// OBJECTIFS CONSTRUCTEUR
// ============================================

export interface ConstructorTargets {
  volume: number
  volumeVE: number          // Véhicules électriques
  financing: number         // Taux financement cible
  satisfaction: number      // NPS/CSAT cible
  accessories: number       // € accessoires/véhicule
}

// ============================================
// KPIs PAR RÔLE
// ============================================

export interface CommercialKPIs {
  sales: number
  salesTarget: number
  revenue: number
  margin: number
  gpu: number
  financingRate: number
  conversionRate: number
  satisfaction: number
  accessories: number
  streak: number
  points: number
  ranking: number
  rankingTotal: number
}

export interface ChefVentesKPIs {
  // KPIs d'équipe
  teamSales: number
  teamSalesTarget: number
  teamMargin: number
  teamGPU: number
  teamFinancingRate: number
  teamConversionRate: number
  stockRotation: number

  // KPIs managériaux
  membersAtObjective: number
  teamSize: number
  turnoverRate: number

  // KPIs constructeur
  objectiveRate: number
  constructorBonusEstimate: number

  // Classement
  teamRanking: number
  teamRankingTotal: number
}

export interface DirConcessionKPIs {
  // KPIs financiers
  totalRevenue: number
  totalMargin: number
  netResult: number
  budgetVariance: number

  // KPIs opérationnels
  totalSales: number
  absorption: number
  stockRotation: number
  satisfaction: number
  marketShare: number

  // KPIs constructeur
  constructorObjective: number
  constructorBonus: number

  // Par équipe
  vnPerformance: number
  voPerformance: number
  vuPerformance: number
  apvPerformance: number
}

export interface DirMarqueKPIs {
  // KPIs consolidés
  totalRevenue: number
  totalMargin: number
  netResult: number
  marketShare: number

  // KPIs réseau
  sitesCount: number
  sitesAtObjective: number
  bestPerformer: { name: string; rate: number }
  worstPerformer: { name: string; rate: number }

  // KPIs constructeur
  constructorObjective: number
  constructorBonus: number
  standardsCompliance: number
}

export interface DirPlaqueKPIs {
  // KPIs groupe
  totalRevenue: number
  ebitda: number
  ebitdaRate: number
  marketShare: number
  yoyGrowth: number

  // KPIs par marque
  brandPerformances: Array<{
    brandId: string
    brandName: string
    revenue: number
    revenueShare: number
    performance: number
    trend: "up" | "down" | "stable"
  }>

  // KPIs stratégiques
  evShare: number
  talentRetention: number
  digitalAdoption: number
}

// ============================================
// CHALLENGES HIÉRARCHIQUES
// ============================================

export type ChallengeScope = "individual" | "team" | "site" | "brand" | "group"

export interface HierarchyChallenge {
  id: string
  title: string
  description: string

  // Créateur
  createdBy: string
  creatorRole: UserRole
  creatorLevel: HierarchyLevel

  // Scope
  scope: {
    type: ChallengeScope
    targetLevel: HierarchyLevel  // Niveau des participants
    targetIds: string[]          // IDs des participants
  }

  // Type et objectif
  type: ChallengeType
  target: number
  targetUnit: string
  targetModelName?: string

  // Période
  startDate: string
  endDate: string

  // Récompense
  reward: ChallengeReward

  // Statut
  status: "draft" | "upcoming" | "active" | "completed" | "cancelled"

  // Progression
  participants: ChallengeParticipant[]

  createdAt: string
}

export type ChallengeType =
  | "sales_count"
  | "revenue_target"
  | "margin_target"
  | "financing_rate"
  | "specific_model"
  | "satisfaction"
  | "conversion"
  | "stock_rotation"
  | "ev_share"

export interface ChallengeReward {
  type: "bonus" | "badge" | "points" | "recognition"
  value: number
  description: string
  badgeName?: string
  badgeIcon?: string
}

export interface ChallengeParticipant {
  id: string
  name: string
  avatar?: string
  currentScore: number
  targetScore: number
  progressRate: number
  isCompleted: boolean
  completedAt?: string
  ranking: number
}

// ============================================
// ALERTES ET NOTIFICATIONS
// ============================================

export type AlertType =
  | "low_performance"      // Commercial sous objectif
  | "high_performance"     // Commercial qui explose les objectifs
  | "low_financing"        // Taux financement bas
  | "stock_aging"          // Stock vieillissant
  | "objective_at_risk"    // Objectif mensuel en danger
  | "challenge_ending"     // Challenge qui se termine bientôt
  | "new_challenge"        // Nouveau challenge créé
  | "challenge_completed"  // Challenge terminé

export interface Alert {
  id: string
  type: AlertType
  severity: "info" | "warning" | "critical"
  title: string
  message: string
  targetUserId?: string
  targetUserName?: string
  data: Record<string, unknown>
  isRead: boolean
  createdAt: string
}

// ============================================
// COACHING ET NOTES
// ============================================

export interface CoachingNote {
  id: string
  managerId: string
  commercialId: string
  commercialName: string
  type: "feedback" | "objective" | "action" | "meeting"
  content: string
  isPrivate: boolean
  createdAt: string
}

// ============================================
// HELPERS
// ============================================

export function getLevelLabel(level: HierarchyLevel): string {
  const labels: Record<HierarchyLevel, string> = {
    1: "Commercial",
    2: "Chef des Ventes",
    3: "Directeur de Concession",
    4: "Directeur de Marque",
    5: "Directeur de Plaque"
  }
  return labels[level]
}

export function canUserChallenge(creatorLevel: HierarchyLevel, targetLevel: HierarchyLevel): boolean {
  return creatorLevel === targetLevel + 1
}

export function getSubordinateLevels(level: HierarchyLevel): HierarchyLevel[] {
  const allLevels: HierarchyLevel[] = [1, 2, 3, 4, 5]
  return allLevels.filter(l => l < level)
}

export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value)
}

export function getPerformanceColor(rate: number): string {
  if (rate >= 100) return "emerald"
  if (rate >= 80) return "blue"
  if (rate >= 60) return "amber"
  return "red"
}

export function getTrendIcon(trend: "up" | "down" | "stable"): string {
  switch (trend) {
    case "up": return "TrendingUp"
    case "down": return "TrendingDown"
    default: return "Minus"
  }
}
