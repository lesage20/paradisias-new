<template>
  <div class="space-y-6">
    <!-- En-tête -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Statistiques Hôtelières</h1>
        <p class="text-gray-600">Vue d'ensemble de votre business - Version 1.0</p>
      </div>
      <div class="flex items-center space-x-3">
        <button @click="refreshAllStats"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          :disabled="isLoading">
          <RefreshCw class="w-4 h-4 mr-2" :class="{ 'animate-spin': isLoading }" />
          Actualiser
        </button>
        <select v-model="selectedPeriod" class="border border-gray-300 rounded-md px-3 py-2 text-sm">
          <option value="month">Ce mois</option>
          <option value="lastMonth">Mois dernier</option>
          <option value="quarter">Ce trimestre</option>
          <option value="year">Cette année</option>
        </select>
      </div>
    </div>

    <!-- Tableau de Bord Principal -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-6">📈 Vue d'ensemble mensuelle</h2>
      <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">{{ formatCurrency(dashboardStats.revenue) }}</div>
          <div class="text-sm text-gray-600">Chiffre d'affaires</div>
          <div class="text-xs" :class="dashboardStats.revenueChange >= 0 ? 'text-green-500' : 'text-red-500'">
            {{ dashboardStats.revenueChange >= 0 ? '+' : '' }}{{ dashboardStats.revenueChange }}% vs mois dernier
          </div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ dashboardStats.occupancyRate }}%</div>
          <div class="text-sm text-gray-600">Taux d'occupation</div>
          <div class="text-xs" :class="dashboardStats.occupancyChange >= 0 ? 'text-green-500' : 'text-red-500'">
            {{ dashboardStats.occupancyChange >= 0 ? '+' : '' }}{{ dashboardStats.occupancyChange }}%
          </div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-600">{{ dashboardStats.totalStays }}</div>
          <div class="text-sm text-gray-600">Nombre de séjours</div>
          <div class="text-xs text-gray-500">{{ dashboardStats.avgStayDuration }} nuits/séjour</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-orange-600">{{ dashboardStats.newClients }}</div>
          <div class="text-sm text-gray-600">Nouveaux clients</div>
          <div class="text-xs text-gray-500">{{ dashboardStats.returningClients }} récurrents</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-indigo-600">{{ dashboardStats.pendingReservations }}</div>
          <div class="text-sm text-gray-600">Réservations en cours</div>
          <div class="text-xs text-gray-500">{{ dashboardStats.confirmationRate }}% confirmées</div>
        </div>
      </div>
    </div>

    <!-- 1. Performances Financières -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-6">💰 Performances Financières</h2>

      <!-- Chiffre d'Affaires -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-md font-medium text-gray-900">Chiffre d'Affaires Mensuel</h3>
          <div class="flex items-center space-x-2">
            <button @click="toggleView('revenue', 'chart')"
              :class="views.revenue === 'chart' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'"
              class="px-3 py-1 rounded-md text-sm">
              📊 Graphique
            </button>
            <button @click="toggleView('revenue', 'table')"
              :class="views.revenue === 'table' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'"
              class="px-3 py-1 rounded-md text-sm">
              📋 Tableau
            </button>
          </div>
        </div>

        <!-- Vue Graphique -->
        <div v-if="views.revenue === 'chart'" class="h-64">
          <apexchart type="line" height="256" :options="revenueChartOptions" :series="revenueChartSeries" />
        </div>

        <!-- Vue Tableau -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mois</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CA</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Évolution
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="month in revenueData" :key="month.name">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ month.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(month.amount) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm"
                  :class="month.change >= 0 ? 'text-green-600' : 'text-red-600'">
                  {{ month.change >= 0 ? '+' : '' }}{{ month.change }}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Revenus par Type de Chambre -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-md font-medium text-gray-900">Revenus par Type de Chambre</h3>
          <div class="flex items-center space-x-2">
            <button @click="toggleView('roomRevenue', 'chart')"
              :class="views.roomRevenue === 'chart' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'"
              class="px-3 py-1 rounded-md text-sm">
              📊 Graphique
            </button>
            <button @click="toggleView('roomRevenue', 'table')"
              :class="views.roomRevenue === 'table' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'"
              class="px-3 py-1 rounded-md text-sm">
              📋 Tableau
            </button>
          </div>
        </div>

        <!-- Vue Graphique -->
        <div v-if="views.roomRevenue === 'chart'" class="h-64">
          <apexchart type="bar" height="256" :options="roomRevenueChartOptions" :series="roomRevenueChartSeries" />
        </div>

        <!-- Vue Tableau -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CA</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% Total</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nuits vendues
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="room in roomRevenueData" :key="room.type">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ room.type }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(room.revenue) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ room.percentage }}%</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ room.nightsSold }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 2. Occupation Hôtelière -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-6">🏨 Occupation Hôtelière</h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Taux d'Occupation -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-md font-medium text-gray-900">Taux d'Occupation Global</h3>
            <div class="flex items-center space-x-2">
              <button @click="toggleView('occupancy', 'chart')"
                :class="views.occupancy === 'chart' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'"
                class="px-3 py-1 rounded-md text-sm">
                📊 Gauge
              </button>
              <button @click="toggleView('occupancy', 'table')"
                :class="views.occupancy === 'table' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'"
                class="px-3 py-1 rounded-md text-sm">
                📋 Détails
              </button>
            </div>
          </div>

          <div v-if="views.occupancy === 'chart'" class="h-48">
            <apexchart type="radialBar" height="192" :options="occupancyChartOptions"
              :series="[occupancyStats.current]" />
          </div>

          <div v-else class="space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Chambres total:</span>
              <span class="font-medium">{{ occupancyStats.totalRooms }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Chambres occupées:</span>
              <span class="font-medium text-blue-600">{{ occupancyStats.occupiedRooms }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Chambres libres:</span>
              <span class="font-medium text-green-600">{{ occupancyStats.freeRooms }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Taux d'occupation:</span>
              <span class="font-medium text-gray-900">{{ occupancyStats.current }}%</span>
            </div>
          </div>
        </div>

        <!-- Durée Moyenne de Séjour -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-md font-medium text-gray-900">Durée Moyenne de Séjour</h3>
            <div class="flex items-center space-x-2">
              <button @click="toggleView('stayDuration', 'chart')"
                :class="views.stayDuration === 'chart' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'"
                class="px-3 py-1 rounded-md text-sm">
                📊 Indicateur
              </button>
              <button @click="toggleView('stayDuration', 'table')"
                :class="views.stayDuration === 'table' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'"
                class="px-3 py-1 rounded-md text-sm">
                📋 Répartition
              </button>
            </div>
          </div>

          <div v-if="views.stayDuration === 'chart'" class="h-48">
            <apexchart type="donut" height="192" :options="stayDurationChartOptions"
              :series="stayDurationChartSeries" />
          </div>

          <div v-else class="space-y-3">
            <div v-for="duration in stayDurationData" :key="duration.nights" class="flex justify-between text-sm">
              <span class="text-gray-600">{{ duration.nights }} nuit{{ duration.nights > 1 ? 's' : '' }}:</span>
              <span class="font-medium">{{ duration.count }} séjours ({{ duration.percentage }}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Aperçu Clientèle -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-6">👥 Aperçu Clientèle</h2>

      <!-- Analyse des Paiements -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-md font-medium text-gray-900">Analyse des Paiements Clients</h3>
          <div class="flex items-center space-x-2">
            <button @click="toggleView('clientPayments', 'chart')"
              :class="views.clientPayments === 'chart' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'"
              class="px-3 py-1 rounded-md text-sm">
              📊 Secteurs
            </button>
            <button @click="toggleView('clientPayments', 'table')"
              :class="views.clientPayments === 'table' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'"
              class="px-3 py-1 rounded-md text-sm">
              📋 Détail
            </button>
          </div>
        </div>

        <div v-if="views.clientPayments === 'chart'" class="h-64">
          <apexchart type="pie" height="256" :options="clientPaymentsChartOptions"
            :series="clientPaymentsChartSeries" />
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-green-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-green-600">{{ clientPaymentStats.fullyPaid }}</div>
            <div class="text-sm text-gray-600">Clients qui soldent</div>
            <div class="text-xs text-green-600">{{ clientPaymentStats.fullyPaidPercentage }}%</div>
          </div>
          <div class="bg-red-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-red-600">{{ clientPaymentStats.withDebt }}</div>
            <div class="text-sm text-gray-600">Clients avec dettes</div>
            <div class="text-xs text-red-600">{{ clientPaymentStats.withDebtPercentage }}%</div>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-yellow-600">{{ formatCurrency(clientPaymentStats.totalDebt) }}</div>
            <div class="text-sm text-gray-600">Total des dettes</div>
            <div class="text-xs text-yellow-600">{{ clientPaymentStats.avgDebt }}% dette moyenne</div>
          </div>
        </div>
      </div>

      <!-- Clients Nouveaux vs Récurrents -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-md font-medium text-gray-900">Clients Nouveaux vs Récurrents</h3>
          <div class="flex items-center space-x-2">
            <button @click="toggleView('clientTypes', 'chart')"
              :class="views.clientTypes === 'chart' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'"
              class="px-3 py-1 rounded-md text-sm">
              📊 Secteurs
            </button>
            <button @click="toggleView('clientTypes', 'table')"
              :class="views.clientTypes === 'table' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'"
              class="px-3 py-1 rounded-md text-sm">
              📋 Liste
            </button>
          </div>
        </div>

        <div v-if="views.clientTypes === 'chart'" class="h-64">
          <apexchart type="donut" height="256" :options="clientTypesChartOptions" :series="clientTypesChartSeries" />
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">%</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CA Généré
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="type in clientTypesData" :key="type.category">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ type.category }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ type.count }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ type.percentage }}%</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(type.revenue) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Top 5 Nationalités -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-md font-medium text-gray-900">Top 5 Nationalités</h3>
          <div class="flex items-center space-x-2">
            <button @click="toggleView('nationalities', 'chart')"
              :class="views.nationalities === 'chart' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'"
              class="px-3 py-1 rounded-md text-sm">
              📊 Barres
            </button>
            <button @click="toggleView('nationalities', 'table')"
              :class="views.nationalities === 'table' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'"
              class="px-3 py-1 rounded-md text-sm">
              📋 Liste
            </button>
          </div>
        </div>

        <div v-if="views.nationalities === 'chart'" class="h-64">
          <apexchart type="bar" height="256" :options="nationalitiesChartOptions" :series="nationalitiesChartSeries" />
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div v-for="nation in nationalitiesData" :key="nation.country" class="bg-gray-50 p-4 rounded-lg text-center">
            <div class="text-lg font-bold text-gray-900">{{ nation.count }}</div>
            <div class="text-sm text-gray-600">{{ nation.country }}</div>
            <div class="text-xs text-gray-500">{{ nation.percentage }}%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. Activité Réservations -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-6">📅 Activité Réservations</h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Réservations par Mois -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-md font-medium text-gray-900">Réservations par Mois</h3>
            <div class="flex items-center space-x-2">
              <button @click="toggleView('reservations', 'chart')"
                :class="views.reservations === 'chart' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'"
                class="px-3 py-1 rounded-md text-sm">
                📊 Colonnes
              </button>
              <button @click="toggleView('reservations', 'table')"
                :class="views.reservations === 'table' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'"
                class="px-3 py-1 rounded-md text-sm">
                📋 Calendrier
              </button>
            </div>
          </div>

          <div v-if="views.reservations === 'chart'" class="h-48">
            <apexchart type="column" height="192" :options="reservationsChartOptions"
              :series="reservationsChartSeries" />
          </div>

          <div v-else class="space-y-3">
            <div v-for="month in reservationsData" :key="month.month" class="flex justify-between text-sm">
              <span class="text-gray-600">{{ month.month }}:</span>
              <span class="font-medium">{{ month.count }} réservations</span>
            </div>
          </div>
        </div>

        <!-- Taux de Confirmation -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-md font-medium text-gray-900">Taux de Confirmation</h3>
            <div class="flex items-center space-x-2">
              <button @click="toggleView('confirmation', 'chart')"
                :class="views.confirmation === 'chart' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'"
                class="px-3 py-1 rounded-md text-sm">
                📊 Indicateur
              </button>
              <button @click="toggleView('confirmation', 'table')"
                :class="views.confirmation === 'table' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'"
                class="px-3 py-1 rounded-md text-sm">
                📋 Statuts
              </button>
            </div>
          </div>

          <div v-if="views.confirmation === 'chart'" class="h-48">
            <apexchart type="radialBar" height="192" :options="confirmationChartOptions"
              :series="[confirmationStats.rate]" />
          </div>

          <div v-else class="space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Confirmées:</span>
              <span class="font-medium text-green-600">{{ confirmationStats.confirmed }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Annulées:</span>
              <span class="font-medium text-red-600">{{ confirmationStats.cancelled }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">En attente:</span>
              <span class="font-medium text-yellow-600">{{ confirmationStats.pending }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Taux de confirmation:</span>
              <span class="font-medium text-gray-900">{{ confirmationStats.rate }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  RefreshCw, TrendingUp, BarChart3, PieChart, Users, Globe, Calendar,
  CheckCircle, XCircle, Clock
} from 'lucide-vue-next'
import VueApexCharts from 'vue3-apexcharts'

// Composants
const apexchart = VueApexCharts

// État
const isLoading = ref(false)
const selectedPeriod = ref('month')

// États des vues (graphique/tableau)
const views = ref({
  revenue: 'chart',
  roomRevenue: 'chart',
  occupancy: 'chart',
  stayDuration: 'chart',
  clientPayments: 'chart',
  clientTypes: 'chart',
  nationalities: 'chart',
  reservations: 'chart',
  confirmation: 'chart'
})

// Données du tableau de bord principal
const dashboardStats = ref({
  revenue: 3450000,
  revenueChange: 12.5,
  occupancyRate: 78,
  occupancyChange: 5.2,
  totalStays: 156,
  avgStayDuration: 2.3,
  newClients: 89,
  returningClients: 67,
  pendingReservations: 23,
  confirmationRate: 85
})

// 1. Données Performances Financières
const revenueData = ref([
  { name: 'Janvier', amount: 2800000, change: 8.3 },
  { name: 'Février', amount: 3100000, change: 10.7 },
  { name: 'Mars', amount: 3450000, change: 11.3 },
  { name: 'Avril', amount: 3200000, change: -7.2 },
  { name: 'Mai', amount: 3650000, change: 14.1 },
  { name: 'Juin', amount: 3950000, change: 8.2 }
])

const roomRevenueData = ref([
  { type: 'Standard', revenue: 1280000, percentage: 37, nightsSold: 128 },
  { type: 'Supérieure', revenue: 1650000, percentage: 48, nightsSold: 94 },
  { type: 'Suite', revenue: 520000, percentage: 15, nightsSold: 26 }
])

// 2. Données Occupation
const occupancyStats = ref({
  current: 78,
  totalRooms: 45,
  occupiedRooms: 35,
  freeRooms: 10
})

const stayStats = ref({
  average: 2.3
})

const stayDurationData = ref([
  { nights: 1, count: 45, percentage: 29 },
  { nights: 2, count: 62, percentage: 40 },
  { nights: 3, count: 38, percentage: 24 },
  { nights: '4+', count: 11, percentage: 7 }
])

// 3. Données Clientèle
const clientPaymentStats = ref({
  fullyPaid: 134,
  fullyPaidPercentage: 72,
  withDebt: 52,
  withDebtPercentage: 28,
  totalDebt: 785000,
  avgDebt: 15.1
})

const clientTypesData = ref([
  { category: 'Nouveaux (1 séjour)', count: 89, percentage: 48, revenue: 1650000 },
  { category: 'Occasionnels (2-3 séjours)', count: 67, percentage: 36, revenue: 1280000 },
  { category: 'Réguliers (4-5 séjours)', count: 23, percentage: 12, revenue: 420000 },
  { category: 'VIP (6+ séjours)', count: 7, percentage: 4, revenue: 210000 }
])

const nationalitiesData = ref([
  { country: 'Côte d\'Ivoire', count: 125, percentage: 67 },
  { country: 'Mali', count: 23, percentage: 12 },
  { country: 'Burkina Faso', count: 18, percentage: 10 },
  { country: 'Sénégal', count: 12, percentage: 6 },
  { country: 'Ghana', count: 8, percentage: 4 }
])

// 4. Données Réservations
const reservationsData = ref([
  { month: 'Janvier', count: 145 },
  { month: 'Février', count: 167 },
  { month: 'Mars', count: 189 },
  { month: 'Avril', count: 156 },
  { month: 'Mai', count: 203 },
  { month: 'Juin', count: 234 }
])

const confirmationStats = ref({
  confirmed: 198,
  cancelled: 23,
  pending: 12,
  rate: 85
})

// Méthodes
const formatCurrency = (amount) => {
  if (!amount) return '0 FCFA'
  return new Intl.NumberFormat('fr-CI', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount)
}

const toggleView = (section, viewType) => {
  views.value[section] = viewType
}

const refreshAllStats = () => {
  isLoading.value = true
  // Simuler un appel API
  setTimeout(() => {
    isLoading.value = false
  }, 1500)
}

// Configurations ApexCharts
const revenueChartOptions = {
  chart: {
    type: 'line',
    toolbar: { show: false }
  },
  title: {
    text: 'Évolution du Chiffre d\'Affaires',
    style: { fontSize: '16px', fontWeight: 600 }
  },
  xaxis: {
    categories: revenueData.value.map(item => item.name)
  },
  yaxis: {
    labels: {
      formatter: (value) => formatCurrency(value)
    }
  },
  stroke: {
    curve: 'smooth',
    width: 3
  },
  colors: ['#3B82F6'],
  dataLabels: { enabled: false }
}

const revenueChartSeries = [{
  name: 'Chiffre d\'Affaires',
  data: revenueData.value.map(item => item.amount)
}]

const roomRevenueChartOptions = {
  chart: {
    type: 'bar',
    toolbar: { show: false }
  },
  title: {
    text: 'Revenus par Type de Chambre',
    style: { fontSize: '16px', fontWeight: 600 }
  },
  xaxis: {
    categories: roomRevenueData.value.map(item => item.type)
  },
  yaxis: {
    labels: {
      formatter: (value) => formatCurrency(value)
    }
  },
  colors: ['#10B981', '#3B82F6', '#8B5CF6'],
  dataLabels: { enabled: false }
}

const roomRevenueChartSeries = [{
  name: 'Revenus',
  data: roomRevenueData.value.map(item => item.revenue)
}]

const occupancyChartOptions = {
  chart: {
    type: 'radialBar'
  },
  plotOptions: {
    radialBar: {
      hollow: {
        size: '60%'
      },
      dataLabels: {
        name: {
          show: false
        },
        value: {
          show: true,
          fontSize: '24px',
          fontWeight: 600,
          color: '#3B82F6',
          formatter: (val) => val + '%'
        }
      }
    }
  },
  colors: ['#3B82F6'],
  labels: ['Occupation']
}

const stayDurationChartOptions = {
  chart: {
    type: 'donut'
  },
  title: {
    text: 'Répartition Durée de Séjour',
    style: { fontSize: '14px', fontWeight: 600 }
  },
  labels: stayDurationData.value.map(item => `${item.nights} nuit${item.nights > 1 ? 's' : ''}`),
  colors: ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'],
  legend: {
    position: 'bottom'
  },
  dataLabels: {
    formatter: (val) => Math.round(val) + '%'
  }
}

const stayDurationChartSeries = stayDurationData.value.map(item => item.percentage)

const clientPaymentsChartOptions = {
  chart: {
    type: 'pie'
  },
  title: {
    text: 'Paiements Clients',
    style: { fontSize: '16px', fontWeight: 600 }
  },
  labels: ['Clients qui soldent', 'Clients avec dettes'],
  colors: ['#10B981', '#EF4444'],
  legend: {
    position: 'bottom'
  },
  dataLabels: {
    formatter: (val) => Math.round(val) + '%'
  }
}

const clientPaymentsChartSeries = [
  clientPaymentStats.value.fullyPaidPercentage,
  clientPaymentStats.value.withDebtPercentage
]

const clientTypesChartOptions = {
  chart: {
    type: 'donut'
  },
  title: {
    text: 'Types de Clients',
    style: { fontSize: '16px', fontWeight: 600 }
  },
  labels: clientTypesData.value.map(item => item.category.split(' ')[0]), // Raccourci les labels
  colors: ['#F59E0B', '#3B82F6', '#8B5CF6', '#EF4444'],
  legend: {
    position: 'bottom'
  },
  dataLabels: {
    formatter: (val) => Math.round(val) + '%'
  }
}

const clientTypesChartSeries = clientTypesData.value.map(item => item.percentage)

const nationalitiesChartOptions = {
  chart: {
    type: 'bar',
    toolbar: { show: false }
  },
  title: {
    text: 'Top 5 Nationalités',
    style: { fontSize: '16px', fontWeight: 600 }
  },
  xaxis: {
    categories: nationalitiesData.value.map(item => item.country)
  },
  colors: ['#6366F1'],
  dataLabels: { enabled: false }
}

const nationalitiesChartSeries = [{
  name: 'Clients',
  data: nationalitiesData.value.map(item => item.count)
}]

const reservationsChartOptions = {
  chart: {
    type: 'column',
    toolbar: { show: false }
  },
  title: {
    text: 'Réservations Mensuelles',
    style: { fontSize: '14px', fontWeight: 600 }
  },
  xaxis: {
    categories: reservationsData.value.map(item => item.month.substring(0, 3)) // Raccourci les mois
  },
  colors: ['#10B981'],
  dataLabels: { enabled: false }
}

const reservationsChartSeries = [{
  name: 'Réservations',
  data: reservationsData.value.map(item => item.count)
}]

const confirmationChartOptions = {
  chart: {
    type: 'radialBar'
  },
  plotOptions: {
    radialBar: {
      hollow: {
        size: '60%'
      },
      dataLabels: {
        name: {
          show: false
        },
        value: {
          show: true,
          fontSize: '20px',
          fontWeight: 600,
          color: '#10B981',
          formatter: (val) => val + '%'
        }
      }
    }
  },
  colors: ['#10B981'],
  labels: ['Confirmation']
}

// Lifecycle
onMounted(() => {
  refreshAllStats()
})
</script>