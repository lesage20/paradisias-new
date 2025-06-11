<template>
  <div class="space-y-6">
    <!-- Header avec actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Réservations</h1>
        <p class="text-gray-600 mt-1">Gestion des réservations et demandes de location</p>
      </div>
      <div class="mt-4 sm:mt-0 flex items-center space-x-3">
        <button @click="exportData" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200">
          <Download class="w-4 h-4 mr-2" />
          Exporter
        </button>
        <button @click="openCreateModal" class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200">
          <Plus class="w-4 h-4 mr-2" />
          Nouvelle réservation
        </button>
      </div>
    </div>

    <!-- Statistiques rapides -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Calendar class="w-6 h-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Aujourd'hui</p>
            <p class="text-2xl font-bold text-gray-900">{{ todayReservations }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Clock class="w-6 h-6 text-yellow-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">En attente</p>
            <p class="text-2xl font-bold text-gray-900">{{ pendingReservations }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircle class="w-6 h-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Confirmées</p>
            <p class="text-2xl font-bold text-gray-900">{{ confirmedReservations }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <DollarSign class="w-6 h-6 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Revenus prévisionnels</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(expectedRevenue) }}</p>
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
            <input
              v-model="filters.search"
              type="text"
              placeholder="Client, téléphone, référence..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Statut</label>
          <select v-model="filters.status" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmée</option>
            <option value="cancelled">Annulée</option>
            <option value="completed">Terminée</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Période</label>
          <select v-model="filters.period" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <option value="">Toutes les périodes</option>
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Type de chambre</label>
          <select v-model="filters.roomType" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <option value="">Tous les types</option>
            <option value="standard">Standard</option>
            <option value="deluxe">Deluxe</option>
            <option value="suite">Suite</option>
            <option value="vip">VIP</option>
          </select>
        </div>
      </div>
      
      <div class="mt-4 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button @click="resetFilters" class="text-sm text-gray-500 hover:text-gray-700">
            Réinitialiser filtres
          </button>
          <span class="text-sm text-gray-500">{{ filteredReservations.length }} résultat(s)</span>
        </div>
        
        <div v-if="selectedReservations.length > 0" class="flex items-center space-x-2">
          <span class="text-sm text-gray-500">{{ selectedReservations.length }} sélectionné(s)</span>
          <button @click="bulkAction('confirm')" class="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium text-white bg-green-600 hover:bg-green-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200">
            Confirmer
          </button>
          <button @click="bulkAction('cancel')" class="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium text-white bg-red-600 hover:bg-red-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200">
            Annuler
          </button>
        </div>
      </div>
    </div>

    <!-- Tableau des réservations -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Liste des réservations</h3>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  :checked="selectedReservations.length === filteredReservations.length"
                  @change="toggleSelectAll"
                  class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Référence</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates séjour</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chambre demandée</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix estimé</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="reservation in paginatedReservations" :key="reservation.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <input
                  type="checkbox"
                  :value="reservation.id"
                  v-model="selectedReservations"
                  class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ reservation.reference }}</div>
                <div class="text-sm text-gray-500">{{ formatDate(reservation.createdAt) }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <User class="w-5 h-5 text-purple-600" />
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">{{ reservation.client.name }}</div>
                    <div class="text-sm text-gray-500">{{ reservation.client.phone }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ formatDate(reservation.checkIn) }}</div>
                <div class="text-sm text-gray-500">{{ formatDate(reservation.checkOut) }}</div>
                <div class="text-xs text-gray-400">{{ calculateNights(reservation.checkIn, reservation.checkOut) }} nuit(s)</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ reservation.roomType }}</div>
                <div class="text-sm text-gray-500">{{ reservation.occupants }} personne(s)</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ formatCurrency(reservation.estimatedPrice) }}</div>
              </td>
              <td class="px-6 py-4">
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getStatusColor(reservation.status)
                ]">
                  {{ getStatusLabel(reservation.status) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center space-x-2">
                  <button @click="viewReservation(reservation)" class="text-purple-600 hover:text-purple-900">
                    <Eye class="w-4 h-4" />
                  </button>
                  <button @click="convertToLocation(reservation)" class="text-green-600 hover:text-green-900" title="Convertir en location">
                    <ArrowRight class="w-4 h-4" />
                  </button>
                  <button @click="editReservation(reservation)" class="text-blue-600 hover:text-blue-900">
                    <Edit class="w-4 h-4" />
                  </button>
                  <button @click="deleteReservation(reservation)" class="text-red-600 hover:text-red-900">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-700">Afficher</span>
          <select v-model="itemsPerPage" class="border border-gray-300 rounded px-2 py-1 text-sm">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
          <span class="text-sm text-gray-700">par page</span>
        </div>
        
        <div class="flex items-center space-x-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
          >
            Précédent
          </button>
          
          <div class="flex items-center space-x-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="currentPage = page"
              :class="[
                'px-3 py-1 text-sm rounded',
                currentPage === page
                  ? 'bg-purple-600 text-white'
                  : 'border border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
          </div>
          
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de création/édition -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeModal"
    >
      <div
        class="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-screen overflow-y-auto"
        @click.stop
      >
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">
            {{ isEditing ? 'Modifier la réservation' : 'Nouvelle réservation' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <form @submit.prevent="saveReservation" class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nom du client *</label>
              <input
                v-model="form.clientName"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Nom complet"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
              <input
                v-model="form.clientPhone"
                type="tel"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="+225 XX XX XX XX"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date d'arrivée souhaitée *</label>
              <input
                v-model="form.checkIn"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date de départ souhaitée *</label>
              <input
                v-model="form.checkOut"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div class="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button type="button" @click="closeModal" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200">
              Annuler
            </button>
            <button type="submit" class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200" :disabled="isLoading">
              <span v-if="isLoading">Enregistrement...</span>
              <span v-else>{{ isEditing ? 'Mettre à jour' : 'Créer la réservation' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Plus, Search, Download, Calendar, User, Eye, Edit, Trash2, X,
  Clock, CheckCircle, DollarSign, ArrowRight
} from 'lucide-vue-next'

// État
const showModal = ref(false)
const isEditing = ref(false)
const isLoading = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(25)
const selectedReservations = ref([])

// Filtres
const filters = ref({
  search: '',
  status: '',
  period: '',
  roomType: ''
})

// Formulaire
const form = ref({
  clientName: '',
  clientPhone: '',
  checkIn: '',
  checkOut: ''
})

// Données mockées
const reservations = ref([
  {
    id: 1,
    reference: 'RES-2024-001',
    client: {
      name: 'Aminata Traoré',
      phone: '+225 07 88 99 00',
      email: 'aminata.traore@gmail.com'
    },
    checkIn: '2024-01-20',
    checkOut: '2024-01-23',
    roomType: 'Deluxe',
    occupants: 2,
    estimatedPrice: 180000,
    status: 'pending',
    specialRequests: 'Vue mer si possible',
    createdAt: '2024-01-10'
  },
  {
    id: 2,
    reference: 'RES-2024-002',
    client: {
      name: 'Koffi Yao',
      phone: '+225 05 44 55 66',
      email: 'koffi.yao@yahoo.fr'
    },
    checkIn: '2024-01-25',
    checkOut: '2024-01-28',
    roomType: 'Suite',
    occupants: 4,
    estimatedPrice: 300000,
    status: 'confirmed',
    specialRequests: 'Lit bébé requis',
    createdAt: '2024-01-11'
  }
])

// Computed - Statistiques
const todayReservations = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return reservations.value.filter(r => r.checkIn === today).length
})

const pendingReservations = computed(() => {
  return reservations.value.filter(r => r.status === 'pending').length
})

const confirmedReservations = computed(() => {
  return reservations.value.filter(r => r.status === 'confirmed').length
})

const expectedRevenue = computed(() => {
  return reservations.value
    .filter(r => ['pending', 'confirmed'].includes(r.status))
    .reduce((sum, r) => sum + r.estimatedPrice, 0)
})

// Computed - Filtrage et pagination
const filteredReservations = computed(() => {
  let filtered = reservations.value

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(reservation =>
      reservation.client.name.toLowerCase().includes(search) ||
      reservation.client.phone.includes(search) ||
      reservation.reference.toLowerCase().includes(search)
    )
  }

  if (filters.value.status) {
    filtered = filtered.filter(reservation => reservation.status === filters.value.status)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredReservations.value.length / itemsPerPage.value))

const paginatedReservations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredReservations.value.slice(start, end)
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

// Méthodes
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR')
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-CI', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount)
}

const calculateNights = (checkIn, checkOut) => {
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const diffTime = Math.abs(end - start)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-green-100 text-green-800'
  }
  return colors[status] || colors.pending
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    cancelled: 'Annulée',
    completed: 'Terminée'
  }
  return labels[status] || status
}

