# Module : Fiches de Marge (Calculateur)

## Resume metier

Coeur fonctionnel de l'application. Permet aux commerciaux de calculer la marge et la commission sur chaque vente de vehicule. Supporte trois types de vehicules (VO, VN/VP, VU) avec des regles de commission distinctes, un systeme de bonus complexe (financement, packs, accessoires, vehicules electriques), et un audit trail complet de chaque modification.

---

## Architecture des donnees

### Table `fiches_marge`

#### Champs d'identification

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID | Cle primaire |
| `user_id` | UUID | Commercial (auto-assigne) |
| `concession_id` | UUID | Concession (auto-assigne depuis profil) |
| `date` | string | Date de la vente (format `YYYY-MM-DD`) |
| `vehicle_number` | string? | Numero du vehicule |
| `seller_name` | string? | Nom du vendeur |
| `client_name` | string? | Nom du client |
| `vehicle_sold_name` | string? | Nom du vehicule vendu |
| `vehicle_type` | enum | `VO`, `VP`, `VU` (VP affiche comme "VN") |
| `status` | enum | `draft`, `submitted`, `approved`, `rejected` |

#### Champs de prix

| Champ | Type | Default |
|-------|------|---------|
| `purchase_price_ht` | number? | null |
| `purchase_price_ttc` | number? | null |
| `selling_price_ht` | number? | null |
| `selling_price_ttc` | number? | null |
| `trade_in_value_ht` | number? | null |
| `listed_price_ttc` | number? | null |

#### Champs de couts

| Champ | Type | Default |
|-------|------|---------|
| `warranty_12months` | number | 0 |
| `workshop_transfer` | number | 0 |
| `preparation_ht` | number | 0 |

#### Resultats calcules

| Champ | Type | Description |
|-------|------|-------------|
| `initial_margin_ht` | number? | Marge initiale avant couts |
| `remaining_margin_ht` | number? | Marge apres deduction des couts |
| `seller_commission` | number? | Commission totale du vendeur |
| `final_margin` | number? | Marge nette (remaining - commission) |
| `commission_details` | JSONB | Detail de chaque composante de commission |

#### Flags et options

| Champ | Type | Default | Description |
|-------|------|---------|-------------|
| `is_electric_vehicle` | boolean | false | Vehicule electrique (multiplicateur x1.5) |
| `has_financing` | boolean | false | Vente financee |
| `financed_amount_ht` | number? | null | Montant finance HT |
| `financing_type` | enum? | null | `principal` ou `specific` |
| `number_of_services_sold` | int | 0 | 0-3 services vendus |
| `is_other_stock_cession` | boolean | false | Cession de stock (VO uniquement) |

#### Champs VO specifiques

| Champ | Type | Description |
|-------|------|-------------|
| `purchase_date` | string? | Date d'achat (format ISO) |
| `order_date` | string? | Date de commande |

#### Champs VP/VN specifiques

| Champ | Type | Description |
|-------|------|-------------|
| `vp_sales_type` | string? | Type de vente (3 categories) |
| `vp_model` | string? | Modele du vehicule (12 modeles Ford) |
| `vn_options` | array | Options VN `[{ label, amountHT, amountTTC }]` |
| `vn_discounts` | array | Remises VN `[{ label, amountHT, amountTTC }]` |
| `vn_ford_recovery` | JSONB | `{ primeConstructeur?, aideReprise?, bonusEcologique? }` |

#### Champs VU specifiques

| Champ | Type | Description |
|-------|------|-------------|
| `vu_details` | JSONB | `{ margeFixeVehiculeOptions, margeFordPro, margeRepresentationMarque, margeAccessoiresAmenagesVU, assistanceConstructeur, remiseConsentie }` |

#### Champs services/packs

| Champ | Type | Default |
|-------|------|---------|
| `delivery_pack_sold` | enum | `none` / `pack1` / `pack2` / `pack3` |
| `is_high_penetration_rate` | boolean | false |
| `cld_ford_duration` | enum | `none` / `3-4` / `5+` |
| `has_maintenance_contract` | boolean | false |
| `has_coyote` | boolean | false |
| `coyote_duration` | enum | `none` / `24` / `36` / `48` |
| `has_accessories` | boolean | false |
| `accessory_amount_ht` | number | 0 |
| `accessory_amount_ttc` | number | 0 |

