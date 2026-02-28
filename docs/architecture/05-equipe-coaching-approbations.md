# Module : Equipe, Coaching & Approbations

## Resume metier

Trois sous-systemes interconnectes pour la gestion d'equipe. **Equipe** gere l'affectation des commerciaux aux equipes et la supervision hierarchique. **Coaching** permet aux chefs des ventes de creer des notes de suivi (feedback, objectifs, actions, reunions) pour leurs commerciaux. **Approbations** implemente le workflow de validation des ventes : un commercial soumet sa fiche, le manager l'approuve ou la rejette.

---

## Architecture des donnees

### Table `equipes`

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID | Cle primaire |
| `name` | string | Nom de l'equipe |
| `type` | string | Type : VN, VO, VU, APV, ADMIN |
| `chef_ventes_id` | UUID | Manager de l'equipe |
| `concession_id` | UUID | Concession de rattachement |
| `objective` | JSONB | `{ monthly_target: number }` |

### Table `notes_coaching`

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID | Cle primaire |
| `manager_id` | UUID | Chef des ventes (createur) |
| `commercial_id` | UUID | Commercial cible |
| `type` | enum | `feedback`, `objective`, `action`, `meeting` |
| `content` | string | Contenu (1-5000 caracteres) |
| `is_private` | boolean | Si true, visible uniquement par le manager |
| `created_at` | timestamp | Date creation |
| `updated_at` | timestamp | Date mise a jour |

### Table `approbations`

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID | Cle primaire |
| `fiche_marge_id` | UUID | Reference a la fiche de marge |
| `commercial_id` | UUID | Commercial ayant soumis |
| `approver_id` | UUID? | Manager ayant decide |
| `status` | enum | `pending`, `approved`, `rejected` |
| `comment` | string? | Commentaire/raison (max 1000 car.) |
| `submitted_at` | timestamp | Date de soumission |
| `decided_at` | timestamp? | Date de decision |

### Schemas de validation Zod

#### Equipe (`lib/validations/equipe.ts`)

```
addMemberSchema:
  - user_id: UUID (requis)
  - equipe_id: UUID (requis)

updateMemberSchema:
  - equipe_id?: UUID (nullable)
  - role?: enum des 6 roles
  - manager_id?: UUID (nullable)
  - is_active?: boolean
```

#### Coaching (`lib/validations/coaching.ts`)

```
createNoteSchema:
  - commercial_id: UUID (requis)
  - type: "feedback" | "objective" | "action" | "meeting"
  - content: string (1-5000 caracteres)
  - is_private: boolean (default: false)

updateNoteSchema: memes champs, tous optionnels
```

#### Approbations (`lib/validations/approbations.ts`)

```
submitApprovalSchema:
  - fiche_marge_id: UUID (requis)

decideApprovalSchema:
  - status: "approved" | "rejected"
  - comment?: string (max 1000 caracteres)
```

---

## Fichiers cles

| Fichier | Role |
|---------|------|
| `app/api/equipe/route.ts` | GET (liste membres) + POST (ajout membre) |
| `app/api/equipe/[id]/route.ts` | PUT (modifier membre) |
| `app/api/coaching/route.ts` | GET (notes paginees) + POST (creer note) |
| `app/api/coaching/[id]/route.ts` | PUT (modifier) + DELETE (supprimer) |
| `app/api/approbations/route.ts` | GET (liste) + POST (soumettre vente) |
| `app/api/approbations/[id]/route.ts` | PUT (approuver/rejeter) |
| `lib/validations/equipe.ts` | Schemas Zod equipe |
| `lib/validations/coaching.ts` | Schemas Zod coaching |
| `lib/validations/approbations.ts` | Schemas Zod approbations |
| `hooks/use-equipe.ts` | `useEquipe()` |
| `hooks/use-coaching.ts` | `useCoaching()`, `createNote()` |
| `hooks/use-approbations.ts` | `useApprobations()`, `submitApproval()`, `reviewApproval()` |
| `app/(protected)/chef-ventes/equipe/page.tsx` | Page liste equipe |
| `app/(protected)/chef-ventes/equipe/[id]/commercial-detail-content.tsx` | Detail commercial |
| `app/(protected)/chef-ventes/coaching/page.tsx` | Page coaching (sidebar + notes) |
| `app/(protected)/direction/users/page.tsx` | Gestion utilisateurs direction |
| `app/(protected)/direction/approvals/page.tsx` | Centre d'approbations |

---

## Flux principaux

### Gestion d'equipe

#### Permissions d'acces

