"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Calculator,
  Trophy,
  Target,
  User,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Car,
  Users,
  FileText,
  BarChart3,
  CheckCircle,
  Search,
  Sparkles,
  Crown,
  Zap,
  Award,
  Building2,
  Building,
  Globe,
  MessageSquare,
  Package,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuShortcut
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

// ============================================
// PREMIUM PROTECTED LAYOUT - AutoPerf Pro
// ============================================

// Role levels mapping
const ROLE_LEVELS: Record<string, number> = {
  commercial: 1,
  chef_ventes: 2,
  dir_concession: 3,
  dir_marque: 4,
  dir_plaque: 5,
  admin: 5
}

type CurrentUser = {
  id: string
  fullName: string
  email: string
  role: string
  level: number
  avatarUrl: string
  dealership: string
  plan: string
  stats: {
    totalPoints: number
    rank: number
    unreadNotifications: number
    monthlySales: number
    monthlyTarget: number
  }
}

function buildCurrentUser(user: SupabaseUser): CurrentUser {
  const meta = user.user_metadata || {}
  return {
    id: user.id,
    fullName: meta.full_name || user.email || "Utilisateur",
    email: user.email || "",
    role: meta.role || "commercial",
    level: ROLE_LEVELS[meta.role] || 1,
    avatarUrl: meta.avatar_url || "",
    dealership: meta.dealership_name || "Ma Concession",
    plan: "Enterprise",
    stats: {
      totalPoints: 0,
      rank: 0,
      unreadNotifications: 0,
      monthlySales: 0,
      monthlyTarget: 0
    }
  }
}

// Navigation Item type
type NavItem = {
  title: string
  href: string
  icon: React.ForwardRefExoticComponent<Omit<import("lucide-react").LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
  roles: string[]
  badge: { text: string; variant: "success" | "destructive" } | null
}

// Navigation Items
const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["commercial", "direction", "admin"],
    badge: null
  },
  {
    title: "Calculateur",
    href: "/calculator",
    icon: Calculator,
    roles: ["commercial", "direction", "admin"],
    badge: null
  },
  {
    title: "Classement",
    href: "/leaderboard",
    icon: Trophy,
    roles: ["commercial", "direction", "admin"],
    badge: null
  },
  {
    title: "Challenges",
    href: "/challenges",
    icon: Target,
    roles: ["commercial", "direction", "admin"],
    badge: { text: "2 actifs", variant: "success" as const }
  },
  {
    title: "Profil",
    href: "/profile",
    icon: User,
    roles: ["commercial", "direction", "admin"],
    badge: null
  }
]

// Chef des Ventes (N2)
const chefVentesNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/chef-ventes",
    icon: BarChart3,
    roles: ["chef_ventes", "dir_concession", "dir_marque", "dir_plaque", "admin"],
    badge: null
  },
  {
    title: "Mon Équipe",
    href: "/chef-ventes/equipe",
    icon: Users,
    roles: ["chef_ventes", "dir_concession", "dir_marque", "dir_plaque", "admin"],
    badge: null
  },
  {
    title: "Challenges",
    href: "/chef-ventes/challenges/new",
    icon: Zap,
    roles: ["chef_ventes", "dir_concession", "dir_marque", "dir_plaque", "admin"],
    badge: null
  },
  {
    title: "Coaching",
    href: "/chef-ventes/coaching",
    icon: MessageSquare,
    roles: ["chef_ventes", "dir_concession", "dir_marque", "dir_plaque", "admin"],
    badge: null
  },
  {
    title: "Rapports",
    href: "/chef-ventes/rapports",
    icon: FileText,
    roles: ["chef_ventes", "dir_concession", "dir_marque", "dir_plaque", "admin"],
    badge: null
  }
]

