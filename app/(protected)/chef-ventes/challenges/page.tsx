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
  ShoppingCart,
  Euro,
  TrendingUp,
  Percent,
  Car,
  Award,
  Star
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  formatChallengeTarget,
  formatChallengeDuration
} from "@/types/direction-challenges"

// ============================================
// MOCK DATA
// ============================================
const mockChallenges: DirectionChallenge[] = [
  {
    id: "cv-1",
    title: "Sprint Ventes Semaine 8",
    description: "Objectif : 4 ventes minimum cette semaine pour toute l'equipe VN.",
    type: "sales_count",
    target: 4,
    targetUnit: "ventes",
    startDate: "2024-02-19",
    endDate: "2024-02-25",
    reward: { type: "bonus", value: 200, description: "Bonus de 200€ par commercial ayant atteint l'objectif" },
    participantIds: [],
    allParticipants: true,
    status: "active",
    createdBy: "chef_ventes",
    createdAt: "2024-02-18",
    participants: [
      { id: "1", name: "Marie Martin", currentScore: 3, isCompleted: false },
      { id: "2", name: "Pierre Durand", currentScore: 4, isCompleted: true, completedAt: "2024-02-22" },
      { id: "3", name: "Jean Dupont", currentScore: 2, isCompleted: false }
    ],
    topPerformers: []
  },
  {
    id: "cv-2",
    title: "Defi Financement Fevrier",
    description: "Maintenir un taux de financement superieur a 75% sur le mois.",
    type: "financing_rate",
    target: 75,
    targetUnit: "%",
    startDate: "2024-02-01",
    endDate: "2024-02-29",
    reward: { type: "badge", value: 150, description: "Badge As du Financement", badgeName: "As du Financement", badgeIcon: "star" },
    participantIds: [],
    allParticipants: true,
    status: "active",
    createdBy: "chef_ventes",
    createdAt: "2024-01-30",
    participants: [
      { id: "1", name: "Marie Martin", currentScore: 82, isCompleted: true, completedAt: "2024-02-15" },
      { id: "2", name: "Pierre Durand", currentScore: 68, isCompleted: false }
    ],
    topPerformers: []
  },
  {
    id: "cv-3",
    title: "Challenge Puma - Equipe VN",
    description: "Vendre 3 Ford Puma avant fin fevrier.",
    type: "specific_model",
    target: 3,
    targetUnit: "unites",
    targetModelName: "Puma",
    startDate: "2024-02-01",
    endDate: "2024-02-29",
    reward: { type: "points", value: 500, description: "500 points bonus classement" },
    participantIds: [],
    allParticipants: true,
    status: "active",
    createdBy: "chef_ventes",
    createdAt: "2024-01-28",
    participants: [],
    topPerformers: []
  },
  {
    id: "cv-4",
    title: "Sprint Janvier",
    description: "Challenge de ventes du mois de janvier - termine.",
    type: "sales_count",
    target: 10,
    targetUnit: "ventes",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    reward: { type: "bonus", value: 300, description: "Bonus de 300€" },
    participantIds: [],
    allParticipants: true,
    status: "completed",
    createdBy: "chef_ventes",
    createdAt: "2023-12-28",
    participants: [
      { id: "1", name: "Marie Martin", currentScore: 12, isCompleted: true, completedAt: "2024-01-25" },
      { id: "2", name: "Pierre Durand", currentScore: 10, isCompleted: true, completedAt: "2024-01-30" }
    ],
    topPerformers: [
      { id: "1", name: "Marie Martin", currentScore: 12, isCompleted: true, completedAt: "2024-01-25" }
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
  upcoming: { label: "A venir", color: "text-blue-600", bgColor: "bg-blue-100", icon: Clock },
  active: { label: "En cours", color: "text-emerald-600", bgColor: "bg-emerald-100", icon: Play },
  completed: { label: "Termine", color: "text-purple-600", bgColor: "bg-purple-100", icon: CheckCircle },
  cancelled: { label: "Annule", color: "text-red-600", bgColor: "bg-red-100", icon: XCircle }
}

// ============================================
// CHALLENGE CARD
// ============================================
function ChallengeCard({ challenge }: { challenge: DirectionChallenge }) {
  const typeConfig = CHALLENGE_TYPE_CONFIG[challenge.type]
  const statusConfig = STATUS_CONFIG[challenge.status]
  const TypeIcon = CHALLENGE_TYPE_ICONS[challenge.type]
  const StatusIcon = statusConfig.icon

  const participantCount = challenge.participants.length || 6
  const completedCount = challenge.participants.filter(p => p.isCompleted).length
  const avgProgress = challenge.status === "active"
    ? Math.round(challenge.participants.reduce((sum, p) => sum + (p.currentScore / challenge.target * 100), 0) / Math.max(participantCount, 1))
    : challenge.status === "completed" ? 100 : 0

  return (
    <Card className="border-0 shadow-premium hover:shadow-premium-lg transition-all duration-300 overflow-hidden">
      <CardContent className="p-0">
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
              <p className="text-xs text-gray-500">Duree</p>
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

          {challenge.status === "active" && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Progression moyenne</span>
                <span className="font-semibold text-gray-900">{avgProgress}%</span>
              </div>
              <Progress value={avgProgress} className="h-2" />
              <p className="text-xs text-gray-500">
                {completedCount} participant{completedCount > 1 ? "s" : ""} ont atteint l&apos;objectif
              </p>
            </div>
          )}

          <div className="p-3 bg-amber-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">Recompense</span>
              </div>
              <Badge className="bg-amber-100 text-amber-700">
                {challenge.reward.type === "bonus" && `${challenge.reward.value}\u20AC`}
                {challenge.reward.type === "badge" && challenge.reward.badgeName}
                {challenge.reward.type === "points" && `${challenge.reward.value} pts`}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t">
            <span>
              Du {new Date(challenge.startDate).toLocaleDateString("fr-FR")} au{" "}
              {new Date(challenge.endDate).toLocaleDateString("fr-FR")}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================
// MAIN PAGE
// ============================================
export default function ChefVentesChallengesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<DirectionChallengeStatus | "all">("all")

  const filteredChallenges = mockChallenges.filter((challenge) => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === "all" || challenge.status === activeTab
    return matchesSearch && matchesTab
  })

  const activeChallenges = mockChallenges.filter(c => c.status === "active").length
  const completedChallenges = mockChallenges.filter(c => c.status === "completed").length

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            Challenges Equipe
          </h1>
          <p className="text-gray-500 mt-1">Gerez les challenges de votre equipe commerciale</p>
        </div>
        <Link href="/chef-ventes/challenges/new">
          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg gap-2">
            <Plus className="w-5 h-5" />
            Nouveau challenge
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-premium">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Actifs</p>
                <p className="text-2xl font-bold text-gray-900">{activeChallenges}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Play className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-premium">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Termines</p>
                <p className="text-2xl font-bold text-gray-900">{completedChallenges}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-premium">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Participants</p>
                <p className="text-2xl font-bold text-gray-900">6</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-premium">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Taux reussite</p>
                <p className="text-2xl font-bold text-gray-900">72%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
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
              <TabsList className="bg-gray-100 grid grid-cols-3 sm:flex">
                <TabsTrigger value="all" className="text-xs sm:text-sm">Tous</TabsTrigger>
                <TabsTrigger value="active" className="text-xs sm:text-sm gap-1">
                  En cours
                  <Badge className="bg-emerald-500 text-white text-xs h-5 w-5 p-0 justify-center sm:ml-1">
                    {activeChallenges}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="completed" className="text-xs sm:text-sm">Termines</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Challenges grid */}
      {filteredChallenges.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      ) : (
        <Card className="border-0 shadow-premium">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Aucun challenge trouve</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? "Aucun challenge ne correspond a votre recherche."
                : "Creez votre premier challenge pour motiver votre equipe !"}
            </p>
            <Link href="/chef-ventes/challenges/new">
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 gap-2">
                <Plus className="w-4 h-4" />
                Creer un challenge
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