| Operation | Role minimum | Portee |
|-----------|-------------|--------|
| GET /api/equipe | chef_ventes | Chef : ses equipes uniquement |
| GET /api/equipe | dir_concession | Toute la concession |
| POST /api/equipe | dir_concession | Ajout membre a une equipe |
| PUT /api/equipe/[id] | chef_ventes | Modifier role, equipe, manager, statut |

#### Filtrage par role (GET)

```
chef_ventes   -> membres de ses equipes uniquement
dir_concession -> tous les membres de la concession
dir_marque+   -> selon scope (potentiellement tout)
```

#### Donnees enrichies des membres

Le hook `useEquipe()` retourne des `EquipeMember` avec KPI optionnels :
- `total_sales`, `sales_target` — metriques ventes
- `total_margin`, `total_commission`, `total_revenue` — financier
- `financing_rate`, `conversion_rate` — pourcentages
- `total_points`, `streak` — gamification
- `trend` — tendance (up/down/stable)

### Workflow coaching

```
1. Chef des ventes ouvre la page coaching
2. Sidebar : liste des commerciaux de l'equipe avec compteur de notes
3. Clic sur un commercial -> filtre les notes
4. Creation de note :
   - Choisir le commercial
   - Choisir le type (feedback/objectif/action/reunion)
   - Rediger le contenu (10-5000 caracteres)
   - Toggle visibilite (privee = manager seul)
5. POST /api/coaching -> auto-assigne manager_id
6. Edition/Suppression : uniquement par le manager createur
```

#### Visibilite des notes

```
is_private = true  -> visible uniquement par le manager createur
is_private = false -> visible par le manager ET le commercial cible
```

#### Types de notes et couleurs UI

| Type | Label FR | Icone | Couleur |
|------|----------|-------|---------|
| `feedback` | Feedback | MessageSquare | Bleu |
| `objective` | Objectif | Target | Violet |
| `action` | Action | Lightbulb | Ambre |
| `meeting` | Reunion | Calendar | Emeraude |

### Workflow d'approbation des ventes

```
1. SOUMISSION (Commercial)
   - Commercial finalise sa fiche de marge
   - POST /api/approbations { fiche_marge_id }
   - Action double :
     a. fiches_marge.status -> 'submitted'
     b. approbations -> nouveau record (status: 'pending')

2. EXAMEN (Manager)
   - GET /api/approbations?status=pending
   - Dialog de detail : infos vehicule, vendeur, client, prix, marge, commission
   - Decision :
     a. Approuver -> PUT /api/approbations/{id} { status: 'approved' }
     b. Rejeter  -> PUT /api/approbations/{id} { status: 'rejected', comment: '...' }

3. MISE A JOUR DOUBLE
   - approbation : status, approver_id, decided_at, comment
   - fiches_marge : status (approved/rejected), approved_by, approved_at

4. RESULTAT
   - Vente approuvee : comptee dans les KPI
   - Vente rejetee : retournee au commercial avec motif de rejet
```

#### Verification pre-decision

```
Avant tout PUT /api/approbations/[id] :
  - Verifier que l'approbation existe
  - Verifier que status = 'pending' (pas deja decidee)
  - Sinon -> erreur
```

### Page de gestion des utilisateurs (Direction)

```
Direction concession -> /direction/users
  - Inviter de nouveaux membres (dialog)
  - Filtrer par role (commercial, direction, admin)
  - Filtrer par statut (actif, inactif, en attente)
  - Modal de detail avec edition du role et equipe
  - Stats : total membres, total ventes, commissions, top performer
```

---

## Points d'attention / Dettes techniques

1. **Statut d'approbation irreversible** : Une fois decidee (approved/rejected), une approbation ne peut pas etre re-ouverte. Il n'existe pas de workflow de "retour en attente" ni de re-soumission directe.

2. **Pas de notification automatique** : Ni la creation de note coaching, ni l'approbation de vente ne creent automatiquement une notification en BDD. C'est au code appelant de creer les notifications via POST /api/notifications.

3. **`PerformanceHistoryMock()` dans le detail commercial** : La page `chef-ventes/equipe/[id]/commercial-detail-content.tsx` utilise des donnees de performance hardcodees au lieu de vraies donnees API.

4. **Suppression physique des notes** : DELETE /api/coaching/[id] supprime definitivement la note. Pas de soft-delete ni d'audit trail pour les notes de coaching.

5. **Pas d'operations en masse** : Les notes et approbations se traitent une par une. Pas de "tout approuver" ni de "tout marquer comme lu".

6. **Hook `useCoaching()` type `unknown[]`** : Le retour du hook n'est pas type — devrait etre `CoachingNote[]`.

7. **Filtrage equipe cote code** : Le filtrage par role (chef_ventes ne voit que ses equipes) est fait dans le code API (lignes 31-43), pas uniquement par RLS. Les deux couches coexistent.