// Directeur de Concession (N3)
const directionNavItems: NavItem[] = [
  {
    title: "Vue d'ensemble",
    href: "/direction",
    icon: BarChart3,
    roles: ["dir_concession", "dir_marque", "dir_plaque", "admin"],
    badge: null
  },
  {
    title: "Gestion Équipe",
    href: "/direction/users",
    icon: Users,
    roles: ["dir_concession", "dir_marque", "dir_plaque", "admin"],
    badge: null
  },
  {
    title: "Approbations",
    href: "/direction/approvals",
    icon: CheckCircle,
    roles: ["dir_concession", "dir_marque", "dir_plaque", "admin"],
    badge: { text: "3", variant: "destructive" as const }
  },
  {
    title: "Challenges",
    href: "/direction/challenges",
    icon: Zap,
    roles: ["dir_concession", "dir_marque", "dir_plaque", "admin"],
    badge: null
  },
  {
    title: "Rapports",
    href: "/direction/reports",
    icon: FileText,
    roles: ["dir_concession", "dir_marque", "dir_plaque", "admin"],
    badge: null
  },
  {
    title: "Payplan",
    href: "/direction/payplan",
    icon: FileText,
    roles: ["dir_concession", "dir_marque", "dir_plaque", "admin"],
    badge: null
  }
]

// Directeur de Marque (N4)
const marqueNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/marque",
    icon: Building2,
    roles: ["dir_marque", "dir_plaque", "admin"],
    badge: null
  },
  {
    title: "Concessions",
    href: "/marque/concessions",
    icon: Building2,
    roles: ["dir_marque", "dir_plaque", "admin"],
    badge: null
  },
  {
    title: "Challenges",
    href: "/marque/challenges/new",
    icon: Zap,
    roles: ["dir_marque", "dir_plaque", "admin"],
    badge: null
  },
  {
    title: "Stocks",
    href: "/marque/stocks",
    icon: Package,
    roles: ["dir_marque", "dir_plaque", "admin"],
    badge: null
  }
]

// Directeur de Plaque (N5)
const groupeNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/groupe",
    icon: Globe,
    roles: ["dir_plaque", "admin"],
    badge: null
  },
  {
    title: "Marques",
    href: "/groupe/marques",
    icon: Building,
    roles: ["dir_plaque", "admin"],
    badge: null
  },
  {
    title: "Performance",
    href: "/groupe/performance",
    icon: BarChart3,
    roles: ["dir_plaque", "admin"],
    badge: null
  },
  {
    title: "Rapports",
    href: "/groupe/reports",
    icon: FileText,
    roles: ["dir_plaque", "admin"],
    badge: null
  }
]

// ============================================
// NAVIGATION LINK COMPONENT
// ============================================

