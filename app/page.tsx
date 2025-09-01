// page.tsx
"use client"

import { useState, useEffect } from "react"
import { MarginCalculator } from "@/components/margin-calculator"
import { MarginHistory } from "@/components/margin-history"
import { RemunerationSummary } from "@/components/remuneration-summary"
import { type MarginSheet, getMarginSheets, saveMarginSheets, type Payplan, getPayplan } from "@/lib/margin-utils"

export default function HomePage() {
  const [marginSheets, setMarginSheets] = useState<MarginSheet[]>([])
  const [payplan, setPayplan] = useState<Payplan>(getPayplan())

  useEffect(() => {
    setMarginSheets(getMarginSheets())
    setPayplan(getPayplan()) // Ensure payplan est chargé au montage
  }, [])

  const handleSaveMarginSheet = (newSheet: MarginSheet) => {
    const updatedSheets = [...marginSheets, newSheet]
    setMarginSheets(updatedSheets)
    saveMarginSheets(updatedSheets)
  }

  const handleDeleteMarginSheet = (id: string) => {
    const updatedSheets = marginSheets.filter((sheet) => sheet.id !== id)
    setMarginSheets(updatedSheets)
    saveMarginSheets(updatedSheets)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-900 p-3 sm:p-6 lg:p-12">
      {/* Header complètement masqué lors de l'impression */}
      <header className="text-center mb-6 sm:mb-8 lg:mb-12 no-print print-hide-completely">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 animate-fade-in">
          Gestionnaire de Marges Automobile
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mt-2 animate-fade-in delay-200 px-4">
          Calculez, suivez et optimisez vos commissions de vente.
        </p>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* Layout responsive : Stack sur mobile, côte à côte sur desktop */}
        <div className="flex flex-col xl:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Calculateur - Prend toute la largeur sur mobile, 3/5 sur desktop */}
          <div className="w-full xl:w-3/5">
            <MarginCalculator onSave={handleSaveMarginSheet} payplan={payplan} />
          </div>

          {/* Sidebar - Stack sur mobile, 2/5 sur desktop */}
          <div className="w-full xl:w-2/5 flex flex-col gap-4 sm:gap-6 lg:gap-8 no-print print-hide-completely">
            <RemunerationSummary marginSheets={marginSheets} />
            <MarginHistory marginSheets={marginSheets} onDelete={handleDeleteMarginSheet} />
          </div>
        </div>
      </main>
    </div>
  )
}
