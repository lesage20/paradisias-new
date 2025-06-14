<template>
  <div class="flex items-center justify-between">
    <!-- Informations sur les éléments -->
    <div class="flex items-center space-x-2">
      <span class="text-sm text-gray-700">Afficher</span>
      <select 
        :value="itemsPerPage" 
        @change="$emit('update:itemsPerPage', parseInt($event.target.value))"
        class="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:border-transparent"
        :class="`focus:ring-${themeStore.theme.colors.primary}`"
      >
        <option :value="10">10</option>
        <option :value="25">25</option>
        <option :value="50">50</option>
        <option :value="100">100</option>
      </select>
      <span class="text-sm text-gray-700">par page</span>
      <span class="text-sm text-gray-500 ml-4">
        {{ startItem }}-{{ endItem }} sur {{ totalItems }} éléments
      </span>
    </div>
    
    <!-- Navigation des pages -->
    <div class="flex items-center space-x-2">
      <!-- Bouton Précédent -->
      <button
        @click="$emit('update:currentPage', currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        Précédent
      </button>
      
      <!-- Numéros de pages -->
      <div class="flex items-center space-x-1">
        <!-- Première page si nécessaire -->
        <button
          v-if="showFirstPage"
          @click="$emit('update:currentPage', 1)"
          class="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          1
        </button>
        
        <!-- Points de suspension avant -->
        <span v-if="showStartEllipsis" class="px-2 text-gray-500">...</span>
        
        <!-- Pages visibles -->
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="$emit('update:currentPage', page)"
          :class="[
            'px-3 py-1 text-sm rounded transition-colors',
            currentPage === page
              ? `${themeClasses.bgPrimary} text-white`
              : 'border border-gray-300 hover:bg-gray-50'
          ]"
        >
          {{ page }}
        </button>
        
        <!-- Points de suspension après -->
        <span v-if="showEndEllipsis" class="px-2 text-gray-500">...</span>
        
        <!-- Dernière page si nécessaire -->
        <button
          v-if="showLastPage"
          @click="$emit('update:currentPage', totalPages)"
          class="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          {{ totalPages }}
        </button>
      </div>
      
      <!-- Bouton Suivant -->
      <button
        @click="$emit('update:currentPage', currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        Suivant
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

// Props
const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    required: true
  },
  maxVisiblePages: {
    type: Number,
    default: 5
  }
})

// Emits
defineEmits(['update:currentPage', 'update:itemsPerPage'])

// Store
const themeStore = useThemeStore()

// Computed
const themeClasses = computed(() => themeStore.themeClasses)

const startItem = computed(() => {
  return (props.currentPage - 1) * props.itemsPerPage + 1
})

const endItem = computed(() => {
  return Math.min(props.currentPage * props.itemsPerPage, props.totalItems)
})

const visiblePages = computed(() => {
  const pages = []
  const maxPages = props.maxVisiblePages
  let start = Math.max(1, props.currentPage - Math.floor(maxPages / 2))
  let end = Math.min(props.totalPages, start + maxPages - 1)
  
  // Ajuster le début si on est près de la fin
  if (end - start + 1 < maxPages) {
    start = Math.max(1, end - maxPages + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const showFirstPage = computed(() => {
  return visiblePages.value[0] > 1
})

const showLastPage = computed(() => {
  return visiblePages.value[visiblePages.value.length - 1] < props.totalPages
})

const showStartEllipsis = computed(() => {
  return visiblePages.value[0] > 2
})

const showEndEllipsis = computed(() => {
  return visiblePages.value[visiblePages.value.length - 1] < props.totalPages - 1
})
</script> 