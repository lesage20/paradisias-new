<template>
  <div class="space-y-6">
    <!-- Header avec actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Étages</h1>
        <p class="text-gray-600 mt-1">Gestion de la structure verticale de l'hôtel</p>
      </div>
      <div class="mt-4 sm:mt-0 flex items-center space-x-3">
        <button @click="exportData" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200">
          <Download class="w-4 h-4 mr-2" />
          Exporter
        </button>
        <button @click="openCreateModal" class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200">
          <Plus class="w-4 h-4 mr-2" />
          Nouvel étage
        </button>
      </div>
    </div>

    <!-- Statistiques rapides -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Building class="w-6 h-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total étages</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalFloors }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircle class="w-6 h-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Étages actifs</p>
            <p class="text-2xl font-bold text-gray-900">{{ activeFloors }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Layers class="w-6 h-6 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Plus haut</p>
            <p class="text-2xl font-bold text-gray-900">{{ highestFloor }}e étage</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <AlertCircle class="w-6 h-6 text-orange-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Inactifs</p>
            <p class="text-2xl font-bold text-gray-900">{{ inactiveFloors }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading spinner -->
    <div v-if="isLoading && !floors.length" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    </div>

    <!-- Liste des étages -->
    <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">Structure des Étages</h2>
        <p class="text-sm text-gray-600 mt-1">Liste hiérarchique des étages de l'hôtel</p>
      </div>
      
      <div class="divide-y divide-gray-200">
        <div
          v-for="floor in sortedFloors"
          :key="floor.id"
          class="p-6 hover:bg-gray-50 transition-colors duration-200"
        >
          <div class="flex items-center justify-between">
            <!-- Informations principales -->
            <div class="flex items-center space-x-4">
              <!-- Numéro d'étage avec style moderne -->
              <div class="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                <span class="text-2xl font-bold text-purple-700">{{ floor.number }}</span>
              </div>
              
              <div class="flex-1">
                <div class="flex items-center space-x-3">
                  <h3 class="text-lg font-semibold text-gray-900">{{ floor.name }}</h3>
                  <span :class="getStatusBadgeClass(floor.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    <div class="w-1.5 h-1.5 rounded-full mr-1.5" :class="getStatusDotClass(floor.status)"></div>
                    {{ getStatusLabel(floor.status) }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 mt-1">{{ floor.description }}</p>
                <div class="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span>Créé le {{ formatDate(floor.created_at) }}</span>
                  <span>•</span>
                  <span>Modifié le {{ formatDate(floor.updated_at) }}</span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center space-x-2">
              <button 
                @click="toggleFloorStatus(floor)" 
                :class="floor.status === 'actif' ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'"
                class="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                :title="floor.status === 'actif' ? 'Désactiver l\'étage' : 'Activer l\'étage'"
              >
                <Power class="w-4 h-4" />
              </button>
              <button @click="editFloor(floor)" class="p-2 rounded-lg text-blue-600 hover:text-blue-900 hover:bg-blue-50 transition-colors duration-200">
                <Edit class="w-4 h-4" />
              </button>
              <button @click="deleteFloor(floor)" class="p-2 rounded-lg text-red-600 hover:text-red-900 hover:bg-red-50 transition-colors duration-200">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Message si aucun étage -->
        <div v-if="!floors.length" class="p-12 text-center">
          <Building class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun étage configuré</h3>
          <p class="text-gray-600 mb-4">Commencez par créer le premier étage de votre hôtel.</p>
          <button @click="openCreateModal" class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
            <Plus class="w-4 h-4 mr-2" />
            Créer un étage
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
        class="bg-white rounded-lg max-w-md w-full mx-4"
        @click.stop
      >
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">
            {{ isEditing ? 'Modifier l\'étage' : 'Nouvel étage' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <form @submit.prevent="saveFloor" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nom de l'étage *</label>
            <input
              v-model="form.name"
              type="text"
              required
              maxlength="100"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ex: Rez-de-chaussée, Premier étage..."
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Numéro d'étage *</label>
            <input
              v-model.number="form.number"
              type="number"
              required
              min="0"
              max="50"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ex: 0, 1, 2..."
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              v-model="form.description"
              required
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Décrivez cet étage, ses spécificités..."
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Statut *</label>
            <select
              v-model="form.status"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
            </select>
          </div>
          
          <div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button type="button" @click="closeModal" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200">
              Annuler
            </button>
            <button type="submit" class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200" :disabled="isSaving">
              <span v-if="isSaving">Enregistrement...</span>
              <span v-else>{{ isEditing ? 'Mettre à jour' : 'Créer l\'étage' }}</span>
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
  Plus, Download, Building, CheckCircle, Layers, AlertCircle, 
  Edit, Trash2, X, Power
} from 'lucide-vue-next'
import { floorsAPI } from '../../services/api.js'

// État
const showModal = ref(false)
const isEditing = ref(false)
const isLoading = ref(false)
const isSaving = ref(false)

// Données
const floors = ref([])

// Formulaire
const form = ref({
  name: '',
  description: '',
  number: 0,
  status: 'actif'
})

// Computed - Statistiques
const totalFloors = computed(() => floors.value.length)
const activeFloors = computed(() => floors.value.filter(floor => floor.status === 'actif').length)
const inactiveFloors = computed(() => floors.value.filter(floor => floor.status === 'inactif').length)
const highestFloor = computed(() => {
  if (floors.value.length === 0) return 0
  return Math.max(...floors.value.map(floor => floor.number))
})

// Computed - Tri des étages
const sortedFloors = computed(() => {
  return [...floors.value].sort((a, b) => b.number - a.number) // Du plus haut au plus bas
})

// Méthodes utilitaires
const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('fr-FR')
}

const getStatusLabel = (status) => {
  const labels = {
    'actif': 'Actif',
    'inactif': 'Inactif'
  }
  return labels[status] || status
}

const getStatusBadgeClass = (status) => {
  const classes = {
    'actif': 'bg-green-100 text-green-800',
    'inactif': 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusDotClass = (status) => {
  const classes = {
    'actif': 'bg-green-400',
    'inactif': 'bg-gray-400'
  }
  return classes[status] || 'bg-gray-400'
}

// Méthodes de chargement des données
const loadFloors = async () => {
  try {
    isLoading.value = true
    const response = await floorsAPI.getFloors()
    floors.value = response || []
  } catch (error) {
    console.error('Erreur lors du chargement des étages:', error)
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
    number: highestFloor.value + 1,
    status: 'actif'
  }
  showModal.value = true
}

const editFloor = (floor) => {
  isEditing.value = true
  form.value = {
    id: floor.id,
    name: floor.name || '',
    description: floor.description || '',
    number: floor.number || 0,
    status: floor.status || 'actif'
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
}

const saveFloor = async () => {
  try {
    isSaving.value = true
    
    const floorData = { ...form.value }
    delete floorData.id
    
    if (isEditing.value) {
      await floorsAPI.updateFloor(form.value.id, floorData)
    } else {
      await floorsAPI.createFloor(floorData)
    }
    
    await loadFloors()
    closeModal()
    
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  } finally {
    isSaving.value = false
  }
}

const toggleFloorStatus = async (floor) => {
  try {
    const newStatus = floor.status === 'actif' ? 'inactif' : 'actif'
    await floorsAPI.patchFloor(floor.id, { status: newStatus })
    await loadFloors()
  } catch (error) {
    console.error('Erreur lors du changement de statut:', error)
  }
}

const deleteFloor = async (floor) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer l'étage "${floor.name}" ?`)) {
    try {
      await floorsAPI.deleteFloor(floor.id)
      await loadFloors()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }
}

const exportData = () => {
  console.log('Export des étages')
  // TODO: implémenter l'export
}

// Chargement initial
onMounted(async () => {
  await loadFloors()
})
</script> 