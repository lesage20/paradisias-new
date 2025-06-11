<template>
  <nav class="flex items-center space-x-2 text-sm">
    <div class="flex items-center space-x-2">
      <Home class="w-4 h-4 text-paradisias-500" />
      <RouterLink 
        to="/" 
        class="text-paradisias-600 hover:text-paradisias-800 transition-colors"
      >
        Accueil
      </RouterLink>
    </div>

    <template v-for="(breadcrumb, index) in breadcrumbs" :key="index">
      <ChevronRight class="w-4 h-4 text-gray-400" />
      <div class="flex items-center space-x-1">
        <component 
          v-if="breadcrumb.icon" 
          :is="breadcrumb.icon" 
          class="w-4 h-4 text-gray-500" 
        />
        <RouterLink
          v-if="breadcrumb.to && index < breadcrumbs.length - 1"
          :to="breadcrumb.to"
          class="text-gray-600 hover:text-gray-800 transition-colors"
        >
          {{ breadcrumb.label }}
        </RouterLink>
        <span
          v-else
          class="text-gray-900 font-medium"
        >
          {{ breadcrumb.label }}
        </span>
      </div>
    </template>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { 
  Home, ChevronRight, BarChart3, BookOpen, Calendar, Users, 
  Building, Settings, FileText, Building2
} from 'lucide-vue-next'

const route = useRoute()

// Mapping des icônes par route
const routeIcons = {
  'dashboard': BarChart3,
  'locations': BookOpen,
  'reservations': Calendar,
  'guests': Users,
  'booked-rooms': Building2,
  'calendar': Calendar,
  'reports': FileText,
  'hotel-structure': Building,
  'administration': Settings
}

// Génération automatique des breadcrumbs
const breadcrumbs = computed(() => {
  const breadcrumbs = []
  const pathSegments = route.path.split('/').filter(segment => segment)
  
  // Si on est sur la page d'accueil
  if (pathSegments.length === 0) {
    return []
  }

  let currentPath = ''
  
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    
    // Récupérer les informations de la route
    const routeName = route.matched[index + 1]?.name
    const routeMeta = route.matched[index + 1]?.meta
    
    let label = segment
    let icon = null
    
    // Si on a des métadonnées de route
    if (routeMeta?.title) {
      label = routeMeta.title
    } else if (routeMeta?.breadcrumb) {
      label = routeMeta.breadcrumb
    } else {
      // Traduction des segments par défaut
      const translations = {
        'locations': 'Locations',
        'reservations': 'Réservations', 
        'guests': 'Clients',
        'booked-rooms': 'Chambres occupées',
        'calendar': 'Calendrier',
        'reports': 'Rapports',
        'hotel-structure': 'Structure Hôtel',
        'administration': 'Administration',
        'floors': 'Étages',
        'rooms': 'Chambres',
        'price-manager': 'Gestionnaire de prix',
        'coupons': 'Coupons',
        'housekeeping': 'Entretien',
        'expenses': 'Dépenses',
        'employees': 'Employés',
        'statistics': 'Statistiques'
      }
      label = translations[segment] || segment
    }
    
    // Ajouter l'icône si c'est la première route
    if (index === 0 && routeIcons[routeName]) {
      icon = routeIcons[routeName]
    }
    
    breadcrumbs.push({
      label,
      to: currentPath,
      icon
    })
  })
  
  return breadcrumbs
})
</script> 