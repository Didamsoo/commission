"use client"

import { useState } from "react"
import Link from "next/link"
import {
  FileText,
  Download,
  Calendar,
  ChevronRight,
  ArrowLeft,
  FileSpreadsheet,
  FilePieChart,
  FileBarChart,
  Clock,
  CheckCircle,
  Eye,
  Printer,
  Mail,
  Share2,
  Filter,
  Search,
  Plus,
  Globe,
  BarChart3,
  TrendingUp,
  Users,
  Building
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  brands,
  groupKPIs,
  groupPL
} from "@/lib/mock-dir-plaque-data"

// Mock reports data
const reports = [
  {
    id: "r1",
    title: "Rapport Board Q1 2024",
    description: "Synthèse trimestrielle pour le conseil d'administration",
    type: "board",
    format: "pdf",
    status: "ready",
    createdAt: "2024-02-20T10:00:00Z",
    size: "2.4 MB"
  },
  {
    id: "r2",
    title: "P&L Consolidé Février 2024",
    description: "Compte de résultat mensuel toutes marques",
    type: "financial",
    format: "excel",
    status: "ready",
    createdAt: "2024-02-19T14:30:00Z",
    size: "1.8 MB"
  },
  {
    id: "r3",
    title: "Performance Commerciale S07",
    description: "Indicateurs hebdomadaires de vente",
    type: "sales",
    format: "pdf",
    status: "ready",
    createdAt: "2024-02-18T09:00:00Z",
    size: "856 KB"
  },
  {
    id: "r4",
    title: "Benchmark Concurrents",
    description: "Analyse comparative du marché régional",
    type: "market",
    format: "pptx",
    status: "ready",
    createdAt: "2024-02-15T16:00:00Z",
    size: "5.2 MB"
  },
  {
    id: "r5",
    title: "Rapport RH - Effectifs",
    description: "Synthèse des effectifs et turnover par marque",
    type: "hr",
    format: "excel",
    status: "generating",
    createdAt: "2024-02-20T11:30:00Z",
    size: "-"
  }
]

const reportTemplates = [
  {
    id: "t1",
    title: "Rapport Board",
    description: "Synthèse executive pour le CA",
    icon: FilePieChart,
    frequency: "Trimestriel"
  },
  {
    id: "t2",
    title: "P&L Mensuel",
    description: "Compte de résultat consolidé",
    icon: FileSpreadsheet,
    frequency: "Mensuel"
  },
  {
    id: "t3",
    title: "Performance Ventes",
    description: "KPIs commerciaux détaillés",
    icon: FileBarChart,
    frequency: "Hebdomadaire"
  },
  {
    id: "t4",
    title: "Analyse Marché",
    description: "Parts de marché et tendances",
    icon: BarChart3,
    frequency: "Mensuel"
  }
]

