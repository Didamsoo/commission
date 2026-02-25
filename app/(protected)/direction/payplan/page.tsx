"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  FileText,
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Car,
  Euro,
  Percent,
  Target,
  AlertCircle,
  Info,
  Download,
  ChevronRight,
  MoreHorizontal,
  BadgeCheck,
  Calculator,
  TrendingUp,
  Shield,
  Loader2
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePayplan } from "@/hooks/use-payplan"
import { apiFetch } from "@/lib/api/client"

// ============================================
// PAYPLAN PAGE PREMIUM - AutoPerf Pro
// ============================================

interface CommissionRule {
  id: string
  name: string
  type: "percentage" | "fixed" | "tiered"
  value: number
  condition?: string
  active: boolean
  category: "base" | "bonus" | "peripheral"
}

interface PayplanRecord {
  id: string
  concession_id: string
  name: string
  config: Record<string, unknown>
  is_active: boolean
  created_by: string
  created_at: string
}

// ---------------------------------------------------------------------------
// Helpers: derive display data from the payplan config coming from the API
// ---------------------------------------------------------------------------

function deriveRulesFromConfig(config: Record<string, unknown>): CommissionRule[] {
  const rules: CommissionRule[] = []

  // Base commissions
  if (config.baseCommissionVO != null) {
    rules.push({
      id: "base-vo",
      name: "Commission base VO",
      type: "percentage",
      value: Number(config.baseCommissionVO),
      condition: "Marge HT",
      active: true,
      category: "base",
    })
  }
  if (config.vnMarginPercentage != null) {
    rules.push({
      id: "base-vn",
      name: "Commission base VN",
      type: "percentage",
      value: Number(config.vnMarginPercentage),
      condition: "Marge HT",
      active: true,
      category: "base",
    })
  }
  if (config.vuCommissionRate != null) {
    rules.push({
      id: "base-vu",
      name: "Commission base VU",
      type: "percentage",
      value: Number(config.vuCommissionRate),
      condition: "Marge HT",
      active: true,
      category: "base",
    })
  }

  // Bonus financement
  if (config.bonusFinancingVO != null) {
    rules.push({
      id: "bonus-financing",
      name: "Bonus financement",
      type: "fixed",
      value: Number(config.bonusFinancingVO),
      condition: "Par dossier financé",
      active: true,
      category: "bonus",
    })
  }

  // Pack commissions
  const packCommissions = config.packCommissions as Record<string, number> | undefined
  if (packCommissions) {
    Object.entries(packCommissions).forEach(([key, val]) => {
      rules.push({
        id: `pack-${key}`,
        name: `Bonus pack ${key}`,
        type: "fixed",
        value: Number(val),
        condition: `Pack livraison ${key}`,
        active: true,
        category: "peripheral",
      })
    })
  }

  // Bonus 60 jours VO
  if (config.bonus60DaysVO != null) {
    rules.push({
      id: "bonus-60days",
      name: "Bonus 60 jours VO",
      type: "fixed",
      value: Number(config.bonus60DaysVO),
      condition: "Vente dans les 60 jours",
      active: true,
      category: "bonus",
    })
  }

  // Bonus prix catalogue VO
  if (config.bonusListedPriceVO != null) {
    rules.push({
      id: "bonus-listed-price",
      name: "Bonus prix catalogue VO",
      type: "fixed",
      value: Number(config.bonusListedPriceVO),
      condition: "Vendu au prix catalogue",
      active: true,
      category: "bonus",
    })
  }

  return rules
}

interface VehicleModel {
  id: string
  name: string
  baseCommission: number
}

function deriveVehicleModelsFromConfig(config: Record<string, unknown>): VehicleModel[] {
  const vpCommissions = config.vpCommissions as Record<string, Record<string, number>> | undefined
  if (!vpCommissions) return []

  return Object.entries(vpCommissions).map(([modelId, commissions]) => {
    // Use the first commission tier value as the displayed base commission
    const values = Object.values(commissions)
    const baseCommission = values.length > 0 ? values[0] : 0
    return {
      id: modelId,
      name: modelId.charAt(0).toUpperCase() + modelId.slice(1),
      baseCommission,
    }
  })
}

