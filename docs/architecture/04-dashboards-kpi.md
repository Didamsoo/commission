# Module : Dashboards & KPI

## Resume metier

Cinq tableaux de bord role-specifiques aggregeant les indicateurs de performance en temps reel. Chaque role voit des KPI adaptes a son perimetre : le commercial suit ses ventes, le chef des ventes compare ses equipes, la direction concession analyse les departements, la direction marque benchmarke les concessions, et la direction groupe consolide les marques.

---

## Architecture des donnees

### Endpoint unique : `GET /api/dashboard/[role]`

Le parametre `[role]` determine la fonction de calcul appelee :
- `commercial` -> `getCommercialDashboard()`
- `chef_ventes` -> `getChefVentesDashboard()`
- `dir_concession` -> `getDirConcessionDashboard()`
- `dir_marque` -> `getDirMarqueDashboard()`
- `dir_plaque` -> `getDirPlaqueDashboard()`

### Parametres communs

| Parametre | Type | Description |
|-----------|------|-------------|
| `period` | string? | Periode predafinie |
| `startDate` | string? | Date debut (ISO) |
| `endDate` | string? | Date fin (ISO) |

### KPI par role

#### Commercial (N1)

| KPI | Formule | Source |
|-----|---------|--------|
| `totalSales` | COUNT(fiches) WHERE status != 'draft' | fiches_marge |
| `salesTarget` | SUM(equipes.objective.monthly_target) | equipes (JSONB) |
| `totalMargin` | SUM(final_margin) | fiches_marge |
| `totalCommission` | SUM(seller_commission) | fiches_marge |
| `totalRevenue` | SUM(selling_price_ht) | fiches_marge |
| `financingRate` | (COUNT(has_financing=true) / totalSales) * 100 | fiches_marge |
| `avgGPU` | totalMargin / totalSales | calcule |
| `pendingApprovals` | COUNT(status='submitted') | fiches_marge |

Donnees supplementaires : `activeP2PChallenges`, `unreadNotifications`, `performanceHistory` (6 mois)

#### Chef des ventes (N2)

| KPI | Formule | Source |
|-----|---------|--------|
| `teamSales` | COUNT(fiches) pour tous les membres | fiches_marge + profiles |
| `teamMargin` | SUM(final_margin) equipe | fiches_marge |
| `teamRevenue` | SUM(selling_price_ht) equipe | fiches_marge |
| `teamFinancingRate` | % de fiches financees | fiches_marge |
| `pendingApprovals` | COUNT(approbations status='pending') | approbations |

Donnees supplementaires : `equipes`, `siblingTeams` (equipes meme concession avec rate%), `performanceHistory`

#### Direction concession (N3)

| KPI | Formule | Source |
|-----|---------|--------|
| `totalSales` | COUNT(fiches) de la concession | fiches_marge |
| `totalMargin` | SUM(final_margin) concession | fiches_marge |
| `totalRevenue` | SUM(selling_price_ht) concession | fiches_marge |
| `teamCount` | COUNT(equipes) dans la concession | equipes |
| `staffCount` | COUNT(profiles actifs) | profiles |

Donnees supplementaires : `departmentStats` (breakdown VN/VO/VU avec sales, revenue, margin, avgGPU, financingRate)

#### Direction marque (N4)

| KPI | Formule | Source |
|-----|---------|--------|
| `totalSales` | COUNT(fiches) toutes concessions de la marque | fiches_marge |
| `totalMargin` | SUM(final_margin) marque | fiches_marge |
| `totalRevenue` | SUM(selling_price_ht) marque | fiches_marge |
| `sitesCount` | COUNT(concessions) de la marque | concessions |

Donnees supplementaires : `concessions` (liste), `performanceHistory`

#### Direction plaque (N5)

| KPI | Formule | Source |
|-----|---------|--------|
| `totalSales` | COUNT(fiches) tout le groupe | fiches_marge |
| `totalMargin` | SUM(final_margin) groupe | fiches_marge |
| `totalRevenue` | SUM(selling_price_ht) groupe | fiches_marge |
| `brandsCount` | COUNT(marques) | marques |
| `sitesCount` | COUNT(concessions) | concessions |

Donnees supplementaires : `marques`, `concessions`, `performanceHistory`, `perBrandHistory` (historique par marque)

### `performanceHistory` — Structure commune

```typescript
{
  period: "YYYY-MM",      // Cle du mois
  label: "Jan",           // Label court francais
  sales: number,          // Nombre de ventes
  target: 0,              // Enrichi par l'appelant
  margin: number,         // Marge totale
  financingRate: number   // Taux de financement %
}
```

Toujours les 6 derniers mois, calcule par `buildPerformanceHistory()`.

### Helpers partages (`lib/utils/kpi-helpers.ts`)

#### `computeTrend(current, previous)`

```
Si previous = 0 -> retourne 0
Sinon -> Math.round(((current - previous) / previous) * 100)
```

#### `deriveBrandKPIs(dealerships, perfHistory?)`

Agregation des KPI d'une marque depuis ses concessions :

