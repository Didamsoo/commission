# Module : Rapports & Exports

## Resume metier

Systeme de generation de rapports et d'export de donnees pour tous les niveaux hierarchiques. Les rapports aggregent les donnees de ventes, marges et financement avec filtrage temporel et par type de vehicule. Les exports sont disponibles en Excel (XLSX) et CSV. L'export PDF est gere separement pour les fiches de marge individuelles (voir module 02).

---

## Architecture des donnees

### Endpoint API rapports : `GET /api/rapports`

#### Parametres

| Parametre | Type | Default | Description |
|-----------|------|---------|-------------|
| `type` | enum | `ventes` | `ventes`, `marges`, `financement` |
| `startDate` / `date_from` | string? | — | Date debut (ISO) |
| `endDate` / `date_to` | string? | — | Date fin (ISO) |
| `vehicle_type` | string? | — | Filtre par VP/VO/VU |
| `group_by` | enum? | — | `user`, `vehicle_type`, `date` |

#### Rapport "Ventes" (`type=ventes`)

Agregation par `group_by` :
```
{
  totalSales: number,       // COUNT(fiches)
  totalRevenue: number,     // SUM(selling_price_ht)
  totalMargin: number,      // SUM(final_margin)
  totalCommission: number,  // SUM(seller_commission)
  // + breakdown par groupe
}
```
Tri : par `totalMargin` descendant.

#### Rapport "Marges" (`type=marges`)

Breakdown par `vehicle_type` :
```
{
  vehicleType: string,
  totalMargin: number,
  avgMargin: number,        // totalMargin / count
  count: number
}
```

#### Rapport "Financement" (`type=financement`)

```
{
  totalSales: number,
  financedCount: number,    // COUNT(has_financing=true)
  financingRate: number     // (financedCount / totalSales) * 100
}
```

### Donnees d'export (`lib/excel/rapports.ts`)

#### Structure `ExportTeamMember`

```typescript
{
  rang: number,          // Classement
  nom: string,           // Nom complet
  ventes: number,        // Nombre de ventes
  objectif: number,      // Objectif
  taux: string,          // "95%" (formatte)
  marge: string,         // "12 500 EUR" (formatte)
  gpu: string,           // "2 500 EUR" (formatte)
  financement: string    // "78%" (formatte)
}
```

#### Structure `ExportRapportData`

```typescript
{
  title: string,
  period: string,
  teamMembers: ExportTeamMember[],
  kpis?: {
    totalSales: number,
    totalMargin: number,
    avgGPU: number,
    financingRate: number,
    objectiveRate: number
  }
}
```

### Config statique des templates (`lib/config/report-templates.ts`)

#### Rapports exemples

| Titre | Type | Format | Taille |
|-------|------|--------|--------|
| Rapport Board Q1 2024 | board | PDF | 2.4 MB |
| P&L Consolide Fevrier 2024 | financial | Excel | 1.8 MB |
| Performance Commerciale S07 | sales | PDF | 856 KB |
| Benchmark Concurrents | market | PPTX | 5.2 MB |
| Rapport RH - Effectifs | hr | Excel | generating |

#### Templates de generation

| Nom | Frequence | Icone |
|-----|-----------|-------|
| Rapport Board | Trimestriel | FilePieChart |
| P&L Mensuel | Mensuel | FileSpreadsheet |
| Performance Ventes | Hebdomadaire | FileBarChart |
| Analyse Marche | Mensuel | BarChart3 |

---

## Fichiers cles

| Fichier | Role |
|---------|------|
| `app/api/rapports/route.ts` | GET rapports avec filtres |
| `lib/excel/rapports.ts` | `exportToExcel()`, `exportToCSV()` |
| `lib/config/report-templates.ts` | Templates et rapports exemples |
| `hooks/use-rapports.ts` | `useRapports(type?, filters?)` |
| `app/(protected)/chef-ventes/rapports/page.tsx` | Rapports chef des ventes |
| `app/(protected)/direction/reports/page.tsx` | Rapports direction concession |
| `app/(protected)/marque/reports/page.tsx` | Rapports direction marque |
| `app/(protected)/groupe/reports/page.tsx` | Rapports direction groupe |

