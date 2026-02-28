# Module : Defis (Challenges)

## Resume metier

Systeme de gamification a deux volets. Les **defis plateforme** sont des challenges d'equipe crees par la hierarchie (chef des ventes, direction, marque, groupe) pour motiver les commerciaux avec des objectifs collectifs. Les **defis P2P** sont des duels 1-contre-1 entre commerciaux, avec mise en jeu, negociation, et declaration de vainqueur.

---

## Architecture des donnees

### Table `defis_plateforme`

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID | Cle primaire |
| `title` | string | Titre (3-200 caracteres) |
| `description` | string? | Description du defi |
| `scope_type` | enum | `individual`, `team`, `site`, `brand`, `group` |
| `target_level` | int | Niveau cible (1-5) |
| `challenge_type` | string | Type : `sales_count`, `revenue_target`, `margin_target`, `financing_rate`, `specific_model`, `volume`, `margin`, `financing`, `satisfaction`, `electric`, `market_share` |
| `target_value` | number | Objectif a atteindre (> 0) |
| `target_unit` | string? | Unite de mesure |
| `target_model_name` | string? | Modele specifique (si type = `specific_model`) |
| `start_date` | string | Date debut (ISO) |
| `end_date` | string | Date fin (ISO) |
| `reward` | JSONB | `{ type, value, description, badgeName?, badgeIcon? }` |
| `status` | enum | `draft`, `upcoming`, `active`, `completed`, `cancelled` |
| `created_by` | UUID | Createur |
| `creator_role` | string | Role du createur |
| `creator_level` | int | Niveau du createur |
| `created_at` | timestamp | Date creation |

### Table `defis_plateforme_participants`

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID | Cle primaire |
| `defi_id` | UUID | Reference au defi |
| `user_id` | UUID | Participant |
| `current_score` | number | Score actuel |
| `target_score` | number | Objectif individuel |
| `progress_rate` | number | Pourcentage de progression |
| `is_completed` | boolean | Objectif atteint |
| `ranking` | int? | Classement |

### Table `defis_p2p`

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID | Cle primaire |
| `challenger_id` | UUID | Initiateur du defi |
| `challenged_id` | UUID | Adversaire defie |
| `metric` | enum | `sales_count`, `revenue`, `margin`, `financing_count` |
| `duration_days` | int | Duree en jours (1-90) |
| `challenger_stake` | JSONB | `{ points, customReward, customRewardEmoji? }` |
| `challenged_stake` | JSONB | Idem |
| `status` | enum | `pending`, `negotiating`, `active`, `completed`, `declined`, `cancelled` |
| `end_date` | string? | Date de fin calculee |
| `challenger_final_score` | number? | Score final challenger |
| `challenged_final_score` | number? | Score final adversaire |
| `winner_id` | UUID? | Vainqueur |
| `is_draw` | boolean? | Match nul |
| `negotiation` | JSONB? | `{ messages: NegotiationMessage[], currentOffer: { stake, durationDays } }` |
| `created_at` | timestamp | Date creation |
| `updated_at` | timestamp | Date mise a jour |

### Types de recompenses (defis plateforme)

| Type | Description | Valeur |
|------|-------------|--------|
| `bonus` | Prime monetaire | Montant en EUR |
| `badge` | Badge gamification | Nom + icone emoji |
| `points` | Points de classement | Nombre de points |
| `recognition` | Reconnaissance publique | Description texte |

---

## Fichiers cles

| Fichier | Role |
|---------|------|
| `app/api/defis/route.ts` | CRUD defis plateforme |
| `app/api/defis-p2p/route.ts` | CRUD defis P2P |
| `lib/validations/defis.ts` | Schemas Zod : `createDefiSchema`, `updateDefiSchema` |
| `lib/validations/defis-p2p.ts` | Schemas Zod : `createDefiP2PSchema`, `updateDefiP2PSchema` |
| `lib/p2p-utils.ts` | `isChallenger()`, `isChallenged()`, `didUserWin()` |
| `hooks/use-defis.ts` | `useDefis()`, `createDefi()` |
| `hooks/use-defis-p2p.ts` | `useDefisP2P()`, `createDefiP2P()`, `updateDefiP2P()` |
| `components/p2p-challenges/` | Tous les composants P2P (6 fichiers) |
| `app/(protected)/challenges/page.tsx` | Page defis commercial (plateforme + P2P) |
| `app/(protected)/challenges/[id]/page.tsx` | Detail d'un defi plateforme |
| `app/(protected)/*/challenges/new/page.tsx` | Creation defi (par role) |

