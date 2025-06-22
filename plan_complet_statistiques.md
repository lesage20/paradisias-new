# Plan Détaillé des Statistiques - Système Hôtelier Paradisias

## 📊 Vue d'ensemble

Ce document présente un plan complet des statistiques possibles pour le système de gestion hôtelière, organisé par domaines d'analyse avec les données nécessaires pour chaque métrique.

---

## 1. 👥 STATISTIQUES CLIENTS

### 1.1 Démographie des Clients

#### 1.1.1 Répartition par Genre
- **Métrique** : Pourcentage Hommes/Femmes
- **Données requises** : `clients.gender`
- **Visualisation** : Graphique en secteurs
- **Détail** : Liste des clients par genre avec possibilité de filtrage

#### 1.1.2 Analyse par Tranche d'Âge
- **Métrique** : Distribution par groupes d'âge (18-25, 26-35, 36-45, 46-55, 55+)
- **Données requises** : `clients.dob` (calcul de l'âge)
- **Visualisation** : Histogramme
- **Détail** : Liste des clients dans chaque tranche avec âge exact

#### 1.1.3 Répartition par Nationalité
- **Métrique** : Top 10 des nationalités, pourcentages
- **Données requises** : `clients.nationnalite`
- **Visualisation** : Graphique en barres horizontales
- **Détail** : Liste complète par nationalité avec compteurs

#### 1.1.4 Analyse Géographique (Lieu de naissance)
- **Métrique** : Répartition par villes/régions de naissance
- **Données requises** : `clients.place_of_birth`
- **Visualisation** : Carte ou graphique en barres
- **Détail** : Liste détaillée par lieu avec compteurs

### 1.2 Profils Professionnels

#### 1.2.1 Répartition par Profession
- **Métrique** : Top 10 des professions représentées
- **Données requises** : `clients.job`
- **Visualisation** : Graphique en barres
- **Détail** : Liste complète des professions avec compteurs

#### 1.2.2 Analyse des Secteurs d'Activité
- **Métrique** : Regroupement des professions par secteurs
- **Données requises** : `clients.job` (avec classification)
- **Visualisation** : Graphique en secteurs
- **Détail** : Détail par secteur avec liste des professions

### 1.3 Comportement Client

#### 1.3.1 Fréquence de Séjour
- **Métrique** : Nouveaux clients vs clients récurrents
- **Données requises** : `locations.guest`, dates des séjours
- **Visualisation** : Graphique en secteurs + évolution temporelle
- **Détail** : Liste des clients avec nombre de séjours

#### 1.3.2 Fidélité Client
- **Métrique** : Clients par nombre de séjours (1, 2-3, 4-5, 6+)
- **Données requises** : Historique des `locations` par client
- **Visualisation** : Graphique en barres
- **Détail** : Classement des clients les plus fidèles

#### 1.3.3 Durée Moyenne de Séjour par Client
- **Métrique** : Nombre moyen de nuits par client
- **Données requises** : `locations.checkIn`, `locations.checkOut`, `locations.guest`
- **Visualisation** : Histogramme de distribution
- **Détail** : Liste des clients avec durée moyenne et total de nuits

#### 1.3.4 Valeur Client (Customer Lifetime Value)
- **Métrique** : Chiffre d'affaires total généré par client
- **Données requises** : `locations.totalPrice` par `locations.guest`
- **Visualisation** : Graphique en barres des top clients
- **Détail** : Classement avec détail des séjours et montants

### 1.4 Préférences et Habitudes

#### 1.4.1 Préférences de Type de Chambre
- **Métrique** : Types de chambres les plus demandés par segment client
- **Données requises** : `locations.room` → `rooms.type` + profil client
- **Visualisation** : Matrice de préférences
- **Détail** : Analyse croisée client/type de chambre

#### 1.4.2 Saisonnalité des Clients
- **Métrique** : Périodes de fréquentation par segment de clientèle
- **Données requises** : `locations.checkIn` + profil client
- **Visualisation** : Graphique linéaire multi-séries
- **Détail** : Calendrier de fréquentation par segment

---

## 2. 💰 STATISTIQUES PAIEMENTS

### 2.1 Analyse des Revenus

#### 2.1.1 Évolution du Chiffre d'Affaires
- **Métrique** : CA par jour/semaine/mois/trimestre/année
- **Données requises** : `payments.amount`, `payments.created_at`
- **Visualisation** : Graphique linéaire avec tendance
- **Détail** : Tableau détaillé avec variation vs période précédente

#### 2.1.2 Répartition des Revenus par Mois
- **Métrique** : Contribution de chaque mois au CA annuel
- **Données requises** : `payments.amount`, `payments.created_at`
- **Visualisation** : Graphique en colonnes avec pourcentages
- **Détail** : Tableau mensuel avec objectifs vs réalisé

#### 2.1.3 Revenus par Type de Chambre
- **Métrique** : CA généré par chaque type de chambre
- **Données requises** : `payments` → `locations` → `rooms.type`
- **Visualisation** : Graphique en secteurs + barres
- **Détail** : Analyse de rentabilité par type avec nombre de nuits

#### 2.1.4 Revenue per Available Room (RevPAR)
- **Métrique** : Revenus par chambre disponible
- **Données requises** : `payments.amount`, nombre de chambres total, taux d'occupation
- **Visualisation** : Évolution temporelle du RevPAR
- **Détail** : Calcul détaillé avec facteurs d'influence

#### 2.1.5 Average Daily Rate (ADR)
- **Métrique** : Prix moyen par nuit vendue
- **Données requises** : `payments.amount`, nombre de nuits vendues
- **Visualisation** : Évolution de l'ADR dans le temps
- **Détail** : ADR par type de chambre et période

### 2.2 Méthodes de Paiement

#### 2.2.1 Répartition par Mode de Paiement
- **Métrique** : Pourcentage par méthode (espèces, carte, virement, etc.)
- **Données requises** : `locations.payment` ou `payments.method`
- **Visualisation** : Graphique en secteurs
- **Détail** : Évolution des préférences dans le temps

#### 2.2.2 Montant Moyen par Mode de Paiement
- **Métrique** : Ticket moyen selon la méthode de paiement
- **Données requises** : `payments.amount`, `payments.method`
- **Visualisation** : Graphique en barres
- **Détail** : Analyse des comportements de paiement

### 2.3 Analyse Temporelle des Paiements

#### 2.3.1 Délais de Paiement
- **Métrique** : Temps entre réservation et paiement complet
- **Données requises** : `reservations.created_at`, `payments.created_at`
- **Visualisation** : Distribution des délais
- **Détail** : Liste des paiements tardifs et délais moyens

#### 2.3.2 Paiements par Jour de la Semaine
- **Métrique** : Répartition des encaissements par jour
- **Données requises** : `payments.created_at`
- **Visualisation** : Graphique en barres par jour
- **Détail** : Analyse des patterns de paiement

### 2.4 Gestion des Impayés

#### 2.4.1 Taux d'Impayés
- **Métrique** : Pourcentage de créances non recouvrées
- **Données requises** : `locations.status` (dette), `payments`
- **Visualisation** : Indicateur + évolution temporelle
- **Détail** : Liste des impayés avec ancienneté

#### 2.4.2 Montant des Créances
- **Métrique** : Total des sommes dues
- **Données requises** : `locations` avec statut dette
- **Visualisation** : Graphique avec ancienneté des créances
- **Détail** : Détail par client avec actions à mener

---

## 3. 📅 STATISTIQUES RÉSERVATIONS

### 3.1 Volume et Tendances

#### 3.1.1 Évolution du Nombre de Réservations
- **Métrique** : Nombre de réservations par période
- **Données requises** : `reservations.created_at`
- **Visualisation** : Graphique linéaire avec tendance
- **Détail** : Tableau avec variations et comparaisons

#### 3.1.2 Réservations par Canal
- **Métrique** : Répartition par source (direct, online, agence, etc.)
- **Données requises** : `reservations.source` (à ajouter)
- **Visualisation** : Graphique en secteurs
- **Détail** : Performance de chaque canal

#### 3.1.3 Délai de Réservation (Lead Time)
- **Métrique** : Temps entre réservation et date d'arrivée
- **Données requises** : `reservations.created_at`, `reservations.checkIn`
- **Visualisation** : Distribution des délais
- **Détail** : Analyse par segment et saisonnalité

### 3.2 Conversion et Performance

#### 3.2.1 Taux de Conversion des Réservations
- **Métrique** : Réservations confirmées vs annulées
- **Données requises** : `reservations.status`
- **Visualisation** : Graphique en barres empilées
- **Détail** : Analyse des causes d'annulation

#### 3.2.2 Taux de Show-up
- **Métrique** : Clients qui se présentent vs no-show
- **Données requises** : `reservations` vs `locations` effectuées
- **Visualisation** : Indicateur + évolution
- **Détail** : Liste des no-shows et patterns

#### 3.2.3 Conversion Réservation → Location
- **Métrique** : Réservations transformées en séjours effectifs
- **Données requises** : `reservations` → `locations`
- **Visualisation** : Funnel de conversion
- **Détail** : Suivi du parcours client

### 3.3 Analyse Prédictive

#### 3.3.1 Prévisions d'Occupation
- **Métrique** : Projection basée sur les réservations actuelles
- **Données requises** : `reservations` futures, historique
- **Visualisation** : Calendrier prévisionnel
- **Détail** : Confidence intervals et scénarios

#### 3.3.2 Détection de Tendances
- **Métrique** : Analyse des patterns saisonniers
- **Données requises** : Historique des `reservations`
- **Visualisation** : Graphiques cycliques
- **Détail** : Comparaisons année sur année

---

## 4. 🏨 STATISTIQUES SÉJOURS

### 4.1 Occupation et Performance

#### 4.1.1 Taux d'Occupation Global
- **Métrique** : Pourcentage de chambres occupées
- **Données requises** : `locations`, nombre total de chambres
- **Visualisation** : Gauge + évolution temporelle
- **Détail** : Détail par chambre et période

#### 4.1.2 Taux d'Occupation par Type de Chambre
- **Métrique** : Performance de chaque type de chambre
- **Données requises** : `locations` → `rooms.type`
- **Visualisation** : Graphique en barres comparatives
- **Détail** : Analyse de la demande par segment

#### 4.1.3 Durée Moyenne de Séjour (ALOS)
- **Métrique** : Nombre moyen de nuits par séjour
- **Données requises** : `locations.checkIn`, `locations.checkOut`
- **Visualisation** : Évolution + distribution
- **Détail** : Analyse par type de client et chambre

#### 4.1.4 Occupation par Jour de la Semaine
- **Métrique** : Pattern d'occupation hebdomadaire
- **Données requises** : `locations.checkIn`, `locations.checkOut`
- **Visualisation** : Heatmap hebdomadaire
- **Détail** : Stratégies de pricing par jour

### 4.2 Analyse des Chambres

#### 4.2.1 Performance par Chambre
- **Métrique** : Revenus, occupation, maintenance par chambre
- **Données requises** : `locations` → `rooms`, `payments`
- **Visualisation** : Tableau de bord par chambre
- **Détail** : Historique complet de chaque chambre

#### 4.2.2 Temps de Rotation des Chambres
- **Métrique** : Temps entre deux séjours consécutifs
- **Données requises** : `locations.checkOut`, `locations.checkIn`
- **Visualisation** : Analyse des délais de turnover
- **Détail** : Optimisation du planning ménage

#### 4.2.3 Chambre les Plus/Moins Demandées
- **Métrique** : Classement des chambres par popularité
- **Données requises** : Fréquence d'occupation par `rooms.id`
- **Visualisation** : Graphique en barres
- **Détail** : Analyse des facteurs d'attractivité

### 4.3 Saisonnalité et Patterns

#### 4.3.1 Analyse Saisonnière
- **Métrique** : Variations d'occupation selon les saisons
- **Données requises** : `locations.checkIn` par mois/saison
- **Visualisation** : Graphique cyclique annuel
- **Détail** : Comparaisons pluriannuelles

#### 4.3.2 Pics et Creux d'Activité
- **Métrique** : Identification des périodes haute/basse
- **Données requises** : Historique complet des `locations`
- **Visualisation** : Calendrier thermique
- **Détail** : Stratégies d'optimisation par période

#### 4.3.3 Impact des Événements
- **Métrique** : Corrélation occupation/événements locaux
- **Données requises** : `locations` + calendrier événements
- **Visualisation** : Timeline avec événements
- **Détail** : ROI des événements sur l'occupation

### 4.4 Analyse Opérationnelle

#### 4.4.1 Temps de Séjour par Segment
- **Métrique** : ALOS par type de clientèle
- **Données requises** : `locations` + profil `clients`
- **Visualisation** : Comparaison multi-segments
- **Détail** : Stratégies de rétention par segment

#### 4.4.2 Taux de Satisfaction (si questionnaires)
- **Métrique** : Scores de satisfaction par période/chambre
- **Données requises** : Données d'enquêtes (à implémenter)
- **Visualisation** : Évolution des scores
- **Détail** : Corrélation satisfaction/fidélisation

---

## 5. 📈 TABLEAUX DE BORD CONSOLIDÉS

### 5.1 Dashboard Exécutif
- **KPIs principaux** : RevPAR, ADR, Taux d'occupation, CA
- **Fréquence** : Quotidienne/Hebdomadaire
- **Audience** : Direction

### 5.2 Dashboard Opérationnel
- **Métriques** : Réservations du jour, occupation temps réel, paiements
- **Fréquence** : Temps réel
- **Audience** : Équipe opérationnelle

### 5.3 Dashboard Commercial
- **Focus** : Performance commerciale, conversion, canaux
- **Fréquence** : Hebdomadaire/Mensuelle
- **Audience** : Équipe commerciale

### 5.4 Dashboard Financier
- **Métriques** : Revenus, marges, créances, prévisions
- **Fréquence** : Mensuelle
- **Audience** : Direction financière

---

## 6. 🎯 FONCTIONNALITÉS AVANCÉES

### 6.1 Alertes Automatiques
- Seuils d'occupation bas/élevés
- Délais de paiement dépassés
- Anomalies de revenus
- Pics de réservations/annulations

### 6.2 Rapports Automatisés
- Rapport quotidien d'activité
- Synthèse hebdomadaire
- Bilan mensuel
- Rapport annuel

### 6.3 Comparaisons Temporelles
- Même période année précédente
- Évolution vs objectifs
- Benchmarking interne

### 6.4 Exports et Intégrations
- Export Excel/PDF des rapports
- API pour systèmes tiers
- Envoi automatique par email

---

## 7. 🔧 DONNÉES NÉCESSAIRES ET AMÉLIORATIONS

### 7.1 Données Actuelles Utilisables
- ✅ Tables clients, réservations, locations, paiements
- ✅ Informations démographiques
- ✅ Historique des séjours

### 7.2 Données à Enrichir
- ❓ Source des réservations (canal)
- ❓ Enquêtes de satisfaction
- ❓ Événements locaux
- ❓ Commentaires clients

### 7.3 Nouvelles Tables à Considérer
- `satisfaction_surveys`
- `marketing_campaigns` 
- `local_events`
- `competitor_analysis`

---

## 📋 Conclusion

Ce plan couvre l'ensemble des analyses possibles avec les données actuelles et propose des extensions pour enrichir les insights. Chaque statistique est accompagnée de ses preuves (données sources) et de suggestions de visualisation.

**Priorités suggérées :**
1. 🔥 Métriques financières (RevPAR, ADR, CA)
2. 🔥 Analyse d'occupation
3. 🔥 Performance client
4. 📊 Analyses prédictives
5. 🎯 Tableaux de bord temps réel 