// layout.tsx - Premium Design System

import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"

// ============================================
// TYPOGRAPHY - Premium Font Stack
// ============================================

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap"
})

// ============================================
// METADATA - SEO & Social
// ============================================

export const metadata: Metadata = {
  title: {
    default: "AutoPerf Pro - Boostez les performances de vos commerciaux",
    template: "%s | AutoPerf Pro"
  },
  description:
    "La plateforme tout-en-un pour calculer les marges, suivre les performances et motiver vos équipes avec la gamification. Transformez votre concession en machine à performer.",
  keywords: [
    "marge automobile", 
    "commission vendeur", 
    "calcul marge", 
    "VO", 
    "VN", 
    "VU", 
    "automobile",
    "performance commerciale",
    "gamification",
    "concession automobile"
  ],
  authors: [{ name: "AutoPerf Pro" }],
  creator: "AutoPerf Pro",
  publisher: "AutoPerf Pro",
  applicationName: "AutoPerf Pro - Gestionnaire de Marges Automobile",
  generator: "Next.js",
  
  metadataBase: new URL("https://feuilledemarge.netlify.app"),

  // Open Graph (Facebook, LinkedIn, etc.)
  openGraph: {
    title: "AutoPerf Pro - Boostez les performances de vos commerciaux",
    description: "La plateforme tout-en-un pour calculer les marges, suivre les performances et motiver vos équipes avec la gamification.",
    url: "https://feuilledemarge.netlify.app",
    siteName: "AutoPerf Pro",
    type: "website",
    locale: "fr_FR",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AutoPerf Pro - Gestionnaire de Marges Automobile"
      }
    ]
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "AutoPerf Pro - Boostez les performances de vos commerciaux",
    description: "La plateforme tout-en-un pour calculer les marges, suivre les performances et motiver vos équipes.",
    images: ["/twitter-image.jpg"]
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },

  // Verification
  verification: {
    google: "your-google-verification-code"
  },

  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: [
      { url: "/apple-touch-icon.png" }
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#3b82f6"
      }
    ]
  },

  // Manifest
  manifest: "/manifest.json",

  // Apple
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AutoPerf Pro"
  },

  // Category
  category: "business"
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" }
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true
}

// ============================================
// ROOT LAYOUT
// ============================================

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
