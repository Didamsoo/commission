# ROADMAP — Projet AutoPerf

> Dernière mise à jour : 28 février 2026
> On coche ensemble au fur et à mesure.

---

## Phases terminées (0–6) — 141 tâches ✅

<details>
<summary>Phase 0 — Nettoyage & Corrections (9/9 ✅)</summary>

- [x] Retirer `ignoreBuildErrors: true` dans `next.config.mjs`
- [x] Retirer `ignoreEslintDuringBuilds: true` dans `next.config.mjs`
- [x] Corriger toutes les erreurs TypeScript révélées après suppression des flags
- [x] Corriger toutes les erreurs ESLint révélées
- [x] Créer la page manquante `chef-ventes/challenges/page.tsx`
- [x] Créer la page manquante `marque/challenges/page.tsx`
- [x] Créer la page manquante `groupe/challenges/page.tsx`
- [x] Vérifier que le build `npm run build` passe sans erreur
- [x] Créer un fichier `.env.example` listant les variables nécessaires

</details>

<details>
<summary>Phase 1 — Authentification (12/12 ✅)</summary>

- [x] Choisir le provider d'auth → **Supabase Auth**
- [x] Installer et configurer le provider choisi
- [x] Créer le fichier `.env.local` avec les clés d'API
- [x] Brancher la page Login sur l'auth réelle
- [x] Brancher la page Register sur l'auth réelle
- [x] Implémenter la déconnexion
- [x] Implémenter la réinitialisation de mot de passe
- [x] Stocker le rôle utilisateur
- [x] Protéger les routes `/protected/*`
- [x] Restreindre l'accès aux pages selon le rôle
- [x] Remplacer l'utilisateur fictif du layout par l'utilisateur connecté réel
- [x] Supprimer les boutons de démo "Accès rapide" de la page login

</details>

<details>
<summary>Phase 2 — Base de données (15/15 ✅)</summary>

- [x] Choisir la base de données → **Supabase PostgreSQL**
- [x] Créer la table `profiles` + trigger auto
- [x] Créer la table `concessions`
- [x] Créer la table `marques`
- [x] Créer la table `equipes`
- [x] Créer la table `fiches_marge`
- [x] Créer la table `payplans`
- [x] Créer la table `defis_plateforme`
- [x] Créer la table `defis_p2p`
- [x] Créer la table `badges`
- [x] Créer la table `badges_utilisateur`
- [x] Créer la table `notes_coaching`
- [x] Créer la table `approbations`
- [x] Créer la table `notifications`
- [x] Migrer les données du localStorage vers la base

</details>

<details>
<summary>Phase 3 — API Backend (15/15 ✅)</summary>

- [x] Retirer `output: 'export'` de `next.config.mjs`
- [x] Adapter le déploiement (Vercel SSR)
- [x] Créer les utilitaires API partagés (`lib/api/`)
- [x] Créer les schémas de validation Zod (`lib/validations/`)
- [x] Route API `GET/POST /api/fiches-marge` + `[id]`
- [x] Route API `GET/POST /api/payplan` + `[id]`
- [x] Route API `GET/POST /api/defis` + `[id]`
- [x] Route API `GET/POST /api/defis-p2p` + `[id]`
- [x] Route API `GET/POST /api/equipe` + `[id]`
- [x] Route API `GET/POST /api/approbations` + `[id]`
- [x] Route API `GET/POST /api/coaching` + `[id]`
- [x] Route API `GET /api/leaderboard`
- [x] Route API `GET /api/dashboard/[role]`
- [x] Route API `GET /api/rapports`
- [x] Route API `GET/PUT /api/profil` + notifications

</details>

<details>
<summary>Phase 4 — Connexion Frontend ↔ Backend (27/27 ✅)</summary>

- [x] Dashboard commercial : API réelle
- [x] Calculateur : sauvegarde en base
- [x] Leaderboard : API classement
- [x] Défis : API plateforme + P2P
- [x] Profil : API profil + badges + stats
- [x] Dashboard chef des ventes : API réelle
- [x] Équipe : liste des commerciaux
- [x] Coaching : CRUD notes via API
- [x] Rapports chef des ventes : données réelles
- [x] Défis chef des ventes : API
- [x] Dashboard direction concession : API réelle
- [x] Utilisateurs : CRUD invitation/rôle/activation
- [x] Approbations : workflow validation ventes
- [x] Défis direction concession : API
- [x] Rapports direction : données réelles
- [x] Payplan : sauvegarde en base
- [x] Dashboard direction marque : API réelle
- [x] Concessions : liste API
- [x] Benchmark : calculs réels
- [x] Stocks : données réelles
- [x] Défis direction marque : API
- [x] Dashboard direction plaque : API réelle
- [x] Marques : liste API
- [x] Performance groupe : calculs consolidés
- [x] Rapports groupe : données réelles
- [x] Défis groupe : API
- [x] Notifications + recherche globale branchées

</details>

