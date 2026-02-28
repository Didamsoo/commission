# Module : Recherche, Leaderboard & Profil

## Resume metier

Trois fonctionnalites transversales. La **recherche globale** (Cmd+K) permet de trouver rapidement des fiches, profils, defis et concessions. Le **leaderboard** classe les commerciaux par performance (commission, ventes, marge). Le **profil** centralise les informations personnelles, les badges, les parametres de notification et le changement de mot de passe.

---

## Architecture des donnees

### Recherche globale

#### Endpoint : `GET /api/search?q=...`

| Parametre | Type | Description |
|-----------|------|-------------|
| `q` | string | Terme de recherche (minimum 2 caracteres) |

#### Entites recherchees (5 resultats par categorie)

| Entite | Table | Champs recherches | Lien genere |
|--------|-------|-------------------|-------------|
| Fiches | `fiches_marge` | `vehicle_sold_name`, `client_name` | `/calculator?id={id}` |
| Profils | `profiles` | `full_name`, `email` | `/chef-ventes/equipe/{id}` |
| Defis | `defis_plateforme` | `title` | `/challenges` |
| Concessions | `concessions` | `name`, `city` | `/marque/concessions/{id}` |

#### Format de reponse

```typescript
{
  fiches: SearchResult[],
  profiles: SearchResult[],
  defis: SearchResult[],
  concessions: SearchResult[]
}

SearchResult = {
  id: string,
  type: 'fiche' | 'profile' | 'defi' | 'concession',
  title: string,      // Nom/titre principal
  subtitle: string,   // Info secondaire (date, email, ville...)
  href: string        // Lien de navigation
}
```

### Leaderboard

#### Endpoint : `GET /api/leaderboard`

| Parametre | Type | Default | Description |
|-----------|------|---------|-------------|
| `period` | string? | — | Mois au format `YYYY-MM` |
| `startDate` | string? | — | Date debut custom |
| `endDate` | string? | — | Date fin custom |
| `metric` | string? | `final_margin` | Metrique de tri |
| `limit` | number? | 20 | Nombre de resultats |

#### Metriques supportees

| Metrique API | Label UI | Description |
|-------------|----------|-------------|
| `final_margin` | Points | Tri par marge totale |
| `seller_commission` | Commission | Tri par commission totale |
| `selling_price_ht` | Chiffre d'affaires | Tri par revenu total |
| `sales_count` | Ventes | Tri par nombre de ventes |

#### Structure d'une entree leaderboard

```typescript
{
  user_id: string,
  full_name: string,
  avatar_url: string | null,
  role: string,
  total_sales: number,
  total_margin: number,
  total_commission: number,
  total_revenue: number,
  financing_count: number,
  rank: number              // 1-indexed
}
```

### Profil utilisateur

#### Endpoint : `GET /api/profil`

Retourne le profil complet avec jointure sur `concessions` pour `concession_name`.

```typescript
ProfilData = {
  // Champs BDD (profiles)
  id, email, full_name, first_name, last_name, phone, avatar_url,
  role, level, concession_id, equipe_id, marque_id, groupe_id,
  manager_id, is_active, created_at, updated_at, settings,

  // Champ enrichi (jointure)
  concession_name: string | null
}
```

#### Endpoint : `PUT /api/profil`

Mise a jour partielle du profil. Schema : `updateProfilSchema`.

#### Endpoint : `POST /api/profil/avatar`

Upload d'avatar vers Supabase Storage.

| Contrainte | Valeur |
|-----------|--------|
| Types autorises | JPEG, PNG, WebP, GIF |
| Taille max | 2 MB |
| Chemin stockage | `avatars/{user_id}/{timestamp}.{ext}` |

Flux :
1. Upload vers bucket `avatars` (Supabase Storage)
2. Obtenir l'URL publique
3. Mettre a jour `profiles.avatar_url`
4. Mettre a jour `auth.user_metadata.avatar_url`
5. Supprimer l'ancien avatar du storage

#### Endpoint : `PUT /api/profil/password`

Changement de mot de passe (voir module 01 pour les details).

---

## Fichiers cles

| Fichier | Role |
|---------|------|
| `app/api/search/route.ts` | Recherche unifiee multi-entites |
| `app/api/leaderboard/route.ts` | Classement des commerciaux |
| `app/api/profil/route.ts` | GET/PUT profil |
| `app/api/profil/avatar/route.ts` | POST upload avatar |
| `app/api/profil/password/route.ts` | PUT changement mot de passe |
| `hooks/use-search.ts` | `useSearch()` avec debounce 300ms |
| `hooks/use-leaderboard.ts` | `useLeaderboard(period?, metric?, limit?)` |
| `hooks/use-profil.ts` | `useProfil()`, `updateProfil()` |
| `hooks/use-avatar-upload.ts` | `uploadAvatar(file)` |
| `components/search/global-search-dialog.tsx` | Dialog de recherche (Cmd+K) |
| `app/(protected)/leaderboard/page.tsx` | Page classement |
| `app/(protected)/profile/page.tsx` | Page profil |
| `app/(protected)/profile/badges/page.tsx` | Page badges dediee |
| `app/(protected)/profile/settings/page.tsx` | Page parametres |

---

## Flux principaux

### Recherche globale

