<template>
  <div class="space-y-6">
    <!-- Résumé de l'occupation -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-blue-600">Chambres occupées</p>
            <p class="text-3xl font-bold text-blue-900">{{ occupiedRooms }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
            <Bed class="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
      
      <div class="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-green-600">Taux d'occupation</p>
            <p class="text-3xl font-bold text-green-900">{{ occupancyRate }}%</p>
          </div>
          <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
            <TrendingUp class="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
      
      <div class="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-purple-600">Revenus générés</p>
            <p class="text-3xl font-bold text-purple-900">{{ formatCurrency(totalRevenue) }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
            <DollarSign class="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>

    <!-- Graphique d'occupation par type de chambre -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Occupation par type de chambre</h3>
      <div class="space-y-4">
        <div v-for="type in roomTypeOccupation" :key="type.name" class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: type.color }"></div>
            <span class="text-sm font-medium text-gray-900">{{ type.name }}</span>
          </div>
          <div class="flex items-center space-x-4">
            <div class="w-32 bg-gray-200 rounded-full h-2">
              <div 
                class="h-2 rounded-full transition-all duration-300"
                :style="{ 
                  width: type.occupancyRate + '%', 
                  backgroundColor: type.color 
                }"
              ></div>
            </div>
            <span class="text-sm font-semibold text-gray-900 w-12 text-right">{{ type.occupancyRate }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Détail des chambres -->
    <div class="bg-white rounded-lg border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Détail de l'occupation</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Numéro chambre
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check-in / Check-out
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durée
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prix
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="room in roomsDetails" :key="room.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ room.numero }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ room.type }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusColor(room.status)"
                >
                  {{ getStatusText(room.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ room.client || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div v-if="room.checkIn">
                  <div>{{ formatDate(room.checkIn) }}</div>
                  <div>{{ formatDate(room.checkOut) }}</div>
                </div>
                <div v-else>-</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ room.duration || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ room.price ? formatCurrency(room.price) : '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Statistiques par période -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Évolution de l'occupation</h3>
        <div class="space-y-3">
          <div v-for="day in occupationTrend" :key="day.date" class="flex items-center justify-between">
            <span class="text-sm text-gray-600">{{ formatShortDate(day.date) }}</span>
            <div class="flex items-center space-x-2">
              <div class="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  :style="{ width: day.rate + '%' }"
                ></div>
              </div>
              <span class="text-sm font-semibold text-gray-900 w-10 text-right">{{ day.rate }}%</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Performances clés</h3>
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Durée moyenne de séjour</span>
            <span class="text-sm font-semibold text-gray-900">{{ averageStayDuration }} jours</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">RevPAR moyen</span>
            <span class="text-sm font-semibold text-gray-900">{{ formatCurrency(revpar) }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">ADR moyen</span>
            <span class="text-sm font-semibold text-gray-900">{{ formatCurrency(adr) }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Chambres disponibles</span>
            <span class="text-sm font-semibold text-gray-900">{{ availableRooms }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Bed, TrendingUp, DollarSign } from 'lucide-vue-next'

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  period: {
    type: String,
    default: 'today'
  },
  customDate: {
    type: String,
    default: ''
  }
})

// Couleurs pour les types de chambres
const typeColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

// Calculs des données d'occupation
const occupiedRooms = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return props.data.locations?.filter(location => {
    const checkIn = new Date(location.checkIn_date || location.checkIn).toISOString().split('T')[0]
    const checkOut = new Date(location.checkOut_date || location.checkOut).toISOString().split('T')[0]
    return checkIn <= today && checkOut >= today
  }).length || 0
})

const totalRooms = computed(() => props.data.chambers?.length || 0)

const occupancyRate = computed(() => {
  if (totalRooms.value === 0) return 0
  return Math.round((occupiedRooms.value / totalRooms.value) * 100)
})

const totalRevenue = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return props.data.locations?.filter(location => {
    const checkIn = new Date(location.checkIn_date || location.checkIn).toISOString().split('T')[0]
    return checkIn === today
  }).reduce((sum, location) => sum + (location.totalPrice || 0), 0) || 0
})

const availableRooms = computed(() => totalRooms.value - occupiedRooms.value)

