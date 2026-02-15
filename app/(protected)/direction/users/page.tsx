"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Users,
  Plus,
  Search,
  MoreHorizontal,
  Mail,
  Phone,
  TrendingUp,
  Trophy,
  Target,
  Car,
  Euro,
  Shield,
  Edit,
  Trash2,
  ArrowLeft,
  BadgeCheck,
  Clock,
  Star,
  Crown,
  UserPlus,
  Download,
  Filter,
  ChevronDown,
  CheckCircle2,
  X
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

// ============================================
// TEAM MANAGEMENT PAGE PREMIUM - AutoPerf Pro
// ============================================

interface TeamMember {
  id: string
  name: string
  email: string
  phone: string
  role: "commercial" | "direction" | "admin"
  status: "active" | "inactive" | "pending"
  avatar: string
  stats: {
    sales: number
    target: number
    commission: number
    margin: number
    financingRate: number
  }
  joinDate: string
  lastActive: string
}

const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Marie Martin",
    email: "marie.martin@ford.fr",
    phone: "+33 6 12 34 56 78",
    role: "commercial",
    status: "active",
    avatar: "",
    stats: { sales: 12, target: 15, commission: 5200, margin: 18500, financingRate: 78 },
    joinDate: "2023-03-15",
    lastActive: "Il y a 10 min"
  },
  {
    id: "2",
    name: "Pierre Durand",
    email: "pierre.durand@ford.fr",
    phone: "+33 6 23 45 67 89",
    role: "commercial",
    status: "active",
    avatar: "",
    stats: { sales: 11, target: 12, commission: 4800, margin: 16200, financingRate: 72 },
    joinDate: "2023-01-10",
    lastActive: "Il y a 1h"
  },
  {
    id: "3",
    name: "Jean Dupont",
    email: "jean.dupont@ford.fr",
    phone: "+33 6 34 56 78 90",
    role: "commercial",
    status: "active",
    avatar: "",
    stats: { sales: 8, target: 10, commission: 3450, margin: 12400, financingRate: 65 },
    joinDate: "2023-06-20",
    lastActive: "En ligne"
  },
  {
    id: "4",
    name: "Sophie Bernard",
    email: "sophie.bernard@ford.fr",
    phone: "+33 6 45 67 89 01",
    role: "commercial",
    status: "active",
    avatar: "",
    stats: { sales: 7, target: 10, commission: 3200, margin: 11800, financingRate: 70 },
    joinDate: "2023-09-05",
    lastActive: "Il y a 2h"
  },
  {
    id: "5",
    name: "Lucas Petit",
    email: "lucas.petit@ford.fr",
    phone: "+33 6 56 78 90 12",
    role: "commercial",
    status: "inactive",
    avatar: "",
    stats: { sales: 7, target: 10, commission: 2900, margin: 10500, financingRate: 68 },
    joinDate: "2023-11-12",
    lastActive: "Il y a 3 jours"
  },
  {
    id: "6",
    name: "Thomas Leroy",
    email: "thomas.leroy@ford.fr",
    phone: "+33 6 67 89 01 23",
    role: "direction",
    status: "active",
    avatar: "",
    stats: { sales: 0, target: 0, commission: 0, margin: 0, financingRate: 0 },
    joinDate: "2022-01-15",
    lastActive: "En ligne"
  }
]

const roleConfig = {
  commercial: { label: "Commercial", color: "bg-blue-100 text-blue-700 border-blue-200", icon: UserPlus },
  direction: { label: "Direction", color: "bg-purple-100 text-purple-700 border-purple-200", icon: Crown },
  admin: { label: "Administrateur", color: "bg-red-100 text-red-700 border-red-200", icon: Shield }
}