<details>
<summary>Phase 4B — Migration mock restant + Fix zéro (22/22 ✅)</summary>

- [x] Fix `sales_target`, `quarterly_growth`, `market_share`, `growth`, `satisfaction`/`stock_days`
- [x] Helper `displayValue()` dans `lib/types/display.ts`
- [x] Migration pages : chef-ventes, direction, benchmark, performance, stocks, rapports groupe
- [x] Enrichissements API dashboard : departmentStats, siblingTeams, perBrandHistory
- [x] Fichiers config : static-data, static-stock-data, report-templates, kpi-helpers

</details>

<details>
<summary>Phase 4C — Audit & Nettoyage final (19/19 ✅)</summary>

- [x] Fix open redirect `/auth/callback`
- [x] Fix bypass auth cron `/api/email/send-queued`
- [x] Fix mot de passe minimum 6→8 caractères
- [x] Enrichir `/api/marques/[id]`
- [x] Migration mock pages challenges (marque, chef-ventes, groupe, direction)
- [x] Dashboard `salesTarget` + profil `concession_name` depuis API
- [x] Nettoyage console.log, renommage variables mock, fix `error: any`
- [x] Middleware redirection par rôle + protection routes

</details>

<details>
<summary>Phase 5 — Fonctionnalités manquantes (12/12 ✅)</summary>

- [x] Page "Mot de passe oublié"
- [x] Upload d'avatar utilisateur
- [x] Export PDF des fiches de marge
- [x] Export Excel des rapports
- [x] Notifications email
- [x] Notifications push (navigateur)
- [x] Historique fiche de marge (audit trail)
- [x] Filtre par période sur tous les dashboards
- [x] Graphiques interactifs (Recharts)
- [x] Page paramètres utilisateur
- [x] Page paramètres concession
- [x] Gestion multi-concessions

</details>

<details>
<summary>Phase 6 — Tests & Qualité (10/10 ✅)</summary>

- [x] Installer Vitest + Testing Library
- [x] Tests unitaires `margin-utils.ts` (82 tests)
- [x] Tests unitaires fonctions API (28 tests)
- [x] Installer Playwright
- [x] Tests E2E login → dashboard (5 tests)
- [x] Tests E2E création fiche de marge (4 tests)
- [x] Tests E2E création défi P2P (4 tests)
- [x] ESLint flat config + jsx-a11y + react-hooks + Prettier
- [x] Vérification accessibilité a11y (7 pages, axe-core WCAG 2.0 AA)
- [x] Tests responsive mobile/tablette/desktop

</details>

---

## PHASE 7 — Mise en production (7/10)

> Préparer le déploiement final.