// Occupation par type de chambre
const roomTypeOccupation = computed(() => {
  const types = {}
  
  // Initialiser les types
  props.data.chambers?.forEach(chamber => {
    const typeName = chamber.typeChambre?.nom || 'Standard'
    if (!types[typeName]) {
      types[typeName] = {
        name: typeName,
        total: 0,
        occupied: 0,
        color: typeColors[Object.keys(types).length % typeColors.length]
      }
    }
    types[typeName].total++
  })
  
  // Compter les occupées
  const today = new Date().toISOString().split('T')[0]
  props.data.locations?.forEach(location => {
    const checkIn = new Date(location.checkIn_date || location.checkIn).toISOString().split('T')[0]
    const checkOut = new Date(location.checkOut_date || location.checkOut).toISOString().split('T')[0]
    
    if (checkIn <= today && checkOut >= today && location.chambre?.typeChambre?.nom) {
      const typeName = location.chambre.typeChambre.nom
      if (types[typeName]) {
        types[typeName].occupied++
      }
    }
  })
  
  // Calculer les taux d'occupation
  return Object.values(types).map(type => ({
    ...type,
    occupancyRate: type.total > 0 ? Math.round((type.occupied / type.total) * 100) : 0
  }))
})

// Détails des chambres
const roomsDetails = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  
  return props.data.chambers?.map(chamber => {
    // Trouver la location active pour cette chambre
    const activeLocation = props.data.locations?.find(location => {
      const checkIn = new Date(location.checkIn_date || location.checkIn).toISOString().split('T')[0]
      const checkOut = new Date(location.checkOut_date || location.checkOut).toISOString().split('T')[0]
      return location.chambre?.id === chamber.id && checkIn <= today && checkOut >= today
    })
    
    if (activeLocation) {
      const checkInDate = new Date(activeLocation.checkIn_date || activeLocation.checkIn)
      const checkOutDate = new Date(activeLocation.checkOut_date || activeLocation.checkOut)
      const duration = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
      
      return {
        id: chamber.id,
        numero: chamber.numero,
        type: chamber.typeChambre?.nom || 'Standard',
        status: 'occupied',
        client: activeLocation.client?.nom || 'Client inconnu',
        checkIn: activeLocation.checkIn_date || activeLocation.checkIn,
        checkOut: activeLocation.checkOut_date || activeLocation.checkOut,
        duration: `${duration} jour${duration > 1 ? 's' : ''}`,
        price: activeLocation.totalPrice
      }
    } else {
      return {
        id: chamber.id,
        numero: chamber.numero,
        type: chamber.typeChambre?.nom || 'Standard',
        status: 'available',
        client: null,
        checkIn: null,
        checkOut: null,
        duration: null,
        price: null
      }
    }
  }) || []
})

// Tendance d'occupation (simulation pour les 7 derniers jours)
const occupationTrend = computed(() => {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    // Simuler un taux d'occupation pour chaque jour (à remplacer par de vraies données)
    const baseRate = occupancyRate.value
    const variation = Math.random() * 20 - 10 // Variation de ±10%
    const rate = Math.max(0, Math.min(100, Math.round(baseRate + variation)))
    
    days.push({
      date: dateStr,
      rate
    })
  }
  return days
})

// Métriques avancées
const averageStayDuration = computed(() => {
  const durations = props.data.locations?.map(location => {
    const checkIn = new Date(location.checkIn_date || location.checkIn)
    const checkOut = new Date(location.checkOut_date || location.checkOut)
    return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
  }).filter(d => d > 0) || []
  
  if (durations.length === 0) return 0
  return Math.round(durations.reduce((sum, d) => sum + d, 0) / durations.length)
})

const revpar = computed(() => {
  // Revenue Per Available Room
  if (totalRooms.value === 0) return 0
  return Math.round(totalRevenue.value / totalRooms.value)
})

const adr = computed(() => {
  // Average Daily Rate
  if (occupiedRooms.value === 0) return 0
  return Math.round(totalRevenue.value / occupiedRooms.value)
})

// Méthodes utilitaires
const formatCurrency = (amount) => {
  if (!amount) return '0 FCFA'
  return new Intl.NumberFormat('fr-CI', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const formatShortDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('fr-FR', { 
    month: 'short', 
    day: 'numeric' 
  })
}

const getStatusColor = (status) => {
  const colors = {
    occupied: 'bg-green-100 text-green-800',
    available: 'bg-gray-100 text-gray-800',
    maintenance: 'bg-yellow-100 text-yellow-800',
    dirty: 'bg-red-100 text-red-800'
  }
  return colors[status] || colors.available
}

const getStatusText = (status) => {
  const texts = {
    occupied: 'Occupée',
    available: 'Disponible',
    maintenance: 'Maintenance',
    dirty: 'À nettoyer'
  }
  return texts[status] || texts.available
}
</script> 