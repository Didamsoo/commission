# Guide Utilisateur — AutoPerf Pro

> Plateforme de gestion de performance et commissions pour concessions automobiles.

---

## Table des matières

1. [Premiers pas](#1-premiers-pas)
2. [Commercial (N1)](#2-commercial-n1)
3. [Chef des Ventes (N2)](#3-chef-des-ventes-n2)
4. [Directeur de Concession (N3)](#4-directeur-de-concession-n3)
5. [Directeur de Marque (N4)](#5-directeur-de-marque-n4)
6. [Directeur de Plaque (N5)](#6-directeur-de-plaque-n5)
7. [Fonctionnalités communes](#7-fonctionnalités-communes)
8. [FAQ](#8-faq)

---

## 1. Premiers pas

### Créer un compte

1. Rendez-vous sur la page d'inscription
2. Renseignez votre **email professionnel** et un **mot de passe** (minimum 8 caractères, 1 majuscule, 1 chiffre)
3. Complétez votre **profil** : prénom, nom, téléphone professionnel
4. Indiquez votre **concession** : nom et adresse
5. Acceptez les conditions d'utilisation et validez

Un email de confirmation vous sera envoyé. Cliquez sur le lien pour activer votre compte.

### Se connecter

1. Entrez votre email et mot de passe
2. Cochez "Se souvenir de moi" pour rester connecté
3. Vous serez redirigé vers votre tableau de bord personnel selon votre rôle

### Mot de passe oublié

1. Cliquez sur "Mot de passe oublié" sur la page de connexion
2. Entrez votre adresse email
3. Consultez votre boîte de réception et cliquez sur le lien de réinitialisation
4. Choisissez un nouveau mot de passe (minimum 8 caractères)

### Hiérarchie des rôles

| Rôle | Niveau | Accès |
|------|--------|-------|
| **Commercial** | N1 | Calculateur, défis, classement, profil |
| **Chef des Ventes** | N2 | + Gestion d'équipe, coaching, rapports équipe |
| **Directeur de Concession** | N3 | + Approbations, payplan, gestion utilisateurs, P&L |
| **Directeur de Marque** | N4 | + Multi-concessions, benchmark, stocks réseau |
| **Directeur de Plaque** | N5 | + Multi-marques, consolidation groupe, reporting stratégique |

Chaque niveau supérieur a accès à toutes les fonctionnalités des niveaux inférieurs.

---

## 2. Commercial (N1)

### Tableau de bord

Votre page d'accueil (`/dashboard`) affiche vos **indicateurs personnels** :

- **Ventes du mois** : nombre de ventes réalisées vs objectif
- **Commission totale** : montant cumulé des commissions
- **Taux de financement** : pourcentage de ventes financées
- **Marge totale** : marge générée sur la période

Vous y trouverez aussi :
- **Graphique de tendance** : évolution sur 6 mois (ventes et marge)
- **Défis actifs** : les 2 défis en cours avec votre progression
- **Mini classement** : votre position parmi le top 5
- **Ventes récentes** : vos 4 dernières ventes avec statut (approuvée / en attente)
- **Badges récents** : vos derniers badges débloqués

Utilisez le **filtre de dates** en haut de page pour ajuster la période affichée.

### Calculateur de marge

Le calculateur (`/calculator`) vous guide en **5 étapes** pour calculer la marge d'une vente :

**Étape 1 — Informations générales**
- Votre nom (pré-rempli)
- Nom du client

**Étape 2 — Véhicule**
- Type : VN (véhicule neuf), VO (véhicule d'occasion), VU (véhicule utilitaire)
- Modèle et numéro du véhicule

**Étape 3 — Tarification**
- Prix d'achat, prix de vente
- Valeur de reprise (le cas échéant)
- Garantie (219 €) et frais de préparation (45 €)

**Étape 4 — Options**
- **Financement** : bonus de 150 € si la vente est financée
- **Accessoires** : commission par palier (50–250 € = 10 €, 251–800 € = 50 €, 801 €+ = 75 €)
- **Pack livraison** : Pack 2 = +20 €, Pack 3 = +35 €

**Étape 5 — Résultats**
- Marge brute, commission, marge nette, taux de marge
- Boutons : **Sauvegarder**, **Exporter en PDF**, **Prévisualiser**
- Historique des modifications (audit trail) accessible depuis la fiche sauvegardée

### Défis

La page Défis (`/challenges`) comporte **4 onglets** :

| Onglet | Contenu |
|--------|---------|
| **Actifs** | Défis en cours avec barre de progression, récompense, date de fin |
| **Terminés** | Défis passés avec votre résultat (gagné / non atteint) |
| **À venir** | Défis futurs (verrouillés jusqu'à la date de début) |
| **Défis P2P** | Duels entre collègues |

**Défis P2P** — Lancez un défi à un collègue depuis la page Classement :
1. Choisissez votre adversaire
2. Définissez la métrique (ventes, marge, financement) et la durée
3. Fixez l'enjeu (café, déjeuner, personnalisé…)
4. Votre adversaire peut accepter, refuser ou contre-proposer
5. Les scores sont mis à jour en temps réel

### Classement

Le classement (`/leaderboard`) affiche votre position parmi tous les commerciaux :

- **Podium** : le top 3 est mis en avant (or, argent, bronze)
- **Classement complet** : tous les commerciaux avec ventes, commission, marge
- **Filtres** : période (jour, semaine, mois, trimestre, année) et métrique (commission, ventes, points)
- **Votre position** est mise en évidence en bleu
- Cliquez sur "Défier" à côté d'un nom pour lancer un défi P2P

### Profil et badges

Votre profil (`/profile`) montre :

- **Photo de profil** : cliquez sur l'icône caméra pour uploader votre avatar
- **Niveau et XP** : votre progression (Débutant → Apprenti → Confirmé → Expert → Maître → Légende)
- **Statistiques** : ventes totales, commission totale, meilleur classement, plus longue série
- **Badges débloqués** : vos accomplissements (Premier Pas, Semaine Parfaite, Roi du Financement, Champion Électrique…)
- **Badges verrouillés** : les prochains objectifs à atteindre avec une barre de progression

---

## 3. Chef des Ventes (N2)

### Tableau de bord équipe

Votre page d'accueil (`/chef-ventes`) affiche les **indicateurs de votre équipe** :

- **Ventes d'équipe** vs objectif (avec % d'atteinte)
- **Marge totale** de l'équipe + GPU moyen
- **Taux de financement** d'équipe (objectif : 75 %)
- **Membres à l'objectif** : combien de commerciaux ont atteint leur cible

**Alerte** : un bandeau s'affiche si l'équipe est en dessous de 80 % de l'objectif.

**Comparaison inter-équipes** : votre taux d'atteinte comparé aux autres équipes (VN, VO, VU) de la même concession.

**3 onglets en bas de page** :

| Onglet | Contenu |
|--------|---------|
| **Équipe** | Classement des membres : ventes, marge, financement, tendance |
| **Alertes** | Notifications de performance (sous-performance, objectifs manqués) |
| **Défis** | Défis d'équipe actifs avec progression des participants |

### Gestion d'équipe

- **Liste d'équipe** (`/chef-ventes/equipe`) : tous vos commerciaux avec leurs KPI individuels
- **Fiche détaillée** (`/chef-ventes/equipe/[id]`) : historique complet d'un commercial, analyse par vente

### Coaching

La page coaching (`/chef-ventes/coaching`) permet de :
- Laisser des **notes de coaching** sur chaque membre de l'équipe
- Suivre l'historique des feedbacks et plans d'amélioration
- Documenter les points forts et axes de progrès

### Rapports d'équipe

La page rapports (`/chef-ventes/rapports`) offre :
- Rapports de performance de l'équipe
- Export Excel et PDF
- Filtre par période personnalisable

### Création de défis

Créez des défis d'équipe depuis `/chef-ventes/challenges/new` :
- Définissez le titre, la description, le type (ventes, marge, financement…)
- Fixez l'objectif chiffré et la période
- Choisissez la récompense (bonus, badge, points)

---

## 4. Directeur de Concession (N3)

### Vue d'ensemble

Votre page d'accueil (`/direction`) affiche les **indicateurs de la concession** :

- **Ventes totales** vs objectif (tous départements)
- **Marge totale** + GPU moyen
- **Taux d'absorption** (APV, objectif : 80 %)
- **Satisfaction client** (NPS)
- **Prime constructeur** estimée

**Cartes par département** (VN, VO, VU, APV) : chacune montre les ventes, la marge, le GPU, le taux de financement, la taille de l'équipe et le chef des ventes.

**3 onglets en bas de page** :

| Onglet | Contenu |
|--------|---------|
| **Défis** | Défis inter-équipes avec classement des participants |
| **Alertes** | Alertes critiques / avertissements / informations de tous les départements |
| **P&L** | Compte de résultat simplifié : revenus (VN, VO, VU, APV), marges, charges, EBITDA |

### Approbations

La page d'approbations (`/direction/approvals`) liste les fiches de marge en attente de validation :
- Détails du véhicule, nom du commercial, client, marge calculée
- Boutons **Approuver** / **Rejeter** / **Voir le détail**
- Le commercial est notifié du résultat

### Gestion des utilisateurs

Depuis `/direction/users` :
- Créer, modifier, désactiver des comptes utilisateurs
- Assigner les rôles et les équipes
- Inviter de nouveaux collaborateurs

### Configuration du payplan

Depuis `/direction/payplan` :
- Définir les règles de commission (taux de base, paliers)
- Configurer les bonus par seuil
- Ajuster les objectifs GPU par département

### Rapports de concession

Depuis `/direction/reports` :
- Rapports de performance globaux
- Export Excel et PDF avec filtres de dates

---

## 5. Directeur de Marque (N4)

### Dashboard marque

Votre page d'accueil (`/marque`) affiche les **indicateurs consolidés** de toutes les concessions de la marque :

- **Volume total** vs objectif constructeur
- **Marge réseau** + GPU moyen
- **Taux de financement** réseau (objectif : 75 %)
- **Satisfaction** réseau (NPS, objectif : 85 %)
- **Prime constructeur** estimée

**4 onglets** :

| Onglet | Contenu |
|--------|---------|
| **Concessions** | Classement des concessions (objectif %, ventes, GPU, financement, alertes) |
| **Défis** | Défis inter-concessions avec classement |
| **Objectifs constructeur** | 5 axes pondérés : volume (40 %), financement (25 %), satisfaction (20 %), VE (10 %), certifications (5 %) |
| **Alertes** | Notifications réseau par concession |

**Objectifs constructeur** — Pour chaque axe :
- Barre de progression et statut (atteint / en bonne voie / à risque / manqué)
- Bonus estimé par axe et bonus total

### Liste des concessions

Depuis `/marque/concessions` : vue de toutes les concessions avec KPI résumés.

Cliquez sur une concession pour voir son **détail** (`/marque/concessions/[id]`) : performance par département, équipes, alertes.

### Benchmark

La page benchmark (`/marque/benchmark`) permet de :
- Comparer les concessions entre elles sur les principaux KPI
- Identifier les meilleures pratiques et les points faibles
- Voir l'historique des performances sur 6 mois

### Stocks réseau

Depuis `/marque/stocks` :
- Visibilité sur les stocks de tout le réseau
- Analyse du vieillissement par concession (< 30j, 30–60j, > 60j)
- Transferts de véhicules entre concessions

---

## 6. Directeur de Plaque (N5)

### Dashboard groupe

Votre page d'accueil (`/groupe`) affiche les **indicateurs consolidés** de toutes les marques :

- **Chiffre d'affaires** groupe
- **EBITDA** + marge EBITDA %
- **Volume total** (toutes marques)
- **Part de marché** %
- **NPS** groupe
- **Effectif** total + taux de turnover

**4 onglets** :

| Onglet | Contenu |
|--------|---------|
| **Marques** | Cartes par marque : CA, marge, objectif %, ventes, GPU, financement, NPS, croissance trimestrielle |
| **Défis** | Défis inter-marques (mensuels, trimestriels, annuels) |
| **P&L** | P&L consolidé multi-colonnes : par marque + Total + Budget + Écart % |
| **Tendances** | Indicateurs stratégiques : % VE, marge VO, taux d'absorption, financement, jours de stock |

### Liste des marques

Depuis `/groupe/marques` : vue de toutes les marques avec KPI résumés.

Cliquez sur une marque pour son **détail** (`/groupe/marques/[id]`) : performance par concession, tendances.

### Performance analytique

La page performance (`/groupe/performance`) offre :
- Comparaisons croisées entre marques
- Graphiques multi-marques sur 6 mois (barres empilées par marque)
- Identification des tendances et écarts

### Rapports groupe

Depuis `/groupe/reports` :
- Rapports exécutifs pour le comité de direction
- Export données consolidées (Excel, PDF)
- Templates de rapports pré-configurés

---

## 7. Fonctionnalités communes

### Notifications

Les notifications apparaissent sur votre tableau de bord et sont accessibles via l'icône cloche dans la barre de navigation :

- **Critiques** (rouge) : objectifs fortement en retard, problèmes urgents
- **Avertissements** (orange) : alertes de performance, risques identifiés
- **Informations** (bleu) : nouveaux défis, badges débloqués, mises à jour
- **Succès** (vert) : objectifs atteints, ventes approuvées

Vous pouvez **marquer comme lu** individuellement ou **tout marquer comme lu**.

Configurez vos préférences de notification dans `/profile/settings` :
- Notifications email (nouveau défi, vente validée, badge obtenu)
- Notifications push navigateur

### Recherche globale

La barre de recherche en haut de page permet de trouver rapidement :
- Des ventes par nom de client ou modèle
- Des commerciaux par nom
- Des concessions

### Filtre par période

Disponible sur tous les tableaux de bord. Sélectionnez une **date de début** et une **date de fin** pour filtrer l'ensemble des KPI, graphiques et tableaux affichés.

### Export de données

Depuis les pages de rapports ou le calculateur :
- **PDF** : fiches de marge, rapports de performance
- **Excel** : données détaillées, listes de ventes, classements

### Paramètres du profil

Depuis `/profile/settings` :
- Modifier votre email et mot de passe
- Configurer les préférences de notifications (email, push, badges, défis, ventes)
- Gérer votre avatar

---

## 8. FAQ

**Q : Mon mot de passe ne fonctionne plus.**
R : Utilisez "Mot de passe oublié" sur la page de connexion pour recevoir un lien de réinitialisation.

**Q : Je ne vois pas certaines pages dans le menu.**
R : Chaque rôle a accès à des pages spécifiques. Contactez votre directeur pour ajuster vos droits.

**Q : Ma fiche de marge est en attente.**
R : Les fiches de marge doivent être approuvées par le directeur de concession. Vous serez notifié du résultat.

**Q : Comment lancer un défi P2P ?**
R : Allez sur la page Classement, trouvez votre adversaire, et cliquez sur "Défier". Définissez les paramètres du défi et envoyez votre proposition.

**Q : Les données du dashboard affichent 0 partout.**
R : Vérifiez que des fiches de marge ont été saisies pour la période sélectionnée. Ajustez le filtre de dates si nécessaire.

**Q : Comment changer ma photo de profil ?**
R : Allez sur votre Profil, cliquez sur l'icône caméra sur votre avatar et sélectionnez une image (JPEG, PNG, WebP ou GIF).

**Q : Je suis directeur mais je n'ai pas accès à la gestion des utilisateurs.**
R : Seuls les directeurs de concession (N3) et au-dessus peuvent gérer les utilisateurs. Vérifiez votre rôle dans votre profil.

---

> **Support** : Pour toute question technique, contactez votre administrateur ou écrivez à contact@autoperf.fr.
