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
  Clock,
  CheckCircle,
  Eye,
  Printer,
  Share2,
  Filter,
  Search,
  Plus,
  Building2,
  BarChart3,
  Loader2
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
import { useDashboard } from "@/hooks/use-dashboard"

// Brand-level report templates
const brandReports = [
  { id: "1", title: "Synthèse mensuelle marque", description: "Performance consolidée de toutes les concessions", type: "sales", format: "pdf", createdAt: "2026-02-20", size: "2.4 MB", status: "ready" },
  { id: "2", title: "Benchmark concessions", description: "Comparaison détaillée entre concessions", type: "market", format: "excel", createdAt: "2026-02-18", size: "3.1 MB", status: "ready" },
  { id: "3", title: "Rapport stocks réseau", description: "État des stocks par concession et vieillissement", type: "financial", format: "excel", createdAt: "2026-02-15", size: "1.8 MB", status: "ready" },
  { id: "4", title: "Suivi objectifs constructeur", description: "Avancement des 5 axes constructeur", type: "board", format: "pdf", createdAt: "2026-02-10", size: "1.2 MB", status: "ready" },
]

const brandTemplates = [
  { id: "1", title: "Rapport mensuel réseau", description: "Synthèse automatique de toutes les concessions", icon: Building2, frequency: "Mensuel" },
  { id: "2", title: "Benchmark performance", description: "Comparatif concessions avec classement", icon: BarChart3, frequency: "Hebdomadaire" },
  { id: "3", title: "État des stocks", description: "Inventaire réseau avec vieillissement", icon: FileSpreadsheet, frequency: "Quotidien" },
]

function ReportCard({ report }: { report: typeof brandReports[0] }) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "board": return "bg-purple-100 text-purple-700"
      case "financial": return "bg-emerald-100 text-emerald-700"
      case "sales": return "bg-blue-100 text-blue-700"
      case "market": return "bg-amber-100 text-amber-700"
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
                 report.type === "sales" ? "Ventes" : "Marché"}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(report.createdAt).toLocaleDateString("fr-FR")}
              </span>
              <span className="text-xs text-gray-400">{report.size}</span>
              <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                Prêt
              </Badge>
            </div>
          </div>
        </div>
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
      </CardContent>
    </Card>
  )
}

function TemplateCard({ template }: { template: typeof brandTemplates[0] }) {
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
            <Badge className="bg-gray-100 text-gray-600 mt-2">{template.frequency}</Badge>
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

export default function MarqueReportsPage() {
  const { loading } = useDashboard("dir_marque")
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredReports = brandReports.filter(r => {
    const matchesSearch = !searchQuery || r.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || r.type === typeFilter
    return matchesSearch && matchesType
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/marque">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Rapports Marque</h1>
              <p className="text-sm text-gray-500">Rapports et exports réseau</p>
            </div>
          </div>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nouveau rapport
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="reports">
        <TabsList>
          <TabsTrigger value="reports" className="gap-2">
            <FileText className="w-4 h-4" />
            Rapports
          </TabsTrigger>
          <TabsTrigger value="templates" className="gap-2">
            <FilePieChart className="w-4 h-4" />
            Modèles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="mt-6 space-y-6">
          {/* Filters */}
          <div className="flex gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher un rapport..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-44">
                <Filter className="w-4 h-4 mr-2 text-gray-400" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="sales">Ventes</SelectItem>
                <SelectItem value="financial">Finance</SelectItem>
                <SelectItem value="market">Marché</SelectItem>
                <SelectItem value="board">Board</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReports.map(report => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {brandTemplates.map(template => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
