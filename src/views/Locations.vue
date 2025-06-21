<template>
  <div class="space-y-6">
    <!-- Header avec actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Séjours</h1>
        <p class="text-gray-600 mt-1">Gestion des clients présents dans l'hôtel</p>
      </div>
      <div class="mt-4 sm:mt-0 flex items-center space-x-3">
        <button @click="exportData"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200">
          <Download class="w-4 h-4 mr-2" />
          Exporter
        </button>
        <button @click="openCreateModal" :class="[
          'inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200',
          themeClasses.btnPrimary
        ]">
          <Plus class="w-4 h-4 mr-2" />
          Nouveau séjour
        </button>
      </div>
    </div>

    <!-- Statistiques rapides -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Calendar class="w-6 h-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Arrivées aujourd'hui</p>
            <p class="text-2xl font-bold text-gray-900">{{ todayArrivals }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircle class="w-6 h-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Payées</p>
            <p class="text-2xl font-bold text-gray-900">{{ paidLocations }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Clock class="w-6 h-6 text-yellow-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Avec dettes</p>
            <p class="text-2xl font-bold text-gray-900">{{ debtLocations }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <DollarSign class="w-6 h-6 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total locations</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalLocations }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtres et recherche -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input v-model="filters.search" type="text" placeholder="Client, chambre, réservation..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Statut</label>
          <select v-model="filters.status" @change="loadLocations"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <option value="">Tous les statuts</option>
            <option value="pj">Payé jour</option>
            <option value="dj">Dette jour</option>
            <option value="dt">Dette totale</option>
            <option value="dp">Dette payée</option>
            <option value="archive">Archivée</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date d'arrivée</label>
          <input v-model="filters.dateFrom" type="date" @change="loadLocations"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date de départ</label>
          <input v-model="filters.dateTo" type="date" @change="loadLocations"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
        </div>
      </div>

      <div class="mt-4 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button @click="resetFilters" class="text-sm text-gray-500 hover:text-gray-700">
            Réinitialiser filtres
          </button>
          <span class="text-sm text-gray-500">{{ filteredLocations.length }} résultat(s)</span>
        </div>

        <div v-if="selectedLocations.length > 0" class="flex items-center space-x-2">
          <span class="text-sm text-gray-500">{{ selectedLocations.length }} sélectionné(s)</span>
          <button @click="bulkAction('pj')" :class="[
            'inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium text-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200',
            themeClasses.btnPrimary
          ]">
            Marquer payé
          </button>
          <button @click="bulkAction('dj')" :class="[
            'inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium text-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200',
            themeClasses.btnSecondary
          ]">
            Dette jour
          </button>
          <button @click="bulkAction('archive')"
            class="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium text-white bg-red-600 hover:bg-red-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200">
            Archiver
          </button>
        </div>
      </div>
    </div>

    <!-- Loading spinner -->
    <div v-if="isLoading && !locations.length" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    </div>

    <!-- Tableau des locations avec le nouveau composant DataTable -->
    <DataTable v-else title="Liste des séjours" :items="paginatedLocations" :columns="tableColumns" :selectable="true"
      :pagination="paginationConfig" item-key="id" empty-title="Aucune location trouvée"
      empty-message="Aucune location ne correspond aux critères de recherche."
      @update:current-page="currentPage = $event" @update:items-per-page="itemsPerPage = $event"
      @selection-change="selectedLocations = $event" @sort="handleSort">
      <!-- Slot pour l'en-tête avec boutons de vue -->
      <template #header>
        <div class="flex items-center space-x-2">
          <button v-for="view in ['grid', 'list']" :key="view" @click="currentView = view" :class="[
            'p-2 rounded-lg transition-colors',
            currentView === view
              ? `${themeClasses.bgPrimaryLight} ${themeClasses.textPrimary}`
              : 'text-gray-400 hover:text-gray-600'
          ]">
            <component :is="view === 'grid' ? Grid : List" class="w-4 h-4" />
          </button>
        </div>
      </template>

      <!-- Actions en lot -->
      <template #bulk-actions>
        <button @click="bulkAction('pj')" :class="[
          'inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium text-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200',
          themeClasses.btnPrimary
        ]">
          Marquer payé
        </button>
        <button @click="bulkAction('dj')" :class="[
          'inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium text-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200',
          themeClasses.btnSecondary
        ]">
          Dette jour
        </button>
        <button @click="bulkAction('archive')"
          class="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium text-white bg-red-600 hover:bg-red-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200">
          Archiver
        </button>
      </template>

      <!-- Colonne personnalisée pour la référence -->
      <template #column-reference="{ item }">
        <div>
          <div class="text-sm font-medium text-gray-900">{{ item.reference || `LOC-${item.id}` }}</div>
          <div class="text-sm text-gray-500">{{ formatDate(item.created_at) }}</div>
        </div>
      </template>

      <!-- Colonne personnalisée pour le client (utilise le type 'user' automatiquement) -->
      <template #column-guest="{ item, themeClasses }">
        <div class="flex items-center">
          <div :class="[
            'w-10 h-10 rounded-full flex items-center justify-center',
            themeClasses.bgPrimary
          ]">
            <User class="w-5 h-5 text-white" />
          </div>
          <div class="ml-3">
            <div class="text-sm font-medium text-gray-900">{{ getGuestName(item.guest) }}</div>
            <div class="text-sm text-gray-500">{{ getGuestEmail(item.guest) }}</div>
          </div>
        </div>
      </template>

      <!-- Colonne personnalisée pour la chambre -->
      <template #column-room="{ item }">
        <div>
          <div class="text-sm font-medium text-gray-900">{{ getRoomNumber(item.room) }}</div>
          <div class="text-sm text-gray-500">{{ getRoomType(item.room) }}</div>
        </div>
      </template>

      <!-- Colonne personnalisée pour les dates -->
      <template #column-dates="{ item }">
        <div>
          <div class="text-sm text-gray-900">{{ formatDate(item.checkIn) }}</div>
          <div class="text-sm text-gray-500">{{ formatDate(item.checkOut) }}</div>
        </div>
      </template>

      <!-- Colonne personnalisée pour le statut -->
      <template #column-status="{ item }">
        <span :class="[
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          getStatusColor(item.status)
        ]">
          {{ getStatusLabel(item.status) }}
        </span>
      </template>

      <!-- Actions pour chaque ligne -->
      <template #actions="{ item, themeClasses }">
        <div class="flex items-center space-x-2">
          <button @click="viewLocation(item)" :class="[
            'text-sm font-medium transition-colors',
            themeClasses.textPrimary,
            themeClasses.hoverPrimary
          ]">
            <Eye class="w-4 h-4" />
          </button>
          <button @click="editLocation(item)" class="text-blue-600 hover:text-blue-900">
            <Edit class="w-4 h-4" />
          </button>
          <button @click="deleteLocation(item)" class="text-red-600 hover:text-red-900">
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </template>
    </DataTable>

    <!-- Modal de création/édition -->
    <Modal v-model="showModal" :title="isEditing ? 'Modifier la location' : 'Nouvelle location'" size="lg"
      :loading="isSaving" :disabled="isSaving" @close="closeModal" @confirm="saveLocation">
      <form class="p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Client *</label>
            <select v-model="form.guest" required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option value="">Sélectionner un client</option>
              <option v-for="client in clients" :key="client.id" :value="client.id">
                {{ client.name }} {{ client.firstname }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Chambre *</label>
            <select v-model="form.room" required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option value="">Sélectionner une chambre</option>
              <option v-for="room in availableRooms" :key="room.id" :value="room.id">
                Chambre {{ room.number }} - {{ getRoomTypeName(room.type) }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date d'arrivée *</label>
            <input v-model="form.checkIn" type="datetime-local" required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date de départ *</label>
            <input v-model="form.checkOut" type="datetime-local" required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nombre d'adultes</label>
            <input v-model.number="form.adults" type="number" min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nombre d'enfants</label>
            <input v-model.number="form.children" type="number" min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
          </div>

          <!-- <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Prix total</label>
            <input
              v-model.number="form.totalPrice"
              type="number"
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div> -->

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Mode de paiement</label>
            <select v-model="form.payment"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option value="espece">Espèces</option>
              <option value="cheque">Chèque</option>
              <option value="visa">Carte bancaire</option>
              <option value="devise">Devise</option>
            </select>
          </div>

        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { useAlerts } from '@/composables/useAlerts'
import {
  Plus, Search, Download, Grid, List, User, Eye, Edit, Trash2, Calendar, Clock, CheckCircle, DollarSign
} from 'lucide-vue-next'
import { locationsAPI, roomsAPI, roomTypesAPI, clientsAPI, mapStatusFromAPI } from '../services/api.js'
import { DataTable, Modal } from '@/components/ui'

// Stores et composables
const authStore = useAuthStore()
const themeStore = useThemeStore()
const { showToast, showConfirm, handleApiError, handleApiSuccess } = useAlerts()

// État
const showModal = ref(false)
const isEditing = ref(false)
const isLoading = ref(false)
const isSaving = ref(false)
const currentView = ref('list')
const currentPage = ref(1)
const itemsPerPage = ref(25)
const selectedLocations = ref([])

// Données
const locations = ref([])
const clients = ref([])
const rooms = ref([])
const roomTypes = ref([])

// Filtres
const filters = ref({
  search: '',
  status: '',
  dateFrom: '',
  dateTo: ''
})

// Formulaire
const form = ref({
  guest: '',
  room: '',
  checkIn: '',
  checkOut: '',
  adults: 1,
  children: 0,
  totalPrice: 0,
  payment: 'espece',
  status: 'pj'
})

// Computed
const filteredLocations = computed(() => {
  let result = locations.value

  // Filtrage par recherche
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    result = result.filter(location => {
      const guestName = getGuestName(location.guest).toLowerCase()
      const roomNumber = getRoomNumber(location.room).toLowerCase()
      const reference = (location.reference || `LOC-${location.id}`).toLowerCase()

      return guestName.includes(searchTerm) ||
        roomNumber.includes(searchTerm) ||
        reference.includes(searchTerm)
    })
  }

  // Filtrage par statut
  if (filters.value.status) {
    result = result.filter(location => location.status === filters.value.status)
  }

  // Filtrage par type de chambre
  if (filters.value.roomType) {
    result = result.filter(location => location.room?.room_type?.id === parseInt(filters.value.roomType))
  }

  // Filtrage par dates
  if (filters.value.dateFrom) {
    result = result.filter(location => new Date(location.checkIn) >= new Date(filters.value.dateFrom))
  }
  if (filters.value.dateTo) {
    result = result.filter(location => new Date(location.checkOut) <= new Date(filters.value.dateTo))
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredLocations.value.length / itemsPerPage.value))

const paginatedLocations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredLocations.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const maxPages = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxPages / 2))
  let end = Math.min(totalPages.value, start + maxPages - 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const availableRooms = computed(() => {
  // Filtrer les chambres disponibles
  return rooms.value.filter(room => room.status === 'libre' || room.status === 'lp')
})

// Computed - Statistiques
const todayArrivals = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return locations.value.filter(location => {
    return location.checkIn?.startsWith(today)
  }).length
})

