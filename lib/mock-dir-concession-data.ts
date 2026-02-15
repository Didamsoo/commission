// Mock data pour le rôle Directeur de Concession (N3)

import {
  HierarchyUser,
  DealershipStats,
  TeamStats,
  DirConcessionKPIs,
  ChefVentesKPIs,
  Alert,
  HierarchyChallenge,
  TeamType
} from "@/types/hierarchy"

// ============================================
// DIRECTEUR DE CONCESSION ACTUEL (utilisateur connecté)
// ============================================

export const CURRENT_DIR_CONCESSION_ID = "dir-concession-1"

export const currentDirConcession: HierarchyUser = {
  id: CURRENT_DIR_CONCESSION_ID,
  email: "philippe.lambert@ford-paris.fr",
  fullName: "Philippe Lambert",
  avatarUrl: "",
  role: "dir_concession",
  level: 3,
  dealershipId: "dealership-1",
  managerId: "dir-marque-1",
  stats: {
    totalSales: 95,
    totalRevenue: 3850000,
    totalMargin: 185000,
    totalCommission: 0,
    totalPoints: 0,
    currentStreak: 0,
    avgGPU: 1947,
    financingRate: 76,
    conversionRate: 26,
    teamSize: 18,
    teamSales: 95,
    teamMargin: 185000,
    teamObjectiveRate: 79,
    teamRanking: 2,
    sitesCount: 1
  },
  permissions: {
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
  isActive: true,
  createdAt: "2018-01-15T00:00:00Z",
  lastLoginAt: "2024-02-20T08:00:00Z"
}

// ============================================
// CHEFS DES VENTES DE LA CONCESSION
// ============================================

export interface ChefVentesInfo {
  id: string
  name: string
  avatar?: string
  email: string
  teamType: TeamType
  teamSize: number
  kpis: ChefVentesKPIs
  trend: "up" | "down" | "stable"
  alerts: Alert[]
}

export const chefsVentes: ChefVentesInfo[] = [
  {
    id: "chef-ventes-1",
    name: "Sophie Martin",
    avatar: "",
    email: "sophie.martin@ford-paris.fr",
    teamType: "VN",
    teamSize: 6,
    kpis: {
      teamSales: 45,
      teamSalesTarget: 60,
      teamMargin: 67500,
      teamGPU: 1500,
      teamFinancingRate: 78,
      teamConversionRate: 28,
      stockRotation: 28,
      membersAtObjective: 3,
      teamSize: 6,
      turnoverRate: 0,
      objectiveRate: 75,
      constructorBonusEstimate: 12500,
      teamRanking: 1,
      teamRankingTotal: 3
    },
    trend: "up",
    alerts: [
      {
        id: "alert-cv1",
        type: "objective_at_risk",
        severity: "warning",
        title: "Objectif mensuel en danger",
        message: "L'équipe VN est à 75% de l'objectif",
        data: { currentSales: 45, target: 60, rate: 75 },
        isRead: false,
        createdAt: "2024-02-20T07:00:00Z"
      }
    ]
  },
  {
    id: "chef-ventes-2",
    name: "Marc Dubois",
    avatar: "",
    email: "marc.dubois@ford-paris.fr",
    teamType: "VO",
    teamSize: 5,
    kpis: {
      teamSales: 32,
      teamSalesTarget: 40,
      teamMargin: 48000,
      teamGPU: 1500,
      teamFinancingRate: 65,
      teamConversionRate: 22,
      stockRotation: 35,
      membersAtObjective: 2,
      teamSize: 5,
      turnoverRate: 0,
      objectiveRate: 80,
      constructorBonusEstimate: 8000,
      teamRanking: 2,
      teamRankingTotal: 3
    },
    trend: "stable",
    alerts: [
      {
        id: "alert-cv2",
        type: "low_financing",
        severity: "warning",
        title: "Taux financement bas",
        message: "L'équipe VO a un taux de financement de 65% (cible: 70%)",
        data: { currentRate: 65, target: 70 },
        isRead: true,
        createdAt: "2024-02-18T09:00:00Z"
      }
    ]
  },
  {
    id: "chef-ventes-3",
    name: "Julie Petit",
    avatar: "",
    email: "julie.petit@ford-paris.fr",
    teamType: "VU",
    teamSize: 4,
    kpis: {
      teamSales: 18,
      teamSalesTarget: 20,
      teamMargin: 36000,
      teamGPU: 2000,
      teamFinancingRate: 85,
      teamConversionRate: 32,
      stockRotation: 22,
      membersAtObjective: 3,
      teamSize: 4,
      turnoverRate: 0,
      objectiveRate: 90,
      constructorBonusEstimate: 6000,
      teamRanking: 1,
      teamRankingTotal: 3
    },
    trend: "up",
    alerts: []
  }
]

// ============================================
// KPIs DU DIRECTEUR DE CONCESSION
// ============================================

export const dirConcessionKPIs: DirConcessionKPIs = {
  // KPIs financiers
  totalRevenue: 3850000,
  totalMargin: 185000,
  netResult: 125000,
  budgetVariance: 8.5, // +8.5% vs budget

  // KPIs opérationnels
  totalSales: 95,
  absorption: 82, // % frais fixes couverts par APV
  stockRotation: 32, // jours moyens
  satisfaction: 87, // NPS/CSAT
  marketShare: 12.5,

  // KPIs constructeur
  constructorObjective: 120, // objectif total
  constructorBonus: 45000,

  // Par équipe
  vnPerformance: 75,
  voPerformance: 80,
  vuPerformance: 90,
  apvPerformance: 85
}

// ============================================
// STATISTIQUES PAR DÉPARTEMENT
// ============================================

export const departmentStats: Record<TeamType, TeamStats> = {
  VN: {
    totalSales: 45,
    totalRevenue: 1800000,
    totalMargin: 67500,
    avgGPU: 1500,
    financingRate: 78,
    objectiveRate: 75,
    membersAtObjective: 3,
    stockRotation: 28,
    trend: "up",
    period: "2024-02"
  },
  VO: {
    totalSales: 32,
    totalRevenue: 960000,
    totalMargin: 48000,
    avgGPU: 1500,
    financingRate: 65,
    objectiveRate: 80,
    membersAtObjective: 2,
    stockRotation: 35,
    trend: "stable",
    period: "2024-02"
  },
  VU: {
    totalSales: 18,
    totalRevenue: 720000,
    totalMargin: 36000,
    avgGPU: 2000,
    financingRate: 85,
    objectiveRate: 90,
    membersAtObjective: 3,
    stockRotation: 22,
    trend: "up",
    period: "2024-02"
  },
  APV: {
    totalSales: 0,
    totalRevenue: 370000,
    totalMargin: 33300,
    avgGPU: 0,
    financingRate: 0,
    objectiveRate: 85,
    membersAtObjective: 0,
    stockRotation: 0,
    trend: "up",
    period: "2024-02"
  },
  ADMIN: {
    totalSales: 0,
    totalRevenue: 0,
    totalMargin: 0,
    avgGPU: 0,
    financingRate: 0,
    objectiveRate: 0,
    membersAtObjective: 0,
    stockRotation: 0,
    trend: "stable",
    period: "2024-02"
  }
}

// ============================================
// P&L SIMPLIFIÉ
// ============================================

export interface PLLine {
  label: string
  category: "revenue" | "cost" | "margin" | "result"
  actual: number
  budget: number
  variance: number
  variancePercent: number
}

export const plData: PLLine[] = [
  // Revenus
  { label: "CA Véhicules Neufs", category: "revenue", actual: 1800000, budget: 1700000, variance: 100000, variancePercent: 5.9 },
  { label: "CA Véhicules Occasion", category: "revenue", actual: 960000, budget: 1000000, variance: -40000, variancePercent: -4.0 },
  { label: "CA Véhicules Utilitaires", category: "revenue", actual: 720000, budget: 650000, variance: 70000, variancePercent: 10.8 },
  { label: "CA Après-Vente", category: "revenue", actual: 370000, budget: 350000, variance: 20000, variancePercent: 5.7 },
  { label: "Total Revenus", category: "revenue", actual: 3850000, budget: 3700000, variance: 150000, variancePercent: 4.1 },

  // Marges
  { label: "Marge VN", category: "margin", actual: 67500, budget: 68000, variance: -500, variancePercent: -0.7 },
  { label: "Marge VO", category: "margin", actual: 48000, budget: 50000, variance: -2000, variancePercent: -4.0 },
  { label: "Marge VU", category: "margin", actual: 36000, budget: 32500, variance: 3500, variancePercent: 10.8 },
  { label: "Marge APV", category: "margin", actual: 33300, budget: 31500, variance: 1800, variancePercent: 5.7 },
  { label: "Total Marges", category: "margin", actual: 184800, budget: 182000, variance: 2800, variancePercent: 1.5 },

  // Coûts
  { label: "Frais de personnel", category: "cost", actual: -45000, budget: -46000, variance: 1000, variancePercent: 2.2 },
  { label: "Loyers et charges", category: "cost", actual: -12000, budget: -12000, variance: 0, variancePercent: 0 },
  { label: "Marketing", category: "cost", actual: -3500, budget: -4000, variance: 500, variancePercent: 12.5 },
  { label: "Autres charges", category: "cost", actual: -5300, budget: -5000, variance: -300, variancePercent: -6.0 },

  // Résultat
  { label: "Résultat Net", category: "result", actual: 119000, budget: 115000, variance: 4000, variancePercent: 3.5 }
]

// ============================================
// HISTORIQUE DE PERFORMANCE CONCESSION
// ============================================

export interface ConcessionPerformanceHistory {
  period: string
  label: string
  totalSales: number
  target: number
  revenue: number
  margin: number
  satisfaction: number
}

export const concessionPerformanceHistory: ConcessionPerformanceHistory[] = [
  { period: "2024-02", label: "Fév", totalSales: 95, target: 120, revenue: 3850000, margin: 185000, satisfaction: 87 },
  { period: "2024-01", label: "Jan", totalSales: 110, target: 115, revenue: 4200000, margin: 210000, satisfaction: 85 },
  { period: "2023-12", label: "Déc", totalSales: 145, target: 140, revenue: 5800000, margin: 290000, satisfaction: 89 },
  { period: "2023-11", label: "Nov", totalSales: 98, target: 110, revenue: 3920000, margin: 196000, satisfaction: 84 },
  { period: "2023-10", label: "Oct", totalSales: 105, target: 110, revenue: 4200000, margin: 210000, satisfaction: 86 },
  { period: "2023-09", label: "Sep", totalSales: 102, target: 110, revenue: 4080000, margin: 204000, satisfaction: 85 }
]

// ============================================
// ALERTES POUR LE DIRECTEUR
// ============================================

export const directionAlerts: Alert[] = [
  {
    id: "dir-alert-1",
    type: "objective_at_risk",
    severity: "warning",
    title: "Objectif constructeur en danger",
    message: "La concession est à 79% de l'objectif mensuel. 25 ventes supplémentaires nécessaires.",
    data: { currentSales: 95, target: 120, daysRemaining: 9, needed: 25 },
    isRead: false,
    createdAt: "2024-02-20T07:00:00Z"
  },
  {
    id: "dir-alert-2",
    type: "stock_aging",
    severity: "warning",
    title: "Stock vieillissant",
    message: "12 véhicules VO sont en stock depuis plus de 60 jours",
    data: { count: 12, threshold: 60 },
    isRead: false,
    createdAt: "2024-02-19T14:00:00Z"
  },
  {
    id: "dir-alert-3",
    type: "low_financing",
    severity: "info",
    title: "Taux financement VO",
    message: "Le taux de financement VO est à 65% (cible: 70%)",
    data: { team: "VO", rate: 65, target: 70 },
    isRead: true,
    createdAt: "2024-02-18T10:00:00Z"
  },
  {
    id: "dir-alert-4",
    type: "high_performance",
    severity: "info",
    title: "Équipe VU performante",
    message: "L'équipe VU est à 90% de l'objectif avec 9 jours restants",
    targetUserId: "chef-ventes-3",
    targetUserName: "Julie Petit",
    data: { team: "VU", rate: 90 },
    isRead: true,
    createdAt: "2024-02-17T16:00:00Z"
  }
]

// ============================================
// CHALLENGES INTER-ÉQUIPES
// ============================================

export const interTeamChallenges: HierarchyChallenge[] = [
  {
    id: "inter-challenge-1",
    title: "Course à l'objectif",
    description: "Première équipe à atteindre 100% de son objectif mensuel",
    createdBy: CURRENT_DIR_CONCESSION_ID,
    creatorRole: "dir_concession",
    creatorLevel: 3,
    scope: {
      type: "team",
      targetLevel: 2,
      targetIds: chefsVentes.map(cv => cv.id)
    },
    type: "sales_count",
    target: 100,
    targetUnit: "%",
    startDate: "2024-02-01",
    endDate: "2024-02-29",
    reward: {
      type: "bonus",
      value: 1000,
      description: "1000€ de prime pour l'équipe gagnante"
    },
    status: "active",
    participants: chefsVentes.map(cv => ({
      id: cv.id,
      name: `Équipe ${cv.teamType}`,
      avatar: cv.avatar,
      currentScore: cv.kpis.objectiveRate,
      targetScore: 100,
      progressRate: cv.kpis.objectiveRate,
      isCompleted: cv.kpis.objectiveRate >= 100,
      ranking: cv.kpis.teamRanking
    })),
    createdAt: "2024-02-01T09:00:00Z"
  },
  {
    id: "inter-challenge-2",
    title: "Défi Financement",
    description: "Toutes les équipes à plus de 75% de taux de financement",
    createdBy: CURRENT_DIR_CONCESSION_ID,
    creatorRole: "dir_concession",
    creatorLevel: 3,
    scope: {
      type: "team",
      targetLevel: 2,
      targetIds: chefsVentes.map(cv => cv.id)
    },
    type: "financing_rate",
    target: 75,
    targetUnit: "%",
    startDate: "2024-02-01",
    endDate: "2024-02-29",
    reward: {
      type: "points",
      value: 500,
      description: "500 points par équipe atteignant l'objectif"
    },
    status: "active",
    participants: chefsVentes.map(cv => ({
      id: cv.id,
      name: `Équipe ${cv.teamType}`,
      avatar: cv.avatar,
      currentScore: cv.kpis.teamFinancingRate,
      targetScore: 75,
      progressRate: (cv.kpis.teamFinancingRate / 75) * 100,
      isCompleted: cv.kpis.teamFinancingRate >= 75,
      ranking: 0
    })),
    createdAt: "2024-02-01T09:00:00Z"
  }
]

// ============================================
// VENTES EN ATTENTE D'APPROBATION
// ============================================

export interface PendingSale {
  id: string
  vehicleType: "VN" | "VO" | "VU"
  vehicleName: string
  clientName: string
  commercialId: string
  commercialName: string
  teamType: TeamType
  salePrice: number
  margin: number
  hasFinancing: boolean
  submittedAt: string
  status: "pending" | "approved" | "rejected"
}

export const pendingSales: PendingSale[] = [
  {
    id: "sale-1",
    vehicleType: "VN",
    vehicleName: "Ford Puma ST-Line",
    clientName: "M. Jean Martin",
    commercialId: "user-2",
    commercialName: "Marie Martin",
    teamType: "VN",
    salePrice: 32500,
    margin: 1850,
    hasFinancing: true,
    submittedAt: "2024-02-20T10:30:00Z",
    status: "pending"
  },
  {
    id: "sale-2",
    vehicleType: "VO",
    vehicleName: "Ford Focus 2021",
    clientName: "Mme Sophie Durand",
    commercialId: "user-10",
    commercialName: "Thomas Bernard",
    teamType: "VO",
    salePrice: 18900,
    margin: 1200,
    hasFinancing: false,
    submittedAt: "2024-02-20T09:15:00Z",
    status: "pending"
  },
  {
    id: "sale-3",
    vehicleType: "VU",
    vehicleName: "Ford Transit Custom",
    clientName: "SARL Transports Dupont",
    commercialId: "user-15",
    commercialName: "Laurent Morel",
    teamType: "VU",
    salePrice: 42000,
    margin: 2800,
    hasFinancing: true,
    submittedAt: "2024-02-19T16:45:00Z",
    status: "pending"
  }
]

// ============================================
// STOCK INFORMATION
// ============================================

export interface StockInfo {
  teamType: TeamType
  totalVehicles: number
  under30Days: number
  between30And60Days: number
  over60Days: number
  avgDaysInStock: number
  totalValue: number
}

export const stockInfo: StockInfo[] = [
  {
    teamType: "VN",
    totalVehicles: 45,
    under30Days: 32,
    between30And60Days: 10,
    over60Days: 3,
    avgDaysInStock: 28,
    totalValue: 1350000
  },
  {
    teamType: "VO",
    totalVehicles: 38,
    under30Days: 18,
    between30And60Days: 8,
    over60Days: 12,
    avgDaysInStock: 35,
    totalValue: 570000
  },
  {
    teamType: "VU",
    totalVehicles: 15,
    under30Days: 12,
    between30And60Days: 2,
    over60Days: 1,
    avgDaysInStock: 22,
    totalValue: 450000
  }
]

// ============================================
// HELPERS
// ============================================

export function getChefVentesById(id: string): ChefVentesInfo | undefined {
  return chefsVentes.find(cv => cv.id === id)
}

export function getChefVentesByTeamType(type: TeamType): ChefVentesInfo | undefined {
  return chefsVentes.find(cv => cv.teamType === type)
}

export function getTotalConcessionSales(): number {
  return chefsVentes.reduce((sum, cv) => sum + cv.kpis.teamSales, 0)
}

export function getTotalConcessionTarget(): number {
  return chefsVentes.reduce((sum, cv) => sum + cv.kpis.teamSalesTarget, 0)
}

export function getConcessionObjectiveRate(): number {
  const sales = getTotalConcessionSales()
  const target = getTotalConcessionTarget()
  return Math.round((sales / target) * 100)
}

export function getUnreadDirectionAlerts(): Alert[] {
  return directionAlerts.filter(a => !a.isRead)
}

export function getPendingSalesCount(): number {
  return pendingSales.filter(s => s.status === "pending").length
}

export function getTotalStockOver60Days(): number {
  return stockInfo.reduce((sum, s) => sum + s.over60Days, 0)
}
