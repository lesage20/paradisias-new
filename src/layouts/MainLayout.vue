<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col"
           :class="{ '-translate-x-full': !sidebarOpen }">
      
      <!-- Logo/Header Section -->
      <div class="flex items-center justify-center h-32  px-6 bg-white   flex-shrink-0">
        <div class="flex items-center pt-9">
          <div class="w-50 h-50 flex items-center justify-center rounded-lg overflow-hidden">
            <img src="@/assets/images/logo2.png" alt="Logo Paradisias" class="w-full h-full object-cover">
          </div>
        </div>
      </div>

     

      <!-- Navigation Menu avec scroll -->
      <nav class="flex-1 px-4 pb-6 pt-3 space-y-2 overflow-y-auto">
        <div v-for="item in navigationItems" :key="item.name" class="space-y-1">
          <!-- Menu avec sous-items -->
          <div v-if="item.children && item.children.length > 0">
            <button @click="toggleExpanded(item.key)"
                    class="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <div class="flex items-center space-x-3">
                <component :is="item.icon" class="w-5 h-5" />
                <span>{{ item.name }}</span>
              </div>
              <ChevronDown class="w-4 h-4 transition-transform duration-200" 
                          :class="{ 'rotate-180': expandedItems[item.key] }" />
            </button>
            
            <!-- Sous-menu avec transition -->
            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-96"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 max-h-96"
              leave-to-class="opacity-0 max-h-0"
            >
              <div v-show="expandedItems[item.key]" class="ml-6 mt-2 space-y-1 overflow-hidden">
                <router-link v-for="child in item.children" :key="child.name" :to="child.to"
                            class="block px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                            :class="[
                              $route.name === child.routeName 
                                ? `${themeClasses.bgPrimaryLight} ${themeClasses.textPrimary} font-medium`
                                : `${themeClasses.hoverPrimary}`
                            ]">
                  {{ child.name }}
                </router-link>
              </div>
            </Transition>
          </div>

          <!-- Menu simple -->
          <router-link v-else :to="item.to"
                      class="flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                      :class="{ 
                        [themeClasses.activePrimary]: $route.name === item.routeName,
                        'text-gray-700 hover:bg-gray-100': $route.name !== item.routeName 
                      }">
            <component :is="item.icon" class="w-5 h-5" />
            <span>{{ item.name }}</span>
          </router-link>
        </div>
      </nav>

      <!-- Footer du sidebar -->
       
      <div class="px-4 py-2 border-t border-gray-200 flex-shrink-0">
        <!-- User Profile Section -->
       <div class="pb-2 border-b border-gray-200 flex-shrink-0">
        <div class="flex items-center space-x-3">
          <div class="relative">
            <div :class="[
              'w-12 h-12 rounded-full flex items-center justify-center',
              isAdmin ? themeClasses.bgPrimary : themeClasses.bgSecondary
            ]">
              <component :is="isAdmin ? Shield : User" class="w-6 h-6 text-white" />
              <!-- <img src="@/assets/images/logo3.png" alt="logo" class="w-12 h-12 rounded-full"> -->
            </div>
            <!-- Status en ligne -->
            <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ authStore.user.username }}</p>
            <p class="text-xs text-gray-500">{{ userRole }}</p>
          </div>
        </div>
      </div>
        <button @click="logout"
                class="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors">
          <LogOut class="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>

    <!-- Contenu principal -->
    <div class="lg:ml-64">
      <!-- Header mobile -->
      <header class="lg:hidden bg-white shadow-sm border-b border-gray-200">
        <div class="flex items-center justify-between px-4 py-3">
          <button @click="sidebarOpen = !sidebarOpen"
                  class="p-2 text-gray-600 hover:text-gray-900 focus:outline-none">
            <Menu class="w-6 h-6" />
          </button>
          
          <div class="flex items-center space-x-3">
            <div :class="[
              'w-8 h-8 rounded-lg flex items-center justify-center',
              themeClasses.bgPrimary
            ]">
              <Building2 class="w-5 h-5 text-white" />
            </div>
            <span class="font-bold text-gray-900">Paradisias</span>
          </div>

          <div class="w-10"></div> <!-- Spacer pour centrer le logo -->
        </div>
      </header>

      <!-- Zone de contenu principal -->
      <main class="min-h-screen">
        <!-- Header de page avec breadcrumbs -->
        <div class="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ pageTitle }}</h1>
              <!-- <nav class="flex mt-1" aria-label="Breadcrumb">
                <ol class="flex items-center space-x-2">
                  <li>
                    <router-link to="/" :class="[
                      'transition-colors',
                      themeClasses.hoverPrimary,
                      'text-gray-500'
                    ]">
                      <Home class="w-4 h-4" />
                    </router-link>
                  </li>
                  <li v-for="(crumb, index) in breadcrumbs" :key="index" class="flex items-center">
                    <ChevronRight class="w-4 h-4 text-gray-400 mx-2" />
                    <span class="text-sm font-medium text-gray-900">{{ crumb }}</span>
                  </li>
                </ol>
              </nav> -->
            </div>

            <!-- Actions de la page -->
            <div class="flex items-center space-x-3">
              <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell class="w-5 h-5" />
              </button>
              <button @click="showThemeSettings = true" 
                      :class="[
                        'p-2 transition-colors',
                        themeClasses.hoverPrimary,
                        'text-gray-400'
                      ]">
                <Settings class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Contenu de la page -->
        <div class="p-6">
          <RouterView />
        </div>
      </main>
    </div>

    <!-- Overlay pour mobile -->
    <div v-if="sidebarOpen" @click="sidebarOpen = false"
         class="fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity"></div>

    <!-- Panneau de paramètres de thème -->
    <ThemeSettings 
      :is-open="showThemeSettings" 
      @close="showThemeSettings = false" 
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import ThemeSettings from '@/components/ThemeSettings.vue'
import { 
  Building2, User, Shield, Menu, LogOut, Home, ChevronRight, ChevronDown,
  LayoutDashboard, MapPin, Users, Calendar, FileText, Bed, Settings, Bell,
  Hotel, DollarSign, UserCheck, BarChart3, Archive, ClipboardList, UserCog
} from 'lucide-vue-next'

