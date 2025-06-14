<template>
  <div class="space-y-6">
    <!-- Header avec actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Types de Chambres</h1>
        <p class="text-gray-600 mt-1">Configuration des différents types de chambres et tarifs</p>
      </div>
      <div class="mt-4 sm:mt-0 flex items-center space-x-3">
        <button @click="exportData" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200">
          <Download class="w-4 h-4 mr-2" />
          Exporter
        </button>
        <button @click="openCreateModal" class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200">
          <Plus class="w-4 h-4 mr-2" />
          Nouveau type
        </button>
      </div>
    </div>

    <!-- Statistiques rapides -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Bed class="w-6 h-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Types disponibles</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalTypes }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <DollarSign class="w-6 h-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Prix moyen</p>
            <p class="text-2xl font-bold text-gray-900">{{ averagePrice }} FCFA</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Users :class="['w-6 h-6', themeClasses.textPrimary]" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Capacité max</p>
            <p class="text-2xl font-bold text-gray-900">{{ maxCapacity }} pers.</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <TrendingUp class="w-6 h-6 text-orange-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Plus cher</p>
            <p class="text-2xl font-bold text-gray-900">{{ maxPrice }} FCFA</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading spinner -->
    <div v-if="isLoading && !roomTypes.length" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    </div>

    <!-- Grille des types de chambres -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="roomType in roomTypes"
        :key="roomType.id"
        class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
      >
        <!-- En-tête avec icône -->
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BedDouble :class="['w-6 h-6', themeClasses.textPrimary]" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ roomType.name }}</h3>
                <p class="text-sm text-gray-500">Type de chambre</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button @click="editRoomType(roomType)" class="text-blue-600 hover:text-blue-900">
                <Edit class="w-4 h-4" />
              </button>
              <button @click="deleteRoomType(roomType)" class="text-red-600 hover:text-red-900">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Contenu principal -->
        <div class="p-6">
          <!-- Description -->
          <div class="mb-4">
            <p class="text-sm text-gray-600 line-clamp-2">{{ roomType.description }}</p>
          </div>

          <!-- Capacités -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="flex items-center space-x-2">
              <User class="w-4 h-4 text-gray-500" />
              <span class="text-sm text-gray-600">{{ roomType.numberAdult || 0 }} adultes</span>
            </div>
            <div class="flex items-center space-x-2">
              <Baby class="w-4 h-4 text-gray-500" />
              <span class="text-sm text-gray-600">{{ roomType.numberChildren || 0 }} enfants</span>
            </div>
          </div>

          <!-- Prix -->
          <div class="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 text-center">
            <p :class="['text-xs font-medium mb-1', themeClasses.textPrimary]">PRIX PAR NUIT</p>
            <p class="text-2xl font-bold text-purple-700">{{ formatCurrency(roomType.price) }}</p>
          </div>
        </div>

        <!-- Footer avec dates -->
        <div class="px-6 py-3 bg-gray-50 rounded-b-lg">
          <div class="flex items-center justify-between text-xs text-gray-500">
            <span>Créé le {{ formatDate(roomType.created_at) }}</span>
            <span>Modifié le {{ formatDate(roomType.updated_at) }}</span>
          </div>
        </div>
      </div>

      <!-- Carte pour ajouter un nouveau type -->
      <div
        @click="openCreateModal"
        class="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-dashed border-purple-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:from-purple-100 hover:to-purple-200 cursor-pointer transition-all duration-200 h-full min-h-[280px]"
      >
        <div class="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mb-4">
          <Plus :class="['w-8 h-8', themeClasses.textPrimary]" />
        </div>
        <h3 :class="['text-lg font-semibold mb-2', themeClasses.textPrimary]">Ajouter un type</h3>
        <p :class="['text-sm', themeClasses.textPrimary]">Créer un nouveau type de chambre avec ses caractéristiques</p>
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
            {{ isEditing ? 'Modifier le type de chambre' : 'Nouveau type de chambre' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <form @submit.prevent="saveRoomType" class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Nom du type *</label>
              <input
                v-model="form.name"
                type="text"
                required
                maxlength="100"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ex: Suite Présidentielle, Chambre Standard..."
              />
            </div>
            
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                v-model="form.description"
                required
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Décrivez les caractéristiques et équipements de ce type de chambre..."
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nombre d'adultes</label>
              <input
                v-model.number="form.numberAdult"
                type="number"
                min="1"
                max="10"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="2"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nombre d'enfants</label>
              <input
                v-model.number="form.numberChildren"
                type="number"
                min="0"
                max="5"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Prix par nuit (FCFA) *</label>
              <input
                v-model.number="form.price"
                type="number"
                required
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="50000"
              />
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
              <span v-else>{{ isEditing ? 'Mettre à jour' : 'Créer le type' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import {
  Plus, Download, Bed, BedDouble, DollarSign, Users, TrendingUp,
  Edit, Trash2, X, User, Baby
} from 'lucide-vue-next'
import { roomTypesAPI } from '../../services/api.js'

// Store
const themeStore = useThemeStore()

// État
const showModal = ref(false)
const isEditing = ref(false)
const isLoading = ref(false)
const isSaving = ref(false)

// Données
const roomTypes = ref([])

// Formulaire
const form = ref({
  name: '',
  description: '',
  numberAdult: 2,
  numberChildren: 0,
  price: 0
})

// Computed - Statistiques
const totalTypes = computed(() => roomTypes.value.length)

const averagePrice = computed(() => {
  if (roomTypes.value.length === 0) return 0
  const total = roomTypes.value.reduce((sum, type) => sum + (type.price || 0), 0)
  return Math.round(total / roomTypes.value.length)
})

const maxCapacity = computed(() => {
  if (roomTypes.value.length === 0) return 0
  return Math.max(...roomTypes.value.map(type => (type.numberAdult || 0) + (type.numberChildren || 0)))
})

const maxPrice = computed(() => {
  if (roomTypes.value.length === 0) return 0
  return Math.max(...roomTypes.value.map(type => type.price || 0))
})

// Computed
const themeClasses = computed(() => themeStore.themeClasses)

// Méthodes utilitaires
const formatCurrency = (amount) => {
  if (!amount) return '0 FCFA'
  return new Intl.NumberFormat('fr-CI', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('fr-FR')
}

// Méthodes de chargement des données
const loadRoomTypes = async () => {
  try {
    isLoading.value = true
    const response = await roomTypesAPI.getRoomTypes()
    roomTypes.value = response || []
  } catch (error) {
    console.error('Erreur lors du chargement des types de chambres:', error)
  } finally {
    isLoading.value = false
  }
}

// Méthodes d'actions
const openCreateModal = () => {
  isEditing.value = false
  form.value = {
    name: '',
    description: '',
    numberAdult: 2,
    numberChildren: 0,
    price: 0
  }
  showModal.value = true
}

const editRoomType = (roomType) => {
  isEditing.value = true
  form.value = {
    id: roomType.id,
    name: roomType.name || '',
    description: roomType.description || '',
    numberAdult: roomType.numberAdult || 2,
    numberChildren: roomType.numberChildren || 0,
    price: roomType.price || 0
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
}

const saveRoomType = async () => {
  try {
    isSaving.value = true
    
    const roomTypeData = { ...form.value }
    delete roomTypeData.id
    
    if (isEditing.value) {
      await roomTypesAPI.updateRoomType(form.value.id, roomTypeData)
    } else {
      await roomTypesAPI.createRoomType(roomTypeData)
    }
    
    await loadRoomTypes()
    closeModal()
    
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  } finally {
    isSaving.value = false
  }
}

const deleteRoomType = async (roomType) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le type "${roomType.name}" ?`)) {
    try {
      await roomTypesAPI.deleteRoomType(roomType.id)
      await loadRoomTypes()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }
}

const exportData = () => {
  console.log('Export des types de chambres')
  // TODO: implémenter l'export
}

// Chargement initial
onMounted(async () => {
  await loadRoomTypes()
})
</script> 