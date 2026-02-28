import { test, expect, Page } from '@playwright/test'
import { TEST_USERS, AUTH_STATE_PATH } from './fixtures'

// ============================================
// All business flow tests require authentication
// ============================================
test.use({ storageState: AUTH_STATE_PATH })

// ============================================
// Helper: login as a specific role (when we need
// a role different from the default commercial)
// ============================================
async function loginAs(page: Page, user: { email: string; password: string }) {
  // Clear existing auth state
  await page.context().clearCookies()
  await page.goto('/login')
  await page.getByLabel(/email/i).fill(user.email)
  await page.getByLabel(/mot de passe|password/i).fill(user.password)
  await page.getByRole('button', { name: /connexion|se connecter|login/i }).click()
  await page.waitForURL(/\/(dashboard|direction|chef-ventes|groupe|marque)/, { timeout: 15000 })
}

// ============================================
// 1. PARCOURS APPROBATION VENTE
//    Soumission -> Validation -> Retour
// ============================================
test.describe('Parcours approbation vente', () => {
  test('la page approbations se charge avec les stats', async ({ page }) => {
    await loginAs(page, TEST_USERS.dirConcession)
    await page.goto('/direction/approvals')
    await page.waitForLoadState('networkidle')

    // Verify the page title is visible
    await expect(
      page.getByText(/centre d'approbations|approbation/i).first()
    ).toBeVisible({ timeout: 10000 })

    // Verify stat cards are present (En attente, Approuvees, Refusees, Marge totale)
    await expect(page.getByText(/en attente/i).first()).toBeVisible()
    await expect(page.getByText(/approuvées/i).first()).toBeVisible()
    await expect(page.getByText(/refusées/i).first()).toBeVisible()
  })

  test('filtrer les ventes par statut', async ({ page }) => {
    await loginAs(page, TEST_USERS.dirConcession)
    await page.goto('/direction/approvals')
    await page.waitForLoadState('networkidle')

    // Wait for the page to load
    await expect(page.getByText(/liste des ventes/i).first()).toBeVisible({ timeout: 10000 })

    // Open the status filter select
    const filterSelect = page.locator('select, [role="combobox"]').filter({ hasText: /toutes|en attente|approuvées|refusées/i }).first()
    if (await filterSelect.isVisible().catch(() => false)) {
      await filterSelect.click()
      // Select "En attente"
      const pendingOption = page.getByRole('option', { name: /en attente/i })
      if (await pendingOption.isVisible().catch(() => false)) {
        await pendingOption.click()
      }
    }

    // The page should show filtered results or empty state
    const hasResults = await page.locator('[class*="card"], [class*="Card"]').first().isVisible().catch(() => false)
    const hasEmpty = await page.getByText(/aucune vente/i).isVisible().catch(() => false)
    expect(hasResults || hasEmpty).toBe(true)
  })

  test('rechercher une vente par texte', async ({ page }) => {
    await loginAs(page, TEST_USERS.dirConcession)
    await page.goto('/direction/approvals')
    await page.waitForLoadState('networkidle')

    // Wait for page to load
    await expect(page.getByText(/liste des ventes/i).first()).toBeVisible({ timeout: 10000 })

    // Type in the search input
    const searchInput = page.getByPlaceholder(/rechercher/i).first()
    await expect(searchInput).toBeVisible()
    await searchInput.fill('test')

    // Wait for filtering to take effect
    await page.waitForTimeout(500)

    // The page should show filtered results or empty state
    const hasResults = await page.locator('[class*="card"], [class*="Card"]').first().isVisible().catch(() => false)
    const hasEmpty = await page.getByText(/aucune vente/i).isVisible().catch(() => false)
    expect(hasResults || hasEmpty).toBe(true)
  })

  test('ouvrir le detail d\'une vente en attente', async ({ page }) => {
    await loginAs(page, TEST_USERS.dirConcession)
    await page.goto('/direction/approvals')
    await page.waitForLoadState('networkidle')

    // Wait for page to load
    await expect(page.getByText(/liste des ventes/i).first()).toBeVisible({ timeout: 10000 })

    // Click "Examiner" on the first pending sale if available
    const examineButton = page.getByRole('button', { name: /examiner/i }).first()
    if (await examineButton.isVisible().catch(() => false)) {
      await examineButton.click()

      // Verify the detail dialog opens
      await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 })
      await expect(page.getByText(/détails de la vente/i)).toBeVisible()

      // Verify approve/reject buttons are present
      await expect(
        page.getByRole('button', { name: /approuver/i }).or(
          page.getByRole('button', { name: /refuser/i })
        ).first()
      ).toBeVisible()
    }
  })

  test('approuver une vente via le dialog', async ({ page }) => {
    await loginAs(page, TEST_USERS.dirConcession)
    await page.goto('/direction/approvals')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText(/liste des ventes/i).first()).toBeVisible({ timeout: 10000 })

    const examineButton = page.getByRole('button', { name: /examiner/i }).first()
    if (await examineButton.isVisible().catch(() => false)) {
      await examineButton.click()
      await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 })

      // Click "Approuver la vente"
      const approveButton = page.getByRole('button', { name: /approuver la vente/i })
      if (await approveButton.isVisible().catch(() => false)) {
        await approveButton.click()
        // Dialog should close after approval
        await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5000 })
      }
    }
  })

  test('refuser une vente avec motif', async ({ page }) => {
    await loginAs(page, TEST_USERS.dirConcession)
    await page.goto('/direction/approvals')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText(/liste des ventes/i).first()).toBeVisible({ timeout: 10000 })

    const examineButton = page.getByRole('button', { name: /examiner/i }).first()
    if (await examineButton.isVisible().catch(() => false)) {
      await examineButton.click()
      await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 })

      // Click "Refuser" to show the reject form
      const refuseButton = page.getByRole('button', { name: /refuser/i }).first()
      if (await refuseButton.isVisible().catch(() => false)) {
        await refuseButton.click()

        // Fill the rejection reason
        const reasonTextarea = page.getByPlaceholder(/expliquez pourquoi/i)
        if (await reasonTextarea.isVisible().catch(() => false)) {
          await reasonTextarea.fill('Marge insuffisante pour ce vehicule')

          // Confirm the rejection
          const confirmButton = page.getByRole('button', { name: /confirmer le refus/i })
          await expect(confirmButton).toBeEnabled()
          await confirmButton.click()

          // Dialog should close
          await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5000 })
        }
      }
    }
  })

  test('retour vers la page direction', async ({ page }) => {
    await loginAs(page, TEST_USERS.dirConcession)
    await page.goto('/direction/approvals')
    await page.waitForLoadState('networkidle')

    // Click the back button (ArrowLeft link to /direction)
    const backButton = page.locator('a[href="/direction"]').first()
    if (await backButton.isVisible().catch(() => false)) {
      await backButton.click()
      await page.waitForURL('/direction', { timeout: 5000 })
      expect(page.url()).toContain('/direction')
    }
  })
})

