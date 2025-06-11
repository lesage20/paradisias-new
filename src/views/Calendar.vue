<template>
    <div class="space-y-6">
        <!-- Header avec navigation -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Calendrier des Locations</h1>
                <p class="text-gray-600 mt-1">Vue hebdomadaire des réservations par chambre</p>
            </div>
            <div class="mt-4 sm:mt-0 flex items-center space-x-3">
                <button @click="goToPreviousWeek"
                    class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <ChevronLeft class="w-4 h-4" />
                </button>
                <div class="px-4 py-2 bg-white border border-gray-300 rounded-lg">
                    <span class="font-medium text-gray-900">{{ weekPeriod }}</span>
                </div>
                <button @click="goToNextWeek"
                    class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <ChevronRight class="w-4 h-4" />
                </button>
                <button @click="goToToday"
                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                    Cette semaine
                </button>
            </div>
        </div>

        <!-- Statistiques rapides -->
        <!-- <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div class="flex items-center">
                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar class="w-6 h-6 text-blue-600" />
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Locations cette semaine</p>
                        <p class="text-2xl font-bold text-gray-900">{{ weekStats.totalLocations }}</p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div class="flex items-center">
                    <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <TrendingUp class="w-6 h-6 text-green-600" />
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Taux d'occupation</p>
                        <p class="text-2xl font-bold text-gray-900">{{ weekStats.occupancyRate }}%</p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div class="flex items-center">
                    <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <DollarSign class="w-6 h-6 text-orange-600" />
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Revenus cette semaine</p>
                        <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(weekStats.totalRevenue) }}</p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div class="flex items-center">
                    <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Users class="w-6 h-6 text-purple-600" />
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Clients uniques</p>
                        <p class="text-2xl font-bold text-gray-900">{{ weekStats.uniqueClients }}</p>
                    </div>
                </div>
            </div>
        </div> -->

        <!-- Filtre de recherche -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div class="flex items-center space-x-4">
                <div class="flex-1">
                    <label for="room-search" class="block text-sm font-medium text-gray-700 mb-2">
                        Rechercher une chambre
                    </label>
                    <div class="relative">
                        <Search class="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                            id="room-search"
                            v-model="roomSearchQuery"
                            type="text"
                            placeholder="Tapez le numéro ou le nom de la chambre..."
                            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                </div>
                <button
                    v-if="roomSearchQuery"
                    @click="clearRoomSearch"
                    class="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Effacer
                </button>
            </div>
            <div v-if="roomSearchQuery && filteredRooms.length === 0" class="mt-2 text-sm text-gray-500">
                Aucune chambre trouvée pour "{{ roomSearchQuery }}"
            </div>
            <div v-else-if="roomSearchQuery" class="mt-2 text-sm text-gray-600">
                {{ filteredRooms.length }} chambre(s) trouvée(s) sur {{ rooms.length }} au total
            </div>
            <div v-else-if="rooms.length > 0" class="mt-2 text-sm text-gray-500">
                {{ rooms.length }} chambre(s) au total
            </div>
        </div>

        <!-- Loading spinner -->
        <div v-if="isLoading" class="flex flex-col justify-center items-center py-12 space-y-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p class="text-gray-600">Chargement du calendrier...</p>
            <button @click="refreshData" 
                class="mt-4 px-4 py-2 text-sm text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                Réessayer
            </button>
        </div>

        <!-- Calendrier -->
        <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <!-- Conteneur principal avec scroll global -->
            <div class="calendar-container max-h-96 overflow-y-auto">
                <!-- En-tête du calendrier -->
                <div class="calendar-header border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
                    <div class="calendar-grid">
                        <!-- Colonne des chambres -->
                        <div class="p-4 font-medium text-gray-900 border-r border-gray-200 calendar-room-header">
                            Chambres
                        </div>
                        <!-- En-têtes des jours -->
                        <div v-for="day in weekDays" :key="day.date"
                            class="p-2 text-center text-sm border-r border-gray-200 last:border-r-0 calendar-day-header" :class="{
                                'bg-blue-50 text-blue-700 font-medium': isToday(day.date),
                                'text-gray-500': !day.isCurrentMonth,
                                'font-medium': day.isCurrentMonth
                            }">
                            <div>{{ day.dayName }}</div>
                            <div class="text-lg">{{ day.dayNumber }}</div>
                        </div>
                    </div>
                </div>

                <!-- Grille du calendrier -->
                <div class="calendar-content">
                    <div v-for="room in filteredRooms" :key="room.id" class="border-b border-gray-200 last:border-b-0 relative">
                        <div class="calendar-grid">
                            <!-- Colonne chambre -->
                            <div class="p-4 border-r border-gray-200 bg-gray-50 flex items-center calendar-room-cell">
                                <div class="flex items-center space-x-3">
                                    <div class="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                                        <Bed class="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div class="font-medium text-gray-900">Chambre {{ room.number }}</div>
                                        <div class="text-xs text-gray-500">{{ getRoomTypeName(room.type) }}</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Colonnes des jours -->
                            <div v-for="day in weekDays" :key="`${room.id}-${day.date}`"
                                class="relative h-16 border-r border-gray-200 last:border-r-0 calendar-day-cell" :class="{
                                    'bg-blue-25': isToday(day.date),
                                    'bg-gray-50': !day.isCurrentMonth
                                }">
                            </div>
                        </div>
                        
                        <!-- Locations positionnées au-dessus de la grille -->
                        <div v-for="location in getRoomLocations(room.id)" :key="location.id"
                             class="absolute rounded cursor-pointer transition-all duration-200 hover:shadow-md z-10"
                             :class="getLocationStyle(location)"
                             :style="getLocationAbsoluteStyle(location, room.id)"
                             @mouseenter="showTooltip($event, location)"
                             @mouseleave="hideTooltip">
                            <div class="p-1 h-full flex flex-col justify-center text-center">
                                <div class="text-xs font-medium text-white truncate">
                                    {{ getClientName(location.guest) }}
                                </div>
                                <!-- Afficher l'heure et la durée -->
                                <div class="text-xs text-white opacity-80">
                                    {{ getLocationTimeAndDuration(location) }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Légende -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-sm font-medium text-gray-900 mb-4">Légende des statuts</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="flex items-center space-x-2">
                    <div class="w-4 h-4 bg-blue-500 rounded"></div>
                    <span class="text-sm text-gray-700">Confirmée</span>
                </div>
                <div class="flex items-center space-x-2">
                    <div class="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span class="text-sm text-gray-700">En attente</span>
                </div>
                <div class="flex items-center space-x-2">
                    <div class="w-4 h-4 bg-green-500 rounded"></div>
                    <span class="text-sm text-gray-700">Arrivée</span>
                </div>
                <div class="flex items-center space-x-2">
                    <div class="w-4 h-4 bg-purple-500 rounded"></div>
                    <span class="text-sm text-gray-700">Départ</span>
                </div>
            </div>
        </div>

        <!-- Tooltip -->
        <div v-if="tooltip.show" ref="tooltipRef"
            class="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-64"
            :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }">
            <div v-if="tooltip.location" class="space-y-2">
                <div class="flex items-center justify-between">
                    <h4 class="font-semibold text-gray-900">{{ getClientName(tooltip.location.guest) }}</h4>
                    <span :class="getStatusBadgeClass(tooltip.location.status)"
                        class="px-2 py-1 rounded-full text-xs font-medium">
                        {{ getStatusLabel(tooltip.location.status) }}
                    </span>
                </div>

                <div class="space-y-1 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Chambre:</span>
                        <span class="font-medium">{{ getRoomNumber(tooltip.location.room) }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Arrivée:</span>
                        <span class="font-medium">{{ formatDate(tooltip.location.checkIn_date || tooltip.location.checkIn) }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Départ:</span>
                        <span class="font-medium">{{ formatDate(tooltip.location.checkOut_date || tooltip.location.checkOut) }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Durée:</span>
                        <span class="font-medium">{{ calculateNights(tooltip.location) }} nuit(s)</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Prix total:</span>
                        <span class="font-medium text-green-600">{{ formatCurrency(tooltip.location.price) }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Adultes:</span>
                        <span class="font-medium">{{ tooltip.location.adults || 1 }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Enfants:</span>
                        <span class="font-medium">{{ tooltip.location.children || 0 }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
    Calendar, ChevronLeft, ChevronRight, TrendingUp, DollarSign, Users, Search, Bed
} from 'lucide-vue-next'
import { locationsAPI, roomsAPI, roomTypesAPI, clientsAPI } from '../services/api.js'

// État
const currentDate = ref(new Date())
const locations = ref([])
const rooms = ref([])
const roomTypes = ref([])
const clients = ref([])
const isLoading = ref(false)
const roomSearchQuery = ref('')

// Tooltip
const tooltip = ref({
    show: false,
    x: 0,
    y: 0,
    location: null
})

// Computed - Dates de la semaine (7 jours)
const weekDays = computed(() => {
    const startOfWeek = getStartOfWeek(currentDate.value)
    const days = []

    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek)
        date.setDate(startOfWeek.getDate() + i)
        
        const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' })
        const isCurrentMonth = date.getMonth() === new Date().getMonth()

        days.push({
            date: date.toISOString().split('T')[0],
            dayNumber: date.getDate(),
            dayName: dayName.charAt(0).toUpperCase() + dayName.slice(1),
            fullDate: date,
            isCurrentMonth
        })
    }

    return days
})

const daysInWeek = computed(() => 7) // Toujours 7 jours

// Helper pour obtenir le début de la semaine (lundi)
const getStartOfWeek = (date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Lundi comme premier jour
    return new Date(d.setDate(diff))
}

// Computed - Période de la semaine affichée
const weekPeriod = computed(() => {
    const startDate = weekDays.value[0]?.fullDate
    const endDate = weekDays.value[6]?.fullDate
    
    if (!startDate || !endDate) return ''
    
    const startMonth = startDate.toLocaleDateString('fr-FR', { month: 'long' })
    const endMonth = endDate.toLocaleDateString('fr-FR', { month: 'long' })
    const year = startDate.getFullYear()
    
    if (startMonth === endMonth) {
        return `${startDate.getDate()} - ${endDate.getDate()} ${startMonth} ${year}`
    } else {
        return `${startDate.getDate()} ${startMonth} - ${endDate.getDate()} ${endMonth} ${year}`
    }
})

// Computed - Statistiques de la semaine
const weekStats = computed(() => {
    const weekStart = weekDays.value[0]?.date
    const weekEnd = weekDays.value[6]?.date
    
    if (!weekStart || !weekEnd) {
        return {
            totalLocations: 0,
            totalRevenue: 0,
            uniqueClients: 0,
            occupancyRate: 0
        }
    }

    const weekLocations = locations.value.filter(location => {
        // CORRECTION: supporter les deux formats de champs de dates
        const checkInField = location.checkIn_date || location.checkIn
        const checkOutField = location.checkOut_date || location.checkOut
        
        if (!checkInField || !checkOutField) return false
        
        try {
            let checkInDate, checkOutDate
            
            // Gérer les formats avec ou sans 'T' (ISO ou date simple)
            if (checkInField.includes('T')) {
                checkInDate = new Date(checkInField.split('T')[0])
            } else {
                checkInDate = new Date(checkInField)
            }
            
            if (checkOutField.includes('T')) {
                checkOutDate = new Date(checkOutField.split('T')[0])
            } else {
                checkOutDate = new Date(checkOutField)
            }
            
            if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) return false
            
            const checkInStr = checkInDate.toISOString().split('T')[0]
            const checkOutStr = checkOutDate.toISOString().split('T')[0]
            
            // Location active pendant cette semaine si :
            // - Elle commence avant/pendant la semaine ET finit après/pendant la semaine
            // - Il y a chevauchement entre [checkIn, checkOut] et [weekStart, weekEnd]
            return checkInStr <= weekEnd && checkOutStr >= weekStart
        } catch (error) {
            console.warn('⚠️ Erreur lors du filtrage des locations par semaine:', location.id, error)
            return false
        }
    })

    const totalRevenue = weekLocations.reduce((sum, location) => sum + (location.price || 0), 0)
    const uniqueClients = new Set(weekLocations.map(location => location.guest)).size

    // Calcul taux d'occupation pour la semaine
    const totalPossibleNights = rooms.value.length * 7
    const occupiedNights = weekLocations.reduce((sum, location) => {
        return sum + calculateNights(location)
    }, 0)
    const occupancyRate = totalPossibleNights > 0 ? Math.round((occupiedNights / totalPossibleNights) * 100) : 0

    return {
        totalLocations: weekLocations.length,
        totalRevenue,
        uniqueClients,
        occupancyRate
    }
})

// Méthodes utilitaires
const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('fr-FR')
}

const formatCurrency = (amount) => {
    if (!amount) return '0 FCFA'
    return new Intl.NumberFormat('fr-CI', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0
    }).format(amount)
}

