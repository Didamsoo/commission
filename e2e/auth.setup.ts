import { test as setup } from '@playwright/test'
import { TEST_USERS, AUTH_STATE_PATH } from './fixtures'

setup('authenticate', async ({ page }) => {
  // Navigate to login page
  await page.goto('/login')

  // Fill login form
  await page.getByLabel(/email/i).fill(TEST_USERS.commercial.email)
  await page.getByLabel(/mot de passe|password/i).fill(TEST_USERS.commercial.password)
  await page.getByRole('button', { name: /connexion|se connecter|login/i }).click()

  // Wait for redirect to dashboard
  await page.waitForURL('/dashboard', { timeout: 15000 })

  // Save authentication state
  await page.context().storageState({ path: AUTH_STATE_PATH })
})