const statusConfig = {
  active: { label: "Actif", color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  inactive: { label: "Inactif", color: "bg-gray-100 text-gray-600", dot: "bg-gray-400" },
  pending: { label: "En attente", color: "bg-amber-100 text-amber-700", dot: "bg-amber-500" }
}

export default function TeamManagementPage() {
  const [members, setMembers] = useState<TeamMember[]>(mockTeamMembers)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [showMemberDetail, setShowMemberDetail] = useState(false)

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === "all" || member.role === filterRole
    const matchesStatus = filterStatus === "all" || member.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const activeMembers = members.filter(m => m.status === "active").length
  const totalSales = members.reduce((sum, m) => sum + m.stats.sales, 0)
  const totalCommission = members.reduce((sum, m) => sum + m.stats.commission, 0)

  const openMemberDetail = (member: TeamMember) => {
    setSelectedMember(member)
    setShowMemberDetail(true)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* ============================================
          HEADER
          ============================================ */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 animate-fade-in-up opacity-0-initial" style={{ animationFillMode: "forwards" }}>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link href="/direction">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600" />
                Gestion de l&apos;équipe
              </h1>
              <p className="text-gray-600">Gérez vos commerciaux et leurs permissions</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25"
            onClick={() => setShowInviteDialog(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Inviter un membre
          </Button>
        </div>
      </div>

      {/* ============================================
          STATS CARDS
          ============================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up opacity-0-initial" style={{ animationFillMode: "forwards", animationDelay: "100ms" }}>
        <Card className="border-0 shadow-premium">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Membres actifs</p>
                <p className="text-3xl font-bold text-gray-900">{activeMembers}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-premium">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Ventes ce mois</p>
                <p className="text-3xl font-bold text-gray-900">{totalSales}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-lg">
                <Car className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-premium">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Commissions</p>
                <p className="text-3xl font-bold text-gray-900">{(totalCommission / 1000).toFixed(1)}k€</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center shadow-lg">
                <Euro className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-premium">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Top performer</p>
                <p className="text-xl font-bold text-gray-900">Marie M.</p>
                <p className="text-xs text-emerald-600">5 200€ de commission</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg">
                <Trophy className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ============================================
          FILTERS & SEARCH
          ============================================ */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 animate-fade-in-up opacity-0-initial" style={{ animationFillMode: "forwards", animationDelay: "200ms" }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Rechercher un membre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>
        <div className="flex gap-3">
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-[180px] h-12">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les rôles</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="direction">Direction</SelectItem>
              <SelectItem value="admin">Administrateur</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px] h-12">
              <BadgeCheck className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="inactive">Inactif</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ============================================
          TEAM MEMBERS LIST
          ============================================ */}
      <Card className="border-0 shadow-premium animate-fade-in-up opacity-0-initial" style={{ animationFillMode: "forwards", animationDelay: "300ms" }}>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Membres de l&apos;équipe
          </CardTitle>
          <CardDescription>{filteredMembers.length} membres trouvés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredMembers.map((member) => {
              const role = roleConfig[member.role]
              const status = statusConfig[member.status]
              const progress = (member.stats.sales / member.stats.target) * 100

              return (
                <div 
                  key={member.id} 
                  className="group p-5 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => openMemberDetail(member)}
                >
                  <div className="flex flex-col xl:flex-row xl:items-center gap-4">
                    {/* Avatar & Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative">
                        <Avatar className="h-14 w-14">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg font-semibold">
                            {member.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${status.dot}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg text-gray-900">{member.name}</h3>
                          <Badge className={role.color}>{role.label}</Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5" />
                            {member.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            {member.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    {member.role === "commercial" && (
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-900">{member.stats.sales}</p>
                          <p className="text-xs text-gray-500">Ventes</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-emerald-600">{member.stats.commission.toLocaleString()}€</p>
                          <p className="text-xs text-gray-500">Commission</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-blue-600">{member.stats.financingRate}%</p>
                          <p className="text-xs text-gray-500">Finance</p>
                        </div>
                        <div className="w-32">
                          <Progress value={progress} className="h-2" />
                          <p className="text-xs text-gray-500 mt-1 text-center">{member.stats.sales}/{member.stats.target} obj.</p>
                        </div>
                      </div>
                    )}

                    {/* Status & Actions */}
                    <div className="flex items-center gap-4">
                      <Badge className={status.color}>
                        {status.label}
                      </Badge>
                      <p className="text-sm text-gray-400 hidden lg:block">
                        <Clock className="w-3.5 h-3.5 inline mr-1" />
                        {member.lastActive}
                      </p>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openMemberDetail(member); }}>
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* ============================================
          DIALOGS
          ============================================ */}
      
      {/* Invite Member Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              Inviter un nouveau membre
            </DialogTitle>
            <DialogDescription>
              Envoyez une invitation par email pour rejoindre l&apos;équipe
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Adresse email</Label>
              <Input placeholder="nom@concession.fr" type="email" />
            </div>
            <div className="space-y-2">
              <Label>Rôle</Label>
              <Select defaultValue="commercial">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="direction">Direction</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Message personnalisé (optionnel)</Label>
              <textarea 
                className="w-full min-h-[100px] px-3 py-2 border rounded-md text-sm"
                placeholder="Bonjour, je vous invite à rejoindre notre équipe sur AutoPerf Pro..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
              Annuler
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
              <Mail className="w-4 h-4 mr-2" />
              Envoyer l&apos;invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Member Detail Dialog */}
      <Dialog open={showMemberDetail} onOpenChange={setShowMemberDetail}>
        <DialogContent className="max-w-2xl">
          {selectedMember && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl font-semibold">
                      {selectedMember.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-2xl">{selectedMember.name}</DialogTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={roleConfig[selectedMember.role].color}>
                        {roleConfig[selectedMember.role].label}
                      </Badge>
                      <Badge className={statusConfig[selectedMember.status].color}>
                        {statusConfig[selectedMember.status].label}
                      </Badge>
                    </div>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-gray-50">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="font-medium text-gray-900">{selectedMember.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Téléphone</p>
                    <p className="font-medium text-gray-900">{selectedMember.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Date d&apos;inscription</p>
                    <p className="font-medium text-gray-900">{new Date(selectedMember.joinDate).toLocaleDateString("fr-FR")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Dernière activité</p>
                    <p className="font-medium text-gray-900">{selectedMember.lastActive}</p>
                  </div>
                </div>

                {/* Stats */}
                {selectedMember.role === "commercial" && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      Performance ce mois
                    </h4>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="p-4 rounded-xl bg-blue-50 text-center">
                        <p className="text-2xl font-bold text-blue-600">{selectedMember.stats.sales}</p>
                        <p className="text-xs text-blue-600/70">Ventes</p>
                      </div>
                      <div className="p-4 rounded-xl bg-emerald-50 text-center">
                        <p className="text-2xl font-bold text-emerald-600">{selectedMember.stats.commission.toLocaleString()}€</p>
                        <p className="text-xs text-emerald-600/70">Commission</p>
                      </div>
                      <div className="p-4 rounded-xl bg-purple-50 text-center">
                        <p className="text-2xl font-bold text-purple-600">{selectedMember.stats.margin.toLocaleString()}€</p>
                        <p className="text-xs text-purple-600/70">Marge</p>
                      </div>
                      <div className="p-4 rounded-xl bg-amber-50 text-center">
                        <p className="text-2xl font-bold text-amber-600">{selectedMember.stats.financingRate}%</p>
                        <p className="text-xs text-amber-600/70">Financement</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="gap-3">
                <Button variant="outline" onClick={() => setShowMemberDetail(false)}>
                  Fermer
                </Button>
                <Button variant="outline" className="gap-2">
                  <Edit className="w-4 h-4" />
                  Modifier
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                  <Mail className="w-4 h-4 mr-2" />
                  Contacter
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
