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
    setPayplan(getPayplan()) // Ensure payplan is loaded on mount
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-white p-6 md:p-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-white animate-fade-in">
          Gestionnaire de Marges Automobile
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mt-2 animate-fade-in delay-200">
          Calculez, suivez et optimisez vos commissions de vente.
        </p>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <MarginCalculator onSave={handleSaveMarginSheet} payplan={payplan} />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-8 print-hide-layout">
          <RemunerationSummary marginSheets={marginSheets} />
          <MarginHistory marginSheets={marginSheets} onDelete={handleDeleteMarginSheet} />
        </div>
      </main>
    </div>
  )
}
