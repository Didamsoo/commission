"use client"

import { useState } from "react"
import Link from "next/link"
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Car,
  User,
  Euro,
  Calendar,
  Filter,
  Search,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  MoreHorizontal,
  Download,
  Sparkles,
  Shield,
  BadgeCheck,
  TrendingUp,
  FileText
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// ============================================
// APPROVALS PAGE PREMIUM - AutoPerf Pro
// ============================================

interface PendingSale {
  id: string
  seller: {
    name: string
    avatar: string
    email: string
  }
  vehicle: {
    type: "VO" | "VN" | "VU"
    name: string
    number: string
    year: number
  }
  client: string
  pricing: {
    purchasePrice: number
    sellingPrice: number
    margin: number
    commission: number
    marginRate: number
  }
  hasFinancing: boolean
  financedAmount?: number
  hasAccessories: boolean
  accessoryAmount?: number
  createdAt: string
  status: "pending" | "approved" | "rejected"
  rejectionReason?: string
}

const mockPendingSales: PendingSale[] = [
  {
    id: "1",
    seller: { name: "Jean Dupont", avatar: "", email: "jean.dupont@ford.fr" },
    vehicle: { type: "VN", name: "Ford Kuga Titanium", number: "VH-2024-001", year: 2024 },
    client: "Mme Moreau",
    pricing: { purchasePrice: 28500, sellingPrice: 32000, margin: 1850, commission: 420, marginRate: 12.8 },
    hasFinancing: true,
    financedAmount: 25000,
    hasAccessories: true,
    accessoryAmount: 450,
    createdAt: "2024-02-20T10:30:00",
    status: "pending"
  },
  {
    id: "2",
    seller: { name: "Sophie Bernard", avatar: "", email: "sophie.bernard@ford.fr" },
    vehicle: { type: "VO", name: "Ford Focus ST-Line", number: "VH-2024-002", year: 2022 },
    client: "M. Garcia",
    pricing: { purchasePrice: 18000, sellingPrice: 21500, margin: 1200, commission: 320, marginRate: 15.2 },
    hasFinancing: false,
    hasAccessories: false,
    createdAt: "2024-02-20T08:15:00",
    status: "pending"
  },
  {
    id: "3",
    seller: { name: "Lucas Petit", avatar: "", email: "lucas.petit@ford.fr" },
    vehicle: { type: "VN", name: "Ford Puma ST", number: "VH-2024-003", year: 2024 },
    client: "M. Martinez",
    pricing: { purchasePrice: 32000, sellingPrice: 36500, margin: 2100, commission: 480, marginRate: 13.2 },
    hasFinancing: true,
    financedAmount: 30000,
    hasAccessories: true,
    accessoryAmount: 280,
    createdAt: "2024-02-19T16:45:00",
    status: "pending"
  },
  {
    id: "4",
    seller: { name: "Marie Martin", avatar: "", email: "marie.martin@ford.fr" },
    vehicle: { type: "VU", name: "Ford Transit Custom", number: "VH-2024-004", year: 2023 },
    client: "SARL Durand Transport",
    pricing: { purchasePrice: 35000, sellingPrice: 42000, margin: 3500, commission: 650, marginRate: 18.5 },
    hasFinancing: true,
    financedAmount: 38000,
    hasAccessories: false,
    createdAt: "2024-02-19T14:20:00",
    status: "approved"
  },
  {
    id: "5",
    seller: { name: "Pierre Durand", avatar: "", email: "pierre.durand@ford.fr" },
    vehicle: { type: "VO", name: "Ford Fiesta Active", number: "VH-2024-005", year: 2021 },
    client: "Mme Petit",
    pricing: { purchasePrice: 12000, sellingPrice: 14500, margin: 850, commission: 220, marginRate: 16.3 },
    hasFinancing: false,
    hasAccessories: true,
    accessoryAmount: 150,
    createdAt: "2024-02-19T11:00:00",
    status: "rejected",
    rejectionReason: "Documents incomplets - carte grise manquante"
  }
]

const vehicleTypeConfig = {
  VN: { label: "Véhicule Neuf", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: "🚗" },
  VO: { label: "Occasion", color: "bg-blue-100 text-blue-700 border-blue-200", icon: "🚙" },
  VU: { label: "Utilitaire", color: "bg-purple-100 text-purple-700 border-purple-200", icon: "🚐" }
}

// ============================================
// COMPONENTS
// ============================================

