import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

// Layouts
import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

// Pages principales
const Dashboard = () => import('@/views/Dashboard.vue')
const Locations = () => import('@/views/Locations.vue')
const Reservations = () => import('@/views/Reservations.vue')
const Clients = () => import('@/views/Clients.vue')
const Calendar = () => import('@/views/Calendar.vue')
const Reports = () => import('@/views/Reports.vue')

// Structure hôtelière
const HotelStructure = () => import('@/views/hotel-structure/HotelStructure.vue')
const Floors = () => import('@/views/hotel-structure/Floors.vue')
const RoomTypes = () => import('@/views/hotel-structure/RoomTypes.vue')
const Rooms = () => import('@/views/hotel-structure/Rooms.vue')
const PriceManager = () => import('@/views/hotel-structure/PriceManager.vue')
const Coupons = () => import('@/views/hotel-structure/Coupons.vue')
const Housekeeping = () => import('@/views/hotel-structure/Housekeeping.vue')

// Administration
const Administration = () => import('@/views/administration/Administration.vue')
const Expenses = () => import('@/views/administration/Expenses.vue')
const Employees = () => import('@/views/administration/Employees.vue')
const Statistics = () => import('@/views/administration/Statistics.vue')

// Autres pages
const BookedRooms = () => import('@/views/BookedRooms.vue')
const Login = () => import('@/views/Login.vue')
const NotFound = () => import('@/views/NotFound.vue')

const routes = [
  // Route de connexion
  {
    path: '/login',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'Login',
        component: Login,
        meta: { 
          title: 'Connexion',
          public: true
        }
      }
    ]
  },

  // Routes principales (protégées)
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard,
        meta: { 
          title: 'Tableau de bord',
          breadcrumb: [{ text: 'Accueil', active: true }],
          adminOnly: true
        },
        beforeEnter: (to, from, next) => {
          const authStore = useAuthStore()
          if (!authStore.isAdmin) {
            next({ name: 'Locations' })
          } else {
            next()
          }
        }
      },
      {
        path: '/locations',
        name: 'Locations',
        component: Locations,
        meta: { 
          title: 'Locations',
          breadcrumb: [
            { text: 'Accueil', to: '/' },
            { text: 'Locations', active: true }
          ]
        }
      },
      {
        path: '/reservations',
        name: 'Reservations',
        component: Reservations,
        meta: { 
          title: 'Réservations',
          breadcrumb: [
            { text: 'Accueil', to: '/' },
            { text: 'Réservations', active: true }
          ]
        }
      },
      {
        path: '/clients',
        name: 'Clients',
        component: Clients,
        meta: { 
          title: 'Clients',
          breadcrumb: [
            { text: 'Accueil', to: '/' },
            { text: 'Clients', active: true }
          ]
        }
      },
      {
        path: '/calendar',
        name: 'Calendar',
        component: Calendar,
        meta: { 
          title: 'Calendrier',
          breadcrumb: [
            { text: 'Accueil', to: '/' },
            { text: 'Calendrier', active: true }
          ]
        }
      },
      {
        path: '/reports',
        name: 'Reports',
        component: Reports,
        meta: { 
          title: 'Rapports',
          breadcrumb: [
            { text: 'Accueil', to: '/' },
            { text: 'Rapports', active: true }
          ]
        }
      },
      {
        path: '/booked-rooms',
        name: 'BookedRooms',
        component: BookedRooms,
        meta: { 
          title: 'Chambres occupées',
          breadcrumb: [
            { text: 'Accueil', to: '/' },
            { text: 'Chambres occupées', active: true }
          ]
        }
      },

      // Structure hôtel
      {
        path: '/hotel-structure',
        component: HotelStructure,
        meta: { 
          title: 'Structure Hôtel',
          breadcrumb: [
            { text: 'Accueil', to: '/' },
            { text: 'Structure Hôtel', active: true }
          ],
          adminOnly: true
        },
        beforeEnter: (to, from, next) => {
          const authStore = useAuthStore()
          if (!authStore.isAdmin) {
            next({ name: 'Locations' })
          } else {
            next()
          }
        },
        children: [
          {
            path: '',
            name: 'RoomTypes',
            component: RoomTypes,
            meta: { title: 'Types de chambres' }
          },
          {
            path: 'floors',
            name: 'Floors',
            component: Floors,
            meta: { title: 'Étages' }
          },
          {
            path: 'rooms',
            name: 'Rooms',
            component: Rooms,
            meta: { title: 'Chambres' }
          },
          {
            path: 'price-manager',
            name: 'PriceManager',
            component: PriceManager,
            meta: { title: 'Gestionnaire de prix' }
          },
          {
            path: 'coupons',
            name: 'Coupons',
            component: Coupons,
            meta: { title: 'Coupons' }
          },
          {
            path: 'housekeeping',
            name: 'Housekeeping',
            component: Housekeeping,
            meta: { title: 'Entretien' }
          }
        ]
      },

      // Administration
      {
        path: '/administration',
        component: Administration,
        meta: { 
          title: 'Administration',
          breadcrumb: [
            { text: 'Accueil', to: '/' },
            { text: 'Administration', active: true }
          ],
          adminOnly: true
        },
        beforeEnter: (to, from, next) => {
          const authStore = useAuthStore()
          if (!authStore.isAdmin) {
            next({ name: 'Locations' })
          } else {
            next()
          }
        },
        children: [
          {
            path: '',
            name: 'Statistics',
            component: Statistics,
            meta: { title: 'Statistiques' }
          },
          {
            path: 'expenses',
            name: 'Expenses',
            component: Expenses,
            meta: { title: 'Dépenses' }
          },
          {
            path: 'employees',
            name: 'Employees',
            component: Employees,
            meta: { title: 'Employés' }
          }
        ]
      }
    ]
  },

  // 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { 
      title: 'Page non trouvée',
      public: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

// Guard d'authentification global - même logique que l'ancien système
router.beforeEach(async (to, from) => {
  const authStore = useAuthStore()
  
  // Si la route est publique, autoriser l'accès
  if (to.meta.public) {
    return true
  }

  // Si pas de token, rediriger vers login
  if (!authStore.token) {
    return { 
      name: 'Login',
      query: { redirect: to.fullPath }
    }
  }

  // Vérifier la validité du token avec l'API
  try {
    const apiUrl = authStore.apiUrl
    await axios.post(`${apiUrl}auth/token/verify/`, { 
      token: authStore.token 
    })
    
    return true
  } catch (error) {
    console.warn('Token invalide, redirection vers login:', error)
    authStore.logout()
    
    return { 
      name: 'Login',
      query: { redirect: to.fullPath }
    }
  }
})

// Mise à jour du titre de la page
router.afterEach((to) => {
  const title = to.meta.title ? `${to.meta.title} - Paradisias Hotel` : 'Paradisias Hotel'
  document.title = title
})

export default router
