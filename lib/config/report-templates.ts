// Report templates and sample reports — UI configuration data
import {
  FilePieChart,
  FileSpreadsheet,
  FileBarChart,
  BarChart3,
} from "lucide-react"

export const reports = [
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

export interface Report {
  id: string
  title: string
  description: string
  type: string
  format: string
  status: string
  createdAt: string
  size: string
}

export const reportTemplates = [
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

export type ReportTemplate = typeof reportTemplates[number]
