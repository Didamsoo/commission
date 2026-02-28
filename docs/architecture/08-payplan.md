# Module : Payplan (Grille de Commission)

## Resume metier

Le payplan definit les regles de remuneration variable des commerciaux : commissions de base par type de vehicule, bonus (financement, packs, accessoires, vehicules electriques), et paliers de performance. Chaque concession peut avoir son propre payplan. La page de configuration permet a la direction de visualiser et modifier les regles en temps reel.

---

## Architecture des donnees

### Table `payplans`

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID | Cle primaire |
| `concession_id` | UUID | Concession rattachee |
| `name` | string | Nom du payplan (default: "Payplan principal") |
| `config` | JSONB | Toute la configuration (voir detail ci-dessous) |
| `is_active` | boolean | Payplan actif (default: true) |
| `created_by` | UUID | Createur |
| `created_at` | timestamp | Date creation |

### Structure `config` (JSONB) — Schema Zod `payplanConfigSchema`

#### Compensation de base

| Champ | Type | Default | Description |
|-------|------|---------|-------------|
| `fixedSalary` | number | 1200 | Salaire fixe mensuel (EUR) |
| `baseCommissionVO` | number | 80 | Commission VO de base (EUR) |
| `bonus60DaysVO` | number | 30 | Bonus vente < 60 jours (EUR) |
| `bonusListedPriceVO` | number | 30 | Bonus vente >= prix affiche (EUR) |
| `electricVehicleMultiplierVO` | number | 1.5 | Multiplicateur vehicule electrique |
| `bonusFinancingVO` | number | 30 | Bonus financement VO (EUR) |

#### Commissions VP/VN

```
vpCommissions: Record<salesType, Record<model, number>>

Types de vente :
  "PART/VD/Prof Lib/Societe"
  "Vente Captive Ford Lease"
  "GC/Loueurs LLD ou LCD"

Modeles (12) :
  Carline, Tourneo Courier, Puma, Puma Gen-E, Focus,
  Kuga, Explorer, Capri, Mach-E, Tourneo Connect, Mustang, Ranger

Exemple : vpCommissions["PART/VD/Prof Lib/Societe"]["Puma"] = 80
```

#### Commission VU

| Champ | Type | Default | Description |
|-------|------|---------|-------------|
| `vuCommissionRate` | number | 0.13 | Taux commission VU (13% de la marge restante) |

#### Marge VN

| Champ | Type | Default | Description |
|-------|------|---------|-------------|
| `vnMarginPercentage` | number | 0.05 | Marge VN fixe (5% du prix depart) |

#### Financement

| Champ | Type | Default | Description |
|-------|------|---------|-------------|
| `financingMinAmount` | number | 5000.83 HT | Montant minimum pour bonus (6001 TTC / 1.2) |
| `financingRates.principal` | `{ service1, service2, service3 }` | 0.0045, 0.0085, 0.01 | Taux par nb services (type principal) |
| `financingRates.specific` | `{ service1, service2, service3 }` | 0.001, 0.003, 0.0045 | Taux par nb services (type specifique) |
| `financingBonus.creditBailVN` | number | 0.002 | Bonus credit-bail (0.2% du montant) |
| `financingBonus.loaVO` | number | 0.003 | Bonus LOA VO (0.3%) |
| `financingBonus.idFord25Months` | number | 0.002 | Bonus ID Ford 25 mois (0.2%) |
| `financingBonus.lldProFordLease` | number | 30 | Bonus LLD Pro (30 EUR fixe) |

#### Packs livraison

| Champ | Normal | Haute penetration |
|-------|--------|-------------------|
| `pack1` | 0 EUR | 0 EUR |
| `pack2` | 20 EUR | 20 EUR |
| `pack3` | 35 EUR | 35 EUR |

Stockes dans `packCommissions` et `packCommissionsHighPenetration`.

#### CLD Ford

| Duree | Normal | Haute penetration |
|-------|--------|-------------------|
| `3-4 ans` | 10 EUR | 20 EUR |
| `5+ ans` | 20 EUR | 50 EUR |

Stockes dans `cldCommissions` et `cldCommissionsHighPenetration`.

#### Contrat maintenance

| Mode | Commission |
|------|-----------|
| Normal | 20 EUR |
| Haute penetration | 50 EUR |

#### Coyote

| Duree | Commission |
|-------|-----------|
| 24 mois | 30 EUR |
| 36 mois | 40 EUR |
| 48 mois | 50 EUR |

#### Paliers accessoires

| Palier | Fourchette TTC | Bonus |
|--------|---------------|-------|
| Tier 1 | 50 - 250 EUR | 10 EUR |
| Tier 2 | 251 - 800 EUR | 50 EUR |
| Tier 3 | 801+ EUR | 75 EUR |

