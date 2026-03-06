# ROADMAP — AutoPerf Pro

> Derniere mise a jour : 6 mars 2026
> On coche ensemble au fur et a mesure.

---

## Etat des lieux

Le projet est a **98%** (195/199 taches des phases 0-11 terminees). Il reste des taches de mise en production, quelques donnees statiques a remplacer, et des ameliorations pour un produit solide.

---

## PRIORITE 0 — Bloquant production

> Sans ca, le site ne tourne pas correctement en prod. (Actions manuelles Vercel/Supabase Dashboard)

### Deploiement & infra

- [ ] Configurer les variables d'environnement de production dans Vercel Dashboard (Supabase URL, keys, Sentry DSN, VAPID, Resend)
- [ ] Executer la migration `supabase/migrations/008_stocks.sql` dans le SQL Editor de Supabase (tables `stocks` + `stock_transfers` + RLS)
- [ ] Configurer les backups automatiques de la base de donnees (Supabase Dashboard > Database > Backups)

---

## PRIORITE 1 — Important avant lancement

> Qualite pro, fiabilite, premiere impression.

### Page d'erreur globale

- [x] Creer `app/error.tsx` (error boundary React pour les erreurs 5xx, avec bouton "Reessayer" et lien retour accueil)
- [x] Creer `app/(protected)/error.tsx` (variante pour les pages protegees, avec lien vers /dashboard)

### Domaine & SEO

- [ ] Configurer un domaine personnalise sur Vercel (DNS + certificat SSL)
- [x] Ajouter les meta tags Open Graph et Twitter Card sur la landing page (deja present dans `app/layout.tsx`)
- [x] Ajouter un `robots.txt` et un `sitemap.xml` (pages publiques uniquement)

### Contenu legal definitif

- [ ] Remplacer le texte placeholder de `/cgu` par le contenu juridique reel
- [ ] Remplacer le texte placeholder de `/confidentialite` par la politique RGPD reelle
- [ ] Remplacer le texte placeholder de `/mentions-legales` par les mentions reelles (raison sociale, SIRET, hebergeur, etc.)

### Donnees statiques restantes

- [x] `lib/config/static-stock-data.ts` : supprime — n'etait importe nulle part, l'UI utilise deja l'API `/api/stocks` et `/api/stock-transfers`
- [x] `lib/config/static-data.ts` : supprime — n'etait importe nulle part, les dashboards utilisent deja les APIs reelles

---

## PRIORITE 2 — Ameliorations qualite

> Rend le produit plus solide et agreable au quotidien.

### UX & feedback utilisateur

- [x] Ajouter des fichiers `loading.tsx` pour les sections principales (`app/(protected)/loading.tsx`, `app/(auth)/loading.tsx`)
- [x] Ajouter des etats vides (empty states) — deja present sur toutes les pages listes (equipe, defis, coaching, notifications, stocks, leaderboard)
- [x] Ajouter la confirmation avant suppression (AlertDialog) sur coaching, challenges (4 pages), direction/users
- [x] Ajouter un indicateur de force du mot de passe sur les pages register et reset-password

### Securite

- [ ] Ajouter un rate limiting sur les routes API sensibles (`/api/profil/password`, `/api/push/subscribe`, `/api/email/send-queued`)
- [x] Ajouter des headers de securite (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) dans `next.config.mjs`
- [ ] Verifier que toutes les routes API qui modifient des donnees valident le Content-Type `application/json`

### Tests supplementaires

- [x] Ajouter un test E2E pour le parcours stocks (consultation, transfert, approbation)
- [x] Ajouter un test E2E pour le parcours payplan (creation regle, modification, suppression)
- [x] Ajouter un test E2E pour le parcours notifications (reception, lecture, marquer tout lu)
- [x] Ajouter des tests unitaires pour les hooks critiques (`use-fiches-marge`, `use-defis`)

---

## PRIORITE 3 — Fonctionnalites futures

> Nouvelles features pour enrichir la plateforme apres le lancement.

### Dark mode

- [x] Activer le theme sombre via `next-themes` (ThemeProvider integre dans `app/layout.tsx`)
- [x] Ajouter un toggle clair/sombre dans la navbar + settings utilisateur (`/profile/settings`)
- [ ] Verifier le rendu de tous les composants et graphiques en mode sombre

### Performance & offline

- [ ] Mettre en cache les donnees dashboard avec `stale-while-revalidate` (SWR ou React Query)
- [ ] Ajouter un Service Worker pour le mode offline basique (PWA)
- [ ] Ajouter une page `/offline` avec message d'indisponibilite

### Tableaux de bord avances

- [ ] Ajouter un filtre par commercial sur le dashboard chef des ventes
- [ ] Ajouter un comparatif mois par mois (M vs M-1) sur tous les dashboards
- [ ] Ajouter l'export PDF du dashboard (capture des KPIs + graphiques)
- [ ] Ajouter des objectifs personnalisables par commercial (pas seulement par equipe)

### Collaboration & communication

- [ ] Ajouter un systeme de commentaires sur les fiches de marge (echanges commercial <-> chef des ventes)
- [ ] Ajouter des notifications en temps reel (WebSocket ou Supabase Realtime)
- [ ] Ajouter un fil d'activite par concession (timeline des evenements recents)

### Multi-langue

- [ ] Extraire toutes les chaines de caracteres dans des fichiers de traduction
- [ ] Ajouter le support anglais (i18n avec `next-intl` ou similaire)
- [ ] Ajouter un selecteur de langue dans les settings utilisateur

### Integration DMS

- [ ] Definir le format d'import des donnees vehicules depuis un DMS (CSV / API)
- [ ] Creer une page d'import de donnees (`/direction/import`)
- [ ] Connecter les stocks et le P&L a un flux de donnees reel

---

## Resume

| Priorite | Description | Taches | Statut |
|----------|-------------|--------|--------|
| P0 | Bloquant production (manuel) | 3 | 0/3 |
| P1 | Important avant lancement | 9 | 5/9 |
| P2 | Ameliorations qualite | 11 | 8/11 |
| P3 | Fonctionnalites futures | 16 | 2/16 |
| **TOTAL** | | **39 taches** | **15/39** |

---

> **Comment on avance :** tu me dis quelle tache on attaque, je code, on coche, on passe a la suivante.
