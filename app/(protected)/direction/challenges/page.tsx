"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Plus,
  Trophy,
  Calendar,
  Users,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical,
  Edit,
  Trash2,
  Pause,
  Play,
  ChevronRight,
  Search,
  Filter,
  ShoppingCart,
  Euro,
  TrendingUp,
  Percent,
  Car,
  Award,
  Star
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  DirectionChallenge,
  DirectionChallengeStatus,
  DirectionChallengeType,
  CHALLENGE_TYPE_CONFIG,
  REWARD_TYPE_CONFIG,
  formatChallengeTarget,
  formatChallengeDuration
} from "@/types/direction-challenges"

// ============================================
// MOCK DATA
// ============================================
const mockChallenges: DirectionChallenge[] = [
  {
    id: "1",
    title: "Sprint de Février",
    description: "Atteignez 15 ventes avant la fin du mois pour décrocher un bonus exceptionnel !",
    type: "sales_count",
    target: 15,
    targetUnit: "ventes",
    startDate: "2024-02-01",
    endDate: "2024-02-29",
    reward: {
      type: "bonus",
      value: 500,
      description: "Bonus de 500€ ajouté à votre commission mensuelle"
    },
    participantIds: [],
    allParticipants: true,
    status: "active",
    createdBy: "direction",
    createdAt: "2024-01-28",
    participants: [
      { id: "1", name: "Marie Martin", currentScore: 12, isCompleted: false },
      { id: "2", name: "Pierre Durand", currentScore: 11, isCompleted: false },
      { id: "3", name: "Jean Dupont", currentScore: 8, isCompleted: false }
    ],
    topPerformers: []
  },
  {
    id: "2",
    title: "Roi du Financement",
    description: "Maintenez un taux de financement supérieur à 80% sur toutes vos ventes.",
    type: "financing_rate",
    target: 80,
    targetUnit: "%",
    startDate: "2024-02-01",
    endDate: "2024-02-29",
    reward: {
      type: "badge",
      value: 200,
      description: "Badge exclusif affiché sur votre profil",
      badgeName: "Roi du Financement",
      badgeIcon: "crown"
    },
    participantIds: [],
    allParticipants: true,
    status: "active",
    createdBy: "direction",
    createdAt: "2024-01-28",
    participants: [
      { id: "1", name: "Marie Martin", currentScore: 85, isCompleted: true, completedAt: "2024-02-15" },
      { id: "2", name: "Pierre Durand", currentScore: 72, isCompleted: false }
    ],
    topPerformers: []
  },
  {
    id: "3",
    title: "Objectif Puma",
    description: "Vendez 5 Ford Puma ce mois pour obtenir des points bonus !",
    type: "specific_model",
    target: 5,
    targetUnit: "unités",
    targetModelName: "Puma",
    startDate: "2024-02-01",
    endDate: "2024-02-29",
    reward: {
      type: "points",
      value: 1000,
      description: "1000 points bonus pour le classement"
    },
    participantIds: [],
    allParticipants: true,
    status: "active",
    createdBy: "direction",
    createdAt: "2024-01-28",
    participants: [],
    topPerformers: []
  },
  {
    id: "4",
    title: "Challenge Mars - Marge Maximale",
    description: "Générez une marge totale de 5000€ pendant le mois de mars.",
    type: "margin_target",
    target: 5000,
    targetUnit: "€",
    startDate: "2024-03-01",
    endDate: "2024-03-31",
    reward: {
      type: "bonus",
      value: 750,
      description: "Bonus de 750€"
    },
    participantIds: [],
    allParticipants: true,
    status: "upcoming",
    createdBy: "direction",
    createdAt: "2024-02-20",
    participants: [],
    topPerformers: []
  },
  {
    id: "5",
    title: "Rush de Janvier",
    description: "Challenge de ventes du mois de janvier.",
    type: "sales_count",
    target: 12,
    targetUnit: "ventes",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    reward: {
      type: "bonus",
      value: 400,
      description: "Bonus de 400€"
    },
    participantIds: [],
    allParticipants: true,
    status: "completed",
    createdBy: "direction",
    createdAt: "2023-12-28",
    participants: [
      { id: "1", name: "Marie Martin", currentScore: 14, isCompleted: true, completedAt: "2024-01-25" },
      { id: "2", name: "Pierre Durand", currentScore: 12, isCompleted: true, completedAt: "2024-01-30" }
    ],
    topPerformers: [
      { id: "1", name: "Marie Martin", currentScore: 14, isCompleted: true, completedAt: "2024-01-25" }
    ]
  }
]