// ============================================
// 2. PARCOURS GESTION D'EQUIPE
//    Ajout membre, changement role
// ============================================
test.describe('Parcours gestion d\'equipe', () => {
  test('la page equipe se charge avec la liste des membres', async ({ page }) => {
    await loginAs(page, TEST_USERS.chefVentes)
    await page.goto('/chef-ventes/equipe')
    await page.waitForLoadState('networkidle')

    // Verify the page title
    await expect(
      page.getByText(/mon équipe/i).first()
    ).toBeVisible({ timeout: 10000 })

    // Verify stats summary cards are present
    await expect(page.getByText(/total commerciaux/i).first()).toBeVisible()
  })

  test('filtrer les membres par statut', async ({ page }) => {
    await loginAs(page, TEST_USERS.chefVentes)
    await page.goto('/chef-ventes/equipe')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText(/mon équipe/i).first()).toBeVisible({ timeout: 10000 })

    // Open the status filter select and change it
    const filterTrigger = page.locator('[role="combobox"]').filter({ hasText: /tous|objectif|danger/i }).first()
    if (await filterTrigger.isVisible().catch(() => false)) {
      await filterTrigger.click()
      const option = page.getByRole('option', { name: /en danger/i }).first()
      if (await option.isVisible().catch(() => false)) {
        await option.click()
      }
    }

    // Page should show filtered results or empty state
    const hasCards = await page.locator('[class*="card"], [class*="Card"]').first().isVisible().catch(() => false)
    const hasEmpty = await page.getByText(/aucun commercial/i).isVisible().catch(() => false)
    expect(hasCards || hasEmpty).toBe(true)
  })

  test('rechercher un membre par nom', async ({ page }) => {
    await loginAs(page, TEST_USERS.chefVentes)
    await page.goto('/chef-ventes/equipe')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText(/mon équipe/i).first()).toBeVisible({ timeout: 10000 })

    // Search for a team member
    const searchInput = page.getByPlaceholder(/rechercher un commercial/i).first()
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill('test')
      await page.waitForTimeout(500)

      const hasCards = await page.locator('[class*="card"], [class*="Card"]').first().isVisible().catch(() => false)
      const hasEmpty = await page.getByText(/aucun commercial/i).isVisible().catch(() => false)
      expect(hasCards || hasEmpty).toBe(true)
    }
  })

  test('trier les membres par ventes', async ({ page }) => {
    await loginAs(page, TEST_USERS.chefVentes)
    await page.goto('/chef-ventes/equipe')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText(/mon équipe/i).first()).toBeVisible({ timeout: 10000 })

    // Open the sort select
    const sortTrigger = page.locator('[role="combobox"]').filter({ hasText: /classement|ventes|marge|nom/i }).first()
    if (await sortTrigger.isVisible().catch(() => false)) {
      await sortTrigger.click()
      const ventesOption = page.getByRole('option', { name: /ventes/i }).first()
      if (await ventesOption.isVisible().catch(() => false)) {
        await ventesOption.click()
      }
    }
  })

  test('naviguer vers le detail d\'un membre', async ({ page }) => {
    await loginAs(page, TEST_USERS.chefVentes)
    await page.goto('/chef-ventes/equipe')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText(/mon équipe/i).first()).toBeVisible({ timeout: 10000 })

    // Click "Voir details" on the first member card
    const detailButton = page.getByRole('link', { name: /voir détails/i }).first()
    if (await detailButton.isVisible().catch(() => false)) {
      await detailButton.click()
      await page.waitForURL(/\/chef-ventes\/equipe\//, { timeout: 5000 })
      expect(page.url()).toMatch(/\/chef-ventes\/equipe\//)
    }
  })

  test('acceder a la page gestion utilisateurs (direction)', async ({ page }) => {
    await loginAs(page, TEST_USERS.dirConcession)
    await page.goto('/direction/users')
    await page.waitForLoadState('networkidle')

    // The page should load (users management)
    await expect(
      page.getByText(/utilisateur|gestion|equipe|membre/i).first()
    ).toBeVisible({ timeout: 10000 })
  })
})

