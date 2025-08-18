"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2, History } from 'lucide-react'
import { type MarginSheet } from "@/lib/margin-utils"

interface MarginHistoryProps {
  marginSheets: MarginSheet[]
  onDelete: (id: string) => void
}

export function MarginHistory({ marginSheets, onDelete }: MarginHistoryProps) {
  return (
    <Card className="bg-gray-900 border-gray-800 text-white shadow-lg animate-fade-in delay-400 flex-1">
      <CardHeader className="border-b border-gray-800 pb-4">
        <CardTitle className="text-2xl font-bold text-gray-200 flex items-center gap-2">
          <History className="h-6 w-6 text-blue-400" />
          Historique des Fiches
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {marginSheets.length === 0 ? (
          <p className="p-6 text-gray-400 text-center">Aucune fiche de marge enregistrée pour le moment.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-800 hover:bg-gray-800">
                  <TableHead className="text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-300">Véhicule</TableHead>
                  <TableHead className="text-gray-300">Client</TableHead>
                  <TableHead className="text-gray-300 text-right">Marge Restante HT</TableHead>
                  <TableHead className="text-gray-300 text-right">Commission</TableHead>
                  <TableHead className="text-gray-300 text-right">Marge Finale</TableHead>
                  <TableHead className="text-gray-300 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marginSheets.map((sheet) => (
                  <TableRow key={sheet.id} className="border-gray-800 hover:bg-gray-850 transition-colors">
                    <TableCell className="font-medium text-gray-300">{sheet.date}</TableCell>
                    <TableCell className="text-gray-300">{sheet.vehicleSoldName}</TableCell>
                    <TableCell className="text-gray-300">{sheet.clientName}</TableCell>
                    <TableCell className="text-right text-green-400">
                      {sheet.remainingMarginHT.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                    </TableCell>
                    <TableCell className="text-right text-purple-400">
                      {sheet.sellerCommission.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                    </TableCell>
                    <TableCell className="text-right text-green-400">
                      {sheet.finalMargin.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(sheet.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
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