### Table `fiche_marge_history` (audit trail)

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID | Cle primaire |
| `fiche_marge_id` | UUID | Reference a la fiche |
| `user_id` | UUID | Utilisateur ayant fait l'action |
| `action` | enum | `INSERT`, `UPDATE`, `DELETE` |
| `before_data` | JSONB | Etat avant modification |
| `after_data` | JSONB | Etat apres modification |
| `changed_fields` | JSONB | Liste des champs modifies |
| `created_at` | timestamp | Date de l'action |

---

## Fichiers cles

| Fichier | Role |
|---------|------|
| `lib/margin-utils.ts` | Moteur de calcul (toutes les formules, ~636 lignes) |
| `lib/validations/fiches-marge.ts` | Schemas Zod (creation + mise a jour) |
| `lib/pdf/fiche-marge.ts` | Generation PDF (jspdf + autotable) |
| `app/api/fiches-marge/route.ts` | GET (liste paginee) + POST (creation) |
| `app/api/fiches-marge/[id]/route.ts` | GET/PUT/DELETE par ID |
| `app/api/fiches-marge/[id]/history/route.ts` | GET historique audit |
| `hooks/use-fiches-marge.ts` | `useFichesMarge()`, `saveFicheMarge()` |
| `components/margin-calculator.tsx` | Formulaire calculateur (~1242 lignes) |
| `components/margin-sheet-preview.tsx` | Apercu de la fiche |
| `components/printable-margin-sheet.tsx` | Version imprimable (CSS print) |
| `components/margin-history.tsx` | Historique des fiches |
| `app/(protected)/calculator/page.tsx` | Page calculateur |

---

## Flux principaux

### Calcul de marge — Logique generale (`calculateMarginSheet`)

```
1. Determiner les prix HT (achat et vente)
   - Mode VN : prix cle-en-main HT + prix depart HT
   - Mode Cession VO : marge fixe 1800 EUR TTC (1500 EUR HT)
   - Mode Standard (VO/VU) : conversion TTC -> HT via /1.2

2. Calculer la marge initiale HT
   - Standard : sellingPriceHT - purchasePriceHT
   - VN : departurePriceHT * 5% + options - remises + recovery Ford

3. Deduire les couts -> marge restante HT
   = initialMarginHT - warranty - workshop - preparation - tradeInValue

4. Calculer la commission vendeur (somme de tous les bonus)

5. Marge finale = marge restante - commission vendeur
```

### Formules de commission par type de vehicule

#### VO (Vehicule d'Occasion)

```
Base          = 80 EUR
+ Bonus <60j  = 30 EUR (si commande < 60 jours apres achat)
+ Bonus prix  = 30 EUR (si vente >= prix affiche)
+ Bonus finan = 30 EUR (si finance)
= sous-total VO

Si vehicule electrique : sous-total * 1.5
```

#### VP/VN (Vehicule Neuf)

```
Commission = payplan.vpCommissions[typeVente][modele]

3 types de vente :
  - "PART/VD/Prof Lib/Societe" (commissions les plus elevees)
  - "Vente Captive Ford Lease" (moyennes)
  - "GC/Loueurs LLD ou LCD" (les plus basses)

12 modeles : Carline, Tourneo Courier, Puma, Puma Gen-E, Focus,
  Kuga, Explorer, Capri, Mach-E, Tourneo Connect, Mustang, Ranger

Marge VN = departurePriceHT * 5% (fixe)
```

#### VU (Vehicule Utilitaire)

```
margeRestante = margeFixe + fordPro + representationMarque
              + accessoiresAmenages + assistanceConstructeur - remise
Commission VU = margeRestante * 13%
```

### Bonus transversaux (tous types)

#### Financement

