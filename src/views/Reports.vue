<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Rapports</h1>
        <p class="text-gray-600 mt-1">Génération et téléchargement de rapports détaillés</p>
      </div>
      <div class="mt-4 sm:mt-0 flex items-center space-x-3">
        <button @click="refreshData" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          <RefreshCw class="w-4 h-4 mr-2" :class="{ 'animate-spin': isLoading }" />
          Actualiser
        </button>
      </div>
    </div>

    <!-- Vue principale -->
    <div v-if="!selectedReport" class="space-y-6">
      <!-- Statistiques rapides -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar class="w-6 h-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Locations aujourd'hui</p>
              <p class="text-2xl font-bold text-blue-600">{{ stats.todayLocations }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp class="w-6 h-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Revenus du jour</p>
              <p class="text-2xl font-bold text-green-600">{{ formatCurrency(stats.todayRevenue) }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Bed class="w-6 h-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Taux d'occupation</p>
              <p class="text-2xl font-bold text-purple-600">{{ stats.occupancyRate }}%</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FileText class="w-6 h-6 text-orange-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Rapports générés</p>
              <p class="text-2xl font-bold text-orange-600">{{ stats.reportsGenerated }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Liste des rapports -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Liste des rapports disponibles</h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              v-for="report in reportsList" 
              :key="report.id"
              @click="selectReport(report)"
              class="group cursor-pointer border border-gray-200 rounded-lg p-6 hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 rounded-lg flex items-center justify-center" :class="report.iconBg">
                  <component :is="report.icon" class="w-6 h-6" :class="report.iconColor" />
                </div>
                <div class="flex-1">
                  <h4 class="text-sm font-medium text-gray-900 group-hover:text-gray-700">{{ report.name }}</h4>
                  <p class="text-xs text-gray-600 mt-1">{{ report.description }}</p>
                </div>
                <ChevronRight class="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Vue détail rapport -->
    <div v-else class="space-y-6">
      <!-- Header rapport -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button @click="goBack" class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <ArrowLeft class="w-5 h-5" />
            </button>
            <div class="w-12 h-12 rounded-lg flex items-center justify-center" :class="selectedReport.iconBg">
              <component :is="selectedReport.icon" class="w-6 h-6" :class="selectedReport.iconColor" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900">{{ selectedReport.name }}</h2>
              <p class="text-sm text-gray-600">{{ selectedReport.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Onglets de navigation -->
      <Tabs 
        v-model="activeTab" 
        :tabs="reportTabs"
        full-width
        @tab-change="handleTabChange"
      >
        <template #default="{ activeTab: currentTab }">
          <!-- Onglet Rapport Officiel PDF -->
          <div v-if="currentTab === 'official'" class="space-y-6">
            <div class="mb-6">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-gray-900">Rapport Officiel - Format PDF</h3>
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    Format utilisé par l'entreprise
                  </span>
                </div>
              </div>
              <p class="text-sm text-gray-600 mt-2">
                Ce rapport utilise le format officiel de l'entreprise pour la génération PDF directe.
              </p>
            </div>

            <!-- Filtres de période pour l'onglet officiel -->
            <div class="mb-6">
              <h4 class="text-md font-medium text-gray-900 mb-4">Période de génération</h4>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <button 
                  @click="reportPeriod = 'today'"
                  :class="reportPeriod === 'today' ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
                  class="inline-flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium"
                >
                  <Calendar class="w-4 h-4 mr-2" />
                  Aujourd'hui
                </button>
                <button 
                  @click="reportPeriod = 'week'"
                  :class="reportPeriod === 'week' ? 'bg-orange-100 text-orange-700 border-orange-300' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
                  class="inline-flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium"
                >
                  <Calendar class="w-4 h-4 mr-2" />
                  Cette semaine
                </button>
                <button 
                  @click="reportPeriod = 'month'"
                  :class="reportPeriod === 'month' ? 'bg-purple-100 text-purple-700 border-purple-300' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
                  class="inline-flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium"
                >
                  <Calendar class="w-4 h-4 mr-2" />
                  Ce mois
                </button>
                <div class="relative">
                  <input 
                    v-model="customDate"
                    type="date"
                    :class="reportPeriod === 'custom' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-white text-gray-700 border-gray-300'"
                    class="w-full px-4 py-2 border rounded-lg text-sm"
                    @change="reportPeriod = 'custom'"
                  />
                </div>
              </div>
              <!-- <div class="mt-4">
                <button 
                  @click="generateOfficialReport"
                  :disabled="isGenerating"
                  class="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50"
                >
                  <Download class="w-4 h-4 mr-2" />
                  <span v-if="isGenerating">Génération...</span>
                  <span v-else>Générer PDF Officiel</span>
                </button>
              </div> -->
            </div>

            <!-- Composant du rapport officiel -->
            <div v-if="getOfficialReportComponent(selectedReport.id) === 'div'" class="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div class="text-center py-8">
                <FileText class="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p class="text-gray-600 mb-2">Rapport officiel prêt à être généré</p>
                <p class="text-sm text-gray-500">
                  Le rapport sera généré au format PDF avec la mise en page officielle de l'entreprise.
                </p>
              </div>
            </div>
            
            <!-- Composant spécifique du rapport officiel -->
            <component 
              v-else
              :is="getOfficialReportComponent(selectedReport.id)"
              :data="reportData"
              :period="reportPeriod"
              :custom-date="customDate"
            />
          </div>

          <!-- Onglet Analyse Avancée -->
          <div v-if="currentTab === 'advanced'" class="space-y-6">
            <div class="mb-6">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-gray-900">Analyse Avancée</h3>
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    Version améliorée avec graphiques
                  </span>
                </div>
              </div>
              <p class="text-sm text-gray-600 mt-2">
                Version enrichie avec visualisations, graphiques et analyses détaillées.
              </p>
            </div>

            <!-- Filtres de période pour l'onglet avancé -->
            <div class="mb-6">
              <h4 class="text-md font-medium text-gray-900 mb-4">Période d'analyse</h4>
              <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                <button 
                  @click="reportPeriod = 'today'"
                  :class="reportPeriod === 'today' ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
                  class="inline-flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium"
                >
                  <Calendar class="w-4 h-4 mr-2" />
                  Aujourd'hui
                </button>
                <button 
                  @click="reportPeriod = 'week'"
                  :class="reportPeriod === 'week' ? 'bg-orange-100 text-orange-700 border-orange-300' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
                  class="inline-flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium"
                >
                  <Calendar class="w-4 h-4 mr-2" />
                  Cette semaine
                </button>
                <button 
                  @click="reportPeriod = 'month'"
                  :class="reportPeriod === 'month' ? 'bg-purple-100 text-purple-700 border-purple-300' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
                  class="inline-flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium"
                >
                  <Calendar class="w-4 h-4 mr-2" />
                  Ce mois
                </button>
                <div class="relative">
                  <input 
                    v-model="customDate"
                    type="date"
                    :class="reportPeriod === 'custom' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-white text-gray-700 border-gray-300'"
                    class="w-full px-4 py-2 border rounded-lg text-sm"
                    @change="reportPeriod = 'custom'"
                  />
                </div>
                <button 
                  @click="generateAdvancedReport"
                  :disabled="isGenerating"
                  class="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50"
                >
                  <BarChart3 class="w-4 h-4 mr-2" />
                  <span v-if="isGenerating">Analyse...</span>
                  <span v-else>Analyser</span>
                </button>
              </div>
            </div>

            <!-- Aperçu du rapport avancé -->
            <div v-if="!reportData" class="text-center py-12">
              <BarChart3 class="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-600">Sélectionnez une période pour voir l'analyse avancée</p>
            </div>
            
            <!-- Composant spécifique selon le type de rapport -->
            <component 
              v-else
              :is="getReportComponent(selectedReport.id)"
              :data="reportData"
              :period="reportPeriod"
              :custom-date="customDate"
              @generate="generateAdvancedPdf"
            />
          </div>
        </template>
      </Tabs>
    </div>

    <!-- Modal d'aperçu PDF -->
    <div v-if="showPdfPreview" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="closePdfPreview">
      <div class="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-screen overflow-y-auto" @click.stop>
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Aperçu PDF - {{ selectedReport?.name }}</h3>
          <button @click="closePdfPreview" class="text-gray-400 hover:text-gray-600">
            <X class="w-6 h-6" />
          </button>
        </div>
        <div class="p-6">
          <div v-html="pdfPreviewContent" class="prose max-w-none"></div>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div v-if="isGenerating" class="flex items-center text-blue-600">
            <RefreshCw class="w-5 h-5 animate-spin mr-2" />
            <span>Génération en cours...</span>
          </div>
          <div v-else class="flex items-center space-x-3">
            <button @click="closePdfPreview" class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Annuler
            </button>
            <button @click="downloadPdf" class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
              Télécharger PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import html2pdf from 'html2pdf.js'
import {
  FileText, Calendar, TrendingUp, Bed, RefreshCw, ChevronRight, ArrowLeft,
  Download, X, Building, Users, DollarSign, ClipboardList, BarChart3, MapPin
} from 'lucide-vue-next'
import Tabs from '@/components/ui/Tabs.vue'

// Import des composants de rapports
import DailyPlanningReport from '@/components/reports/DailyPlanningReport.vue'
import RoomSituationReport from '@/components/reports/RoomSituationReport.vue'
import GlobalReport from '@/components/reports/GlobalReport.vue'
import RoomOccupationReport from '@/components/reports/RoomOccupationReport.vue'
import ReceptionRecapReport from '@/components/reports/ReceptionRecapReport.vue'
import HandoverReport from '@/components/reports/HandoverReport.vue'
import DailyJournalReport from '@/components/reports/DailyJournalReport.vue'
import ListsDownloaderReport from '@/components/reports/ListsDownloaderReport.vue'

// Import des composants de rapports officiels
import SituationChambreOfficial from '@/components/reports/official/SituationChambreOfficial.vue'
import RecapReceptionOfficial from '@/components/reports/official/RecapReceptionOfficial.vue'
import RoomOccupationOfficial from '@/components/reports/official/RoomOccupationOfficial.vue'
import JournalJourOfficial from '@/components/reports/official/JournalJourOfficial.vue'
import ListDownloaderOfficial from '@/components/reports/official/ListDownloaderOfficial.vue'
import PassationReportOfficial from '@/components/reports/official/PassationReportOfficial.vue'
import PlanningJournalierOfficial from '@/components/reports/official/PlanningJournalierOfficial.vue'
import GlobalReportOfficial from '@/components/reports/official/GlobalReportOfficial.vue'

// Stores
const authStore = useAuthStore()

// État
const isLoading = ref(false)
const isGenerating = ref(false)
const selectedReport = ref(null)
const activeTab = ref('official') // 'official' ou 'advanced'
const reportPeriod = ref('today')
const customDate = ref(new Date().toISOString().split('T')[0])
const reportData = ref(null)
const showPdfPreview = ref(false)
const pdfPreviewContent = ref('')

// Données
const locations = ref([])
const reservations = ref([])
const chambers = ref([])
const clients = ref([])
const expenses = ref([])
const employees = ref([])

// Liste des rapports disponibles
const reportsList = ref([
  {
    id: 'daily-planning',
    name: 'Planning journaliers',
    description: 'Planning d\'occupation journalière des chambres',
    icon: Calendar,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    id: 'room-situation',
    name: 'Feuille de situation des chambres',
    description: 'État détaillé de toutes les chambres',
    icon: Building,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    id: 'room-occupation',
    name: 'Rapport d\'occupation des chambres',
    description: 'Analyse du taux d\'occupation',
    icon: BarChart3,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  {
    id: 'reception-recap',
    name: 'Récapitulatif point réceptionniste',
    description: 'Synthèse des activités de réception',
    icon: Users,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600'
  },
  {
    id: 'handover-report',
    name: 'Rapport de passation',
    description: 'Transmission des informations entre équipes',
    icon: ClipboardList,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600'
  },
  {
    id: 'daily-journal',
    name: 'Journal du jour',
    description: 'Résumé détaillé de la journée',
    icon: FileText,
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600'
  },
  {
    id: 'global-report',
    name: 'Rapport global',
    description: 'Vue d\'ensemble complète avec graphiques',
    icon: TrendingUp,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600'
  },
  {
    id: 'lists-downloader',
    name: 'Téléchargeur de listes',
    description: 'Export de listes complètes (clients, locations, etc.)',
    icon: Download,
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-600'
  }
])

// Tabs pour les rapports
const reportTabs = computed(() => [
  {
    id: 'official',
    label: 'Rapport Officiel PDF',
    icon: FileText
  },
  {
    id: 'advanced',
    label: 'Analyse Avancée',
    icon: BarChart3
  }
])

// Statistiques calculées
const stats = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  const todayLocations = locations.value.filter(loc => {
    const checkIn = new Date(loc.checkIn_date || loc.checkIn).toISOString().split('T')[0]
    const checkOut = new Date(loc.checkOut_date || loc.checkOut).toISOString().split('T')[0]
    return checkIn <= today && checkOut >= today
  }).length

  const todayRevenue = locations.value
    .filter(loc => {
      const checkIn = new Date(loc.checkIn_date || loc.checkIn).toISOString().split('T')[0]
      return checkIn === today
    })
    .reduce((sum, loc) => sum + (loc.totalPrice || 0), 0)

  const occupancyRate = chambers.value.length > 0 
    ? Math.round((todayLocations / chambers.value.length) * 100)
    : 0

  return {
    todayLocations,
    todayRevenue,
    occupancyRate,
    reportsGenerated: 24 // Simulation
  }
})

// Méthodes utilitaires
const formatCurrency = (amount) => {
  if (!amount) return '0 FCFA'
  return new Intl.NumberFormat('fr-CI', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('fr-FR')
}

// Actions
const refreshData = async () => {
  isLoading.value = true
  try {
    const [locationsRes, reservationsRes, chambersRes, clientsRes, expensesRes, employeesRes] = await Promise.all([
      axios.get(`${authStore.apiUrl}hotel/locations/`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      }),
      axios.get(`${authStore.apiUrl}hotel/reservations/`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      }),
      axios.get(`${authStore.apiUrl}hotel/chambres/`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      }),
      axios.get(`${authStore.apiUrl}accounts/clients/`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      }),
      axios.get(`${authStore.apiUrl}hotel/depenses/`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      }),
      axios.get(`${authStore.apiUrl}accounts/employes/`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      })
    ])
    
    locations.value = locationsRes.data
    reservations.value = reservationsRes.data
    chambers.value = chambersRes.data
    clients.value = clientsRes.data
    expenses.value = expensesRes.data
    employees.value = employeesRes.data
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  } finally {
    isLoading.value = false
  }
}

