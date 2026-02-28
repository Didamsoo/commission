# Module : Authentification & Controle d'Acces

## Resume metier

Systeme d'authentification multi-niveaux pour une plateforme de gestion automobile. Gere l'inscription, la connexion, la reinitialisation de mot de passe, la protection des routes par role, et le controle d'acces granulaire (RBAC). Chaque utilisateur possede un role determinant ses permissions et les sections de l'application auxquelles il a acces.

---

## Architecture des donnees

### Table `profiles` (Supabase)

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID | Cle primaire, correspond a l'ID Supabase Auth |
| `email` | string | Adresse email |
| `full_name` | string | Nom complet |
| `first_name` | string \| null | Prenom |
| `last_name` | string \| null | Nom de famille |
| `phone` | string \| null | Telephone |
| `avatar_url` | string \| null | URL avatar (Supabase Storage) |
| `role` | UserRole | Role dans la hierarchie |
| `level` | number | Niveau numerique (1-6) |
| `concession_id` | UUID \| null | Concession rattachee |
| `equipe_id` | UUID \| null | Equipe rattachee |
| `marque_id` | UUID \| null | Marque rattachee (N4) |
| `groupe_id` | UUID \| null | Groupe rattache (N5) |
| `manager_id` | UUID \| null | Superieur hierarchique |
| `is_active` | boolean | Compte actif |
| `settings` | JSONB \| null | Preferences notifications (`email_notifications`, `defi_notifications`, `vente_notifications`, `badge_notifications`) |
| `created_at` | timestamp | Date creation |
| `updated_at` | timestamp | Date mise a jour |

### Hierarchie des roles

| Role | Niveau | Label | Page d'accueil | Peut defier |
|------|--------|-------|----------------|-------------|
| `commercial` | 1 | Vendeur terrain | `/dashboard` | — |
| `chef_ventes` | 2 | Chef des ventes | `/chef-ventes` | commercial |
| `dir_concession` | 3 | Directeur concession | `/direction` | chef_ventes |
| `dir_marque` | 4 | Directeur marque | `/marque` | dir_concession |
| `dir_plaque` | 5 | Directeur plaque | `/groupe` | dir_marque |
| `admin` | 6 | Administrateur | `/groupe` | — |

### Matrice des permissions (`types/hierarchy.ts`)

| Permission | N1 | N2 | N3 | N4 | N5 | Admin |
|-----------|:--:|:--:|:--:|:--:|:--:|:-----:|
| canCreateChallenges | - | x | x | x | x | x |
| canApproveSales | - | x | x | x | x | x |
| canManageUsers | - | - | x | x | x | x |
| canViewPL | - | - | x | x | x | x |
| canEditPayplan | - | - | x | x | x | x |
| canViewTeam | - | x | x | x | x | x |
| canViewAllTeams | - | - | x | x | x | x |
| canViewMultiSites | - | - | - | x | x | x |
| canViewMultiBrands | - | - | - | - | x | x |
| canExportReports | - | x | x | x | x | x |
| canManageStock | - | - | x | x | x | x |

---

## Fichiers cles

| Fichier | Role |
|---------|------|
| `middleware.ts` | Protection des routes, redirection par role |
| `lib/api/auth.ts` | `getAuthenticatedUser()` — authentification serveur |
| `lib/api/types.ts` | `DbProfile`, `AuthContext`, `ApiResponse`, `ROLE_LEVELS` |
| `lib/api/errors.ts` | Helpers HTTP : `unauthorized()`, `forbidden()`, `badRequest()`, `notFound()`, `serverError()` |
| `lib/api/roles.ts` | `hasMinRole()`, `hasRole()`, `getScopeFilter()` |
| `lib/api/validation.ts` | `validateBody()` — validation Zod des requetes |
| `lib/api/client.ts` | `apiFetch()`, `ApiError` — client API cote navigateur |
| `lib/supabase/server.ts` | `createClient()` SSR avec cookies |
| `lib/supabase/client.ts` | `createClient()` navigateur |
| `types/hierarchy.ts` | `UserRole`, `ROLE_CONFIG`, permissions, `HierarchyUser` |
| `hooks/use-api.ts` | `useApi<T>()` — hook generique de fetch |
| `hooks/use-profil.ts` | `useProfil()`, `updateProfil()` |

---

## Flux principaux

### Connexion (Login)

