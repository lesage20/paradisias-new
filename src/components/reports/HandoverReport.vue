<template>
  <div class="space-y-6">
    <!-- En-tête du rapport de passation -->
    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold">Rapport de Passation</h2>
          <p class="text-indigo-100 mt-1">{{ formatPeriod() }}</p>
        </div>
        <div class="text-right">
          <p class="text-sm text-indigo-100">Transmis par</p>
          <p class="text-lg font-semibold">{{ currentUser }}</p>
          <p class="text-sm text-indigo-100">{{ currentTime }}</p>
        </div>
      </div>
    </div>

    <!-- Résumé de l'équipe sortante -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200 bg-blue-50">
        <h3 class="text-lg font-semibold text-blue-800 flex items-center">
          <Users class="w-5 h-5 mr-2" />
          Résumé de l'équipe sortante
        </h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div class="text-2xl font-bold text-green-600">{{ dailyStats.checkIns }}</div>
            <div class="text-sm text-green-600 font-medium">Check-ins effectués</div>
          </div>
          <div class="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div class="text-2xl font-bold text-orange-600">{{ dailyStats.checkOuts }}</div>
            <div class="text-sm text-orange-600 font-medium">Check-outs traités</div>
          </div>
          <div class="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div class="text-2xl font-bold text-blue-600">{{ dailyStats.newReservations }}</div>
            <div class="text-sm text-blue-600 font-medium">Nouvelles réservations</div>
          </div>
          <div class="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div class="text-2xl font-bold text-purple-600">{{ formatCurrency(dailyStats.revenue) }}</div>
            <div class="text-sm text-purple-600 font-medium">Revenus collectés</div>
          </div>
        </div>
      </div>
    </div>

    <!-- État actuel des chambres -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <Building class="w-5 h-5 mr-2" />
          État actuel des chambres
        </h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div class="text-2xl font-bold text-green-600">{{ roomStatus.occupied }}</div>
            <div class="text-sm text-green-600 font-medium">Occupées</div>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div class="text-2xl font-bold text-gray-600">{{ roomStatus.available }}</div>
            <div class="text-sm text-gray-600 font-medium">Disponibles</div>
          </div>
          <div class="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div class="text-2xl font-bold text-yellow-600">{{ roomStatus.maintenance }}</div>
            <div class="text-sm text-yellow-600 font-medium">Maintenance</div>
          </div>
          <div class="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <div class="text-2xl font-bold text-red-600">{{ roomStatus.dirty }}</div>
            <div class="text-sm text-red-600 font-medium">À nettoyer</div>
          </div>
        </div>

        <!-- Détail des chambres problématiques -->
        <div v-if="problematicRooms.length > 0" class="mt-6">
          <h4 class="text-md font-semibold text-gray-800 mb-3">Chambres nécessitant une attention</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div 
              v-for="room in problematicRooms" 
              :key="room.id"
              class="p-3 rounded-lg border"
              :class="getRoomStatusClasses(room.status)"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium">Chambre {{ room.numero }}</p>
                  <p class="text-sm opacity-75">{{ room.type }}</p>
                </div>
                <span class="text-xs font-semibold px-2 py-1 rounded-full">
                  {{ getRoomStatusText(room.status) }}
                </span>
              </div>
              <p v-if="room.note" class="text-sm mt-2 opacity-75">{{ room.note }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Arrivées prévues pour l'équipe suivante -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200 bg-green-50">
        <h3 class="text-lg font-semibold text-green-800 flex items-center">
          <Calendar class="w-5 h-5 mr-2" />
          Arrivées prévues ({{ upcomingArrivals.length }})
        </h3>
      </div>
      <div class="p-6">
        <div v-if="upcomingArrivals.length === 0" class="text-center py-8 text-gray-500">
          <Calendar class="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p>Aucune arrivée prévue pour la prochaine période</p>
        </div>
        <div v-else class="space-y-3">
          <div 
            v-for="arrival in upcomingArrivals" 
            :key="arrival.id"
            class="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200"
          >
            <div class="flex-1">
              <p class="font-medium text-gray-900">{{ arrival.clientName }}</p>
              <p class="text-sm text-gray-600">Chambre {{ arrival.roomNumber }} - {{ arrival.roomType }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-green-600">{{ formatTime(arrival.expectedTime) }}</p>
              <p class="text-xs text-gray-500">{{ arrival.duration }}</p>
              <p class="text-xs font-medium text-green-700">{{ formatCurrency(arrival.amount) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Départs prévus -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200 bg-orange-50">
        <h3 class="text-lg font-semibold text-orange-800 flex items-center">
          <LogOut class="w-5 h-5 mr-2" />
          Départs prévus ({{ upcomingDepartures.length }})
        </h3>
      </div>
      <div class="p-6">
        <div v-if="upcomingDepartures.length === 0" class="text-center py-8 text-gray-500">
          <LogOut class="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p>Aucun départ prévu pour la prochaine période</p>
        </div>
        <div v-else class="space-y-3">
          <div 
            v-for="departure in upcomingDepartures" 
            :key="departure.id"
            class="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200"
          >
            <div class="flex-1">
              <p class="font-medium text-gray-900">{{ departure.clientName }}</p>
              <p class="text-sm text-gray-600">Chambre {{ departure.roomNumber }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-orange-600">{{ formatTime(departure.expectedTime) }}</p>
              <p class="text-xs text-gray-500">Total séjour: {{ formatCurrency(departure.totalAmount) }}</p>
              <p class="text-xs" :class="departure.isPaid ? 'text-green-600' : 'text-red-600'">
                {{ departure.isPaid ? 'Payé' : 'À encaisser' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Points d'attention et instructions -->
    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
      <h3 class="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
        <AlertTriangle class="w-5 h-5 mr-2" />
        Points d'attention pour l'équipe suivante
      </h3>
      <div class="space-y-4">
        <div v-for="instruction in handoverInstructions" :key="instruction.id" class="flex items-start space-x-3">
          <div class="w-3 h-3 rounded-full mt-1 flex-shrink-0" :class="getPriorityColor(instruction.priority)"></div>
          <div class="flex-1">
            <p class="text-sm text-yellow-800 font-medium">{{ instruction.title }}</p>
            <p class="text-sm text-yellow-700">{{ instruction.description }}</p>
            <p v-if="instruction.timeLimit" class="text-xs text-yellow-600 mt-1">
              <Clock class="w-3 h-3 inline mr-1" />
              À traiter avant {{ formatTime(instruction.timeLimit) }}
            </p>
          </div>
          <span class="text-xs font-semibold px-2 py-1 rounded-full" :class="getPriorityBadgeClass(instruction.priority)">
            {{ getPriorityText(instruction.priority) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Caisse et finances -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200 bg-purple-50">
        <h3 class="text-lg font-semibold text-purple-800 flex items-center">
          <DollarSign class="w-5 h-5 mr-2" />
          État de la caisse
        </h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <p class="text-sm text-gray-600 mb-1">Caisse début de service</p>
            <p class="text-2xl font-bold text-gray-800">{{ formatCurrency(cashFlow.startAmount) }}</p>
          </div>
          <div class="text-center">
            <p class="text-sm text-gray-600 mb-1">Encaissements du jour</p>
            <p class="text-2xl font-bold text-green-600">+ {{ formatCurrency(cashFlow.collections) }}</p>
          </div>
          <div class="text-center">
            <p class="text-sm text-gray-600 mb-1">Caisse actuelle</p>
            <p class="text-2xl font-bold text-purple-600">{{ formatCurrency(cashFlow.currentAmount) }}</p>
          </div>
        </div>

        <div v-if="pendingPayments.length > 0" class="mt-6">
          <h4 class="text-md font-semibold text-gray-800 mb-3">Paiements en attente</h4>
          <div class="space-y-2">
            <div 
              v-for="payment in pendingPayments" 
              :key="payment.id"
              class="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
            >
              <div>
                <p class="text-sm font-medium text-gray-900">{{ payment.clientName }}</p>
                <p class="text-xs text-gray-600">Chambre {{ payment.roomNumber }} - {{ payment.description }}</p>
              </div>
              <p class="text-sm font-bold text-red-600">{{ formatCurrency(payment.amount) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contacts et informations utiles -->
    <div class="bg-gray-50 rounded-lg p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Phone class="w-5 h-5 mr-2" />
        Contacts utiles
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white p-4 rounded-lg">
          <p class="text-sm font-medium text-gray-800">Manager de service</p>
          <p class="text-lg font-bold text-blue-600">+225 07 87 57 20 30</p>
        </div>
        <div class="bg-white p-4 rounded-lg">
          <p class="text-sm font-medium text-gray-800">Maintenance technique</p>
          <p class="text-lg font-bold text-orange-600">+225 05 55 44 33 22</p>
        </div>
        <div class="bg-white p-4 rounded-lg">
          <p class="text-sm font-medium text-gray-800">Service de ménage</p>
          <p class="text-lg font-bold text-green-600">+225 01 23 45 67 89</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { 
  Users, Building, Calendar, LogOut, AlertTriangle, Clock, 
  DollarSign, Phone 
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
const currentUser = ref('Équipe Réception')

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

// État des chambres
const roomStatus = computed(() => {
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

// Chambres problématiques
const problematicRooms = computed(() => {
  const rooms = []
  
  // Simulation de chambres avec problèmes
  props.data.chambers?.slice(0, 3).forEach((chamber, index) => {
    if (index === 0) {
      rooms.push({
        id: chamber.id,
        numero: chamber.numero,
        type: chamber.typeChambre?.nom || 'Standard',
        status: 'maintenance',
        note: 'Climatisation en panne - Technicien contacté'
      })
    } else if (index === 1) {
      rooms.push({
        id: chamber.id,
        numero: chamber.numero,
        type: chamber.typeChambre?.nom || 'Standard',
        status: 'dirty',
        note: 'Nettoyage approfondi requis après départ'
      })
    }
  })
  
  return rooms
})

// Arrivées prévues
const upcomingArrivals = computed(() => {
  const tomorrow = new Date(today.value)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]
  
  return props.data.reservations?.filter(reservation => {
    const checkInDate = new Date(reservation.checkIn_date || reservation.checkIn).toISOString().split('T')[0]
    return checkInDate === tomorrowStr && reservation.status !== 'cancelled'
  }).map(reservation => {
    const checkInDate = new Date(reservation.checkIn_date || reservation.checkIn)
    const checkOutDate = new Date(reservation.checkOut_date || reservation.checkOut)
    const duration = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
    
    return {
      id: reservation.id,
      clientName: reservation.client?.nom || 'Client inconnu',
      roomNumber: reservation.chambre?.numero || 'N/A',
      roomType: reservation.chambre?.typeChambre?.nom || 'Standard',
      expectedTime: reservation.checkIn_date || reservation.checkIn,
      duration: `${duration} jour${duration > 1 ? 's' : ''}`,
      amount: reservation.totalPrice || 0
    }
  }) || []
})

// Départs prévus
const upcomingDepartures = computed(() => {
  const tomorrow = new Date(today.value)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]
  
  return props.data.locations?.filter(location => {
    const checkOutDate = new Date(location.checkOut_date || location.checkOut).toISOString().split('T')[0]
    return checkOutDate === tomorrowStr
  }).map(location => ({
    id: location.id,
    clientName: location.client?.nom || 'Client inconnu',
    roomNumber: location.chambre?.numero || 'N/A',
    expectedTime: location.checkOut_date || location.checkOut,
    totalAmount: location.totalPrice || 0,
    isPaid: Math.random() > 0.3 // Simulation
  })) || []
})

// Instructions de passation
const handoverInstructions = computed(() => {
  const instructions = []
  
  if (roomStatus.value.maintenance > 0) {
    instructions.push({
      id: 'maintenance',
      title: 'Suivi maintenance',
      description: `${roomStatus.value.maintenance} chambre(s) en maintenance. Vérifier l'avancement avec l'équipe technique.`,
      priority: 'high',
      timeLimit: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2h
    })
  }
  
  if (upcomingArrivals.value.length > 0) {
    instructions.push({
      id: 'arrivals',
      title: 'Arrivées prévues',
      description: `${upcomingArrivals.value.length} arrivée(s) programmée(s). Préparer les clés et vérifier la disponibilité.`,
      priority: 'medium'
    })
  }
  
  if (pendingPayments.value.length > 0) {
    instructions.push({
      id: 'payments',
      title: 'Paiements en attente',
      description: `${pendingPayments.value.length} paiement(s) à collecter. Contacter les clients concernés.`,
      priority: 'high'
    })
  }
  
  if (roomStatus.value.dirty > 0) {
    instructions.push({
      id: 'cleaning',
      title: 'Chambres à nettoyer',
      description: `${roomStatus.value.dirty} chambre(s) nécessitent un nettoyage avant les prochaines arrivées.`,
      priority: 'medium'
    })
  }
  
  return instructions
})

// Flux de caisse
const cashFlow = computed(() => {
  const collections = dailyStats.value.revenue
  const startAmount = 50000 // Simulation
  
  return {
    startAmount,
    collections,
    currentAmount: startAmount + collections
  }
})

// Paiements en attente
const pendingPayments = computed(() => {
  return props.data.locations?.filter(location => {
    return Math.random() > 0.8 // Simulation de 20% de paiements en attente
  }).slice(0, 3).map(location => ({
    id: location.id,
    clientName: location.client?.nom || 'Client inconnu',
    roomNumber: location.chambre?.numero || 'N/A',
    description: 'Solde séjour',
    amount: (location.totalPrice || 0) * 0.3 // Simulation de 30% restant
  })) || []
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
  if (props.period === 'today') return 'Passation du ' + formatDate(today.value)
  if (props.period === 'custom') return 'Passation du ' + formatDate(props.customDate)
  return 'Passation du ' + formatDate(today.value)
}

const getRoomStatusClasses = (status) => {
  const classes = {
    maintenance: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    dirty: 'bg-red-50 border-red-200 text-red-800',
    occupied: 'bg-green-50 border-green-200 text-green-800',
    available: 'bg-gray-50 border-gray-200 text-gray-800'
  }
  return classes[status] || classes.available
}

const getRoomStatusText = (status) => {
  const texts = {
    maintenance: 'Maintenance',
    dirty: 'À nettoyer',
    occupied: 'Occupée',
    available: 'Disponible'
  }
  return texts[status] || texts.available
}

const getPriorityColor = (priority) => {
  const colors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500'
  }
  return colors[priority] || colors.medium
}

const getPriorityBadgeClass = (priority) => {
  const classes = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  }
  return classes[priority] || classes.medium
}

const getPriorityText = (priority) => {
  const texts = {
    high: 'Urgent',
    medium: 'Moyen',
    low: 'Faible'
  }
  return texts[priority] || texts.medium
}
</script> 