const isToday = (dateString) => {
    const today = new Date().toISOString().split('T')[0]
    return dateString === today
}

const calculateNights = (location) => {
    if (!location) return 0
    
    // CORRECTION: supporter les deux formats de champs de dates
    const checkInField = location.checkIn_date || location.checkIn
    const checkOutField = location.checkOut_date || location.checkOut
    
    if (!checkInField || !checkOutField) return 0
    
    try {
        let checkInDate, checkOutDate
        
        // Gérer les formats avec ou sans 'T' (ISO ou date simple)
        if (checkInField.includes('T')) {
            checkInDate = new Date(checkInField.split('T')[0])
        } else {
            checkInDate = new Date(checkInField)
        }
        
        if (checkOutField.includes('T')) {
            checkOutDate = new Date(checkOutField.split('T')[0])
        } else {
            checkOutDate = new Date(checkOutField)
        }
        
        // Vérifier que les dates sont valides
        if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
            console.warn('⚠️ Dates invalides pour le calcul des nuits:', location.id)
            return 0
        }
        
        const diffTime = Math.abs(checkOutDate - checkInDate)
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    } catch (error) {
        console.warn('⚠️ Erreur lors du calcul des nuits pour la location:', location.id, error)
        return 0
    }
}

// Méthodes pour les données
const getClientName = (clientId) => {
    const client = clients.value.find(c => c.id === clientId)
    return client ? `${client.name || ''} ${client.firstname || ''}`.trim() : 'Client inconnu'
}