const paidLocations = computed(() => {
  return locations.value.filter(location => location.status === 'pj' || location.status === 'dp').length
})

const debtLocations = computed(() => {
  return locations.value.filter(location => location.status === 'dj' || location.status === 'dt').length
})

const totalLocations = computed(() => {
  return locations.value.length
})

const themeClasses = computed(() => themeStore.themeClasses)

// Configuration des colonnes pour le DataTable
const tableColumns = computed(() => [
  {
    key: 'reference',
    label: 'Référence',
    sortable: true,
    class: 'text-sm font-medium text-gray-900'
  },
  {
    key: 'guest',
    label: 'Client',
    type: 'user',
    sortable: true
  },
  {
    key: 'room',
    label: 'Chambre',
    sortable: true
  },
  {
    key: 'dates',
    label: 'Dates',
    sortable: true
  },
  {
    key: 'totalPrice',
    label: 'Montant',
    type: 'currency',
    sortable: true
  },
  {
    key: 'status',
    label: 'Statut',
    type: 'badge',
    sortable: true
  }
])

// Configuration de la pagination
const paginationConfig = computed(() => ({
  currentPage: currentPage.value,
  totalPages: totalPages.value,
  totalItems: filteredLocations.value.length,
  itemsPerPage: itemsPerPage.value
}))

