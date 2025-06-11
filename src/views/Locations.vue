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

    <!-- Statistiques rapides -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
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
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Clock class="w-6 h-6 text-yellow-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">En attente</p>
            <p class="text-2xl font-bold text-gray-900">{{ pendingLocations }}</p>
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
            <p class="text-2xl font-bold text-gray-900">{{ confirmedLocations }}</p>
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
          <select v-model="filters.status" @change="loadLocations" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <option value="">Tous les statuts</option>
            <option value="pj">En attente</option>
            <option value="dj">Confirmée</option>
            <option value="dt">Arrivée</option>
            <option value="dp">Départ</option>
            <option value="archive">Annulée</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date d'arrivée</label>
          <input
            v-model="filters.dateFrom"
            type="date"
            @change="loadLocations"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date de départ</label>
          <input
            v-model="filters.dateTo"
            type="date"
            @change="loadLocations"
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
          <button @click="bulkAction('dj')" class="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium text-white bg-green-600 hover:bg-green-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200">
            Confirmer
          </button>
          <button @click="bulkAction('archive')" class="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium text-white bg-red-600 hover:bg-red-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200">
            Annuler
          </button>
        </div>
      </div>
    </div>

    <!-- Loading spinner -->
    <div v-if="isLoading && !locations.length" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    </div>

    <!-- Tableau des locations -->
    <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200">
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
                  :checked="selectedLocations.length === filteredLocations.length && filteredLocations.length > 0"
                  @change="toggleSelectAll"
                  class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Référence</th>
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
                <div class="text-sm font-medium text-gray-900">{{ location.reference || `LOC-${location.id}` }}</div>
                <div class="text-sm text-gray-500">{{ formatDate(location.created_at) }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <User class="w-5 h-5 text-purple-600" />
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">{{ getGuestName(location.guest) }}</div>
                    <div class="text-sm text-gray-500">{{ getGuestEmail(location.guest) }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ getRoomNumber(location.room) }}</div>
                <div class="text-sm text-gray-500">{{ getRoomType(location.room) }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ formatDate(location.checkIn) }}</div>
                <div class="text-sm text-gray-500">{{ formatDate(location.checkOut) }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ formatCurrency(location.totalPrice) }}</div>
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
                  <h4 class="text-sm font-medium text-gray-900">{{ getGuestName(location.guest) }}</h4>
                  <p class="text-xs text-gray-500">{{ location.reference || `LOC-${location.id}` }}</p>
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
                <span class="font-medium">{{ getRoomNumber(location.room) }} - {{ getRoomType(location.room) }}</span>
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
                <span class="font-medium text-purple-600">{{ formatCurrency(location.totalPrice) }}</span>
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
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
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
              <select
                v-model="form.guest"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Sélectionner un client</option>
                <option v-for="client in clients" :key="client.id" :value="client.id">
                  {{ client.name }} {{ client.firstname }}
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Chambre *</label>
              <select
                v-model="form.room"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Sélectionner une chambre</option>
                <option v-for="room in availableRooms" :key="room.id" :value="room.id">
                  Chambre {{ room.number }} - {{ getRoomTypeName(room.type) }}
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date d'arrivée *</label>
              <input
                v-model="form.checkIn"
                type="datetime-local"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date de départ *</label>
              <input
                v-model="form.checkOut"
                type="datetime-local"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nombre d'adultes</label>
              <input
                v-model.number="form.adults"
                type="number"
                min="1"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nombre d'enfants</label>
              <input
                v-model.number="form.children"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Prix total</label>
              <input
                v-model.number="form.totalPrice"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Mode de paiement</label>
              <select
                v-model="form.payment"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="espece">Espèces</option>
                <option value="cheque">Chèque</option>
                <option value="visa">Carte bancaire</option>
                <option value="devise">Devise</option>
              </select>
            </div>
          </div>
          
          <div class="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button type="button" @click="closeModal" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200">
              Annuler
            </button>
            <button type="submit" class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200" :disabled="isSaving">
              <span v-if="isSaving">Enregistrement...</span>
              <span v-else>{{ isEditing ? 'Mettre à jour' : 'Créer la location' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  Plus, Search, Download, Grid, List, User, Eye, Edit, Trash2, X, Calendar, Clock, CheckCircle, DollarSign
} from 'lucide-vue-next'
import { locationsAPI, roomsAPI, roomTypesAPI, clientsAPI, mapStatusFromAPI } from '../services/api.js'

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
  let filtered = locations.value

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(location => {
      const guestName = getGuestName(location.guest).toLowerCase()
      const roomNumber = getRoomNumber(location.room).toLowerCase()
      const reference = (location.reference || `LOC-${location.id}`).toLowerCase()
      
      return guestName.includes(search) || 
             roomNumber.includes(search) || 
             reference.includes(search)
    })
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

const availableRooms = computed(() => {
  // Filtrer les chambres disponibles
  return rooms.value.filter(room => room.status === 'libre' || room.status === 'lp')
})

// Computed - Statistiques
const todayArrivals = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return locations.value.filter(location => {
    return location.checkIn?.startsWith(today) && (location.status === 'dt' || location.status === 'dj')
  }).length
})

