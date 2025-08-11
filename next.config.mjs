/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  // On tolère les warnings/erreurs de lint/TS pendant le build CI
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // Nécessaire pour un export statique (pas d’optimizer d’images côté serveur)
  images: { unoptimized: true },

  // GitHub Pages = hébergement statique
  output: 'export',

  // IMPORTANT : ton site est servi sous /commission (project pages)
  basePath: isProd ? '/commission' : '',
  assetPrefix: isProd ? '/commission/' : '',

  // (Optionnel mais utile avec export)
  // trailingSlash: true,
}

export default nextConfig
