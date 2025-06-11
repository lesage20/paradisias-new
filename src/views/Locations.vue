<template>
  <div class="space-y-6">
    <!-- Header avec actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Locations</h1>
        <p class="text-gray-600 mt-1">Gestion des locations et réservations actives</p>
      </div>
      <div class="mt-4 sm:mt-0 flex items-center space-x-3">
        <button @click="exportData" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200">
          <Download class="w-4 h-4 mr-2" />
          Exporter
        </button>
        <button @click="openCreateModal" class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200">
          <Plus class="w-4 h-4 mr-2" />
          Nouvelle location
        </button>
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
              placeholder="Client, chambre, réservation..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Statut</label>
          <select v-model="filters.status" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <option value="">Tous les statuts</option>
            <option value="confirmed">Confirmée</option>
            <option value="pending">En attente</option>
            <option value="checked_in">Arrivée</option>
            <option value="checked_out">Départ</option>
            <option value="cancelled">Annulée</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date d'arrivée</label>
          <input
            v-model="filters.dateFrom"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date de départ</label>
          <input
            v-model="filters.dateTo"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
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
          <button @click="bulkAction('confirm')" class="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium text-white bg-green-600 hover:bg-green-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200">
            Confirmer
          </button>
          <button @click="bulkAction('cancel')" class="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium text-white bg-red-600 hover:bg-red-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200">
            Annuler
          </button>
        </div>
      </div>
    </div>

    <!-- Tableau des locations -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Liste des locations</h3>
          <div class="flex items-center space-x-2">
            <button
              v-for="view in ['grid', 'list']"
              :key="view"
              @click="currentView = view"
              :class="[
                'p-2 rounded-lg',
                currentView === view ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'
              ]"
            >
              <component :is="view === 'grid' ? Grid : List" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Vue liste -->
      <div v-if="currentView === 'list'" class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  :checked="selectedLocations.length === filteredLocations.length"
                  @change="toggleSelectAll"
                  class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chambre</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="location in paginatedLocations" :key="location.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <input
                  type="checkbox"
                  :value="location.id"
                  v-model="selectedLocations"
                  class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <User class="w-5 h-5 text-purple-600" />
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">{{ location.client.name }}</div>
                    <div class="text-sm text-gray-500">{{ location.client.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ location.room.number }}</div>
                <div class="text-sm text-gray-500">{{ location.room.type }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ formatDate(location.checkIn) }}</div>
                <div class="text-sm text-gray-500">{{ formatDate(location.checkOut) }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ formatCurrency(location.totalAmount) }}</div>
              </td>
              <td class="px-6 py-4">
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getStatusColor(location.status)
                ]">
                  {{ getStatusLabel(location.status) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center space-x-2">
                  <button @click="viewLocation(location)" class="text-purple-600 hover:text-purple-900">
                    <Eye class="w-4 h-4" />
                  </button>
                  <button @click="editLocation(location)" class="text-blue-600 hover:text-blue-900">
                    <Edit class="w-4 h-4" />
                  </button>
                  <button @click="deleteLocation(location)" class="text-red-600 hover:text-red-900">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Vue grille -->
      <div v-else class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="location in paginatedLocations"
            :key="location.id"
            class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <User class="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 class="text-sm font-medium text-gray-900">{{ location.client.name }}</h4>
                  <p class="text-xs text-gray-500">{{ location.client.email }}</p>
                </div>
              </div>
              <span :class="[
                'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                getStatusColor(location.status)
              ]">
                {{ getStatusLabel(location.status) }}
              </span>
            </div>
            
            <div class="space-y-2 mb-4">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Chambre</span>
                <span class="font-medium">{{ location.room.number }} - {{ location.room.type }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Arrivée</span>
                <span class="font-medium">{{ formatDate(location.checkIn) }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Départ</span>
                <span class="font-medium">{{ formatDate(location.checkOut) }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Montant</span>
                <span class="font-medium text-purple-600">{{ formatCurrency(location.totalAmount) }}</span>
              </div>
            </div>
            
            <div class="flex items-center justify-between pt-4 border-t border-gray-200">
              <button @click="viewLocation(location)" class="text-purple-600 hover:text-purple-900 text-sm font-medium">
                Détails
              </button>
              <div class="flex items-center space-x-2">
                <button @click="editLocation(location)" class="text-blue-600 hover:text-blue-900">
                  <Edit class="w-4 h-4" />
                </button>
                <button @click="deleteLocation(location)" class="text-red-600 hover:text-red-900">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
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
            {{ isEditing ? 'Modifier la location' : 'Nouvelle location' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <form @submit.prevent="saveLocation" class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Client *</label>
              <input
                v-model="form.clientName"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Nom du client"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                v-model="form.clientEmail"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="email@example.com"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
              <input
                v-model="form.clientPhone"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="+225 XX XX XX XX"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Type de chambre *</label>
              <select
                v-model="form.roomType"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Sélectionner un type</option>
                <option value="standard">Standard</option>
                <option value="deluxe">Deluxe</option>
                <option value="suite">Suite</option>
                <option value="vip">VIP</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date d'arrivée *</label>
              <input
                v-model="form.checkIn"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date de départ *</label>
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
              <span v-else>{{ isEditing ? 'Mettre à jour' : 'Créer la location' }}</span>
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
  Plus, Search, Download, Grid, List, User, Eye, Edit, Trash2, X
} from 'lucide-vue-next'

// État
const showModal = ref(false)
const isEditing = ref(false)
const isLoading = ref(false)
const currentView = ref('list')
const currentPage = ref(1)
const itemsPerPage = ref(25)
const selectedLocations = ref([])

// Filtres
const filters = ref({
  search: '',
  status: '',
  dateFrom: '',
  dateTo: ''
})

// Formulaire
const form = ref({
  clientName: '',
  clientEmail: '',
  clientPhone: '',
  roomType: '',
  checkIn: '',
  checkOut: ''
})

// Données mockées
const locations = ref([
  {
    id: 1,
    client: {
      name: 'Jean Kouadio',
      email: 'jean.kouadio@gmail.com',
      phone: '+225 07 12 34 56'
    },
    room: {
      number: '205',
      type: 'Deluxe'
    },
    checkIn: '2024-01-15',
    checkOut: '2024-01-18',
    totalAmount: 180000,
    status: 'confirmed'
  },
  {
    id: 2,
    client: {
      name: 'Marie Diallo',
      email: 'marie.diallo@yahoo.fr',
      phone: '+225 05 98 76 54'
    },
    room: {
      number: '101',
      type: 'Standard'
    },
    checkIn: '2024-01-12',
    checkOut: '2024-01-15',
    totalAmount: 120000,
    status: 'checked_in'
  }
])

// Computed
const filteredLocations = computed(() => {
  let filtered = locations.value

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(location =>
      location.client.name.toLowerCase().includes(search) ||
      location.client.email.toLowerCase().includes(search) ||
      location.room.number.includes(search)
    )
  }

  if (filters.value.status) {
    filtered = filtered.filter(location => location.status === filters.value.status)
  }

  return filtered
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

const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    checked_in: 'bg-green-100 text-green-800',
    checked_out: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return colors[status] || colors.pending
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    checked_in: 'Arrivée',
    checked_out: 'Départ',
    cancelled: 'Annulée'
  }
  return labels[status] || status
}

const resetFilters = () => {
  filters.value = {
    search: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  }
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
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    roomType: '',
    checkIn: '',
    checkOut: ''
  }
  showModal.value = true
}

const editLocation = (location) => {
  isEditing.value = true
  form.value = {
    id: location.id,
    clientName: location.client.name,
    clientEmail: location.client.email,
    clientPhone: location.client.phone,
    roomType: location.room.type.toLowerCase(),
    checkIn: location.checkIn,
    checkOut: location.checkOut
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
}

const saveLocation = async () => {
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

const viewLocation = (location) => {
  console.log('Voir détails:', location)
}

const deleteLocation = async (location) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer la location de ${location.client.name} ?`)) {
    const index = locations.value.findIndex(l => l.id === location.id)
    if (index !== -1) {
      locations.value.splice(index, 1)
    }
  }
}

const bulkAction = async (action) => {
  if (confirm(`Appliquer l'action "${action}" aux ${selectedLocations.value.length} locations sélectionnées ?`)) {
    selectedLocations.value = []
  }
}

const exportData = () => {
  console.log('Export des données')
}

onMounted(() => {
  // Charger les données initiales
})
</script> 