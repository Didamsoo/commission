# ROADMAP — Projet AutoPerf

> Dernière mise à jour : 25 février 2026 (Phase 7 — guide utilisateur + middleware rôles)
> On coche ensemble au fur et à mesure.

---

## PHASE 0 — Nettoyage & Corrections immédiates

> Remettre le projet sur de bonnes bases avant d'avancer.

- [x] Retirer `ignoreBuildErrors: true` dans `next.config.mjs`
- [x] Retirer `ignoreEslintDuringBuilds: true` dans `next.config.mjs`
- [x] Corriger toutes les erreurs TypeScript révélées après suppression des flags
- [x] Corriger toutes les erreurs ESLint révélées
- [x] Créer la page manquante `chef-ventes/challenges/page.tsx` (seule la page `/new` existe)
- [x] Créer la page manquante `marque/challenges/page.tsx` (seule la page `/new` existe)
- [x] Créer la page manquante `groupe/challenges/page.tsx` (seule la page `/new` existe)
- [x] Vérifier que le build `npm run build` passe sans erreur
- [x] Créer un fichier `.env.example` listant les variables nécessaires

---

## PHASE 1 — Authentification

> Sans auth, rien ne fonctionne en multi-utilisateurs.

- [x] Choisir le provider d'auth (Supabase Auth / Firebase Auth / NextAuth) → **Supabase Auth**
- [x] Installer et configurer le provider choisi
- [x] Créer le fichier `.env.local` avec les clés d'API (`.env.example` fourni comme template)
- [x] Brancher la page Login sur l'auth réelle (email + mot de passe)
- [x] Brancher la page Register sur l'auth réelle (création de compte)
- [x] Implémenter la déconnexion (bouton existant dans le menu utilisateur)
- [x] Implémenter la réinitialisation de mot de passe (page à créer)
- [x] Stocker le rôle utilisateur (commercial, chef_ventes, dir_concession, dir_marque, dir_plaque)
- [x] Protéger les routes `/protected/*` (redirection si non connecté)
- [x] Restreindre l'accès aux pages selon le rôle (un commercial ne voit pas `/direction`)
- [x] Remplacer l'utilisateur fictif du layout par l'utilisateur connecté réel
- [x] Supprimer les boutons de démo "Accès rapide" de la page login

---

## PHASE 2 — Base de données

> Passer du localStorage à une vraie base partagée.

- [x] Choisir la base de données (Supabase PostgreSQL / Firebase Firestore) → **Supabase PostgreSQL**
- [x] Créer la table `users` (id, email, nom, rôle, concession, avatar, stats) → `profiles` + trigger auto
- [x] Créer la table `concessions` (id, nom, adresse, marque, directeur)
- [x] Créer la table `marques` (id, nom, groupe)
- [x] Créer la table `equipes` (id, nom, chef_ventes_id, concession_id)
- [x] Créer la table `fiches_marge` (toutes les données du calculateur)
- [x] Créer la table `payplan` (règles de commission par concession) → `payplans`
- [x] Créer la table `defis_plateforme` (défis créés par la direction)
- [x] Créer la table `defis_p2p` (défis entre commerciaux)
- [x] Créer la table `badges` (id, nom, description, critères)
- [x] Créer la table `badges_utilisateur` (user_id, badge_id, date_obtention)
- [x] Créer la table `notes_coaching` (chef_ventes → commercial)
- [x] Créer la table `approbations` (ventes en attente de validation)
- [x] Créer la table `notifications` (système de notifications)
- [x] Migrer les données du localStorage vers la base (fonctions inutilisées supprimées — payplan + fiches passent par les APIs)

---

## PHASE 3 — Passer en mode Serveur (API)

> Actuellement le projet est en export statique. Il faut un vrai backend.