// Stores et router
const authStore = useAuthStore()
const themeStore = useThemeStore()
const route = useRoute()
const router = useRouter()

// État local
const sidebarOpen = ref(false)
const showThemeSettings = ref(false)

// État pour gérer les menus expandables
const expandedItems = ref({
  structure: false,
  administration: false
})

// Computed
const isAdmin = computed(() => authStore.isAdmin)
const userRole = computed(() => authStore.userRole || 'Personnel')
const themeClasses = computed(() => themeStore.themeClasses)

// Titre de la page basé sur la route
const pageTitle = computed(() => {
  const titles = {
    'Dashboard': 'Tableau de bord',
    'Locations': 'Séjour',
    'Reservations': 'Réservations', 
    'Clients': 'Clients',
    'Calendar': 'Calendrier',
    'Reports': 'Rapports',
    'BookedRooms': 'Chambres occupées',
    'PriceManagement': 'Gestion des Prix',
    'HotelStructure': 'Structure hôtelière',
    'RoomTypes': 'Types de chambres',
    'Floors': 'Étages',
    'Rooms': 'Chambres',
    'PriceManager': 'Gestionnaire de prix',
    'Coupons': 'Coupons',
    'Housekeeping': 'Ménage',
    'Administration': 'Administration',
    'Statistics': 'Statistiques',
    'Expenses': 'Dépenses',
    'Employees': 'Employés'
  }
  return titles[route.name] || 'Paradisias Hotel'
})

