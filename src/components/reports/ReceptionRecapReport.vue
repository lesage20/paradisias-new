<template>
  <div class="space-y-6">
    <!-- En-tête du récapitulatif -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold">Récapitulatif Point Réceptionniste</h2>
          <p class="text-blue-100 mt-1">{{ formatPeriod() }}</p>
        </div>
        <div class="text-right">
          <p class="text-sm text-blue-100">Heure de génération</p>
          <p class="text-lg font-semibold">{{ currentTime }}</p>
        </div>
      </div>
    </div>

    <!-- Résumé rapide -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <LogIn class="w-6 h-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Check-ins</p>
            <p class="text-2xl font-bold text-green-600">{{ checkInsToday }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <LogOut class="w-6 h-6 text-orange-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Check-outs</p>
            <p class="text-2xl font-bold text-orange-600">{{ checkOutsToday }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Calendar class="w-6 h-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Nouvelles réservations</p>
            <p class="text-2xl font-bold text-blue-600">{{ newReservationsToday }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <DollarSign class="w-6 h-6 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Recettes du jour</p>
            <p class="text-2xl font-bold text-purple-600">{{ formatCurrency(dailyRevenue) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Activités du jour -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Check-ins d'aujourd'hui -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200 bg-green-50">
          <h3 class="text-lg font-semibold text-green-800 flex items-center">
            <LogIn class="w-5 h-5 mr-2" />
            Check-ins du jour ({{ checkInsToday }})
          </h3>
        </div>
        <div class="p-6">
          <div v-if="todayCheckIns.length === 0" class="text-center py-8 text-gray-500">
            <LogIn class="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>Aucun check-in pour aujourd'hui</p>
          </div>
          <div v-else class="space-y-3">
            <div 
              v-for="checkin in todayCheckIns" 
              :key="checkin.id"
              class="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
            >
              <div class="flex-1">
                <p class="font-medium text-gray-900">{{ checkin.clientName }}</p>
                <p class="text-sm text-gray-600">Chambre {{ checkin.roomNumber }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-green-600">{{ formatTime(checkin.time) }}</p>
                <p class="text-xs text-gray-500">{{ checkin.duration }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Check-outs d'aujourd'hui -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200 bg-orange-50">
          <h3 class="text-lg font-semibold text-orange-800 flex items-center">
            <LogOut class="w-5 h-5 mr-2" />
            Check-outs du jour ({{ checkOutsToday }})
          </h3>
        </div>
        <div class="p-6">
          <div v-if="todayCheckOuts.length === 0" class="text-center py-8 text-gray-500">
            <LogOut class="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>Aucun check-out pour aujourd'hui</p>
          </div>
          <div v-else class="space-y-3">
            <div 
              v-for="checkout in todayCheckOuts" 
              :key="checkout.id"
              class="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
            >
              <div class="flex-1">
                <p class="font-medium text-gray-900">{{ checkout.clientName }}</p>
                <p class="text-sm text-gray-600">Chambre {{ checkout.roomNumber }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-orange-600">{{ formatTime(checkout.time) }}</p>
                <p class="text-xs text-gray-500">{{ formatCurrency(checkout.amount) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Nouvelles réservations -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200 bg-blue-50">
        <h3 class="text-lg font-semibold text-blue-800 flex items-center">
          <Calendar class="w-5 h-5 mr-2" />
          Nouvelles réservations ({{ newReservationsToday }})
        </h3>
      </div>
      <div class="p-6">
        <div v-if="todayReservations.length === 0" class="text-center py-8 text-gray-500">
          <Calendar class="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p>Aucune nouvelle réservation pour aujourd'hui</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-2 text-sm font-medium text-gray-500">Client</th>
                <th class="text-left py-2 text-sm font-medium text-gray-500">Chambre</th>
                <th class="text-left py-2 text-sm font-medium text-gray-500">Période</th>
                <th class="text-left py-2 text-sm font-medium text-gray-500">Statut</th>
                <th class="text-right py-2 text-sm font-medium text-gray-500">Montant</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="reservation in todayReservations" :key="reservation.id" class="hover:bg-gray-50">
                <td class="py-3 text-sm font-medium text-gray-900">{{ reservation.clientName }}</td>
                <td class="py-3 text-sm text-gray-600">{{ reservation.roomNumber }}</td>
                <td class="py-3 text-sm text-gray-600">
                  <div>{{ formatDate(reservation.checkIn) }}</div>
                  <div class="text-xs text-gray-500">{{ formatDate(reservation.checkOut) }}</div>
                </td>
                <td class="py-3">
                  <span 
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="getReservationStatusColor(reservation.status)"
                  >
                    {{ getReservationStatusText(reservation.status) }}
                  </span>
                </td>
                <td class="py-3 text-sm font-medium text-gray-900 text-right">
                  {{ formatCurrency(reservation.amount) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Statut des chambres -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <Building class="w-5 h-5 mr-2" />
          État des chambres
        </h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div class="text-2xl font-bold text-green-600">{{ roomStatusCount.occupied }}</div>
            <div class="text-sm text-green-600 font-medium">Occupées</div>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div class="text-2xl font-bold text-gray-600">{{ roomStatusCount.available }}</div>
            <div class="text-sm text-gray-600 font-medium">Disponibles</div>
          </div>
          <div class="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div class="text-2xl font-bold text-yellow-600">{{ roomStatusCount.maintenance }}</div>
            <div class="text-sm text-yellow-600 font-medium">Maintenance</div>
          </div>
          <div class="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <div class="text-2xl font-bold text-red-600">{{ roomStatusCount.dirty }}</div>
            <div class="text-sm text-red-600 font-medium">À nettoyer</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notes importantes -->
    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
      <h3 class="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
        <AlertCircle class="w-5 h-5 mr-2" />
        Points d'attention
      </h3>
      <div class="space-y-3">
        <div v-for="note in importantNotes" :key="note.id" class="flex items-start space-x-3">
          <div class="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
          <div>
            <p class="text-sm text-yellow-800 font-medium">{{ note.title }}</p>
            <p class="text-sm text-yellow-700">{{ note.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Résumé financier -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <TrendingUp class="w-5 h-5 mr-2" />
          Résumé financier
        </h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p class="text-sm text-gray-600 mb-1">Recettes du jour</p>
            <p class="text-2xl font-bold text-green-600">{{ formatCurrency(dailyRevenue) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 mb-1">Moyenne par chambre</p>
            <p class="text-2xl font-bold text-blue-600">{{ formatCurrency(averageRoomRevenue) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 mb-1">Taux d'occupation</p>
            <p class="text-2xl font-bold text-purple-600">{{ occupancyRate }}%</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { 
  LogIn, LogOut, Calendar, DollarSign, Building, TrendingUp, 
  AlertCircle 
} from 'lucide-vue-next'

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

const currentTime = ref('')

// Mettre à jour l'heure actuelle
const updateCurrentTime = () => {
  currentTime.value = new Date().toLocaleTimeString('fr-FR')
}

onMounted(() => {
  updateCurrentTime()
  setInterval(updateCurrentTime, 1000)
})

// Données calculées
const today = computed(() => {
  return props.period === 'custom' && props.customDate 
    ? props.customDate 
    : new Date().toISOString().split('T')[0]
})

// Check-ins d'aujourd'hui
const todayCheckIns = computed(() => {
  return props.data.locations?.filter(location => {
    const checkInDate = new Date(location.checkIn_date || location.checkIn).toISOString().split('T')[0]
    return checkInDate === today.value
  }).map(location => {
    const checkInDate = new Date(location.checkIn_date || location.checkIn)
    const checkOutDate = new Date(location.checkOut_date || location.checkOut)
    const duration = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
    
    return {
      id: location.id,
      clientName: location.client?.nom || 'Client inconnu',
      roomNumber: location.chambre?.numero || 'N/A',
      time: location.checkIn_date || location.checkIn,
      duration: `${duration} jour${duration > 1 ? 's' : ''}`
    }
  }) || []
})

// Check-outs d'aujourd'hui
const todayCheckOuts = computed(() => {
  return props.data.locations?.filter(location => {
    const checkOutDate = new Date(location.checkOut_date || location.checkOut).toISOString().split('T')[0]
    return checkOutDate === today.value
  }).map(location => ({
    id: location.id,
    clientName: location.client?.nom || 'Client inconnu',
    roomNumber: location.chambre?.numero || 'N/A',
    time: location.checkOut_date || location.checkOut,
    amount: location.totalPrice || 0
  })) || []
})

// Nouvelles réservations d'aujourd'hui
const todayReservations = computed(() => {
  return props.data.reservations?.filter(reservation => {
    const createdDate = new Date(reservation.created_at || reservation.dateCreation).toISOString().split('T')[0]
    return createdDate === today.value
  }).map(reservation => ({
    id: reservation.id,
    clientName: reservation.client?.nom || 'Client inconnu',
    roomNumber: reservation.chambre?.numero || 'N/A',
    checkIn: reservation.checkIn_date || reservation.checkIn,
    checkOut: reservation.checkOut_date || reservation.checkOut,
    status: reservation.status || 'pending',
    amount: reservation.totalPrice || 0
  })) || []
})

// Compteurs
const checkInsToday = computed(() => todayCheckIns.value.length)
const checkOutsToday = computed(() => todayCheckOuts.value.length)
const newReservationsToday = computed(() => todayReservations.value.length)

// Revenus du jour
const dailyRevenue = computed(() => {
  return todayCheckIns.value.reduce((sum, checkin) => {
    const location = props.data.locations?.find(loc => 
      (loc.client?.nom === checkin.clientName || 'Client inconnu' === checkin.clientName) &&
      (loc.chambre?.numero === checkin.roomNumber || 'N/A' === checkin.roomNumber)
    )
    return sum + (location?.totalPrice || 0)
  }, 0)
})

// État des chambres
const roomStatusCount = computed(() => {
  const counts = {
    occupied: 0,
    available: 0,
    maintenance: 0,
    dirty: 0
  }
  
  const todayStr = today.value
  
  props.data.chambers?.forEach(chamber => {
    // Vérifier si la chambre est occupée aujourd'hui
    const isOccupied = props.data.locations?.some(location => {
      const checkIn = new Date(location.checkIn_date || location.checkIn).toISOString().split('T')[0]
      const checkOut = new Date(location.checkOut_date || location.checkOut).toISOString().split('T')[0]
      return location.chambre?.id === chamber.id && checkIn <= todayStr && checkOut >= todayStr
    })
    
    if (isOccupied) {
      counts.occupied++
    } else {
      // Simulation du statut des chambres libres
      const rand = Math.random()
      if (rand < 0.1) counts.maintenance++
      else if (rand < 0.2) counts.dirty++
      else counts.available++
    }
  })
  
  return counts
})

// Taux d'occupation
const occupancyRate = computed(() => {
  const totalRooms = props.data.chambers?.length || 0
  if (totalRooms === 0) return 0
  return Math.round((roomStatusCount.value.occupied / totalRooms) * 100)
})

// Revenus moyen par chambre
const averageRoomRevenue = computed(() => {
  const occupiedRooms = roomStatusCount.value.occupied
  if (occupiedRooms === 0) return 0
  return Math.round(dailyRevenue.value / occupiedRooms)
})

// Notes importantes
const importantNotes = computed(() => {
  const notes = []
  
  if (roomStatusCount.value.maintenance > 0) {
    notes.push({
      id: 'maintenance',
      title: `${roomStatusCount.value.maintenance} chambre(s) en maintenance`,
      description: 'Vérifier l\'avancement des travaux et prévoir la remise en service'
    })
  }
  
  if (roomStatusCount.value.dirty > 0) {
    notes.push({
      id: 'cleaning',
      title: `${roomStatusCount.value.dirty} chambre(s) à nettoyer`,
      description: 'Contacter l\'équipe de ménage pour prioriser le nettoyage'
    })
  }
  
  if (occupancyRate.value > 90) {
    notes.push({
      id: 'high-occupancy',
      title: 'Taux d\'occupation élevé',
      description: 'Prévoir la gestion des arrivées tardives et des demandes spéciales'
    })
  }
  
  if (checkInsToday.value > checkOutsToday.value + 3) {
    notes.push({
      id: 'imbalance',
      title: 'Plus d\'arrivées que de départs',
      description: 'Vérifier la disponibilité des chambres pour les prochaines arrivées'
    })
  }
  
  return notes
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

const formatTime = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const formatPeriod = () => {
  if (props.period === 'today') return 'Aujourd\'hui - ' + formatDate(today.value)
  if (props.period === 'custom') return formatDate(props.customDate)
  return formatDate(today.value)
}

const getReservationStatusColor = (status) => {
  const colors = {
    confirmed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return colors[status] || colors.pending
}

const getReservationStatusText = (status) => {
  const texts = {
    confirmed: 'Confirmée',
    pending: 'En attente',
    cancelled: 'Annulée'
  }
  return texts[status] || texts.pending
}
</script> 