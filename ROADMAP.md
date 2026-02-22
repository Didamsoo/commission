# ROADMAP — Projet AutoPerf

> Dernière mise à jour : 22 février 2026
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
- [ ] Créer le fichier `.env.local` avec les clés d'API
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
- [ ] Migrer les données du localStorage vers la base

---

## PHASE 3 — Passer en mode Serveur (API)

> Actuellement le projet est en export statique. Il faut un vrai backend.

- [x] Retirer `output: 'export'` de `next.config.mjs` (fait en Phase 1)
- [ ] Adapter le déploiement (Vercel au lieu de Netlify statique, ou Netlify Functions)
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

- [ ] Configurer les variables d'environnement de production
- [ ] Mettre en place un domaine personnalisé
- [ ] Configurer le HTTPS
- [ ] Mettre en place un CI/CD (GitHub Actions : build + test à chaque push)
- [ ] Installer un outil de monitoring d'erreurs (Sentry)
- [ ] Installer un outil d'analytics (Plausible, PostHog ou Google Analytics)
- [ ] Optimiser les performances (Lighthouse score > 90)
- [ ] Configurer les backups de la base de données
- [ ] Rédiger un README.md avec les instructions d'installation
- [ ] Créer un guide utilisateur basique

---

## Résumé par phase

| Phase | Contenu | Nb tâches |
|-------|---------|-----------|
| 0 | Nettoyage & Corrections | 9 |
| 1 | Authentification | 12 |
| 2 | Base de données | 15 |
| 3 | API Backend | 15 |
| 4 | Connexion Frontend ↔ Backend | 27 |
| 5 | Fonctionnalités manquantes | 12 |
| 6 | Tests & Qualité | 10 |
| 7 | Mise en production | 10 |
| **TOTAL** | | **110 tâches** |

---

> **Comment on avance :** tu me dis quelle tâche on attaque, je code, on coche, on passe à la suivante.
