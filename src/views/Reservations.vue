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
        <button @click="openCreateModal" :class="[
          'inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200',
          themeClasses.btnPrimary
        ]">
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
            <p class="text-sm font-medium text-gray-600">Réservations totales</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalReservations }}</p>
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
            <option value="en attente">En attente</option>
            <option value="confirmée">Confirmée</option>
            <option value="annulée">Annulée</option>
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
            <option v-for="roomType in roomTypes" :key="roomType.id" :value="roomType.id">
              {{ roomType.name }}
            </option>
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
          <button @click="bulkAction('confirmée')" class="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium text-white bg-green-600 hover:bg-green-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200">
            Confirmer
          </button>
          <button @click="bulkAction('annulée')" class="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium text-white bg-red-600 hover:bg-red-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200">
            Annuler
          </button>
        </div>
      </div>
    </div>

    <!-- Loading spinner -->
    <div v-if="isLoading && !reservations.length" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    </div>

    <!-- Tableau des réservations avec DataTable -->
    <DataTable
      v-else
      title="Liste des réservations"
      :items="paginatedReservations"
      :columns="tableColumns"
      :selectable="true"
      :pagination="paginationConfig"
      item-key="id"
      empty-title="Aucune réservation trouvée"
      empty-message="Aucune réservation ne correspond aux critères de recherche."
      @update:current-page="currentPage = $event"
      @update:items-per-page="itemsPerPage = $event"
      @selection-change="selectedReservations = $event"
      @sort="handleSort"
    >
      <!-- Slot pour la colonne référence -->
      <template #column-reference="{ item }">
        <div>
          <div class="text-sm font-medium text-gray-900">{{ item.reference || `RES-${item.id}` }}</div>
          <div class="text-sm text-gray-500">{{ formatDate(item.created_at) }}</div>
        </div>
      </template>

      <!-- Slot pour la colonne client -->
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
            <div class="text-sm text-gray-500">{{ getGuestPhone(item.guest) }}</div>
          </div>
        </div>
      </template>

      <!-- Slot pour les dates -->
      <template #column-dates="{ item }">
        <div>
          <div class="text-sm text-gray-900">{{ formatDate(item.checkIn) }}</div>
          <div class="text-sm text-gray-500">{{ formatDate(item.checkOut) }}</div>
          <div class="text-xs text-gray-400">{{ calculateNights(item.checkIn, item.checkOut) }} nuit(s)</div>
        </div>
      </template>

      <!-- Slot pour la chambre -->
      <template #column-room="{ item }">
        <div class="text-sm font-medium text-gray-900">{{ getRoomInfo(item.room) }}</div>
      </template>

      <!-- Slot pour le statut -->
      <template #column-status="{ item }">
        <span :class="[
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          getStatusColor(item.status)
        ]">
          {{ getStatusLabel(item.status) }}
        </span>
      </template>

      <!-- Slot pour les actions -->
      <template #actions="{ item, themeClasses }">
        <div class="flex items-center space-x-2">
          <button @click="viewReservation(item)" :class="[themeClasses.textPrimary, 'hover:opacity-80']" title="Voir détails">
            <Eye class="w-4 h-4" />
          </button>
          <button @click="convertToLocation(item)" class="text-green-600 hover:text-green-900" title="Convertir en location">
            <ArrowRight class="w-4 h-4" />
          </button>
          <button @click="editReservation(item)" class="text-blue-600 hover:text-blue-900" title="Modifier">
            <Edit class="w-4 h-4" />
          </button>
          <button @click="deleteReservation(item)" class="text-red-600 hover:text-red-900" title="Supprimer">
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </template>

      <!-- Actions en lot -->
      <template #bulk-actions>
        <button @click="bulkAction('confirmée')" class="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium text-white bg-green-600 hover:bg-green-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200">
          Confirmer
        </button>
        <button @click="bulkAction('annulée')" class="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium text-white bg-red-600 hover:bg-red-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200">
          Annuler
        </button>
      </template>
    </DataTable>

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
            {{ isEditing ? 'Modifier la réservation' : 'Nouvelle réservation' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <form @submit.prevent="saveReservation" class="p-6 space-y-6">
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
                  {{ client.name }} {{ client.firstname }} - {{ client.phone }}
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Chambre souhaitée *</label>
              <select
                v-model="form.room"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Sélectionner une chambre</option>
                <option v-for="room in rooms" :key="room.id" :value="room.id">
                  Chambre {{ room.number }} - {{ getRoomTypeName(room.type) }}
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date d'arrivée souhaitée *</label>
              <input
                v-model="form.checkIn"
                type="datetime-local"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date de départ souhaitée *</label>
              <input
                v-model="form.checkOut"
                type="datetime-local"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Statut</label>
              <select
                v-model="form.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="en attente">En attente</option>
                <option value="confirmée">Confirmée</option>
                <option value="annulée">Annulée</option>
              </select>
            </div>
          </div>
          
          <div class="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button type="button" @click="closeModal" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200">
              Annuler
            </button>
            <button type="submit" :class="[
              'inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200',
              themeClasses.btnPrimary
            ]" :disabled="isSaving">
              <span v-if="isSaving">Enregistrement...</span>
              <span v-else>{{ isEditing ? 'Mettre à jour' : 'Créer la réservation' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import {
  Plus, Search, Download, Grid, List, User, Eye, Edit, Trash2, X,
  Calendar, Clock, CheckCircle, AlertCircle, XCircle, MapPin, ArrowRight
} from 'lucide-vue-next'
import { reservationsAPI, roomsAPI, roomTypesAPI, clientsAPI, locationsAPI } from '../services/api.js'
import { DataTable } from '@/components/ui'

// Stores
const authStore = useAuthStore()
const themeStore = useThemeStore()

// Computed
const themeClasses = computed(() => themeStore.themeClasses)

// État
const showModal = ref(false)
const isEditing = ref(false)
const isLoading = ref(false)
const isSaving = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(25)
const selectedReservations = ref([])

// Données
const reservations = ref([])
const clients = ref([])
const rooms = ref([])
const roomTypes = ref([])

// Filtres
const filters = ref({
  search: '',
  status: '',
  period: '',
  roomType: ''
})

// Formulaire
const form = ref({
  guest: '',
  room: '',
  checkIn: '',
  checkOut: '',
  status: 'en attente'
})

// Computed - Statistiques
const todayReservations = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return reservations.value.filter(r => r.checkIn?.startsWith(today)).length
})

const pendingReservations = computed(() => {
  return reservations.value.filter(r => r.status === 'en attente').length
})

const confirmedReservations = computed(() => {
  return reservations.value.filter(r => r.status === 'confirmée').length
})

const totalReservations = computed(() => {
  return reservations.value.length
})

// Computed - Filtrage et pagination
const filteredReservations = computed(() => {
  let filtered = reservations.value

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(reservation => {
      const guestName = getGuestName(reservation.guest).toLowerCase()
      const guestPhone = getGuestPhone(reservation.guest).toLowerCase()
      const reference = (reservation.reference || `RES-${reservation.id}`).toLowerCase()
      
      return guestName.includes(search) ||
             guestPhone.includes(search) ||
             reference.includes(search)
    })
  }

  if (filters.value.status) {
    filtered = filtered.filter(reservation => reservation.status === filters.value.status)
  }

  if (filters.value.roomType) {
    filtered = filtered.filter(reservation => {
      const room = rooms.value.find(r => r.id === reservation.room)
      return room?.type === parseInt(filters.value.roomType)
    })
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredReservations.value.length / itemsPerPage.value))

const paginatedReservations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredReservations.value.slice(start, end)
})

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
    key: 'dates',
    label: 'Dates séjour',
    sortable: true
  },
  {
    key: 'room',
    label: 'Chambre demandée',
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
  totalItems: filteredReservations.value.length,
  itemsPerPage: itemsPerPage.value
}))

