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
    unoptimized: true, // nécessaire pour next export
  },
  output: 'export', // génère "out/"
  basePath: isProd ? '/commission' : '',
  assetPrefix: isProd ? '/commission/' : '',
}

export default nextConfig
