"use client"

import { Building2, ChevronDown, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useConcessionContext } from "@/lib/contexts/concession-context"

export function ConcessionSwitcher() {
  const { concessions, activeConcession, loading, switchConcession } = useConcessionContext()

  // Don't show if user has 0 or 1 concession
  if (loading || concessions.length <= 1) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 max-w-[200px]">
          <Building2 className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <span className="truncate text-sm">
            {activeConcession?.concession_name || "Concession"}
          </span>
          <ChevronDown className="w-3 h-3 text-gray-400 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="text-xs text-gray-500 uppercase">
          Mes concessions
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {concessions.map((c) => (
          <DropdownMenuItem
            key={c.concession_id}
            onClick={() => {
              if (c.concession_id !== activeConcession?.concession_id) {
                switchConcession(c.concession_id)
              }
            }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-gray-400" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{c.concession_name}</p>
              {c.concession_city && (
                <p className="text-xs text-gray-500">{c.concession_city}</p>
              )}
            </div>
            {c.concession_id === activeConcession?.concession_id && (
              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