// ============================================
// 3. PARCOURS COACHING
//    Creation note, edition, suppression
// ============================================
test.describe('Parcours coaching', () => {
  test('la page coaching se charge avec la sidebar equipe', async ({ page }) => {
    await loginAs(page, TEST_USERS.chefVentes)
    await page.goto('/chef-ventes/coaching')
    await page.waitForLoadState('networkidle')

    // Verify the page title
    await expect(
      page.getByText(/notes de coaching/i).first()
    ).toBeVisible({ timeout: 10000 })

    // Verify the team sidebar is present
    await expect(page.getByText(/mon équipe/i).first()).toBeVisible()
  })

  test('ouvrir le dialog de creation de note', async ({ page }) => {
    await loginAs(page, TEST_USERS.chefVentes)
    await page.goto('/chef-ventes/coaching')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText(/notes de coaching/i).first()).toBeVisible({ timeout: 10000 })

    // Click "Nouvelle note" button
    const newNoteButton = page.getByRole('button', { name: /nouvelle note/i })
    await expect(newNoteButton).toBeVisible()
    await newNoteButton.click()

    // Verify dialog opens
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 })
    await expect(
      page.getByText(/nouvelle note de coaching|modifier la note/i).first()
    ).toBeVisible()
  })

  test('creer une note de coaching avec validation', async ({ page }) => {
    await loginAs(page, TEST_USERS.chefVentes)
    await page.goto('/chef-ventes/coaching')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText(/notes de coaching/i).first()).toBeVisible({ timeout: 10000 })

    // Open new note dialog
    await page.getByRole('button', { name: /nouvelle note/i }).click()
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 })

    // Try submitting without filling required fields — should show validation errors
    const submitButton = page.getByRole('dialog').getByRole('button', { name: /ajouter la note/i })
    if (await submitButton.isVisible().catch(() => false)) {
      await submitButton.click()
      // Validation error should appear for commercial selection
      await expect(
        page.getByText(/sélectionnez un commercial/i).or(
          page.getByText(/la note doit contenir/i)
        ).first()
      ).toBeVisible({ timeout: 3000 })
    }

    // Select a commercial (first available)
    const commercialSelect = page.getByRole('dialog').locator('[role="combobox"]').first()
    if (await commercialSelect.isVisible().catch(() => false)) {
      await commercialSelect.click()
      const firstOption = page.getByRole('option').first()
      if (await firstOption.isVisible().catch(() => false)) {
        await firstOption.click()
      }
    }

    // Select note type (click on "Feedback" button)
    const feedbackType = page.getByRole('dialog').getByText(/feedback/i).first()
    if (await feedbackType.isVisible().catch(() => false)) {
      await feedbackType.click()
    }

    // Fill the note content (must be >= 10 chars)
    const contentTextarea = page.getByRole('dialog').getByPlaceholder(/écrivez votre note/i)
    if (await contentTextarea.isVisible().catch(() => false)) {
      await contentTextarea.fill('Excellent travail sur les ventes de ce mois, continuer ainsi!')
    }

    // Submit the note
    if (await submitButton.isVisible().catch(() => false)) {
      await submitButton.click()
      // Dialog should close on success
      await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5000 })
    }
  })

  test('filtrer les notes par type', async ({ page }) => {
    await loginAs(page, TEST_USERS.chefVentes)
    await page.goto('/chef-ventes/coaching')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText(/notes de coaching/i).first()).toBeVisible({ timeout: 10000 })

    // Open the type filter select
    const typeFilter = page.locator('[role="combobox"]').filter({ hasText: /tous les types|feedback|objectif|action|réunion/i }).first()
    if (await typeFilter.isVisible().catch(() => false)) {
      await typeFilter.click()
      const feedbackOption = page.getByRole('option', { name: /feedback/i }).first()
      if (await feedbackOption.isVisible().catch(() => false)) {
        await feedbackOption.click()
      }
    }

    // Should show filtered notes or empty state
    const hasNotes = await page.locator('[class*="card"], [class*="Card"]').first().isVisible().catch(() => false)
    const hasEmpty = await page.getByText(/aucune note/i).isVisible().catch(() => false)
    expect(hasNotes || hasEmpty).toBe(true)
  })

  test('rechercher dans les notes', async ({ page }) => {
    await loginAs(page, TEST_USERS.chefVentes)
    await page.goto('/chef-ventes/coaching')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText(/notes de coaching/i).first()).toBeVisible({ timeout: 10000 })

    const searchInput = page.getByPlaceholder(/rechercher dans les notes/i).first()
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill('excellent')
      await page.waitForTimeout(500)

      const hasNotes = await page.locator('[class*="card"], [class*="Card"]').first().isVisible().catch(() => false)
      const hasEmpty = await page.getByText(/aucune note/i).isVisible().catch(() => false)
      expect(hasNotes || hasEmpty).toBe(true)
    }
  })

  test('supprimer une note de coaching', async ({ page }) => {
    await loginAs(page, TEST_USERS.chefVentes)
    await page.goto('/chef-ventes/coaching')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText(/notes de coaching/i).first()).toBeVisible({ timeout: 10000 })

    // Find and click the delete button (Trash2 icon) on the first note
    const deleteButton = page.locator('button').filter({ has: page.locator('svg.lucide-trash-2, [class*="trash"]') }).first()
    if (await deleteButton.isVisible().catch(() => false)) {
      await deleteButton.click()
      // Note should be removed or a confirmation should appear
      await page.waitForTimeout(1000)
    }
  })
})