Stockes dans `accessoryTiers: { tier1: { min, max, bonus }, tier2: { min, max, bonus }, tier3: { min, bonus } }`.

---

## Fichiers cles

| Fichier | Role |
|---------|------|
| `app/api/payplan/route.ts` | GET (liste) + POST (creer) |
| `app/api/payplan/[id]/route.ts` | PUT (modifier) |
| `lib/validations/payplan.ts` | `payplanConfigSchema`, `createPayplanSchema`, `updatePayplanSchema` |
| `lib/margin-utils.ts` | `getDefaultPayplan()` — payplan Ford par defaut (hardcode) |
| `hooks/use-payplan.ts` | `usePayplan(concessionId?)` |
| `app/(protected)/direction/payplan/page.tsx` | Page de configuration (~943 lignes) |

---

## Flux principaux

### CRUD Payplan

```
GET /api/payplan?concession_id=XXX
  -> Liste des payplans (filtre optionnel par concession)
  -> Tri par created_at DESC

POST /api/payplan (role >= dir_concession)
  -> { concession_id, name, config, is_active }
  -> auto-set created_by = user connecte
  -> Retour 201

PUT /api/payplan/[id] (role >= dir_concession)
  -> { name?, config?, is_active? }
  -> Retour payplan mis a jour
```

### Page de configuration (`/direction/payplan`)

La page expose 4 onglets de configuration :

#### Onglet 1 : General

Fonctions de derivation depuis le config JSONB :

```
deriveRulesFromConfig(config) -> CommissionRule[]
  Extrait les regles : base-vo, base-vn, base-vu,
  bonus-financing, bonus-60days, bonus-listed-price,
  pack-livraison, cld, maintenance, coyote, accessoires
```

Affichage :
- Section "Commissions de base" : 3 regles (VO, VN marge 5%, VU 13%)
- Section "Bonus & Primes" : financement, 60 jours, prix affiche
- Section "Packs & Accessoires" : packs livraison, CLD, maintenance, coyote

#### Onglet 2 : Modeles

```
deriveVehicleModelsFromConfig(config) -> VehicleModel[]
  Extrait vpCommissions: { modelId, name, baseCommission }
```

Affichage : Tableau des 12 modeles avec commission par type de vente.

#### Onglet 3 : Accessoires

```
deriveAccessoryTiersFromConfig(config) -> AccessoryTier[]
  Extrait accessoryTiers: { label, range, bonus }
```

Affichage : Tableau 3 paliers.

#### Onglet 4 : Challenges

```
deriveChallengesFromConfig(config) -> ChallengeRule[]
  Derive de : financialPenetrationBonuses, financingBonus,
  maintenance contracts
  3 types : salesCount, financingRate, marginTarget
```

### Sauvegarde

```
1. buildConfigFromRules(rules) -> reconstruit le config JSONB
2. PUT /api/payplan/[id] { config: newConfig }
3. Gestion d'erreur + toast de confirmation
```

### Utilisation dans le calculateur

```
1. Page calculateur charge le payplan via usePayplan(concession_id)
2. Si aucun payplan en BDD -> getDefaultPayplan() (hardcode Ford)
3. Le payplan est passe a calculateMarginSheet(inputs, payplan)
4. Toutes les commissions sont calculees selon le payplan actif
```

---

## Points d'attention / Dettes techniques

1. **Payplan Ford hardcode** : `getDefaultPayplan()` dans `margin-utils.ts` contient un payplan complet Ford en dur (~150 lignes). C'est le fallback quand aucun payplan n'existe en BDD. Si on ajoute d'autres marques, il faudra des payplans specifiques.

2. **Config JSONB non type** : La config est un objet JSONB libre. La validation Zod est permissive (`.passthrough()` sur certains sous-schemas). Des champs inattendus peuvent etre stockes.

3. **Pas d'historique de modification** : Contrairement aux fiches de marge, les modifications du payplan ne sont pas auditees. Un changement de commission efface l'ancienne valeur sans trace.

4. **Un seul payplan actif par concession** : Le flag `is_active` existe mais le systeme ne verifie pas l'unicite. Plusieurs payplans peuvent etre actifs simultanement pour la meme concession.

5. **Page massive** : `direction/payplan/page.tsx` fait ~943 lignes avec les 4 onglets. Les fonctions `deriveXxxFromConfig()` melangent derivation de donnees et logique d'affichage.

6. **`financingMinAmount` calcule** : Le seuil est `6001 / 1.2 = 5000.83 EUR HT`. Ce calcul est fait dans `getDefaultPayplan()`, pas dans le schema — il n'y a pas de validation que la valeur stockee est coherente avec le taux de TVA.

7. **Pas de preview** : Modifier le payplan n'offre pas de simulation d'impact sur les fiches existantes. Le commercial ne voit le changement qu'au prochain calcul.