// Méthodes utilitaires
const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('fr-FR')
}

const formatCurrency = (amount) => {
  if (!amount) return '0 FCFA'
  return new Intl.NumberFormat('fr-CI', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount)
}

const getStatusColor = (status) => {
  const colors = {
    'pj': 'bg-green-100 text-green-800',    // Payé jour
    'dj': 'bg-yellow-100 text-yellow-800',  // Dette jour
    'dt': 'bg-orange-100 text-orange-800',  // Dette totale
    'dp': 'bg-blue-100 text-blue-800',      // Dette payée
    'archive': 'bg-red-100 text-red-800'    // Archivée
  }
  return colors[status] || colors['pj']
}

const getStatusLabel = (status) => {
  const labels = {
    'pj': 'Payé jour',
    'dj': 'Dette jour',
    'dt': 'Dette totale',
    'dp': 'Dette payée',
    'archive': 'Archivée'
  }
  return labels[status] || status
}

const getGuestName = (guestId) => {
  const client = clients.value.find(c => c.id === guestId)
  return client ? `${client.name} ${client.firstname}` : 'Client inconnu'
}

const getGuestEmail = (guestId) => {
  const client = clients.value.find(c => c.id === guestId)
  return client?.email || 'N/A'
}

const getRoomNumber = (roomId) => {
  const room = rooms.value.find(r => r.id === roomId)
  return room?.number || 'N/A'
}

