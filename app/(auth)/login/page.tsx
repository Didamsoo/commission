"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Car,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Shield,
  Zap,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"

// ============================================
// PREMIUM LOGIN PAGE - AutoPerf Pro
// ============================================

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    if (error) {
      setIsLoading(false)
      if (error.message === "Invalid login credentials") {
        setError("Email ou mot de passe incorrect.")
      } else if (error.message === "Email not confirmed") {
        setError("Veuillez confirmer votre email avant de vous connecter.")
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.")
      }
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8 animate-fade-in-up opacity-0-initial" style={{ animationFillMode: "forwards" }}>
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-3 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-xl shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-all duration-300 group-hover:scale-105">
              <Car className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <span className="font-bold text-2xl text-gray-900">AutoPerf</span>
              <span className="block text-sm text-gray-500 font-medium -mt-1">Pro</span>
            </div>
          </Link>

          {/* Form Card */}
          <Card className="border-0 shadow-premium-lg bg-white/80 backdrop-blur-xl">
            <CardHeader className="space-y-1 pb-6">
              <div className="flex items-center justify-center mb-2">
                <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Content de vous revoir
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold text-center text-gray-900">
                Connexion
              </CardTitle>
              <CardDescription className="text-center text-gray-600">
                Entrez vos identifiants pour accéder à votre espace
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    Adresse email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nom@concession.fr"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="h-12 pl-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="h-12 pl-11 pr-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))}
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                      Se souvenir de moi
                    </Label>
                  </div>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 group"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Connexion...</span>
                    </div>
                  ) : (
                    <>
                      Se connecter
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600">
            Vous n&apos;avez pas de compte ?{" "}
            <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
          <div className="max-w-lg text-center space-y-8">
            {/* Stats Preview */}
            <div className="grid grid-cols-3 gap-6 mb-12">
              {[
                { value: "15%", label: "Ventes en plus" },
                { value: "2x", label: "Engagement" },
                { value: "98%", label: "Satisfaction" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-blue-100 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <blockquote className="text-xl leading-relaxed text-blue-50">
              &ldquo;AutoPerf Pro a transformé notre façon de travailler. Nos commerciaux sont plus motivés que jamais et nos résultats parlent d&apos;eux-mêmes.&rdquo;
            </blockquote>

            <div className="flex items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
                MD
              </div>
              <div className="text-left">
                <p className="font-semibold">Marie Durand</p>
                <p className="text-blue-200 text-sm">Directrice Commerciale, Ford Paris Est</p>
              </div>
            </div>

            {/* Features */}
            <div className="flex items-center justify-center gap-6 pt-8">
              {[
                { icon: Shield, label: "Sécurisé" },
                { icon: Zap, label: "Rapide" },
                { icon: CheckCircle2, label: "Fiable" }
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-blue-100">
                  <feature.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