const getRoomNumber = (roomId) => {
    const room = rooms.value.find(r => r.id === roomId)
    return room ? room.number : 'N/A'
}

const getRoomTypeName = (typeId) => {
    const type = roomTypes.value.find(t => t.id === typeId)
    return type ? type.name : 'Type inconnu'
}

const getStatusLabel = (status) => {
    const labels = {
        'pj': 'En attente',
        'dj': 'Confirmée',
        'dt': 'Arrivée',
        'dp': 'Départ',
        'archive': 'Annulée'
    }
    return labels[status] || status
}

const getStatusBadgeClass = (status) => {
    const classes = {
        'pj': 'bg-yellow-100 text-yellow-800',
        'dj': 'bg-blue-100 text-blue-800',
        'dt': 'bg-green-100 text-green-800',
        'dp': 'bg-purple-100 text-purple-800',
        'archive': 'bg-gray-100 text-gray-800'
    }
    return classes[status] || 'bg-gray-100 text-gray-800'
}

const getLocationStyle = (location) => {
    const statusColors = {
        'pj': 'bg-yellow-500',
        'dj': 'bg-blue-500',
        'dt': 'bg-green-500',
        'dp': 'bg-purple-500',
        'archive': 'bg-gray-400'
    }
    return statusColors[location.status] || 'bg-gray-400'
}

