import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gestionnaire de Marges Automobile - RENTA VO/VN/VU',
  description: 'Calculez et optimisez vos marges et commissions de vente automobile. Outil professionnel pour vendeurs automobiles.',
  keywords: 'marge automobile, commission vendeur, calcul marge, VO, VN, VU, automobile',
  authors: [{ name: 'Gestionnaire Marges' }],
  creator: 'Gestionnaire Marges',
  publisher: 'Gestionnaire Marges',
  applicationName: 'Gestionnaire de Marges Automobile',
  generator: 'Next.js',
  
  // Open Graph (Facebook, LinkedIn, etc.)
  openGraph: {
    title: 'Gestionnaire de Marges Automobile',
    description: 'Calculez et optimisez vos marges et commissions de vente automobile',
    url: 'https://feuilledemarge.netlify.app',
    siteName: 'Gestionnaire de Marges Automobile',
    type: 'website',
    locale: 'fr_FR',
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Gestionnaire de Marges Automobile',
    description: 'Calculez et optimisez vos marges et commissions de vente automobile',
    creator: '@votre_twitter', // Optionnel
  },
  
  // Autres métadonnées
  robots: {
    index: true,
    follow: true,
  },
  
  // Favicon et icônes
  icons: {
    icon: '/favicon.ico',
  },
}