---

## Flux principaux

### Generation de rapport

```
1. Page de rapports charge les donnees :
   - useDashboard(role) -> KPIs + performanceHistory
   - useRapports(type, filters) -> donnees detaillees (optionnel)

2. Affichage :
   - KPI cards en en-tete
   - Graphiques (SalesTrendChart, MarginChart, FinancingChart)
   - Tableau de performance equipe/membres
   - Cards de resume (meilleur commercial, taux objectif, bonus)

3. Export :
   - Bouton Excel -> exportToExcel(data)
   - Bouton CSV -> exportToCSV(data, period)
   - Bouton PDF -> placeholder (non implemente pour les rapports)
```

### Export Excel

```
1. Import dynamique de 'xlsx' (pas d'import statique)
2. Creer un workbook XLSX
3. Feuille 1 : "Indicateurs" (KPIs en tableau)
4. Feuille 2 : "Performance Equipe" (membres en tableau)
5. Generer le fichier binaire
6. Telecharger : rapport-{period}-{timestamp}.xlsx
```

### Export CSV

```
1. Import dynamique de 'xlsx'
2. Creer une feuille unique avec en-tetes
3. Generer le fichier CSV
4. Telecharger : {period}-{timestamp}.csv
```

### Rapports par role

#### Chef des ventes (`/chef-ventes/rapports`)
- KPIs : ventes totales, marge totale, taux financement, GPU moyen
- Graphiques : evolution 6 mois (ventes, marge, financement)
- Tableau : classement commerciaux avec rang, ventes, objectif, taux, marge, GPU, financement, tendance
- Export : Excel + CSV

#### Direction concession (`/direction/reports`)
- KPIs : ventes (+ growth%), marge k EUR (+ growth%), commissions k EUR (+ growth%), taux financement
- 4 onglets : Vue d'ensemble, Performance, Vehicules, Financement
- Onglet Vehicules : repartition VN/VO/VU (ventes + marge)
- Onglet Financement : taux circulaire SVG, impact sur marge

#### Direction marque (`/marque/reports`)
- Rapports statiques (board, benchmark, stocks, objectifs constructeur)
- Templates de generation avec selection de marque

#### Direction groupe (`/groupe/reports`)
- 3 onglets : Rapports, Templates, Planifies
- Templates personnalises : selection periode + marque + format (PDF/Excel/PPTX)
- Rapports planifies : board trimestriel, P&L mensuel, performance hebdomadaire

---

## Points d'attention / Dettes techniques

1. **Import dynamique `xlsx`** : La librairie xlsx est importee via `import()` au moment de l'export, pas au chargement de la page. Ne jamais convertir en import statique (impacterait le bundle de ~138 kB).

2. **Rapports direction marque et groupe statiques** : Les pages `/marque/reports` et `/groupe/reports` affichent des rapports exemples et templates hardcodes. Les boutons "Generer" sont des placeholders sans logique d'execution.

3. **Pas d'export PDF pour les rapports** : Seules les fiches de marge individuelles ont un export PDF (`lib/pdf/fiche-marge.ts`). Les rapports agreges n'ont pas de generation PDF.

4. **Croissance (growth%) calculee cote client** : Dans `/direction/reports/page.tsx`, la fonction `pct(current, previous)` calcule la croissance en comparant mois courant vs precedent. Ce calcul devrait idealement etre fait cote API.

5. **Donnees non paginee** : L'API `/api/rapports` ne supporte pas la pagination. Pour un grand volume de donnees, cela pourrait poser des problemes de performance.

6. **Rapports planifies non fonctionnels** : L'onglet "Planifies" dans `/groupe/reports` affiche des rapports programmes (chaque lundi, chaque mois) mais il n'y a aucun mecanisme de cron ou de generation automatique implemente.