// Méthodes de navigation
const goToPreviousWeek = () => {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), currentDate.value.getDate() - 7)
}

const goToNextWeek = () => {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), currentDate.value.getDate() + 7)
}

const goToToday = () => {
    currentDate.value = new Date()
}

// Méthodes pour les locations
const getLocationsForDay = (roomId, dateString) => {
    // Log de débogage de la recherche
    console.log(`🔍 Recherche locations pour chambre ${roomId} le ${dateString}`)
    
    const results = locations.value.filter(location => {
        if (location.room !== roomId) return false

        // Vérifier que les dates existent et sont valides
        const checkInField = location.checkIn_date || location.checkIn
        const checkOutField = location.checkOut_date || location.checkOut
        
        if (!checkInField || !checkOutField) {
            return false
        }

        try {
            let checkInDate, checkOutDate
            
            // Gérer les formats avec ou sans 'T' (ISO ou date simple)
            if (checkInField.includes('T')) {
                checkInDate = new Date(checkInField.split('T')[0])
            } else {
                checkInDate = new Date(checkInField)
            }
            
            if (checkOutField.includes('T')) {
                checkOutDate = new Date(checkOutField.split('T')[0])
            } else {
                checkOutDate = new Date(checkOutField)
            }
            
            // Vérifier que les dates sont valides
            if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
                console.warn('⚠️ Dates invalides pour la location:', location.id, {
                    checkIn: checkInField,
                    checkOut: checkOutField
                })
                return false
            }

            const checkIn = checkInDate.toISOString().split('T')[0]
            const checkOut = checkOutDate.toISOString().split('T')[0]

            // CORRECTION: Une location s'affiche INCLUANT le jour de checkout
            // Si checkOut = "2024-01-11", la location doit s'afficher aussi le 11
            const isActive = dateString >= checkIn && dateString <= checkOut
            
            // Log de débogage pour les locations en cours
            if (isActive) {
                console.log('🏨 Location active trouvée:', {
                    locationId: location.id,
                    roomId: location.room,
                    date: dateString,
                    checkIn: checkIn,
                    checkOut: checkOut,
                    status: location.status,
                    originalData: { checkInField, checkOutField },
                    clientName: getClientName(location.guest)
                })
            }

            return isActive
        } catch (error) {
            console.warn('⚠️ Erreur lors du traitement des dates pour la location:', location.id, error)
            return false
        }
    })
    
    console.log(`🎯 Résultat pour chambre ${roomId} le ${dateString}:`, results.length, 'location(s) trouvée(s)')
    return results
}

