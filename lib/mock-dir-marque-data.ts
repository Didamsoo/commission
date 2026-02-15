// Mock data pour le rôle Directeur de Marque (N4)
// Gère plusieurs concessions d'une même marque dans une région

import { HierarchyUser } from "@/types/hierarchy"

// ============================================
// DIRECTEUR DE MARQUE ACTUEL (utilisateur connecté)
// ============================================

export const CURRENT_DIR_MARQUE_ID = "dir-marque-1"

export const currentDirMarque: HierarchyUser = {
  id: CURRENT_DIR_MARQUE_ID,
  email: "jean.legrand@ford-idf.fr",
  fullName: "Jean Legrand",
  avatarUrl: "",
  role: "dir_marque",
  level: 4,
  brandId: "brand-ford",
  managerId: "dir-plaque-1",
  stats: {
    totalSales: 287,
    totalRevenue: 8610000,
    totalMargin: 430500,
    totalCommission: 0,
    totalPoints: 0,
    currentStreak: 0,
    avgGPU: 1500,
    financingRate: 76,
    conversionRate: 0,
    teamSize: 6, // 6 concessions
    teamSales: 287,
    teamMargin: 430500,
    teamObjectiveRate: 95.7,
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
    canViewMultiBrands: false,
    canExportReports: true,
    canManageStock: true
  },
  isActive: true,
  createdAt: "2018-06-01T00:00:00Z",
  lastLoginAt: "2024-02-20T07:45:00Z"
}

// ============================================
// CONCESSIONS DE LA MARQUE
// ============================================

export interface DealershipData {
  id: string
  name: string
  code: string
  location: string
  address: string
  directorId: string
  directorName: string
  directorAvatar?: string
  coordinates: { lat: number; lng: number }
  stats: {
    totalSales: number
    salesTarget: number
    objectiveRate: number
    totalMargin: number
    avgGPU: number
    financingRate: number
    satisfaction: number
    stockDays: number
  }
  departments: {
    vn: { sales: number; target: number; margin: number }
    vo: { sales: number; target: number; margin: number }
    vu: { sales: number; target: number; margin: number }
  }
  trend: "up" | "down" | "stable"
  alerts: Array<{
    type: "warning" | "critical" | "info"
    message: string
  }>
}

