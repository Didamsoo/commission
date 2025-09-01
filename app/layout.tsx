//layout.tsx

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Gestionnaire de Marges Automobile - RENTA VO/VN/VU",
  description:
    "Calculez et optimisez vos marges et commissions de vente automobile. Outil professionnel pour vendeurs automobiles.",
  keywords: "marge automobile, commission vendeur, calcul marge, VO, VN, VU, automobile",
  authors: [{ name: "Gestionnaire Marges" }],
  creator: "Gestionnaire Marges",
  publisher: "Gestionnaire Marges",
  applicationName: "Gestionnaire de Marges Automobile",
  generator: "Next.js",

  // Open Graph (Facebook, LinkedIn, etc.)
  openGraph: {
    title: "Gestionnaire de Marges Automobile",
    description: "Calculez et optimisez vos marges et commissions de vente automobile",
    url: "https://feuilledemarge.netlify.app",
    siteName: "Gestionnaire de Marges Automobile",
    type: "website",
    locale: "fr_FR",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Gestionnaire de Marges Automobile",
    description: "Calculez et optimisez vos marges et commissions de vente automobile",
  },

  // Autres métadonnées
  robots: {
    index: true,
    follow: true,
  },

  // Favicon et icônes
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
