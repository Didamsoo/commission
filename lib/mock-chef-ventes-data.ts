// Mock data pour le rôle Chef des Ventes (N2)

import {
  HierarchyUser,
  TeamStats,
  ChefVentesKPIs,
  CommercialKPIs,
  Alert,
  CoachingNote,
  HierarchyChallenge
} from "@/types/hierarchy"

// ============================================
// CHEF DES VENTES ACTUEL (utilisateur connecté)
// ============================================

export const CURRENT_CHEF_VENTES_ID = "chef-ventes-1"

export const currentChefVentes: HierarchyUser = {
  id: CURRENT_CHEF_VENTES_ID,
  email: "sophie.martin@ford-paris.fr",
  fullName: "Sophie Martin",
  avatarUrl: "",
  role: "chef_ventes",
  level: 2,
  dealershipId: "dealership-1",
  teamType: "VN",
  managerId: "dir-concession-1",
  stats: {
    totalSales: 45,
    totalRevenue: 1350000,
    totalMargin: 67500,
    totalCommission: 8500,
    totalPoints: 2450,
    currentStreak: 12,
    avgGPU: 1500,
    financingRate: 78,
    conversionRate: 28,
    teamSize: 6,
    teamSales: 45,
    teamMargin: 67500,
    teamObjectiveRate: 75,
    teamRanking: 1
  },
  permissions: {
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
  isActive: true,
  createdAt: "2022-03-15T00:00:00Z",
  lastLoginAt: "2024-02-20T08:30:00Z"
}

// ============================================
// ÉQUIPE DU CHEF DES VENTES
// ============================================

export interface TeamMember {
  id: string
  name: string
  avatar?: string
  email: string
  role: "commercial"
  joinedAt: string
  kpis: CommercialKPIs
  trend: "up" | "down" | "stable"
  alerts: Alert[]
}

export const teamMembers: TeamMember[] = [
  {
    id: "user-2",
    name: "Marie Martin",
    avatar: "",
    email: "marie.martin@ford-paris.fr",
    role: "commercial",
    joinedAt: "2021-06-01",
    kpis: {
      sales: 12,
      salesTarget: 10,
      revenue: 360000,
      margin: 18000,
      gpu: 1500,
      financingRate: 85,
      conversionRate: 32,
      satisfaction: 92,
      accessories: 850,
      streak: 8,
      points: 1850,
      ranking: 1,
      rankingTotal: 6
    },
    trend: "up",
    alerts: []
  },
  {
    id: "user-3",
    name: "Pierre Durand",
    avatar: "",
    email: "pierre.durand@ford-paris.fr",
    role: "commercial",
    joinedAt: "2020-09-15",
    kpis: {
      sales: 11,
      salesTarget: 10,
      revenue: 330000,
      margin: 16500,
      gpu: 1500,
      financingRate: 82,
      conversionRate: 28,
      satisfaction: 88,
      accessories: 720,
      streak: 5,
      points: 1720,
      ranking: 2,
      rankingTotal: 6
    },
    trend: "up",
    alerts: []
  },
  {
    id: "user-1",
    name: "Jean Dupont",
    avatar: "",
    email: "jean.dupont@ford-paris.fr",
    role: "commercial",
    joinedAt: "2019-01-10",
    kpis: {
      sales: 8,
      salesTarget: 10,
      revenue: 240000,
      margin: 12000,
      gpu: 1500,
      financingRate: 75,
      conversionRate: 22,
      satisfaction: 85,
      accessories: 580,
      streak: 5,
      points: 1450,
      ranking: 3,
      rankingTotal: 6
    },
    trend: "down",
    alerts: [
      {
        id: "alert-1",
        type: "low_performance",
        severity: "warning",
        title: "Objectif non atteint",
        message: "Jean est à 80% de son objectif avec 5 jours restants",
        targetUserId: "user-1",
        targetUserName: "Jean Dupont",
        data: { currentSales: 8, target: 10, daysRemaining: 5 },
        isRead: false,
        createdAt: "2024-02-20T10:00:00Z"
      }
    ]
  },
  {
    id: "user-4",
    name: "Sophie Bernard",
    avatar: "",
    email: "sophie.bernard@ford-paris.fr",
    role: "commercial",
    joinedAt: "2022-03-20",
    kpis: {
      sales: 7,
      salesTarget: 8,
      revenue: 210000,
      margin: 10500,
      gpu: 1500,
      financingRate: 71,
      conversionRate: 25,
      satisfaction: 90,
      accessories: 650,
      streak: 3,
      points: 1280,
      ranking: 4,
      rankingTotal: 6
    },
    trend: "up",
    alerts: []
  },
  {
    id: "user-5",
    name: "Lucas Petit",
    avatar: "",
    email: "lucas.petit@ford-paris.fr",
    role: "commercial",
    joinedAt: "2023-09-01",
    kpis: {
      sales: 5,
      salesTarget: 8,
      revenue: 150000,
      margin: 7500,
      gpu: 1500,
      financingRate: 60,
      conversionRate: 18,
      satisfaction: 82,
      accessories: 420,
      streak: 2,
      points: 1150,
      ranking: 5,
      rankingTotal: 6
    },
    trend: "down",
    alerts: [
      {
        id: "alert-2",
        type: "low_performance",
        severity: "critical",
        title: "Performance critique",
        message: "Lucas n'a que 5 ventes sur un objectif de 8 (62.5%)",
        targetUserId: "user-5",
        targetUserName: "Lucas Petit",
        data: { currentSales: 5, target: 8, rate: 62.5 },
        isRead: false,
        createdAt: "2024-02-19T14:00:00Z"
      },
      {
        id: "alert-3",
        type: "low_financing",
        severity: "warning",
        title: "Taux financement bas",
        message: "Lucas a un taux de financement de 60% (cible: 75%)",
        targetUserId: "user-5",
        targetUserName: "Lucas Petit",
        data: { currentRate: 60, target: 75 },
        isRead: true,
        createdAt: "2024-02-18T09:00:00Z"
      }
    ]
  },
  {
    id: "user-6",
    name: "Emma Leroy",
    avatar: "",
    email: "emma.leroy@ford-paris.fr",
    role: "commercial",
    joinedAt: "2023-11-15",
    kpis: {
      sales: 2,
      salesTarget: 6,
      revenue: 60000,
      margin: 3000,
      gpu: 1500,
      financingRate: 50,
      conversionRate: 12,
      satisfaction: 78,
      accessories: 280,
      streak: 0,
      points: 420,
      ranking: 6,
      rankingTotal: 6
    },
    trend: "down",
    alerts: [
      {
        id: "alert-4",
        type: "low_performance",
        severity: "critical",
        title: "Nouvelle recrue en difficulté",
        message: "Emma (3 mois d'ancienneté) est à 33% de son objectif",
        targetUserId: "user-6",
        targetUserName: "Emma Leroy",
        data: { currentSales: 2, target: 6, rate: 33.3, tenure: 3 },
        isRead: false,
        createdAt: "2024-02-20T08:00:00Z"
      }
    ]
  }
]

// ============================================
// KPIs DU CHEF DES VENTES
// ============================================

export const chefVentesKPIs: ChefVentesKPIs = {
  // KPIs d'équipe
  teamSales: 45,
  teamSalesTarget: 60,
  teamMargin: 67500,
  teamGPU: 1500,
  teamFinancingRate: 78,
  teamConversionRate: 25,
  stockRotation: 28,

  // KPIs managériaux
  membersAtObjective: 3,
  teamSize: 6,
  turnoverRate: 0,

  // KPIs constructeur
  objectiveRate: 75,
  constructorBonusEstimate: 12500,

  // Classement
  teamRanking: 1,
  teamRankingTotal: 3
}

// ============================================
// STATISTIQUES D'ÉQUIPE
// ============================================

export const teamStats: TeamStats = {
  totalSales: 45,
  totalRevenue: 1350000,
  totalMargin: 67500,
  avgGPU: 1500,
  financingRate: 78,
  objectiveRate: 75,
  membersAtObjective: 3,
  stockRotation: 28,
  trend: "up",
  period: "2024-02"
}

// ============================================
// HISTORIQUE DE PERFORMANCE
// ============================================

export interface PerformanceHistory {
  period: string
  label: string
  sales: number
  target: number
  margin: number
  financingRate: number
}

export const performanceHistory: PerformanceHistory[] = [
  { period: "2024-02", label: "Fév", sales: 45, target: 60, margin: 67500, financingRate: 78 },
  { period: "2024-01", label: "Jan", sales: 52, target: 55, margin: 78000, financingRate: 76 },
  { period: "2023-12", label: "Déc", sales: 68, target: 65, margin: 102000, financingRate: 82 },
  { period: "2023-11", label: "Nov", sales: 48, target: 55, margin: 72000, financingRate: 74 },
  { period: "2023-10", label: "Oct", sales: 55, target: 55, margin: 82500, financingRate: 77 },
  { period: "2023-09", label: "Sep", sales: 50, target: 55, margin: 75000, financingRate: 75 }
]

// ============================================
// CHALLENGES ACTIFS DE L'ÉQUIPE
// ============================================

export const teamChallenges: HierarchyChallenge[] = [
  {
    id: "team-challenge-1",
    title: "Sprint de Février",
    description: "Atteignez l'objectif de 60 ventes avant la fin du mois !",
    createdBy: CURRENT_CHEF_VENTES_ID,
    creatorRole: "chef_ventes",
    creatorLevel: 2,
    scope: {
      type: "team",
      targetLevel: 1,
      targetIds: teamMembers.map(m => m.id)
    },
    type: "sales_count",
    target: 60,
    targetUnit: "ventes",
    startDate: "2024-02-01",
    endDate: "2024-02-29",
    reward: {
      type: "bonus",
      value: 500,
      description: "500€ de bonus pour toute l'équipe si objectif atteint"
    },
    status: "active",
    participants: teamMembers.map((m, i) => ({
      id: m.id,
      name: m.name,
      avatar: m.avatar,
      currentScore: m.kpis.sales,
      targetScore: m.kpis.salesTarget,
      progressRate: (m.kpis.sales / m.kpis.salesTarget) * 100,
      isCompleted: m.kpis.sales >= m.kpis.salesTarget,
      ranking: i + 1
    })),
    createdAt: "2024-02-01T09:00:00Z"
  },
  {
    id: "team-challenge-2",
    title: "Challenge Financement",
    description: "Maintenez un taux de financement supérieur à 80% sur le mois",
    createdBy: CURRENT_CHEF_VENTES_ID,
    creatorRole: "chef_ventes",
    creatorLevel: 2,
    scope: {
      type: "individual",
      targetLevel: 1,
      targetIds: teamMembers.map(m => m.id)
    },
    type: "financing_rate",
    target: 80,
    targetUnit: "%",
    startDate: "2024-02-01",
    endDate: "2024-02-29",
    reward: {
      type: "points",
      value: 500,
      description: "500 points bonus pour les commerciaux à 80%+"
    },
    status: "active",
    participants: teamMembers.map((m, i) => ({
      id: m.id,
      name: m.name,
      avatar: m.avatar,
      currentScore: m.kpis.financingRate,
      targetScore: 80,
      progressRate: (m.kpis.financingRate / 80) * 100,
      isCompleted: m.kpis.financingRate >= 80,
      ranking: i + 1
    })),
    createdAt: "2024-02-01T09:00:00Z"
  },
  {
    id: "team-challenge-3",
    title: "Objectif Puma",
    description: "Vendez 10 Ford Puma ce mois pour décrocher le badge 'Expert Puma'",
    createdBy: "dir-concession-1",
    creatorRole: "dir_concession",
    creatorLevel: 3,
    scope: {
      type: "team",
      targetLevel: 2,
      targetIds: [CURRENT_CHEF_VENTES_ID]
    },
    type: "specific_model",
    target: 10,
    targetUnit: "unités",
    targetModelName: "Puma",
    startDate: "2024-02-01",
    endDate: "2024-02-29",
    reward: {
      type: "badge",
      value: 300,
      description: "Badge 'Expert Puma' + 300 points",
      badgeName: "Expert Puma",
      badgeIcon: "car"
    },
    status: "active",
    participants: [
      {
        id: CURRENT_CHEF_VENTES_ID,
        name: "Équipe VN",
        currentScore: 7,
        targetScore: 10,
        progressRate: 70,
        isCompleted: false,
        ranking: 1
      }
    ],
    createdAt: "2024-02-01T09:00:00Z"
  }
]

// ============================================
// ALERTES POUR LE CHEF DES VENTES
// ============================================

export const managerAlerts: Alert[] = [
  {
    id: "manager-alert-1",
    type: "objective_at_risk",
    severity: "warning",
    title: "Objectif mensuel en danger",
    message: "L'équipe est à 75% de l'objectif avec 9 jours restants. 15 ventes supplémentaires nécessaires.",
    data: { currentSales: 45, target: 60, daysRemaining: 9, needed: 15 },
    isRead: false,
    createdAt: "2024-02-20T07:00:00Z"
  },
  {
    id: "manager-alert-2",
    type: "low_performance",
    severity: "critical",
    title: "2 commerciaux en difficulté",
    message: "Lucas Petit (62.5%) et Emma Leroy (33%) sont significativement sous objectif",
    data: { commercials: ["Lucas Petit", "Emma Leroy"] },
    isRead: false,
    createdAt: "2024-02-20T07:00:00Z"
  },
  {
    id: "manager-alert-3",
    type: "high_performance",
    severity: "info",
    title: "Performance exceptionnelle",
    message: "Marie Martin a dépassé son objectif de 20% ! Pensez à la féliciter.",
    targetUserId: "user-2",
    targetUserName: "Marie Martin",
    data: { sales: 12, target: 10, rate: 120 },
    isRead: true,
    createdAt: "2024-02-18T16:00:00Z"
  },
  {
    id: "manager-alert-4",
    type: "challenge_ending",
    severity: "info",
    title: "Challenge 'Sprint de Février' se termine bientôt",
    message: "Il reste 9 jours pour atteindre l'objectif de 60 ventes",
    data: { challengeId: "team-challenge-1", daysRemaining: 9 },
    isRead: true,
    createdAt: "2024-02-20T08:00:00Z"
  }
]

// ============================================
// NOTES DE COACHING
// ============================================

export const coachingNotes: CoachingNote[] = [
  {
    id: "note-1",
    managerId: CURRENT_CHEF_VENTES_ID,
    commercialId: "user-5",
    commercialName: "Lucas Petit",
    type: "action",
    content: "Prévoir une session de formation sur les techniques de closing. Lucas perd trop de prospects en fin de négociation.",
    isPrivate: true,
    createdAt: "2024-02-18T14:30:00Z"
  },
  {
    id: "note-2",
    managerId: CURRENT_CHEF_VENTES_ID,
    commercialId: "user-6",
    commercialName: "Emma Leroy",
    type: "meeting",
    content: "Point hebdomadaire prévu vendredi 23/02. Objectifs : revoir le pitch produit et planifier des accompagnements terrain.",
    isPrivate: false,
    createdAt: "2024-02-19T10:00:00Z"
  },
  {
    id: "note-3",
    managerId: CURRENT_CHEF_VENTES_ID,
    commercialId: "user-2",
    commercialName: "Marie Martin",
    type: "feedback",
    content: "Excellente progression ce mois ! Marie maîtrise parfaitement le financement. À considérer pour le rôle de tutrice des nouveaux.",
    isPrivate: true,
    createdAt: "2024-02-17T16:00:00Z"
  },
  {
    id: "note-4",
    managerId: CURRENT_CHEF_VENTES_ID,
    commercialId: "user-1",
    commercialName: "Jean Dupont",
    type: "objective",
    content: "Objectif : remonter le taux de financement à 80% d'ici fin février. Actions : proposer systématiquement le financement dès le premier RDV.",
    isPrivate: false,
    createdAt: "2024-02-15T11:00:00Z"
  }
]

// ============================================
// AUTRES ÉQUIPES (pour comparaison)
// ============================================

export interface OtherTeam {
  id: string
  type: "VN" | "VO" | "VU"
  managerName: string
  sales: number
  target: number
  objectiveRate: number
  ranking: number
}

export const otherTeams: OtherTeam[] = [
  {
    id: "team-vo",
    type: "VO",
    managerName: "Marc Dubois",
    sales: 28,
    target: 35,
    objectiveRate: 80,
    ranking: 2
  },
  {
    id: "team-vu",
    type: "VU",
    managerName: "Julie Petit",
    sales: 10,
    target: 15,
    objectiveRate: 67,
    ranking: 3
  }
]

// ============================================
// HELPERS
// ============================================

export function getTeamMemberById(id: string): TeamMember | undefined {
  return teamMembers.find(m => m.id === id)
}

export function getTeamMembersAtObjective(): TeamMember[] {
  return teamMembers.filter(m => m.kpis.sales >= m.kpis.salesTarget)
}

export function getTeamMembersBelowObjective(): TeamMember[] {
  return teamMembers.filter(m => m.kpis.sales < m.kpis.salesTarget)
}

export function getTeamMembersWithAlerts(): TeamMember[] {
  return teamMembers.filter(m => m.alerts.length > 0)
}

export function getTotalTeamSales(): number {
  return teamMembers.reduce((sum, m) => sum + m.kpis.sales, 0)
}

export function getTotalTeamTarget(): number {
  return teamMembers.reduce((sum, m) => sum + m.kpis.salesTarget, 0)
}

export function getTeamObjectiveRate(): number {
  const sales = getTotalTeamSales()
  const target = getTotalTeamTarget()
  return Math.round((sales / target) * 100)
}

export function getUnreadAlerts(): Alert[] {
  return managerAlerts.filter(a => !a.isRead)
}

export function getActiveTeamChallenges(): HierarchyChallenge[] {
  return teamChallenges.filter(c => c.status === "active")
}
