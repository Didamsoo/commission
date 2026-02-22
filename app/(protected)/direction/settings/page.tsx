"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Building2,
  Phone,
  Mail,
  Globe,
  Clock,
  MapPin,
  Save,
  Loader2
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface ConcessionData {
  id: string
  name: string
  code: string | null
  address: string | null
  settings: {
    phone?: string
    email?: string
    website?: string
    hours?: string
  }
}

export default function ConcessionSettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [concession, setConcession] = useState<ConcessionData | null>(null)

  // Form state
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [website, setWebsite] = useState("")
  const [hours, setHours] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/concessions/current")
        if (!res.ok) throw new Error("Erreur")
        const json = await res.json()
        const data = json.data as ConcessionData
        setConcession(data)
        setName(data.name || "")
        setCode(data.code || "")
        setAddress(data.address || "")
        setPhone(data.settings?.phone || "")
        setEmail(data.settings?.email || "")
        setWebsite(data.settings?.website || "")
        setHours(data.settings?.hours || "")
      } catch {
        toast({ title: "Erreur de chargement", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/concessions/current", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          code,
          address,
          settings: { phone, email, website, hours },
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erreur")
      }
      toast({ title: "Concession mise à jour" })
    } catch (err) {
      toast({ title: err instanceof Error ? err.message : "Erreur", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!concession) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Aucune concession associée à votre compte.</p>
        <Link href="/direction">
          <Button variant="outline" className="mt-4">Retour</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/direction">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paramètres Concession</h1>
          <p className="text-gray-500">Gérez les informations de votre concession</p>
        </div>
      </div>

      {/* Section 1: General Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Informations générales
          </CardTitle>
          <CardDescription>Identité et localisation de la concession</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la concession</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Renault Paris Nord" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Ex: RPN-001" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Adresse
            </Label>
            <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Adresse complète" rows={2} />
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-green-600" />
            Coordonnées
          </CardTitle>
          <CardDescription>Informations de contact de la concession</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                Téléphone
              </Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01 23 45 67 89" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                Email
              </Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contact@concession.fr" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="website" className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              Site web
            </Label>
            <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://www.concession.fr" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hours" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Horaires d'ouverture
            </Label>
            <Textarea id="hours" value={hours} onChange={(e) => setHours(e.target.value)} placeholder={"Lun-Ven: 9h-19h\nSam: 9h-17h"} rows={3} />
          </div>
        </CardContent>
      </Card>

      {/* Save button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="gap-2" size="lg">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Enregistrer les modifications
        </Button>
      </div>
    </div>
  )
}