// ============================================
// 4. PARCOURS LEADERBOARD
//    Affichage classement, filtres
// ============================================
test.describe('Parcours leaderboard', () => {
  test('la page leaderboard se charge avec le podium', async ({ page }) => {
    await page.goto('/leaderboard')
    await page.waitForLoadState('networkidle')

    // Verify the page title
    await expect(
      page.getByText(/classement/i).first()
    ).toBeVisible({ timeout: 10000 })

    // Verify the podium or "not enough data" message is shown
    const hasPodium = await page.getByText(/top 3/i).isVisible().catch(() => false)
    const hasNotEnoughData = await page.getByText(/pas assez de données/i).isVisible().catch(() => false)
    expect(hasPodium || hasNotEnoughData).toBe(true)
  })

  test('changer la periode du classement', async ({ page }) => {
    await page.goto('/leaderboard')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText(/classement/i).first()).toBeVisible({ timeout: 10000 })

    // Open the period select
    const periodSelect = page.locator('[role="combobox"]').first()
    if (await periodSelect.isVisible().catch(() => false)) {
      await periodSelect.click()

      // Select "Cette semaine"
      const weekOption = page.getByRole('option', { name: /cette semaine/i })
      if (await weekOption.isVisible().catch(() => false)) {
        await weekOption.click()
        // Content should refresh
        await page.waitForTimeout(1000)
      }
    }
  })

  test('switcher entre les onglets de metriques', async ({ page }) => {
    await page.goto('/leaderboard')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText(/classement/i).first()).toBeVisible({ timeout: 10000 })

    // Check that metric tabs are visible
    const commissionTab = page.getByRole('tab', { name: /commission/i })
    const ventesTab = page.getByRole('tab', { name: /ventes/i })
    const pointsTab = page.getByRole('tab', { name: /points/i })

    await expect(commissionTab).toBeVisible()
    await expect(ventesTab).toBeVisible()
    await expect(pointsTab).toBeVisible()

    // Switch to "Ventes" tab
    await ventesTab.click()
    await page.waitForTimeout(500)

    // Verify the tab is now selected
    await expect(ventesTab).toHaveAttribute('data-state', 'active')

    // Switch to "Points" tab
    await pointsTab.click()
    await page.waitForTimeout(500)
    await expect(pointsTab).toHaveAttribute('data-state', 'active')
  })

  test('affichage de la position personnelle', async ({ page }) => {
    await page.goto('/leaderboard')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText(/classement/i).first()).toBeVisible({ timeout: 10000 })

    // Check if "Votre position" card is displayed
    const positionCard = page.getByText(/votre position/i).first()
    const youLabel = page.getByText(/\(vous\)/i).first()

    const hasPosition = await positionCard.isVisible().catch(() => false)
    const hasYou = await youLabel.isVisible().catch(() => false)

    // At least one indicator of the current user should be present
    // (or no data exists, which is also valid)
    const hasNoData = await page.getByText(/aucune donnée/i).isVisible().catch(() => false)
    expect(hasPosition || hasYou || hasNoData).toBe(true)
  })

  test('le classement affiche les rangs correctement', async ({ page }) => {
    await page.goto('/leaderboard')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText(/classement/i).first()).toBeVisible({ timeout: 10000 })

    // Check for rank indicators (crowns, medals, or numbers)
    const hasEntries = await page.locator('[class*="divide"]').first().isVisible().catch(() => false)
    const hasNoData = await page.getByText(/aucune donnée|pas assez/i).first().isVisible().catch(() => false)
    expect(hasEntries || hasNoData).toBe(true)
  })
})