const selectReport = (report) => {
  selectedReport.value = report
  activeTab.value = 'official' // Par défaut sur l'onglet officiel
  generateReportData()
}

const goBack = () => {
  selectedReport.value = null
  reportData.value = null
  activeTab.value = 'official'
}

const generateReportData = () => {
  if (!selectedReport.value) return
  
  // Générer les données selon le type de rapport et la période
  const periodData = getDataForPeriod()
  reportData.value = periodData
}

const getDataForPeriod = () => {
  const today = new Date()
  let startDate, endDate
  
  switch (reportPeriod.value) {
    case 'today':
      startDate = new Date(today)
      endDate = new Date(today)
      break
    case 'week':
      startDate = new Date(today.setDate(today.getDate() - today.getDay() + 1))
      endDate = new Date(today.setDate(today.getDate() + 6))
      break
    case 'month':
      startDate = new Date(today.getFullYear(), today.getMonth(), 1)
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      break
    case 'custom':
      startDate = new Date(customDate.value)
      endDate = new Date(customDate.value)
      break
    default:
      startDate = new Date()
      endDate = new Date()
  }
  
  return {
    startDate,
    endDate,
    locations: locations.value,
    reservations: reservations.value,
    chambers: chambers.value,
    clients: clients.value,
    expenses: expenses.value,
    employees: employees.value
  }
}

