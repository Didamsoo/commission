"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Car,
  User,
  Euro,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Package,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  AlertCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useApprobations, reviewApproval } from "@/hooks/use-approbations"

const vehicleTypeConfig: Record<string, { label: string; color: string; icon: string }> = {
  VN: { label: "Véhicule Neuf", color: "bg-emerald-100 text-emerald-700", icon: "🚗" },
  VO: { label: "Occasion", color: "bg-blue-100 text-blue-700", icon: "🚙" },
  VU: { label: "Utilitaire", color: "bg-purple-100 text-purple-700", icon: "🚐" },
}

export default function ApprovalDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: approbations, loading, refetch } = useApprobations()
  const [rejectReason, setRejectReason] = useState("")
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const sale = useMemo(() => {
    if (!approbations || !id) return null
    return (approbations as Record<string, unknown>[]).find(
      (a) => a.id === id
    ) as Record<string, unknown> | undefined
  }, [approbations, id])

  const handleApprove = async () => {
    if (!id) return
    setSubmitting(true)
    try {
      await reviewApproval(id, { status: "approved" })
      router.push("/direction/approvals")
    } catch {
      setSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (!id || !rejectReason.trim()) return
    setSubmitting(true)
    try {
      await reviewApproval(id, { status: "rejected", comment: rejectReason })
      router.push("/direction/approvals")
    } catch {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!sale) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="w-16 h-16 text-gray-300" />
        <p className="text-lg font-medium text-gray-500">Vente introuvable</p>
        <Link href="/direction/approvals">
          <Button variant="outline">Retour aux approbations</Button>
        </Link>
      </div>
    )
  }

  const vehicleName = sale.vehicle_name as string || "Véhicule"
  const vehicleType = sale.vehicle_type as string || "VN"
  const vehicleNumber = sale.vehicle_number as string || ""
  const clientName = sale.client_name as string || "Client"
  const sellerName = sale.seller_name as string || "Vendeur"
  const purchasePrice = sale.purchase_price as number || 0
  const sellingPrice = sale.selling_price as number || 0
  const margin = sale.margin as number || 0
  const commission = sale.commission as number || 0
  const marginRate = sale.margin_rate as number || 0
  const hasFinancing = sale.has_financing as boolean || false
  const financedAmount = sale.financed_amount as number || 0
  const hasAccessories = sale.has_accessories as boolean || false
  const accessoryAmount = sale.accessory_amount as number || 0
  const createdAt = sale.created_at as string || ""
  const status = sale.status as string || "pending"
  const rejectionReason = sale.rejection_reason as string || ""

  const config = vehicleTypeConfig[vehicleType] || vehicleTypeConfig.VN

  const statusConfig = {
    pending: { label: "En attente", color: "bg-amber-100 text-amber-700", icon: Clock },
    approved: { label: "Approuvée", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
    rejected: { label: "Rejetée", color: "bg-red-100 text-red-700", icon: XCircle },
  }
  const sc = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
  const StatusIcon = sc.icon

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/direction/approvals">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{vehicleName}</h1>
                <Badge className={config.color}>{config.label}</Badge>
                <Badge className={sc.color}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {sc.label}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">
                N° {vehicleNumber} • Soumise le {createdAt ? new Date(createdAt).toLocaleDateString("fr-FR") : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Seller & Client */}
        <Card className="border-0 shadow-premium">
          <CardHeader>
            <CardTitle className="text-base">Vendeur & Client</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                  {sellerName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-900">{sellerName}</p>
                <p className="text-sm text-blue-600">Vendeur</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{clientName}</p>
                <p className="text-sm text-gray-500">Client</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card className="border-0 shadow-premium">
          <CardHeader>
            <CardTitle className="text-base">Tarification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Prix d&apos;achat</span>
              <span className="font-semibold">{purchasePrice.toLocaleString()}€</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Prix de vente</span>
              <span className="font-semibold">{sellingPrice.toLocaleString()}€</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Marge brute</span>
              <span className="font-bold text-lg text-emerald-600">{margin.toLocaleString()}€</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Taux de marge</span>
              <Badge variant="secondary">{marginRate.toFixed(1)}%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Commission vendeur</span>
              <span className="font-semibold text-blue-600">{commission.toLocaleString()}€</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-premium">
          <CardContent className="p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${hasFinancing ? "bg-gradient-to-br from-emerald-500 to-green-600" : "bg-gray-200"}`}>
              <CreditCard className={`w-5 h-5 ${hasFinancing ? "text-white" : "text-gray-400"}`} />
            </div>
            <div>
              <p className="font-medium text-gray-900">Financement</p>
              {hasFinancing ? (
                <p className="text-sm text-emerald-600">Oui — {financedAmount.toLocaleString()}€ financés</p>
              ) : (
                <p className="text-sm text-gray-400">Non</p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-premium">
          <CardContent className="p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${hasAccessories ? "bg-gradient-to-br from-purple-500 to-violet-600" : "bg-gray-200"}`}>
              <Package className={`w-5 h-5 ${hasAccessories ? "text-white" : "text-gray-400"}`} />
            </div>
            <div>
              <p className="font-medium text-gray-900">Accessoires</p>
              {hasAccessories ? (
                <p className="text-sm text-purple-600">Oui — {accessoryAmount.toLocaleString()}€</p>
              ) : (
                <p className="text-sm text-gray-400">Non</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rejection Reason (if rejected) */}
      {status === "rejected" && rejectionReason && (
        <Card className="border-0 shadow-premium border-l-4 border-l-red-500">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-700">Motif du rejet</p>
                <p className="text-sm text-gray-600 mt-1">{rejectionReason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions (only if pending) */}
      {status === "pending" && (
        <Card className="border-0 shadow-premium">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">Actions</h3>

            {showRejectForm ? (
              <div className="space-y-3">
                <Textarea
                  placeholder="Motif du rejet..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex gap-3">
                  <Button
                    variant="destructive"
                    className="gap-2"
                    onClick={handleReject}
                    disabled={!rejectReason.trim() || submitting}
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ThumbsDown className="w-4 h-4" />}
                    Confirmer le rejet
                  </Button>
                  <Button variant="outline" onClick={() => setShowRejectForm(false)} disabled={submitting}>
                    Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <Button
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleApprove}
                  disabled={submitting}
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ThumbsUp className="w-4 h-4" />}
                  Approuver
                </Button>
                <Button
                  variant="destructive"
                  className="gap-2"
                  onClick={() => setShowRejectForm(true)}
                  disabled={submitting}
                >
                  <ThumbsDown className="w-4 h-4" />
                  Rejeter
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
