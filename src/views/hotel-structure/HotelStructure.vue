<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Structure de l'hôtel</h1>
      <p class="text-gray-600 mt-1">Configuration et gestion de la structure physique de votre établissement</p>
    </div>

    <!-- Statistiques rapides -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Building class="w-6 h-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total chambres</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalRooms }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Layers class="w-6 h-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Étages</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalFloors }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Home class="w-6 h-6 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Types de chambre</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.roomTypes }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <CheckCircle class="w-6 h-6 text-orange-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Chambres disponibles</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.availableRooms }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Menu de navigation des sections -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Types de chambres -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" 
           @click="$router.push('/structure/room-types')">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Home class="w-6 h-6 text-blue-600" />
            </div>
            <ArrowRight class="w-5 h-5 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Types de chambres</h3>
          <p class="text-sm text-gray-600 mb-4">Gérer les différents types de chambres et leurs caractéristiques</p>
          <div class="flex items-center text-sm text-gray-500">
            <span>{{ roomTypesData.length }} type(s) configuré(s)</span>
          </div>
        </div>
      </div>

      <!-- Étages -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" 
           @click="$router.push('/structure/floors')">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Layers class="w-6 h-6 text-green-600" />
            </div>
            <ArrowRight class="w-5 h-5 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Étages</h3>
          <p class="text-sm text-gray-600 mb-4">Configuration des étages et organisation spatiale</p>
          <div class="flex items-center text-sm text-gray-500">
            <span>{{ floorsData.length }} étage(s) configuré(s)</span>
          </div>
        </div>
      </div>

      <!-- Chambres -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" 
           @click="$router.push('/structure/rooms')">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Building class="w-6 h-6 text-purple-600" />
            </div>
            <ArrowRight class="w-5 h-5 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Chambres</h3>
          <p class="text-sm text-gray-600 mb-4">Gestion individuelle de toutes les chambres</p>
          <div class="flex items-center text-sm text-gray-500">
            <span>{{ roomsData.length }} chambre(s) configurée(s)</span>
          </div>
        </div>
      </div>

      <!-- Gestion des prix -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" 
           @click="$router.push('/structure/price-manager')">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign class="w-6 h-6 text-orange-600" />
            </div>
            <ArrowRight class="w-5 h-5 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Gestion des prix</h3>
          <p class="text-sm text-gray-600 mb-4">Configuration des tarifs par type de chambre et période</p>
          <div class="flex items-center text-sm text-gray-500">
            <span>Tarifs saisonniers actifs</span>
          </div>
        </div>
      </div>

      <!-- Coupons et réductions -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" 
           @click="$router.push('/structure/coupons')">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Percent class="w-6 h-6 text-red-600" />
            </div>
            <ArrowRight class="w-5 h-5 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Coupons & Réductions</h3>
          <p class="text-sm text-gray-600 mb-4">Créer et gérer les codes promotionnels</p>
          <div class="flex items-center text-sm text-gray-500">
            <span>{{ activeCoupons }} coupon(s) actif(s)</span>
          </div>
        </div>
      </div>

      <!-- Service ménage -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" 
           @click="$router.push('/structure/housekeeping')">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <Sparkles class="w-6 h-6 text-teal-600" />
            </div>
            <ArrowRight class="w-5 h-5 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Service ménage</h3>
          <p class="text-sm text-gray-600 mb-4">Planning et suivi du nettoyage des chambres</p>
          <div class="flex items-center text-sm text-gray-500">
            <span>{{ pendingHousekeeping }} tâche(s) en attente</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Aperçu rapide des chambres -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-lg font-medium text-gray-900">Aperçu des chambres</h3>
        <router-link to="/structure/rooms" class="text-sm text-purple-600 hover:text-purple-700 font-medium">
          Voir toutes les chambres
        </router-link>
      </div>
      
      <div class="p-6">
        <!-- Vue par étage -->
        <div class="space-y-6">
          <div v-for="floor in floorsOverview" :key="floor.number" class="border border-gray-200 rounded-lg p-4">
            <div class="flex items-center justify-between mb-4">
              <h4 class="font-medium text-gray-900">{{ floor.name }}</h4>
              <span class="text-sm text-gray-500">{{ floor.rooms.length }} chambres</span>
            </div>
            
            <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              <div
                v-for="room in floor.rooms"
                :key="room.number"
                :class="[
                  'p-3 rounded-lg border text-center cursor-pointer transition-colors',
                  getRoomStatusColor(room.status)
                ]"
                :title="`Chambre ${room.number} - ${room.type} - ${room.status}`"
              >
                <div class="text-sm font-medium">{{ room.number }}</div>
                <div class="text-xs mt-1">{{ room.type }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Légende des statuts -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Légende des statuts</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-green-200 border border-green-300 rounded"></div>
          <span class="text-sm text-gray-700">Libre</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-red-200 border border-red-300 rounded"></div>
          <span class="text-sm text-gray-700">Occupée</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-yellow-200 border border-yellow-300 rounded"></div>
          <span class="text-sm text-gray-700">Ménage</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-gray-200 border border-gray-300 rounded"></div>
          <span class="text-sm text-gray-700">Hors service</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Building, Layers, Home, CheckCircle, DollarSign, Percent, Sparkles, ArrowRight
} from 'lucide-vue-next'

// Données mockées
const roomTypesData = ref([
  { id: 1, name: 'Standard', basePrice: 40000 },
  { id: 2, name: 'Deluxe', basePrice: 60000 },
  { id: 3, name: 'Suite', basePrice: 80000 },
  { id: 4, name: 'VIP', basePrice: 120000 }
])

const floorsData = ref([
  { id: 1, number: 1, name: 'Rez-de-chaussée' },
  { id: 2, number: 2, name: '1er étage' },
  { id: 3, number: 3, name: '2ème étage' }
])

const roomsData = ref([
  { id: 1, number: '101', type: 'Standard', floor: 1, status: 'available' },
  { id: 2, number: '102', type: 'Standard', floor: 1, status: 'occupied' },
  { id: 3, number: '103', type: 'Deluxe', floor: 1, status: 'cleaning' },
  { id: 4, number: '201', type: 'Deluxe', floor: 2, status: 'available' },
  { id: 5, number: '202', type: 'Suite', floor: 2, status: 'occupied' },
  { id: 6, number: '203', type: 'Standard', floor: 2, status: 'maintenance' },
  { id: 7, number: '301', type: 'Suite', floor: 3, status: 'available' },
  { id: 8, number: '302', type: 'VIP', floor: 3, status: 'occupied' }
])

const activeCoupons = ref(3)
const pendingHousekeeping = ref(5)

// Computed
const stats = computed(() => ({
  totalRooms: roomsData.value.length,
  totalFloors: floorsData.value.length,
  roomTypes: roomTypesData.value.length,
  availableRooms: roomsData.value.filter(room => room.status === 'available').length
}))

const floorsOverview = computed(() => {
  return floorsData.value.map(floor => ({
    ...floor,
    rooms: roomsData.value.filter(room => room.floor === floor.number)
  }))
})

// Méthodes
const getRoomStatusColor = (status) => {
  const colors = {
    available: 'bg-green-100 border-green-300 text-green-800',
    occupied: 'bg-red-100 border-red-300 text-red-800',
    cleaning: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    maintenance: 'bg-gray-100 border-gray-300 text-gray-800'
  }
  return colors[status] || colors.available
}

onMounted(() => {
  // Charger les données de structure
})
</script> 