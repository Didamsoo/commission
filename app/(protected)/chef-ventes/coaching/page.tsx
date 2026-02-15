"use client"

import { useState, useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  MessageSquare,
  ChevronRight,
  ArrowLeft,
  Plus,
  Search,
  Filter,
  User,
  Users,
  Target,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Flag,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  X,
  Save,
  Award,
  TrendingUp,
  TrendingDown
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  teamMembers,
  coachingNotes,
  currentChefVentes,
  TeamMember
} from "@/lib/mock-chef-ventes-data"
import { CoachingNote } from "@/types/hierarchy"

// ============================================
// TYPES
// ============================================

type NoteType = "feedback" | "objective" | "action" | "meeting"
type FilterType = "all" | NoteType

const NOTE_TYPE_CONFIG: Record<NoteType, {
  label: string
  icon: React.ElementType
  color: string
  bgColor: string
}> = {
  feedback: {
    label: "Feedback",
    icon: MessageSquare,
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  objective: {
    label: "Objectif",
    icon: Target,
    color: "text-purple-600",
    bgColor: "bg-purple-100"
  },
  action: {
    label: "Action",
    icon: Lightbulb,
    color: "text-amber-600",
    bgColor: "bg-amber-100"
  },
  meeting: {
    label: "Réunion",
    icon: Calendar,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100"
  }
}

// ============================================
// COMPONENTS
// ============================================

function NoteCard({ note, onEdit, onDelete }: {
  note: CoachingNote
  onEdit: (note: CoachingNote) => void
  onDelete: (id: string) => void
}) {
  const config = NOTE_TYPE_CONFIG[note.type]
  const Icon = config.icon
  const member = teamMembers.find(m => m.id === note.commercialId)

  return (
    <Card className="border-0 shadow-premium hover:shadow-premium-lg transition-all duration-300 overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className={`${config.bgColor} px-5 py-3 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center ${config.color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <Badge className={`${config.bgColor} ${config.color} border-0`}>
                {config.label}
              </Badge>
              <p className="text-xs text-gray-600 mt-0.5">
                {new Date(note.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {note.isPrivate && (
              <Badge variant="outline" className="bg-white/80 gap-1">
                <EyeOff className="w-3 h-3" />
                Privé
              </Badge>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(note)}>
              <Edit className="w-4 h-4 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDelete(note.id)}>
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Commercial info */}
          {member && (
            <Link href={`/chef-ventes/equipe/${member.id}`} className="flex items-center gap-3 mb-4 group">
              <Avatar className="h-10 w-10">
                <AvatarImage src={member.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 font-semibold text-sm">
                  {member.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {member.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{member.kpis.sales} ventes</span>
                  <span>•</span>
                  <span className={member.trend === "up" ? "text-emerald-600" : member.trend === "down" ? "text-red-600" : ""}>
                    {member.trend === "up" && <TrendingUp className="w-3 h-3 inline mr-0.5" />}
                    {member.trend === "down" && <TrendingDown className="w-3 h-3 inline mr-0.5" />}
                    {member.trend === "up" ? "En hausse" : member.trend === "down" ? "En baisse" : "Stable"}
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Note content */}
          <p className="text-gray-700 leading-relaxed">{note.content}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function NewNoteDialog({
  isOpen,
  onClose,
  onSave,
  editNote,
  preselectedUserId
}: {
  isOpen: boolean
  onClose: () => void
  onSave: (note: Omit<CoachingNote, "id" | "createdAt" | "managerId">) => void
  editNote?: CoachingNote
  preselectedUserId?: string
}) {
  const [commercialId, setCommercialId] = useState(editNote?.commercialId || preselectedUserId || "")
  const [type, setType] = useState<NoteType>(editNote?.type || "feedback")
  const [content, setContent] = useState(editNote?.content || "")
  const [isPrivate, setIsPrivate] = useState(editNote?.isPrivate ?? true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const selectedMember = teamMembers.find(m => m.id === commercialId)

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {}
    if (!commercialId) newErrors.commercialId = "Sélectionnez un commercial"
    if (!content || content.length < 10) newErrors.content = "La note doit contenir au moins 10 caractères"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSave({
      commercialId,
      commercialName: selectedMember?.name || "",
      type,
      content,
      isPrivate
    })

    // Reset form
    setCommercialId(preselectedUserId || "")
    setType("feedback")
    setContent("")
    setIsPrivate(true)
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            {editNote ? "Modifier la note" : "Nouvelle note de coaching"}
          </DialogTitle>
          <DialogDescription>
            {editNote ? "Modifiez les détails de cette note" : "Ajoutez une note de suivi pour un commercial de votre équipe"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Commercial selection */}
          <div className="space-y-2">
            <Label>Commercial *</Label>
            <Select value={commercialId} onValueChange={setCommercialId}>
              <SelectTrigger className={errors.commercialId ? "border-red-500" : ""}>
                <SelectValue placeholder="Sélectionnez un commercial" />
              </SelectTrigger>
              <SelectContent>
                {teamMembers.map(member => (
                  <SelectItem key={member.id} value={member.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                          {member.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      {member.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.commercialId && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.commercialId}
              </p>
            )}
          </div>

          {/* Note type */}
          <div className="space-y-2">
            <Label>Type de note</Label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(NOTE_TYPE_CONFIG) as NoteType[]).map(noteType => {
                const config = NOTE_TYPE_CONFIG[noteType]
                const Icon = config.icon
                const isSelected = type === noteType

                return (
                  <button
                    key={noteType}
                    type="button"
                    onClick={() => setType(noteType)}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected ? config.bgColor : "bg-gray-100"
                    } ${isSelected ? config.color : "text-gray-500"}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-xs font-medium ${isSelected ? "text-indigo-700" : "text-gray-600"}`}>
                      {config.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Note content */}
          <div className="space-y-2">
            <Label>Note *</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Écrivez votre note de coaching..."
              className={`min-h-[120px] resize-none ${errors.content ? "border-red-500" : ""}`}
            />
            {errors.content && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.content}
              </p>
            )}
          </div>

          {/* Privacy toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              {isPrivate ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
              <div>
                <p className="font-medium text-gray-900">Note privée</p>
                <p className="text-xs text-gray-500">
                  {isPrivate ? "Visible uniquement par vous" : "Visible par le commercial"}
                </p>
              </div>
            </div>
            <Switch
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 gap-2"
          >
            <Save className="w-4 h-4" />
            {editNote ? "Enregistrer" : "Ajouter la note"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CommercialSummaryCard({ member }: { member: TeamMember }) {
  const memberNotes = coachingNotes.filter(n => n.commercialId === member.id)
  const objectiveRate = Math.round((member.kpis.sales / member.kpis.salesTarget) * 100)

  return (
    <Link href={`/chef-ventes/equipe/${member.id}`}>
      <Card className="border-0 shadow-premium hover:shadow-premium-lg transition-all duration-300 cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={member.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 font-semibold">
                {member.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{member.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`text-xs ${
                  objectiveRate >= 100 ? "bg-emerald-100 text-emerald-700" :
                  objectiveRate >= 80 ? "bg-blue-100 text-blue-700" :
                  objectiveRate >= 60 ? "bg-amber-100 text-amber-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {objectiveRate}%
                </Badge>
                {memberNotes.length > 0 && (
                  <Badge variant="outline" className="text-xs gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {memberNotes.length}
                  </Badge>
                )}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

function CoachingPageContent() {
  const searchParams = useSearchParams()
  const preselectedUserId = searchParams.get("user") || undefined

  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<FilterType>("all")
  const [filterCommercial, setFilterCommercial] = useState<string>(preselectedUserId || "all")
  const [isNewNoteOpen, setIsNewNoteOpen] = useState(!!preselectedUserId)
  const [editingNote, setEditingNote] = useState<CoachingNote | undefined>()
  const [notes, setNotes] = useState(coachingNotes)

  // Filter notes
  const filteredNotes = useMemo(() => {
    let result = [...notes]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(n =>
        n.content.toLowerCase().includes(query) ||
        n.commercialName.toLowerCase().includes(query)
      )
    }

    // Type filter
    if (filterType !== "all") {
      result = result.filter(n => n.type === filterType)
    }

    // Commercial filter
    if (filterCommercial !== "all") {
      result = result.filter(n => n.commercialId === filterCommercial)
    }

    // Sort by date (newest first)
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return result
  }, [notes, searchQuery, filterType, filterCommercial])

  const handleSaveNote = (noteData: Omit<CoachingNote, "id" | "createdAt" | "managerId">) => {
    if (editingNote) {
      // Update existing note
      setNotes(prev => prev.map(n =>
        n.id === editingNote.id
          ? { ...n, ...noteData }
          : n
      ))
    } else {
      // Add new note
      const newNote: CoachingNote = {
        ...noteData,
        id: `note-${Date.now()}`,
        managerId: currentChefVentes.id,
        createdAt: new Date().toISOString()
      }
      setNotes(prev => [newNote, ...prev])
    }
    setEditingNote(undefined)
  }

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  const handleEditNote = (note: CoachingNote) => {
    setEditingNote(note)
    setIsNewNoteOpen(true)
  }

  // Group notes by commercial for summary
  const notesByCommercial = useMemo(() => {
    const grouped: Record<string, number> = {}
    notes.forEach(note => {
      grouped[note.commercialId] = (grouped[note.commercialId] || 0) + 1
    })
    return grouped
  }, [notes])

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* ============================================
          HEADER
          ============================================ */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/chef-ventes" className="hover:text-indigo-600 transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Coaching</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            Notes de coaching
          </h1>
          <p className="text-gray-500 mt-1">
            {notes.length} note{notes.length > 1 ? "s" : ""} pour {teamMembers.length} commerciaux
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/chef-ventes">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
          </Link>
          <Button
            onClick={() => {
              setEditingNote(undefined)
              setIsNewNoteOpen(true)
            }}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg shadow-amber-500/25 gap-2"
          >
            <Plus className="w-4 h-4" />
            Nouvelle note
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* ============================================
            SIDEBAR: TEAM MEMBERS
            ============================================ */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-0 shadow-premium sticky top-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Mon équipe
              </CardTitle>
              <CardDescription>
                Sélectionnez un commercial
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* All filter */}
              <button
                onClick={() => setFilterCommercial("all")}
                className={`w-full p-3 rounded-xl text-left transition-all ${
                  filterCommercial === "all"
                    ? "bg-indigo-50 border-2 border-indigo-500"
                    : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${filterCommercial === "all" ? "text-indigo-700" : "text-gray-700"}`}>
                    Tous les commerciaux
                  </span>
                  <Badge className="bg-gray-200 text-gray-700">{notes.length}</Badge>
                </div>
              </button>

              <Separator className="my-3" />

              {/* Team members */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {teamMembers.map(member => (
                  <button
                    key={member.id}
                    onClick={() => setFilterCommercial(member.id)}
                    className={`w-full p-3 rounded-xl text-left transition-all ${
                      filterCommercial === member.id
                        ? "bg-indigo-50 border-2 border-indigo-500"
                        : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-semibold">
                          {member.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${
                          filterCommercial === member.id ? "text-indigo-700" : "text-gray-700"
                        }`}>
                          {member.name}
                        </p>
                      </div>
                      <Badge className={`${
                        filterCommercial === member.id ? "bg-indigo-100 text-indigo-700" : "bg-gray-200 text-gray-600"
                      }`}>
                        {notesByCommercial[member.id] || 0}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ============================================
            MAIN CONTENT: NOTES
            ============================================ */}
        <div className="lg:col-span-3 space-y-4">
          {/* Filters */}
          <Card className="border-0 shadow-premium">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher dans les notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Type filter */}
                <Select value={filterType} onValueChange={(v) => setFilterType(v as FilterType)}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Type de note" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    {(Object.keys(NOTE_TYPE_CONFIG) as NoteType[]).map(type => (
                      <SelectItem key={type} value={type}>
                        <div className="flex items-center gap-2">
                          {NOTE_TYPE_CONFIG[type].label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notes list */}
          {filteredNotes.length > 0 ? (
            <div className="space-y-4">
              {filteredNotes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                />
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-premium">
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Aucune note trouvée</p>
                <p className="text-gray-400 mt-1 mb-4">
                  {filterCommercial !== "all" || filterType !== "all" || searchQuery
                    ? "Essayez de modifier vos filtres"
                    : "Commencez à ajouter des notes de coaching"}
                </p>
                <Button
                  onClick={() => {
                    setEditingNote(undefined)
                    setIsNewNoteOpen(true)
                  }}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter une note
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* New/Edit note dialog */}
      <NewNoteDialog
        isOpen={isNewNoteOpen}
        onClose={() => {
          setIsNewNoteOpen(false)
          setEditingNote(undefined)
        }}
        onSave={handleSaveNote}
        editNote={editingNote}
        preselectedUserId={filterCommercial !== "all" ? filterCommercial : preselectedUserId}
      />
    </div>
  )
}

// Loading fallback
function CoachingPageFallback() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
        <div className="h-12 bg-gray-200 rounded w-1/2 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </div>
      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="h-96 bg-gray-100 rounded-xl animate-pulse" />
        </div>
        <div className="lg:col-span-3 space-y-4">
          <div className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-48 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-48 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  )
}

// Export wrapper with Suspense
export default function CoachingPage() {
  return (
    <Suspense fallback={<CoachingPageFallback />}>
      <CoachingPageContent />
    </Suspense>
  )
}