```
Formulaire email/password
  -> supabase.auth.signInWithPassword()
  -> Erreur ? Afficher message traduit (FR)
  -> Succes -> router.push("/dashboard") + router.refresh()
```

Mapping des erreurs :
- `"Invalid login credentials"` -> "Email ou mot de passe incorrect."
- `"Email not confirmed"` -> "Veuillez confirmer votre email avant de vous connecter."

### Inscription (Register) — Formulaire 3 etapes

```
Etape 0 : Email + Mot de passe + Confirmation
Etape 1 : Prenom + Nom + Telephone
Etape 2 : Nom concession + Adresse + Acceptation CGU
  -> supabase.auth.signUp({ email, password, options: { data: metadata } })
  -> role = "commercial" (toujours, par defaut)
  -> Ecran de succes, invitation a confirmer l'email
```

Validation mot de passe (inscription) :
- Minimum 6 caracteres
- Au moins 1 majuscule
- Au moins 1 chiffre

### Callback d'authentification (`app/(auth)/callback/route.ts`)

```
GET /auth/callback?code=XXX&next=/XXX
  -> Valider `next` (doit commencer par "/" et pas "//") — anti-open-redirect
  -> exchangeCodeForSession(code)
  -> Succes -> redirect vers `next` (ou /dashboard)
  -> Echec -> redirect vers /login?error=auth_callback_error
```

### Reinitialisation mot de passe

```
1. /forgot-password : resetPasswordForEmail(email, redirectTo: /reset-password)
   -> Message generique (ne revele pas si l'email existe)
2. Email envoye avec lien Supabase
3. /reset-password : updateUser({ password })
   -> Minimum 8 caracteres
   -> Interdit de reutiliser l'ancien mot de passe
```

### Middleware — Protection des routes

```
1. Creer le client Supabase SSR (cookie forwarding)
2. getUser()
3. Route publique ? -> laisser passer
4. Pas connecte + route protegee ? -> redirect /login
5. Connecte + page auth (/login, /register) ? -> redirect vers ROLE_HOME[role]
6. Connecte + niveau insuffisant pour la route ? -> redirect vers ROLE_HOME[role]
```

Routes minimales par niveau :
- `/groupe` -> niveau 5+
- `/marque` -> niveau 4+
- `/direction` -> niveau 3+
- `/chef-ventes` -> niveau 2+

### Pattern API (toutes les routes protegees)

```typescript
const auth = await getAuthenticatedUser()
if (!auth) return unauthorized()           // 401
if (!hasMinRole(auth.profile, 'chef_ventes')) return forbidden()  // 403
const { data, error } = await validateBody(request, schema)
if (error) return error                    // 400
// ... logique metier
```

### Layout protege (`app/(protected)/layout.tsx`)

```
1. Au montage : getUser() -> construire CurrentUser depuis user_metadata
2. Ecouter onAuthStateChange() -> mettre a jour ou redirect /login
3. Navigation filtree par niveau de role
4. SignOut : supabase.auth.signOut() + redirect /login
```

---

## Points d'attention / Dettes techniques

1. **Incoherence mot de passe** : L'inscription valide 6 caracteres minimum, mais le reset et l'API changement de mot de passe exigent 8 caracteres. A harmoniser sur 8.

2. **Niveau admin dans le layout** : `middleware.ts` definit admin = 6, mais `app/(protected)/layout.tsx` definit admin = 5. Peut causer des incoherences de navigation.

3. **Remember Me non fonctionnel** : La checkbox "Se souvenir de moi" est affichee sur le formulaire de connexion mais n'a aucun effet (pas de localStorage, sessions gerees par cookies Supabase).

4. **Erreur callback non affichee** : Le parametre `?error=auth_callback_error` n'est pas lu ni affiche sur la page `/login`.

5. **Nouveau role toujours "commercial"** : L'inscription met systematiquement `role: "commercial"`. L'elevation de role doit etre faite manuellement en BDD par un administrateur.

6. **`getScopeFilter()` incomplet** : Pour `chef_ventes`, `dir_marque`, `dir_plaque`, retourne `null` (s'appuie uniquement sur le RLS Supabase). Peut etre fragile si les policies RLS ne sont pas parfaitement configurees.

7. **Pas d'invalidation de session** : Aucun mecanisme de revocation de session active. Si un utilisateur est desactive (`is_active: false`), il peut rester connecte jusqu'a expiration du cookie.