interface AccessoryTier {
  label: string
  range: string
  bonus: number
}

function deriveAccessoryTiersFromConfig(config: Record<string, unknown>): AccessoryTier[] {
  const tiers = config.accessoryTiers as {
    tier1?: { min: number; max: number; bonus: number }
    tier2?: { min: number; max: number; bonus: number }
    tier3?: { min: number; bonus: number }
  } | undefined

  if (!tiers) return []

  const result: AccessoryTier[] = []

  if (tiers.tier1) {
    result.push({
      label: "Palier 1",
      range: `${tiers.tier1.min}€ - ${tiers.tier1.max}€ TTC`,
      bonus: tiers.tier1.bonus,
    })
  }
  if (tiers.tier2) {
    result.push({
      label: "Palier 2",
      range: `${tiers.tier2.min}€ - ${tiers.tier2.max}€ TTC`,
      bonus: tiers.tier2.bonus,
    })
  }
  if (tiers.tier3) {
    result.push({
      label: "Palier 3",
      range: `${tiers.tier3.min}€ et plus TTC`,
      bonus: tiers.tier3.bonus,
    })
  }

  return result
}

interface ChallengeBonusItem {
  key: string
  label: string
  description: string
  value: number
  icon: "target" | "percent" | "euro"
  gradient: { from: string; to: string; border: string; text: string; iconFrom: string; iconTo: string }
}

function deriveChallengesFromConfig(config: Record<string, unknown>): ChallengeBonusItem[] {
  const financialPenetrationBonuses = config.financialPenetrationBonuses as Record<string, Record<string, number>> | undefined
  const financingBonus = config.financingBonus as Record<string, number> | undefined

  const challenges: ChallengeBonusItem[] = []

  // Sales count challenge (from financialPenetrationBonuses)
  if (financialPenetrationBonuses) {
    const values = Object.values(financialPenetrationBonuses)
    const totalBonus = values.reduce((sum, tier) => {
      return sum + Object.values(tier).reduce((s, v) => s + v, 0)
    }, 0)
    if (totalBonus > 0) {
      challenges.push({
        key: "salesCount",
        label: "Objectif de ventes",
        description: "Atteindre le nombre de ventes ciblé",
        value: totalBonus,
        icon: "target",
        gradient: {
          from: "from-amber-50", to: "to-orange-50", border: "border-amber-200",
          text: "text-amber-600", iconFrom: "from-amber-400", iconTo: "to-orange-500",
        },
      })
    }
  }

  // Financing rate challenge
  if (financingBonus) {
    const totalFinBonus = Object.values(financingBonus).reduce((s, v) => s + v, 0)
    if (totalFinBonus > 0) {
      challenges.push({
        key: "financingRate",
        label: "Taux de financement",
        description: "Atteindre le taux de financement cible",
        value: totalFinBonus,
        icon: "percent",
        gradient: {
          from: "from-blue-50", to: "to-indigo-50", border: "border-blue-200",
          text: "text-blue-600", iconFrom: "from-blue-400", iconTo: "to-indigo-500",
        },
      })
    }
  }

  // Margin target challenge (maintenanceContractCommission as proxy)
  const maintenanceVal = Number(config.maintenanceContractCommission ?? 0) + Number(config.maintenanceContractCommissionHighPenetration ?? 0)
  if (maintenanceVal > 0) {
    challenges.push({
      key: "marginTarget",
      label: "Objectif de marge",
      description: "Atteindre la marge totale ciblée",
      value: maintenanceVal,
      icon: "euro",
      gradient: {
        from: "from-emerald-50", to: "to-teal-50", border: "border-emerald-200",
        text: "text-emerald-600", iconFrom: "from-emerald-400", iconTo: "to-teal-500",
      },
    })
  }

  return challenges
}

// ---------------------------------------------------------------------------
// Helper: build an updated config object from the current rules state
// ---------------------------------------------------------------------------

