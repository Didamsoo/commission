"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import type { MarginSheet } from "@/lib/margin-utils"

interface RemunerationSummaryProps {
  marginSheets: MarginSheet[]
}

export function RemunerationSummary({ marginSheets }: RemunerationSummaryProps) {
  const totalCommission = marginSheets.reduce((sum, sheet) => sum + sheet.sellerCommission, 0)
  const totalRemuneration = totalCommission

  return (
    <Card className="bg-gray-900 border-gray-800 text-white shadow-lg animate-fade-in delay-600">
      <CardHeader className="border-b border-gray-800 pb-4">
        <CardTitle className="text-2xl font-bold text-gray-200 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-purple-400" />
          Ma Rémunération
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 py-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-300">Commissions Variables:</p>
          <p className="text-xl font-bold text-purple-400">
            {totalCommission.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
          </p>
        </div>
        <div className="border-t border-gray-700 pt-4 mt-4 flex items-center justify-between">
          <p className="text-gray-200 text-lg font-semibold">Rémunération Totale (Commissions):</p>
          <p className="text-2xl font-bold text-purple-400">
            {totalRemuneration.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