```typescript
BrandKPIs = {
  volume:   { current, target, objectiveRate, trend },
  margin:   { total, target (total*1.05), avgGPU, trend },
  financing:{ rate, target: 75, trend },
  satisfaction: { nps, target: 85, trend: 0 },
  stock:    { avgDays, target: 45, totalUnits },
  constructorBonus: { estimated: 125000, volumeAchieved, financingAchieved, satisfactionAchieved }
}
```

### Types d'affichage (`lib/types/display.ts`)

#### `displayValue(value, formatter?)`

```
Si value = 0 -> retourne "N/A"
Sinon -> formatter(value) ou String(value)
```

#### `mapMarqueToBrand(raw)` -> `BrandDisplayData`

Calcule : `objectiveRate`, `avgGPU`, `trend` (>5% = up, <-5% = down, sinon stable)

#### `mapConcessionToDealership(raw)` -> `DealershipDisplayData`

Genere des alertes automatiques :
- `objectiveRate < 90%` -> alerte critique "Objectif VN a risque"
- `stockDays > 50` -> alerte warning "Stock > XX jours"
- `financingRate < 70%` -> alerte warning "Taux financement bas"

---

## Fichiers cles

| Fichier | Role |
|---------|------|
| `app/api/dashboard/[role]/route.ts` | 5 fonctions dashboard + `buildPerformanceHistory()` |
| `lib/utils/kpi-helpers.ts` | `deriveBrandKPIs()`, `computeTrend()` |
| `lib/types/display.ts` | `displayValue()`, `mapMarqueToBrand()`, `mapConcessionToDealership()` |
| `lib/config/static-data.ts` | `stockInfo`, `plCostLines` (config statique) |
| `hooks/use-dashboard.ts` | `useDashboard(role)` |
| `components/charts/sales-trend-chart.tsx` | BarChart ventes vs objectif |
| `components/charts/margin-chart.tsx` | AreaChart evolution marge |
| `components/charts/financing-chart.tsx` | BarChart taux financement |
| `app/(protected)/dashboard/page.tsx` | Dashboard commercial |
| `app/(protected)/chef-ventes/page.tsx` | Dashboard chef des ventes |
| `app/(protected)/direction/page.tsx` | Dashboard direction concession |
| `app/(protected)/marque/page.tsx` | Dashboard direction marque |
| `app/(protected)/groupe/page.tsx` | Dashboard direction groupe |

---

## Flux principaux

### Chargement d'un dashboard

```
1. Page monte -> useDashboard(role)
2. Hook appelle GET /api/dashboard/{role}?period=...&startDate=...&endDate=...
3. API :
   a. getAuthenticatedUser()
   b. Verifier niveau de role >= role demande
   c. Construire dateFrom/dateTo depuis les parametres
   d. Requetes Supabase paralleles (fiches, equipes, defis, notifications...)
   e. Agreger les KPI
   f. buildPerformanceHistory(fichesHistoriques) -> 6 mois
   g. Retourner { kpis, performanceHistory, ... }
4. UI affiche stats, graphiques, listes
```

### Mapping VP -> VN (departements)

```
vehicle_type === 'VP' -> departement = 'VN'
vehicle_type === 'VO' -> departement = 'VO'
vehicle_type === 'VU' -> departement = 'VU'
```

### Sales target (objectif de ventes)

```
1. Requeter equipes.objective (JSONB) pour la concession
2. Extraire monthly_target de chaque equipe
3. Sommer tous les monthly_target
4. Fallback : si somme = 0 et totalSales > 0 -> totalSales * 1.1
```

---

## Points d'attention / Dettes techniques

1. **Valeurs hardcodees dans `deriveBrandKPIs()`** :
   - Objectif financement : 75% (fixe)
   - Objectif satisfaction : 85 NPS (fixe)
   - Objectif stock : 45 jours (fixe)
   - Bonus constructeur estime : 125 000 EUR (fixe)
   - Objectif marge : totalMargin * 1.05 (+5%)

2. **`satisfaction` et `stock_days` sans source de donnees** : Toujours 0 en BDD, affiches "N/A" via `displayValue()`. Necessitent une integration DMS pour avoir des vraies valeurs.

3. **`market_share` calcule uniquement au niveau groupe** : Pour les marques individuelles, toujours 0 sauf dans `/api/marques` (second pass).

4. **Precision `financingRate`** : `Math.round(rate * 10) / 10` -> 1 decimale. Coherent entre tous les dashboards.

5. **Historique performance toujours 6 mois** : Le champ `target` dans performanceHistory est initialise a 0 et doit etre enrichi par le code appelant (pas toujours fait).

6. **`perBrandHistory`** seulement pour dir_plaque : Historique par marque uniquement disponible au niveau groupe. Les autres niveaux n'ont que l'historique global.

7. **Badges mock dans le dashboard commercial** : `recentBadges` est un tableau statique (commentaire "no badges_utilisateur API yet"). Pas connecte a la BDD.

8. **Graphiques placeholder** :
   - `PerformanceHistoryMock()` dans la page detail commercial (donnees hardcodees)
   - `RadarChartMock()` dans le benchmark marque (donnees calculees mais pas d'API dediee)
   - Historique synthetique dans les pages marque et groupe (pas d'endpoint d'historique reel)
