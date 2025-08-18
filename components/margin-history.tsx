"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2, History } from "lucide-react"
import type { MarginSheet } from "@/lib/margin-utils"

interface MarginHistoryProps {
  marginSheets: MarginSheet[]
  onDelete: (id: string) => void
}

export function MarginHistory({ marginSheets, onDelete }: MarginHistoryProps) {
  return (
    <Card className="bg-white border-gray-200 text-gray-900 shadow-xl animate-fade-in delay-400 flex-1">
      <CardHeader className="border-b border-gray-200 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2">
          <History className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          <span className="truncate">Historique des Fiches</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {marginSheets.length === 0 ? (
          <p className="p-4 sm:p-6 text-gray-500 text-center text-sm sm:text-base">
            Aucune fiche de marge enregistrée pour le moment.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="text-gray-700 text-xs sm:text-sm font-medium">Date</TableHead>
                  <TableHead className="text-gray-700 text-xs sm:text-sm font-medium hidden sm:table-cell">
                    Véhicule
                  </TableHead>
                  <TableHead className="text-gray-700 text-xs sm:text-sm font-medium">Client</TableHead>
                  <TableHead className="text-gray-700 text-right text-xs sm:text-sm font-medium hidden lg:table-cell">
                    Marge Restante HT
                  </TableHead>
                  <TableHead className="text-gray-700 text-right text-xs sm:text-sm font-medium">Commission</TableHead>
                  <TableHead className="text-gray-700 text-right text-xs sm:text-sm font-medium hidden md:table-cell">
                    Marge Finale
                  </TableHead>
                  <TableHead className="text-gray-700 text-right text-xs sm:text-sm font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marginSheets.map((sheet) => (
                  <TableRow key={sheet.id} className="border-gray-200 hover:bg-blue-50 transition-colors">
                    <TableCell className="font-medium text-gray-800 text-xs sm:text-sm">{sheet.date}</TableCell>
                    <TableCell className="text-gray-700 text-xs sm:text-sm hidden sm:table-cell truncate max-w-[100px]">
                      {sheet.vehicleSoldName}
                    </TableCell>
                    <TableCell className="text-gray-700 text-xs sm:text-sm truncate max-w-[80px] sm:max-w-[120px]">
                      {sheet.clientName}
                    </TableCell>
                    <TableCell className="text-right text-green-600 text-xs sm:text-sm hidden lg:table-cell">
                      {sheet.remainingMarginHT.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                    </TableCell>
                    <TableCell className="text-right text-blue-600 text-xs sm:text-sm">
                      {sheet.sellerCommission.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                    </TableCell>
                    <TableCell className="text-right text-green-600 text-xs sm:text-sm hidden md:table-cell">
                      {sheet.finalMargin.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(sheet.id)}
                        className="text-gray-500 hover:text-red-600 transition-colors h-6 w-6 sm:h-8 sm:w-8"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
