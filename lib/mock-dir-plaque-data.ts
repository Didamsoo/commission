// Mock data pour le rôle Directeur de Plaque (N5)
// Gère plusieurs marques sur une ou plusieurs régions - niveau stratégique le plus élevé

import { HierarchyUser } from "@/types/hierarchy"

// ============================================
// DIRECTEUR DE PLAQUE ACTUEL (utilisateur connecté)
// ============================================

export const CURRENT_DIR_PLAQUE_ID = "dir-plaque-1"

export const currentDirPlaque: HierarchyUser = {
  id: CURRENT_DIR_PLAQUE_ID,
  email: "philippe.renault@groupe-autoperf.fr",
  fullName: "Philippe Renault",
  avatarUrl: "",
  role: "dir_plaque",
  level: 5,
  groupId: "group-autoperf",
  stats: {
    totalSales: 892,
    totalRevenue: 26760000,
    totalMargin: 1338000,
    totalCommission: 0,
    totalPoints: 0,
    currentStreak: 0,
    avgGPU: 1500,
    financingRate: 74,
    conversionRate: 0,
    teamSize: 3, // 3 marques
    teamSales: 892,
    teamMargin: 1338000,
    teamObjectiveRate: 94.8,
    teamRanking: 1
  },
  permissions: {
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
  isActive: true,
  createdAt: "2015-01-01T00:00:00Z",
  lastLoginAt: "2024-02-20T07:00:00Z"
}

// ============================================
// MARQUES DU GROUPE
// ============================================

export interface BrandData {
  id: string
  name: string
  logo: string
  color: string
  directorId: string
  directorName: string
  dealershipCount: number
  employeeCount: number
  stats: {
    totalSales: number
    salesTarget: number
    objectiveRate: number
    totalRevenue: number
    totalMargin: number
    avgGPU: number
    financingRate: number
    satisfaction: number
    marketShare: number
  }
  trend: "up" | "down" | "stable"
  quarterlyGrowth: number // % vs trimestre précédent
}

export const brands: BrandData[] = [
  {
    id: "brand-ford",
    name: "Ford",
    logo: "🚙",
    color: "from-blue-600 to-blue-700",
    directorId: "dir-marque-1",
    directorName: "Jean Legrand",
    dealershipCount: 6,
    employeeCount: 420,
    stats: {
      totalSales: 287,
      salesTarget: 300,
      objectiveRate: 95.7,
      totalRevenue: 8610000,
      totalMargin: 430500,
      avgGPU: 1500,
      financingRate: 76,
      satisfaction: 86,
      marketShare: 4.2
    },
    trend: "up",
    quarterlyGrowth: 8
  },
  {
    id: "brand-nissan",
    name: "Nissan",
    logo: "🚗",
    color: "from-red-600 to-red-700",
    directorId: "dir-marque-2",
    directorName: "Marie Dupont",
    dealershipCount: 5,
    employeeCount: 350,
    stats: {
      totalSales: 312,
      salesTarget: 320,
      objectiveRate: 97.5,
      totalRevenue: 9360000,
      totalMargin: 468000,
      avgGPU: 1500,
      financingRate: 72,
      satisfaction: 84,
      marketShare: 3.8
    },
    trend: "stable",
    quarterlyGrowth: 3
  },
  {
    id: "brand-suzuki",
    name: "Suzuki",
    logo: "🚐",
    color: "from-yellow-500 to-yellow-600",
    directorId: "dir-marque-3",
    directorName: "Thomas Petit",
    dealershipCount: 4,
    employeeCount: 280,
    stats: {
      totalSales: 293,
      salesTarget: 320,
      objectiveRate: 91.6,
      totalRevenue: 8790000,
      totalMargin: 439500,
      avgGPU: 1500,
      financingRate: 74,
      satisfaction: 88,
      marketShare: 2.9
    },
    trend: "up",
    quarterlyGrowth: 12
  }
]

// ============================================
// KPIs CONSOLIDÉS GROUPE
// ============================================

export interface GroupKPIs {
  revenue: {
    current: number
    target: number
    growth: number // vs année précédente
  }
  ebitda: {
    current: number
    margin: number // en %
    target: number
  }
  volume: {
    current: number
    target: number
    objectiveRate: number
  }
  marketShare: {
    current: number
    evolution: number // pts vs année précédente
  }
  satisfaction: {
    nps: number
    target: number
  }
  workforce: {
    total: number
    turnover: number // % turnover
  }
}

export const groupKPIs: GroupKPIs = {
  revenue: {
    current: 485000000,
    target: 500000000,
    growth: 8
  },
  ebitda: {
    current: 14550000,
    margin: 3.0,
    target: 15000000
  },
  volume: {
    current: 892,
    target: 940,
    objectiveRate: 94.8
  },
  marketShare: {
    current: 10.9,
    evolution: 0.8
  },
  satisfaction: {
    nps: 86,
    target: 85
  },
  workforce: {
    total: 1400,
    turnover: 8.5
  }
}

// ============================================
// P&L CONSOLIDÉ
// ============================================

export interface GroupPL {
  category: string
  ford: number
  nissan: number
  suzuki: number
  total: number
  budget: number
  variance: number
}

export const groupPL: GroupPL[] = [
  { category: "Chiffre d'affaires VN", ford: 145000000, nissan: 165000000, suzuki: 120000000, total: 430000000, budget: 440000000, variance: -2.3 },
  { category: "Chiffre d'affaires VO", ford: 32000000, nissan: 28000000, suzuki: 25000000, total: 85000000, budget: 80000000, variance: 6.3 },
  { category: "Chiffre d'affaires APV", ford: 18000000, nissan: 15000000, suzuki: 12000000, total: 45000000, budget: 48000000, variance: -6.3 },
  { category: "Marge brute", ford: 8700000, nissan: 9400000, suzuki: 7100000, total: 25200000, budget: 25500000, variance: -1.2 },
  { category: "Frais de personnel", ford: -4200000, nissan: -3500000, suzuki: -2800000, total: -10500000, budget: -10200000, variance: -2.9 },
  { category: "Autres charges", ford: -2100000, nissan: -1800000, suzuki: -1500000, total: -5400000, budget: -5500000, variance: 1.8 },
  { category: "EBITDA", ford: 5200000, nissan: 5400000, suzuki: 3950000, total: 14550000, budget: 15000000, variance: -3.0 }
]

// ============================================
// CHALLENGES INTER-MARQUES
// ============================================

export interface GroupChallenge {
  id: string
  title: string
  description: string
  type: "volume" | "revenue" | "margin" | "satisfaction" | "market_share"
  period: "monthly" | "quarterly" | "yearly"
  targetValue: number
  targetUnit: string
  startDate: string
  endDate: string
  reward: {
    type: "bonus" | "recognition" | "trophy"
    value: string
    description: string
  }
  participants: Array<{
    brandId: string
    brandName: string
    currentValue: number
    progressRate: number
    isCompleted: boolean
  }>
  status: "active" | "completed" | "upcoming"
}

export const groupChallenges: GroupChallenge[] = [
  {
    id: "gc-1",
    title: "Meilleure marque Q1",
    description: "Plus haut taux d'atteinte des objectifs du trimestre",
    type: "volume",
    period: "quarterly",
    targetValue: 100,
    targetUnit: "%",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    reward: {
      type: "trophy",
      value: "Trophée Excellence",
      description: "Meilleure marque du groupe"
    },
    participants: [
      { brandId: "brand-nissan", brandName: "Nissan", currentValue: 97.5, progressRate: 97.5, isCompleted: false },
      { brandId: "brand-ford", brandName: "Ford", currentValue: 95.7, progressRate: 95.7, isCompleted: false },
      { brandId: "brand-suzuki", brandName: "Suzuki", currentValue: 91.6, progressRate: 91.6, isCompleted: false }
    ],
    status: "active"
  },
  {
    id: "gc-2",
    title: "Challenge Rentabilité",
    description: "Atteindre une marge EBITDA de 3.2%",
    type: "margin",
    period: "quarterly",
    targetValue: 3.2,
    targetUnit: "%",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    reward: {
      type: "bonus",
      value: "Bonus direction",
      description: "Prime de performance"
    },
    participants: [
      { brandId: "brand-ford", brandName: "Ford", currentValue: 3.1, progressRate: 97, isCompleted: false },
      { brandId: "brand-nissan", brandName: "Nissan", currentValue: 3.0, progressRate: 94, isCompleted: false },
      { brandId: "brand-suzuki", brandName: "Suzuki", currentValue: 2.8, progressRate: 88, isCompleted: false }
    ],
    status: "active"
  },
  {
    id: "gc-3",
    title: "Excellence Client",
    description: "Toutes les marques au-dessus de 85 NPS",
    type: "satisfaction",
    period: "monthly",
    targetValue: 85,
    targetUnit: "NPS",
    startDate: "2024-02-01",
    endDate: "2024-02-29",
    reward: {
      type: "recognition",
      value: "Star Service",
      description: "Label Excellence Client"
    },
    participants: [
      { brandId: "brand-suzuki", brandName: "Suzuki", currentValue: 88, progressRate: 103.5, isCompleted: true },
      { brandId: "brand-ford", brandName: "Ford", currentValue: 86, progressRate: 101.2, isCompleted: true },
      { brandId: "brand-nissan", brandName: "Nissan", currentValue: 84, progressRate: 98.8, isCompleted: false }
    ],
    status: "active"
  }
]

// ============================================
// TENDANCES & ANALYSES
// ============================================

export interface TrendData {
  category: string
  currentValue: number
  previousValue: number
  unit: string
  trend: "up" | "down" | "stable"
  insight: string
}

export const trendsData: TrendData[] = [
  {
    category: "Électrique",
    currentValue: 22,
    previousValue: 17,
    unit: "%",
    trend: "up",
    insight: "+5 pts vs N-1 - Forte progression sur tous les segments"
  },
  {
    category: "VO",
    currentValue: 3.2,
    previousValue: 2.9,
    unit: "% marge",
    trend: "up",
    insight: "Marges en hausse grâce à la tension du marché"
  },
  {
    category: "Atelier",
    currentValue: 82,
    previousValue: 78,
    unit: "% absorption",
    trend: "up",
    insight: "Bonne performance APV, objectif 85%"
  },
  {
    category: "Financement",
    currentValue: 74,
    previousValue: 72,
    unit: "%",
    trend: "up",
    insight: "+2 pts - Effort commercial récompensé"
  },
  {
    category: "Stock VN",
    currentValue: 52,
    previousValue: 45,
    unit: "jours",
    trend: "down",
    insight: "Attention: augmentation du stock, actions requises"
  }
]

// ============================================
// HISTORIQUE PERFORMANCE GROUPE
// ============================================

export interface GroupPerformanceHistory {
  month: string
  ford: { sales: number; margin: number }
  nissan: { sales: number; margin: number }
  suzuki: { sales: number; margin: number }
  total: { sales: number; margin: number }
}

export const groupPerformanceHistory: GroupPerformanceHistory[] = [
  { month: "Sep", ford: { sales: 265, margin: 397500 }, nissan: { sales: 280, margin: 420000 }, suzuki: { sales: 255, margin: 382500 }, total: { sales: 800, margin: 1200000 } },
  { month: "Oct", ford: { sales: 278, margin: 417000 }, nissan: { sales: 295, margin: 442500 }, suzuki: { sales: 268, margin: 402000 }, total: { sales: 841, margin: 1261500 } },
  { month: "Nov", ford: { sales: 290, margin: 435000 }, nissan: { sales: 305, margin: 457500 }, suzuki: { sales: 280, margin: 420000 }, total: { sales: 875, margin: 1312500 } },
  { month: "Déc", ford: { sales: 312, margin: 468000 }, nissan: { sales: 328, margin: 492000 }, suzuki: { sales: 305, margin: 457500 }, total: { sales: 945, margin: 1417500 } },
  { month: "Jan", ford: { sales: 275, margin: 412500 }, nissan: { sales: 298, margin: 447000 }, suzuki: { sales: 278, margin: 417000 }, total: { sales: 851, margin: 1276500 } },
  { month: "Fév", ford: { sales: 287, margin: 430500 }, nissan: { sales: 312, margin: 468000 }, suzuki: { sales: 293, margin: 439500 }, total: { sales: 892, margin: 1338000 } }
]

// ============================================
// ALERTES GROUPE
// ============================================

export interface GroupAlert {
  id: string
  type: "critical" | "warning" | "info" | "success"
  title: string
  message: string
  brandId?: string
  brandName?: string
  createdAt: string
  isRead: boolean
}

export const groupAlerts: GroupAlert[] = [
  {
    id: "ga-1",
    type: "warning",
    title: "Stock VN élevé",
    message: "Le stock VN groupe atteint 52 jours (cible: 45 jours). Actions correctives recommandées.",
    createdAt: "2024-02-20T08:00:00Z",
    isRead: false
  },
  {
    id: "ga-2",
    type: "success",
    title: "Objectif satisfaction atteint",
    message: "2 marques sur 3 dépassent l'objectif NPS de 85",
    createdAt: "2024-02-19T16:00:00Z",
    isRead: false
  },
  {
    id: "ga-3",
    type: "info",
    title: "Rapport trimestriel",
    message: "Le rapport Q1 2024 est disponible pour validation",
    createdAt: "2024-02-19T10:00:00Z",
    isRead: true
  },
  {
    id: "ga-4",
    type: "warning",
    title: "Nissan sous objectif NPS",
    message: "Nissan affiche un NPS de 84 (cible: 85). Plan d'action en cours.",
    brandId: "brand-nissan",
    brandName: "Nissan",
    createdAt: "2024-02-18T14:00:00Z",
    isRead: true
  }
]

// ============================================
// HELPERS
// ============================================

export function getBrandById(id: string): BrandData | undefined {
  return brands.find(b => b.id === id)
}

export function getBrandRanking(): BrandData[] {
  return [...brands].sort((a, b) => b.stats.objectiveRate - a.stats.objectiveRate)
}

export function getUnreadGroupAlerts(): GroupAlert[] {
  return groupAlerts.filter(a => !a.isRead)
}

export function getTotalEmployees(): number {
  return brands.reduce((sum, b) => sum + b.employeeCount, 0)
}

export function getTotalDealerships(): number {
  return brands.reduce((sum, b) => sum + b.dealershipCount, 0)
}
