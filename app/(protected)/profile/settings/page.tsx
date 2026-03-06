"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  User,
  Bell,
  Lock,
  Save,
  Loader2,
  Sun,
  Moon,
  Monitor
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"
import { useProfil, updateProfil } from "@/hooks/use-profil"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { data: profil, loading } = useProfil()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()

  // Personal info state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [savingInfo, setSavingInfo] = useState(false)

  // Notification settings state
  const [emailNotif, setEmailNotif] = useState(true)
  const [defiNotif, setDefiNotif] = useState(true)
  const [venteNotif, setVenteNotif] = useState(true)
  const [badgeNotif, setBadgeNotif] = useState(true)
  const [savingNotif, setSavingNotif] = useState(false)

  // Push notification state
  const [pushSupported, setPushSupported] = useState(false)
  const [pushSubscribed, setPushSubscribed] = useState(false)
  const [pushLoading, setPushLoading] = useState(false)

  // Password state
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [savingPassword, setSavingPassword] = useState(false)

  // Load profile data into state
  useEffect(() => {
    if (profil) {
      setFirstName(profil.first_name || "")
      setLastName(profil.last_name || "")
      setPhone(profil.phone || "")
      // Load notification settings
      const settings = profil.settings || {}
      setEmailNotif(settings.email_notifications ?? true)
      setDefiNotif(settings.defi_notifications ?? true)
      setVenteNotif(settings.vente_notifications ?? true)
      setBadgeNotif(settings.badge_notifications ?? true)
    }
  }, [profil])

  // Check push notification support and current subscription
  useEffect(() => {
    const checkPush = async () => {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        setPushSupported(true)
        try {
          const registration = await navigator.serviceWorker.ready
          const subscription = await registration.pushManager.getSubscription()
          setPushSubscribed(!!subscription)
        } catch (err) {
          console.error("[Settings] Push check error:", err)
          setPushSubscribed(false)
        }
      }
    }
    checkPush()
  }, [])

  const handleSaveInfo = async () => {
    setSavingInfo(true)
    try {
      await updateProfil({ first_name: firstName, last_name: lastName, phone })
      toast({ title: "Informations mises a jour" })
    } catch (err) {
      console.error("[Settings] Save info error:", err)
      toast({ title: "Erreur de sauvegarde", variant: "destructive" })
    } finally {
      setSavingInfo(false)
    }
  }

  const handleSaveNotif = async () => {
    setSavingNotif(true)
    try {
      await updateProfil({
        settings: {
          email_notifications: emailNotif,
          defi_notifications: defiNotif,
          vente_notifications: venteNotif,
          badge_notifications: badgeNotif,
        }
      })
      toast({ title: "Preferences mises a jour" })
    } catch (err) {
      console.error("[Settings] Save notifications error:", err)
      toast({ title: "Erreur de sauvegarde", variant: "destructive" })
    } finally {
      setSavingNotif(false)
    }
  }

  const handleSubscribePush = async () => {
    setPushLoading(true)
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        toast({ title: "Permission refusee pour les notifications", variant: "destructive" })
        return
      }

      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      })

      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription.toJSON()),
      })

      if (!res.ok) throw new Error('Erreur serveur')

      setPushSubscribed(true)
      toast({ title: "Notifications push activees" })
    } catch (err) {
      console.error("[Settings] Push subscribe error:", err)
      toast({ title: "Erreur lors de l'activation des notifications", variant: "destructive" })
    } finally {
      setPushLoading(false)
    }
  }

  const handleUnsubscribePush = async () => {
    setPushLoading(true)
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        await fetch('/api/push/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        })
        await subscription.unsubscribe()
      }

      setPushSubscribed(false)
      toast({ title: "Notifications push desactivees" })
    } catch (err) {
      console.error("[Settings] Push unsubscribe error:", err)
      toast({ title: "Erreur lors de la desactivation", variant: "destructive" })
    } finally {
      setPushLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: "Les mots de passe ne correspondent pas", variant: "destructive" })
      return
    }
    if (newPassword.length < 8) {
      toast({ title: "Le mot de passe doit contenir au moins 8 caracteres", variant: "destructive" })
      return
    }
    setSavingPassword(true)
    try {
      const res = await fetch("/api/profil/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword, confirmPassword }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erreur")
      }
      toast({ title: "Mot de passe modifie avec succes" })
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      toast({ title: err instanceof Error ? err.message : "Erreur", variant: "destructive" })
    } finally {
      setSavingPassword(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/profile">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Parametres</h1>
          <p className="text-gray-500">Gerez vos preferences et informations personnelles</p>
        </div>
      </div>

      {/* Section 1: Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Informations personnelles
          </CardTitle>
          <CardDescription>Modifiez vos informations de profil</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prenom</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Votre prenom"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Votre nom"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telephone</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="06 12 34 56 78"
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={profil?.email || ""} disabled className="bg-gray-50" />
            <p className="text-xs text-gray-500">L&apos;email ne peut pas etre modifie</p>
          </div>
          <Separator />
          <div className="flex justify-end">
            <Button onClick={handleSaveInfo} disabled={savingInfo} className="gap-2">
              {savingInfo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Enregistrer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-600" />
            Notifications
          </CardTitle>
          <CardDescription>Choisissez quelles notifications vous souhaitez recevoir</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            { id: "emailNotif", label: "Notifications par email", desc: "Recevez un email pour les evenements importants", value: emailNotif, setter: setEmailNotif },
            { id: "defiNotif", label: "Nouveaux defis", desc: "Soyez notifie quand un defi vous est propose", value: defiNotif, setter: setDefiNotif },
            { id: "venteNotif", label: "Ventes validees", desc: "Notification quand une vente est approuvee", value: venteNotif, setter: setVenteNotif },
            { id: "badgeNotif", label: "Badges obtenus", desc: "Notification quand vous obtenez un badge", value: badgeNotif, setter: setBadgeNotif },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor={item.id}>{item.label}</Label>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
              <Switch id={item.id} checked={item.value} onCheckedChange={item.setter} />
            </div>
          ))}
          <Separator />
          <div className="flex justify-end">
            <Button onClick={handleSaveNotif} disabled={savingNotif} className="gap-2">
              {savingNotif ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Enregistrer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-600" />
            Notifications push
          </CardTitle>
          <CardDescription>Recevez des notifications directement dans votre navigateur</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pushSupported ? (
            pushSubscribed ? (
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium text-green-700">Notifications activees</p>
                  <p className="text-sm text-gray-500">Vous recevez les notifications push</p>
                </div>
                <Button variant="outline" onClick={handleUnsubscribePush} disabled={pushLoading}>
                  {pushLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Desactiver"}
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium">Notifications desactivees</p>
                  <p className="text-sm text-gray-500">Activez pour recevoir des alertes en temps reel</p>
                </div>
                <Button onClick={handleSubscribePush} disabled={pushLoading}>
                  {pushLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Activer"}
                </Button>
              </div>
            )
          ) : (
            <p className="text-sm text-gray-500">Les notifications push ne sont pas supportees par votre navigateur</p>
          )}
        </CardContent>
      </Card>

      {/* Section 4: Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-orange-600" />
            Apparence
          </CardTitle>
          <CardDescription>Choisissez le theme de l&apos;interface</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "light", label: "Clair", icon: Sun },
              { value: "dark", label: "Sombre", icon: Moon },
              { value: "system", label: "Systeme", icon: Monitor },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  theme === option.value
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                    : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                }`}
              >
                <option.icon className={`w-5 h-5 ${theme === option.value ? "text-blue-600" : "text-gray-500"}`} />
                <span className={`text-sm font-medium ${theme === option.value ? "text-blue-700 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-600" />
            Mot de passe
          </CardTitle>
          <CardDescription>Modifiez votre mot de passe de connexion</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nouveau mot de passe</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 caracteres"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repetez le mot de passe"
            />
          </div>
          <Separator />
          <div className="flex justify-end">
            <Button
              onClick={handleChangePassword}
              disabled={savingPassword || !newPassword}
              variant="destructive"
              className="gap-2"
            >
              {savingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              Changer le mot de passe
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