---

## Flux principaux

### Creation d'un defi plateforme

```
1. Wizard 4 etapes :
   Etape 1 : Titre + description + type de defi
   Etape 2 : Objectif chiffre + dates + selection participants
   Etape 3 : Recompense (type + valeur + description)
   Etape 4 : Confirmation et apercu

2. POST /api/defis
   - Validation Zod (createDefiSchema)
   - Necessite role >= chef_ventes
   - Inserer dans defis_plateforme
   - Pour chaque target_id : inserer dans defis_plateforme_participants

3. Statut initial : 'draft' ou 'upcoming' selon date de debut
```

Createurs par role :
- **Chef des ventes** : defis equipe, participants = ses commerciaux
- **Direction concession** : defis concession, participants = commerciaux
- **Direction marque** : defis inter-concessions, participants = concessions
- **Direction groupe** : defis groupe, participants = marques

### Cycle de vie d'un defi P2P

```
pending ──────────────────────────────────────────
  |                                               |
  |── (adversaire accepte) ──> active             |
  |                              |                |
  |── (adversaire negocie) ──> negotiating        |
  |                              |                |
  |                  ┌── (accord) ──> active      |
  |                  |                  |          |
  |                  └── (refus) ──> declined     |
  |                                               |
  └── (adversaire decline) ──> declined           |
                                                  |
active ──> (duree expiree + scores) ──> completed |
       └── (annulation) ──> cancelled             |
```

### Negociation P2P

```
1. Challenger cree le defi avec sa mise
2. Adversaire recoit le defi (status: pending)
3. Adversaire peut :
   - Accepter -> status: active, dates calculees
   - Decliner -> status: declined
   - Negocier -> status: negotiating

4. Echange de contre-offres :
   - Chaque message = { senderId, type: 'counter_offer'|'message',
     proposedStake?, proposedDuration?, message? }
   - Messages stockes dans negotiation.messages[]
   - Offre courante dans negotiation.currentOffer

5. Accord -> status: active
```

### Composants P2P

| Composant | Role |
|-----------|------|
| `P2PChallengeCard` | Carte de defi (normal + compact) |
| `CreateChallengeDialog` | Wizard 5 etapes (adversaire, metrique, duree, mise, confirmation) |
| `ChallengeResponseDialog` | Reponse a un defi (accepter/negocier/decliner) |
| `NegotiationPanel` | Panel de negociation avec chat |
| `P2PStakeInput` | Saisie mise en jeu (points + recompense custom) |
| `ChallengeButton` | Bouton "Defier" (3 variantes : default, compact, icon) |

### Formule de progression

```
progressRate = (currentScore / targetScore) * 100
```

Les 3 meilleurs participants (top performers) sont tries par `progress_rate` descendant.

---

## Points d'attention / Dettes techniques

1. **`ChallengeFormData` utilise des champs plats** : `rewardType`, `rewardValue`, `badgeName`, `badgeIcon` — PAS un objet `reward.type`. La conversion vers le format API (`reward: { type, value, ... }`) se fait lors du POST.

2. **API retourne `defis_plateforme_participants`** : Le champ dans la reponse API est `defis_plateforme_participants` (pas juste `participants`). Le mapping se fait cote client.

3. **Durees P2P predefinies** : 7, 14, 30, 90 jours uniquement. Le schema Zod accepte 1-90 mais l'UI ne propose que ces 4 valeurs.

4. **Types de defi differents par niveau** :
   - Chef ventes : `sales_count`, `revenue_target`, `margin_target`, `financing_rate`, `specific_model`
   - Marque : `volume`, `margin`, `financing`, `satisfaction`, `electric`, `specific_model`
   - Groupe : `volume`, `revenue`, `margin`, `satisfaction`, `market_share`

5. **Pas de calcul automatique des scores** : Les scores des participants (`current_score`) ne sont pas mis a jour automatiquement depuis les fiches de marge. Un mecanisme de mise a jour (cron ou trigger) serait necessaire pour une version production complete.

6. **Negociation sans limite** : Pas de nombre maximum de contre-offres dans une negociation P2P. Les echanges peuvent durer indefiniment.

7. **Suppression de defi** : L'API supporte la mise a jour du statut vers `cancelled` mais il n'y a pas de DELETE endpoint. Les defis ne sont jamais supprimes physiquement.
