import { test, expect } from '@playwright/test'
import { TEST_USERS } from './fixtures'

test.describe('Login → Dashboard', () => {
  test('login réussi redirige vers /dashboard', async ({ page }) => {
    await page.goto('/login')

    await page.locator('#email').fill(TEST_USERS.commercial.email)
    await page.locator('#password').fill(TEST_USERS.commercial.password)
    await page.getByRole('button', { name: /se connecter/i }).click()

    await page.waitForURL('/dashboard', { timeout: 15000 })
    expect(page.url()).toContain('/dashboard')
  })

  test('identifiants invalides affichent un message d\'erreur', async ({ page }) => {
    await page.goto('/login')

    await page.locator('#email').fill('wrong@example.com')
    await page.locator('#password').fill('WrongPassword123!')
    await page.getByRole('button', { name: /se connecter/i }).click()

    // Attend l'affichage du message d'erreur
    await expect(page.getByRole('alert').or(page.locator('[class*="error"], [class*="destructive"]'))).toBeVisible({
      timeout: 10000,
    })
  })

  test('accès non authentifié redirige vers /login', async ({ page }) => {
    await page.goto('/dashboard')

    // Devrait être redirigé vers login
    await page.waitForURL(/\/(login|auth)/, { timeout: 10000 })
    expect(page.url()).toMatch(/\/(login|auth)/)
  })

  test('lien "Mot de passe oublié" mène à /forgot-password', async ({ page }) => {
    await page.goto('/login')

    const forgotLink = page.getByRole('link', { name: /mot de passe oublié/i })
    await expect(forgotLink).toBeVisible()
    await forgotLink.click()

    await page.waitForURL('/forgot-password', { timeout: 5000 })
    expect(page.url()).toContain('/forgot-password')
  })

  test('lien "Créer un compte" mène à /register', async ({ page }) => {
    await page.goto('/login')

    const registerLink = page.getByRole('link', { name: /créer un compte/i })
    await expect(registerLink).toBeVisible()
    await registerLink.click()

    await page.waitForURL('/register', { timeout: 5000 })
    expect(page.url()).toContain('/register')
  })
})
