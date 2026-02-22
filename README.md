# AutoPerf Pro

Plateforme de gestion des marges et commissions pour concessions automobiles. Calculez vos marges (VO, VN, VU), suivez les performances de vos équipes et motivez vos commerciaux grâce à la gamification.

## Stack technique

- **Framework** : Next.js 15 (App Router)
- **UI** : React 19, Tailwind CSS 4, shadcn/ui
- **Base de données** : Supabase (PostgreSQL)
- **Auth** : Supabase Auth (SSR)
- **Monitoring** : Sentry
- **Analytics** : Vercel Analytics
- **Tests** : Vitest, Playwright
- **Déploiement** : Vercel

## Prérequis

- Node.js 20+
- npm 10+
- Un projet [Supabase](https://supabase.com) configuré

## Installation

```bash
git clone https://github.com/Didamsoo/commission.git
cd commission
npm install
cp .env.example .env.local
# Remplir les variables dans .env.local
```

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm start` | Serveur de production |
| `npm run test` | Tests unitaires (Vitest) |
| `npm run test:watch` | Tests en mode watch |
| `npm run test:coverage` | Tests avec couverture |
| `npm run test:e2e` | Tests end-to-end (Playwright) |
| `npm run lint:strict` | Lint ESLint strict (zero warnings) |
| `npm run format` | Formatage Prettier |
| `npm run format:check` | Vérification du formatage |

## Structure du projet

```
app/
├── (auth)/              # Pages d'authentification
│   ├── login/
│   ├── register/
│   ├── forgot-password/
│   └── reset-password/
├── (protected)/         # Pages protégées (auth requise)
│   ├── calculator/      # Calculateur de marge
│   ├── challenges/      # Défis plateforme
│   ├── chef-ventes/     # Espace chef des ventes
│   ├── dashboard/       # Tableau de bord
│   ├── direction/       # Espace direction concession
│   ├── groupe/          # Espace direction groupe
│   ├── leaderboard/     # Classement
│   ├── marque/          # Espace direction marque
│   └── profile/         # Profil utilisateur
├── api/                 # Routes API
└── layout.tsx           # Layout racine

components/
├── charts/              # Composants graphiques (Recharts)
├── p2p-challenges/      # Système de défis P2P
├── search/              # Recherche globale
└── ui/                  # Composants shadcn/ui

hooks/                   # Custom hooks React
lib/
├── api/                 # Client API & types
├── contexts/            # Contextes React
├── email/               # Templates email (Resend)
├── excel/               # Export Excel
├── pdf/                 # Export PDF
├── push/                # Notifications push
└── validations/         # Schémas Zod

supabase/
└── migrations/          # Migrations SQL

e2e/                     # Tests Playwright
```

## Déploiement

Le projet est déployé sur **Vercel** avec déploiement automatique à chaque push sur `main`.

### Variables d'environnement requises

Configurer dans Vercel Dashboard > Settings > Environment Variables :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `VAPID_SUBJECT`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_SENTRY_DSN`
- `SENTRY_AUTH_TOKEN`

### CI/CD

GitHub Actions exécute automatiquement lint, tests et build sur chaque push et pull request vers `main`.

## Licence

Projet propriétaire - Tous droits réservés.
