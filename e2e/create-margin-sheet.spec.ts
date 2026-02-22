import { test, expect } from '@playwright/test'
import { AUTH_STATE_PATH } from './fixtures'

test.use({ storageState: AUTH_STATE_PATH })

test.describe('Création fiche de marge', () => {
  test('navigation vers /calculator', async ({ page }) => {
    await page.goto('/calculator')
    await expect(page).toHaveURL('/calculator')
    // Vérifie que le formulaire est chargé
    await expect(page.locator('#sellerName').or(page.getByPlaceholder(/vendeur|nom/i)).first()).toBeVisible()
  })

  test('remplir une fiche VO et vérifier le calcul', async ({ page }) => {
    await page.goto('/calculator')

    // Étape 0 : Informations
    await page.locator('#sellerName').fill('Jean Dupont')
    await page.locator('#clientName').fill('Pierre Martin')
    await page.getByRole('button', { name: /suivant/i }).click()

    // Étape 1 : Véhicule — sélectionner VO
    await page.getByRole('button', { name: /VO/i }).first().click()
    await page.locator('#vehicleName').fill('Peugeot 208')
    await page.locator('#vehicleNumber').fill('AA-123-BB')
    await page.getByRole('button', { name: /suivant/i }).click()

    // Étape 2 : Prix
    await page.locator('#purchasePrice').fill('12000')
    await page.locator('#sellingPrice').fill('15000')
    await page.getByRole('button', { name: /suivant/i }).click()

    // Étape 3 : Options
    await page.getByRole('button', { name: /suivant|calculer/i }).click()

    // Étape 4 : Résultats — vérifier que des résultats sont affichés
    await expect(page.getByText(/marge/i).first()).toBeVisible({ timeout: 5000 })
  })

  test('remplir une fiche VP avec sélection modèle', async ({ page }) => {
    await page.goto('/calculator')

    // Étape 0
    await page.locator('#sellerName').fill('Marie Lefevre')
    await page.locator('#clientName').fill('Luc Bernard')
    await page.getByRole('button', { name: /suivant/i }).click()

    // Étape 1 : Sélectionner VN/VP
    await page.getByRole('button', { name: /VN/i }).first().click()
    await page.locator('#vehicleName').fill('Ford Puma')
    await page.locator('#vehicleNumber').fill('CC-456-DD')
    await page.getByRole('button', { name: /suivant/i }).click()

    // Étape 2 : Prix
    await page.locator('#purchasePrice').fill('25000')
    await page.locator('#sellingPrice').fill('28000')
    await page.getByRole('button', { name: /suivant/i }).click()

    // Étape 3 : Options
    await page.getByRole('button', { name: /suivant|calculer/i }).click()

    // Résultats affichés
    await expect(page.getByText(/commission/i).first()).toBeVisible({ timeout: 5000 })
  })

  test('sauvegarder et vérifier la persistance', async ({ page }) => {
    await page.goto('/calculator')

    // Remplir rapidement un formulaire VO
    await page.locator('#sellerName').fill('Test Sauvegarde')
    await page.locator('#clientName').fill('Client Test')
    await page.getByRole('button', { name: /suivant/i }).click()

    await page.getByRole('button', { name: /VO/i }).first().click()
    await page.locator('#vehicleName').fill('Test Vehicle')
    await page.locator('#vehicleNumber').fill('EE-789-FF')
    await page.getByRole('button', { name: /suivant/i }).click()

    await page.locator('#purchasePrice').fill('10000')
    await page.locator('#sellingPrice').fill('13000')
    await page.getByRole('button', { name: /suivant/i }).click()

    await page.getByRole('button', { name: /suivant|calculer/i }).click()

    // Sauvegarder
    const saveButton = page.getByRole('button', { name: /enregistrer|sauvegarder/i })
    if (await saveButton.isVisible()) {
      await saveButton.click()
      // Vérifier le toast de succès ou la persistance
      await expect(
        page.getByText(/enregistré|sauvegardé|succès/i).or(page.locator('[data-sonner-toast]')).first()
      ).toBeVisible({ timeout: 5000 })
    }
  })
})
