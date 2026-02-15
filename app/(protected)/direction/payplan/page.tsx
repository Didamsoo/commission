"use client"

import { useState } from "react"
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
  Shield
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

const mockPayplanConfig = {
  baseCommission: {
    VO: 15,
    VN: 12,
    VU: 10
  },
  financingBonus: 150,
  accessoryBonus: {
    tier1: { min: 50, max: 250, value: 10 },
    tier2: { min: 251, max: 800, value: 50 },
    tier3: { min: 801, max: Infinity, value: 75 }
  },
  packBonuses: {
    pack1: 0,
    pack2: 20,
    pack3: 35
  },
  challengeBonuses: {
    salesCount: 500,
    financingRate: 300,
    marginTarget: 750
  }
}

const commissionRules: CommissionRule[] = [
  { id: "1", name: "Commission base VO", type: "percentage", value: 15, condition: "Marge HT", active: true, category: "base" },
  { id: "2", name: "Commission base VN", type: "percentage", value: 12, condition: "Marge HT", active: true, category: "base" },
  { id: "3", name: "Commission base VU", type: "percentage", value: 10, condition: "Marge HT", active: true, category: "base" },
  { id: "4", name: "Bonus financement", type: "fixed", value: 150, condition: "Par dossier financé", active: true, category: "bonus" },
  { id: "5", name: "Bonus pack 2", type: "fixed", value: 20, condition: "Pack livraison 2", active: true, category: "peripheral" },
  { id: "6", name: "Bonus pack 3", type: "fixed", value: 35, condition: "Pack livraison 3", active: true, category: "peripheral" },
  { id: "7", name: "Bonus pénétration", type: "fixed", value: 100, condition: "Si taux > 65%", active: true, category: "bonus" }
]

const vehicleModels = [
  { id: "puma", name: "Ford Puma", baseCommission: 200 },
  { id: "kuga", name: "Ford Kuga", baseCommission: 250 },
  { id: "focus", name: "Ford Focus", baseCommission: 180 },
  { id: "fiesta", name: "Ford Fiesta", baseCommission: 150 },
  { id: "explorer", name: "Ford Explorer", baseCommission: 400 },
  { id: "transit", name: "Ford Transit", baseCommission: 300 }
]

export default function PayplanPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showNewRuleDialog, setShowNewRuleDialog] = useState(false)
  const [rules, setRules] = useState<CommissionRule[]>(commissionRules)
  const [hasChanges, setHasChanges] = useState(false)

  const toggleRule = (ruleId: string) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, active: !rule.active } : rule
    ))
    setHasChanges(true)
  }

  const baseRules = rules.filter(r => r.category === "base")
  const bonusRules = rules.filter(r => r.category === "bonus")
  const peripheralRules = rules.filter(r => r.category === "peripheral")

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
                <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                  <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center mb-4">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Palier 1</h4>
                  <p className="text-sm text-gray-600 mb-4">50€ - 250€ TTC</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-purple-600">10€</span>
                    <span className="text-sm text-gray-500 mb-1">de commission</span>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                  <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center mb-4">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Palier 2</h4>
                  <p className="text-sm text-gray-600 mb-4">251€ - 800€ TTC</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-purple-600">50€</span>
                    <span className="text-sm text-gray-500 mb-1">de commission</span>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                  <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center mb-4">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Palier 3</h4>
                  <p className="text-sm text-gray-600 mb-4">801€ et plus TTC</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-purple-600">75€</span>
                    <span className="text-sm text-gray-500 mb-1">de commission</span>
                  </div>
                </div>
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
                <div className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <Target className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Objectif de ventes</h4>
                      <p className="text-sm text-gray-600">Atteindre le nombre de ventes ciblé</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-amber-600">500€</span>
                    <Button variant="ghost" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                      <Percent className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Taux de financement</h4>
                      <p className="text-sm text-gray-600">Atteindre le taux de financement cible</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-blue-600">300€</span>
                    <Button variant="ghost" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                      <Euro className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Objectif de marge</h4>
                      <p className="text-sm text-gray-600">Atteindre la marge totale ciblée</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-emerald-600">750€</span>
                    <Button variant="ghost" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Annuler
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-indigo-600"
              onClick={() => { setHasChanges(false); setShowSaveDialog(false); }}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Confirmer la sauvegarde
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
