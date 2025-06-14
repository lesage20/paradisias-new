<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <!-- En-tête du tableau -->
    <div v-if="title || $slots.header" class="px-6 py-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div>
          <h3 v-if="title" class="text-lg font-semibold text-gray-900">{{ title }}</h3>
          <p v-if="subtitle" class="text-sm text-gray-600 mt-1">{{ subtitle }}</p>
        </div>
        <div v-if="$slots.header">
          <slot name="header"></slot>
        </div>
      </div>
    </div>

    <!-- Actions en lot -->
    <div v-if="selectedItems.length > 0" class="px-6 py-3 bg-blue-50 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <span class="text-sm text-blue-700">
          {{ selectedItems.length }} élément(s) sélectionné(s)
        </span>
        <div class="flex items-center space-x-2">
          <slot name="bulk-actions" :selectedItems="selectedItems"></slot>
        </div>
      </div>
    </div>

    <!-- Tableau -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <!-- En-tête des colonnes -->
        <thead class="bg-gray-50">
          <tr>
            <!-- Checkbox de sélection globale -->
            <th v-if="selectable" class="w-12 px-6 py-3">
              <input
                type="checkbox"
                :checked="allSelected"
                @change="toggleAllSelection"
                :class="[
                  'rounded border-gray-300 focus:ring-2 focus:ring-offset-0',
                  themeClasses.checkboxFocus
                ]"
              >
            </th>
            
            <!-- Colonnes -->
            <th
              v-for="column in columns"
              :key="column.key"
              :class="[
                'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                column.sortable ? 'cursor-pointer hover:bg-gray-100' : '',
                column.width ? `w-${column.width}` : ''
              ]"
              @click="column.sortable ? handleSort(column.key) : null"
            >
              <div class="flex items-center space-x-1">
                <span>{{ column.label }}</span>
                <div v-if="column.sortable" class="flex flex-col">
                  <ChevronUp 
                    :class="[
                      'w-3 h-3 transition-colors',
                      sortBy === column.key && sortOrder === 'asc' 
                        ? themeClasses.textPrimary 
                        : 'text-gray-400'
                    ]" 
                  />
                  <ChevronDown 
                    :class="[
                      'w-3 h-3 -mt-1 transition-colors',
                      sortBy === column.key && sortOrder === 'desc' 
                        ? themeClasses.textPrimary 
                        : 'text-gray-400'
                    ]" 
                  />
                </div>
              </div>
            </th>
            
            <!-- Colonne d'actions -->
            <th v-if="$slots.actions" class="w-20 px-6 py-3">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        
        <!-- Corps du tableau -->
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="(item, index) in items"
            :key="getItemKey(item, index)"
            :class="[
              'hover:bg-gray-50 transition-colors',
              selectedItems.includes(getItemKey(item, index)) ? 'bg-blue-50' : ''
            ]"
          >
            <!-- Checkbox de sélection -->
            <td v-if="selectable" class="px-6 py-4">
              <input
                type="checkbox"
                :checked="selectedItems.includes(getItemKey(item, index))"
                @change="toggleItemSelection(getItemKey(item, index))"
                :class="[
                  'rounded border-gray-300 focus:ring-2 focus:ring-offset-0',
                  themeClasses.checkboxFocus
                ]"
              >
            </td>
            
            <!-- Cellules de données -->
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-4 whitespace-nowrap"
            >
              <!-- Slot personnalisé pour la colonne -->
              <slot
                v-if="$slots[`column-${column.key}`]"
                :name="`column-${column.key}`"
                :item="item"
                :value="getNestedValue(item, column.key)"
                :themeClasses="themeClasses"
              ></slot>
              
              <!-- Rendu par défaut -->
              <div v-else :class="column.class || 'text-sm text-gray-900'">
                <!-- Icône utilisateur avec couleur du thème -->
                <div v-if="column.type === 'user'" class="flex items-center space-x-3">
                  <div :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium',
                    themeClasses.bgPrimary
                  ]">
                    <User class="w-4 h-4" />
                  </div>
                  <span>{{ getNestedValue(item, column.key) }}</span>
                </div>
                
                <!-- Badge de statut -->
                <span v-else-if="column.type === 'badge'" :class="getBadgeClass(getNestedValue(item, column.key))">
                  {{ getNestedValue(item, column.key) }}
                </span>
                
                <!-- Date formatée -->
                <span v-else-if="column.type === 'date'">
                  {{ formatDate(getNestedValue(item, column.key)) }}
                </span>
                
                <!-- Monnaie -->
                <span v-else-if="column.type === 'currency'">
                  {{ formatCurrency(getNestedValue(item, column.key)) }}
                </span>
                
                <!-- Texte simple -->
                <span v-else>
                  {{ getNestedValue(item, column.key) }}
                </span>
              </div>
            </td>
            
            <!-- Actions -->
            <td v-if="$slots.actions" class="px-6 py-4 text-right text-sm font-medium">
              <slot name="actions" :item="item" :index="index" :themeClasses="themeClasses"></slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Message si aucune donnée -->
    <div v-if="items.length === 0" class="px-6 py-12 text-center">
      <div class="text-gray-400 mb-2">
        <slot name="empty-icon">
          <Database class="w-12 h-12 mx-auto" />
        </slot>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-1">
        {{ emptyTitle || 'Aucune donnée' }}
      </h3>
      <p class="text-gray-500">
        {{ emptyMessage || 'Aucun élément à afficher pour le moment.' }}
      </p>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && items.length > 0" class="px-6 py-4 border-t border-gray-200">
      <Pagination
        :current-page="pagination.currentPage"
        :total-pages="pagination.totalPages"
        :total-items="pagination.totalItems"
        :items-per-page="pagination.itemsPerPage"
        @update:current-page="$emit('update:currentPage', $event)"
        @update:items-per-page="$emit('update:itemsPerPage', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { ChevronUp, ChevronDown, User, Database } from 'lucide-vue-next'