// ============================================
// ICONS MAPPING
// ============================================
const CHALLENGE_TYPE_ICONS: Record<DirectionChallengeType, React.ElementType> = {
  sales_count: ShoppingCart,
  revenue_target: Euro,
  margin_target: TrendingUp,
  financing_rate: Percent,
  specific_model: Car
}

const STATUS_CONFIG: Record<DirectionChallengeStatus, {
  label: string
  color: string
  bgColor: string
  icon: React.ElementType
}> = {
  draft: { label: "Brouillon", color: "text-gray-600", bgColor: "bg-gray-100", icon: Edit },
  upcoming: { label: "À venir", color: "text-blue-600", bgColor: "bg-blue-100", icon: Clock },
  active: { label: "En cours", color: "text-emerald-600", bgColor: "bg-emerald-100", icon: Play },
  completed: { label: "Terminé", color: "text-purple-600", bgColor: "bg-purple-100", icon: CheckCircle },
  cancelled: { label: "Annulé", color: "text-red-600", bgColor: "bg-red-100", icon: XCircle }
}

// ============================================
// CHALLENGE CARD COMPONENT
// ============================================
function DirectionChallengeCard({ challenge }: { challenge: DirectionChallenge }) {
  const typeConfig = CHALLENGE_TYPE_CONFIG[challenge.type]
  const statusConfig = STATUS_CONFIG[challenge.status]
  const TypeIcon = CHALLENGE_TYPE_ICONS[challenge.type]
  const StatusIcon = statusConfig.icon

  const participantCount = challenge.participants.length || 12 // Mock count
  const completedCount = challenge.participants.filter(p => p.isCompleted).length
  const avgProgress = challenge.status === "active"
    ? Math.round(challenge.participants.reduce((sum, p) => sum + (p.currentScore / challenge.target * 100), 0) / Math.max(participantCount, 1))
    : challenge.status === "completed" ? 100 : 0

  return (
    <Card className="border-0 shadow-premium hover:shadow-premium-lg transition-all duration-300 group overflow-hidden">
      <CardContent className="p-0">
        {/* Header gradient */}
        <div className={`p-4 bg-gradient-to-r ${
          challenge.status === "active" ? "from-emerald-500 to-teal-500" :
          challenge.status === "upcoming" ? "from-blue-500 to-indigo-500" :
          challenge.status === "completed" ? "from-purple-500 to-violet-500" :
          "from-gray-400 to-gray-500"
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <TypeIcon className="w-6 h-6 text-white" />
              </div>
              <div className="text-white">
                <h3 className="font-bold text-lg">{challenge.title}</h3>
                <Badge className="bg-white/20 text-white text-xs mt-1">
                  {typeConfig.labelShort}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${statusConfig.bgColor} ${statusConfig.color}`}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {statusConfig.label}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="gap-2">
                    <Edit className="w-4 h-4" />
                    Modifier
                  </DropdownMenuItem>
                  {challenge.status === "active" && (
                    <DropdownMenuItem className="gap-2 text-amber-600">
                      <Pause className="w-4 h-4" />
                      Mettre en pause
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 text-red-600">
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <p className="text-sm text-gray-600 line-clamp-2">{challenge.description}</p>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <Target className="w-4 h-4 mx-auto text-gray-500 mb-1" />
              <p className="text-xs text-gray-500">Objectif</p>
              <p className="font-semibold text-gray-900 text-sm">
                {formatChallengeTarget(challenge.type, challenge.target, challenge.targetModelName)}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <Calendar className="w-4 h-4 mx-auto text-gray-500 mb-1" />
              <p className="text-xs text-gray-500">Durée</p>
              <p className="font-semibold text-gray-900 text-sm">
                {formatChallengeDuration(challenge.startDate, challenge.endDate)}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <Users className="w-4 h-4 mx-auto text-gray-500 mb-1" />
              <p className="text-xs text-gray-500">Participants</p>
              <p className="font-semibold text-gray-900 text-sm">{participantCount}</p>
            </div>
          </div>

          {/* Progress (only for active) */}
          {challenge.status === "active" && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Progression moyenne</span>
                <span className="font-semibold text-gray-900">{avgProgress}%</span>
              </div>
              <Progress value={avgProgress} className="h-2" />
              <p className="text-xs text-gray-500">
                {completedCount} participant{completedCount > 1 ? "s" : ""} ont complété le challenge
              </p>
            </div>
          )}

          {/* Reward */}
          <div className="p-3 bg-amber-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">Récompense</span>
              </div>
              <Badge className="bg-amber-100 text-amber-700">
                {challenge.reward.type === "bonus" && `${challenge.reward.value}€`}
                {challenge.reward.type === "badge" && challenge.reward.badgeName}
                {challenge.reward.type === "points" && `${challenge.reward.value} pts`}
              </Badge>
            </div>
          </div>

          {/* Dates */}
          <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t">
            <span>
              Du {new Date(challenge.startDate).toLocaleDateString("fr-FR")} au{" "}
              {new Date(challenge.endDate).toLocaleDateString("fr-FR")}
            </span>
            <Link href={`/challenges`}>
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                Voir détails
                <ChevronRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================
// STATS CARD
// ============================================
function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color
}: {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ElementType
  color: string
}) {
  return (
    <Card className="border-0 shadow-premium">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
          </div>
          <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================
// MAIN PAGE
// ============================================
export default function DirectionChallengesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<DirectionChallengeStatus | "all">("all")

  // Filter challenges
  const filteredChallenges = mockChallenges.filter((challenge) => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === "all" || challenge.status === activeTab
    return matchesSearch && matchesTab
  })

  // Stats
  const activeChallenges = mockChallenges.filter(c => c.status === "active").length
  const upcomingChallenges = mockChallenges.filter(c => c.status === "upcoming").length
  const completedChallenges = mockChallenges.filter(c => c.status === "completed").length
  const totalParticipants = new Set(mockChallenges.flatMap(c => c.participants.map(p => p.id))).size || 12

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            Gestion des Challenges
          </h1>
          <p className="text-gray-500 mt-1">Créez et gérez les challenges pour votre équipe</p>
        </div>
        <Link href="/direction/challenges/new">
          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg gap-2">
            <Plus className="w-5 h-5" />
            Nouveau challenge
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Challenges actifs"
          value={activeChallenges}
          icon={Play}
          color="bg-gradient-to-br from-emerald-500 to-teal-500"
        />
        <StatCard
          title="À venir"
          value={upcomingChallenges}
          icon={Clock}
          color="bg-gradient-to-br from-blue-500 to-indigo-500"
        />
        <StatCard
          title="Terminés"
          value={completedChallenges}
          icon={CheckCircle}
          color="bg-gradient-to-br from-purple-500 to-violet-500"
        />
        <StatCard
          title="Participants"
          value={totalParticipants}
          subtitle="Commerciaux actifs"
          icon={Users}
          color="bg-gradient-to-br from-amber-500 to-orange-500"
        />
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-premium">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un challenge..."
                className="pl-9"
              />
            </div>
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as typeof activeTab)}
              className="w-full sm:w-auto"
            >
              <TabsList className="bg-gray-100 grid grid-cols-4 sm:flex">
                <TabsTrigger value="all" className="text-xs sm:text-sm">
                  Tous
                </TabsTrigger>
                <TabsTrigger value="active" className="text-xs sm:text-sm gap-1">
                  <span className="hidden sm:inline">En cours</span>
                  <Badge className="bg-emerald-500 text-white text-xs h-5 w-5 p-0 justify-center sm:ml-1">
                    {activeChallenges}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="text-xs sm:text-sm">
                  <span className="hidden sm:inline">À venir</span>
                  <span className="sm:hidden">Futur</span>
                </TabsTrigger>
                <TabsTrigger value="completed" className="text-xs sm:text-sm">
                  <span className="hidden sm:inline">Terminés</span>
                  <span className="sm:hidden">Finis</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Challenges grid */}
      {filteredChallenges.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => (
            <DirectionChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      ) : (
        <Card className="border-0 shadow-premium">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Aucun challenge trouvé</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? "Aucun challenge ne correspond à votre recherche."
                : "Créez votre premier challenge pour motiver votre équipe !"}
            </p>
            <Link href="/direction/challenges/new">
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 gap-2">
                <Plus className="w-4 h-4" />
                Créer un challenge
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
