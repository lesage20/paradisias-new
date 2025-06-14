# Composants UI Réutilisables

Ce dossier contient les composants UI réutilisables qui s'adaptent automatiquement au thème courant.

## DataTable

Composant de tableau avancé avec pagination, tri, sélection et actions en lot.

### Utilisation de base

```vue
<template>
  <DataTable
    title="Ma liste"
    :items="items"
    :columns="columns"
    :selectable="true"
    :pagination="paginationConfig"
    @update:current-page="currentPage = $event"
    @update:items-per-page="itemsPerPage = $event"
    @selection-change="selectedItems = $event"
    @sort="handleSort"
  />
</template>

<script setup>
import { DataTable } from '@/components/ui'

const columns = [
  {
    key: 'name',
    label: 'Nom',
    sortable: true
  },
  {
    key: 'email',
    label: 'Email',
    sortable: true
  },
  {
    key: 'status',
    label: 'Statut',
    type: 'badge',
    sortable: true
  },
  {
    key: 'created_at',
    label: 'Date',
    type: 'date',
    sortable: true
  }
]
</script>
```

### Types de colonnes supportés

- `text` (par défaut) : Texte simple
- `user` : Affiche une icône utilisateur avec la couleur du thème
- `badge` : Badge de statut coloré
- `date` : Date formatée
- `currency` : Montant en euros

### Slots disponibles

- `#header` : En-tête personnalisé
- `#bulk-actions` : Actions en lot
- `#column-{key}` : Colonne personnalisée
- `#actions` : Actions par ligne
- `#empty-icon` : Icône pour l'état vide

## Pagination

Composant de pagination qui s'adapte au thème courant.

### Utilisation

```vue
<template>
  <Pagination
    :current-page="currentPage"
    :total-pages="totalPages"
    :total-items="totalItems"
    :items-per-page="itemsPerPage"
    @update:current-page="currentPage = $event"
    @update:items-per-page="itemsPerPage = $event"
  />
</template>

<script setup>
import { Pagination } from '@/components/ui'
</script>
```

## Adaptation au thème

Tous les composants utilisent automatiquement les couleurs du thème courant :

- **Page active** de la pagination : couleur primaire du thème
- **Icônes utilisateur** : couleur primaire du thème
- **Checkboxes** : couleur primaire du thème pour le focus
- **Flèches de tri** : couleur primaire du thème quand actives

Les composants récupèrent automatiquement les classes du thème via `useThemeStore().themeClasses`. 