export const dealerships: DealershipData[] = [
  {
    id: "dealership-paris-est",
    name: "Ford Paris Est",
    code: "FPE-001",
    location: "Paris Est",
    address: "125 Avenue de la République, 75011 Paris",
    directorId: "dir-concession-1",
    directorName: "Marie Dubois",
    coordinates: { lat: 48.8634, lng: 2.3815 },
    stats: {
      totalSales: 58,
      salesTarget: 52,
      objectiveRate: 112,
      totalMargin: 87000,
      avgGPU: 1500,
      financingRate: 82,
      satisfaction: 89,
      stockDays: 35
    },
    departments: {
      vn: { sales: 32, target: 28, margin: 48000 },
      vo: { sales: 18, target: 16, margin: 27000 },
      vu: { sales: 8, target: 8, margin: 12000 }
    },
    trend: "up",
    alerts: []
  },
  {
    id: "dealership-paris-ouest",
    name: "Ford Paris Ouest",
    code: "FPO-002",
    location: "Paris Ouest",
    address: "45 Boulevard Exelmans, 75016 Paris",
    directorId: "dir-concession-2",
    directorName: "Pierre Martin",
    coordinates: { lat: 48.8424, lng: 2.2635 },
    stats: {
      totalSales: 49,
      salesTarget: 50,
      objectiveRate: 98,
      totalMargin: 71050,
      avgGPU: 1450,
      financingRate: 75,
      satisfaction: 86,
      stockDays: 42
    },
    departments: {
      vn: { sales: 26, target: 28, margin: 37700 },
      vo: { sales: 16, target: 15, margin: 23200 },
      vu: { sales: 7, target: 7, margin: 10150 }
    },
    trend: "stable",
    alerts: [
      { type: "warning", message: "Stock VN > 40 jours" }
    ]
  },
  {
    id: "dealership-versailles",
    name: "Ford Versailles",
    code: "FVS-003",
    location: "Versailles",
    address: "8 Rue des Chantiers, 78000 Versailles",
    directorId: "dir-concession-3",
    directorName: "Sophie Bernard",
    coordinates: { lat: 48.8014, lng: 2.1301 },
    stats: {
      totalSales: 52,
      salesTarget: 50,
      objectiveRate: 104,
      totalMargin: 78000,
      avgGPU: 1500,
      financingRate: 78,
      satisfaction: 91,
      stockDays: 38
    },
    departments: {
      vn: { sales: 28, target: 26, margin: 42000 },
      vo: { sales: 17, target: 17, margin: 25500 },
      vu: { sales: 7, target: 7, margin: 10500 }
    },
    trend: "up",
    alerts: []
  },
  {
    id: "dealership-creteil",
    name: "Ford Créteil",
    code: "FCR-004",
    location: "Créteil",
    address: "Centre Commercial Créteil Soleil, 94000 Créteil",
    directorId: "dir-concession-4",
    directorName: "Lucas Petit",
    coordinates: { lat: 48.7905, lng: 2.4595 },
    stats: {
      totalSales: 40,
      salesTarget: 45,
      objectiveRate: 89,
      totalMargin: 56000,
      avgGPU: 1400,
      financingRate: 68,
      satisfaction: 82,
      stockDays: 52
    },
    departments: {
      vn: { sales: 20, target: 24, margin: 28000 },
      vo: { sales: 14, target: 15, margin: 19600 },
      vu: { sales: 6, target: 6, margin: 8400 }
    },
    trend: "down",
    alerts: [
      { type: "critical", message: "Objectif VN à risque" },
      { type: "warning", message: "Taux financement bas (68%)" },
      { type: "warning", message: "Stock > 50 jours" }
    ]
  },
  {
    id: "dealership-saint-denis",
    name: "Ford Saint-Denis",
    code: "FSD-005",
    location: "Saint-Denis",
    address: "52 Boulevard Marcel Sembat, 93200 Saint-Denis",
    directorId: "dir-concession-5",
    directorName: "Emma Leroy",
    coordinates: { lat: 48.9362, lng: 2.3574 },
    stats: {
      totalSales: 45,
      salesTarget: 48,
      objectiveRate: 94,
      totalMargin: 63000,
      avgGPU: 1400,
      financingRate: 72,
      satisfaction: 84,
      stockDays: 44
    },
    departments: {
      vn: { sales: 24, target: 26, margin: 33600 },
      vo: { sales: 15, target: 15, margin: 21000 },
      vu: { sales: 6, target: 7, margin: 8400 }
    },
    trend: "stable",
    alerts: [
      { type: "info", message: "Nouveau directeur depuis 3 mois" }
    ]
  },
  {
    id: "dealership-evry",
    name: "Ford Évry",
    code: "FEV-006",
    location: "Évry",
    address: "15 Avenue du Lac, 91000 Évry",
    directorId: "dir-concession-6",
    directorName: "Thomas Garcia",
    coordinates: { lat: 48.6249, lng: 2.4295 },
    stats: {
      totalSales: 43,
      salesTarget: 42,
      objectiveRate: 102,
      totalMargin: 64500,
      avgGPU: 1500,
      financingRate: 80,
      satisfaction: 88,
      stockDays: 36
    },
    departments: {
      vn: { sales: 22, target: 22, margin: 33000 },
      vo: { sales: 15, target: 14, margin: 22500 },
      vu: { sales: 6, target: 6, margin: 9000 }
    },
    trend: "up",
    alerts: []
  }
]

// ============================================
// KPIs CONSOLIDÉS MARQUE
// ============================================

export interface BrandKPIs {
  volume: {
    current: number
    target: number
    objectiveRate: number
    trend: number // vs mois précédent
  }
  margin: {
    total: number
    target: number
    avgGPU: number
    trend: number
  }
  financing: {
    rate: number
    target: number
    trend: number
  }
  satisfaction: {
    nps: number
    target: number
    trend: number
  }
  stock: {
    avgDays: number
    target: number
    totalUnits: number
  }
  constructorBonus: {
    estimated: number
    volumeAchieved: boolean
    financingAchieved: boolean
    satisfactionAchieved: boolean
  }
}

