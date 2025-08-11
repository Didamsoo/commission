/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // évite l’optimisation serveur (incompatible avec export)
  },
  output: 'export', // génère un site statique dans "out/"
  basePath: isProd ? '/commission' : '',
  assetPrefix: isProd ? '/commission/' : ''
}

export default nextConfig
