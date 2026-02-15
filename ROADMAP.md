# ROADMAP — Projet AutoPerf

> Dernière mise à jour : 15 février 2026
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
- [ ] Créer la route API `POST /api/auth/[...]` (si NextAuth)
- [ ] Créer la route API `GET/POST /api/fiches-marge` (CRUD fiches de marge)
- [ ] Créer la route API `GET/POST /api/payplan` (CRUD payplan)
- [ ] Créer la route API `GET/POST /api/defis` (CRUD défis plateforme)
- [ ] Créer la route API `GET/POST /api/defis-p2p` (CRUD défis P2P)
- [ ] Créer la route API `GET/POST /api/equipe` (gestion équipe)
- [ ] Créer la route API `GET/POST /api/approbations` (workflow validation ventes)
- [ ] Créer la route API `GET/POST /api/coaching` (notes de coaching)
- [ ] Créer la route API `GET /api/leaderboard` (classement)
- [ ] Créer la route API `GET /api/dashboard/[role]` (stats par rôle)
- [ ] Créer la route API `GET /api/rapports` (génération de rapports)
- [ ] Créer la route API `GET/PUT /api/profil` (profil utilisateur)
- [ ] Créer la route API `GET /api/notifications` (notifications)

---

## PHASE 4 — Connecter le Frontend aux vraies données

> Remplacer tous les mock data par des appels API réels.

### Commercial (N1)
- [ ] Dashboard : remplacer `mockStats`, `mockActiveChallenges`, `mockLeaderboard`, `mockRecentSales`, `mockRecentBadges` par des appels API
- [ ] Calculateur : sauvegarder les fiches de marge en base (plus localStorage)
- [ ] Leaderboard : remplacer `mockLeaderboardData` par l'API classement
- [ ] Défis : charger les vrais défis plateforme + P2P depuis l'API
- [ ] Profil : charger le vrai profil, les vrais badges, les vraies stats

### Chef des Ventes (N2)
- [ ] Dashboard : remplacer les données de `mock-chef-ventes-data.ts` par l'API
- [ ] Équipe : charger la vraie liste de commerciaux de l'équipe
- [ ] Coaching : CRUD notes de coaching via l'API
- [ ] Rapports : générer les vrais rapports depuis les données réelles
- [ ] Défis : créer/gérer les vrais défis d'équipe

### Direction Concession (N3)
- [ ] Dashboard : remplacer les données de `mock-dir-concession-data.ts`
- [ ] Utilisateurs : vrai CRUD utilisateurs (invitation, rôle, activation)
- [ ] Approbations : vrai workflow d'approbation des ventes
- [ ] Défis : créer/gérer les défis de concession
- [ ] Rapports : données réelles pour les rapports
- [ ] Payplan : sauvegarder le payplan en base (plus localStorage)

### Direction Marque (N4)
- [ ] Dashboard : remplacer les données de `mock-dir-marque-data.ts`
- [ ] Concessions : charger la vraie liste des concessions de la marque
- [ ] Benchmark : calculer les vrais benchmarks entre concessions
- [ ] Stocks : afficher les vrais stocks et transferts
- [ ] Défis : créer/gérer les défis inter-concessions

### Direction Plaque (N5)
- [ ] Dashboard : remplacer les données de `mock-dir-plaque-data.ts`
- [ ] Marques : charger la vraie liste des marques du groupe
- [ ] Performance : calculer les vraies performances consolidées
- [ ] Rapports : générer les vrais rapports groupe
- [ ] Défis : créer/gérer les défis groupe

### Transversal
- [ ] Supprimer tous les fichiers `mock-*.ts` une fois les API branchées
- [ ] Notifications : afficher les vraies notifications en temps réel
- [ ] Recherche globale : brancher la barre de recherche sur une vraie recherche

---

## PHASE 5 — Fonctionnalités manquantes

> Features qui n'existent pas du tout aujourd'hui.

- [x] Page "Mot de passe oublié" (envoi d'email de reset) (fait en Phase 1)
- [ ] Upload d'avatar utilisateur (photo de profil)
- [ ] Export PDF des fiches de marge (vrai PDF, pas juste `window.print`)
- [ ] Export Excel des rapports (boutons déjà présents mais non fonctionnels)
- [ ] Système de notifications email (nouveau défi, vente validée, badge obtenu)
- [ ] Système de notifications push (navigateur)
- [ ] Historique des modifications d'une fiche de marge (audit trail)
- [ ] Filtre par période sur tous les tableaux de bord (date réelle, pas mock)
- [ ] Graphiques interactifs avec vraies données temporelles (Recharts branché sur l'API)
- [ ] Page paramètres utilisateur (changer email, mot de passe, préférences)
- [ ] Page paramètres concession (infos concession, logo, coordonnées)
- [ ] Gestion multi-concessions pour un même utilisateur

---

## PHASE 6 — Tests & Qualité

> S'assurer que tout fonctionne et reste stable.

- [ ] Installer un framework de test (Vitest ou Jest)
- [ ] Écrire les tests unitaires pour `margin-utils.ts` (calculs de marge)
- [ ] Écrire les tests unitaires pour les fonctions API
- [ ] Installer Playwright ou Cypress pour les tests E2E
- [ ] Écrire les tests E2E : parcours login → dashboard
- [ ] Écrire les tests E2E : parcours création fiche de marge
- [ ] Écrire les tests E2E : parcours création défi P2P
- [ ] Mettre en place un linter strict (ESLint + Prettier)
- [ ] Vérifier l'accessibilité (a11y) des pages principales
- [ ] Tester le responsive sur mobile, tablette, desktop

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