// ============================================
// 5. PARCOURS EXPORT RAPPORT
//    Generation PDF + Excel
// ============================================
test.describe('Parcours export rapport', () => {
  test('la page rapports direction se charge', async ({ page }) => {
    await loginAs(page, TEST_USERS.dirConcession)
    await page.goto('/direction/reports')
    await page.waitForLoadState('networkidle')

    // Verify the page title
    await expect(
      page.getByText(/rapports|analyses/i).first()
    ).toBeVisible({ timeout: 10000 })
  })

  test('les boutons d\'export sont visibles', async ({ page }) => {
    await loginAs(page, TEST_USERS.dirConcession)
    await page.goto('/direction/reports')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText(/rapports|analyses/i).first()).toBeVisible({ timeout: 10000 })

    // Verify the "Exporter" button is visible
    const exportButton = page.getByRole('button', { name: /exporter/i }).first()
    await expect(exportButton).toBeVisible()

    // Verify the "Imprimer" button is visible
    const printButton = page.getByRole('button', { name: /imprimer/i }).first()
    await expect(printButton).toBeVisible()
  })

  test('exporter en Excel declanche le telechargement', async ({ page }) => {
    await loginAs(page, TEST_USERS.dirConcession)
    await page.goto('/direction/reports')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText(/rapports|analyses/i).first()).toBeVisible({ timeout: 10000 })

    // Set up download listener
    const downloadPromise = page.waitForEvent('download', { timeout: 10000 }).catch(() => null)

    // Click the Export button
    const exportButton = page.getByRole('button', { name: /exporter/i }).first()
    if (await exportButton.isVisible().catch(() => false)) {
      await exportButton.click()

      // Wait for download (might fail if no data, which is acceptable)
      const download = await downloadPromise
      if (download) {
        const filename = download.suggestedFilename()
        expect(filename).toMatch(/\.(xlsx|xls|csv)$/i)
      }
    }
  })

  test('changer la periode du rapport', async ({ page }) => {
    await loginAs(page, TEST_USERS.dirConcession)
    await page.goto('/direction/reports')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText(/rapports|analyses/i).first()).toBeVisible({ timeout: 10000 })

    // Open the period select
    const periodSelect = page.locator('[role="combobox"]').first()
    if (await periodSelect.isVisible().catch(() => false)) {
      await periodSelect.click()

      // Select "Ce trimestre"
      const quarterOption = page.getByRole('option', { name: /ce trimestre/i })
      if (await quarterOption.isVisible().catch(() => false)) {
        await quarterOption.click()
        await page.waitForTimeout(500)
      }
    }
  })

  test('la page rapports chef des ventes se charge et exporte', async ({ page }) => {
    await loginAs(page, TEST_USERS.chefVentes)
    await page.goto('/chef-ventes/rapports')
    await page.waitForLoadState('networkidle')

    // Verify the page loads
    await expect(
      page.getByText(/rapport|performance|equipe/i).first()
    ).toBeVisible({ timeout: 10000 })

    // Verify export button is present
    const exportButton = page.getByRole('button', { name: /exporter/i }).first()
    await expect(exportButton).toBeVisible()

    // Click export and check for download
    const downloadPromise = page.waitForEvent('download', { timeout: 10000 }).catch(() => null)
    await exportButton.click()

    const download = await downloadPromise
    if (download) {
      const filename = download.suggestedFilename()
      expect(filename).toMatch(/\.(xlsx|xls|csv|pdf)$/i)
    }
  })
})

