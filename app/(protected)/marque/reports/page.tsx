"use client"

import { useState, useMemo, useCallback } from "react"
import Link from "next/link"
import {
  FileText,
  Download,
  ArrowLeft,
  FileSpreadsheet,
  FilePieChart,
  Clock,
  CheckCircle,
  Filter,
  Search,
  Building2,
  BarChart3,
  Loader2,
  AlertCircle
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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
import { useConcessionsList } from "@/hooks/use-concessions-list"
import { mapConcessionToDealership } from "@/lib/types/display"
import { deriveBrandKPIs } from "@/lib/utils/kpi-helpers"

// ============================================
// TYPES
// ============================================

interface ExportTeamMember {
  rang: number
  nom: string
  ventes: number
  objectif: number
  taux: string
  marge: string
  gpu: string
  financement: string
}

interface ExportRapportData {
  title: string
  period: string
  teamMembers: ExportTeamMember[]
  kpis?: {
    totalSales: number
    totalMargin: number
    avgGPU: number
    financingRate: number
    objectiveRate: number
  }
}

interface DynamicReport {
  id: string
  title: string
  description: string
  type: "sales" | "market" | "financial" | "board"
  format: "excel" | "pdf"
  generatedAt: string
}

interface ReportTemplate {
  id: string
  title: string
  description: string
  icon: React.ElementType
  format: "excel" | "pdf"
  generate: () => Promise<void>
}

// ============================================
// COMPONENTS
// ============================================

function ReportCard({
  report,
  onDownload,
}: {
  report: DynamicReport
  onDownload: () => Promise<void>
}) {
  const [downloading, setDownloading] = useState(false)

  const typeColors: Record<string, string> = {
    board: "bg-purple-100 text-purple-700",
    financial: "bg-emerald-100 text-emerald-700",
    sales: "bg-blue-100 text-blue-700",
    market: "bg-amber-100 text-amber-700",
  }
  const typeLabels: Record<string, string> = {
    board: "Board",
    financial: "Finance",
    sales: "Ventes",
    market: "Marché",
  }

  const formatIcon =
    report.format === "excel" ? (
      <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
    ) : (
      <FileText className="w-5 h-5 text-red-500" />
    )

  const handleDownload = async () => {
    setDownloading(true)
    try {
      await onDownload()
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Card className="border-0 shadow-premium hover:shadow-xl transition-all">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
            {formatIcon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-gray-900 truncate">
                  {report.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-1">
                  {report.description}
                </p>
              </div>
              <Badge className={typeColors[report.type] || "bg-gray-100 text-gray-700"}>
                {typeLabels[report.type] || report.type}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(report.generatedAt).toLocaleDateString("fr-FR")}
              </span>
              <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                Données actuelles
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            className="gap-1 flex-1"
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Télécharger
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function TemplateCard({
  template,
}: {
  template: ReportTemplate
}) {
  const [generating, setGenerating] = useState(false)
  const Icon = template.icon

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      await template.generate()
    } finally {
      setGenerating(false)
    }
  }

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
              {template.format === "excel" ? "Excel" : "PDF"}
            </Badge>
          </div>
        </div>
        <Button
          className="w-full mt-4 gap-2"
          onClick={handleGenerate}
          disabled={generating}
        >
          {generating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          Générer
        </Button>
      </CardContent>
    </Card>
  )
}

// ============================================
// MAIN PAGE
// ============================================

export default function MarqueReportsPage() {
  const { data: concessionsRaw, loading, error } = useConcessionsList()
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const dealerships = useMemo(
    () => (concessionsRaw || []).map(mapConcessionToDealership),
    [concessionsRaw]
  )
  const brandKPIs = useMemo(() => deriveBrandKPIs(dealerships), [dealerships])

  const currentMonthLabel = useMemo(() => {
    const d = new Date()
    return d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
  }, [])

  const todayISO = useMemo(() => new Date().toISOString(), [])

  // Build export data helper
  const buildExportData = useCallback((): ExportRapportData => {
    const members: ExportTeamMember[] = dealerships.map((d, i) => ({
      rang: i + 1,
      nom: d.name,
      ventes: d.stats.totalSales,
      objectif: d.stats.salesTarget,
      taux:
        d.stats.salesTarget > 0
          ? `${Math.round((d.stats.totalSales / d.stats.salesTarget) * 100)}%`
          : "-",
      marge: `${d.stats.totalMargin.toLocaleString("fr-FR")} \u20ac`,
      gpu: `${d.stats.avgGPU.toLocaleString("fr-FR")} \u20ac`,
      financement: `${d.stats.financingRate}%`,
    }))

    return {
      title: "Rapport Marque",
      period: currentMonthLabel,
      teamMembers: members,
      kpis: {
        totalSales: brandKPIs.volume.current,
        totalMargin: brandKPIs.margin.total,
        avgGPU: brandKPIs.margin.avgGPU,
        financingRate: brandKPIs.financing.rate,
        objectiveRate: brandKPIs.volume.objectiveRate,
      },
    }
  }, [dealerships, currentMonthLabel, brandKPIs])

  const handleExportExcel = useCallback(async () => {
    const { exportToExcel } = await import("@/lib/excel/rapports")
    exportToExcel(buildExportData())
  }, [buildExportData])

  const handleExportPDF = useCallback(async () => {
    const { default: jsPDF } = await import("jspdf")
    const doc = new jsPDF()
    const data = buildExportData()

    doc.setFontSize(16)
    doc.text(data.title, 20, 20)
    doc.setFontSize(10)
    doc.text(`Période: ${data.period}`, 20, 30)

    if (data.kpis) {
      doc.setFontSize(12)
      doc.text("Indicateurs clés", 20, 45)
      doc.setFontSize(10)
      doc.text(`Ventes: ${data.kpis.totalSales}`, 20, 55)
      doc.text(
        `Marge: ${data.kpis.totalMargin.toLocaleString("fr-FR")} \u20ac`,
        20,
        62
      )
      doc.text(`GPU moyen: ${data.kpis.avgGPU} \u20ac`, 20, 69)
      doc.text(`Financement: ${data.kpis.financingRate}%`, 20, 76)
      doc.text(`Objectif: ${data.kpis.objectiveRate}%`, 20, 83)
    }

    let y = 100
    doc.setFontSize(12)
    doc.text("Concessions", 20, y)
    y += 10
    doc.setFontSize(9)
    for (const m of data.teamMembers) {
      doc.text(
        `${m.rang}. ${m.nom} — ${m.ventes} ventes — ${m.marge} marge — ${m.financement} fin.`,
        20,
        y
      )
      y += 7
      if (y > 270) {
        doc.addPage()
        y = 20
      }
    }

    doc.save(`rapport-marque-${Date.now()}.pdf`)
  }, [buildExportData])

  // Dynamic reports based on real data
  const dynamicReports: DynamicReport[] = useMemo(
    () => [
      {
        id: "synth",
        title: `Synthèse ${currentMonthLabel}`,
        description: `${brandKPIs.volume.current} ventes, ${(brandKPIs.margin.total / 1000).toFixed(0)}k\u20ac marge — ${dealerships.length} concessions`,
        type: "sales",
        format: "excel",
        generatedAt: todayISO,
      },
      {
        id: "bench",
        title: "Benchmark concessions",
        description: `Classement des ${dealerships.length} concessions par performance`,
        type: "market",
        format: "excel",
        generatedAt: todayISO,
      },
      {
        id: "finance",
        title: "Rapport financement",
        description: `Taux moyen: ${brandKPIs.financing.rate}% (cible: ${brandKPIs.financing.target}%)`,
        type: "financial",
        format: "excel",
        generatedAt: todayISO,
      },
      {
        id: "objectifs",
        title: "Suivi objectifs constructeur",
        description: `Objectif volume: ${brandKPIs.volume.objectiveRate}%`,
        type: "board",
        format: "pdf",
        generatedAt: todayISO,
      },
    ],
    [brandKPIs, dealerships.length, currentMonthLabel, todayISO]
  )

  const reportDownloadHandlers: Record<string, () => Promise<void>> = useMemo(
    () => ({
      synth: handleExportExcel,
      bench: handleExportExcel,
      finance: handleExportExcel,
      objectifs: handleExportPDF,
    }),
    [handleExportExcel, handleExportPDF]
  )

  // Dynamic templates
  const templates: ReportTemplate[] = useMemo(
    () => [
      {
        id: "t-monthly",
        title: "Rapport mensuel réseau",
        description: "Synthèse automatique de toutes les concessions",
        icon: Building2,
        format: "excel",
        generate: handleExportExcel,
      },
      {
        id: "t-benchmark",
        title: "Benchmark performance",
        description: "Comparatif concessions avec classement",
        icon: BarChart3,
        format: "excel",
        generate: handleExportExcel,
      },
      {
        id: "t-pdf",
        title: "Rapport PDF synthèse",
        description: "Document PDF avec indicateurs clés",
        icon: FileText,
        format: "pdf",
        generate: handleExportPDF,
      },
    ],
    [handleExportExcel, handleExportPDF]
  )

  const filteredReports = dynamicReports.filter((r) => {
    const matchesSearch =
      !searchQuery || r.title.toLowerCase().includes(searchQuery.toLowerCase())
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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-gray-600">Impossible de charger les données</p>
        <p className="text-sm text-gray-400">{error.message}</p>
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
              <h1 className="text-2xl font-bold text-gray-900">
                Rapports Marque
              </h1>
              <p className="text-sm text-gray-500">
                Rapports et exports réseau — {currentMonthLabel}
              </p>
            </div>
          </div>
        </div>
        <Button className="gap-2" onClick={handleExportExcel}>
          <Download className="w-4 h-4" />
          Export Excel
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="reports">
        <TabsList>
          <TabsTrigger value="reports" className="gap-2">
            <FileText className="w-4 h-4" />
            Rapports ({dynamicReports.length})
          </TabsTrigger>
          <TabsTrigger value="templates" className="gap-2">
            <FilePieChart className="w-4 h-4" />
            Générer un rapport
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
            {filteredReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onDownload={
                  reportDownloadHandlers[report.id] || handleExportExcel
                }
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