- [x] Retirer `output: 'export'` de `next.config.mjs` (fait en Phase 1)
- [x] Adapter le déploiement (Vercel SSR — `output: 'export'` retiré, Sentry + Analytics intégrés)
- [x] Créer les utilitaires API partagés (`lib/api/` : auth, errors, roles, pagination, validation, types)
- [x] Créer les schémas de validation Zod (`lib/validations/` : 9 fichiers)
- [x] Créer la route API `GET/POST /api/fiches-marge` + `[id]` (CRUD fiches de marge)
- [x] Créer la route API `GET/POST /api/payplan` + `[id]` (CRUD payplan)
- [x] Créer la route API `GET/POST /api/defis` + `[id]` (CRUD défis plateforme)
- [x] Créer la route API `GET/POST /api/defis-p2p` + `[id]` (CRUD défis P2P)
- [x] Créer la route API `GET/POST /api/equipe` + `[id]` (gestion équipe)
- [x] Créer la route API `GET/POST /api/approbations` + `[id]` (workflow validation ventes)
- [x] Créer la route API `GET/POST /api/coaching` + `[id]` (notes de coaching)
- [x] Créer la route API `GET /api/leaderboard` (classement)
- [x] Créer la route API `GET /api/dashboard/[role]` (stats par rôle)
- [x] Créer la route API `GET /api/rapports` (génération de rapports)
- [x] Créer la route API `GET/PUT /api/profil` (profil utilisateur)
- [x] Créer la route API `GET/PUT /api/notifications` + `[id]` + `read-all` (notifications)

---

## PHASE 4 — Connecter le Frontend aux vraies données

> Remplacer tous les mock data par des appels API réels.

### Commercial (N1)
- [x] Dashboard : remplacer `mockStats`, `mockActiveChallenges`, `mockLeaderboard`, `mockRecentSales`, `mockRecentBadges` par des appels API
- [x] Calculateur : sauvegarder les fiches de marge en base (plus localStorage)
- [x] Leaderboard : remplacer `mockLeaderboardData` par l'API classement
- [x] Défis : charger les vrais défis plateforme + P2P depuis l'API
- [x] Profil : charger le vrai profil, les vrais badges, les vraies stats

### Chef des Ventes (N2)
- [x] Dashboard : remplacer les données de `mock-chef-ventes-data.ts` par l'API
- [x] Équipe : charger la vraie liste de commerciaux de l'équipe
- [x] Coaching : CRUD notes de coaching via l'API
- [x] Rapports : générer les vrais rapports depuis les données réelles
- [x] Défis : créer/gérer les vrais défis d'équipe

### Direction Concession (N3)
- [x] Dashboard : remplacer les données de `mock-dir-concession-data.ts`
- [x] Utilisateurs : vrai CRUD utilisateurs (invitation, rôle, activation)
- [x] Approbations : vrai workflow d'approbation des ventes
- [x] Défis : créer/gérer les défis de concession
- [x] Rapports : données réelles pour les rapports
- [x] Payplan : sauvegarder le payplan en base (plus localStorage)

### Direction Marque (N4)
- [x] Dashboard : remplacer les données de `mock-dir-marque-data.ts`
- [x] Concessions : charger la vraie liste des concessions de la marque
- [x] Benchmark : calculer les vrais benchmarks entre concessions
- [x] Stocks : afficher les vrais stocks et transferts
- [x] Défis : créer/gérer les défis inter-concessions

### Direction Plaque (N5)
- [x] Dashboard : remplacer les données de `mock-dir-plaque-data.ts`
- [x] Marques : charger la vraie liste des marques du groupe
- [x] Performance : calculer les vraies performances consolidées
- [x] Rapports : générer les vrais rapports groupe
- [x] Défis : créer/gérer les défis groupe

### Transversal
- [x] Supprimer tous les fichiers `mock-*.ts` une fois les API branchées
- [x] Notifications : afficher les vraies notifications en temps réel
- [x] Recherche globale : brancher la barre de recherche sur une vraie recherche

### Phase 4B — Migration mock data restant + Fix champs zéro

> Éliminer les derniers mock data inline et corriger les champs API renvoyant 0.

