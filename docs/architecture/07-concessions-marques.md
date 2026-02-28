# Module : Concessions & Marques

## Resume metier

Gestion de la structure organisationnelle du groupe automobile. Les **concessions** sont les points de vente physiques, chacune rattachee a une **marque**. Les marques sont regroupees au niveau du **groupe**. Ce module gere le listing, l'enrichissement statistique, le switching multi-concessions, et le benchmark entre entites.

---

## Architecture des donnees

### Table `concessions`

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID | Cle primaire |
| `name` | string | Nom de la concession |
| `code` | string | Code interne |
| `city` | string | Ville |
| `address` | string | Adresse complete |
| `marque_id` | UUID | Marque de rattachement |
| `settings` | JSONB | `{ phone?, email?, website?, hours?, logo?, color? }` |
| `created_at` | timestamp | Date creation |

### Table `marques`

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID | Cle primaire |
| `name` | string | Nom de la marque |
| `logo_url` | string? | URL du logo |
| `settings` | JSONB | `{ logo?, color? }` — logo unicode/emoji, couleur gradient Tailwind |
| `constructor_targets` | JSONB? | Objectifs constructeur |
| `created_at` | timestamp | Date creation |

### Table `user_concessions` (multi-concessions)

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID | Cle primaire |
| `user_id` | UUID | Utilisateur |
| `concession_id` | UUID | Concession |
| `is_active` | boolean | Concession actuellement active |
| `role` | string | Role dans cette concession |
| `granted_at` | timestamp | Date d'attribution |

### Donnees enrichies (calculees par l'API)

#### Concession enrichie (retour de `/api/concessions/list`)

```typescript
{
  // Champs BDD
  id, name, code, city, address, settings,

  // Enrichissement directeur
  director_id, director_name, director_avatar,

  // KPI calcules depuis fiches_marge (status='approved')
  total_sales: number,          // COUNT(fiches)
  sales_target: number,         // SUM(equipes.objective.monthly_target) ou totalSales*1.1
  total_revenue: number,        // SUM(selling_price_ht)
  total_margin: number,         // SUM(final_margin)
  financing_rate: number,       // % de has_financing=true
  avgGPU: number,               // totalMargin / totalSales

  // Placeholders (pas de source BDD)
  satisfaction: 0,
  stock_days: 0,

  // Croissance mois courant vs mois precedent
  growth: number,               // ((current - prev) / prev) * 100

  // Repartition par departement
  departments: {
    vn: { sales, target, margin },
    vo: { sales, target, margin },
    vu: { sales, target, margin }
  }
}
```

#### Marque enrichie (retour de `/api/marques`)

```typescript
{
  // Champs BDD
  id, name, logo_url, settings,

  // Enrichissement
  director_id, director_name,
  dealership_count: number,     // COUNT(concessions)
  employee_count: number,       // COUNT(profiles actifs)

  // KPI (agreges depuis toutes les concessions)
  total_sales, sales_target, total_revenue, total_margin,
  financing_rate, avgGPU,
  satisfaction: 0,              // Placeholder
  market_share: number,         // (brand_sales / group_total) * 100
  quarterly_growth: number      // 3 derniers mois vs 3 precedents
}
```

---

## Fichiers cles

| Fichier | Role |
|---------|------|
| `app/api/concessions/list/route.ts` | GET liste concessions enrichies (role >= dir_marque) |
| `app/api/concessions/current/route.ts` | GET/PUT concession courante (role >= dir_concession) |
| `app/api/concessions/switch/route.ts` | POST switch concession active (RPC Supabase) |
| `app/api/concessions/user-concessions/route.ts` | GET concessions de l'utilisateur |
| `app/api/marques/route.ts` | GET liste marques enrichies (role >= dir_plaque) |
| `app/api/marques/[id]/route.ts` | GET detail marque + concessions (role >= dir_marque) |
| `hooks/use-concessions-list.ts` | `useConcessionsList(marqueId?)`, `useConcessionDetail(id)` |
| `hooks/use-marques.ts` | `useMarques()`, `useMarqueDetail(id)` |
| `components/concession-switcher.tsx` | Dropdown de switch de concession |
| `lib/types/display.ts` | `mapConcessionToDealership()`, `mapMarqueToBrand()` |
| `app/(protected)/marque/concessions/page.tsx` | Liste concessions (dir_marque) |
| `app/(protected)/marque/concessions/[id]/` | Detail concession |
| `app/(protected)/marque/benchmark/page.tsx` | Benchmark inter-concessions |
| `app/(protected)/groupe/marques/page.tsx` | Liste marques (dir_plaque) |
| `app/(protected)/groupe/marques/[id]/` | Detail marque |

---

## Flux principaux

### Enrichissement des concessions (`/api/concessions/list`)

