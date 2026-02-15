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
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  User,
  Building2,
  Phone,
  Shield,
  Zap,
  BadgeCheck,
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
// PREMIUM REGISTER PAGE - AutoPerf Pro
// ============================================

const steps = [
  { id: "account", label: "Compte", description: "Vos identifiants" },
  { id: "profile", label: "Profil", description: "Vos informations" },
  { id: "dealership", label: "Concession", description: "Votre entreprise" }
]

export default function RegisterPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    dealershipName: "",
    dealershipAddress: "",
    acceptTerms: false
  })

  // Validation côté client par étape
  const validateStep = (): string | null => {
    if (currentStep === 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        return "Veuillez entrer une adresse email valide (ex: nom@concession.fr)."
      }
      if (formData.password.length < 6) {
        return "Le mot de passe doit contenir au moins 6 caractères."
      }
      if (!/[A-Z]/.test(formData.password)) {
        return "Le mot de passe doit contenir au moins une majuscule."
      }
      if (!/[0-9]/.test(formData.password)) {
        return "Le mot de passe doit contenir au moins un chiffre."
      }
      if (formData.password !== formData.confirmPassword) {
        return "Les mots de passe ne correspondent pas."
      }
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation côté client avant de passer à l'étape suivante
    const validationError = validateStep()
    if (validationError) {
      setError(validationError)
      return
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      setIsLoading(true)

      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: `${formData.firstName} ${formData.lastName}`,
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            dealership_name: formData.dealershipName,
            dealership_address: formData.dealershipAddress,
            role: "commercial"
          }
        }
      })

      setIsLoading(false)

      if (error) {
        if (error.message.includes("already registered") || error.message.includes("already been registered")) {
          setError("Cet email est déjà utilisé. Essayez de vous connecter.")
        } else if (error.message.includes("password")) {
          setError("Le mot de passe doit contenir au moins 6 caractères.")
        } else if (error.message.includes("valid email") || error.message.includes("invalid") || error.message.includes("Unable to validate")) {
          setError("Cette adresse email n'est pas valide. Veuillez vérifier et réessayer.")
        } else if (error.message.includes("rate limit") || error.message.includes("too many")) {
          setError("Trop de tentatives. Veuillez patienter quelques minutes.")
        } else {
          setError(`Une erreur est survenue : ${error.message}`)
        }
        return
      }

      setIsSuccess(true)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      setError(null)
    }
  }

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.email && formData.password && formData.confirmPassword && formData.password === formData.confirmPassword
      case 1:
        return formData.firstName && formData.lastName && formData.phone
      case 2:
        return formData.dealershipName && formData.acceptTerms
      default:
        return false
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-premium-lg text-center animate-fade-in-scale">
          <CardContent className="pt-12 pb-12 px-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/25">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Bienvenue !
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Votre compte a été créé avec succès. Un email de confirmation vous a été envoyé à <span className="font-semibold text-gray-900">{formData.email}</span>
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => { router.push("/dashboard"); router.refresh() }}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/25"
              >
                Accéder au tableau de bord
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <p className="text-sm text-gray-500">
                Vous pouvez aussi consulter votre email pour vérifier votre compte
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col lg:flex-row">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-xl space-y-8 animate-fade-in-up opacity-0-initial" style={{ animationFillMode: "forwards" }}>
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

          {/* Progress Steps */}
          <div className="flex items-center justify-between max-w-md mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1 last:flex-initial">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    index === currentStep
                      ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                      : index < currentStep
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}>
                    {index < currentStep ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500 ${
                    index < currentStep ? "bg-green-500" : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Form Card */}
          <Card className="border-0 shadow-premium-lg bg-white/80 backdrop-blur-xl">
            <CardHeader className="space-y-1 pb-6">
              <div className="flex items-center justify-center mb-2">
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Gratuit pendant 14 jours
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold text-center text-gray-900">
                {currentStep === 0 && "Créez votre compte"}
                {currentStep === 1 && "Parlez-nous de vous"}
                {currentStep === 2 && "Votre concession"}
              </CardTitle>
              <CardDescription className="text-center text-gray-600">
                {currentStep === 0 && "Commencez par créer vos identifiants de connexion"}
                {currentStep === 1 && "Ces informations nous aideront à personnaliser votre expérience"}
                {currentStep === 2 && "Dernière étape ! Indiquez-nous où vous travaillez"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 mb-5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Step 1: Account */}
                {currentStep === 0 && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                        Adresse email professionnelle
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="vous@concession.fr"
                          value={formData.email}
                          onChange={(e) => updateFormData("email", e.target.value)}
                          className="h-12 pl-11 bg-gray-50 border-gray-200 focus:bg-white"
                          required
                        />
                      </div>
                    </div>

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
                          onChange={(e) => updateFormData("password", e.target.value)}
                          className="h-12 pl-11 pr-11 bg-gray-50 border-gray-200"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Minimum 8 caractères, dont 1 majuscule et 1 chiffre
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                        Confirmer le mot de passe
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                          className="h-12 pl-11 bg-gray-50 border-gray-200"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Profile */}
                {currentStep === 1 && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">
                          Prénom
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="firstName"
                            placeholder="Jean"
                            value={formData.firstName}
                            onChange={(e) => updateFormData("firstName", e.target.value)}
                            className="h-12 pl-11 bg-gray-50 border-gray-200"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">
                          Nom
                        </Label>
                        <Input
                          id="lastName"
                          placeholder="Dupont"
                          value={formData.lastName}
                          onChange={(e) => updateFormData("lastName", e.target.value)}
                          className="h-12 bg-gray-50 border-gray-200"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                        Téléphone professionnel
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+33 6 12 34 56 78"
                          value={formData.phone}
                          onChange={(e) => updateFormData("phone", e.target.value)}
                          className="h-12 pl-11 bg-gray-50 border-gray-200"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Dealership */}
                {currentStep === 2 && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="space-y-2">
                      <Label htmlFor="dealershipName" className="text-sm font-semibold text-gray-700">
                        Nom de la concession
                      </Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="dealershipName"
                          placeholder="Ford Paris Est"
                          value={formData.dealershipName}
                          onChange={(e) => updateFormData("dealershipName", e.target.value)}
                          className="h-12 pl-11 bg-gray-50 border-gray-200"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dealershipAddress" className="text-sm font-semibold text-gray-700">
                        Adresse de la concession
                      </Label>
                      <Input
                        id="dealershipAddress"
                        placeholder="123 Avenue des Champs-Élysées, 75008 Paris"
                        value={formData.dealershipAddress}
                        onChange={(e) => updateFormData("dealershipAddress", e.target.value)}
                        className="h-12 bg-gray-50 border-gray-200"
                      />
                    </div>

                    <div className="flex items-start space-x-3 pt-2">
                      <Checkbox
                        id="terms"
                        checked={formData.acceptTerms}
                        onCheckedChange={(checked) => updateFormData("acceptTerms", checked as boolean)}
                        className="mt-1"
                      />
                      <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed cursor-pointer">
                        J&apos;accepte les{" "}
                        <Link href="#" className="text-blue-600 hover:underline font-medium">conditions d&apos;utilisation</Link>
                        {" "}et la{" "}
                        <Link href="#" className="text-blue-600 hover:underline font-medium">politique de confidentialité</Link>
                      </Label>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-3 pt-4">
                  {currentStep > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex-1 h-12 font-semibold"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Retour
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={!isStepValid() || isLoading}
                    className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/25 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Création...</span>
                      </div>
                    ) : currentStep < steps.length - 1 ? (
                      <>
                        Continuer
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    ) : (
                      <>
                        Créer mon compte
                        <CheckCircle2 className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Login Link */}
          <p className="text-center text-gray-600">
            Vous avez déjà un compte ?{" "}
            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              Se connecter
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Features */}
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
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <div className="max-w-md space-y-8">
            <h2 className="text-4xl font-bold leading-tight">
              Rejoignez les meilleures concessions
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Découvrez pourquoi plus de 500 concessions nous font confiance pour booster leurs performances.
            </p>

            {/* Feature List */}
            <div className="space-y-4 pt-4">
              {[
                { icon: BadgeCheck, text: "Essai gratuit de 14 jours" },
                { icon: Zap, text: "Mise en place en 5 minutes" },
                { icon: Shield, text: "Sans engagement" }
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-lg font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Trust Badge */}
            <div className="pt-8 flex items-center gap-4">
              <div className="flex -space-x-3">
                {["MD", "TR", "SB", "LP"].map((initials, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-white/20 border-2 border-blue-600 flex items-center justify-center text-sm font-bold"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <div>
                <p className="font-semibold">+500 concessions</p>
                <p className="text-sm text-blue-200">nous font confiance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