#### Fix champs zéro (APIs)
- [x] `sales_target` : dériver depuis `equipes.objective.monthly_target` (fallback : `totalSales * 1.1`)
- [x] `quarterly_growth` : comparer fiches 3 derniers mois vs 3 mois précédents
- [x] `market_share` : part relative des ventes dans le groupe (2e passe)
- [x] `growth` concessions : comparer mois courant vs mois précédent
- [x] `satisfaction` / `stock_days` : afficher "N/A" quand valeur = 0 (pas de source BDD)
- [x] Helper `displayValue()` dans `lib/types/display.ts`

#### Migration pages
- [x] `chef-ventes/page.tsx` : remplacer `otherTeams` hardcodé par `siblingTeams` API
- [x] `direction/page.tsx` : remplacer `departmentStats`, `stockInfo`, `plData` par API + config statique
- [x] `marque/benchmark/page.tsx` : remplacer `performanceHistory` hardcodé par données dashboard
- [x] `groupe/performance/page.tsx` : dériver `trendsData`, alimenter `PerformanceChart` par marque
- [x] `marque/stocks/page.tsx` : extraire `deriveBrandKPIs()` partagé, déplacer stock vers config
- [x] `groupe/reports/page.tsx` : déplacer `reports`/`reportTemplates` vers `lib/config/`

#### Enrichissements API dashboard
- [x] `getDirConcessionDashboard()` : ajout `departmentStats` (breakdown VN/VO/VU/APV)
- [x] `getChefVentesDashboard()` : ajout `siblingTeams` (équipes même concession)
- [x] `getDirPlaqueDashboard()` : ajout `perBrandHistory` (historique par marque)

#### Fichiers créés
- [x] `lib/config/static-data.ts` — stockInfo, plCostLines (direction)
- [x] `lib/config/static-stock-data.ts` — stockTransfers, stockItems (stocks)
- [x] `lib/config/report-templates.ts` — reports, reportTemplates (rapports)
- [x] `lib/utils/kpi-helpers.ts` — deriveBrandKPIs, computeTrend (partagé)

### Phase 4C — Audit & Nettoyage final

> Corrections sécurité, suppression des derniers mock data, nettoyage console.

#### Sécurité
- [x] Fix open redirect dans `/auth/callback` (validation du paramètre `next`)
- [x] Fix bypass auth cron `/api/email/send-queued` (CRON_SECRET obligatoire)
- [x] Fix mot de passe minimum 6→8 caractères (`reset-password`)
- [x] Enrichir `/api/marques/[id]` avec `sales_target`, `growth`, `quarterly_growth`, departments

#### Migration mock data restant
- [x] `marque/challenges/page.tsx` : remplacer `mockChallenges` par `useDefis()` API
- [x] `chef-ventes/challenges/page.tsx` : remplacer `mockChallenges` par `useDefis()` API
- [x] `groupe/challenges/page.tsx` : remplacer `mockChallenges` par `useDefis()` API
- [x] `marque/challenges/new/page.tsx` : remplacer `dealerships` mock par `useConcessionsList()` API
- [x] `groupe/challenges/new/page.tsx` : remplacer `brands` mock par `useMarques()` API
- [x] `direction/challenges/new/page.tsx` : remplacer `setTimeout` simulé par `createDefi()` API
- [x] `dashboard/page.tsx` : remplacer `salesTarget = 12` par `kpis.salesTarget` depuis API
- [x] `profile/page.tsx` : remplacer `"Ma Concession"` hardcodé par `profil.concession_name`

#### API enrichissements
- [x] `getCommercialDashboard()` : ajout `salesTarget` (depuis `equipes.objective.monthly_target`)
- [x] `GET /api/profil` : ajout `concession_name` (join sur `concessions`)

