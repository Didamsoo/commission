import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { AUTH_STATE_PATH } from './fixtures'

// Pages publiques (pas d'auth)
const PUBLIC_PAGES = ['/login', '/register']

// Pages protégées (nécessitent auth)
const PROTECTED_PAGES = ['/dashboard', '/calculator', '/leaderboard', '/challenges', '/profile']

test.describe('Accessibilité — pages publiques', () => {
  for (const pagePath of PUBLIC_PAGES) {
    test(`${pagePath} passe les checks WCAG 2.0 AA`, async ({ page }) => {
      await page.goto(pagePath)
      await page.waitForLoadState('networkidle')

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze()

      const seriousViolations = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious')

      if (seriousViolations.length > 0) {
        const summary = seriousViolations.map((v) => `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} occurrences)`).join('\n')
        console.warn(`A11y violations on ${pagePath}:\n${summary}`)
      }

      expect(seriousViolations).toHaveLength(0)
    })
  }
})

test.describe('Accessibilité — pages protégées', () => {
  test.use({ storageState: AUTH_STATE_PATH })

  for (const pagePath of PROTECTED_PAGES) {
    test(`${pagePath} passe les checks WCAG 2.0 AA`, async ({ page }) => {
      await page.goto(pagePath)
      await page.waitForLoadState('networkidle')

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze()

      const seriousViolations = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious')

      if (seriousViolations.length > 0) {
        const summary = seriousViolations.map((v) => `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} occurrences)`).join('\n')
        console.warn(`A11y violations on ${pagePath}:\n${summary}`)
      }

      expect(seriousViolations).toHaveLength(0)
    })
  }
})
