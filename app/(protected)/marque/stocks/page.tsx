"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Package,
  ChevronRight,
  Search,
  Car,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ArrowRight,
  MapPin,
  Loader2
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useConcessionsList } from "@/hooks/use-concessions-list"
import { type DealershipDisplayData, mapConcessionToDealership } from "@/lib/types/display"
import { deriveBrandKPIs, type BrandKPIs } from "@/lib/utils/kpi-helpers"
import { useStocks, useStockTransfers, updateTransferStatus, type StockItem, type StockTransfer } from "@/hooks/use-stocks"

// ============================================
// COMPONENTS
// ============================================

function StockSummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend
}: {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ElementType
  color: string
  trend?: "up" | "down"
}) {
  return (
    <Card className="border-0 shadow-premium">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {subtitle && (
              <p className={`text-sm mt-1 flex items-center gap-1 ${
                trend === "up" ? "text-emerald-600" :
                trend === "down" ? "text-red-600" :
                "text-gray-500"
              }`}>
                {trend === "up" && <TrendingUp className="w-3 h-3" />}
                {trend === "down" && <TrendingDown className="w-3 h-3" />}
                {subtitle}
              </p>
            )}
          </div>
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StockAgingChart({ stocks }: { stocks: StockItem[] }) {
  const agingData = useMemo(() => {
    const ranges = [
      { range: "0-15j", min: 0, max: 15, color: "bg-emerald-500" },
      { range: "16-30j", min: 16, max: 30, color: "bg-blue-500" },
      { range: "31-45j", min: 31, max: 45, color: "bg-amber-500" },
      { range: "46-60j", min: 46, max: 60, color: "bg-orange-500" },
      { range: ">60j", min: 61, max: Infinity, color: "bg-red-500" }
    ]
    return ranges.map(r => ({
      ...r,
      count: stocks.filter(s => s.daysInStock >= r.min && s.daysInStock <= r.max).length
    }))
  }, [stocks])

  const total = Math.max(agingData.reduce((sum, d) => sum + d.count, 0), 1)

  if (stocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Package className="w-10 h-10 text-gray-300 mb-3" />
        <p className="text-sm text-gray-500">Aucun véhicule en stock</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex h-8 rounded-lg overflow-hidden">
        {agingData.map((d) => (
          d.count > 0 ? (
            <div
              key={d.range}
              className={`${d.color} transition-all`}
              style={{ width: `${(d.count / total) * 100}%` }}
            />
          ) : null
        ))}
      </div>
      <div className="flex flex-wrap gap-4">
        {agingData.map((d) => (
          <div key={d.range} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded ${d.color}`} />
            <span className="text-sm text-gray-600">
              {d.range}: <span className="font-semibold">{d.count}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TransferCard({ transfer, onApprove, onReject }: {
  transfer: StockTransfer
  onApprove: (id: string) => void
  onReject: (id: string) => void
}) {
  const statusConfig = {
    pending: { color: "bg-amber-100 text-amber-700", label: "En attente" },
    approved: { color: "bg-blue-100 text-blue-700", label: "Approuvé" },
    in_transit: { color: "bg-purple-100 text-purple-700", label: "En transit" },
    completed: { color: "bg-emerald-100 text-emerald-700", label: "Terminé" },
    rejected: { color: "bg-red-100 text-red-700", label: "Refusé" }
  }

  const config = statusConfig[transfer.status]

  return (
    <Card className="border-0 shadow-premium">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold text-gray-900">{transfer.vehicle_model}</h4>
            <p className="text-xs text-gray-500 font-mono">{transfer.vehicle_vin}</p>
          </div>
          <Badge className={config.color}>{config.label}</Badge>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <div className="flex-1 p-2 rounded-lg bg-gray-50 text-center">
            <p className="text-xs text-gray-500">De</p>
            <p className="font-medium text-gray-900 truncate">{transfer.fromDealershipName}</p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="flex-1 p-2 rounded-lg bg-indigo-50 text-center">
            <p className="text-xs text-indigo-600">Vers</p>
            <p className="font-medium text-indigo-700 truncate">{transfer.toDealershipName}</p>
          </div>
        </div>

        {transfer.reason && (
          <p className="text-xs text-gray-500 mt-3">{transfer.reason}</p>
        )}

        {transfer.status === "pending" && (
          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="outline" className="flex-1" onClick={() => onReject(transfer.id)}>
              Refuser
            </Button>
            <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => onApprove(transfer.id)}>
              Approuver
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ============================================
// MAIN PAGE
// ============================================

export default function StocksPage() {
  const { data: concessionsRaw, loading: concLoading } = useConcessionsList()
  const { data: stocksData, loading: stocksLoading, refetch: refetchStocks } = useStocks()
  const { data: transfersData, loading: transfersLoading, refetch: refetchTransfers } = useStockTransfers()

  const dealerships: DealershipDisplayData[] = useMemo(
    () => (concessionsRaw || []).map(mapConcessionToDealership),
    [concessionsRaw]
  )
  const brandKPIs: BrandKPIs = useMemo(() => deriveBrandKPIs(dealerships), [dealerships])

  const stocks: StockItem[] = stocksData || []
  const transfers: StockTransfer[] = transfersData || []

  const [tab, setTab] = useState<"overview" | "inventory" | "transfers">("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<"all" | "VN" | "VO" | "VU">("all")
  const [filterDealership, setFilterDealership] = useState<string>("all")

  const filteredStock = useMemo(() => {
    return stocks.filter(item => {
      const matchesSearch = searchQuery === "" ||
        item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.vin.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = filterCategory === "all" || item.category === filterCategory
      const matchesDealership = filterDealership === "all" || item.concession_id === filterDealership
      return matchesSearch && matchesCategory && matchesDealership
    })
  }, [stocks, searchQuery, filterCategory, filterDealership])

  const stockByDealership = useMemo(() => {
    return dealerships.map(d => ({
      ...d,
      stockCount: stocks.filter(s => s.concession_id === d.id).length,
      avgDays: (() => {
        const dStocks = stocks.filter(s => s.concession_id === d.id)
        if (dStocks.length === 0) return 0
        return Math.round(dStocks.reduce((sum, s) => sum + s.daysInStock, 0) / dStocks.length)
      })()
    }))
  }, [dealerships, stocks])

  const pendingTransfers = transfers.filter(t => t.status === "pending")
  const avgDaysInStock = stocks.length > 0
    ? Math.round(stocks.reduce((sum, s) => sum + s.daysInStock, 0) / stocks.length)
    : 0

  const handleApproveTransfer = async (id: string) => {
    await updateTransferStatus(id, "approved")
    refetchTransfers()
  }

  const handleRejectTransfer = async (id: string) => {
    await updateTransferStatus(id, "rejected")
    refetchTransfers()
  }

  if (concLoading || stocksLoading || transfersLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/marque" className="hover:text-indigo-600 transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Gestion des stocks</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Stocks Réseau
          </h1>
          <p className="text-gray-500 mt-1">
            {stocks.length} véhicules en stock {avgDaysInStock > 0 ? `• Rotation moyenne: ${avgDaysInStock} jours` : ""}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {pendingTransfers.length > 0 && (
            <Badge className="bg-amber-100 text-amber-700">
              <RefreshCw className="w-3 h-3 mr-1" />
              {pendingTransfers.length} transfert{pendingTransfers.length > 1 ? "s" : ""} en attente
            </Badge>
          )}
          <Button variant="outline" className="gap-2" onClick={() => { refetchStocks(); refetchTransfers(); }}>
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StockSummaryCard
          title="Total en stock"
          value={stocks.length}
          subtitle="véhicules"
          icon={Package}
          color="from-blue-500 to-blue-600"
        />
        <StockSummaryCard
          title="Rotation moyenne"
          value={avgDaysInStock > 0 ? `${avgDaysInStock}j` : "N/A"}
          subtitle={avgDaysInStock > 0 ? (avgDaysInStock <= 45 ? "Dans l'objectif" : "Au-dessus de l'objectif") : undefined}
          icon={Clock}
          color={avgDaysInStock <= 45 ? "from-emerald-500 to-emerald-600" : "from-amber-500 to-orange-500"}
          trend={avgDaysInStock > 0 ? (avgDaysInStock <= 45 ? "up" : "down") : undefined}
        />
        <StockSummaryCard
          title="Stock > 45 jours"
          value={stocks.filter(s => s.daysInStock > 45).length}
          subtitle="véhicules à écouler"
          icon={AlertTriangle}
          color="from-red-500 to-red-600"
        />
        <StockSummaryCard
          title="Réservés"
          value={stocks.filter(s => s.status === "reserved").length}
          subtitle="en cours de vente"
          icon={CheckCircle}
          color="from-purple-500 to-purple-600"
        />
      </div>

      {/* Main Content */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="bg-gray-100 p-1">
          <TabsTrigger value="overview" className="gap-2">
            <Car className="w-4 h-4" />
            Par concession
          </TabsTrigger>
          <TabsTrigger value="inventory" className="gap-2">
            <Car className="w-4 h-4" />
            Inventaire
          </TabsTrigger>
          <TabsTrigger value="transfers" className="gap-2 relative">
            <RefreshCw className="w-4 h-4" />
            Transferts
            {pendingTransfers.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-amber-500 text-white text-xs rounded-full">
                {pendingTransfers.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Aging Chart */}
          <Card className="border-0 shadow-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                Vieillissement du stock
              </CardTitle>
              <CardDescription>Répartition par ancienneté</CardDescription>
            </CardHeader>
            <CardContent>
              <StockAgingChart stocks={stocks} />
            </CardContent>
          </Card>

          {/* Stock by Dealership */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stockByDealership.map((d) => (
              <Card key={d.id} className="border-0 shadow-premium hover:shadow-xl transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{d.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {d.location}
                      </p>
                    </div>
                    <Badge className={`${
                      d.avgDays <= 40 ? "bg-emerald-100 text-emerald-700" :
                      d.avgDays <= 50 ? "bg-amber-100 text-amber-700" :
                      d.avgDays > 50 ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {d.avgDays > 0 ? `${d.avgDays}j moy.` : "N/A"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center mb-3">
                    <div className="p-2 rounded-lg bg-blue-50">
                      <p className="text-lg font-bold text-blue-700">
                        {stocks.filter(s => s.concession_id === d.id && s.category === "VN").length}
                      </p>
                      <p className="text-xs text-blue-600">VN</p>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-50">
                      <p className="text-lg font-bold text-emerald-700">
                        {stocks.filter(s => s.concession_id === d.id && s.category === "VO").length}
                      </p>
                      <p className="text-xs text-emerald-600">VO</p>
                    </div>
                    <div className="p-2 rounded-lg bg-amber-50">
                      <p className="text-lg font-bold text-amber-700">
                        {stocks.filter(s => s.concession_id === d.id && s.category === "VU").length}
                      </p>
                      <p className="text-xs text-amber-600">VU</p>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total</span>
                    <span className="font-semibold">{d.stockCount} véhicules</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="mt-6 space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Rechercher un véhicule..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v as typeof filterCategory)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="VN">VN</SelectItem>
                <SelectItem value="VO">VO</SelectItem>
                <SelectItem value="VU">VU</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterDealership} onValueChange={setFilterDealership}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Concession" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                {dealerships.map(d => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stock List */}
          {filteredStock.length > 0 ? (
            <Card className="border-0 shadow-premium">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Véhicule</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Concession</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Cat.</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Jours</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Prix</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStock.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4">
                            <p className="font-semibold text-gray-900">{item.model}</p>
                            {item.variant && <p className="text-sm text-gray-500">{item.variant}</p>}
                            <p className="text-xs text-gray-400 font-mono">{item.vin}</p>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{item.dealershipName}</td>
                          <td className="py-3 px-4 text-center">
                            <Badge className={`${
                              item.category === "VN" ? "bg-blue-100 text-blue-700" :
                              item.category === "VO" ? "bg-emerald-100 text-emerald-700" :
                              "bg-amber-100 text-amber-700"
                            }`}>
                              {item.category}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`font-semibold ${
                              item.daysInStock <= 30 ? "text-emerald-600" :
                              item.daysInStock <= 45 ? "text-amber-600" :
                              "text-red-600"
                            }`}>
                              {item.daysInStock}j
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-semibold text-gray-900">
                            {item.price.toLocaleString()}€
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Badge className={`${
                              item.status === "available" ? "bg-emerald-100 text-emerald-700" :
                              item.status === "reserved" ? "bg-purple-100 text-purple-700" :
                              "bg-blue-100 text-blue-700"
                            }`}>
                              {item.status === "available" ? "Disponible" :
                               item.status === "reserved" ? "Réservé" : "En transit"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun véhicule trouvé</p>
              <p className="text-sm text-gray-400 mt-1">
                {stocks.length === 0
                  ? "La table stocks est vide. Exécutez la migration 008_stocks.sql puis ajoutez des véhicules."
                  : "Essayez d'ajuster vos filtres"}
              </p>
            </div>
          )}
        </TabsContent>

        {/* Transfers Tab */}
        <TabsContent value="transfers" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Demandes de transfert</h2>
          </div>

          {transfers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {transfers.map((transfer) => (
                <TransferCard
                  key={transfer.id}
                  transfer={transfer}
                  onApprove={handleApproveTransfer}
                  onReject={handleRejectTransfer}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <RefreshCw className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun transfert en cours</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
