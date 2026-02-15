"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  TrendingUp,
  Trophy,
  Target,
  Users,
  BarChart3,
  Bell,
  Shield,
  Zap,
  ChevronRight,
  Star,
  Car,
  Calculator,
  Award,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Play,
  ChevronDown,
  Quote,
  ArrowUpRight,
  Gauge,
  Wallet,
  LineChart,
  BadgeCheck,
  Clock,
  ShieldCheck,
  Smartphone
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// ============================================
// PREMIUM LANDING PAGE - AutoPerf Pro
// ============================================

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)

  // Handle scroll for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: Calculator,
      title: "Calcul Intelligent",
      description: "Calculez instantanément vos marges et commissions sur chaque vente VO, VN et VU avec une précision millimétrée.",
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      stats: "+15% de productivité"
    },
    {
      icon: BarChart3,
      title: "Analytics Temps Réel",
      description: "Suivez vos performances avec des tableaux de bord intelligents et des KPIs pertinents pour prendre les bonnes décisions.",
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50",
      stats: "98% de satisfaction"
    },
    {
      icon: Trophy,
      title: "Gamification Avancée",
      description: "Motivez vos équipes avec des classements dynamiques, des défis stimulants et des récompenses attractives.",
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50",
      stats: "2x plus d'engagement"
    },
    {
      icon: Target,
      title: "Challenges Personnalisés",
      description: "Créez des défis sur mesure pour vos équipes avec des objectifs clairs et des récompenses à la clé.",
      color: "from-purple-500 to-violet-600",
      bgColor: "bg-purple-50",
      stats: "+25% de ventes"
    },
    {
      icon: Award,
      title: "Système de Badges",
      description: "Débloquez des badges en atteignant vos objectifs et montrez votre expertise à toute la concession.",
      color: "from-pink-500 to-rose-600",
      bgColor: "bg-pink-50",
      stats: "500+ badges décernés"
    },
    {
      icon: ShieldCheck,
      title: "Sécurité Entreprise",
      description: "Vos données sont protégées avec les standards les plus élevés de sécurité et de confidentialité.",
      color: "from-cyan-500 to-blue-600",
      bgColor: "bg-cyan-50",
      stats: "Certifié ISO 27001"
    }
  ]

  const stats = [
    { value: "15%", label: "Augmentation des ventes", sublabel: "en moyenne" },
    { value: "2x", label: "Engagement des équipes", sublabel: "vs solutions classiques" },
    { value: "98%", label: "Satisfaction client", sublabel: "basée sur 500+ avis" },
    { value: "24/7", label: "Support & Accès", sublabel: "disponibilité totale" }
  ]

  const testimonials = [
    {
      quote: "Depuis qu'on utilise AutoPerf, mes commerciaux sont beaucoup plus motivés. Les challenges hebdomadaires ont créé une vraie émulation !",
      author: "Marie Durand",
      role: "Directrice Commerciale",
      dealership: "Ford Paris Est",
      avatar: "MD",
      rating: 5
    },
    {
      quote: "Je peux enfin suivre mes performances en temps réel. Les badges me motivent à me dépasser chaque jour. Un outil indispensable !",
      author: "Thomas Renault",
      role: "Commercial Senior",
      dealership: "Ford Lyon Centre",
      avatar: "TR",
      rating: 5
    },
    {
      quote: "L'outil parfait pour piloter mes équipes. Les statistiques sont claires et les commerciaux adorent le côté gamification.",
      author: "Pierre Martin",
      role: "Chef des Ventes",
      dealership: "Ford Marseille",
      avatar: "PM",
      rating: 5
    }
  ]

  const pricingFeatures = [
    "Utilisateurs illimités",
    "Feuilles de marge illimitées",
    "Tous les badges et achievements",
    "Challenges et leaderboards",
    "Notifications multi-canal",
    "Export PDF et Excel",
    "Support prioritaire 24/7",
    "API d'intégration"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30 overflow-x-hidden">
      {/* ============================================
          PREMIUM NAVIGATION
          ============================================ */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? "bg-white/90 backdrop-blur-xl shadow-premium border-b border-gray-100/50" 
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105">
                <Car className="w-7 h-7 text-white" />
                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <span className="font-bold text-xl text-gray-900 tracking-tight">AutoPerf</span>
                <span className="block text-xs text-gray-500 -mt-1 font-medium">Pro</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {[
                { label: "Fonctionnalités", href: "#features" },
                { label: "Témoignages", href: "#testimonials" },
                { label: "Tarifs", href: "#pricing" },
                { label: "FAQ", href: "#faq" }
              ].map((item) => (
                <a 
                  key={item.label}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button 
                  variant="ghost" 
                  className="text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 font-medium"
                >
                  Connexion
                </Button>
              </Link>
              <Link href="/register">
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 font-medium px-6"
                >
                  Essai gratuit
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ============================================
          HERO SECTION PREMIUM
          ============================================ */}
      <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse-soft stagger-2" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-100/40 to-indigo-100/40 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 mb-8 animate-fade-in-down opacity-0-initial" style={{ animationFillMode: "forwards" }}>
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 text-sm font-semibold">Nouveau : Intelligence Artificielle intégrée</span>
              <Badge variant="secondary" className="bg-blue-600 text-white text-xs">BETA</Badge>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1] mb-8 animate-fade-in-up opacity-0-initial stagger-1" style={{ animationFillMode: "forwards" }}>
              Boostez les performances
              <span className="block mt-2">
                de vos{" "}
                <span className="relative">
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    commerciaux
                  </span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 10C50 2 100 2 150 6C200 10 250 10 298 2" stroke="url(#gradient)" strokeWidth="4" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="300" y2="0">
                        <stop stopColor="#3b82f6"/>
                        <stop offset="1" stopColor="#8b5cf6"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up opacity-0-initial stagger-2" style={{ animationFillMode: "forwards" }}>
              La plateforme tout-en-un pour calculer les marges, suivre les performances
              et motiver vos équipes avec une gamification intelligente.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up opacity-0-initial stagger-3" style={{ animationFillMode: "forwards" }}>
              <Link href="/register">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 h-16 px-10 text-lg font-semibold group btn-premium"
                >
                  Commencer gratuitement
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-16 px-10 text-lg font-semibold border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                  <Play className="w-4 h-4 text-blue-600 ml-0.5" />
                </div>
                Voir la démo
              </Button>
            </div>

            {/* Trust Badge */}
            <p className="text-sm text-gray-500 mt-6 animate-fade-in opacity-0-initial stagger-4" style={{ animationFillMode: "forwards" }}>
              <CheckCircle2 className="w-4 h-4 inline mr-1 text-green-500" />
              Essai gratuit de 14 jours • Sans carte bancaire • Annulation à tout moment
            </p>
          </div>

          {/* Stats Grid */}
          <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up opacity-0-initial stagger-5" style={{ animationFillMode: "forwards" }}>
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group relative text-center p-8 rounded-2xl bg-white border border-gray-100 shadow-premium hover:shadow-premium-lg transition-all duration-500 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-900 font-semibold">{stat.label}</div>
                  <div className="text-gray-500 text-sm">{stat.sublabel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-soft hidden lg:block">
          <a href="#features" className="flex flex-col items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors">
            <span className="text-xs font-medium uppercase tracking-wider">Découvrir</span>
            <ChevronDown className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* ============================================
          FEATURES SECTION PREMIUM
          ============================================ */}
      <section id="features" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.05),transparent_50%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-20">
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 mb-4">Fonctionnalités</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Tout ce dont vous avez{" "}
              <span className="text-gradient">besoin</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une suite complète d'outils pour transformer votre concession en machine à performer.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`group relative overflow-hidden border-0 shadow-premium hover:shadow-premium-lg transition-all duration-500 cursor-pointer ${
                  activeFeature === index ? "ring-2 ring-blue-500/20" : ""
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                <CardHeader className="pb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600 leading-relaxed mb-4">
                    {feature.description}
                  </CardDescription>
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    {feature.stats}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          HOW IT WORKS SECTION
          ============================================ */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 mb-4">Comment ça marche</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Démarrez en{" "}
              <span className="text-gradient">3 étapes</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une mise en place rapide et simple pour commencer à performer dès aujourd'hui.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: "01",
                title: "Créez votre compte",
                description: "Inscrivez votre concession en quelques clics. Configuration guidée et rapide pour démarrer immédiatement.",
                icon: ShieldCheck,
                color: "from-blue-500 to-blue-600"
              },
              {
                step: "02",
                title: "Invitez votre équipe",
                description: "Ajoutez vos commerciaux par email. Ils reçoivent une invitation personnalisée avec accès instantané.",
                icon: Users,
                color: "from-indigo-500 to-indigo-600"
              },
              {
                step: "03",
                title: "Lancez les challenges",
                description: "Créez vos premiers défis, suivez les performances en temps réel et motivez vos équipes.",
                icon: Trophy,
                color: "from-violet-500 to-violet-600"
              }
            ].map((item, index) => (
              <div key={index} className="relative group">
                {/* Connector Line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5">
                    <div className="h-full bg-gradient-to-r from-gray-200 to-gray-100" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
                
                <div className="relative flex flex-col items-center text-center">
                  {/* Step Number with Icon */}
                  <div className="relative mb-8">
                    <div className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-2xl shadow-blue-500/20 group-hover:shadow-blue-500/40 group-hover:scale-105 transition-all duration-500`}>
                      <item.icon className="w-14 h-14 text-white" />
                    </div>
                    <div className="absolute -bottom-3 -right-3 w-12 h-12 rounded-xl bg-white shadow-lg flex items-center justify-center">
                      <span className="text-2xl font-bold text-gradient">{item.step}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed max-w-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          TESTIMONIALS SECTION PREMIUM
          ============================================ */}
      <section id="testimonials" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(99,102,241,0.05),transparent_50%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="bg-amber-50 text-amber-700 border-amber-200 mb-4">Témoignages</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Ils nous font{" "}
              <span className="text-gradient">confiance</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez ce que les professionnels de l'automobile disent de nous.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="group border-0 shadow-premium hover:shadow-premium-lg transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                <CardContent className="p-8">
                  {/* Quote Icon */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Quote className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  
                  {/* Quote */}
                  <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                    "{testimonial.quote}"
                  </p>
                  
                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{testimonial.author}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                      <p className="text-sm text-gray-400">{testimonial.dealership}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          PRICING SECTION PREMIUM
          ============================================ */}
      <section id="pricing" className="py-24 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 mb-4">Tarifs</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Simple et transparent
            </h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              Toutes les fonctionnalités incluses, sans frais cachés. Commencez gratuitement.
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <Card className="border-0 shadow-2xl overflow-hidden relative">
              {/* Popular Badge */}
              <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400 to-amber-500 text-white text-sm font-bold px-6 py-2 rounded-bl-xl z-10">
                POPULAIRE
              </div>
              
              {/* Header */}
              <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-10 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30" />
                <p className="text-blue-100 font-medium mb-3">Toutes fonctionnalités incluses</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-2xl text-blue-200">€</span>
                  <span className="text-7xl font-bold text-white">0</span>
                  <span className="text-xl text-blue-200">/mois</span>
                </div>
                <p className="text-blue-200 mt-3">Pendant la période de lancement</p>
              </div>
              
              {/* Features */}
              <CardContent className="p-10">
                <ul className="space-y-4">
                  {pricingFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-4 group">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link href="/register" className="block mt-10">
                  <Button 
                    size="lg" 
                    className="w-full h-16 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 font-semibold group"
                  >
                    Démarrer gratuitement
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <p className="text-center text-sm text-gray-500 mt-4">
                  Sans engagement • Annulation à tout moment
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ============================================
          CTA SECTION PREMIUM
          ============================================ */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 mb-8">
            <Zap className="w-4 h-4 text-amber-600" />
            <span className="text-amber-700 text-sm font-semibold">Rejoignez 500+ concessions</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Prêt à transformer votre{" "}
            <span className="text-gradient">concession</span> ?
          </h2>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Rejoignez les concessions qui ont déjà boosté leurs performances avec AutoPerf Pro.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 h-16 px-10 text-lg font-semibold group"
              >
                Créer mon compte gratuit
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-16 px-10 text-lg font-semibold border-2"
            >
              <Users className="w-5 h-5 mr-2" />
              Contacter l'équipe
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-sm">Sécurisé & conforme</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm">Support 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              <span className="text-sm">Application mobile</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          FOOTER PREMIUM
          ============================================ */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Car className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="font-bold text-xl">AutoPerf</span>
                  <span className="text-xs text-gray-400 block -mt-1">Pro</span>
                </div>
              </Link>
              <p className="text-gray-400 max-w-sm mb-6 leading-relaxed">
                La plateforme de référence pour booster les performances de vos équipes commerciales automobile.
              </p>
              <div className="flex gap-4">
                {["Twitter", "LinkedIn", "Instagram"].map((social) => (
                  <a 
                    key={social}
                    href="#" 
                    className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-xs font-medium">{social[0]}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-6">Produit</h4>
              <ul className="space-y-4">
                {["Fonctionnalités", "Tarifs", "Intégrations", "API", "Changelog"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6">Entreprise</h4>
              <ul className="space-y-4">
                {["À propos", "Blog", "Carrières", "Contact", "Presse"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 AutoPerf Pro. Tous droits réservés.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Mentions légales</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Confidentialité</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">CGU</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