import Pagination from './Pagination.vue'

// Props
const props = defineProps({
  title: String,
  subtitle: String,
  items: {
    type: Array,
    required: true
  },
  columns: {
    type: Array,
    required: true
  },
  selectable: {
    type: Boolean,
    default: false
  },
  itemKey: {
    type: String,
    default: 'id'
  },
  emptyTitle: String,
  emptyMessage: String,
  pagination: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['update:currentPage', 'update:itemsPerPage', 'sort', 'selection-change'])

// Store
const themeStore = useThemeStore()

// State
const selectedItems = ref([])
const sortBy = ref('')
const sortOrder = ref('asc')

// Computed
const themeClasses = computed(() => themeStore.themeClasses)

const allSelected = computed(() => {
  return props.items.length > 0 && selectedItems.value.length === props.items.length
})

// Méthodes
const getItemKey = (item, index) => {
  return item[props.itemKey] || index
}

const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

const toggleAllSelection = () => {
  if (allSelected.value) {
    selectedItems.value = []
  } else {
    selectedItems.value = props.items.map((item, index) => getItemKey(item, index))
  }
  emit('selection-change', selectedItems.value)
}

const toggleItemSelection = (itemKey) => {
  const index = selectedItems.value.indexOf(itemKey)
  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(itemKey)
  }
  emit('selection-change', selectedItems.value)
}

const handleSort = (columnKey) => {
  if (sortBy.value === columnKey) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = columnKey
    sortOrder.value = 'asc'
  }
  emit('sort', { column: columnKey, order: sortOrder.value })
}

const getBadgeClass = (status) => {
  const baseClass = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
  
  switch (status?.toLowerCase()) {
    case 'actif':
    case 'active':
    case 'confirmé':
    case 'confirmed':
      return `${baseClass} bg-green-100 text-green-800`
    case 'inactif':
    case 'inactive':
    case 'annulé':
    case 'cancelled':
      return `${baseClass} bg-red-100 text-red-800`
    case 'en attente':
    case 'pending':
      return `${baseClass} bg-yellow-100 text-yellow-800`
    default:
      return `${baseClass} bg-gray-100 text-gray-800`
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('fr-FR')
}

const formatCurrency = (amount) => {
  if (amount == null) return '-'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}
</script> 