const resetFilters = () => {
  filters.value = {
    search: '',
    status: '',
    period: '',
    roomType: ''
  }
}

const toggleSelectAll = () => {
  if (selectedReservations.value.length === filteredReservations.value.length) {
    selectedReservations.value = []
  } else {
    selectedReservations.value = filteredReservations.value.map(reservation => reservation.id)
  }
}

const openCreateModal = () => {
  isEditing.value = false
  form.value = {
    clientName: '',
    clientPhone: '',
    checkIn: '',
    checkOut: ''
  }
  showModal.value = true
}

const editReservation = (reservation) => {
  isEditing.value = true
  form.value = {
    id: reservation.id,
    clientName: reservation.client.name,
    clientPhone: reservation.client.phone,
    checkIn: reservation.checkIn,
    checkOut: reservation.checkOut
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
}

const saveReservation = async () => {
  isLoading.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    closeModal()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  } finally {
    isLoading.value = false
  }
}

const viewReservation = (reservation) => {
  console.log('Voir détails de la réservation:', reservation)
}

const convertToLocation = (reservation) => {
  console.log('Convertir en location:', reservation)
}

const deleteReservation = async (reservation) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer la réservation ${reservation.reference} ?`)) {
    const index = reservations.value.findIndex(r => r.id === reservation.id)
    if (index !== -1) {
      reservations.value.splice(index, 1)
    }
  }
}

const bulkAction = async (action) => {
  if (confirm(`Appliquer l'action "${action}" aux ${selectedReservations.value.length} réservations sélectionnées ?`)) {
    selectedReservations.value = []
  }
}

const exportData = () => {
  console.log('Export des données de réservations')
}

onMounted(() => {
  // Charger les données initiales
})
</script> 