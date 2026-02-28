# Documentation Architecture — AutoPerf Pro

> Documentation technique modulaire du projet AutoPerf Pro.
> Chaque fichier documente un domaine metier complet : donnees, flux, fichiers cles, et dettes techniques.

## Modules

| # | Module | Fichier | Description |
|---|--------|---------|-------------|
| 01 | [Authentification](./01-authentification.md) | `01-authentification.md` | Auth Supabase, RBAC 6 niveaux, middleware, protection des routes, inscription/connexion/reset |
| 02 | [Fiches de Marge](./02-fiches-marge.md) | `02-fiches-marge.md` | Calculateur de marge (VO/VN/VU), moteur de commission, export PDF, audit trail |
| 03 | [Defis](./03-defis.md) | `03-defis.md` | Challenges plateforme (equipe/concession/marque/groupe) + duels P2P avec negociation |
| 04 | [Dashboards & KPI](./04-dashboards-kpi.md) | `04-dashboards-kpi.md` | 5 dashboards role-specifiques, KPIs, graphiques Recharts, helpers d'agregation |
| 05 | [Equipe, Coaching & Approbations](./05-equipe-coaching-approbations.md) | `05-equipe-coaching-approbations.md` | Gestion d'equipe, notes de coaching, workflow d'approbation des ventes |
| 06 | [Notifications](./06-notifications.md) | `06-notifications.md` | In-app + email (Resend) + push (VAPID), preferences utilisateur, templates |
| 07 | [Concessions & Marques](./07-concessions-marques.md) | `07-concessions-marques.md` | Structure organisationnelle, enrichissement statistique, multi-concessions, benchmark |
| 08 | [Payplan](./08-payplan.md) | `08-payplan.md` | Grille de commission configurable, bonus, paliers, modeles VP |
| 09 | [Rapports & Exports](./09-rapports-exports.md) | `09-rapports-exports.md` | Rapports par role, export Excel/CSV, templates de generation |
| 10 | [Recherche, Leaderboard & Profil](./10-recherche-leaderboard-profil.md) | `10-recherche-leaderboard-profil.md` | Recherche globale Cmd+K, classement, profil, badges, parametres |

## Convention

Chaque fichier suit la meme structure :

1. **Resume metier** — A quoi sert le module
2. **Architecture des donnees** — Tables, champs, types, schemas Zod
3. **Fichiers cles** — Tableau des fichiers source lies au module
4. **Flux principaux** — Etapes logiques de chaque operation
5. **Points d'attention / Dettes techniques** — Ce qu'il faut savoir avant de modifier

## Stack technique

- **Framework** : Next.js 15.5.12 (App Router) + React 19 + TypeScript strict
- **Base de donnees** : Supabase PostgreSQL (auth + DB + storage)
- **UI** : Tailwind CSS 4, shadcn/ui (54+ composants), Recharts
- **Tests** : Vitest (82+ tests unitaires), Playwright (E2E)
- **Monitoring** : Sentry, Vercel Analytics
- **Deploiement** : Vercel (CI/CD via GitHub Actions)
