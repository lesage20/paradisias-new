<template>
  <div class="space-y-6">
    <!-- Header avec sélecteur de période -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-lg font-medium text-gray-900">Tableau de bord</h2>
        <p class="mt-1 text-sm text-gray-500">
          Vue d'ensemble de votre activité hôtelière
        </p>
      </div>

      <div class="mt-4 sm:mt-0 flex items-center space-x-3">
        <select v-model="selectedPeriod" @change="updatePeriod"
          class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500">
          <option value="today">Aujourd'hui</option>
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
          <option value="quarter">Ce trimestre</option>
          <option value="year">Cette année</option>
        </select>

        <button @click="refreshData" :disabled="isLoading" :class="[
          'inline-flex items-center px-3 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-colors',
          themeClasses.btnPrimary
        ]">
          <RefreshCw class="w-4 h-4 mr-2" :class="{ 'animate-spin': isLoading }" />
          Actualiser
        </button>
      </div>
    </div>

    <!-- Métriques principales (hiérarchie: Propriétaire > Gérant > Personnel) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Métriques pour Propriétaire (admin) - Voit TOUT -->
      <template v-if="userRole === 'admin'">
        <!-- Métriques stratégiques -->
        <MetricCard title="Revenus" :value="formatCurrency(metrics.revenu_total)"
          :previousValue="formatCurrency(metrics.revenu_total_precedent)" icon="DollarSign" color="green" />

        <MetricCard title="Taux d'occupation" :value="metrics.taux_occupation + ' %'"
          :previousValue="metrics.taux_occupation_precedent + ' %'" icon="BarChart3" color="blue" />

        <MetricCard title="RevPAR" :value="formatCurrency(metrics.revpar)"
          :previousValue="formatCurrency(metrics.revpar_precedent)" icon="TrendingUp" color="purple" />

        <MetricCard title="Nombre de séjours" :value="metrics.nombre_locations"
          :previousValue="metrics.nombre_locations_precedent" icon="Users" color="yellow" />
      </template>

      <!-- Métriques pour Gérant - Vue opérationnelle + quelques stratégiques -->
      <template v-else-if="userRole === 'manager'">
        <MetricCard title="Revenus du jour" :value="formatCurrency(Number(metrics.revenus_jour))"
          :previousValue="formatCurrency(metrics.revenu_total_precedent)" icon="DollarSign" color="green" />

        <MetricCard title="Taux d'occupation" :value="metrics.occupancyRate + '%'"
          :previousValue="metrics.previousOccupancyRate + '%'" :trend="metrics.occupancyTrend" icon="BarChart3"
          color="blue" />

        <MetricCard title="Locations actives" :value="metrics.locations_actives"
          :previousValue="metrics.previousActiveBookings" :trend="metrics.activeBookingsTrend" icon="Calendar"
          color="purple" />

        <MetricCard title="Satisfaction" :value="metrics.satisfaction + '/5'"
          :previousValue="metrics.previousSatisfaction + '/5'" :trend="metrics.satisfactionTrend" icon="Star"
          color="yellow" />
      </template>

      <!-- Métriques pour Personnel/Caissier - Vue limitée aux opérations quotidiennes -->
      <template v-else>
        <MetricCard title="Revenus du jour" :value="formatCurrency(metrics.revenus_jour)"
          :previousValue="formatCurrency(metrics.previousDailyRevenue)" :trend="metrics.dailyRevenueTrend"
          icon="DollarSign" color="green" />

        <MetricCard title="Locations actives" :value="metrics.locations_actives"
          :previousValue="metrics.previousActiveBookings" :trend="metrics.activeBookingsTrend" icon="Calendar"
          color="blue" />

        <MetricCard title="Check-ins prévus" :value="metrics.entrees_prevues" icon="UserCheck" color="purple"
          :showTrend="false" />

        <MetricCard title="Check-outs prévus" :value="metrics.sorties_prevues" icon="UserX" color="orange"
          :showTrend="false" />
      </template>
    </div>


    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Graphique principal (adapté selon le profil) -->
      <div class="lg:col-span-2">
        <DashboardChart :user-role="userRole" :period="selectedPeriod" />
      </div>

      <!-- État des chambres avec ApexCharts -->
      <RoomStatusChart ref="roomStatusChartRef" />
    </div>

    <!-- Transactions récentes et alertes -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Transactions récentes -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-medium text-gray-900">Transactions récentes</h3>
          <router-link to="/price-management" :class="[
            'text-sm font-medium transition-colors',
            themeClasses.textPrimary,
            themeClasses.hoverPrimary
          ]">
            Voir tout
          </router-link>
        </div>

        <div class="space-y-4">
          <div v-for="transaction in recentTransactions" :key="transaction.id"
            class="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
            <div class="flex items-center space-x-3">
              <div :class="[
                'w-10 h-10 rounded-full flex items-center justify-center',
                'bg-green-100 text-green-600'
              ]">
                <component :is="User" class="w-5 h-5" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 mb-1">{{ transaction.booking_details.guest_name }} <span
                    class="text-xs text-gray-500"> Effectué {{ formatTimeAgo(transaction.created_at) }}</span></p>
                <p class="text-xs text-gray-500">
                  Chambre <b>{{ transaction.booking_details.room_number }}</b>
                  du <b>{{ format(transaction.booking_details.check_in, 'dd/MM/yyyy') }}</b> au <b>{{
                    format(transaction.booking_details.check_out, 'dd/MM/yyyy') }}</b>
                </p>
              </div>
            </div>
            <span :class="[
              'text-sm font-medium', 'text-green-600'
            ]">
              +{{ formatCurrency(transaction.amount) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Alertes et notifications -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-medium text-gray-900">Alertes et notifications</h3>
          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            {{ alerts.length }} nouvelles
          </span>
        </div>

        <div class="space-y-4">
          <div v-for="alert in alerts" :key="alert.id" class="flex items-start space-x-3 p-3 rounded-lg border" :class="[
            alert.priority === 'high' ? 'bg-red-50 border-red-200' :
              alert.priority === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                'bg-blue-50 border-blue-200'
          ]">
            <component :is="alert.icon" :class="[
              'w-5 h-5 mt-0.5',
              alert.priority === 'high' ? 'text-red-500' :
                alert.priority === 'medium' ? 'text-yellow-500' :
                  'text-blue-500'
            ]" />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900">{{ alert.title }}</p>
              <p class="text-xs text-gray-600 mt-1">{{ alert.message }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ alert.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions (hiérarchie des permissions) -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-6">Actions rapides</h3>

      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <!-- Actions pour Propriétaire (admin) - Accès complet -->
        <template v-if="userRole === 'admin'">
          <QuickActionButton icon="Plus" label="Nouvelle location" @click="$router.push('/locations')" color="green" />
          <QuickActionButton icon="Users" label="Gérer clients" @click="$router.push('/clients')" color="blue" />
          <QuickActionButton icon="FileText" label="Rapports" @click="$router.push('/reports')" color="purple" />
          <QuickActionButton icon="Settings" label="Configuration" @click="$router.push('/structure')" color="gray" />
          <QuickActionButton icon="BarChart3" label="Statistiques" @click="$router.push('/administration/statistics')"
            color="indigo" />
          <QuickActionButton icon="Calendar" label="Calendrier" @click="$router.push('/calendar')" color="orange" />
        </template>

        <!-- Actions pour Gérant - Gestion opérationnelle -->
        <template v-else-if="userRole === 'manager'">
          <QuickActionButton icon="Plus" label="Nouvelle location" @click="$router.push('/locations')" color="green" />
          <QuickActionButton icon="Users" label="Gérer clients" @click="$router.push('/clients')" color="blue" />
          <QuickActionButton icon="Calendar" label="Check-ins" @click="$router.push('/booked-rooms')" color="purple" />
          <QuickActionButton icon="UserCheck" label="Réservations" @click="$router.push('/reservations')"
            color="indigo" />
          <QuickActionButton icon="FileText" label="Rapports" @click="$router.push('/reports')" color="orange" />
          <QuickActionButton icon="BarChart3" label="Statistiques" @click="$router.push('/administration/statistics')"
            color="gray" />
        </template>

        <!-- Actions pour Personnel/Caissier - Opérations de base -->
        <template v-else>
          <QuickActionButton icon="Plus" label="Nouvelle location" @click="$router.push('/locations')" color="green" />
          <QuickActionButton icon="Calendar" label="Check-ins" @click="$router.push('/booked-rooms')" color="blue" />
          <QuickActionButton icon="UserCheck" label="Réservations" @click="$router.push('/reservations')"
            color="purple" />
          <QuickActionButton icon="FileText" label="Rapports" @click="$router.push('/reports')" color="orange" />
        </template>
      </div>
    </div>

    <!-- Boutons de test pour le système d'alertes (à supprimer après test) -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Test du système d'alertes</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button @click="testToasts"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Test Toasts
        </button>
        <button @click="testAlerts"
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
          Test Alertes
        </button>
        <button @click="testConfirm"
          class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
          Test Confirmation
        </button>
        <button @click="testLoading"
          class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
          Test Loading
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { useAlerts } from '@/composables/useAlerts'
import MetricCard from '@/components/dashboard/MetricCard.vue'
import DashboardChart from '@/components/dashboard/DashboardChart.vue'
import RoomStatusChart from '@/components/dashboard/RoomStatusChart.vue'
import {
  RefreshCw, DollarSign, BarChart3, TrendingUp, Star, Calendar,
  UserCheck, UserX, User, Plus, ChevronDown, Minus
} from 'lucide-vue-next'
import QuickActionButton from '@/components/dashboard/QuickActionButton.vue'
import { reportsAPI, paymentsAPI } from '@/services/api'
import { format } from 'date-fns'

// Stores et composables
const authStore = useAuthStore()
const themeStore = useThemeStore()
const {
  showToast,
  showAlert,
  showConfirm,
  showLoading,
  handleApiError,
  handleApiSuccess
} = useAlerts()

// État
const isLoading = ref(false)
const selectedPeriod = ref('today')
const selectedChart = ref('revenue')
const roomStatusChartRef = ref(null)

// Computed
const userRole = computed(() => authStore.userRole)
const themeClasses = computed(() => themeStore.themeClasses)

// Options de graphiques selon le profil
const chartOptions = computed(() => {
  if (userRole.value === 'admin') {
    return [
      { key: 'revenue', label: 'Revenus' },
      { key: 'occupancy', label: 'Occupation' },
      // { key: 'satisfaction', label: 'Satisfaction' },
      // { key: 'forecast', label: 'Prévisions' },
      { key: 'daily', label: 'Journalier' },
      { key: 'bookings', label: 'Réservations' }
    ]
  } else if (userRole.value === 'manager') {
    return [
      { key: 'daily', label: 'Journalier' },
      { key: 'occupancy', label: 'Occupation' },
      { key: 'bookings', label: 'Réservations' },
      // { key: 'satisfaction', label: 'Satisfaction' }
    ]
  } else {
    return [
      { key: 'daily', label: 'Journalier' },
      { key: 'bookings', label: 'Réservations' },
      { key: 'payments', label: 'Paiements' }
    ]
  }
})

const getChartTitle = () => {
  if (userRole.value === 'admin') {
    return 'Analyse stratégique et opérationnelle'
  } else if (userRole.value === 'manager') {
    return 'Gestion opérationnelle'
  } else {
    return 'Activité quotidienne'
  }
}

// Données des métriques (remplacées par l'API)
const metrics = ref({
  // Métriques propriétaire/gérant
  revenue: 0,
  previousRevenue: 0,
  revenueTrend: 'stable',
  occupancyRate: 0,
  previousOccupancyRate: 0,
  occupancyTrend: 'stable',
  revpar: 0,
  previousRevpar: 0,
  revparTrend: 'stable',
  satisfaction: 0,
  previousSatisfaction: 0,
  satisfactionTrend: 'stable',

  // Métriques personnel/caissier
  dailyRevenue: 0,
  previousDailyRevenue: 0,
  dailyRevenueTrend: 'stable',
  activeBookings: 0,
  previousActiveBookings: 0,
  activeBookingsTrend: 'stable',
  expectedCheckins: 0,
  expectedCheckouts: 0
})

// Variables supprimées car maintenant gérées par le composant RoomStatusChart

const recentTransactions = ref([])

const alerts = ref([])

// Fonction pour récupérer les KPI depuis l'API via le service centralisé
const fetchKPIData = async () => {
  try {
    const data = await reportsAPI.getDashboardKPI(selectedPeriod.value)

    // Mise à jour des métriques avec les données de l'API
    if (data) {
      metrics.value = data
    }

    // Mise à jour des alertes
    if (data.alerts) {
      alerts.value = data.alerts
    }

  } catch (error) {
    console.error('Erreur lors de la récupération des KPI:', error)

    // En cas d'erreur d'authentification, le service API se charge déjà de la redirection
    // On peut juste afficher une notification à l'utilisateur ici

    throw error
  }
}

// Fonction pour récupérer les transactions récentes via l'API des paiements
const fetchRecentTransactions = async () => {
  try {
    // Récupérer les paiements récents (par exemple les 10 derniers)
    const payments = await paymentsAPI.getPayments({
      // Filtrer par date récente ou limiter le nombre de résultats
      // Les filtres exacts dépendent de votre API backend
    })

    // Transformer les données de paiements en format transaction pour l'affichage
    if (payments && Array.isArray(payments)) {
      recentTransactions.value = payments.slice(0, 10)
    }

  } catch (error) {
    console.error('Erreur lors de la récupération des transactions récentes:', error)
    // En cas d'erreur, on garde les transactions vides
    recentTransactions.value = []
  }
}

// Helper pour formater le temps écoulé
const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Date inconnue'

  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    return `il y a ${diffInMinutes} min`
  } else if (diffInHours < 24) {
    return `il y a ${diffInHours}h`
  } else {
    const diffInDays = Math.floor(diffInHours / 24)
    return `il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`
  }
}

