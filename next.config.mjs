import { withSentryConfig } from '@sentry/nextjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  eslint: {
    // Lint strict est lancé manuellement via `npm run lint:strict`
    // Le build ne doit pas échouer sur les warnings existants
    ignoreDuringBuilds: true
  }
}

export default withSentryConfig(nextConfig, {
  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // Upload source maps for readable stack traces
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Route Sentry requests through the server to avoid ad-blockers
  tunnelRoute: '/monitoring'
})