function NavLink({
  item,
  isActive,
  onClick,
  collapsed = false
}: {
  item: NavItem
  isActive: boolean
  onClick?: () => void
  collapsed?: boolean
}) {
  const content = (
    <>
      <div className={`flex items-center justify-center rounded-lg transition-all duration-300 ${
        isActive
          ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
          : "text-gray-500 group-hover:text-gray-900 group-hover:bg-gray-100"
      } ${collapsed ? "w-10 h-10" : "w-9 h-9"}`}>
        <item.icon className={`${collapsed ? "w-5 h-5" : "w-[18px] h-[18px]"}`} />
      </div>
      {!collapsed && (
        <>
          <span className={`font-medium transition-colors ${isActive ? "text-gray-900" : "text-gray-600 group-hover:text-gray-900"}`}>
            {item.title}
          </span>
          {item.badge && (
            <Badge
              variant={item.badge.variant === "success" ? "default" : "destructive"}
              className={`ml-auto text-xs px-2 ${
                item.badge.variant === "success"
                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                  : "bg-red-100 text-red-700 hover:bg-red-100"
              }`}
            >
              {item.badge.text}
            </Badge>
          )}
        </>
      )}
    </>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={item.href}
            onClick={onClick}
            className={`flex items-center justify-center p-2 rounded-xl transition-all duration-200 group ${
              isActive
                ? "bg-blue-50"
                : "hover:bg-gray-50"
            }`}
          >
            {content}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{item.title}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
        isActive
          ? "bg-blue-50"
          : "hover:bg-gray-50"
      }`}
    >
      {content}
    </Link>
  )
}

// ============================================
// SIDEBAR COMPONENT
// ============================================

function Sidebar({
  currentUser,
  onClose,
  collapsed = false
}: {
  currentUser: CurrentUser
  onClose?: () => void
  collapsed?: boolean
}) {
  const pathname = usePathname()
  const userRole = currentUser.role

  const filteredNavItems = navItems.filter(item =>
    item.roles.includes(userRole)
  )

  const filteredChefVentesItems = chefVentesNavItems.filter(item =>
    item.roles.includes(userRole)
  )

  const filteredDirectionItems = directionNavItems.filter(item =>
    item.roles.includes(userRole)
  )

  const filteredMarqueItems = marqueNavItems.filter(item =>
    item.roles.includes(userRole)
  )

  const filteredGroupeItems = groupeNavItems.filter(item =>
    item.roles.includes(userRole)
  )

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className={`p-4 border-b border-gray-100 ${collapsed ? "px-3" : ""}`}>
        <Link href="/dashboard" className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Car className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div>
              <span className="font-bold text-lg text-gray-900">AutoPerf</span>
              <p className="text-xs text-gray-500 -mt-0.5 font-medium">{currentUser.dealership}</p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className={`space-y-1 ${collapsed ? "space-y-2" : ""}`}>
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              isActive={pathname === item.href}
              onClick={onClose}
              collapsed={collapsed}
            />
          ))}
        </nav>

        {filteredChefVentesItems.length > 0 && (
          <>
            <div className={`my-4 ${collapsed ? "px-1" : "px-3"}`}>
              <Separator />
            </div>
            {!collapsed && (
              <div className="px-3 mb-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Chef des Ventes
                </p>
              </div>
            )}
            <nav className={`space-y-1 ${collapsed ? "space-y-2" : ""}`}>
              {filteredChefVentesItems.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
                  onClick={onClose}
                  collapsed={collapsed}
                />
              ))}
            </nav>
          </>
        )}

        {filteredDirectionItems.length > 0 && (
          <>
            <div className={`my-4 ${collapsed ? "px-1" : "px-3"}`}>
              <Separator />
            </div>
            {!collapsed && (
              <div className="px-3 mb-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Direction Concession
                </p>
              </div>
            )}
            <nav className={`space-y-1 ${collapsed ? "space-y-2" : ""}`}>
              {filteredDirectionItems.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
                  onClick={onClose}
                  collapsed={collapsed}
                />
              ))}
            </nav>
          </>
        )}

        {filteredMarqueItems.length > 0 && (
          <>
            <div className={`my-4 ${collapsed ? "px-1" : "px-3"}`}>
              <Separator />
            </div>
            {!collapsed && (
              <div className="px-3 mb-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Direction Marque
                </p>
              </div>
            )}
            <nav className={`space-y-1 ${collapsed ? "space-y-2" : ""}`}>
              {filteredMarqueItems.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
                  onClick={onClose}
                  collapsed={collapsed}
                />
              ))}
            </nav>
          </>
        )}

        {filteredGroupeItems.length > 0 && (
          <>
            <div className={`my-4 ${collapsed ? "px-1" : "px-3"}`}>
              <Separator />
            </div>
            {!collapsed && (
              <div className="px-3 mb-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Direction Groupe
                </p>
              </div>
            )}
            <nav className={`space-y-1 ${collapsed ? "space-y-2" : ""}`}>
              {filteredGroupeItems.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
                  onClick={onClose}
                  collapsed={collapsed}
                />
              ))}
            </nav>
          </>
        )}
      </ScrollArea>

      {/* User Card */}
      <div className={`p-3 border-t border-gray-100 ${collapsed ? "px-2" : ""}`}>
        <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"} p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50`}>
          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
            <AvatarImage src={currentUser.avatarUrl} />
            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold text-sm">
              {currentUser.fullName.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate text-sm">{currentUser.fullName}</p>
              <div className="flex items-center gap-2">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-sm text-gray-600">
                  {currentUser.stats.totalPoints.toLocaleString()} pts
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-sm text-gray-600">#{currentUser.stats.rank}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// MAIN LAYOUT COMPONENT
// ============================================

export default function ProtectedLayout({
  children
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [loading, setLoading] = useState(true)

  const handleSignOut = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }, [router])

  useEffect(() => {
    const supabase = createClient()

    // Fetch initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setCurrentUser(buildCurrentUser(user))
      }
      setLoading(false)
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(buildCurrentUser(session.user))
      } else {
        setCurrentUser(null)
        router.push("/login")
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  // Handle scroll for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-xl shadow-blue-500/20">
            <Car className="w-8 h-8 text-white" />
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Chargement...</span>
          </div>
        </div>
      </div>
    )
  }

  // If no user after loading, middleware should redirect, but just in case
  if (!currentUser) {
    return null
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="min-h-screen bg-gray-50/50">
        {/* ============================================
            DESKTOP SIDEBAR
            ============================================ */}
        <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-72 lg:border-r lg:border-gray-200 lg:bg-white">
          <Sidebar currentUser={currentUser} />
        </aside>

        {/* ============================================
            MOBILE HEADER
            ============================================ */}
        <header className={`lg:hidden sticky top-0 z-40 flex items-center justify-between h-16 px-4 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100" : "bg-white border-b border-gray-200"
        }`}>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
              <Sidebar currentUser={currentUser} onClose={() => setMobileMenuOpen(false)} />
            </SheetContent>
          </Sheet>

          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">AutoPerf</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative rounded-xl">
              <Bell className="w-5 h-5" />
              {currentUser.stats.unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center font-medium shadow-sm">
                  {currentUser.stats.unreadNotifications}
                </span>
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={currentUser.avatarUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm font-semibold">
                      {currentUser.fullName.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <p className="font-semibold">{currentUser.fullName}</p>
                  <p className="text-sm text-gray-500 font-normal">{currentUser.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="w-4 h-4 mr-2" />
                    Mon profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Paramètres
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* ============================================
            DESKTOP HEADER
            ============================================ */}
        <header className={`hidden lg:flex lg:fixed lg:top-0 lg:left-72 lg:right-0 lg:z-40 lg:h-16 lg:items-center lg:justify-between lg:px-6 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100" : "bg-white border-b border-gray-200"
        }`}>
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Plan Badge */}
            <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border-amber-200 hover:from-amber-100 hover:to-orange-100">
              <Crown className="w-3 h-3 mr-1" />
              {currentUser.plan}
            </Badge>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-xl">
                  <Bell className="w-5 h-5" />
                  {currentUser.stats.unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center font-medium shadow-sm">
                      {currentUser.stats.unreadNotifications}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifications</span>
                  <Badge variant="secondary" className="text-xs">{currentUser.stats.unreadNotifications} nouvelles</Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-64 overflow-y-auto">
                  {[1, 2, 3].map((i) => (
                    <DropdownMenuItem key={i} className="flex items-start gap-3 py-3 cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Trophy className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Nouveau badge débloqué !</p>
                        <p className="text-xs text-gray-500">Il y a {i} heure{i > 1 ? "s" : ""}</p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-blue-600">
                  Voir toutes les notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 pl-2 pr-3 h-11 rounded-xl hover:bg-gray-100">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.avatarUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm font-semibold">
                      {currentUser.fullName.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden xl:block text-left">
                    <p className="text-sm font-semibold text-gray-900 leading-tight">{currentUser.fullName}</p>
                    <p className="text-xs text-gray-500">{currentUser.dealership}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold">
                        {currentUser.fullName.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{currentUser.fullName}</p>
                      <p className="text-sm text-gray-500 font-normal">{currentUser.email}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="w-4 h-4 mr-2" />
                      Mon profil
                      <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/settings">
                      <Settings className="w-4 h-4 mr-2" />
                      Paramètres
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/badges">
                      <Award className="w-4 h-4 mr-2" />
                      Mes badges
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* ============================================
            MAIN CONTENT
            ============================================ */}
        <main className="lg:pl-72 lg:pt-16">
          <div className="min-h-[calc(100vh-4rem)]">
            {children}
          </div>
        </main>
      </div>
    </TooltipProvider>
  )
}