// Méthodes
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-CI', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount)
}

const updatePeriod = () => {
  refreshData()
}

const refreshData = async () => {
  isLoading.value = true

  try {
    await Promise.all([
      fetchKPIData(),
      fetchRecentTransactions(),
      roomStatusChartRef.value?.refreshData()
    ])
    handleApiSuccess('Données actualisées avec succès!')
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
    handleApiError(error, 'Erreur lors de l\'actualisation des données')
  } finally {
    isLoading.value = false
  }
}

// Watcher pour recharger les données quand la période change
watch(selectedPeriod, () => {
  refreshData()
})

// Fonctions de test pour le système d'alertes (à supprimer après test)
const testToasts = () => {
  showToast.success('Succès! Opération réussie')
  setTimeout(() => showToast.error('Erreur! Quelque chose s\'est mal passé'), 1000)
  setTimeout(() => showToast.warning('Attention! Vérifiez vos données'), 2000)
  setTimeout(() => showToast.info('Information importante'), 3000)
}

const testAlerts = async () => {
  await showAlert.success('Succès!', 'Votre opération a été réalisée avec succès')
  await showAlert.error('Erreur!', 'Une erreur s\'est produite')
  await showAlert.warning('Attention!', 'Vérifiez vos données avant de continuer')
  await showAlert.info('Information', 'Voici une information importante')
}

const testConfirm = async () => {
  const result = await showConfirm.delete('Chambre 101')
  if (result.isConfirmed) {
    showToast.success('Élément supprimé!')
  } else {
    showToast.info('Suppression annulée')
  }
}

const testLoading = async () => {
  showLoading.show('Chargement des données...', 'Veuillez patienter')
  setTimeout(() => {
    showLoading.update('Finalisation...', 'Presque terminé')
  }, 2000)
  setTimeout(() => {
    showLoading.hide()
    showToast.success('Chargement terminé!')
  }, 4000)
}

onMounted(() => {
  refreshData()
})
</script>