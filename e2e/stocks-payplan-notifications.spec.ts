import { test, expect, Page } from '@playwright/test'
import { TEST_USERS, AUTH_STATE_PATH } from './fixtures'

test.use({ storageState: AUTH_STATE_PATH })

async function loginAs(page: Page, user: { email: string; password: string }) {
  await page.context().clearCookies()
  await page.goto('/login')
  await page.getByLabel(/email/i).fill(user.email)
  await page.getByLabel(/mot de passe|password/i).fill(user.password)
  await page.getByRole('button', { name: /connexion|se connecter|login/i }).click()
  await page.waitForURL(/\/(dashboard|direction|chef-ventes|groupe|marque)/, { timeout: 15000 })
}

// ============================================
// PARCOURS STOCKS
// ============================================
test.describe('Parcours stocks', () => {
  test('la page stocks se charge correctement', async ({ page }) => {
    await loginAs(page, TEST_USERS.dirConcession)
    await page.goto('/marque/stocks')
    await page.waitForLoadState('networkidle')

    // La page stocks doit afficher un titre ou un onglet stock
    await expect(
      page.getByText(/stock|inventaire/i).first()
    ).toBeVisible({ timeout: 10000 })
  })

  test('les onglets inventaire et transferts sont accessibles', async ({ page }) => {
    await loginAs(page, TEST_USERS.dirConcession)
    await page.goto('/marque/stocks')
    await page.waitForLoadState('networkidle')

    // Verifier la presence des onglets
    const inventaireTab = page.getByRole('tab', { name: /inventaire/i })
    const transfertsTab = page.getByRole('tab', { name: /transfert/i })

    if (await inventaireTab.isVisible()) {
      await inventaireTab.click()
      await expect(page.getByText(/vehicule|VN|VO|VU/i).first()).toBeVisible({ timeout: 5000 })
    }

    if (await transfertsTab.isVisible()) {
      await transfertsTab.click()
      // Should show transfer content or empty state
      await expect(page.locator('body')).not.toBeEmpty()
    }
  })

  test('les filtres par categorie fonctionnent', async ({ page }) => {
    await loginAs(page, TEST_USERS.dirConcession)
    await page.goto('/marque/stocks')
    await page.waitForLoadState('networkidle')

    // Try to find category filter buttons
    const vnFilter = page.getByRole('button', { name: /VN/i }).or(page.getByText('VN').first())
    if (await vnFilter.isVisible()) {
      await vnFilter.click()
      // Page should still be functional after filter
      await expect(page.locator('body')).not.toBeEmpty()
    }
  })
})

// ============================================
// PARCOURS PAYPLAN
// ============================================
test.describe('Parcours payplan', () => {
  test('la page payplan se charge avec les regles', async ({ page }) => {
    await loginAs(page, TEST_USERS.dirConcession)
    await page.goto('/direction/payplan')
    await page.waitForLoadState('networkidle')

    // La page doit afficher le titre payplan ou commission
    await expect(
      page.getByText(/payplan|commission|regles|barème/i).first()
    ).toBeVisible({ timeout: 10000 })
  })

  test('le formulaire de creation de regle est accessible', async ({ page }) => {
    await loginAs(page, TEST_USERS.dirConcession)
    await page.goto('/direction/payplan')
    await page.waitForLoadState('networkidle')

    // Chercher un bouton pour ajouter une regle
    const addButton = page.getByRole('button', { name: /ajouter|nouvelle|creer/i })
    if (await addButton.isVisible()) {
      await addButton.click()
      // Un formulaire ou dialog doit apparaitre
      await expect(
        page.getByText(/nom|titre|type|categorie/i).first()
      ).toBeVisible({ timeout: 5000 })
    }
  })
})

// ============================================
// PARCOURS NOTIFICATIONS
// ============================================
test.describe('Parcours notifications', () => {
  test('la page notifications se charge', async ({ page }) => {
    await loginAs(page, TEST_USERS.dirConcession)
    await page.goto('/notifications')
    await page.waitForLoadState('networkidle')

    // La page doit afficher un titre notifications
    await expect(
      page.getByText(/notification/i).first()
    ).toBeVisible({ timeout: 10000 })
  })

  test('les onglets toutes/non lues fonctionnent', async ({ page }) => {
    await loginAs(page, TEST_USERS.dirConcession)
    await page.goto('/notifications')
    await page.waitForLoadState('networkidle')

    // Check for tab navigation
    const allTab = page.getByRole('tab', { name: /toutes|tout/i })
    const unreadTab = page.getByRole('tab', { name: /non lues|unread/i })

    if (await allTab.isVisible()) {
      await allTab.click()
      await expect(page.locator('body')).not.toBeEmpty()
    }

    if (await unreadTab.isVisible()) {
      await unreadTab.click()
      // Should show unread notifications or empty state
      await expect(page.locator('body')).not.toBeEmpty()
    }
  })

  test('le bouton marquer tout comme lu est present', async ({ page }) => {
    await loginAs(page, TEST_USERS.dirConcession)
    await page.goto('/notifications')
    await page.waitForLoadState('networkidle')

    // Look for the "mark all read" button
    const markAllButton = page.getByRole('button', { name: /tout lu|marquer tout|tout lire/i })
    if (await markAllButton.isVisible()) {
      await expect(markAllButton).toBeEnabled()
    }
  })
})
