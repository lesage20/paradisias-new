# Plan des Statistiques - Version 1.0 (Essentiel)
## Système Hôtelier Paradisias

## 📊 Vue d'ensemble

Ce document présente les **statistiques essentielles** pour la première version du système, focalisées sur une **vue globale du business** pour permettre au client de s'habituer progressivement.

---

## 1. 💰 PERFORMANCES FINANCIÈRES

### 1.1 Chiffre d'Affaires
- **Métrique** : CA total par mois
- **Données** : `payments.amount`, `payments.created_at`
- **Vue** : 📊 Graphique linéaire ↔️ 📋 Tableau mensuel
- **Utilité** : Suivi de la santé financière globale

### 1.2 Revenus par Type de Chambre
- **Métrique** : CA généré par chaque type de chambre
- **Données** : `payments` → `locations` → `rooms.type`
- **Vue** : 📊 Graphique en barres ↔️ 📋 Tableau avec détails
- **Utilité** : Identifier les chambres les plus rentables

---

## 2. 🏨 OCCUPATION HÔTELIÈRE

### 2.1 Taux d'Occupation Global
- **Métrique** : % de chambres occupées par mois
- **Données** : `locations`, nombre total de chambres
- **Vue** : 📊 Gauge avec évolution ↔️ 📋 Tableau détaillé
- **Utilité** : Vue d'ensemble de la performance

### 2.2 Durée Moyenne de Séjour
- **Métrique** : Nombre moyen de nuits par séjour
- **Données** : `locations.checkIn`, `locations.checkOut`
- **Vue** : 📊 Indicateur + histogramme ↔️ 📋 Liste des séjours
- **Utilité** : Comprendre les habitudes clients

---

## 3. 👥 APERÇU CLIENTÈLE

### 3.1 Analyse des Paiements Clients
- **Métrique** : Clients qui soldent leur entrée vs clients avec dettes
- **Données** : `payments`, `locations.totalPrice`, `locations.status`
- **Vue** : 📊 Graphique en secteurs ↔️ 📋 Tableau détaillé
- **Utilité** : Identifier les clients qui paient intégralement

### 3.2 Suivi des Dettes par Client
- **Métrique** : Pourcentage de dette + montant total dû par client
- **Données** : `locations.totalPrice` - `payments.amount` par client
- **Vue** : 📊 Graphique en barres ↔️ 📋 Tableau avec tri par dette
- **Utilité** : Gestion des créances et recouvrement

### 3.3 Performance Financière Client
- **Métrique** : Total des locations vs total des dettes par client
- **Données** : Somme `locations.totalPrice` et dettes par `locations.guest`
- **Vue** : 📊 Graphique comparatif ↔️ 📋 Tableau avec calculs
- **Utilité** : Évaluer la solvabilité et la valeur client

### 3.4 Clients Nouveaux vs Récurrents
- **Métrique** : Classification par nombre total de séjours
- **Données** : Comptage `locations` par `locations.guest`
- **Vue** : 📊 Graphique en secteurs ↔️ 📋 Liste avec historique
- **Utilité** : Mesurer la fidélisation et identifier les VIP

### 3.5 Top 5 Nationalités
- **Métrique** : Principales nationalités de clients
- **Données** : `clients.nationnalite`
- **Vue** : 📊 Graphique en barres ↔️ 📋 Liste avec compteurs
- **Utilité** : Connaître sa clientèle principale

---

## 4. 📅 ACTIVITÉ RÉSERVATIONS

### 4.1 Réservations par Mois
- **Métrique** : Nombre de réservations créées
- **Données** : `reservations.created_at`
- **Vue** : 📊 Graphique en colonnes ↔️ 📋 Calendrier détaillé
- **Utilité** : Suivre la demande

### 4.2 Taux de Confirmation
- **Métrique** : Réservations confirmées vs annulées
- **Données** : `reservations.status`
- **Vue** : 📊 Indicateur + secteurs ↔️ 📋 Liste avec statuts
- **Utilité** : Mesurer l'efficacité commerciale

---

## 5. 📈 TABLEAU DE BORD PRINCIPAL

### Vue d'ensemble mensuelle
- **Chiffre d'affaires du mois**
- **Taux d'occupation moyen**
- **Nombre de séjours**
- **Nouveaux clients**
- **Réservations en cours**

### Comparaison simple
- **Mois actuel vs mois précédent**
- **Évolution en %** (+ ou -)

---

## 6. 🔄 FLEXIBILITÉ D'AFFICHAGE

### Système de Basculement Graphique ↔️ Tableau
Chaque statistique propose **deux modes d'affichage** :

#### Mode Graphique 📊
- **Avantage** : Visualisation rapide des tendances
- **Usage** : Présentation, vue d'ensemble, patterns
- **Types** : Barres, secteurs, lignes, gauges, histogrammes

#### Mode Tableau 📋
- **Avantage** : Données précises, export, analyse détaillée
- **Usage** : Vérification, calculs, recherche, tri
- **Fonctions** : Tri, filtres, recherche, export Excel/PDF

### Interface Utilisateur
- **Bouton de basculement** sur chaque graphique/tableau
- **Synchronisation** des filtres entre les deux modes
- **Sauvegarde** de la préférence d'affichage par utilisateur

---

## 7. 🎯 POURQUOI CETTE APPROCHE ?

### Avantages de la Version 1.0
- ✅ **Simple à comprendre** - Pas de surcharge d'information
- ✅ **Vue d'ensemble claire** - Les KPIs essentiels du business
- ✅ **Adoption facile** - Le client s'habitue progressivement
- ✅ **Flexibilité d'affichage** - Graphiques ET tableaux
- ✅ **Focus sur les dettes** - Gestion financière client optimisée
- ✅ **Base solide** - Foundation pour futures améliorations

### Extensions futures possibles
- 📈 Analyses plus détaillées par période
- 🔍 Segmentation clientèle avancée  
- 📊 Métriques de performance par chambre
- 🎯 Analyses prédictives et tendances
- 📱 Alertes automatiques sur seuils de dette
- 💳 Analyse des modes de paiement
- 📧 Notifications de relance automatiques

---

## 📋 Données Nécessaires (Minimum)

### Tables utilisées
- `payments` - Pour les revenus
- `locations` - Pour l'occupation et séjours
- `clients` - Pour la clientèle de base
- `reservations` - Pour l'activité commerciale
- `rooms` - Pour les types de chambres

### Calculs simples
- Sommes et moyennes
- Comptages et pourcentages
- Comparaisons temporelles basiques

---

**🚀 Objectif : Donner au client les informations essentielles pour piloter son business sans le submerger, tout en préparant le terrain pour des fonctionnalités plus avancées.**