// Nouvelle fonction pour calculer la largeur et position des locations
const getLocationSpanStyle = (location, roomId, startDate) => {
    if (!location) return {}

    const checkInField = location.checkIn_date || location.checkIn
    const checkOutField = location.checkOut_date || location.checkOut
    
    if (!checkInField || !checkOutField) return {}

    try {
        let checkInDate, checkOutDate
        
        if (checkInField.includes('T')) {
            checkInDate = new Date(checkInField.split('T')[0])
        } else {
            checkInDate = new Date(checkInField)
        }
        
        if (checkOutField.includes('T')) {
            checkOutDate = new Date(checkOutField.split('T')[0])
        } else {
            checkOutDate = new Date(checkOutField)
        }
        
        if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) return {}

        const checkIn = checkInDate.toISOString().split('T')[0]
        const checkOut = checkOutDate.toISOString().split('T')[0]
        
        // Calculer les limites de la semaine visible
        const weekStart = weekDays.value[0]?.date
        const weekEnd = weekDays.value[6]?.date
        
        if (!weekStart || !weekEnd) return {}
        
        // Déterminer le début et la fin de la location dans la semaine visible
        const locationStart = checkIn >= weekStart ? checkIn : weekStart
        const locationEnd = checkOut <= weekEnd ? checkOut : weekEnd
        
        // Calculer la position et la largeur
        const startIndex = weekDays.value.findIndex(day => day.date === locationStart)
        const endIndex = weekDays.value.findIndex(day => day.date === locationEnd)
        
        if (startIndex === -1) return {}
        
        // Si la location ne se termine pas dans la semaine, prendre la fin de la semaine
        const actualEndIndex = endIndex === -1 ? 6 : endIndex
        const spanDays = actualEndIndex - startIndex + 1
        
        // Calculer le pourcentage de largeur (chaque jour = 1/7 de l'espace disponible)
        const dayWidthPercent = 100 / 7
        const widthPercent = dayWidthPercent * spanDays
        
        console.log('🎯 Location span:', {
            locationId: location.id,
            checkIn,
            checkOut,
            locationStart,
            locationEnd,
            startIndex,
            actualEndIndex,
            spanDays,
            widthPercent
        })
        
        return {
            width: `${widthPercent}%`,
            position: 'relative',
            zIndex: '10'
        }
    } catch (error) {
        console.warn('⚠️ Erreur lors du calcul du span:', location.id, error)
        return {}
    }
}

