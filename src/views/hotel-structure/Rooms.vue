<template>
  <div class="space-y-6">
    <!-- Header avec actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Chambres</h1>
        <p class="text-gray-600 mt-1">Gestion complète des chambres de l'hôtel</p>
      </div>
      <div class="mt-4 sm:mt-0 flex items-center space-x-3">
        <button @click="exportData" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200">
          <Download class="w-4 h-4 mr-2" />
          Exporter
        </button>
        <button @click="openCreateModal" class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200">
          <Plus class="w-4 h-4 mr-2" />
          Nouvelle chambre
        </button>
      </div>
    </div>

    <!-- Statistiques rapides -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Home class="w-6 h-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total chambres</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalRooms }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircle class="w-6 h-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Libres propres</p>
            <p class="text-2xl font-bold text-gray-900">{{ freeCleanRooms }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <AlertCircle class="w-6 h-6 text-red-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Occupées</p>
            <p class="text-2xl font-bold text-gray-900">{{ occupiedRooms }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Clock class="w-6 h-6 text-yellow-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">En nettoyage</p>
            <p class="text-2xl font-bold text-gray-900">{{ cleaningRooms }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtres -->
    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Rechercher</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Numéro de chambre..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Étage</label>
          <select v-model="filters.floor" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm">
            <option value="">Tous les étages</option>
            <option v-for="floor in floors" :key="floor.id" :value="floor.id">{{ floor.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select v-model="filters.type" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm">
            <option value="">Tous les types</option>
            <option v-for="type in roomTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
          <select v-model="filters.status" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm">
            <option value="">Tous les statuts</option>
            <option value="ls">Libre propre</option>
            <option value="lp">Libre sale</option>
            <option value="os">Occupée sale</option>
            <option value="og">Occupée propre</option>
            <option value="op">Occupée payée</option>
            <option value="nettoyage">En nettoyage</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading spinner -->
    <div v-if="isLoading && !rooms.length" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    </div>

    <!-- Grille des chambres -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="room in filteredRooms"
        :key="room.id"
        class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
      >
        <!-- Header avec statut coloré -->
        <div :class="getRoomStatusClass(room.status)" class="px-4 py-3 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <Bed class="w-5 h-5" />
            <span class="font-semibold text-lg">{{ room.number }}</span>
          </div>
          <span class="text-sm font-medium">{{ getRoomStatusLabel(room.status) }}</span>
        </div>

        <!-- Contenu principal -->
        <div class="p-4">
          <!-- Informations de base -->
          <div class="space-y-2 mb-4">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">Type:</span>
              <span class="font-medium">{{ getRoomTypeName(room.type) }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">Étage:</span>
              <span class="font-medium">{{ getFloorName(room.floor) }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between pt-3 border-t border-gray-200">
            <div class="flex items-center space-x-2">
              <button 
                @click="changeRoomStatus(room)" 
                class="p-2 rounded-lg text-blue-600 hover:text-blue-900 hover:bg-blue-50 transition-colors duration-200"
                title="Changer le statut"
              >
                <RotateCcw class="w-4 h-4" />
              </button>
              <button @click="editRoom(room)" class="p-2 rounded-lg text-green-600 hover:text-green-900 hover:bg-green-50 transition-colors duration-200">
                <Edit class="w-4 h-4" />
              </button>
            </div>
            <button @click="deleteRoom(room)" class="p-2 rounded-lg text-red-600 hover:text-red-900 hover:bg-red-50 transition-colors duration-200">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Footer avec dates -->
        <div class="px-4 py-2 bg-gray-50 text-xs text-gray-500">
          Créée le {{ formatDate(room.created_at) }}
        </div>
      </div>

      <!-- Carte pour ajouter une nouvelle chambre -->
      <div
        @click="openCreateModal"
        class="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-dashed border-purple-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:from-purple-100 hover:to-purple-200 cursor-pointer transition-all duration-200 min-h-[240px]"
      >
        <div class="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center mb-3">
          <Plus class="w-6 h-6 text-purple-600" />
        </div>
        <h3 class="text-sm font-semibold text-purple-700 mb-1">Nouvelle chambre</h3>
        <p class="text-xs text-purple-600">Ajouter une chambre à l'hôtel</p>
      </div>
    </div>

    <!-- Modal de création/édition -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click="closeModal"
    >
      <div
        class="bg-white rounded-lg max-w-md w-full mx-4"
        @click.stop
      >
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">
            {{ isEditing ? 'Modifier la chambre' : 'Nouvelle chambre' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <form @submit.prevent="saveRoom" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Numéro de chambre *</label>
            <input
              v-model="form.number"
              type="text"
              required
              maxlength="5"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ex: 101, 205..."
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Étage *</label>
            <select
              v-model="form.floor"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Choisir un étage</option>
              <option v-for="floor in floors" :key="floor.id" :value="floor.id">{{ floor.name }}</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Type de chambre *</label>
            <select
              v-model="form.type"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Choisir un type</option>
              <option v-for="type in roomTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Statut initial</label>
            <select
              v-model="form.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="ls">Libre propre</option>
              <option value="lp">Libre sale</option>
              <option value="nettoyage">En nettoyage</option>
            </select>
          </div>
          
          <div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button type="button" @click="closeModal" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200">
              Annuler
            </button>
            <button type="submit" class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200" :disabled="isSaving">
              <span v-if="isSaving">Enregistrement...</span>
              <span v-else>{{ isEditing ? 'Mettre à jour' : 'Créer la chambre' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de changement de statut -->
    <div
      v-if="showStatusModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click="closeStatusModal"
    >
      <div
        class="bg-white rounded-lg max-w-sm w-full mx-4"
        @click.stop
      >
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Changer le statut</h3>
          <button @click="closeStatusModal" class="text-gray-400 hover:text-gray-600">
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <div class="p-6 space-y-4">
          <p class="text-sm text-gray-600">Chambre <strong>{{ selectedRoom?.number }}</strong></p>
          
          <div class="space-y-2">
            <button
              v-for="status in roomStatuses"
              :key="status.value"
              @click="updateRoomStatus(status.value)"
              :class="status.class"
              class="w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
            >
              {{ status.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Plus, Download, Home, CheckCircle, AlertCircle, Clock,
  Edit, Trash2, X, Bed, RotateCcw
} from 'lucide-vue-next'
import { roomsAPI, floorsAPI, roomTypesAPI } from '../../services/api.js'

// État
const showModal = ref(false)
const showStatusModal = ref(false)
const isEditing = ref(false)
const isLoading = ref(false)
const isSaving = ref(false)
const selectedRoom = ref(null)

// Données
const rooms = ref([])
const floors = ref([])
const roomTypes = ref([])

// Filtres
const filters = ref({
  search: '',
  floor: '',
  type: '',
  status: ''
})

// Formulaire
const form = ref({
  number: '',
  floor: '',
  type: '',
  status: 'ls'
})

// Statuts disponibles pour les chambres
const roomStatuses = [
  { value: 'ls', label: 'Libre propre', class: 'bg-green-100 text-green-800 border-2 border-green-200' },
  { value: 'lp', label: 'Libre sale', class: 'bg-yellow-100 text-yellow-800 border-2 border-yellow-200' },
  { value: 'os', label: 'Occupée sale', class: 'bg-red-100 text-red-800 border-2 border-red-200' },
  { value: 'og', label: 'Occupée propre', class: 'bg-blue-100 text-blue-800 border-2 border-blue-200' },
  { value: 'op', label: 'Occupée payée', class: 'bg-purple-100 text-purple-800 border-2 border-purple-200' },
  { value: 'nettoyage', label: 'En nettoyage', class: 'bg-orange-100 text-orange-800 border-2 border-orange-200' }
]

// Computed - Statistiques
const totalRooms = computed(() => rooms.value.length)
const freeCleanRooms = computed(() => rooms.value.filter(room => room.status === 'ls').length)
const occupiedRooms = computed(() => rooms.value.filter(room => ['os', 'og', 'op'].includes(room.status)).length)
const cleaningRooms = computed(() => rooms.value.filter(room => room.status === 'nettoyage').length)

// Computed - Filtres
const filteredRooms = computed(() => {
  let filtered = rooms.value

  if (filters.value.search) {
    filtered = filtered.filter(room => 
      room.number.toLowerCase().includes(filters.value.search.toLowerCase())
    )
  }

  if (filters.value.floor) {
    filtered = filtered.filter(room => room.floor === parseInt(filters.value.floor))
  }

  if (filters.value.type) {
    filtered = filtered.filter(room => room.type === parseInt(filters.value.type))
  }

  if (filters.value.status) {
    filtered = filtered.filter(room => room.status === filters.value.status)
  }

  return filtered
})

// Méthodes utilitaires
const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('fr-FR')
}

const getRoomStatusClass = (status) => {
  const classes = {
    'ls': 'bg-green-500 text-white',
    'lp': 'bg-yellow-500 text-white',
    'os': 'bg-red-500 text-white',
    'og': 'bg-blue-500 text-white',
    'op': 'bg-purple-500 text-white',
    'nettoyage': 'bg-orange-500 text-white'
  }
  return classes[status] || 'bg-gray-500 text-white'
}

const getRoomStatusLabel = (status) => {
  const labels = {
    'ls': 'Libre propre',
    'lp': 'Libre sale',
    'os': 'Occupée sale',
    'og': 'Occupée propre',
    'op': 'Occupée payée',
    'nettoyage': 'En nettoyage'
  }
  return labels[status] || status
}

const getRoomTypeName = (typeId) => {
  const type = roomTypes.value.find(t => t.id === typeId)
  return type?.name || 'Type inconnu'
}

const getFloorName = (floorId) => {
  const floor = floors.value.find(f => f.id === floorId)
  return floor?.name || 'Étage inconnu'
}

// Méthodes de chargement des données
const loadRooms = async () => {
  try {
    isLoading.value = true
    const response = await roomsAPI.getRooms()
    rooms.value = response || []
  } catch (error) {
    console.error('Erreur lors du chargement des chambres:', error)
  } finally {
    isLoading.value = false
  }
}

const loadFloors = async () => {
  try {
    const response = await floorsAPI.getFloors()
    floors.value = response || []
  } catch (error) {
    console.error('Erreur lors du chargement des étages:', error)
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
const openCreateModal = () => {
  isEditing.value = false
  form.value = {
    number: '',
    floor: '',
    type: '',
    status: 'ls'
  }
  showModal.value = true
}

const editRoom = (room) => {
  isEditing.value = true
  form.value = {
    id: room.id,
    number: room.number || '',
    floor: room.floor || '',
    type: room.type || '',
    status: room.status || 'ls'
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
}

const saveRoom = async () => {
  try {
    isSaving.value = true
    
    const roomData = { ...form.value }
    delete roomData.id
    
    if (isEditing.value) {
      await roomsAPI.updateRoom(form.value.id, roomData)
    } else {
      await roomsAPI.createRoom(roomData)
    }
    
    await loadRooms()
    closeModal()
    
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  } finally {
    isSaving.value = false
  }
}

const deleteRoom = async (room) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer la chambre "${room.number}" ?`)) {
    try {
      await roomsAPI.deleteRoom(room.id)
      await loadRooms()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }
}

const changeRoomStatus = (room) => {
  selectedRoom.value = room
  showStatusModal.value = true
}

const closeStatusModal = () => {
  showStatusModal.value = false
  selectedRoom.value = null
}

const updateRoomStatus = async (newStatus) => {
  try {
    await roomsAPI.patchRoom(selectedRoom.value.id, { status: newStatus })
    await loadRooms()
    closeStatusModal()
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error)
  }
}

const exportData = () => {
  console.log('Export des chambres')
  // TODO: implémenter l'export
}

// Chargement initial
onMounted(async () => {
  await Promise.all([
    loadRooms(),
    loadFloors(),
    loadRoomTypes()
  ])
})
</script> 