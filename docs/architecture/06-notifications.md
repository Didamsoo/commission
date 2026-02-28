# Module : Notifications (In-App, Email, Push)

## Resume metier

Systeme de notifications a trois canaux : **in-app** (stockees en BDD, affichees dans l'interface), **email** (via Resend API avec templates React Email), et **push** (Web Push API avec cles VAPID). Les notifications sont creees via l'API, stockees dans Supabase, et distribuees selon les preferences de chaque utilisateur.

---

## Architecture des donnees

### Table `notifications`

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID | Cle primaire |
| `user_id` | UUID | Destinataire |
| `type` | string | Type de notification (max 50 car.) |
| `title` | string | Titre (max 200 car.) |
| `message` | string? | Message detaille (max 1000 car.) |
| `data` | JSONB? | Metadonnees extensibles |
| `is_read` | boolean | Lu/non lu |
| `should_send_email` | boolean | Flag d'envoi email |
| `email_sent` | boolean | Email envoye |
| `email_sent_at` | timestamp? | Date d'envoi email |
| `created_at` | timestamp | Date creation |

### Table `push_subscriptions`

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID | Cle primaire |
| `user_id` | UUID | Utilisateur |
| `endpoint` | string | URL du service push |
| `p256dh` | string | Cle publique ECDH (base64) |
| `auth` | string | Token d'authentification (base64) |

Contrainte unique : `(user_id, endpoint)` — upsert a l'inscription.

### Types de notifications

| Type | Trigger | Template email |
|------|---------|---------------|
| `vente` / `sale_validated` / `approbation` | Vente approuvee | `SaleValidatedEmail` |
| `defi` / `new_challenge` | Nouveau defi cree | `NewChallengeEmail` |
| `badge` / `badge_earned` | Badge obtenu | `BadgeEarnedEmail` |
| `info` | Informatif | Pas de template |
| `warning` | Avertissement | Pas de template |
| `success` | Confirmation | Pas de template |
| `critical` / `error` | Alerte critique | Pas de template |

### Preferences utilisateur (dans `profiles.settings`)

```json
{
  "email_notifications": true,     // Toggle global
  "defi_notifications": true,      // Notifications defis
  "vente_notifications": true,     // Notifications ventes
  "badge_notifications": true      // Notifications badges
}
```

### Schema de validation Zod (`lib/validations/notifications.ts`)

```
createNotificationSchema:
  - user_id: UUID (requis)
  - type: string (1-50 car.)
  - title: string (1-200 car.)
  - message?: string (max 1000 car.)
  - data?: Record<string, unknown>

markReadSchema:
  - is_read: boolean
```

---

## Fichiers cles

| Fichier | Role |
|---------|------|
| `app/api/notifications/route.ts` | GET (liste paginee) + POST (creer notification) |
| `app/api/notifications/[id]/route.ts` | PUT (marquer lu/non lu) |
| `app/api/notifications/read-all/route.ts` | PUT (tout marquer comme lu) |
| `app/api/email/send-queued/route.ts` | Cron : envoi des emails en file d'attente |
| `app/api/push/subscribe/route.ts` | POST (souscrire) + DELETE (desabonner) |
| `lib/email/client.ts` | `sendEmail()` via Resend API |
| `lib/email/templates/sale-validated.tsx` | Template email vente validee |
| `lib/email/templates/new-challenge.tsx` | Template email nouveau challenge |
| `lib/email/templates/badge-earned.tsx` | Template email badge obtenu |
| `lib/push/sender.ts` | `sendPushNotification()` via web-push |
| `lib/validations/notifications.ts` | Schemas Zod |
| `hooks/use-notifications.ts` | `useNotifications()`, `markRead()`, `markAllRead()` |
| `public/sw.js` | Service Worker pour notifications push |

---

## Flux principaux

### Creation d'une notification

```
1. POST /api/notifications { user_id, type, title, message?, data? }

2. Verification autorisation :
   - Auto-notification (user_id = soi-meme) : toujours autorise
   - Notification pour un autre : role >= chef_ventes requis

3. Determination envoi email :
   a. Charger profiles.settings du destinataire
   b. Verifier la preference :
      - type 'defi'  -> settings.defi_notifications
      - type 'vente' -> settings.vente_notifications
      - type 'badge' -> settings.badge_notifications
      - autre        -> settings.email_notifications (toggle global)
   c. Definir should_send_email = true/false

4. INSERT dans notifications
   - email_sent = false
   - should_send_email = true/false selon preferences

5. Retour 201 Created
```

### Envoi des emails en file d'attente

```
GET /api/email/send-queued (protege par CRON_SECRET)

1. Verification : Authorization: Bearer {CRON_SECRET}
   - 401 si absent/invalide
   - 503 si CRON_SECRET non configure

2. SELECT notifications
   WHERE should_send_email = true AND email_sent = false
   LIMIT 50
   JOIN profiles (email, full_name)

3. Pour chaque notification :
   - Determiner le template email selon le type
   - Extraire les metadonnees (data ou metadata)
   - Appeler sendEmail({ to, subject, react: <Template /> })
   - Marquer email_sent = true + email_sent_at = now()

4. Retour : { total, sent, errors[] }
```

### Templates email

#### Vente validee (`SaleValidatedEmail`)

```
Sujet : "Votre vente a ete validee — AutoPerf"
Contenu :
  - Bonjour {commercialName}
  - Details : Vehicule, Client, Marge (EUR), Commission (+XX EUR en vert)
  - CTA : "Voir mon tableau de bord" -> /dashboard
```

Metadata requise : `vehicle_name`, `client_name`, `margin`, `commission`

#### Nouveau challenge (`NewChallengeEmail`)

```
Sujet : "Nouveau challenge — AutoPerf"
Contenu :
  - Bonjour {recipientName}
  - Challenge : titre, description, date fin, recompense
  - CTA : "Voir le challenge" -> /challenges
```

Metadata requise : `challenge_title`, `challenge_description`, `end_date`, `reward`

#### Badge obtenu (`BadgeEarnedEmail`)

```
Sujet : "Nouveau badge obtenu — AutoPerf"
Contenu :
  - Felicitations {recipientName}
  - Badge : nom + description
  - CTA : "Voir mes badges" -> /profile
```

Metadata requise : `badge_name`, `badge_description`

### Notifications push

#### Inscription

```
1. Client : navigator.serviceWorker.register('/sw.js')
2. Client : pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: VAPID_PUBLIC_KEY })
3. Client : POST /api/push/subscribe { endpoint, keys: { p256dh, auth } }
4. Serveur : UPSERT dans push_subscriptions
```

#### Envoi

```
sendPushNotification(subscription, payload)
  payload = { title, body, icon?, badge?, url?, tag? }
  -> webpush.sendNotification(formatted, JSON.stringify(payload))
  -> Si 410/404 : subscription expiree (expired: true)
```

#### Service Worker (`public/sw.js`)

```
push event :
  - Parse le payload JSON
  - showNotification(title, {
      body, icon (/icon-192x192.png), badge (/badge-72x72.png),
      tag ('autoperf-notification'),
      vibrate: [100, 50, 100],
      actions: [{ action: 'open', title: 'Ouvrir' }, { action: 'close', title: 'Fermer' }],
      data: { url }
    })

notificationclick event :
  - Si action = 'close' : fermer
  - Sinon : chercher un onglet existant avec la meme URL
  - Trouver -> focus
  - Pas trouve -> clients.openWindow(url || '/')
```

### Affichage in-app

```
Header (layout) :
  - Icone cloche avec badge rouge (nombre non lus)
  - Dropdown : 8 dernieres notifications
  - Lien "Tout voir" -> /notifications

Page /notifications :
  - 3 onglets : Toutes / Non lues / Lues
  - Clic sur notification -> markRead(id)
  - Bouton "Tout marquer comme lu" -> markAllRead()
  - Couleurs par type : info=bleu, warning=ambre, success=emeraude, critical=rouge
```

---

## Variables d'environnement

| Variable | Usage | Cote |
|----------|-------|------|
| `RESEND_API_KEY` | Cle API Resend pour l'envoi d'emails | Serveur |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Cle publique VAPID pour l'inscription push | Client |
| `VAPID_PRIVATE_KEY` | Cle privee VAPID pour l'envoi push | Serveur |
| `VAPID_SUBJECT` | Email de contact VAPID (default: `mailto:contact@autoperf.fr`) | Serveur |
| `CRON_SECRET` | Secret pour proteger le endpoint d'envoi d'emails | Serveur |

---

## Points d'attention / Dettes techniques

1. **Pas de creation automatique de notifications** : Les API de defis et approbations ne creent PAS automatiquement de notifications. C'est au code appelant de faire un POST /api/notifications apres chaque action metier (vente approuvee, defi cree, badge obtenu).

2. **Alias de types** : Le processeur d'email reconnait a la fois `'vente'` ET `'sale_validated'`/`'approbation'`, `'defi'` ET `'new_challenge'`, `'badge'` ET `'badge_earned'`. Les deux formes fonctionnent mais cela cree de la confusion.

3. **`console.warn`/`console.error` dans le client email** : `lib/email/client.ts` contient 3 logs console (lignes 21, 34, 40). A remplacer par un logger structure ou Sentry.

4. **Pas d'envoi push automatique** : `sendPushNotification()` existe mais n'est appele nulle part automatiquement. Les push ne sont pas envoyes lors de la creation d'une notification.

5. **Limite de 50 emails par batch** : Le cron d'envoi traite au maximum 50 emails par execution. Si le volume depasse, les emails restants attendent le prochain cron.

6. **Service Worker non reversionne** : `public/sw.js` est un fichier JavaScript brut sans TypeScript ni versioning. Un changement du SW necessite que les navigateurs detectent la mise a jour.

7. **Securite lecture** : Les utilisateurs ne peuvent lire et marquer que leurs propres notifications (verifie par le code API). Le RLS Supabase ajoute une couche supplementaire.