```
1. SELECT * FROM concessions (filtre par marque_id si dir_marque)
2. Pour CHAQUE concession (requetes paralleles) :
   a. Directeur : SELECT FROM profiles WHERE concession_id AND role='dir_concession'
   b. Fiches : SELECT FROM fiches_marge WHERE concession_id AND status='approved'
   c. Equipes : SELECT objective, type FROM equipes WHERE concession_id
   d. Ventes mois precedent : COUNT(fiches) du mois N-1

3. Calculs :
   - total_sales = count(fiches)
   - total_margin = sum(final_margin)
   - total_revenue = sum(selling_price_ht)
   - financing_rate = (count(has_financing=true) / total) * 100
   - avgGPU = total_margin / total_sales
   - sales_target = sum(equipes.objective.monthly_target) || totalSales * 1.1
   - growth = ((currentMonth - prevMonth) / prevMonth) * 100

4. Departements :
   VP -> 'vn', VO -> 'vo', VU -> 'vu'
   Pour chaque dept : { sales: count, target: equipe_target, margin: sum }
```

### Enrichissement des marques (`/api/marques`)

```
1. SELECT * FROM marques
2. Pour CHAQUE marque :
   a. COUNT concessions
   b. COUNT + SELECT profiles (employees + directeur)
   c. SELECT ids concessions
   d. SELECT fiches_marge WHERE concession_id IN [...] AND status='approved'
   e. Calcul quarterly_growth :
      - prevPeriod = count(fiches 6-3 mois)
      - currPeriod = count(fiches 3-0 mois)
      - growth = ((curr - prev) / prev) * 100
   f. SELECT equipes -> sales_target

3. Second pass : market_share = (brand_sales / groupTotalSales) * 100
```

### Switch de concession

```
1. Utilisateur clique dans le ConcessionSwitcher
2. POST /api/concessions/switch { concession_id }
3. Appel RPC Supabase : switch_active_concession(user_id, concession_id)
   - Verifie que l'utilisateur a acces a cette concession
   - Met a jour user_concessions.is_active
4. Le ConcessionSwitcher n'apparait que si l'utilisateur a 2+ concessions
```

### Benchmark inter-concessions (page marque)

```
1. Charger toutes les concessions de la marque via useConcessionsList()
2. Mapper vers DealershipDisplayData via mapConcessionToDealership()
3. Trier, filtrer, afficher :
   - Criteres : rang, ventes, marge, financement, satisfaction, stock
   - Filtres : tous, > 100%, 90-100%, < 90%
4. Radar chart (actuellement RadarChartMock) comparant une concession aux moyennes
```

### Alertes automatiques (`mapConcessionToDealership`)

```
if objectiveRate < 90%    -> { type: 'critical', message: "Objectif VN a risque" }
if stockDays > 50         -> { type: 'warning',  message: "Stock > XX jours" }
if financingRate < 70%    -> { type: 'warning',  message: "Taux financement bas (XX%)" }
```

### Logo et couleur des marques (fallbacks)

```
Logos par defaut :
  Ford -> "F", Nissan -> "N", Suzuki -> "S", etc.
  Fallback generique -> premiere lettre du nom

Couleurs par defaut :
  Ford -> "from-blue-500 to-blue-600"
  Nissan -> "from-red-500 to-red-600"
  Fallback -> "from-gray-500 to-gray-600"

Priorite : settings.logo/color > default par nom > fallback generique
```

---

## Points d'attention / Dettes techniques

1. **Requetes N+1** : `/api/concessions/list` et `/api/marques` font des requetes paralleles pour CHAQUE entite. Avec beaucoup de concessions/marques, cela peut devenir lent. Une approche avec des vues SQL serait plus performante.

2. **Sales target fallback** : `totalSales * 1.1` est utilise quand aucun `monthly_target` n'est defini dans les equipes. C'est un fallback temporaire qui peut donner des objectifs irrealistes.

3. **`satisfaction` et `stock_days` toujours a 0** : Pas de source de donnees en BDD. Affiches "N/A" via `displayValue()`. Necessite une integration DMS.

4. **`useConcessionDetail()` reference un endpoint inexistant** : Le hook appelle `/api/concessions/{id}/stats` qui n'existe pas. Retourne null ou 404.

5. **Growth calcule differemment** :
   - Concessions : mois courant vs mois precedent (MoM)
   - Marques : 3 derniers mois vs 3 mois precedents (QoQ)
   - Pas homogene entre les niveaux.

6. **`RadarChartMock`** dans la page benchmark : Le composant porte le nom "Mock" et calcule les moyennes a la volee. A remplacer par un vrai composant avec donnees API.

7. **RPC `switch_active_concession`** : Fonction PostgreSQL cote serveur. Le code n'est visible que dans Supabase, pas dans le repo. S'assurer qu'elle verifie bien les droits d'acces.

8. **Mapping VP -> VN** : Le mapping `vehicle_type === 'VP' ? 'VN' : vt` est fait a la fois dans `/api/concessions/list` et dans `/api/dashboard/[role]`. Duplique dans deux endroits.
