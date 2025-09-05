// remuneration-summary.tsx
"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { TrendingUp, Car, Calculator, Euro } from "lucide-react"
import type { MarginSheet } from "@/lib/margin-utils"

interface RemunerationSummaryProps {
  marginSheets: MarginSheet[]
}

export function RemunerationSummary({ marginSheets }: RemunerationSummaryProps) {
  const totalCommission = marginSheets.reduce((sum, sheet) => sum + sheet.sellerCommission, 0)
  const totalRemuneration = totalCommission

  // Calculs par type de véhicule
  const stats = marginSheets.reduce((acc, sheet) => {
    const isVNMode = sheet.vehicleType === "VP" && sheet.vnClientKeyInHandPriceHT && sheet.vnClientDeparturePriceHT
    const type = isVNMode ? "VN" : sheet.vehicleType
    
    if (!acc[type]) {
      acc[type] = { count: 0, commission: 0, margin: 0 }
    }
    
    acc[type].count += 1
    acc[type].commission += sheet.sellerCommission
    acc[type].margin += sheet.remainingMarginHT
    
    return acc
  }, {} as Record<string, { count: number; commission: number; margin: number }>)

  const formatCurrency = (value: number) => {
    return value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "VN": return "text-green-600 bg-green-50"
      case "VO": return "text-blue-600 bg-blue-50"
      case "VU": return "text-purple-600 bg-purple-50"
      default: return "text-gray-600 bg-gray-50"
    }
  }

  const averageCommission = marginSheets.length > 0 ? totalCommission / marginSheets.length : 0

  return (
    <Card className="bg-white border-gray-200 text-gray-900 shadow-xl animate-fade-in delay-600">
      <CardHeader className="border-b border-gray-200 pb-4 bg-gradient-to-r">
        <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          <span className="truncate">Ma Rémunération</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:gap-4 py-4 sm:py-6">
        {/* Rémunération totale */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Euro className="h-5 w-5 text-blue-600" />
            <p className="text-gray-700 text-sm sm:text-base font-medium">Commission Totale:</p>
          </div>
          <p className="text-lg sm:text-xl font-bold text-blue-600">
            {formatCurrency(totalCommission)}
          </p>
        </div>

        {/* Statistiques par type si on a des données */}
        {marginSheets.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-1">
                  <Car className="h-4 w-4" />
                  Véhicules vendus:
                </span>
                <span className="font-semibold">{marginSheets.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-1">
                  <Calculator className="h-4 w-4" />
                  Commission moyenne:
                </span>
                <span className="font-semibold">{formatCurrency(averageCommission)}</span>
              </div>
            </div>

            {/* Détail par type de véhicule */}
            <div className="space-y-2 mt-3">
              <h4 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">
                Répartition par type de véhicule
              </h4>
              {Object.entries(stats).map(([type, data]) => (
                <div key={type} className={`p-2 rounded-lg ${getTypeColor(type)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-1 bg-white rounded-full">
                        {type}
                      </span>
                      <span className="text-sm">
                        {data.count} véhicule{data.count > 1 ? 's' : ''}
                      </span>
                    </div>
                    <span className="text-sm font-bold">
                      {formatCurrency(data.commission)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Message si aucune fiche */}
        {marginSheets.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <Car className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Aucune vente enregistrée</p>
            <p className="text-xs">Commencez par créer votre première fiche de marge</p>
          </div>
        )}

        {/* Résumé final */}
        <div className="border-t border-gray-200 pt-3 sm:pt-4 mt-3 sm:mt-4 flex items-center justify-between bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg">
          <p className="text-gray-800 text-sm sm:text-base lg:text-lg font-semibold">
            Rémunération Variable Totale:
          </p>
          <p className="text-xl sm:text-2xl font-bold text-green-600">
            {formatCurrency(totalRemuneration)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}