const getRoomType = (roomId) => {
  const room = rooms.value.find(r => r.id === roomId)
  if (!room) return 'N/A'

  const roomType = roomTypes.value.find(rt => rt.id === room.type)
  return roomType?.name || 'Standard'
}

const getRoomTypeName = (typeId) => {
  const roomType = roomTypes.value.find(rt => rt.id === typeId)
  return roomType?.name || 'Standard'
}

// Méthodes de chargement des données
const loadLocations = async () => {
  try {
    isLoading.value = true

    const apiFilters = {}
    if (filters.value.dateFrom) {
      apiFilters.checkIn_date = filters.value.dateFrom
    }
    if (filters.value.dateTo) {
      apiFilters.checkOut_date = filters.value.dateTo
    }

    const response = await locationsAPI.getLocations(apiFilters)
    locations.value = response || []
  } catch (error) {
    console.error('Erreur lors du chargement des locations:', error)
    handleApiError(error, 'Erreur lors du chargement des locations')
  } finally {
    isLoading.value = false
  }
}

const loadClients = async () => {
  try {
    const response = await clientsAPI.getClients()
    clients.value = response || []
  } catch (error) {
    console.error('Erreur lors du chargement des clients:', error)
    handleApiError(error, 'Erreur lors du chargement des clients')
  }
}

const loadRooms = async () => {
  try {
    const response = await roomsAPI.getRooms()
    rooms.value = response || []
  } catch (error) {
    console.error('Erreur lors du chargement des chambres:', error)
    handleApiError(error, 'Erreur lors du chargement des chambres')
  }
}

const loadRoomTypes = async () => {
  try {
    const response = await roomTypesAPI.getRoomTypes()
    roomTypes.value = response || []
  } catch (error) {
    console.error('Erreur lors du chargement des types de chambres:', error)
    handleApiError(error, 'Erreur lors du chargement des types de chambres')
  }
}

// Méthodes d'actions
const resetFilters = () => {
  filters.value = {
    search: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  }
  loadLocations()
}

const toggleSelectAll = () => {
  if (selectedLocations.value.length === filteredLocations.value.length) {
    selectedLocations.value = []
  } else {
    selectedLocations.value = filteredLocations.value.map(location => location.id)
  }
}