// Méthodes de chargement des données
const loadData = async () => {
    try {
        isLoading.value = true
        console.log('🔄 Début chargement des données Calendar...')
        
        // Appels API individuels avec gestion d'erreur séparée
        const results = await Promise.allSettled([
            locationsAPI.getLocations(),
            roomsAPI.getRooms(),
            roomTypesAPI.getRoomTypes(),
            clientsAPI.getClients()
        ])
        
        // Traitement des résultats
        const [locationsResult, roomsResult, roomTypesResult, clientsResult] = results
        
        if (locationsResult.status === 'fulfilled') {
            locations.value = locationsResult.value || []
            console.log('✅ Locations chargées:', locations.value.length)
        } else {
            console.error('❌ Erreur chargement locations:', locationsResult.reason)
            locations.value = []
        }
        
        if (roomsResult.status === 'fulfilled') {
            rooms.value = roomsResult.value || []
            console.log('✅ Chambres chargées:', rooms.value.length)
        } else {
            console.error('❌ Erreur chargement chambres:', roomsResult.reason)
            rooms.value = []
        }
        
        if (roomTypesResult.status === 'fulfilled') {
            roomTypes.value = roomTypesResult.value || []
            console.log('✅ Types chambres chargées:', roomTypes.value.length)
        } else {
            console.error('❌ Erreur chargement types chambres:', roomTypesResult.reason)
            roomTypes.value = []
        }
        
        if (clientsResult.status === 'fulfilled') {
            clients.value = clientsResult.value || []
            console.log('✅ Clients chargés:', clients.value.length)
        } else {
            console.error('❌ Erreur chargement clients:', clientsResult.reason)
            clients.value = []
        }
        
        console.log('✅ Chargement Calendar terminé')
        
        // Debug : afficher les dates de la semaine courante
        console.log('📅 Semaine courante:', {
            debut: weekDays.value[0]?.date,
            fin: weekDays.value[6]?.date,
            jours: weekDays.value.map(d => d.date)
        })
        
        // Debug : afficher TOUTES les locations pour vérification
        console.log('📋 TOUTES les locations chargées:')
        locations.value.forEach((loc, index) => {
            const checkInField = loc.checkIn_date || loc.checkIn
            const checkOutField = loc.checkOut_date || loc.checkOut
            console.log(`  ${index + 1}. Location ${loc.id}:`, {
                room: loc.room,
                guest: loc.guest,
                checkIn: checkInField,
                checkOut: checkOutField,
                status: loc.status,
                clientName: getClientName(loc.guest),
                roomNumber: getRoomNumber(loc.room)
            })
        })
        
    } catch (error) {
        console.error('❌ Erreur générale lors du chargement des données Calendar:', error)
        // Initialiser les valeurs par défaut même en cas d'erreur
        locations.value = []
        rooms.value = []
        roomTypes.value = []
        clients.value = []
    } finally {
        isLoading.value = false
        console.log('🔄 Loader Calendar désactivé')
    }
}

// Chargement initial
onMounted(async () => {
    // Timeout de sécurité pour éviter un loader infini
    const loadingTimeout = setTimeout(() => {
        if (isLoading.value) {
            console.warn('⚠️ Timeout - Arrêt forcé du loader Calendar')
            isLoading.value = false
        }
    }, 30000) // 30 secondes maximum
    
    try {
        await loadData()
    } finally {
        clearTimeout(loadingTimeout)
    }
})

// Fonction pour recharger les données manuellement
const refreshData = async () => {
    await loadData()
}

// Méthodes pour le filtrage
const filteredRooms = computed(() => {
    if (!roomSearchQuery.value || !rooms.value.length) return rooms.value
    
    const query = roomSearchQuery.value.toLowerCase()
    return rooms.value.filter(room => {
        // Recherche par numéro de chambre
        const matchesNumber = room.number.toLowerCase().includes(query)
        
        // Recherche par type de chambre
        const roomType = roomTypes.value.find(type => type.id === room.type)
        const matchesType = roomType ? roomType.name.toLowerCase().includes(query) : false
        
        return matchesNumber || matchesType
    })
})