// Méthodes utilitaires
const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('fr-FR')
}

const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const diffTime = Math.abs(end - start)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

const getStatusColor = (status) => {
  const colors = {
    'en attente': 'bg-yellow-100 text-yellow-800',
    'confirmée': 'bg-blue-100 text-blue-800',
    'annulée': 'bg-red-100 text-red-800'
  }
  return colors[status] || colors['en attente']
}

const getStatusLabel = (status) => {
  const labels = {
    'en attente': 'En attente',
    'confirmée': 'Confirmée',
    'annulée': 'Annulée'
  }
  return labels[status] || status
}

const getGuestName = (guestId) => {
  const client = clients.value.find(c => c.id === guestId)
  return client ? `${client.name} ${client.firstname}` : 'Client inconnu'
}

const getGuestPhone = (guestId) => {
  const client = clients.value.find(c => c.id === guestId)
  return client?.phone || 'N/A'
}

const getRoomInfo = (roomId) => {
  const room = rooms.value.find(r => r.id === roomId)
  if (!room) return 'Chambre non spécifiée'
  
  const roomType = roomTypes.value.find(rt => rt.id === room.type)
  return `Chambre ${room.number} - ${roomType?.name || 'Standard'}`
}

const getRoomTypeName = (typeId) => {
  const roomType = roomTypes.value.find(rt => rt.id === typeId)
  return roomType?.name || 'Standard'
}