const getReportComponent = (reportId) => {
  const components = {
    'daily-planning': DailyPlanningReport,
    'room-situation': RoomSituationReport,
    'global-report': GlobalReport,
    'room-occupation': RoomOccupationReport,
    'reception-recap': ReceptionRecapReport,
    'handover-report': HandoverReport,
    'daily-journal': DailyJournalReport,
    'lists-downloader': ListsDownloaderReport
  }
  
  return components[reportId] || 'div'
}

const getOfficialReportComponent = (reportId) => {
  const components = {
    'room-situation': SituationChambreOfficial,
    'reception-recap': RecapReceptionOfficial,
    'room-occupation': RoomOccupationOfficial,
    'daily-journal': JournalJourOfficial,
    'lists-downloader': ListDownloaderOfficial,
    'handover-report': PassationReportOfficial,
    'daily-planning': PlanningJournalierOfficial,
    'global-report': GlobalReportOfficial
  }
  
  return components[reportId] || 'div'
}

const generateOfficialReport = () => {
  if (!selectedReport.value) return
  
  isGenerating.value = true
  
  // Simuler la génération du rapport officiel
  setTimeout(() => {
    const htmlContent = generateOfficialReportHtml()
    pdfPreviewContent.value = htmlContent
    showPdfPreview.value = true
    isGenerating.value = false
  }, 1500)
}

