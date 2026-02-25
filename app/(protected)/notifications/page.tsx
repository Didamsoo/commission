"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import {
  Bell,
  ArrowLeft,
  CheckCheck,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  Loader2,
  Inbox
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNotifications, markRead, markAllRead, type Notification } from "@/hooks/use-notifications"

const typeConfig: Record<string, { icon: typeof Info; gradient: string; bg: string }> = {
  info: { icon: Info, gradient: "from-blue-500 to-blue-600", bg: "bg-blue-50" },
  warning: { icon: AlertTriangle, gradient: "from-amber-500 to-orange-500", bg: "bg-amber-50" },
  success: { icon: CheckCircle, gradient: "from-emerald-500 to-green-600", bg: "bg-emerald-50" },
  critical: { icon: AlertCircle, gradient: "from-red-500 to-rose-600", bg: "bg-red-50" },
  error: { icon: AlertCircle, gradient: "from-red-500 to-rose-600", bg: "bg-red-50" },
}

function NotificationCard({ notif, onRead }: { notif: Notification; onRead: (id: string) => void }) {
  const config = typeConfig[notif.type] || typeConfig.info
  const Icon = config.icon

  return (
    <Card
      className={`border-0 shadow-premium hover:shadow-xl transition-all cursor-pointer ${!notif.is_read ? "ring-1 ring-blue-100" : ""}`}
      onClick={() => !notif.is_read && onRead(notif.id)}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className={`text-sm truncate ${!notif.is_read ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
                  {notif.title || "Notification"}
                </p>
                <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
              </div>
              {!notif.is_read && (
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
              )}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {new Date(notif.created_at).toLocaleDateString("fr-FR", {
                day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
              })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function NotificationsPage() {
  const { data: notifications, loading, refetch } = useNotifications()
  const [tab, setTab] = useState("all")

  const handleRead = useCallback(async (id: string) => {
    await markRead(id)
    refetch()
  }, [refetch])

  const handleMarkAllRead = useCallback(async () => {
    await markAllRead()
    refetch()
  }, [refetch])

  const allNotifs = notifications || []
  const unreadCount = allNotifs.filter(n => !n.is_read).length

  const filtered = tab === "unread"
    ? allNotifs.filter(n => !n.is_read)
    : tab === "read"
    ? allNotifs.filter(n => n.is_read)
    : allNotifs

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-sm text-gray-500">
                {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}` : "Tout est à jour"}
              </p>
            </div>
          </div>
        </div>

        {unreadCount > 0 && (
          <Button variant="outline" className="gap-2" onClick={handleMarkAllRead}>
            <CheckCheck className="w-4 h-4" />
            Tout marquer comme lu
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="gap-2">
            Toutes
            <Badge variant="secondary" className="ml-1">{allNotifs.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="unread" className="gap-2">
            Non lues
            {unreadCount > 0 && <Badge className="ml-1 bg-blue-500">{unreadCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="read">Lues</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-6">
          {filtered.length === 0 ? (
            <Card className="border-0 shadow-premium">
              <CardContent className="py-16 flex flex-col items-center gap-4 text-gray-400">
                <Inbox className="w-16 h-16" />
                <p className="text-lg font-medium">Aucune notification</p>
                <p className="text-sm">
                  {tab === "unread" ? "Vous avez tout lu !" : "Rien à afficher pour le moment."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filtered.map((notif) => (
                <NotificationCard key={notif.id} notif={notif} onRead={handleRead} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