const clearRoomSearch = () => {
    roomSearchQuery.value = ''
}

// Nouvelle fonction pour obtenir la location qui COMMENCE ce jour (s'étend sur plusieurs jours)
const getLocationForDay = (roomId, dateString) => {
    // Trouve la location qui COMMENCE ce jour-là pour cette chambre
    const location = locations.value.find(location => {
        if (location.room !== roomId) return false

        const checkInField = location.checkIn_date || location.checkIn
        if (!checkInField) return false

        try {
            let checkInDate
            if (checkInField.includes('T')) {
                checkInDate = new Date(checkInField.split('T')[0])
            } else {
                checkInDate = new Date(checkInField)
            }
            
            if (isNaN(checkInDate.getTime())) return false

            const checkIn = checkInDate.toISOString().split('T')[0]
            
            // Retourner true seulement si c'est le PREMIER jour de la location
            return dateString === checkIn
        } catch (error) {
            return false
        }
    })
    
    return location
}

// Nouvelle fonction pour obtenir l'heure et la durée d'une location
const getLocationTimeAndDuration = (location) => {
    if (!location) return ''
    
    // CORRECTION: supporter les deux formats de champs de dates
    const checkInField = location.checkIn_date || location.checkIn
    const checkOutField = location.checkOut_date || location.checkOut
    
    if (!checkInField || !checkOutField) return ''
    
    try {
        let checkInDate, checkOutDate
        
        // Parser les dates complètes (avec ou sans heure)
        if (checkInField.includes('T')) {
            checkInDate = new Date(checkInField)
        } else {
            checkInDate = new Date(checkInField + 'T00:00:00')
        }
        
        if (checkOutField.includes('T')) {
            checkOutDate = new Date(checkOutField)
        } else {
            checkOutDate = new Date(checkOutField + 'T00:00:00')
        }
        
        if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
            return ''
        }
        
        // Formater les dates au format français DD/MM/YYYY
        const formatDate = (date) => {
            return date.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            })
        }
        
        // Formater les heures au format Hh (ex: 12h, 09h)
        const formatTime = (date) => {
            const hours = date.getHours()
            return `${hours.toString().padStart(2, '0')}h`
        }
        
        const checkInDateStr = formatDate(checkInDate)
        const checkInTimeStr = formatTime(checkInDate)
        const checkOutDateStr = formatDate(checkOutDate)
        const checkOutTimeStr = formatTime(checkOutDate)
        
        // Retourner au format demandé : "du 10/06/2025 à 12h au 11/06/2025 à 13h"
        return `du ${checkInDateStr} à ${checkInTimeStr} au ${checkOutDateStr} à ${checkOutTimeStr}`
        
    } catch (error) {
        console.warn('⚠️ Erreur lors du formatage des dates et heures:', location.id, error)
        return ''
    }
}

// Méthodes pour le tooltip
const showTooltip = (event, location) => {
    tooltip.value.show = true
    tooltip.value.x = event.clientX
    tooltip.value.y = event.clientY
    tooltip.value.location = location
}

const hideTooltip = () => {
    tooltip.value.show = false
    tooltip.value.location = null
}

// Nouvelle fonction pour obtenir toutes les locations d'une chambre qui sont visibles cette semaine
const getRoomLocations = (roomId) => {
    const weekStart = weekDays.value[0]?.date
    const weekEnd = weekDays.value[6]?.date
    
    if (!weekStart || !weekEnd) return []
    
    return locations.value.filter(location => {
        if (location.room !== roomId) return false

        const checkInField = location.checkIn_date || location.checkIn
        const checkOutField = location.checkOut_date || location.checkOut
        
        if (!checkInField || !checkOutField) return false

        try {
            let checkInDate, checkOutDate
            
            if (checkInField.includes('T')) {
                checkInDate = new Date(checkInField.split('T')[0])
            } else {
                checkInDate = new Date(checkInField)
            }
            
            if (checkOutField.includes('T')) {
                checkOutDate = new Date(checkOutField.split('T')[0])
            } else {
                checkOutDate = new Date(checkOutField)
            }
            
            if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) return false

            const checkIn = checkInDate.toISOString().split('T')[0]
            const checkOut = checkOutDate.toISOString().split('T')[0]
            
            // Location visible si elle chevauche avec la semaine
            return checkIn <= weekEnd && checkOut >= weekStart
        } catch (error) {
            return false
        }
    })
}

