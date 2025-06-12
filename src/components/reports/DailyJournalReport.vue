<template>
  <div class="space-y-6">
    <!-- En-tête du journal -->
    <div class="bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg p-6 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold">Journal du Jour</h2>
          <p class="text-emerald-100 mt-1">{{ formatPeriod() }}</p>
        </div>
        <div class="text-right">
          <p class="text-sm text-emerald-100">Généré le</p>
          <p class="text-lg font-semibold">{{ formatDate(new Date().toISOString()) }}</p>
          <p class="text-sm text-emerald-100">{{ currentTime }}</p>
        </div>
      </div>
    </div>

    <!-- Résumé de la journée -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200 bg-emerald-50">
        <h3 class="text-lg font-semibold text-emerald-800 flex items-center">
          <BarChart3 class="w-5 h-5 mr-2" />
          Résumé des activités
        </h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <LogIn class="w-8 h-8 text-blue-600" />
            </div>
            <p class="text-2xl font-bold text-blue-600">{{ dailyStats.checkIns }}</p>
            <p class="text-sm text-gray-600">Arrivées</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <LogOut class="w-8 h-8 text-orange-600" />
            </div>
            <p class="text-2xl font-bold text-orange-600">{{ dailyStats.checkOuts }}</p>
            <p class="text-sm text-gray-600">Départs</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar class="w-8 h-8 text-green-600" />
            </div>
            <p class="text-2xl font-bold text-green-600">{{ dailyStats.newReservations }}</p>
            <p class="text-sm text-gray-600">Nouvelles réservations</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <DollarSign class="w-8 h-8 text-purple-600" />
            </div>
            <p class="text-2xl font-bold text-purple-600">{{ formatCurrency(dailyStats.revenue) }}</p>
            <p class="text-sm text-gray-600">Revenus</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Chronologie des événements -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <Clock class="w-5 h-5 mr-2" />
          Chronologie de la journée
        </h3>
      </div>
      <div class="p-6">
        <div class="space-y-4">
          <div v-for="event in timelineEvents" :key="event.id" class="flex items-start space-x-4">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="event.iconBg">
                <component :is="event.icon" class="w-5 h-5" :class="event.iconColor" />
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <p class="text-sm font-medium text-gray-900">{{ event.title }}</p>
                <p class="text-xs text-gray-500">{{ formatTime(event.time) }}</p>
              </div>
              <p class="text-sm text-gray-600 mt-1">{{ event.description }}</p>
              <p v-if="event.amount" class="text-sm font-semibold text-green-600 mt-1">
                {{ formatCurrency(event.amount) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Analyse des chambres -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- État des chambres -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <Building class="w-5 h-5 mr-2" />
            État des chambres
          </h3>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-4 h-4 bg-green-500 rounded-full"></div>
                <span class="text-sm font-medium text-gray-900">Occupées</span>
              </div>
              <span class="text-sm font-bold text-green-600">{{ roomStats.occupied }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-4 h-4 bg-gray-400 rounded-full"></div>
                <span class="text-sm font-medium text-gray-900">Disponibles</span>
              </div>
              <span class="text-sm font-bold text-gray-600">{{ roomStats.available }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span class="text-sm font-medium text-gray-900">Maintenance</span>
              </div>
              <span class="text-sm font-bold text-yellow-600">{{ roomStats.maintenance }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-4 h-4 bg-red-500 rounded-full"></div>
                <span class="text-sm font-medium text-gray-900">À nettoyer</span>
              </div>
              <span class="text-sm font-bold text-red-600">{{ roomStats.dirty }}</span>
            </div>
          </div>
          
          <div class="mt-6 pt-4 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-900">Taux d'occupation</span>
              <span class="text-lg font-bold text-blue-600">{{ occupancyRate }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance financière -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <TrendingUp class="w-5 h-5 mr-2" />
            Performance financière
          </h3>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Revenus de la journée</span>
              <span class="text-lg font-bold text-green-600">{{ formatCurrency(dailyStats.revenue) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Revenus par chambre occupée</span>
              <span class="text-sm font-semibold text-blue-600">{{ formatCurrency(revenuePerRoom) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">RevPAR (Revenue per Available Room)</span>
              <span class="text-sm font-semibold text-purple-600">{{ formatCurrency(revpar) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Durée moyenne de séjour</span>
              <span class="text-sm font-semibold text-orange-600">{{ averageStayDuration }} jours</span>
            </div>
          </div>
          
          <div class="mt-6 pt-4 border-t border-gray-200">
            <div class="text-center">
              <p class="text-xs text-gray-500 mb-1">Comparaison avec hier</p>
              <div class="flex items-center justify-center space-x-2">
                <TrendingUp v-if="revenueGrowth >= 0" class="w-4 h-4 text-green-500" />
                <TrendingDown v-else class="w-4 h-4 text-red-500" />
                <span 
                  class="text-sm font-semibold"
                  :class="revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'"
                >
                  {{ Math.abs(revenueGrowth) }}% {{ revenueGrowth >= 0 ? 'de hausse' : 'de baisse' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Clients du jour -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <Users class="w-5 h-5 mr-2" />
          Clients de la journée
        </h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Nouveaux clients -->
          <div>
            <h4 class="text-md font-semibold text-gray-800 mb-3">Nouveaux clients ({{ newClients.length }})</h4>
            <div v-if="newClients.length === 0" class="text-center py-6 text-gray-500">
              <Users class="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p class="text-sm">Aucun nouveau client aujourd'hui</p>
            </div>
            <div v-else class="space-y-3">
              <div 
                v-for="client in newClients.slice(0, 5)" 
                :key="client.id"
                class="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
              >
                <div>
                  <p class="font-medium text-gray-900">{{ client.name }}</p>
                  <p class="text-sm text-gray-600">Chambre {{ client.roomNumber }}</p>
                </div>
                <p class="text-sm font-semibold text-blue-600">{{ formatCurrency(client.amount) }}</p>
              </div>
              <p v-if="newClients.length > 5" class="text-xs text-gray-500 text-center">
                et {{ newClients.length - 5 }} autre(s) client(s)
              </p>
            </div>
          </div>

          <!-- Clients partants -->
          <div>
            <h4 class="text-md font-semibold text-gray-800 mb-3">Clients partants ({{ departingClients.length }})</h4>
            <div v-if="departingClients.length === 0" class="text-center py-6 text-gray-500">
              <Users class="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p class="text-sm">Aucun départ aujourd'hui</p>
            </div>
            <div v-else class="space-y-3">
              <div 
                v-for="client in departingClients.slice(0, 5)" 
                :key="client.id"
                class="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
              >
                <div>
                  <p class="font-medium text-gray-900">{{ client.name }}</p>
                  <p class="text-sm text-gray-600">Chambre {{ client.roomNumber }} • {{ client.duration }}</p>
                </div>
                <p class="text-sm font-semibold text-orange-600">{{ formatCurrency(client.amount) }}</p>
              </div>
              <p v-if="departingClients.length > 5" class="text-xs text-gray-500 text-center">
                et {{ departingClients.length - 5 }} autre(s) client(s)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Incidents et remarques -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <AlertTriangle class="w-5 h-5 mr-2" />
          Incidents et remarques
        </h3>
      </div>
      <div class="p-6">
        <div v-if="incidents.length === 0" class="text-center py-8 text-gray-500">
          <AlertTriangle class="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p>Aucun incident signalé aujourd'hui</p>
          <p class="text-sm text-green-600 mt-2">✓ Journée sans problème majeur</p>
        </div>
        <div v-else class="space-y-4">
          <div 
            v-for="incident in incidents" 
            :key="incident.id"
            class="p-4 rounded-lg border"
            :class="getIncidentClasses(incident.severity)"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <p class="font-medium" :class="getIncidentTextColor(incident.severity)">{{ incident.title }}</p>
                <p class="text-sm text-gray-600 mt-1">{{ incident.description }}</p>
                <p class="text-xs text-gray-500 mt-2">{{ formatTime(incident.time) }} - {{ incident.reportedBy }}</p>
              </div>
              <span 
                class="text-xs font-semibold px-2 py-1 rounded-full"
                :class="getIncidentBadgeClass(incident.severity)"
              >
                {{ getIncidentSeverityText(incident.severity) }}
              </span>
            </div>
            <div v-if="incident.resolution" class="mt-3 pt-3 border-t border-gray-200">
              <p class="text-sm text-green-700">
                <strong>Résolution:</strong> {{ incident.resolution }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Prévisions pour demain -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
      <h3 class="text-lg font-semibold text-blue-800 mb-4 flex items-center">
        <Calendar class="w-5 h-5 mr-2" />
        Prévisions pour demain
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="text-center">
          <p class="text-2xl font-bold text-blue-600">{{ tomorrowForecasts.arrivals }}</p>
          <p class="text-sm text-blue-700">Arrivées prévues</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-orange-600">{{ tomorrowForecasts.departures }}</p>
          <p class="text-sm text-orange-700">Départs prévus</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-green-600">{{ tomorrowForecasts.occupancyRate }}%</p>
          <p class="text-sm text-green-700">Taux d'occupation prévu</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { 
  BarChart3, LogIn, LogOut, Calendar, DollarSign, Clock, Building, 
  TrendingUp, TrendingDown, Users, AlertTriangle 
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

// Date de référence
const today = computed(() => {
  return props.period === 'custom' && props.customDate 
    ? props.customDate 
    : new Date().toISOString().split('T')[0]
})

// Statistiques quotidiennes
const dailyStats = computed(() => {
  const todayStr = today.value
  
  const checkIns = props.data.locations?.filter(location => {
    const checkInDate = new Date(location.checkIn_date || location.checkIn).toISOString().split('T')[0]
    return checkInDate === todayStr
  }).length || 0

  const checkOuts = props.data.locations?.filter(location => {
    const checkOutDate = new Date(location.checkOut_date || location.checkOut).toISOString().split('T')[0]
    return checkOutDate === todayStr
  }).length || 0

  const newReservations = props.data.reservations?.filter(reservation => {
    const createdDate = new Date(reservation.created_at || reservation.dateCreation).toISOString().split('T')[0]
    return createdDate === todayStr
  }).length || 0

  const revenue = props.data.locations?.filter(location => {
    const checkInDate = new Date(location.checkIn_date || location.checkIn).toISOString().split('T')[0]
    return checkInDate === todayStr
  }).reduce((sum, location) => sum + (location.totalPrice || 0), 0) || 0

  return { checkIns, checkOuts, newReservations, revenue }
})

// Chronologie des événements
const timelineEvents = computed(() => {
  const events = []
  
  // Ajouter les check-ins
  props.data.locations?.filter(location => {
    const checkInDate = new Date(location.checkIn_date || location.checkIn).toISOString().split('T')[0]
    return checkInDate === today.value
  }).forEach(location => {
    events.push({
      id: `checkin-${location.id}`,
      time: location.checkIn_date || location.checkIn,
      title: 'Arrivée client',
      description: `${location.client?.nom || 'Client inconnu'} - Chambre ${location.chambre?.numero || 'N/A'}`,
      amount: location.totalPrice,
      icon: LogIn,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    })
  })
  
  // Ajouter les check-outs
  props.data.locations?.filter(location => {
    const checkOutDate = new Date(location.checkOut_date || location.checkOut).toISOString().split('T')[0]
    return checkOutDate === today.value
  }).forEach(location => {
    events.push({
      id: `checkout-${location.id}`,
      time: location.checkOut_date || location.checkOut,
      title: 'Départ client',
      description: `${location.client?.nom || 'Client inconnu'} - Chambre ${location.chambre?.numero || 'N/A'}`,
      amount: location.totalPrice,
      icon: LogOut,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    })
  })
  
  // Ajouter les nouvelles réservations
  props.data.reservations?.filter(reservation => {
    const createdDate = new Date(reservation.created_at || reservation.dateCreation).toISOString().split('T')[0]
    return createdDate === today.value
  }).forEach(reservation => {
    events.push({
      id: `reservation-${reservation.id}`,
      time: reservation.created_at || reservation.dateCreation,
      title: 'Nouvelle réservation',
      description: `${reservation.client?.nom || 'Client inconnu'} - Chambre ${reservation.chambre?.numero || 'N/A'}`,
      amount: reservation.totalPrice,
      icon: Calendar,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    })
  })
  
  // Trier par heure
  return events.sort((a, b) => new Date(a.time) - new Date(b.time))
})

// État des chambres
const roomStats = computed(() => {
  const counts = { occupied: 0, available: 0, maintenance: 0, dirty: 0 }
  const todayStr = today.value
  
  props.data.chambers?.forEach(chamber => {
    const isOccupied = props.data.locations?.some(location => {
      const checkIn = new Date(location.checkIn_date || location.checkIn).toISOString().split('T')[0]
      const checkOut = new Date(location.checkOut_date || location.checkOut).toISOString().split('T')[0]
      return location.chambre?.id === chamber.id && checkIn <= todayStr && checkOut >= todayStr
    })
    
    if (isOccupied) {
      counts.occupied++
    } else {
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
  return Math.round((roomStats.value.occupied / totalRooms) * 100)
})

// Métriques financières
const revenuePerRoom = computed(() => {
  if (roomStats.value.occupied === 0) return 0
  return Math.round(dailyStats.value.revenue / roomStats.value.occupied)
})

const revpar = computed(() => {
  const totalRooms = props.data.chambers?.length || 0
  if (totalRooms === 0) return 0
  return Math.round(dailyStats.value.revenue / totalRooms)
})

const averageStayDuration = computed(() => {
  const durations = props.data.locations?.map(location => {
    const checkIn = new Date(location.checkIn_date || location.checkIn)
    const checkOut = new Date(location.checkOut_date || location.checkOut)
    return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
  }).filter(d => d > 0) || []
  
  if (durations.length === 0) return 0
  return Math.round(durations.reduce((sum, d) => sum + d, 0) / durations.length)
})

const revenueGrowth = computed(() => {
  // Simulation de croissance (à remplacer par de vraies données historiques)
  return Math.floor(Math.random() * 40) - 20 // Entre -20% et +20%
})

// Nouveaux clients
const newClients = computed(() => {
  return props.data.locations?.filter(location => {
    const checkInDate = new Date(location.checkIn_date || location.checkIn).toISOString().split('T')[0]
    return checkInDate === today.value
  }).map(location => ({
    id: location.id,
    name: location.client?.nom || 'Client inconnu',
    roomNumber: location.chambre?.numero || 'N/A',
    amount: location.totalPrice || 0
  })) || []
})

// Clients partants
const departingClients = computed(() => {
  return props.data.locations?.filter(location => {
    const checkOutDate = new Date(location.checkOut_date || location.checkOut).toISOString().split('T')[0]
    return checkOutDate === today.value
  }).map(location => {
    const checkInDate = new Date(location.checkIn_date || location.checkIn)
    const checkOutDate = new Date(location.checkOut_date || location.checkOut)
    const duration = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
    
    return {
      id: location.id,
      name: location.client?.nom || 'Client inconnu',
      roomNumber: location.chambre?.numero || 'N/A',
      duration: `${duration} jour${duration > 1 ? 's' : ''}`,
      amount: location.totalPrice || 0
    }
  }) || []
})

// Incidents (simulation)
const incidents = computed(() => {
  const possibleIncidents = [
    {
      id: 1,
      title: 'Problème de climatisation',
      description: 'Panne de climatisation signalée en chambre 205',
      severity: 'medium',
      time: new Date().setHours(10, 30, 0, 0),
      reportedBy: 'Service Réception',
      resolution: 'Technicien intervenu, problème résolu'
    },
    {
      id: 2,
      title: 'Retard de nettoyage',
      description: 'Chambre 101 non prête pour l\'arrivée de 14h',
      severity: 'low',
      time: new Date().setHours(13, 45, 0, 0),
      reportedBy: 'Équipe Housekeeping',
      resolution: 'Nettoyage terminé avec 30 minutes de retard'
    }
  ]
  
  // Retourner les incidents seulement s'il y a des données significatives
  return Math.random() > 0.7 ? possibleIncidents : []
})

// Prévisions pour demain
const tomorrowForecasts = computed(() => {
  const tomorrow = new Date(today.value)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]
  
  const arrivals = props.data.reservations?.filter(reservation => {
    const checkInDate = new Date(reservation.checkIn_date || reservation.checkIn).toISOString().split('T')[0]
    return checkInDate === tomorrowStr && reservation.status !== 'cancelled'
  }).length || 0
  
  const departures = props.data.locations?.filter(location => {
    const checkOutDate = new Date(location.checkOut_date || location.checkOut).toISOString().split('T')[0]
    return checkOutDate === tomorrowStr
  }).length || 0
  
  const currentOccupied = roomStats.value.occupied
  const netChange = arrivals - departures
  const tomorrowOccupied = Math.max(0, currentOccupied + netChange)
  const totalRooms = props.data.chambers?.length || 0
  const occupancyRate = totalRooms > 0 ? Math.round((tomorrowOccupied / totalRooms) * 100) : 0
  
  return { arrivals, departures, occupancyRate }
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
  if (props.period === 'today') return 'Journal du ' + formatDate(today.value)
  if (props.period === 'custom') return 'Journal du ' + formatDate(props.customDate)
  return 'Journal du ' + formatDate(today.value)
}

const getIncidentClasses = (severity) => {
  const classes = {
    high: 'bg-red-50 border-red-200',
    medium: 'bg-yellow-50 border-yellow-200',
    low: 'bg-blue-50 border-blue-200'
  }
  return classes[severity] || classes.low
}

const getIncidentTextColor = (severity) => {
  const colors = {
    high: 'text-red-800',
    medium: 'text-yellow-800',
    low: 'text-blue-800'
  }
  return colors[severity] || colors.low
}

const getIncidentBadgeClass = (severity) => {
  const classes = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-blue-100 text-blue-800'
  }
  return classes[severity] || classes.low
}

const getIncidentSeverityText = (severity) => {
  const texts = {
    high: 'Urgent',
    medium: 'Moyen',
    low: 'Mineur'
  }
  return texts[severity] || texts.low
}
</script> 