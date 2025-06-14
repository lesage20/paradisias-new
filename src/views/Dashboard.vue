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
        
        <button @click="refreshData" :disabled="isLoading"
                :class="[
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
        <MetricCard
          title="Revenus"
          :value="formatCurrency(metrics.revenue)"
          :previousValue="formatCurrency(metrics.previousRevenue)"
          :trend="metrics.revenueTrend"
          icon="DollarSign"
          color="green"
        />
        
        <MetricCard
          title="Taux d'occupation"
          :value="metrics.occupancyRate + '%'"
          :previousValue="metrics.previousOccupancyRate + '%'"
          :trend="metrics.occupancyTrend"
          icon="BarChart3"
          color="blue"
        />
        
        <MetricCard
          title="RevPAR"
          :value="formatCurrency(metrics.revpar)"
          :previousValue="formatCurrency(metrics.previousRevpar)"
          :trend="metrics.revparTrend"
          icon="TrendingUp"
          color="purple"
        />
        
        <MetricCard
          title="Satisfaction"
          :value="metrics.satisfaction + '/5'"
          :previousValue="metrics.previousSatisfaction + '/5'"
          :trend="metrics.satisfactionTrend"
          icon="Star"
          color="yellow"
        />
      </template>

      <!-- Métriques pour Gérant - Vue opérationnelle + quelques stratégiques -->
      <template v-else-if="userRole === 'manager'">
        <MetricCard
          title="Revenus du jour"
          :value="formatCurrency(metrics.dailyRevenue)"
          :previousValue="formatCurrency(metrics.previousDailyRevenue)"
          :trend="metrics.dailyRevenueTrend"
          icon="DollarSign"
          color="green"
        />
        
        <MetricCard
          title="Taux d'occupation"
          :value="metrics.occupancyRate + '%'"
          :previousValue="metrics.previousOccupancyRate + '%'"
          :trend="metrics.occupancyTrend"
          icon="BarChart3"
          color="blue"
        />
        
        <MetricCard
          title="Locations actives"
          :value="metrics.activeBookings"
          :previousValue="metrics.previousActiveBookings"
          :trend="metrics.activeBookingsTrend"
          icon="Calendar"
          color="purple"
        />
        
        <MetricCard
          title="Satisfaction"
          :value="metrics.satisfaction + '/5'"
          :previousValue="metrics.previousSatisfaction + '/5'"
          :trend="metrics.satisfactionTrend"
          icon="Star"
          color="yellow"
        />
      </template>

      <!-- Métriques pour Personnel/Caissier - Vue limitée aux opérations quotidiennes -->
      <template v-else>
        <MetricCard
          title="Revenus du jour"
          :value="formatCurrency(metrics.dailyRevenue)"
          :previousValue="formatCurrency(metrics.previousDailyRevenue)"
          :trend="metrics.dailyRevenueTrend"
          icon="DollarSign"
          color="green"
        />
        
        <MetricCard
          title="Locations actives"
          :value="metrics.activeBookings"
          :previousValue="metrics.previousActiveBookings"
          :trend="metrics.activeBookingsTrend"
          icon="Calendar"
          color="blue"
        />
        
        <MetricCard
          title="Check-ins prévus"
          :value="metrics.expectedCheckins"
          icon="UserCheck"
          color="purple"
          :showTrend="false"
        />
        
        <MetricCard
          title="Check-outs prévus"
          :value="metrics.expectedCheckouts"
          icon="UserX"
          color="orange"
          :showTrend="false"
        />
      </template>
    </div>

    <!-- Deuxième ligne de métriques pour le Propriétaire (admin) -->
    <div v-if="userRole === 'admin'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Revenus du jour"
        :value="formatCurrency(metrics.dailyRevenue)"
        :previousValue="formatCurrency(metrics.previousDailyRevenue)"
        :trend="metrics.dailyRevenueTrend"
        icon="DollarSign"
        color="emerald"
      />
      
      <MetricCard
        title="Locations actives"
        :value="metrics.activeBookings"
        :previousValue="metrics.previousActiveBookings"
        :trend="metrics.activeBookingsTrend"
        icon="Calendar"
        color="indigo"
      />
      
      <MetricCard
        title="Check-ins prévus"
        :value="metrics.expectedCheckins"
        icon="UserCheck"
        color="orange"
        :showTrend="false"
      />
      
      <MetricCard
        title="Check-outs prévus"
        :value="metrics.expectedCheckouts"
        icon="UserX"
        color="red"
        :showTrend="false"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Graphique principal (adapté selon le profil) -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-medium text-gray-900">
              {{ getChartTitle() }}
            </h3>
            <div class="flex items-center space-x-2">
              <button v-for="chart in chartOptions" :key="chart.key" 
                      @click="selectedChart = chart.key"
                      :class="[
                        'px-3 py-1 text-xs font-medium rounded-full transition-colors',
                        selectedChart === chart.key 
                          ? `${themeClasses.bgPrimaryLight} ${themeClasses.textPrimary}` 
                          : 'text-gray-500 hover:text-gray-700'
                      ]">
                {{ chart.label }}
              </button>
            </div>
          </div>
          
          <!-- Placeholder pour le graphique -->
          <div class="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
            <div class="text-center">
              <BarChart3 class="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p class="text-sm text-gray-500">Graphique en cours de développement</p>
              <p class="text-xs text-gray-400 mt-1">ApexCharts sera intégré ici</p>
            </div>
          </div>
        </div>
      </div>

      <!-- État des chambres en temps réel -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-6">État des chambres</h3>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <span class="text-sm text-gray-700">Libres</span>
            </div>
            <span class="text-sm font-medium text-gray-900">{{ roomStatus.available }}</span>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-3 h-3 bg-red-500 rounded-full"></div>
              <span class="text-sm text-gray-700">Occupées</span>
            </div>
            <span class="text-sm font-medium text-gray-900">{{ roomStatus.occupied }}</span>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span class="text-sm text-gray-700">Ménage</span>
            </div>
            <span class="text-sm font-medium text-gray-900">{{ roomStatus.cleaning }}</span>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span class="text-sm text-gray-700">Hors service</span>
            </div>
            <span class="text-sm font-medium text-gray-900">{{ roomStatus.outOfService }}</span>
          </div>
        </div>

        <!-- Graphique circulaire d'occupation -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <div class="relative h-32 flex items-center justify-center">
            <div class="relative w-24 h-24">
              <!-- SVG Donut Chart -->
              <svg class="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  stroke-width="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#8b5cf6"
                  stroke-width="3"
                  :stroke-dasharray="`${occupancyPercentage}, 100`"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-lg font-semibold text-gray-900">{{ Math.round(occupancyPercentage) }}%</span>
              </div>
            </div>
          </div>
          <p class="text-center text-sm text-gray-500 mt-2">Taux d'occupation</p>
        </div>
      </div>
    </div>

    <!-- Transactions récentes et alertes -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Transactions récentes -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-medium text-gray-900">Transactions récentes</h3>
          <router-link to="/locations" :class="[
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
                transaction.type === 'revenue' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              ]">
                <component :is="transaction.type === 'revenue' ? 'Plus' : 'Minus'" class="w-5 h-5" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ transaction.description }}</p>
                <p class="text-xs text-gray-500">{{ transaction.time }}</p>
              </div>
            </div>
            <span :class="[
              'text-sm font-medium',
              transaction.type === 'revenue' ? 'text-green-600' : 'text-red-600'
            ]">
              {{ transaction.type === 'revenue' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
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
          <div v-for="alert in alerts" :key="alert.id" 
               class="flex items-start space-x-3 p-3 rounded-lg border"
               :class="[
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
          <QuickActionButton
            icon="Plus"
            label="Nouvelle location"
            @click="$router.push('/locations')"
            color="green"
          />
          <QuickActionButton
            icon="Users"
            label="Gérer clients"
            @click="$router.push('/guests')"
            color="blue"
          />
          <QuickActionButton
            icon="FileText"
            label="Rapports"
            @click="$router.push('/reports')"
            color="purple"
          />
          <QuickActionButton
            icon="Settings"
            label="Configuration"
            @click="$router.push('/structure')"
            color="gray"
          />
          <QuickActionButton
            icon="BarChart3"
            label="Statistiques"
            @click="$router.push('/administration/statistics')"
            color="indigo"
          />
          <QuickActionButton
            icon="Calendar"
            label="Calendrier"
            @click="$router.push('/calendar')"
            color="orange"
          />
        </template>
        
        <!-- Actions pour Gérant - Gestion opérationnelle -->
        <template v-else-if="userRole === 'manager'">
          <QuickActionButton
            icon="Plus"
            label="Nouvelle location"
            @click="$router.push('/locations')"
            color="green"
          />
          <QuickActionButton
            icon="Users"
            label="Gérer clients"
            @click="$router.push('/guests')"
            color="blue"
          />
          <QuickActionButton
            icon="Calendar"
            label="Check-ins"
            @click="$router.push('/booked-rooms')"
            color="purple"
          />
          <QuickActionButton
            icon="UserCheck"
            label="Réservations"
            @click="$router.push('/reservations')"
            color="indigo"
          />
          <QuickActionButton
            icon="FileText"
            label="Rapports"
            @click="$router.push('/reports')"
            color="orange"
          />
          <QuickActionButton
            icon="BarChart3"
            label="Statistiques"
            @click="$router.push('/administration/statistics')"
            color="gray"
          />
        </template>
        
        <!-- Actions pour Personnel/Caissier - Opérations de base -->
        <template v-else>
          <QuickActionButton
            icon="Plus"
            label="Nouvelle location"
            @click="$router.push('/locations')"
            color="green"
          />
          <QuickActionButton
            icon="Calendar"
            label="Check-ins"
            @click="$router.push('/booked-rooms')"
            color="blue"
          />
          <QuickActionButton
            icon="UserCheck"
            label="Réservations"
            @click="$router.push('/reservations')"
            color="purple"
          />
          <QuickActionButton
            icon="FileText"
            label="Rapports"
            @click="$router.push('/reports')"
            color="orange"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import MetricCard from '@/components/dashboard/MetricCard.vue'
import { 
  RefreshCw, DollarSign, BarChart3, TrendingUp, Star, Calendar, 
  UserCheck, UserX, Plus, ChevronDown 
} from 'lucide-vue-next'
import QuickActionButton from '@/components/dashboard/QuickActionButton.vue'

// Stores
const authStore = useAuthStore()
const themeStore = useThemeStore()

// État
const isLoading = ref(false)
const selectedPeriod = ref('today')
const selectedChart = ref('revenue')

// Computed
const userRole = computed(() => authStore.userRole)
const themeClasses = computed(() => themeStore.themeClasses)

// Options de graphiques selon le profil
const chartOptions = computed(() => {
  if (userRole.value === 'admin') {
    return [
      { key: 'revenue', label: 'Revenus' },
      { key: 'occupancy', label: 'Occupation' },
      { key: 'satisfaction', label: 'Satisfaction' },
      { key: 'forecast', label: 'Prévisions' },
      { key: 'daily', label: 'Journalier' },
      { key: 'bookings', label: 'Réservations' }
    ]
  } else if (userRole.value === 'manager') {
    return [
      { key: 'daily', label: 'Journalier' },
      { key: 'occupancy', label: 'Occupation' },
      { key: 'bookings', label: 'Réservations' },
      { key: 'satisfaction', label: 'Satisfaction' }
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

// Données mockées (à remplacer par des appels API)
const metrics = ref({
  // Métriques propriétaire/gérant
  revenue: 125000,
  previousRevenue: 98000,
  revenueTrend: 'up',
  occupancyRate: 78,
  previousOccupancyRate: 65,
  occupancyTrend: 'up',
  revpar: 89500,
  previousRevpar: 76000,
  revparTrend: 'up',
  satisfaction: 4.2,
  previousSatisfaction: 3.9,
  satisfactionTrend: 'up',
  
  // Métriques personnel/caissier
  dailyRevenue: 15000,
  previousDailyRevenue: 12000,
  dailyRevenueTrend: 'up',
  activeBookings: 23,
  previousActiveBookings: 18,
  activeBookingsTrend: 'up',
  expectedCheckins: 8,
  expectedCheckouts: 5
})

const roomStatus = ref({
  available: 12,
  occupied: 23,
  cleaning: 3,
  outOfService: 2
})

const occupancyPercentage = computed(() => {
  const total = roomStatus.value.available + roomStatus.value.occupied + 
                roomStatus.value.cleaning + roomStatus.value.outOfService
  return (roomStatus.value.occupied / total) * 100
})

const recentTransactions = ref([
  {
    id: 1,
    type: 'revenue',
    description: 'Location Chambre 205',
    amount: 45000,
    time: 'Il y a 2h'
  },
  {
    id: 2,
    type: 'expense',
    description: 'Maintenance climatisation',
    amount: 15000,
    time: 'Il y a 4h'
  },
  {
    id: 3,
    type: 'revenue',
    description: 'Location Chambre 101',
    amount: 35000,
    time: 'Il y a 6h'
  }
])

const alerts = ref([
  {
    id: 1,
    title: 'Maintenance requise',
    message: 'Climatisation Chambre 304 en panne',
    priority: 'high',
    icon: 'AlertTriangle',
    time: 'Il y a 1h'
  },
  {
    id: 2,
    title: 'Check-in en retard',
    message: 'Client Smith - Arrivée prévue 14h',
    priority: 'medium',
    icon: 'Clock',
    time: 'Il y a 30min'
  },
  {
    id: 3,
    title: 'Connexion WiFi',
    message: 'Problème réseau Étage 2',
    priority: 'low',
    icon: 'Wifi',
    time: 'Il y a 45min'
  }
])

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
    // Ici on appellera les vraies APIs
    // await fetchDashboardData(selectedPeriod.value)
    
    // Simulation d'appel API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  refreshData()
})
</script> 