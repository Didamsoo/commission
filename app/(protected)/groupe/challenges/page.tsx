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
  Search,
  Globe,
  Euro,
  TrendingUp,
  Percent,
  Car
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
// MOCK DATA - Challenges groupe (inter-marques)
// ============================================
const mockChallenges: DirectionChallenge[] = [
  {
    id: "g-1",
    title: "Challenge Groupe Q1 - Ventes",
    description: "La marque avec le meilleur taux d'atteinte objectif remporte le trophee du trimestre.",
    type: "sales_count",
    target: 300,
    targetUnit: "ventes",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    reward: { type: "bonus", value: 10000, description: "Bonus collectif de 10 000€ pour la marque gagnante" },
    participantIds: [],
    allParticipants: true,
    status: "active",
    createdBy: "dir_plaque",
    createdAt: "2023-12-20",
    participants: [
      { id: "b-ford", name: "Ford", currentScore: 287, isCompleted: false },
      { id: "b-nissan", name: "Nissan", currentScore: 245, isCompleted: false },
      { id: "b-suzuki", name: "Suzuki", currentScore: 198, isCompleted: false }
    ],
    topPerformers: []
  },
  {
    id: "g-2",
    title: "Excellence Financement Groupe",
    description: "Toutes les marques doivent atteindre 75% de taux de financement moyen.",
    type: "financing_rate",
    target: 75,
    targetUnit: "%",
    startDate: "2024-02-01",
    endDate: "2024-02-29",
    reward: { type: "badge", value: 500, description: "Badge Excellence Groupe", badgeName: "Excellence Groupe", badgeIcon: "crown" },
    participantIds: [],
    allParticipants: true,
    status: "active",
    createdBy: "dir_plaque",
    createdAt: "2024-01-28",
    participants: [
      { id: "b-ford", name: "Ford", currentScore: 78, isCompleted: true, completedAt: "2024-02-12" },
      { id: "b-nissan", name: "Nissan", currentScore: 71, isCompleted: false },
      { id: "b-suzuki", name: "Suzuki", currentScore: 68, isCompleted: false }
    ],
    topPerformers: []
  },
  {
    id: "g-3",
    title: "Objectif CA Annuel 2024",
    description: "Atteindre un chiffre d'affaires groupe de 50M€ sur l'annee 2024.",
    type: "revenue_target",
    target: 50000000,
    targetUnit: "\u20AC",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    reward: { type: "bonus", value: 25000, description: "Prime annuelle exceptionnelle" },
    participantIds: [],
    allParticipants: true,
    status: "active",
    createdBy: "dir_plaque",
    createdAt: "2023-12-15",
    participants: [
      { id: "b-ford", name: "Ford", currentScore: 8610000, isCompleted: false },
      { id: "b-nissan", name: "Nissan", currentScore: 6230000, isCompleted: false },
      { id: "b-suzuki", name: "Suzuki", currentScore: 3920000, isCompleted: false }
    ],
    topPerformers: []
  },
  {
    id: "g-4",
    title: "Challenge Groupe Q4 2023",
    description: "Challenge de fin d'annee 2023 - ventes toutes marques.",
    type: "sales_count",
    target: 280,
    targetUnit: "ventes",
    startDate: "2023-10-01",
    endDate: "2023-12-31",
    reward: { type: "bonus", value: 8000, description: "Bonus collectif" },
    participantIds: [],
    allParticipants: true,
    status: "completed",
    createdBy: "dir_plaque",
    createdAt: "2023-09-20",
    participants: [
      { id: "b-ford", name: "Ford", currentScore: 310, isCompleted: true, completedAt: "2023-12-15" },
      { id: "b-nissan", name: "Nissan", currentScore: 265, isCompleted: false },
      { id: "b-suzuki", name: "Suzuki", currentScore: 220, isCompleted: false }
    ],
    topPerformers: [
      { id: "b-ford", name: "Ford", currentScore: 310, isCompleted: true, completedAt: "2023-12-15" }
    ]
  }
]

// ============================================
// ICONS
// ============================================
const CHALLENGE_TYPE_ICONS: Record<DirectionChallengeType, React.ElementType> = {
  sales_count: Globe,
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

  const participantCount = challenge.participants.length || 3
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
              <Globe className="w-4 h-4 mx-auto text-gray-500 mb-1" />
              <p className="text-xs text-gray-500">Marques</p>
              <p className="font-semibold text-gray-900 text-sm">{participantCount}</p>
            </div>
          </div>

          {challenge.status === "active" && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Progression moyenne</span>
                <span className="font-semibold text-gray-900">{Math.min(avgProgress, 100)}%</span>
              </div>
              <Progress value={Math.min(avgProgress, 100)} className="h-2" />
              <p className="text-xs text-gray-500">
                {completedCount} marque{completedCount > 1 ? "s" : ""} {completedCount > 1 ? "ont" : "a"} atteint l&apos;objectif
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
                {challenge.reward.type === "bonus" && `${challenge.reward.value.toLocaleString("fr-FR")}\u20AC`}
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
export default function GroupeChallengesPage() {
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
            Challenges Groupe
          </h1>
          <p className="text-gray-500 mt-1">Challenges strategiques inter-marques du groupe</p>
        </div>
        <Link href="/groupe/challenges/new">
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
                <p className="text-sm text-gray-500">Marques</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-premium">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Taux reussite</p>
                <p className="text-2xl font-bold text-gray-900">65%</p>
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
                : "Lancez un challenge groupe pour stimuler la performance inter-marques !"}
            </p>
            <Link href="/groupe/challenges/new">
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