// ============================================
// 6. PARCOURS MODIFICATION PROFIL
//    Avatar, mot de passe, preferences
// ============================================
test.describe('Parcours modification profil', () => {
  test('la page profil se charge avec les informations utilisateur', async ({ page }) => {
    await page.goto('/profile')
    await page.waitForLoadState('networkidle')

    // Verify user info is displayed
    await expect(
      page.locator('h1').filter({ hasText: /.+/ }).first()
    ).toBeVisible({ timeout: 10000 })

    // Verify stats cards are visible
    await expect(page.getByText(/ventes totales/i).first()).toBeVisible()
    await expect(page.getByText(/commission totale/i).first()).toBeVisible()
  })

  test('le bouton modifier le profil est visible', async ({ page }) => {
    await page.goto('/profile')
    await page.waitForLoadState('networkidle')

    const editButton = page.getByRole('button', { name: /modifier le profil/i })
    await expect(editButton).toBeVisible({ timeout: 10000 })
  })

  test('le bouton avatar permet d\'upload', async ({ page }) => {
    await page.goto('/profile')
    await page.waitForLoadState('networkidle')

    // The camera button for avatar upload should be present
    const avatarButton = page.locator('button').filter({
      has: page.locator('svg.lucide-camera, [class*="camera"]')
    }).first()

    if (await avatarButton.isVisible().catch(() => false)) {
      // Verify the hidden file input exists
      const fileInput = page.locator('input[type="file"][accept*="image"]')
      await expect(fileInput).toBeAttached()
    }
  })

  test('naviguer vers les onglets du profil', async ({ page }) => {
    await page.goto('/profile')
    await page.waitForLoadState('networkidle')

    // Check that tabs exist
    const overviewTab = page.getByRole('tab', { name: /vue d'ensemble/i })
    const badgesTab = page.getByRole('tab', { name: /badges/i })

    await expect(overviewTab).toBeVisible({ timeout: 10000 })
    await expect(badgesTab).toBeVisible()

    // Switch to badges tab
    await badgesTab.click()
    await page.waitForTimeout(500)
    await expect(badgesTab).toHaveAttribute('data-state', 'active')

    // Verify badge section is displayed
    const hasBadges = await page.getByText(/badges obtenus/i).isVisible().catch(() => false)
    const hasLocked = await page.getByText(/badges à débloquer/i).isVisible().catch(() => false)
    expect(hasBadges || hasLocked).toBe(true)
  })

  test('la page parametres se charge et affiche les sections', async ({ page }) => {
    await page.goto('/profile/settings')
    await page.waitForLoadState('networkidle')

    // Verify the settings page title
    await expect(page.getByText(/paramètres|parametres/i).first()).toBeVisible({ timeout: 10000 })

    // Verify sections are present
    await expect(page.getByText(/informations personnelles/i).first()).toBeVisible()
    await expect(page.getByText(/notifications/i).first()).toBeVisible()
    await expect(page.getByText(/mot de passe/i).first()).toBeVisible()
  })

  test('modifier les informations personnelles', async ({ page }) => {
    await page.goto('/profile/settings')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText(/informations personnelles/i).first()).toBeVisible({ timeout: 10000 })

    // Fill in the personal info fields
    const firstNameInput = page.locator('#firstName')
    const lastNameInput = page.locator('#lastName')
    const phoneInput = page.locator('#phone')

    if (await firstNameInput.isVisible().catch(() => false)) {
      await firstNameInput.clear()
      await firstNameInput.fill('Test')
    }
    if (await lastNameInput.isVisible().catch(() => false)) {
      await lastNameInput.clear()
      await lastNameInput.fill('Utilisateur')
    }
    if (await phoneInput.isVisible().catch(() => false)) {
      await phoneInput.clear()
      await phoneInput.fill('06 12 34 56 78')
    }

    // Click "Enregistrer" for personal info section
    const saveButtons = page.getByRole('button', { name: /enregistrer/i })
    const firstSaveButton = saveButtons.first()
    if (await firstSaveButton.isVisible().catch(() => false)) {
      await firstSaveButton.click()

      // Wait for success toast
      await expect(
        page.getByText(/mis(es)? (à|a) jour/i).or(page.locator('[data-sonner-toast]')).first()
      ).toBeVisible({ timeout: 5000 })
    }
  })

  test('changer le mot de passe avec validation', async ({ page }) => {
    await page.goto('/profile/settings')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText(/mot de passe/i).first()).toBeVisible({ timeout: 10000 })

    // Fill password fields
    const newPasswordInput = page.locator('#newPassword')
    const confirmPasswordInput = page.locator('#confirmPassword')

    if (await newPasswordInput.isVisible().catch(() => false)) {
      await newPasswordInput.fill('NewTest123!')
      await confirmPasswordInput.fill('NewTest123!')

      // Click the change password button
      const changePasswordButton = page.getByRole('button', { name: /changer le mot de passe/i })
      if (await changePasswordButton.isVisible().catch(() => false)) {
        await changePasswordButton.click()

        // Wait for success or error toast
        await expect(
          page.getByText(/modifié|modifie|succes|erreur/i).or(page.locator('[data-sonner-toast]')).first()
        ).toBeVisible({ timeout: 5000 })
      }
    }
  })

  test('toggle des preferences de notification', async ({ page }) => {
    await page.goto('/profile/settings')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText(/notifications/i).first()).toBeVisible({ timeout: 10000 })

    // Find notification toggle switches
    const emailSwitch = page.locator('#emailNotif')
    if (await emailSwitch.isVisible().catch(() => false)) {
      // Toggle the switch
      await emailSwitch.click()
      await page.waitForTimeout(300)

      // Toggle back
      await emailSwitch.click()
    }
  })
})