export const brandKPIs: BrandKPIs = {
  volume: {
    current: 287,
    target: 300,
    objectiveRate: 95.7,
    trend: 8
  },
  margin: {
    total: 430500,
    target: 450000,
    avgGPU: 1500,
    trend: 5
  },
  financing: {
    rate: 76,
    target: 75,
    trend: 2
  },
  satisfaction: {
    nps: 86,
    target: 85,
    trend: 1
  },
  stock: {
    avgDays: 41,
    target: 45,
    totalUnits: 485
  },
  constructorBonus: {
    estimated: 125000,
    volumeAchieved: false,
    financingAchieved: true,
    satisfactionAchieved: true
  }
}

// ============================================
// CHALLENGES INTER-CONCESSIONS
// ============================================

export interface BrandChallenge {
  id: string
  title: string
  description: string
  type: "volume" | "margin" | "financing" | "satisfaction" | "electric"
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
    dealershipId: string
    dealershipName: string
    currentValue: number
    progressRate: number
    isCompleted: boolean
  }>
  status: "active" | "completed" | "upcoming"
}

export const brandChallenges: BrandChallenge[] = [
  {
    id: "bc-1",
    title: "Course au 100%",
    description: "Première concession à atteindre 100% de l'objectif mensuel",
    type: "volume",
    targetValue: 100,
    targetUnit: "%",
    startDate: "2024-02-01",
    endDate: "2024-02-29",
    reward: {
      type: "bonus",
      value: "5000€",
      description: "Bonus équipe direction"
    },
    participants: [
      { dealershipId: "dealership-paris-est", dealershipName: "Ford Paris Est", currentValue: 112, progressRate: 112, isCompleted: true },
      { dealershipId: "dealership-versailles", dealershipName: "Ford Versailles", currentValue: 104, progressRate: 104, isCompleted: true },
      { dealershipId: "dealership-evry", dealershipName: "Ford Évry", currentValue: 102, progressRate: 102, isCompleted: true },
      { dealershipId: "dealership-paris-ouest", dealershipName: "Ford Paris Ouest", currentValue: 98, progressRate: 98, isCompleted: false },
      { dealershipId: "dealership-saint-denis", dealershipName: "Ford Saint-Denis", currentValue: 94, progressRate: 94, isCompleted: false },
      { dealershipId: "dealership-creteil", dealershipName: "Ford Créteil", currentValue: 89, progressRate: 89, isCompleted: false }
    ],
    status: "active"
  },
  {
    id: "bc-2",
    title: "Électrique First",
    description: "Atteindre 20% de ventes de véhicules électriques",
    type: "electric",
    targetValue: 20,
    targetUnit: "%",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    reward: {
      type: "trophy",
      value: "Trophée Green",
      description: "Concession la plus verte du trimestre"
    },
    participants: [
      { dealershipId: "dealership-paris-est", dealershipName: "Ford Paris Est", currentValue: 22, progressRate: 110, isCompleted: true },
      { dealershipId: "dealership-paris-ouest", dealershipName: "Ford Paris Ouest", currentValue: 19, progressRate: 95, isCompleted: false },
      { dealershipId: "dealership-versailles", dealershipName: "Ford Versailles", currentValue: 18, progressRate: 90, isCompleted: false },
      { dealershipId: "dealership-evry", dealershipName: "Ford Évry", currentValue: 17, progressRate: 85, isCompleted: false },
      { dealershipId: "dealership-saint-denis", dealershipName: "Ford Saint-Denis", currentValue: 15, progressRate: 75, isCompleted: false },
      { dealershipId: "dealership-creteil", dealershipName: "Ford Créteil", currentValue: 12, progressRate: 60, isCompleted: false }
    ],
    status: "active"
  },
  {
    id: "bc-3",
    title: "Excellence Client",
    description: "Maintenir un NPS supérieur à 90",
    type: "satisfaction",
    targetValue: 90,
    targetUnit: "NPS",
    startDate: "2024-02-01",
    endDate: "2024-02-29",
    reward: {
      type: "recognition",
      value: "Star Service",
      description: "Badge Excellence Satisfaction"
    },
    participants: [
      { dealershipId: "dealership-versailles", dealershipName: "Ford Versailles", currentValue: 91, progressRate: 101, isCompleted: true },
      { dealershipId: "dealership-paris-est", dealershipName: "Ford Paris Est", currentValue: 89, progressRate: 99, isCompleted: false },
      { dealershipId: "dealership-evry", dealershipName: "Ford Évry", currentValue: 88, progressRate: 98, isCompleted: false },
      { dealershipId: "dealership-paris-ouest", dealershipName: "Ford Paris Ouest", currentValue: 86, progressRate: 96, isCompleted: false },
      { dealershipId: "dealership-saint-denis", dealershipName: "Ford Saint-Denis", currentValue: 84, progressRate: 93, isCompleted: false },
      { dealershipId: "dealership-creteil", dealershipName: "Ford Créteil", currentValue: 82, progressRate: 91, isCompleted: false }
    ],
    status: "active"
  }
]