// Breadcrumbs basés sur la route
const breadcrumbs = computed(() => {
  const parts = []
  if (route.matched.length > 1) {
    for (let i = 1; i < route.matched.length; i++) {
      const match = route.matched[i]
      if (match.name && match.name !== 'Dashboard') {
        const titles = {
          'HotelStructure': 'Structure',
          'Administration': 'Administration',
          'RoomTypes': 'Types de chambres',
          'Floors': 'Étages', 
          'Rooms': 'Chambres',
          'PriceManager': 'Prix',
          'Coupons': 'Coupons',
          'Housekeeping': 'Ménage',
          'Statistics': 'Statistiques',
          'Expenses': 'Dépenses',
          'Employees': 'Employés'
        }
        parts.push(titles[match.name] || match.name)
      }
    }
  }
  return parts
})

// Navigation items
const navigationItems = computed(() => {
  const adminItems = [
    {
      name: 'Tableau de bord',
      icon: LayoutDashboard,
      to: '/dashboard',
      routeName: 'Dashboard'
    },
    {
      name: 'Séjours',
      icon: MapPin,
      to: '/locations',
      routeName: 'Locations'
    },
    {
      name: 'Réservations',
      icon: ClipboardList,
      to: '/reservations',
      routeName: 'Reservations'
    },
    {
      name: 'Clients',
      icon: Users,
      to: '/clients',
      routeName: 'Clients'
    },
    {
      name: 'Chambres occupées',
      icon: Bed,
      to: '/booked-rooms',
      routeName: 'BookedRooms'
    },
    {
      name: 'Paiements',
      icon: DollarSign,
      to: '/price-management',
      routeName: 'PriceManagement'
    },
    {
      name: 'Calendrier',
      icon: Calendar,
      to: '/calendar',
      routeName: 'Calendar'
    },
    {
      name: 'Rapports',
      icon: FileText,
      to: '/reports',
      routeName: 'Reports'
    },
    {
      name: 'Structure hôtelière',
      icon: Hotel,
      key: 'structure',
      children: [
        { name: 'Types de chambres', to: '/structure/room-types', routeName: 'RoomTypes' },
        { name: 'Étages', to: '/structure/floors', routeName: 'Floors' },
        { name: 'Chambres', to: '/structure/rooms', routeName: 'Rooms' },
        { name: 'Coupons', to: '/structure/coupons', routeName: 'Coupons' },
        // { name: 'Ménage', to: '/structure/housekeeping', routeName: 'Housekeeping' }
      ]
    },
    {
      name: 'Administration',
      icon: UserCog,
      key: 'administration',
      children: [
        { name: 'Employés', to: '/administration/employees', routeName: 'Employees' },
        { name: 'Dépenses', to: '/administration/expenses', routeName: 'Expenses' },
        { name: 'Statistiques', to: '/administration/statistics', routeName: 'Statistics' }
      ]
    }
  ]

  const staffItems = [
    {
      name: 'Tableau de bord',
      icon: LayoutDashboard,
      to: '/dashboard',
      routeName: 'Dashboard'
    },
    {
      name: 'Locations',
      icon: MapPin,
      to: '/locations',
      routeName: 'Locations'
    },
    {
      name: 'Réservations',
      icon: ClipboardList,
      to: '/reservations',
      routeName: 'Reservations'
    },
    {
      name: 'Clients',
      icon: Users,
      to: '/clients',
      routeName: 'Clients'
    },
    {
      name: 'Chambres occupées',
      icon: Bed,
      to: '/booked-rooms',
      routeName: 'BookedRooms'
    },
    {
      name: 'Calendrier',
      icon: Calendar,
      to: '/calendar',
      routeName: 'Calendar'
    },
    {
      name: 'Rapports',
      icon: FileText,
      to: '/reports',
      routeName: 'Reports'
    }
  ]

  return isAdmin.value ? adminItems : staffItems
})

// Méthodes
const toggleExpanded = (key) => {
  expandedItems.value[key] = !expandedItems.value[key]
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}

// Gestion du responsive
const handleResize = () => {
  if (window.innerWidth >= 1024) {
    sidebarOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script> 