function ReportCard({ report }: { report: typeof reports[0] }) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "board": return "bg-purple-100 text-purple-700"
      case "financial": return "bg-emerald-100 text-emerald-700"
      case "sales": return "bg-blue-100 text-blue-700"
      case "market": return "bg-amber-100 text-amber-700"
      case "hr": return "bg-pink-100 text-pink-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "pdf": return <FileText className="w-5 h-5 text-red-500" />
      case "excel": return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
      case "pptx": return <FilePieChart className="w-5 h-5 text-orange-500" />
      default: return <FileText className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <Card className="border-0 shadow-premium hover:shadow-xl transition-all">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
            {getFormatIcon(report.format)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-gray-900 truncate">{report.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-1">{report.description}</p>
              </div>
              <Badge className={getTypeColor(report.type)}>
                {report.type === "board" ? "Board" :
                 report.type === "financial" ? "Finance" :
                 report.type === "sales" ? "Ventes" :
                 report.type === "market" ? "Marché" :
                 "RH"}
              </Badge>
            </div>

            <div className="flex items-center gap-4 mt-3">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(report.createdAt).toLocaleDateString("fr-FR")}
              </span>
              <span className="text-xs text-gray-400">{report.size}</span>
              {report.status === "ready" ? (
                <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Prêt
                </Badge>
              ) : (
                <Badge className="bg-blue-100 text-blue-700 text-xs">
                  <Clock className="w-3 h-3 mr-1 animate-spin" />
                  Génération...
                </Badge>
              )}
            </div>
          </div>
        </div>

        {report.status === "ready" && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t">
            <Button variant="outline" size="sm" className="gap-1 flex-1">
              <Eye className="w-4 h-4" />
              Aperçu
            </Button>
            <Button variant="outline" size="sm" className="gap-1 flex-1">
              <Download className="w-4 h-4" />
              Télécharger
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function TemplateCard({ template }: { template: typeof reportTemplates[0] }) {
  const Icon = template.icon

  return (
    <Card className="border-0 shadow-premium hover:shadow-xl transition-all cursor-pointer group">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{template.title}</h3>
            <p className="text-sm text-gray-500">{template.description}</p>
            <Badge className="bg-gray-100 text-gray-600 mt-2">
              {template.frequency}
            </Badge>
          </div>
        </div>
        <Button className="w-full mt-4 gap-2">
          <Plus className="w-4 h-4" />
          Générer
        </Button>
      </CardContent>
    </Card>
  )
}

function QuickStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-0 shadow-premium">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Building className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{brands.length}</p>
              <p className="text-xs text-gray-500">Marques</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-premium">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{groupKPIs.volume.current}</p>
              <p className="text-xs text-gray-500">Ventes ce mois</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-premium">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{groupKPIs.volume.objectiveRate}%</p>
              <p className="text-xs text-gray-500">Taux objectif</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-premium">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{groupKPIs.workforce.total}</p>
              <p className="text-xs text-gray-500">Collaborateurs</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function GroupeReportsPage() {
  const [tab, setTab] = useState<"reports" | "templates" | "scheduled">("reports")
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredReports = reports.filter(r => {
    if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false
    if (typeFilter !== "all" && r.type !== typeFilter) return false
    return true
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/groupe" className="hover:text-gray-700 flex items-center gap-1">
              <Globe className="w-4 h-4" />
              Groupe AutoPerf
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Rapports</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            Rapports & Exports
          </h1>
          <p className="text-gray-500 mt-1">
            Générez et téléchargez les rapports du groupe
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Printer className="w-4 h-4" />
            Imprimer
          </Button>
          <Button variant="outline" className="gap-2">
            <Mail className="w-4 h-4" />
            Envoyer
          </Button>
          <Link href="/groupe">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStats />

      {/* Main Content */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="bg-gray-100 p-1">
          <TabsTrigger value="reports" className="gap-2">
            <FileText className="w-4 h-4" />
            Rapports générés
          </TabsTrigger>
          <TabsTrigger value="templates" className="gap-2">
            <Plus className="w-4 h-4" />
            Nouveaux rapports
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="gap-2">
            <Calendar className="w-4 h-4" />
            Programmés
          </TabsTrigger>
        </TabsList>

        {/* Reports Tab */}
        <TabsContent value="reports" className="mt-6 space-y-6">
          {/* Filters */}
          <Card className="border-0 shadow-premium">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Rechercher un rapport..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous types</SelectItem>
                    <SelectItem value="board">Board</SelectItem>
                    <SelectItem value="financial">Finance</SelectItem>
                    <SelectItem value="sales">Ventes</SelectItem>
                    <SelectItem value="market">Marché</SelectItem>
                    <SelectItem value="hr">RH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Reports Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {filteredReports.map(report => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>

          {filteredReports.length === 0 && (
            <Card className="border-0 shadow-premium">
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Aucun rapport trouvé</h3>
                <p className="text-gray-500">Modifiez vos filtres ou générez un nouveau rapport.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Modèles de rapport</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportTemplates.map(template => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>

          {/* Custom Report */}
          <Card className="border-0 shadow-premium">
            <CardHeader>
              <CardTitle>Rapport personnalisé</CardTitle>
              <CardDescription>Créez un rapport sur mesure avec vos indicateurs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Période</label>
                  <Select defaultValue="month">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Semaine</SelectItem>
                      <SelectItem value="month">Mois</SelectItem>
                      <SelectItem value="quarter">Trimestre</SelectItem>
                      <SelectItem value="year">Année</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Marques</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les marques</SelectItem>
                      {brands.map(b => (
                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Format</label>
                  <Select defaultValue="pdf">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="pptx">PowerPoint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button className="mt-6 gap-2">
                <Plus className="w-4 h-4" />
                Générer le rapport
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scheduled Tab */}
        <TabsContent value="scheduled" className="mt-6 space-y-6">
          <Card className="border-0 shadow-premium">
            <CardHeader>
              <CardTitle>Rapports programmés</CardTitle>
              <CardDescription>Rapports générés automatiquement selon un calendrier</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                      <FilePieChart className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Rapport Board</h4>
                      <p className="text-sm text-gray-500">Tous les trimestres, le 1er du mois</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-100 text-emerald-700">Actif</Badge>
                    <Button variant="outline" size="sm">Modifier</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">P&L Mensuel</h4>
                      <p className="text-sm text-gray-500">Le 5 de chaque mois</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-100 text-emerald-700">Actif</Badge>
                    <Button variant="outline" size="sm">Modifier</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <FileBarChart className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Performance Hebdo</h4>
                      <p className="text-sm text-gray-500">Chaque lundi à 8h</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-100 text-emerald-700">Actif</Badge>
                    <Button variant="outline" size="sm">Modifier</Button>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="mt-4 gap-2">
                <Plus className="w-4 h-4" />
                Programmer un nouveau rapport
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