// ============================================
// OBJECTIFS CONSTRUCTEUR
// ============================================

export interface ConstructorTarget {
  category: string
  description: string
  target: number
  current: number
  unit: string
  weight: number // Poids dans le calcul de la prime
  status: "achieved" | "on_track" | "at_risk" | "missed"
  bonus: number // Prime si atteint
}

export const constructorTargets: ConstructorTarget[] = [
  {
    category: "Volume",
    description: "Objectif de ventes mensuelles",
    target: 300,
    current: 287,
    unit: "véhicules",
    weight: 40,
    status: "on_track",
    bonus: 50000
  },
  {
    category: "Financement",
    description: "Taux de pénétration financement",
    target: 75,
    current: 76,
    unit: "%",
    weight: 25,
    status: "achieved",
    bonus: 31250
  },
  {
    category: "Satisfaction",
    description: "Score NPS clients",
    target: 85,
    current: 86,
    unit: "NPS",
    weight: 20,
    status: "achieved",
    bonus: 25000
  },
  {
    category: "Électrique",
    description: "Part de véhicules électriques",
    target: 15,
    current: 17,
    unit: "%",
    weight: 10,
    status: "achieved",
    bonus: 12500
  },
  {
    category: "Formation",
    description: "Commerciaux certifiés",
    target: 100,
    current: 95,
    unit: "%",
    weight: 5,
    status: "on_track",
    bonus: 6250
  }
]

// ============================================
// TRANSFERTS DE STOCK
// ============================================

export interface StockTransfer {
  id: string
  vehicleModel: string
  vehicleVin: string
  fromDealership: string
  fromDealershipName: string
  toDealership: string
  toDealershipName: string
  requestedBy: string
  requestedAt: string
  status: "pending" | "approved" | "in_transit" | "completed" | "rejected"
  reason: string
}

export const stockTransfers: StockTransfer[] = [
  {
    id: "st-1",
    vehicleModel: "Ford Puma ST-Line",
    vehicleVin: "WF0XXXGCDXLA12345",
    fromDealership: "dealership-creteil",
    fromDealershipName: "Ford Créteil",
    toDealership: "dealership-paris-est",
    toDealershipName: "Ford Paris Est",
    requestedBy: "Marie Dubois",
    requestedAt: "2024-02-19T14:30:00Z",
    status: "pending",
    reason: "Client en attente à Paris Est, stock disponible à Créteil"
  },
  {
    id: "st-2",
    vehicleModel: "Ford Mustang Mach-E",
    vehicleVin: "3FMTK3SU1NMA98765",
    fromDealership: "dealership-versailles",
    fromDealershipName: "Ford Versailles",
    toDealership: "dealership-saint-denis",
    toDealershipName: "Ford Saint-Denis",
    requestedBy: "Emma Leroy",
    requestedAt: "2024-02-18T09:15:00Z",
    status: "in_transit",
    reason: "Demande client urgent"
  },
  {
    id: "st-3",
    vehicleModel: "Ford Kuga PHEV",
    vehicleVin: "WF0XXXGCDXLA67890",
    fromDealership: "dealership-paris-ouest",
    fromDealershipName: "Ford Paris Ouest",
    toDealership: "dealership-evry",
    toDealershipName: "Ford Évry",
    requestedBy: "Thomas Garcia",
    requestedAt: "2024-02-17T11:00:00Z",
    status: "completed",
    reason: "Rééquilibrage stock"
  }
]

