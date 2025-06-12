<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Chambres Occupées</h1>
        <p class="text-gray-600 mt-1">État en temps réel des chambres et délais de libération</p>
      </div>
      <div class="mt-4 sm:mt-0 flex items-center space-x-3">
        <div class="text-sm text-gray-500">
          Dernière mise à jour : {{ formatTime(currentTime) }}
        </div>
        <button @click="refreshData" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200">
          <RefreshCw class="w-4 h-4 mr-2" :class="{ 'animate-spin': isLoading }" />
          Actualiser
        </button>
      </div>
    </div>

    <!-- Statistiques globales -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <Bed class="w-6 h-6 text-red-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Chambres occupées</p>
            <p class="text-2xl font-bold text-red-600">{{ occupiedRooms.length }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <BedDouble class="w-6 h-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Chambres libres</p>
            <p class="text-2xl font-bold text-green-600">{{ freeRooms.length }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Clock class="w-6 h-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Départs aujourd'hui</p>
            <p class="text-2xl font-bold text-blue-600">{{ departuresToday }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Percent class="w-6 h-6 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Taux d'occupation</p>
            <p class="text-2xl font-bold text-purple-600">{{ occupancyRate }}%</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading spinner -->
    <div v-if="isLoading && !rooms.length" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    </div>

    <!-- Chambres occupées -->
    <div v-if="!isLoading" class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">
            Chambres Occupées ({{ occupiedRooms.length }})
          </h3>
          <div class="flex items-center space-x-2">
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <Dot class="w-3 h-3 mr-1" />
              En cours
            </span>
          </div>
        </div>
      </div>

      <div v-if="occupiedRooms.length === 0" class="p-12 text-center">
        <BedDouble class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-4 text-sm font-medium text-gray-900">Aucune chambre occupée</h3>
        <p class="mt-2 text-sm text-gray-500">Toutes les chambres sont actuellement libres.</p>
      </div>

      <div v-else class="p-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div
            v-for="room in occupiedRooms"
            :key="room.id"
            class="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-6 hover:shadow-md transition-all duration-200"
          >
            <!-- En-tête de la chambre -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-red-500 text-white rounded-lg flex items-center justify-center">
                  <Bed class="w-6 h-6" />
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-gray-900">Chambre {{ room.number }}</h4>
                  <p class="text-sm text-gray-600">{{ getRoomTypeName(room.type) }}</p>
                </div>
              </div>
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Occupée
              </span>
            </div>

            <!-- Informations client -->
            <div class="mb-4 p-3 bg-white rounded-lg border">
              <div class="flex items-center space-x-3 mb-2">
                <User class="w-4 h-4 text-gray-500" />
                <span class="text-sm font-medium text-gray-900">{{ getGuestName(room.currentLocation.guest) }}</span>
              </div>
              <div class="flex items-center space-x-3 mb-2">
                <Calendar class="w-4 h-4 text-gray-500" />
                <span class="text-sm text-gray-600">
                  Du {{ formatDateTime(room.currentLocation.checkIn_date || room.currentLocation.checkIn) }}
                </span>
              </div>
              <div class="flex items-center space-x-3">
                <LogOut class="w-4 h-4 text-gray-500" />
                <span class="text-sm text-gray-600">
                  Au {{ formatDateTime(room.currentLocation.checkOut_date || room.currentLocation.checkOut) }}
                </span>
              </div>
            </div>

            <!-- Compte à rebours -->
            <div class="text-center p-4 bg-white rounded-lg border">
              <p class="text-xs text-gray-500 mb-2">Temps restant avant libération</p>
              <div class="text-2xl font-bold text-red-600 font-mono">
                {{ getTimeRemaining(room.currentLocation.checkOut_date || room.currentLocation.checkOut) }}
              </div>
              <div class="mt-2">
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-red-500 h-2 rounded-full transition-all duration-1000"
                    :style="{ width: getProgressPercentage(room.currentLocation.checkIn_date || room.currentLocation.checkIn, room.currentLocation.checkOut_date || room.currentLocation.checkOut) + '%' }"
                  ></div>
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-2">
                {{ getTimeElapsed(room.currentLocation.checkIn_date || room.currentLocation.checkIn) }} écoulé
              </p>
            </div>

            <!-- Actions -->
            <div class="mt-4 flex space-x-2">
              <button 
                @click="viewLocationDetails(room.currentLocation)"
                class="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Détails
              </button>
              <button 
                @click="extendStay(room.currentLocation)"
                class="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Prolonger
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chambres libres -->
    <div v-if="!isLoading" class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">
            Chambres Libres ({{ freeRooms.length }})
          </h3>
          <div class="flex items-center space-x-2">
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <Dot class="w-3 h-3 mr-1" />
              Disponible
            </span>
          </div>
        </div>
      </div>

      <div v-if="freeRooms.length === 0" class="p-12 text-center">
        <Bed class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-4 text-sm font-medium text-gray-900">Aucune chambre libre</h3>
        <p class="mt-2 text-sm text-gray-500">Toutes les chambres sont actuellement occupées.</p>
      </div>

      <div v-else class="p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div
            v-for="room in freeRooms"
            :key="room.id"
            class="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-green-500 text-white rounded-lg flex items-center justify-center">
                  <Bed class="w-4 h-4" />
                </div>
                <div>
                  <h4 class="text-sm font-semibold text-gray-900">Ch. {{ room.number }}</h4>
                  <p class="text-xs text-gray-600">{{ getRoomTypeName(room.type) }}</p>
                </div>
              </div>
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Libre
              </span>
            </div>

            <div class="text-center">
              <div class="text-sm text-green-600 font-medium mb-2">
                <CheckCircle class="w-4 h-4 inline mr-1" />
                Disponible immédiatement
              </div>
              <!-- <button 
                @click="bookRoom(room)"
                class="w-full px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Réserver
              </button> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  Bed, BedDouble, Clock, User, Calendar, LogOut, RefreshCw, Percent,
  Dot, CheckCircle
} from 'lucide-vue-next'
import { locationsAPI, roomsAPI, roomTypesAPI, clientsAPI } from '../services/api.js'

// État
const isLoading = ref(false)
const currentTime = ref(new Date())
let timeInterval = null

// Données
const rooms = ref([])
const locations = ref([])
const roomTypes = ref([])
const clients = ref([])

// Computed - Logique des chambres occupées/libres
const occupiedRooms = computed(() => {
  return rooms.value.filter(room => {
    const currentLocation = getCurrentLocationForRoom(room.id)
    if (!currentLocation) return false
    
    // CORRECTION: supporter les deux formats de champs de dates
    const checkInField = currentLocation.checkIn_date || currentLocation.checkIn
    const checkOutField = currentLocation.checkOut_date || currentLocation.checkOut
    
    if (!checkInField || !checkOutField) return false
    
    try {
      const now = new Date()
      const checkIn = new Date(checkInField)
      const checkOut = new Date(checkOutField)
      
      // Vérifier que les dates sont valides
      if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) return false
      
      // La chambre est occupée si on est entre checkIn et checkOut et le statut est valide
      const isInPeriod = now >= checkIn && now < checkOut
      const validStatus = ['pj', 'dj', 'dt', 'dp'].includes(currentLocation.status) // Tous les statuts actifs sauf archive
      
      if (isInPeriod && validStatus) {
        room.currentLocation = currentLocation
        return true
      }
    } catch (error) {
      console.warn('⚠️ Erreur lors du traitement des dates pour la chambre:', room.id, error)
    }
    
    return false
  })
})

const freeRooms = computed(() => {
  return rooms.value.filter(room => {
    return !occupiedRooms.value.find(occupied => occupied.id === room.id)
  })
})

// Computed - Statistiques
const departuresToday = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return occupiedRooms.value.filter(room => {
    const checkOutField = room.currentLocation.checkOut_date || room.currentLocation.checkOut
    return checkOutField && checkOutField.startsWith(today)
  }).length
})