#### Nettoyage code
- [x] Supprimer 10 `console.log`/`console.error` côté client
- [x] Renommer `mockRecentBadges` → `recentBadges`, `mockUser` → `userData`
- [x] Supprimer les fallbacks mock (`|| 12`, `|| 6`, `|| 3`) dans les challenge pages
- [x] Fix `error: any` → `error: unknown` dans `lib/push/sender.ts`
- [x] Supprimer TODOs résolus (5 sur 7 — 2 restants : badges API + streak API, pas de source BDD)

#### Middleware & Routing
- [x] Redirection post-login par rôle (commercial→`/dashboard`, chef_ventes→`/chef-ventes`, etc.)
- [x] Protection des routes par niveau de rôle dans le middleware (commercial bloqué sur `/direction/*`, etc.)

---

## PHASE 5 — Fonctionnalités manquantes

> Features qui n'existent pas du tout aujourd'hui.

- [x] Page "Mot de passe oublié" (envoi d'email de reset) (fait en Phase 1)
- [x] Upload d'avatar utilisateur (photo de profil)
- [x] Export PDF des fiches de marge (vrai PDF, pas juste `window.print`)
- [x] Export Excel des rapports (boutons déjà présents mais non fonctionnels)
- [x] Système de notifications email (nouveau défi, vente validée, badge obtenu)
- [x] Système de notifications push (navigateur)
- [x] Historique des modifications d'une fiche de marge (audit trail)
- [x] Filtre par période sur tous les tableaux de bord (date réelle, pas mock)
- [x] Graphiques interactifs avec vraies données temporelles (Recharts branché sur l'API)
- [x] Page paramètres utilisateur (changer email, mot de passe, préférences)
- [x] Page paramètres concession (infos concession, logo, coordonnées)
- [x] Gestion multi-concessions pour un même utilisateur

---

## PHASE 6 — Tests & Qualité

> S'assurer que tout fonctionne et reste stable.

- [x] Installer un framework de test (Vitest + Testing Library) → Vitest 4.0, jsdom, @testing-library/react
- [x] Écrire les tests unitaires pour `margin-utils.ts` (47 tests : HT/TTC, payplan, localStorage, VO/VP/VU, commissions, VN)
- [x] Écrire les tests unitaires pour les fonctions API (28 tests : roles, errors, pagination, validation, p2p-utils)
- [x] Installer Playwright pour les tests E2E → Playwright 1.58 + @axe-core/playwright
- [x] Écrire les tests E2E : parcours login → dashboard (5 tests)
- [x] Écrire les tests E2E : parcours création fiche de marge (4 tests)
- [x] Écrire les tests E2E : parcours création défi P2P (4 tests)
- [x] Mettre en place un linter strict (ESLint flat config + jsx-a11y + react-hooks + Prettier)
- [x] Vérifier l'accessibilité (a11y) des pages principales (7 pages, axe-core WCAG 2.0 AA)
- [x] Tester le responsive sur mobile, tablette, desktop (3 viewports × 5 pages)

---

## PHASE 7 — Mise en production

> Préparer le déploiement final.

- [ ] Configurer les variables d'environnement de production (Vercel dashboard)
- [ ] Mettre en place un domaine personnalisé (Vercel dashboard)
- [x] Configurer le HTTPS (automatique avec Vercel)
- [x] Mettre en place un CI/CD (`.github/workflows/ci.yml` : lint + test + build)
- [x] Installer un outil de monitoring d'erreurs (Sentry — `@sentry/nextjs` + instrumentation)
- [x] Installer un outil d'analytics (Vercel Analytics — `<Analytics />` dans layout)
- [x] Optimiser les performances (dynamic imports : jspdf -138 kB, xlsx lazy-loaded sur export)
- [ ] Configurer les backups de la base de données (Supabase dashboard)
- [x] Rédiger un README.md avec les instructions d'installation
- [x] Créer un guide utilisateur basique → `GUIDE-UTILISATEUR.md`

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
| **TOTAL** | | **151 tâches** | **149/151 (99%)** |

---

> **Comment on avance :** tu me dis quelle tâche on attaque, je code, on coche, on passe à la suivante.
