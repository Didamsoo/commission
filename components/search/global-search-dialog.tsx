"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, FileText, User, Target, Building2, Loader2 } from "lucide-react"
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command"
import { useSearch } from "@/hooks/use-search"

const TYPE_CONFIG = {
  fiche: { label: "Fiches de marge", icon: FileText },
  profile: { label: "Utilisateurs", icon: User },
  defi: { label: "Challenges", icon: Target },
  concession: { label: "Concessions", icon: Building2 },
} as const

export function GlobalSearchDialog() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const router = useRouter()
  const { results, loading, hasResults } = useSearch(query)

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleSelect = (href: string) => {
    setOpen(false)
    setQuery("")
    router.push(href)
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 w-full max-w-md px-3 py-2 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 focus:bg-white transition-colors"
      >
        <Search className="w-4 h-4 text-gray-400" />
        <span className="flex-1 text-left">Rechercher...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-gray-200 bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500 font-mono">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Command Dialog */}
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Recherche globale"
        description="Recherchez des fiches, utilisateurs, challenges ou concessions"
      >
        <CommandInput
          placeholder="Rechercher des fiches, utilisateurs, challenges..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {loading && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          )}

          {!loading && query.length >= 2 && !hasResults && (
            <CommandEmpty>Aucun résultat pour &quot;{query}&quot;</CommandEmpty>
          )}

          {!loading && query.length < 2 && (
            <CommandEmpty>Saisissez au moins 2 caractères pour rechercher</CommandEmpty>
          )}

          {!loading && results && (
            <>
              {results.fiches.length > 0 && (
                <CommandGroup heading={TYPE_CONFIG.fiche.label}>
                  {results.fiches.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={`${item.title} ${item.subtitle}`}
                      onSelect={() => handleSelect(item.href)}
                      className="cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-blue-500" />
                      <div className="flex-1 min-w-0">
                        <span className="font-medium">{item.title}</span>
                        {item.subtitle && (
                          <span className="ml-2 text-gray-500">{item.subtitle}</span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {results.profiles.length > 0 && (
                <>
                  {results.fiches.length > 0 && <CommandSeparator />}
                  <CommandGroup heading={TYPE_CONFIG.profile.label}>
                    {results.profiles.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={`${item.title} ${item.subtitle}`}
                        onSelect={() => handleSelect(item.href)}
                        className="cursor-pointer"
                      >
                        <User className="w-4 h-4 text-purple-500" />
                        <div className="flex-1 min-w-0">
                          <span className="font-medium">{item.title}</span>
                          {item.subtitle && (
                            <span className="ml-2 text-gray-500 capitalize">{item.subtitle}</span>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}

              {results.defis.length > 0 && (
                <>
                  {(results.fiches.length > 0 || results.profiles.length > 0) && <CommandSeparator />}
                  <CommandGroup heading={TYPE_CONFIG.defi.label}>
                    {results.defis.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={`${item.title} ${item.subtitle}`}
                        onSelect={() => handleSelect(item.href)}
                        className="cursor-pointer"
                      >
                        <Target className="w-4 h-4 text-amber-500" />
                        <div className="flex-1 min-w-0">
                          <span className="font-medium">{item.title}</span>
                          {item.subtitle && (
                            <span className="ml-2 text-gray-500 capitalize">{item.subtitle}</span>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}

              {results.concessions.length > 0 && (
                <>
                  {(results.fiches.length > 0 || results.profiles.length > 0 || results.defis.length > 0) && <CommandSeparator />}
                  <CommandGroup heading={TYPE_CONFIG.concession.label}>
                    {results.concessions.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={`${item.title} ${item.subtitle}`}
                        onSelect={() => handleSelect(item.href)}
                        className="cursor-pointer"
                      >
                        <Building2 className="w-4 h-4 text-emerald-500" />
                        <div className="flex-1 min-w-0">
                          <span className="font-medium">{item.title}</span>
                          {item.subtitle && (
                            <span className="ml-2 text-gray-500">{item.subtitle}</span>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