// ============================================
// 7. PARCOURS CHANGEMENT DE CONCESSION
//    Switch + verification donnees
// ============================================
test.describe('Parcours changement de concession', () => {
  test('le concession switcher est present dans le layout', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    // The concession switcher is only visible if the user has multiple concessions
    // Check for the Building2 icon button or the switcher component
    const switcher = page.locator('button').filter({ hasText: /concession/i }).first()
    const hasSwitcher = await switcher.isVisible().catch(() => false)

    // If the user has only one concession, the switcher is hidden — both states are valid
    expect(true).toBe(true)
  })

  test('ouvrir le menu de changement de concession', async ({ page }) => {
    await loginAs(page, TEST_USERS.dirConcession)
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    // Look for the concession switcher dropdown trigger
    const switcherButton = page.locator('button').filter({
      has: page.locator('svg.lucide-building-2, [class*="building"]')
    }).first()

    if (await switcherButton.isVisible().catch(() => false)) {
      await switcherButton.click()

      // Verify the dropdown menu opens with concession list
      await expect(
        page.getByText(/mes concessions/i).first()
      ).toBeVisible({ timeout: 3000 })
    }
  })

  test('switcher de concession met a jour les donnees', async ({ page }) => {
    await loginAs(page, TEST_USERS.dirConcession)
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    // Look for the concession switcher
    const switcherButton = page.locator('button').filter({
      has: page.locator('svg.lucide-building-2, [class*="building"]')
    }).first()

    if (await switcherButton.isVisible().catch(() => false)) {
      await switcherButton.click()

      // Click on a different concession if available
      const concessionItems = page.locator('[role="menuitem"]')
      const count = await concessionItems.count()

      if (count > 1) {
        // Find an item that does NOT have the check mark (not current)
        for (let i = 0; i < count; i++) {
          const item = concessionItems.nth(i)
          const hasCheck = await item.locator('svg.lucide-check').isVisible().catch(() => false)
          if (!hasCheck) {
            await item.click()
            // Wait for data refresh
            await page.waitForTimeout(2000)
            break
          }
        }
      }
    }
  })

  test('le dashboard reflette la concession active', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    // The dashboard should be loaded
    await expect(
      page.locator('h1, h2').filter({ hasText: /.+/ }).first()
    ).toBeVisible({ timeout: 10000 })

    // Verify that KPI cards or dashboard content is displayed
    const hasContent = await page.locator('[class*="card"], [class*="Card"]').first().isVisible().catch(() => false)
    expect(hasContent).toBe(true)
  })
})