const pendingLocations = computed(() => {
  return locations.value.filter(location => location.status === 'pj').length
})

const confirmedLocations = computed(() => {
  return locations.value.filter(location => location.status === 'dj').length
})

const totalLocations = computed(() => {
  return locations.value.length
})

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
    'pj': 'bg-yellow-100 text-yellow-800',
    'dj': 'bg-blue-100 text-blue-800',
    'dt': 'bg-green-100 text-green-800',
    'dp': 'bg-gray-100 text-gray-800',
    'archive': 'bg-red-100 text-red-800'
  }
  return colors[status] || colors['pj']
}

const getStatusLabel = (status) => {
  const labels = {
    'pj': 'En attente',
    'dj': 'Confirmée',
    'dt': 'Arrivée',
    'dp': 'Départ',
    'archive': 'Annulée'
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
    // Optionnel: afficher une notification d'erreur
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
  }
}

const loadRooms = async () => {
  try {
    const response = await roomsAPI.getRooms()
    rooms.value = response || []
  } catch (error) {
    console.error('Erreur lors du chargement des chambres:', error)
  }
}

const loadRoomTypes = async () => {
  try {
    const response = await roomTypesAPI.getRoomTypes()
    roomTypes.value = response || []
  } catch (error) {
    console.error('Erreur lors du chargement des types de chambres:', error)
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
    status: 'pj'
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
      recorded_by: 1 // TODO: récupérer l'ID de l'utilisateur connecté
    }
    
    if (isEditing.value) {
      await locationsAPI.updateLocation(form.value.id, locationData)
    } else {
      await locationsAPI.createLocation(locationData)
    }
    
    await loadLocations()
    closeModal()
    
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    // TODO: afficher une notification d'erreur
  } finally {
    isSaving.value = false
  }
}

const viewLocation = (location) => {
  console.log('Voir détails:', location)
  // TODO: implémenter la vue détaillée
}

const deleteLocation = async (location) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer la location ${location.reference || `LOC-${location.id}`} ?`)) {
    try {
      await locationsAPI.deleteLocation(location.id)
      await loadLocations()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }
}

const bulkAction = async (action) => {
  if (confirm(`Appliquer l'action "${getStatusLabel(action)}" aux ${selectedLocations.value.length} locations sélectionnées ?`)) {
    try {
      // Effectuer l'action en masse
      for (const locationId of selectedLocations.value) {
        await locationsAPI.patchLocation(locationId, { status: action })
      }
      
      selectedLocations.value = []
      await loadLocations()
    } catch (error) {
      console.error('Erreur lors de l\'action en masse:', error)
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