- [x] Configurer le HTTPS (automatique avec Vercel)
- [x] Mettre en place un CI/CD (`.github/workflows/ci.yml`)
- [x] Installer Sentry (monitoring d'erreurs)
- [x] Installer Vercel Analytics
- [x] Optimiser les performances (dynamic imports jspdf, xlsx)
- [x] Rédiger un README.md
- [x] Créer le guide utilisateur (`GUIDE-UTILISATEUR.md`)
- [ ] Configurer les variables d'environnement de production (Vercel dashboard)
- [ ] Mettre en place un domaine personnalisé (Vercel dashboard)
- [ ] Configurer les backups de la base de données (Supabase dashboard)

---

## PHASE 8 — Derniers mock data & placeholders

> Éliminer les données hardcodées restantes dans le frontend.

### Badges (données statiques, pas encore branchées sur la BDD)

- [x] Créer la route API `GET /api/badges` (lire `badges` + `badges_utilisateur` pour l'utilisateur connecté)
- [x] `dashboard/page.tsx` : remplacer `recentBadges` statique par l'API badges
- [x] `profile/page.tsx` : remplacer `allBadges` mock par l'API badges
- [x] `profile/badges/page.tsx` : remplacer `allBadges` mock par l'API badges

### Graphiques & visualisations placeholder

- [x] `chef-ventes/equipe/[id]/commercial-detail-content.tsx` : remplacer `PerformanceHistoryMock()` par les vraies données de performance du commercial
- [x] `marque/benchmark/page.tsx` : remplacer `RadarChartMock()` par un vrai radar chart avec données API
- [x] `marque/page.tsx` : remplacer l'historique synthétique par un endpoint API dédié
- [x] `groupe/marques/[id]/brand-detail-content.tsx` : remplacer le placeholder historique par des données réelles

### Données stock statiques

- [ ] `lib/config/static-stock-data.ts` : connecter `stockTransfers` et `stockItems` à une source réelle (DMS ou table Supabase)

---

## PHASE 9 — Corrections UX & nettoyage code

> Petites corrections d'expérience utilisateur et de qualité de code.

### Liens placeholder `href="#"`

- [x] `app/page.tsx` : créer ou relier les pages "Mentions légales", "Confidentialité", "CGU" (footer landing)
- [x] `app/(auth)/register/page.tsx` : relier les liens "conditions d'utilisation" et "politique de confidentialité"

### Améliorations UX

- [x] `profile/page.tsx` : remplacer `window.location.reload()` après upload avatar par un rafraîchissement de state
- [x] `profile/settings/page.tsx` : ajouter un vrai logging d'erreur dans les blocs catch (actuellement silencieux)

### Nettoyage code

- [x] `lib/pdf/fiche-marge.ts` : typer correctement `(doc as any).lastAutoTable` (éviter `any`)
- [x] `components/p2p-challenges/CreateChallengeDialog.tsx` : typer `(result.data as any)?.id`
- [x] `groupe/marques/[id]/brand-detail-content.tsx` : typer `(marqueRaw as any)?.concessions`
- [x] `lib/email/client.ts` : remplacer les `console.warn`/`console.error` par un logger structuré (ou Sentry)

---

## PHASE 10 — Tests complémentaires

> Augmenter la couverture de tests sur les zones critiques.

### Tests unitaires — Schémas Zod

- [x] Tester `lib/validations/fiches-marge.ts` (cas valides + invalides)
- [x] Tester `lib/validations/defis.ts` (création + mise à jour)
- [x] Tester `lib/validations/defis-p2p.ts`
- [x] Tester `lib/validations/payplan.ts`
- [x] Tester `lib/validations/profil.ts`
- [x] Tester `lib/validations/equipe.ts`
- [x] Tester `lib/validations/approbations.ts`
- [x] Tester `lib/validations/coaching.ts`
- [x] Tester `lib/validations/notifications.ts`

### Tests unitaires — Helpers & utilitaires

- [x] Tester `lib/types/display.ts` (`displayValue`, `mapMarqueToBrand`, `mapConcessionToDealership`)
- [x] Tester `lib/utils/kpi-helpers.ts` (`deriveBrandKPIs`, `computeTrend`)

### Tests d'intégration — Routes API (les plus critiques)

- [x] Tester `GET/POST /api/fiches-marge` (CRUD complet)
- [x] Tester `GET/POST /api/defis` (CRUD complet)
- [x] Tester `GET/POST /api/defis-p2p` (CRUD complet)
- [x] Tester `GET /api/dashboard/[role]` (5 rôles)
- [x] Tester `GET /api/leaderboard`
- [x] Tester `GET/PUT /api/profil`
- [x] Tester `GET/POST /api/approbations` (workflow validation)
- [x] Tester `GET/POST /api/equipe`
- [x] Tester `GET/POST /api/coaching`
- [x] Tester `GET/POST /api/payplan`

### Tests E2E — Parcours métier manquants

- [x] Parcours approbation vente (soumission → validation → retour)
- [x] Parcours gestion d'équipe (ajout membre, changement rôle)
- [x] Parcours coaching (création note, édition, suppression)
- [x] Parcours leaderboard (affichage classement, filtres)
- [x] Parcours export rapport (génération PDF + Excel)
- [x] Parcours modification profil (avatar, mot de passe, préférences)
- [x] Parcours changement de concession (switch + vérification données)
- [x] Parcours recherche globale (recherche, navigation vers résultat)

---

## PHASE 11 — Pages légales & contenu

> Pages nécessaires pour un site professionnel.

- [x] Créer la page `/mentions-legales`
- [x] Créer la page `/confidentialite` (politique de confidentialité / RGPD)
- [x] Créer la page `/cgu` (conditions générales d'utilisation)
- [x] Mettre à jour les liens dans le footer (`app/page.tsx`) et le formulaire d'inscription

---

## Résumé par phase

| Phase | Contenu | Nb tâches | Statut |
|-------|---------|-----------|--------|
| 0 | Nettoyage & Corrections | 9 | ✅ 9/9 |
| 1 | Authentification | 12 | ✅ 12/12 |
| 2 | Base de données | 15 | ✅ 15/15 |
| 3 | API Backend | 15 | ✅ 15/15 |
| 4 | Connexion Frontend ↔ Backend | 27 | ✅ 27/27 |
| 4B | Migration mock restant + Fix zéro | 22 | ✅ 22/22 |
| 4C | Audit & Nettoyage final | 19 | ✅ 19/19 |
| 5 | Fonctionnalités manquantes | 12 | ✅ 12/12 |
| 6 | Tests & Qualité | 10 | ✅ 10/10 |
| 7 | Mise en production | 10 | 🟡 7/10 |
| 8 | Derniers mock data & placeholders | 9 | 🟡 8/9 |
| 9 | Corrections UX & nettoyage code | 7 | ✅ 7/7 |
| 10 | Tests complémentaires | 28 | ✅ 28/28 |
| 11 | Pages légales & contenu | 4 | ✅ 4/4 |
| **TOTAL** | | **199 tâches** | **195/199 (98%)** |

---

> **Comment on avance :** tu me dis quelle tâche on attaque, je code, on coche, on passe à la suivante.