const occupancyRate = computed(() => {
  if (rooms.value.length === 0) return 0
  return Math.round((occupiedRooms.value.length / rooms.value.length) * 100)
})

// Méthodes utilitaires
const getCurrentLocationForRoom = (roomId) => {
  return locations.value.find(location => {
    if (location.room !== roomId) return false
    
    // CORRECTION: supporter les deux formats de champs de dates
    const checkInField = location.checkIn_date || location.checkIn
    const checkOutField = location.checkOut_date || location.checkOut
    
    if (!checkInField || !checkOutField) return false
    
    try {
      const now = new Date()
      const checkIn = new Date(checkInField)
      const checkOut = new Date(checkOutField)
      
      // Vérifier que les dates sont valides
      if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) return false
      
      // Vérifier si la location est active
      const isActive = now >= checkIn && now < checkOut
      const validStatus = ['pj', 'dj', 'dt', 'dp'].includes(location.status) // Tous les statuts actifs
      
      return isActive && validStatus
    } catch (error) {
      console.warn('⚠️ Erreur lors du traitement des dates pour la location:', location.id, error)
      return false
    }
  })
}

const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString('fr-FR')
}

const formatTime = (date) => {
  return date.toLocaleTimeString('fr-FR')
}

const getTimeRemaining = (checkOutString) => {
  if (!checkOutString) return '00:00:00'
  
  const checkOut = new Date(checkOutString)
  const now = currentTime.value
  
  // Vérifier que la date est valide
  if (isNaN(checkOut.getTime())) return 'Date invalide'
  
  const diff = checkOut - now
  
  if (diff <= 0) return 'Expiré'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  
  if (days > 0) {
    return `${days}j ${hours}h ${minutes}m`
  } else {
    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`
  }
}

const getTimeElapsed = (checkInString) => {
  if (!checkInString) return '0 min'
  
  const checkIn = new Date(checkInString)
  const now = currentTime.value
  
  // Vérifier que la date est valide
  if (isNaN(checkIn.getTime())) return 'Date invalide'
  
  const diff = now - checkIn
  
  if (diff <= 0) return '0 min'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (days > 0) {
    return `${days}j ${hours}h`
  } else if (hours > 0) {
    return `${hours}h`
  } else {
    const minutes = Math.floor(diff / (1000 * 60))
    return `${minutes} min`
  }
}

const getProgressPercentage = (checkInString, checkOutString) => {
  if (!checkInString || !checkOutString) return 0
  
  const checkIn = new Date(checkInString)
  const checkOut = new Date(checkOutString)
  const now = currentTime.value
  
  // Vérifier que les dates sont valides
  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) return 0
  
  if (now <= checkIn) return 0
  if (now >= checkOut) return 100
  
  const total = checkOut - checkIn
  const elapsed = now - checkIn
  
  return Math.round((elapsed / total) * 100)
}

const getGuestName = (guestId) => {
  const client = clients.value.find(c => c.id === guestId)
  return client ? `${client.name} ${client.firstname}` : 'Client inconnu'
}

const getRoomTypeName = (typeId) => {
  const roomType = roomTypes.value.find(rt => rt.id === typeId)
  return roomType?.name || 'Standard'
}

// Méthodes de chargement des données
const loadRooms = async () => {
  try {
    const response = await roomsAPI.getRooms()
    rooms.value = response || []
  } catch (error) {
    console.error('Erreur lors du chargement des chambres:', error)
  }
}

const loadLocations = async () => {
  try {
    const response = await locationsAPI.getLocations()
    locations.value = response || []
  } catch (error) {
    console.error('Erreur lors du chargement des locations:', error)
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

const loadClients = async () => {
  try {
    const response = await clientsAPI.getClients()
    clients.value = response || []
  } catch (error) {
    console.error('Erreur lors du chargement des clients:', error)
  }
}

const refreshData = async () => {
  isLoading.value = true
  try {
    await Promise.all([
      loadRooms(),
      loadLocations(),
      loadRoomTypes(),
      loadClients()
    ])
  } finally {
    isLoading.value = false
  }
}

// Actions
const viewLocationDetails = (location) => {
  console.log('Voir détails de la location:', location)
  // TODO: implémenter
}

const extendStay = (location) => {
  console.log('Prolonger le séjour:', location)
  // TODO: implémenter
}

const bookRoom = (room) => {
  console.log('Réserver la chambre:', room)
  // TODO: implémenter - rediriger vers création de location
}

// Lifecycle
onMounted(async () => {
  await refreshData()
  
  // Mettre à jour l'heure chaque seconde
  timeInterval = setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script> 