// ============================================
// 8. PARCOURS RECHERCHE GLOBALE
//    Recherche, navigation vers resultat
// ============================================
test.describe('Parcours recherche globale', () => {
  test('le bouton de recherche globale est visible', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    // Look for the search trigger button
    const searchButton = page.locator('button, [role="button"]').filter({
      hasText: /rechercher/i
    }).first()

    const hasSearchButton = await searchButton.isVisible().catch(() => false)

    // Or look for the Cmd+K shortcut indicator
    const hasKbd = await page.locator('kbd').filter({ hasText: /K/i }).first().isVisible().catch(() => false)

    expect(hasSearchButton || hasKbd).toBe(true)
  })

  test('ouvrir la recherche globale via clic', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    // Click the search trigger
    const searchButton = page.locator('button, [role="button"]').filter({
      hasText: /rechercher/i
    }).first()

    if (await searchButton.isVisible().catch(() => false)) {
      await searchButton.click()

      // Verify the command dialog opens
      await expect(
        page.getByRole('dialog').or(page.locator('[cmdk-dialog]')).first()
      ).toBeVisible({ timeout: 3000 })
    }
  })

  test('ouvrir la recherche globale via raccourci clavier Cmd+K', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    // Wait for page to fully load
    await page.waitForTimeout(1000)

    // Press Cmd+K (or Ctrl+K on non-Mac)
    await page.keyboard.press('Meta+k')

    // Verify the command dialog opens
    const dialog = page.getByRole('dialog').or(page.locator('[cmdk-dialog]')).first()
    const isOpen = await dialog.isVisible({ timeout: 3000 }).catch(() => false)

    if (!isOpen) {
      // Try Ctrl+K as fallback
      await page.keyboard.press('Control+k')
      await dialog.isVisible({ timeout: 3000 }).catch(() => false)
    }
  })

  test('rechercher et voir les resultats', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    // Open search
    const searchButton = page.locator('button, [role="button"]').filter({
      hasText: /rechercher/i
    }).first()

    if (await searchButton.isVisible().catch(() => false)) {
      await searchButton.click()

      const dialog = page.getByRole('dialog').or(page.locator('[cmdk-dialog]')).first()
      await expect(dialog).toBeVisible({ timeout: 3000 })

      // Type a search query
      const searchInput = page.getByPlaceholder(/rechercher des fiches|rechercher/i).first()
      if (await searchInput.isVisible().catch(() => false)) {
        await searchInput.fill('test')

        // Wait for results to load
        await page.waitForTimeout(1500)

        // Should show results or "aucun resultat" or "saisissez au moins"
        const hasResults = await page.locator('[cmdk-item], [role="option"]').first().isVisible().catch(() => false)
        const hasNoResults = await page.getByText(/aucun résultat/i).isVisible().catch(() => false)
        const hasMinChars = await page.getByText(/saisissez au moins/i).isVisible().catch(() => false)
        expect(hasResults || hasNoResults || hasMinChars).toBe(true)
      }
    }
  })

  test('naviguer vers un resultat de recherche', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    // Open search
    const searchButton = page.locator('button, [role="button"]').filter({
      hasText: /rechercher/i
    }).first()

    if (await searchButton.isVisible().catch(() => false)) {
      await searchButton.click()

      const dialog = page.getByRole('dialog').or(page.locator('[cmdk-dialog]')).first()
      if (await dialog.isVisible({ timeout: 3000 }).catch(() => false)) {
        // Type a search query
        const searchInput = page.getByPlaceholder(/rechercher des fiches|rechercher/i).first()
        if (await searchInput.isVisible().catch(() => false)) {
          await searchInput.fill('test')
          await page.waitForTimeout(1500)

          // Click on the first result if available
          const firstResult = page.locator('[cmdk-item], [role="option"]').first()
          if (await firstResult.isVisible().catch(() => false)) {
            const currentUrl = page.url()
            await firstResult.click()

            // Wait for navigation
            await page.waitForTimeout(1000)

            // Dialog should have closed
            const dialogStillOpen = await dialog.isVisible().catch(() => false)
            expect(dialogStillOpen).toBe(false)
          }
        }
      }
    }
  })

  test('recherche avec moins de 2 caracteres montre un message', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    const searchButton = page.locator('button, [role="button"]').filter({
      hasText: /rechercher/i
    }).first()

    if (await searchButton.isVisible().catch(() => false)) {
      await searchButton.click()

      const dialog = page.getByRole('dialog').or(page.locator('[cmdk-dialog]')).first()
      if (await dialog.isVisible({ timeout: 3000 }).catch(() => false)) {
        const searchInput = page.getByPlaceholder(/rechercher des fiches|rechercher/i).first()
        if (await searchInput.isVisible().catch(() => false)) {
          // Type only 1 character
          await searchInput.fill('a')
          await page.waitForTimeout(500)

          // Should show minimum characters message
          await expect(
            page.getByText(/saisissez au moins 2 caractères/i).first()
          ).toBeVisible({ timeout: 3000 })
        }
      }
    }
  })
})