const openCreateModal = () => {
  isEditing.value = false
  form.value = {
    guest: '',
    room: '',
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    totalPrice: 0,
    payment: 'espece',
    status: "ongoing"
  }
  showModal.value = true
}

const editLocation = (location) => {
  isEditing.value = true
  form.value = {
    id: location.id,
    guest: location.guest,
    room: location.room,
    checkIn: location.checkIn,
    checkOut: location.checkOut,
    adults: location.adults || 1,
    children: location.children || 0,
    totalPrice: location.totalPrice || 0,
    payment: location.payment || 'espece',
    status: location.status
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
}

const saveLocation = async () => {
  try {
    isSaving.value = true

    const locationData = {
      guest: form.value.guest,
      room: form.value.room,
      checkIn: form.value.checkIn,
      checkOut: form.value.checkOut,
      adults: form.value.adults,
      children: form.value.children,
      totalPrice: form.value.totalPrice,
      payment: form.value.payment,
      status: form.value.status,
      recorded_by: authStore.profile?.id || 1 // Utiliser l'ID de l'utilisateur connecté
    }

    if (isEditing.value) {
      await locationsAPI.updateLocation(form.value.id, locationData)
      handleApiSuccess('Location mise à jour avec succès')
    } else {
      // Créer la nouvelle location
      await locationsAPI.createLocation(locationData)

      // Mettre à jour automatiquement le statut de la chambre à "Occupée Propre"
      if (form.value.room) {
        try {
          await roomsAPI.updateRoom(form.value.room, { status: 'op' })
          console.log(`✅ Chambre ${form.value.room} mise à jour vers "Occupée Propre"`)
        } catch (roomError) {
          console.error('❌ Erreur lors de la mise à jour du statut de chambre:', roomError)
          // Ne pas bloquer la création de location si la mise à jour de chambre échoue
        }
      }
      handleApiSuccess('Location créée avec succès')
    }

    await loadLocations()
    await loadRooms() // Recharger les chambres pour refléter le changement de statut
    closeModal()

  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    handleApiError(error, 'Erreur lors de la sauvegarde de la location')
  } finally {
    isSaving.value = false
  }
}

const viewLocation = (location) => {
  console.log('Voir détails:', location)
  // TODO: implémenter la vue détaillée
}

const deleteLocation = async (location) => {
  const result = await showConfirm.delete(location.reference || `LOC-${location.id}`)

  if (result.isConfirmed) {
    try {
      await locationsAPI.deleteLocation(location.id)
      await loadLocations()
      handleApiSuccess('Location supprimée avec succès')
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      handleApiError(error, 'Erreur lors de la suppression de la location')
    }
  }
}

const bulkAction = async (action) => {
  const result = await showConfirm.action(
    'Action en masse',
    `Appliquer l'action "${getStatusLabel(action)}" aux ${selectedLocations.value.length} locations sélectionnées ?`,
    'Confirmer'
  )

  if (result.isConfirmed) {
    try {
      // Effectuer l'action en masse
      for (const locationId of selectedLocations.value) {
        await locationsAPI.patchLocation(locationId, { status: action })
      }

      selectedLocations.value = []
      await loadLocations()
      handleApiSuccess(`Action "${getStatusLabel(action)}" appliquée avec succès`)
    } catch (error) {
      console.error('Erreur lors de l\'action en masse:', error)
      handleApiError(error, 'Erreur lors de l\'action en masse')
    }
  }
}

const exportData = () => {
  console.log('Export des données')
  // TODO: implémenter l'export
}

// Surveillance des filtres de recherche
watch(() => filters.value.search, () => {
  currentPage.value = 1
})

// Méthodes de gestion des données
const handleSort = (sortConfig) => {
  // Implémentation du tri - pour l'instant on peut juste logger
  console.log('Tri demandé:', sortConfig)
  // TODO: Implémenter le tri réel des données
}

// Chargement initial
onMounted(async () => {
  await Promise.all([
    loadLocations(),
    loadClients(),
    loadRooms(),
    loadRoomTypes()
  ])
})
</script>