// remuneration-summary.tsx
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
    <Card className="bg-white border-gray-200 text-gray-900 shadow-xl animate-fade-in delay-600">
      <CardHeader className="border-b border-gray-200 pb-4 bg-gradient-to-r">
        <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          <span className="truncate">Ma Rémunération</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:gap-4 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-700 text-sm sm:text-base">Commissions Variables:</p>
          <p className="text-lg sm:text-xl font-bold text-blue-600">
            {totalCommission.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
          </p>
        </div>
        <div className="border-t border-gray-200 pt-3 sm:pt-4 mt-3 sm:mt-4 flex items-center justify-between">
          <p className="text-gray-800 text-sm sm:text-base lg:text-lg font-semibold">
            Rémunération Totale (Commissions):
          </p>
          <p className="text-xl sm:text-2xl font-bold text-blue-600">
            {totalRemuneration.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