// ============================================
// ALERTES RÉSEAU
// ============================================

export interface NetworkAlert {
  id: string
  type: "critical" | "warning" | "info" | "success"
  title: string
  message: string
  dealershipId?: string
  dealershipName?: string
  createdAt: string
  isRead: boolean
  actionUrl?: string
  actionLabel?: string
}

export const networkAlerts: NetworkAlert[] = [
  {
    id: "na-1",
    type: "critical",
    title: "Objectif VN à risque",
    message: "Ford Créteil est à 83% de l'objectif VN avec 5 jours restants",
    dealershipId: "dealership-creteil",
    dealershipName: "Ford Créteil",
    createdAt: "2024-02-20T08:00:00Z",
    isRead: false,
    actionUrl: "/marque/concessions/dealership-creteil",
    actionLabel: "Voir détails"
  },
  {
    id: "na-2",
    type: "warning",
    title: "Stock élevé",
    message: "3 concessions ont un stock moyen > 40 jours",
    createdAt: "2024-02-20T07:30:00Z",
    isRead: false,
    actionUrl: "/marque/stocks",
    actionLabel: "Gérer stocks"
  },
  {
    id: "na-3",
    type: "success",
    title: "Objectif atteint",
    message: "Ford Paris Est a dépassé son objectif mensuel (+12%)",
    dealershipId: "dealership-paris-est",
    dealershipName: "Ford Paris Est",
    createdAt: "2024-02-19T16:45:00Z",
    isRead: true
  },
  {
    id: "na-4",
    type: "info",
    title: "Nouveau challenge",
    message: "Le challenge 'Sprint Mars' débutera le 1er mars",
    createdAt: "2024-02-19T10:00:00Z",
    isRead: true
  },
  {
    id: "na-5",
    type: "warning",
    title: "Taux financement bas",
    message: "Ford Créteil: taux de financement à 68% (cible: 75%)",
    dealershipId: "dealership-creteil",
    dealershipName: "Ford Créteil",
    createdAt: "2024-02-18T14:20:00Z",
    isRead: true
  }
]

// ============================================
// HISTORIQUE PERFORMANCE
// ============================================

export interface PerformanceHistory {
  month: string
  volume: number
  volumeTarget: number
  margin: number
  financingRate: number
  satisfaction: number
}

export const performanceHistory: PerformanceHistory[] = [
  { month: "Sep 2023", volume: 265, volumeTarget: 280, margin: 397500, financingRate: 72, satisfaction: 83 },
  { month: "Oct 2023", volume: 278, volumeTarget: 290, margin: 417000, financingRate: 74, satisfaction: 84 },
  { month: "Nov 2023", volume: 290, volumeTarget: 295, margin: 435000, financingRate: 75, satisfaction: 85 },
  { month: "Déc 2023", volume: 312, volumeTarget: 310, margin: 468000, financingRate: 77, satisfaction: 86 },
  { month: "Jan 2024", volume: 275, volumeTarget: 290, margin: 412500, financingRate: 74, satisfaction: 85 },
  { month: "Fév 2024", volume: 287, volumeTarget: 300, margin: 430500, financingRate: 76, satisfaction: 86 }
]

// ============================================
// HELPERS
// ============================================

export function getDealershipById(id: string): DealershipData | undefined {
  return dealerships.find(d => d.id === id)
}

export function getDealershipRanking(): DealershipData[] {
  return [...dealerships].sort((a, b) => b.stats.objectiveRate - a.stats.objectiveRate)
}

export function getTopPerformers(count: number = 3): DealershipData[] {
  return getDealershipRanking().slice(0, count)
}

export function getBottomPerformers(count: number = 3): DealershipData[] {
  return getDealershipRanking().slice(-count).reverse()
}

export function getUnreadAlerts(): NetworkAlert[] {
  return networkAlerts.filter(a => !a.isRead)
}

export function getCriticalAlerts(): NetworkAlert[] {
  return networkAlerts.filter(a => a.type === "critical")
}