// Nouvelle fonction pour calculer le style absolu des locations
const getLocationAbsoluteStyle = (location, roomId) => {
    if (!location) return {}

    const checkInField = location.checkIn_date || location.checkIn
    const checkOutField = location.checkOut_date || location.checkOut
    
    if (!checkInField || !checkOutField) return {}

    try {
        let checkInDate, checkOutDate
        
        if (checkInField.includes('T')) {
            checkInDate = new Date(checkInField.split('T')[0])
        } else {
            checkInDate = new Date(checkInField)
        }
        
        if (checkOutField.includes('T')) {
            checkOutDate = new Date(checkOutField.split('T')[0])
        } else {
            checkOutDate = new Date(checkOutField)
        }
        
        if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) return {}

        const checkIn = checkInDate.toISOString().split('T')[0]
        const checkOut = checkOutDate.toISOString().split('T')[0]
        
        // Calculer les limites de la semaine visible
        const weekStart = weekDays.value[0]?.date
        const weekEnd = weekDays.value[6]?.date
        
        if (!weekStart || !weekEnd) return {}
        
        // Déterminer le début et la fin de la location dans la semaine visible
        const locationStart = checkIn >= weekStart ? checkIn : weekStart
        const locationEnd = checkOut <= weekEnd ? checkOut : weekEnd
        
        // Calculer les index des jours
        const startIndex = weekDays.value.findIndex(day => day.date === locationStart)
        const endIndex = weekDays.value.findIndex(day => day.date === locationEnd)
        
        if (startIndex === -1) return {}
        
        const actualEndIndex = endIndex === -1 ? 6 : endIndex
        const spanDays = actualEndIndex - startIndex + 1
        
        // Calculer la position et la largeur
        // La colonne des chambres prend 200px, le reste est divisé en 7 jours
        const roomColumnWidth = 200 // 200px pour la colonne des chambres
        const dayWidth = `calc((100% - 200px) / 7)` // Largeur d'un jour
        
        // Position left : après la colonne chambre + (index * largeur d'un jour)
        const leftPosition = `calc(200px + (100% - 200px) * ${startIndex} / 7)`
        
        // Largeur : nombre de jours * largeur d'un jour
        const width = `calc((100% - 200px) * ${spanDays} / 7)`
        
        console.log('🎯 Location absolue:', {
            locationId: location.id,
            roomId,
            checkIn,
            checkOut,
            locationStart,
            locationEnd,
            startIndex,
            actualEndIndex,
            spanDays,
            leftPosition,
            width
        })
        
        return {
            left: leftPosition,
            width: width,
            top: '4px',
            height: 'calc(100% - 8px)', // 4px padding top et bottom
            zIndex: '10'
        }
    } catch (error) {
        console.warn('⚠️ Erreur lors du calcul du style absolu:', location.id, error)
        return {}
    }
}
</script>

<style scoped>
.bg-blue-25 {
    background-color: rgba(59, 130, 246, 0.05);
}

.calendar-container {
    position: relative;
    width: 100%;
}

.calendar-header {
    background-color: #f9fafb; /* bg-gray-50 */
}

.calendar-content {
    position: relative;
}

.calendar-grid {
    display: grid;
    grid-template-columns: 200px repeat(7, 1fr);
    width: 100%;
}

.calendar-room-header,
.calendar-room-cell {
    min-width: 200px;
    max-width: 200px;
    border-right: 1px solid #e5e7eb;
}

.calendar-day-header,
.calendar-day-cell {
    min-width: 0;
    border-right: 1px solid #e5e7eb;
}

.calendar-day-header:last-child,
.calendar-day-cell:last-child {
    border-right: none;
}

.calendar-day-cell {
    position: relative;
    height: 4rem; /* 64px - h-16 */
}

/* S'assurer que tous les contenus respectent les limites de la grille */
.calendar-grid > * {
    overflow: hidden;
}
</style>