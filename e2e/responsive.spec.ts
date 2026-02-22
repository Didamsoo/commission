import { test, expect } from '@playwright/test'
import { AUTH_STATE_PATH } from './fixtures'

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablette', width: 820, height: 1180 },
  { name: 'desktop', width: 1440, height: 900 },
] as const

const PAGES = ['/login', '/dashboard', '/calculator', '/challenges', '/leaderboard']

test.describe('Responsive', () => {
  test.use({ storageState: AUTH_STATE_PATH })

  for (const viewport of VIEWPORTS) {
    test.describe(`${viewport.name} (${viewport.width}px)`, () => {
      test.use({ viewport: { width: viewport.width, height: viewport.height } })

      for (const pagePath of PAGES) {
        test(`${pagePath} — pas de scroll horizontal`, async ({ page }) => {
          // Les pages publiques n'ont pas besoin d'auth
          if (pagePath === '/login') {
            // Pour login, on crée un contexte sans auth
            await page.goto(pagePath)
          } else {
            await page.goto(pagePath)
          }

          await page.waitForLoadState('domcontentloaded')

          // Vérifie qu'il n'y a pas de scroll horizontal
          const hasHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth
          })

          expect(hasHorizontalScroll).toBe(false)
        })
      }

      test('la navigation est accessible', async ({ page }) => {
        await page.goto('/dashboard')
        await page.waitForLoadState('domcontentloaded')

        // Sur mobile, vérifie qu'il y a un menu burger ou une navigation visible
        if (viewport.name === 'mobile') {
          // Cherche un bouton de menu hamburger ou une navigation bottom
          const hasMenuButton = await page
            .locator('button[aria-label*="menu" i], button[aria-label*="Menu" i], [data-sidebar-trigger], nav')
            .first()
            .isVisible()
            .catch(() => false)

          const hasBottomNav = await page
            .locator('nav, [role="navigation"]')
            .first()
            .isVisible()
            .catch(() => false)

          expect(hasMenuButton || hasBottomNav).toBe(true)
        } else {
          // Sur tablette/desktop, vérifie qu'une navigation est visible
          const nav = page.locator('nav, [role="navigation"], aside').first()
          await expect(nav).toBeVisible()
        }
      })
    })
  }
})