```
1. Utilisateur ouvre la recherche via Cmd+K (ou Ctrl+K)
   -> CommandDialog (shadcn/ui) s'ouvre

2. Saisie du terme (minimum 2 caracteres)
   -> Debounce de 300ms
   -> AbortController annule la requete precedente
   -> GET /api/search?q={term}

3. Affichage des resultats groupes :
   - Fiches (icone FileText, bleu)
   - Profils (icone User, violet)
   - Defis (icone Target, ambre)
   - Concessions (icone Building2, emeraude)

4. Selection d'un resultat -> navigation vers href
   -> Dialog se ferme automatiquement
```

### Leaderboard

```
1. Page charge le classement : useLeaderboard(period, metric, limit)
   -> GET /api/leaderboard?period=YYYY-MM&metric=...&limit=20

2. API :
   - Convertir period YYYY-MM en date range
   - SELECT profiles avec SUM(fiches_marge) par user
   - Trier par metrique choisie
   - Attribuer les rangs (1-indexed)

3. Affichage :
   - Podium (top 3) :
     * 1er : couronne or, fond dore, grande taille
     * 2eme : medaille argent
     * 3eme : medaille bronze
   - Liste classee avec rang, avatar, nom, valeur metrique
   - Position de l'utilisateur connecte en surbrillance

4. Onglets metriques : Commission | Ventes | Points
   -> Changement d'onglet = changement de metrique API

5. Periode : filtre par mois (YYYY-MM)
```

### Profil utilisateur

#### Page principale (`/profile`)

```
1. En-tete gradient (bleu-indigo) :
   - Grand avatar avec bouton camera (upload)
   - Nom, concession, email
   - Bouton "Modifier"

2. Section niveau :
   - Badge numerique (1-7)
   - Nom du niveau (depuis le role)
   - Points actuels / points vers niveau suivant
   - Barre de progression

3. Stats rapides (4 cards) :
   - Ventes totales (Car, bleu)
   - Commission totale (Euro, emeraude)
   - Meilleur rang (Trophy, ambre)
   - Plus longue serie (Flame, orange)

4. Onglets :
   - Vue d'ensemble : realisations recentes, details stats
   - Badges : grille badges gagnes + badges verrouilles avec progression
```

#### Page badges (`/profile/badges`)

```
- En-tete avec bouton retour, titre, progression X/Y
- Card progression globale (pourcentage)
- Section "Badges obtenus" : grille avec icones et dates
- Section "A debloquer" : grille avec barres de progression
```

#### Page parametres (`/profile/settings`)

```
4 sections :
1. Informations personnelles : prenom, nom, telephone, email (disabled)
2. Notifications email : 4 toggles (global, defis, ventes, badges)
3. Notifications push :
   - Bouton s'abonner/se desabonner
   - Utilise navigator.serviceWorker + PushManager
   - Cle VAPID depuis NEXT_PUBLIC_VAPID_PUBLIC_KEY
4. Mot de passe : nouveau + confirmation (min 8 car.)
```

### Upload d'avatar

```
1. Clic sur l'icone camera du profil
2. Selection du fichier (JPEG, PNG, WebP, GIF, max 2 MB)
3. POST /api/profil/avatar (FormData)
4. Upload vers Supabase Storage : avatars/{user_id}/{timestamp}.{ext}
5. Obtenir URL publique
6. UPDATE profiles SET avatar_url = URL
7. UPDATE auth.user metadata avatar_url
8. Supprimer ancien fichier du storage
9. window.location.reload() <-- DETTE TECHNIQUE
```

---

## Points d'attention / Dettes techniques

1. **Badges entierement mock** : Les pages `/profile`, `/profile/badges` et `/dashboard` utilisent des tableaux `allBadges`/`recentBadges` hardcodes. Pas d'API `/api/badges` ni de lecture de la table `badges_utilisateur`. C'est la plus grosse lacune fonctionnelle restante.

2. **`window.location.reload()` apres upload avatar** : La page profil fait un rechargement complet au lieu de rafraichir le state React. Mauvaise UX (flash blanc, perte de scroll).

3. **Recherche non paginee** : L'API retourne 5 resultats par categorie (hardcode). Pas de "voir plus" ni de pagination pour des recherches avec beaucoup de resultats.

4. **Leaderboard — periodes limitees** : Seul le filtre mensuel (`YYYY-MM`) est fonctionnel. Les filtres jour, semaine, trimestre et annee sont affiches mais retournent `undefined` (pas implementes).

5. **Bloc catch silencieux dans settings** : La page parametres a des blocs `catch { toast({ title: "Erreur..." }) }` sans logging de l'erreur reelle. Difficile a debugger.

6. **Hook `useSearch` — abort race condition** : Le hook gere correctement l'annulation des requetes precedentes via AbortController, mais le state `loading` peut rester `true` si toutes les requetes sont annulees sans qu'une ne complete.

7. **Classement statique** : Le leaderboard est calcule a chaque requete depuis les fiches de marge. Pas de table de classement pre-calculee ni de cache. Peut devenir lent avec beaucoup de donnees.

8. **Liens de recherche fixes** : Les liens generes pour les profils (`/chef-ventes/equipe/{id}`) ne sont accessibles qu'aux roles >= chef_ventes. Un commercial cliquant sur un resultat de recherche "profil" obtiendra un redirect.