function SaleDetailDialog({ 
  sale, 
  isOpen, 
  onClose,
  onApprove, 
  onReject 
}: {
  sale: PendingSale | null
  isOpen: boolean
  onClose: () => void
  onApprove: () => void
  onReject: (reason: string) => void
}) {
  const [rejectReason, setRejectReason] = useState("")
  const [showRejectForm, setShowRejectForm] = useState(false)

  if (!sale) return null

  const config = vehicleTypeConfig[sale.vehicle.type]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-gray-50">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${config.color} flex items-center justify-center text-2xl`}>
              {config.icon}
            </div>
            <div>
              <DialogTitle className="text-xl">Détails de la vente</DialogTitle>
              <DialogDescription>
                Vente #{sale.vehicle.number} • Soumise le {new Date(sale.createdAt).toLocaleDateString("fr-FR")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-280px)]">
          <div className="p-6 space-y-6">
            {/* Vehicle Info Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Car className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-xl text-gray-900">{sale.vehicle.name}</h3>
                    <Badge className={config.color}>{config.label}</Badge>
                  </div>
                  <p className="text-gray-500">Année: {sale.vehicle.year} • N° {sale.vehicle.number}</p>
                </div>
              </div>
            </div>

            {/* Seller & Client */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                <p className="text-sm text-blue-600 font-medium mb-2">Vendeur</p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                      {sale.seller.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900">{sale.seller.name}</p>
                    <p className="text-sm text-gray-500">{sale.seller.email}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <p className="text-sm text-gray-600 font-medium mb-2">Client</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-semibold text-gray-900">{sale.client}</p>
                </div>
              </div>
            </div>

            {/* Pricing Details */}
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Euro className="w-5 h-5 text-blue-600" />
                Détails financiers
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white rounded-xl">
                  <p className="text-sm text-gray-500">Prix d&apos;achat HT</p>
                  <p className="text-lg font-bold text-gray-900">{sale.pricing.purchasePrice.toLocaleString()}€</p>
                </div>
                <div className="p-3 bg-white rounded-xl">
                  <p className="text-sm text-gray-500">Prix de vente TTC</p>
                  <p className="text-lg font-bold text-gray-900">{sale.pricing.sellingPrice.toLocaleString()}€</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-sm text-emerald-600">Marge HT</p>
                  <p className="text-2xl font-bold text-emerald-600">{sale.pricing.margin.toLocaleString()}€</p>
                  <p className="text-sm text-emerald-500">{sale.pricing.marginRate}% de marge</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-sm text-blue-600">Commission vendeur</p>
                  <p className="text-2xl font-bold text-blue-600">{sale.pricing.commission}€</p>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-4">
              {sale.hasFinancing && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-700 mb-1">
                    <BadgeCheck className="w-5 h-5" />
                    <p className="font-semibold">Financement inclus</p>
                  </div>
                  <p className="text-emerald-600">Montant: {sale.financedAmount?.toLocaleString()}€</p>
                </div>
              )}
              {sale.hasAccessories && (
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                  <div className="flex items-center gap-2 text-purple-700 mb-1">
                    <Sparkles className="w-5 h-5" />
                    <p className="font-semibold">Accessoires</p>
                  </div>
                  <p className="text-purple-600">Montant: {sale.accessoryAmount?.toLocaleString()}€</p>
                </div>
              )}
            </div>

            {/* Reject Form */}
            {showRejectForm && (
              <div className="p-5 rounded-2xl bg-red-50 border border-red-200 space-y-3">
                <p className="font-semibold text-red-800 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Motif du refus
                </p>
                <Textarea
                  placeholder="Expliquez pourquoi cette vente est refusée..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  className="bg-white border-red-200 focus:border-red-500"
                />
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t bg-gray-50 gap-3">
          {!showRejectForm ? (
            <>
              <Button
                variant="outline"
                onClick={() => setShowRejectForm(true)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                <ThumbsDown className="w-4 h-4 mr-2" />
                Refuser
              </Button>
              <Button
                onClick={onApprove}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                Approuver la vente
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setShowRejectForm(false)}>
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={() => onReject(rejectReason)}
                disabled={!rejectReason.trim()}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Confirmer le refus
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function ApprovalsPage() {
  const [sales, setSales] = useState<PendingSale[]>(mockPendingSales)
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSale, setSelectedSale] = useState<PendingSale | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleApprove = (saleId: string) => {
    setSales(sales.map(sale =>
      sale.id === saleId ? { ...sale, status: "approved" as const } : sale
    ))
    setIsDialogOpen(false)
  }

  const handleReject = (saleId: string, reason: string) => {
    setSales(sales.map(sale =>
      sale.id === saleId ? { ...sale, status: "rejected" as const, rejectionReason: reason } : sale
    ))
    setIsDialogOpen(false)
  }

  const openSaleDetail = (sale: PendingSale) => {
    setSelectedSale(sale)
    setIsDialogOpen(true)
  }

  const filteredSales = sales.filter(sale => {
    const matchesFilter = filter === "all" || sale.status === filter
    const matchesSearch =
      sale.vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.client.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const pendingCount = sales.filter(s => s.status === "pending").length
  const approvedCount = sales.filter(s => s.status === "approved").length
  const rejectedCount = sales.filter(s => s.status === "rejected").length

  const totalMargin = filteredSales.reduce((sum, s) => sum + s.pricing.margin, 0)
  const totalCommission = filteredSales.reduce((sum, s) => sum + s.pricing.commission, 0)

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
                <Shield className="w-8 h-8 text-emerald-600" />
                Centre d&apos;approbations
              </h1>
              <p className="text-gray-600">Validez ou refusez les ventes de votre équipe</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* ============================================
          STATS CARDS
          ============================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up opacity-0-initial" style={{ animationFillMode: "forwards", animationDelay: "100ms" }}>
        <Card className="border-0 shadow-premium overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">En attente</p>
                <p className="text-3xl font-bold text-amber-600">{pendingCount}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg">
                <Clock className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-premium overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Approuvées</p>
                <p className="text-3xl font-bold text-emerald-600">{approvedCount}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-lg">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-premium overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Refusées</p>
                <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center shadow-lg">
                <XCircle className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-premium overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Marge totale</p>
                <p className="text-3xl font-bold text-blue-600">{(totalMargin / 1000).toFixed(1)}k€</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ============================================
          MAIN CONTENT
          ============================================ */}
      <Card className="border-0 shadow-premium animate-fade-in-up opacity-0-initial" style={{ animationFillMode: "forwards", animationDelay: "200ms" }}>
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Liste des ventes
              </CardTitle>
              <CardDescription>{filteredSales.length} ventes trouvées</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="approved">Approuvées</SelectItem>
                  <SelectItem value="rejected">Refusées</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {filteredSales.length > 0 ? (
              filteredSales.map((sale) => {
                const config = vehicleTypeConfig[sale.vehicle.type]
                return (
                  <div 
                    key={sale.id} 
                    className={`group p-5 rounded-2xl border-2 transition-all duration-300 ${
                      sale.status === "approved"
                        ? "border-emerald-200 bg-emerald-50/30"
                        : sale.status === "rejected"
                        ? "border-red-200 bg-red-50/30"
                        : "border-gray-100 bg-white hover:border-blue-200 hover:shadow-lg"
                    }`}
                  >
                    <div className="flex flex-col xl:flex-row xl:items-center gap-4">
                      {/* Vehicle Info */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
                          <Car className="w-8 h-8 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-lg text-gray-900 truncate">{sale.vehicle.name}</h3>
                            <Badge className={config.color}>{config.label}</Badge>
                            {sale.status === "approved" && (
                              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Approuvée
                              </Badge>
                            )}
                            {sale.status === "rejected" && (
                              <Badge className="bg-red-100 text-red-700 border-red-200">
                                <XCircle className="w-3 h-3 mr-1" />
                                Refusée
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            N° {sale.vehicle.number} • {sale.vehicle.year}
                          </p>
                        </div>
                      </div>

                      {/* Seller & Client */}
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 text-sm font-semibold">
                              {sale.seller.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{sale.seller.name}</p>
                            <p className="text-xs text-gray-500">Vendeur</p>
                          </div>
                        </div>
                        <div className="hidden sm:block">
                          <p className="font-medium text-gray-900">{sale.client}</p>
                          <p className="text-xs text-gray-500">Client</p>
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-lg font-bold text-emerald-600">{sale.pricing.margin.toLocaleString()}€</p>
                          <p className="text-xs text-gray-500">Marge HT</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-blue-600">{sale.pricing.commission}€</p>
                          <p className="text-xs text-gray-500">Commission</p>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                          <p className="text-sm text-gray-500">
                            {new Date(sale.createdAt).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </p>
                        </div>

                        {sale.status === "pending" ? (
                          <Button 
                            onClick={() => openSaleDetail(sale)}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Examiner
                          </Button>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openSaleDetail(sale)}>
                                <Eye className="w-4 h-4 mr-2" />
                                Voir les détails
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="w-4 h-4 mr-2" />
                                Télécharger PDF
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>

                    {/* Rejection Reason */}
                    {sale.status === "rejected" && sale.rejectionReason && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-red-800">Motif du refus</p>
                          <p className="text-sm text-red-600">{sale.rejectionReason}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune vente trouvée</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {filter === "all" 
                    ? "Il n'y a aucune vente dans le système actuellement."
                    : "Aucune vente ne correspond aux filtres sélectionnés."}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sale Detail Dialog */}
      <SaleDetailDialog
        sale={selectedSale}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onApprove={() => selectedSale && handleApprove(selectedSale.id)}
        onReject={(reason) => selectedSale && handleReject(selectedSale.id, reason)}
      />
    </div>
  )
}