const generateAdvancedReport = () => {
  generateReportData()
}

const generateAdvancedPdf = () => {
  if (!selectedReport.value) return
  
  isGenerating.value = true
  
  // Générer le contenu HTML du rapport avancé
  const htmlContent = generateAdvancedReportHtml()
  pdfPreviewContent.value = htmlContent
  showPdfPreview.value = true
  
  setTimeout(() => {
    isGenerating.value = false
  }, 1500)
}

const generateOfficialReportHtml = () => {
  const report = selectedReport.value
  const data = reportData.value
  
  const periodText = reportPeriod.value === 'today' ? 'Aujourd\'hui' :
                   reportPeriod.value === 'week' ? 'Cette semaine' :
                   reportPeriod.value === 'month' ? 'Ce mois' :
                   `Le ${formatDate(customDate.value)}`
  
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <div style="display: flex; justify-content: space-between; font-size: 12px; color: #6b7280; margin-bottom: 20px;">
        <span>Paradisias Hotel</span>
        <span>Tel: +225 0787572030</span>
      </div>
      <hr style="margin-bottom: 30px;">
      
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 18px; font-weight: bold; margin: 0; text-transform: uppercase;">${report.name}</h1>
        <p style="font-size: 14px; color: #6b7280; margin: 10px 0;">${periodText}</p>
      </div>
      
      <div style="margin-bottom: 30px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead>
            <tr style="background-color: #f9fafb;">
              <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: left;">Élément</th>
              <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: center;">Valeur</th>
              <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: left;">Observations</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #e5e7eb; padding: 8px;">Nombre de chambres</td>
              <td style="border: 1px solid #e5e7eb; padding: 8px; text-align: center;">${data?.chambers?.length || 0}</td>
              <td style="border: 1px solid #e5e7eb; padding: 8px;"></td>
            </tr>
            <tr>
              <td style="border: 1px solid #e5e7eb; padding: 8px;">Chambres occupées</td>
              <td style="border: 1px solid #e5e7eb; padding: 8px; text-align: center;">${stats.value.todayLocations}</td>
              <td style="border: 1px solid #e5e7eb; padding: 8px;"></td>
            </tr>
            <tr>
              <td style="border: 1px solid #e5e7eb; padding: 8px;">Taux d'occupation</td>
              <td style="border: 1px solid #e5e7eb; padding: 8px; text-align: center;">${stats.value.occupancyRate}%</td>
              <td style="border: 1px solid #e5e7eb; padding: 8px;"></td>
            </tr>
            <tr>
              <td style="border: 1px solid #e5e7eb; padding: 8px;">Revenus générés</td>
              <td style="border: 1px solid #e5e7eb; padding: 8px; text-align: center;">${formatCurrency(stats.value.todayRevenue)}</td>
              <td style="border: 1px solid #e5e7eb; padding: 8px;"></td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 10px; color: #6b7280;">
        <div style="display: flex; justify-content: space-between;">
          <span>Paradisias Hotel est situé à Man non loin du lycée moderne de Man</span>
          <span>Contact: +225 0787572030</span>
        </div>
      </div>
    </div>
  `
}

const generateAdvancedReportHtml = () => {
  const report = selectedReport.value
  const data = reportData.value
  
  const periodText = reportPeriod.value === 'today' ? 'Aujourd\'hui' :
                   reportPeriod.value === 'week' ? 'Cette semaine' :
                   reportPeriod.value === 'month' ? 'Ce mois' :
                   `Le ${formatDate(customDate.value)}`
  
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; font-size: 12px; color: #6b7280; margin-bottom: 20px;">
          <span>Paradisias Hotel</span>
          <span>Tel: +225 0787572030</span>
        </div>
        <h1 style="font-size: 24px; font-weight: bold; margin: 0; text-transform: uppercase;">${report.name} - Analyse Avancée</h1>
        <p style="font-size: 14px; color: #6b7280; margin: 10px 0;">${periodText}</p>
      </div>
      
      <div style="margin-bottom: 30px;">
        <p style="text-align: center; font-size: 16px; line-height: 1.6;">
          Cette analyse avancée présente ${report.description.toLowerCase()} avec des métriques détaillées 
          et des visualisations pour la période sélectionnée.
        </p>
      </div>
      
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="margin-top: 0;">Indicateurs clés de performance</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
          <div>
            <strong>Nombre de locations:</strong> ${data?.locations?.length || 0}
          </div>
          <div>
            <strong>Nombre de chambres:</strong> ${data?.chambers?.length || 0}
          </div>
          <div>
            <strong>Taux d'occupation:</strong> ${stats.value.occupancyRate}%
          </div>
          <div>
            <strong>Revenus générés:</strong> ${formatCurrency(stats.value.todayRevenue)}
          </div>
        </div>
      </div>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center;">
        Rapport généré le ${formatDate(new Date().toISOString())} par ${authStore.profile?.name || 'Système'}
      </div>
    </div>
  `
}

const downloadPdf = () => {
  const options = {
    margin: [10, 10],
    filename: `${selectedReport.value.id}_${activeTab.value}_${reportPeriod.value}_${new Date().toLocaleDateString()}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }
  
  html2pdf()
    .from(pdfPreviewContent.value)
    .set(options)
    .save()
    .then(() => {
      closePdfPreview()
    })
}

const closePdfPreview = () => {
  showPdfPreview.value = false
  pdfPreviewContent.value = ''
  isGenerating.value = false
}

const handleTabChange = (tabId) => {
  activeTab.value = tabId
}

// Lifecycle
onMounted(() => {
  refreshData()
})
</script> 