// Méthodes de chargement des données
const loadReservations = async () => {
  try {
    isLoading.value = true
    const response = await reservationsAPI.getReservations()
    reservations.value = response || []
  } catch (error) {
    console.error('Erreur lors du chargement des réservations:', error)
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
    period: '',
    roomType: ''
  }
}

const openCreateModal = () => {
  isEditing.value = false
  form.value = {
    guest: '',
    room: '',
    checkIn: '',
    checkOut: '',
    status: 'en attente'
  }
  showModal.value = true
}

const editReservation = (reservation) => {
  isEditing.value = true
  form.value = {
    id: reservation.id,
    guest: reservation.guest,
    room: reservation.room,
    checkIn: reservation.checkIn,
    checkOut: reservation.checkOut,
    status: reservation.status
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
}

const saveReservation = async () => {
  try {
    isSaving.value = true
    
    const reservationData = {
      guest: form.value.guest,
      room: form.value.room,
      checkIn: form.value.checkIn,
      checkOut: form.value.checkOut,
      status: form.value.status,
      recorded_by: authStore.profile?.id // TODO: récupérer l'ID de l'utilisateur connecté
    }
    
    if (isEditing.value) {
      await reservationsAPI.updateReservation(form.value.id, reservationData)
    } else {
      await reservationsAPI.createReservation(reservationData)
    }
    
    await loadReservations()
    closeModal()
    
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    // TODO: afficher une notification d'erreur
  } finally {
    isSaving.value = false
  }
}

const viewReservation = (reservation) => {
  console.log('Voir détails de la réservation:', reservation)
  // TODO: implémenter la vue détaillée
}

const convertToLocation = async (reservation) => {
  if (confirm(`Convertir la réservation ${reservation.reference || `RES-${reservation.id}`} en location ?`)) {
    try {
      // Créer une location basée sur la réservation
      const locationData = {
        guest: reservation.guest,
        room: reservation.room,
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        status: 'pj', // En attente
        recorded_by: authStore.profile?.id, // TODO: récupérer l'ID de l'utilisateur connecté
        adults: reservation.adults,
        children: reservation.children,
        totalPrice: reservation.totalPrice,
        payment: reservation.payment
      }
      
      await locationsAPI.createLocation(locationData)
      
      // Optionnel: Supprimer ou marquer la réservation comme convertie
      await reservationsAPI.patchReservation(reservation.id, { status: 'confirmée' })
      
      await loadReservations()
      
      // TODO: afficher une notification de succès
      console.log('Réservation convertie en location avec succès')
      
    } catch (error) {
      console.error('Erreur lors de la conversion:', error)
      // TODO: afficher une notification d'erreur
    }
  }
}

const deleteReservation = async (reservation) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer la réservation ${reservation.reference || `RES-${reservation.id}`} ?`)) {
    try {
      await reservationsAPI.deleteReservation(reservation.id)
      await loadReservations()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }
}

const bulkAction = async (action) => {
  if (confirm(`Appliquer l'action "${getStatusLabel(action)}" aux ${selectedReservations.value.length} réservations sélectionnées ?`)) {
    try {
      // Effectuer l'action en masse
      for (const reservationId of selectedReservations.value) {
        await reservationsAPI.patchReservation(reservationId, { status: action })
      }
      
      selectedReservations.value = []
      await loadReservations()
    } catch (error) {
      console.error('Erreur lors de l\'action en masse:', error)
    }
  }
}

const exportData = () => {
  console.log('Export des données de réservations')
  // TODO: implémenter l'export
}

const handleSort = ({ column, order }) => {
  // Logique de tri pour le DataTable
  console.log('Tri par:', column, order)
  // TODO: implémenter le tri si nécessaire
}

// Surveillance des filtres de recherche
watch(() => filters.value.search, () => {
  currentPage.value = 1
})

// Chargement initial
onMounted(async () => {
  await Promise.all([
    loadReservations(),
    loadClients(),
    loadRooms(),
    loadRoomTypes()
  ])
})
</script> 