```
Condition : financedAmountHT > 5000.83 EUR HT (6001 EUR TTC)

Taux selon type + nombre de services :
  Principal : 0.45% / 0.85% / 1.00% (1/2/3 services)
  Specific  : 0.10% / 0.30% / 0.45% (1/2/3 services)

Bonus = financedAmountHT * taux

Bonus additionnels :
  + Credit-bail VN     : montant * 0.2%
  + LOA VO             : montant * 0.3%
  + ID Ford 25 mois    : montant * 0.2%
  + LLD Pro Ford Lease : 30 EUR (fixe)
```

#### Packs livraison

```
Normal          : pack1=0, pack2=20, pack3=35
Haute penetration : pack1=0, pack2=20, pack3=35
```

#### CLD Ford

```
Normal          : 3-4 ans = 10 EUR, 5+ ans = 20 EUR
Haute penetration : 3-4 ans = 20 EUR, 5+ ans = 50 EUR
```

#### Contrat maintenance

```
Normal = 20 EUR, Haute penetration = 50 EUR
```

#### Coyote

```
24 mois = 30 EUR, 36 mois = 40 EUR, 48 mois = 50 EUR
```

#### Accessoires (paliers)

```
50-250 EUR TTC  -> 10 EUR bonus
251-800 EUR TTC -> 50 EUR bonus
801+ EUR TTC    -> 75 EUR bonus
```

### Flux de sauvegarde

```
Formulaire -> handleCalculate() -> calculateMarginSheet(inputs, payplan)
  -> Afficher resultats
  -> handleSave() -> POST /api/fiches-marge
  -> Trigger BDD -> fiche_marge_history (INSERT automatique)
```

### Autorisations CRUD

| Action | Qui peut | Condition |
|--------|----------|-----------|
| Creer | Tout utilisateur connecte | Auto-assigne user_id + concession_id |
| Lire | Proprietaire ou manager | Filtre par RLS |
| Modifier | Proprietaire | Seulement si `status = 'draft'` |
| Modifier | Chef des ventes | Tout statut |
| Supprimer | Proprietaire | Seulement si `status = 'draft'` |

### Export PDF

```
import() dynamique de jspdf (pas d'import statique — optimisation bundle)
generateFicheMargePDF(data) -> document PDF avec :
  - En-tete : titre + date + type
  - Infos vehicule/client
  - Detail des prix
  - Options & services
  - Resume : revenus, couts, marge brute, commission, marge nette
  - Signatures vendeur + direction
```

---

## Points d'attention / Dettes techniques

1. **VP = VN en affichage** : Le `vehicle_type` en BDD est `VP`, mais il est affiche comme "VN" dans toute l'UI. Le mapping se fait dans plusieurs endroits (`const dept = vt === 'VP' ? 'VN' : vt`). Ne jamais changer la valeur en BDD.

2. **Cession de stock** : Logique speciale VO uniquement. Marge fixe 1800 EUR TTC, aucun cout deduit, prix d'achat mis a 0. Le flag `is_other_stock_cession` controle ce mode.

3. **TVA hardcodee a 20%** : `VAT_RATE = 0.2` dans `margin-utils.ts` ligne 3. Pas paramettrable par concession.

4. **Payplan par defaut hardcode** : `getDefaultPayplan()` retourne un payplan Ford complet en dur. En production, le payplan doit venir de la BDD via `/api/payplan`.

5. **Type `(doc as any).lastAutoTable`** : 3 occurrences dans `lib/pdf/fiche-marge.ts` — le plugin jspdf-autotable n'expose pas ses types. Techniquement correct mais signale en lint.

6. **Fichier calculateur massif** : `margin-calculator.tsx` fait ~1242 lignes. Un refactoring en sous-composants (un par etape) ameliorerait la maintenabilite.

7. **Auto-conversion HT/TTC** : Les options et remises VN convertissent automatiquement HT <-> TTC quand un seul est saisi. Attention aux arrondis en cascade.

8. **Historique via trigger BDD** : L'audit trail est gere par un trigger PostgreSQL, pas par le code applicatif. Les entrees d'historique sont lues via `/api/fiches-marge/[id]/history`.