function buildConfigFromRules(
  originalConfig: Record<string, unknown>,
  rules: CommissionRule[]
): Record<string, unknown> {
  const config = { ...originalConfig }

  for (const rule of rules) {
    switch (rule.id) {
      case "base-vo":
        config.baseCommissionVO = rule.active ? rule.value : 0
        break
      case "base-vn":
        config.vnMarginPercentage = rule.active ? rule.value : 0
        break
      case "base-vu":
        config.vuCommissionRate = rule.active ? rule.value : 0
        break
      case "bonus-financing":
        config.bonusFinancingVO = rule.active ? rule.value : 0
        break
      case "bonus-60days":
        config.bonus60DaysVO = rule.active ? rule.value : 0
        break
      case "bonus-listed-price":
        config.bonusListedPriceVO = rule.active ? rule.value : 0
        break
      default:
        if (rule.id.startsWith("pack-")) {
          const packKey = rule.id.replace("pack-", "")
          const packCommissions = (config.packCommissions as Record<string, number>) ?? {}
          packCommissions[packKey] = rule.active ? rule.value : 0
          config.packCommissions = packCommissions
        }
        break
    }
  }

  return config
}

// ============================================
// COMPONENT
// ============================================

export default function PayplanPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showNewRuleDialog, setShowNewRuleDialog] = useState(false)
  const [rules, setRules] = useState<CommissionRule[]>([])
  const [hasChanges, setHasChanges] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const { data: payplanData, loading, error: fetchError, refetch } = usePayplan()

  // Active payplan record (first active or first in the list)
  const payplan: PayplanRecord | null =
    (payplanData as PayplanRecord[] | null)?.find((p) => p.is_active) ??
    (payplanData as PayplanRecord[] | null)?.[0] ??
    null

  const config = (payplan?.config ?? {}) as Record<string, unknown>

  // Derive display data from the API config
  const vehicleModels = deriveVehicleModelsFromConfig(config)
  const accessoryTiers = deriveAccessoryTiersFromConfig(config)
  const challenges = deriveChallengesFromConfig(config)

  // Sync rules state whenever the payplan config changes
  useEffect(() => {
    if (payplan) {
      setRules(deriveRulesFromConfig(config))
      setHasChanges(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payplan?.id, payplan?.config])

  const toggleRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId ? { ...rule, active: !rule.active } : rule
      )
    )
    setHasChanges(true)
  }

  // ---- Save handler: PUT /api/payplan/[id] ----
  const handleSave = useCallback(async () => {
    if (!payplan) return

    setSaving(true)
    setSaveError(null)

    try {
      const updatedConfig = buildConfigFromRules(config, rules)

      await apiFetch(`/api/payplan/${payplan.id}`, {
        method: "PUT",
        body: JSON.stringify({ config: updatedConfig }),
      })

      setHasChanges(false)
      setShowSaveDialog(false)
      refetch()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur lors de la sauvegarde"
      setSaveError(message)
    } finally {
      setSaving(false)
    }
  }, [payplan, config, rules, refetch])

  const baseRules = rules.filter((r) => r.category === "base")
  const bonusRules = rules.filter((r) => r.category === "bonus")
  const peripheralRules = rules.filter((r) => r.category === "peripheral")

  // ---- Loading state ----
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  // ---- Error state ----
  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-gray-600">{fetchError.message}</p>
        <Button variant="outline" onClick={refetch}>
          Réessayer
        </Button>
      </div>
    )
  }

  // ---- Empty state (no payplan found) ----
  if (!payplan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Info className="w-12 h-12 text-gray-400" />
        <p className="text-gray-600">Aucun payplan configuré pour cette concession.</p>
        <Link href="/direction">
          <Button variant="outline">Retour</Button>
        </Link>
      </div>
    )
  }

  // ---- Challenge icon helper ----
  const ChallengeIcon = ({ icon }: { icon: "target" | "percent" | "euro" }) => {
    switch (icon) {
      case "target":
        return <Target className="w-7 h-7 text-white" />
      case "percent":
        return <Percent className="w-7 h-7 text-white" />
      case "euro":
        return <Euro className="w-7 h-7 text-white" />
    }
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
                <Calculator className="w-8 h-8 text-blue-600" />
                Configuration Payplan
              </h1>
              <p className="text-gray-600">Gérez les règles de commissionnement</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <Badge className="bg-amber-100 text-amber-700 border-amber-200">
              <AlertCircle className="w-3 h-3 mr-1" />
              Modifications non sauvegardées
            </Badge>
          )}
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
          <Button
            className="bg-gradient-to-r from-blue-600 to-indigo-600 gap-2"
            onClick={() => setShowSaveDialog(true)}
          >
            <Save className="w-4 h-4" />
            Sauvegarder
          </Button>
        </div>
      </div>

      {/* ============================================
          INFO BANNER
          ============================================ */}
      <Card className="border-0 shadow-premium bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 animate-fade-in-up opacity-0-initial" style={{ animationFillMode: "forwards", animationDelay: "100ms" }}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
              <Info className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Comment fonctionne le payplan ?</h3>
              <p className="text-gray-600 leading-relaxed">
                Le payplan détermine comment les commissions sont calculées pour vos commerciaux.
                Vous pouvez configurer des commissions de base, des bonus sur le financement, les packs,
                et des récompenses pour les challenges. Les modifications sont appliquées immédiatement
                aux nouvelles ventes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============================================
          MAIN CONTENT TABS
          ============================================ */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in-up opacity-0-initial" style={{ animationFillMode: "forwards", animationDelay: "200ms" }}>
        <TabsList className="bg-gray-100 p-1">
          <TabsTrigger value="general" className="gap-2">
            <FileText className="w-4 h-4" />
            Règles générales
          </TabsTrigger>
          <TabsTrigger value="models" className="gap-2">
            <Car className="w-4 h-4" />
            Par modèle
          </TabsTrigger>
          <TabsTrigger value="accessories" className="gap-2">
            <Plus className="w-4 h-4" />
            Accessoires
          </TabsTrigger>
          <TabsTrigger value="challenges" className="gap-2">
            <Target className="w-4 h-4" />
            Challenges
          </TabsTrigger>
        </TabsList>

        {/* General Rules Tab */}
        <TabsContent value="general" className="mt-6 space-y-6">
          {/* Base Commission Card */}
          <Card className="border-0 shadow-premium">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Percent className="w-5 h-5 text-blue-600" />
                    Commissions de base
                  </CardTitle>
                  <CardDescription>Pourcentage appliqué sur la marge HT</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowNewRuleDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une règle
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4">
                {baseRules.map((rule) => (
                  <div key={rule.id} className={`p-5 rounded-xl border-2 transition-all ${
                    rule.active ? "border-blue-200 bg-blue-50/50" : "border-gray-200 bg-gray-50 opacity-60"
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{rule.name}</h4>
                      <Switch
                        checked={rule.active}
                        onCheckedChange={() => toggleRule(rule.id)}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Taux</span>
                        <span className="text-2xl font-bold text-blue-600">{rule.value}%</span>
                      </div>
                      <p className="text-xs text-gray-400">{rule.condition}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bonus Rules */}
          <Card className="border-0 shadow-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Bonus & Primes
              </CardTitle>
              <CardDescription>Montants fixes additionnels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bonusRules.map((rule) => (
                  <div key={rule.id} className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    rule.active ? "border-emerald-200 bg-emerald-50/30" : "border-gray-200 bg-gray-50 opacity-60"
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        rule.active ? "bg-emerald-100" : "bg-gray-200"
                      }`}>
                        <Euro className={`w-5 h-5 ${rule.active ? "text-emerald-600" : "text-gray-400"}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{rule.name}</h4>
                        <p className="text-sm text-gray-500">{rule.condition}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-emerald-600">{rule.value}€</span>
                      <Switch
                        checked={rule.active}
                        onCheckedChange={() => toggleRule(rule.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Peripheral Rules */}
          <Card className="border-0 shadow-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-600" />
                Packs & Périphériques
              </CardTitle>
              <CardDescription>Commission sur les produits annexes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {peripheralRules.map((rule) => (
                  <div key={rule.id} className={`p-5 rounded-xl border-2 transition-all ${
                    rule.active ? "border-purple-200 bg-purple-50/30" : "border-gray-200 bg-gray-50 opacity-60"
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{rule.name}</h4>
                      <Switch
                        checked={rule.active}
                        onCheckedChange={() => toggleRule(rule.id)}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{rule.condition}</p>
                    <p className="text-2xl font-bold text-purple-600">{rule.value}€</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Models Tab */}
        <TabsContent value="models" className="mt-6">
          <Card className="border-0 shadow-premium">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="w-5 h-5 text-blue-600" />
                    Commission par modèle
                  </CardTitle>
                  <CardDescription>Montants fixes spécifiques par véhicule</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un modèle
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {vehicleModels.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-8">Aucun modèle configuré dans le payplan.</p>
                )}
                {vehicleModels.map((model) => (
                  <div key={model.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <Car className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{model.name}</h4>
                        <Badge variant="secondary" className="mt-1">Commission fixe</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">{model.baseCommission}€</p>
                        <p className="text-xs text-gray-500">par vente</p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accessories Tab */}
        <TabsContent value="accessories" className="mt-6">
          <Card className="border-0 shadow-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-600" />
                Barème accessoires
              </CardTitle>
              <CardDescription>Commission selon le montant des accessoires vendus</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-6">
                {accessoryTiers.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-8 col-span-3">Aucun palier accessoires configuré dans le payplan.</p>
                )}
                {accessoryTiers.map((tier, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                    <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center mb-4">
                      <span className="text-white font-bold">{idx + 1}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">{tier.label}</h4>
                    <p className="text-sm text-gray-600 mb-4">{tier.range}</p>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold text-purple-600">{tier.bonus}€</span>
                      <span className="text-sm text-gray-500 mb-1">de commission</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Challenges Tab */}
        <TabsContent value="challenges" className="mt-6">
          <Card className="border-0 shadow-premium">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-amber-600" />
                    Récompenses challenges
                  </CardTitle>
                  <CardDescription>Montants des bonus pour les défis</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau challenge
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {challenges.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-8">Aucun challenge configuré dans le payplan.</p>
                )}
                {challenges.map((challenge) => (
                  <div
                    key={challenge.key}
                    className={`flex items-center justify-between p-5 rounded-xl bg-gradient-to-r ${challenge.gradient.from} ${challenge.gradient.to} border ${challenge.gradient.border}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${challenge.gradient.iconFrom} ${challenge.gradient.iconTo} flex items-center justify-center`}>
                        <ChallengeIcon icon={challenge.icon} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{challenge.label}</h4>
                        <p className="text-sm text-gray-600">{challenge.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-3xl font-bold ${challenge.gradient.text}`}>{challenge.value}€</span>
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ============================================
          DIALOGS
          ============================================ */}

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Save className="w-5 h-5 text-blue-600" />
              Sauvegarder les modifications
            </DialogTitle>
            <DialogDescription>
              Les nouvelles règles seront appliquées immédiatement aux prochaines ventes.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800">Attention</p>
                  <p className="text-sm text-amber-600">
                    Les ventes déjà validées ne seront pas recalculées.
                    Les modifications affectent uniquement les nouvelles ventes.
                  </p>
                </div>
              </div>
            </div>
            {saveError && (
              <div className="mt-3 p-4 rounded-xl bg-red-50 border border-red-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-800">Erreur</p>
                    <p className="text-sm text-red-600">{saveError}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)} disabled={saving}>
              Annuler
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4 mr-2" />
              )}
              {saving ? "Sauvegarde..." : "Confirmer la sauvegarde"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Rule Dialog */}
      <Dialog open={showNewRuleDialog} onOpenChange={setShowNewRuleDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Nouvelle règle de commission
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nom de la règle</Label>
              <Input placeholder="Ex: Bonus véhicule électrique" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select defaultValue="fixed">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Pourcentage</SelectItem>
                    <SelectItem value="fixed">Montant fixe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Valeur</Label>
                <Input type="number" placeholder="100" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Condition</Label>
              <Input placeholder="Ex: Pour tout véhicule électrique" />
            </div>
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select defaultValue="bonus">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="base">Commission base</SelectItem>
                  <SelectItem value="bonus">Bonus</SelectItem>
                  <SelectItem value="peripheral">Périphérique</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewRuleDialog(false)}>
              Annuler
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
              <Plus className="w-4 h-4 mr-2" />
              Créer la règle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
